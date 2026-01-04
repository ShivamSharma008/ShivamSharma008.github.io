import sys
print("Python version:", sys.version)
print("Starting script...")

from pathlib import Path
from playwright.sync_api import sync_playwright

current_dir = Path(__file__).parent
html_file = current_dir / "resume.html"
pdf_file = current_dir / "Shivam_Sharma_Resume.pdf"

print(f"HTML file: {html_file}")
print(f"HTML exists: {html_file.exists()}")
print(f"PDF file: {pdf_file}")

print("Launching browser...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    html_url = html_file.absolute().as_uri()
    print(f"Loading: {html_url}")
    page.goto(html_url)
    page.wait_for_load_state('networkidle')
    
    print("Generating PDF...")
    page.pdf(
        path=str(pdf_file),
        format='A4',
        margin={'top': '0.5in', 'right': '0.5in', 'bottom': '0.5in', 'left': '0.5in'},
        print_background=True
    )
    
    browser.close()

print(f"PDF created: {pdf_file.exists()}")
print("Done!")

