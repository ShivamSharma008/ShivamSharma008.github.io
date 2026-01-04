"""
Resume HTML to PDF Converter
Converts the resume.html file to a professional PDF
"""

import os
import sys
from pathlib import Path

def convert_to_pdf():
    """Convert resume HTML to PDF using browser automation"""

    try:
        # Try using playwright
        from playwright.sync_api import sync_playwright

        current_dir = Path(__file__).parent
        html_file = current_dir / "resume.html"
        pdf_file = current_dir / "Shivam_Sharma_Resume.pdf"

        print(f"HTML file: {html_file}")
        print(f"PDF file: {pdf_file}")
        print("Starting PDF generation...")

        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch()
            page = browser.new_page()

            # Load the HTML file
            html_url = html_file.absolute().as_uri()
            print(f"Loading HTML: {html_url}")
            page.goto(html_url)

            # Wait for page to load
            page.wait_for_load_state('networkidle')

            # Generate PDF with professional settings
            print("Generating PDF...")
            page.pdf(
                path=str(pdf_file),
                format='A4',
                margin={
                    'top': '0.5in',
                    'right': '0.5in',
                    'bottom': '0.5in',
                    'left': '0.5in'
                },
                print_background=True,
                prefer_css_page_size=True
            )

            browser.close()

        print(f"✓ PDF created successfully: {pdf_file}")
        return True

    except ImportError:
        print("Playwright not found. Trying alternative method...")

        try:
            # Try using weasyprint
            from weasyprint import HTML

            current_dir = Path(__file__).parent
            html_file = current_dir / "resume.html"
            pdf_file = current_dir / "Shivam_Sharma_Resume.pdf"

            HTML(filename=str(html_file)).write_pdf(str(pdf_file))

            print(f"✓ PDF created successfully: {pdf_file}")
            return True

        except ImportError:
            print("WeasyPrint not found. Trying pdfkit...")

            try:
                # Try using pdfkit
                import pdfkit

                current_dir = Path(__file__).parent
                html_file = current_dir / "resume.html"
                pdf_file = current_dir / "Shivam_Sharma_Resume.pdf"

                options = {
                    'page-size': 'A4',
                    'margin-top': '0.5in',
                    'margin-right': '0.5in',
                    'margin-bottom': '0.5in',
                    'margin-left': '0.5in',
                    'encoding': 'UTF-8',
                    'enable-local-file-access': None
                }

                pdfkit.from_file(str(html_file), str(pdf_file), options=options)

                print(f"✓ PDF created successfully: {pdf_file}")
                return True

            except Exception as e:
                print(f"Error with pdfkit: {e}")
                print("\nPlease install one of these packages:")
                print("  pip install playwright && playwright install chromium")
                print("  OR")
                print("  pip install weasyprint")
                print("  OR")
                print("  pip install pdfkit (requires wkhtmltopdf)")
                return False

if __name__ == "__main__":
    print("Converting Resume HTML to PDF...")
    print("-" * 50)
    convert_to_pdf()

