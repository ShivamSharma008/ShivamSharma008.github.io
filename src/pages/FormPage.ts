/**
 * FormPage - Page Object for Form interactions (Inputs, Checkboxes, Dropdowns)
 * Author: Shivam Sharma, Senior SDET
 *
 * Target: https://the-internet.herokuapp.com (multiple form pages)
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FormPage extends BasePage {
  // Checkboxes page locators
  readonly checkboxes: Locator;

  // Dropdown page locators
  readonly dropdown: Locator;

  // Inputs page locators
  readonly numberInput: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = page.locator('#checkboxes input[type="checkbox"]');
    this.dropdown = page.locator('#dropdown');
    this.numberInput = page.locator('input[type="number"]');
  }

  /** Navigate to checkboxes page */
  async gotoCheckboxes(): Promise<void> {
    await this.navigate('/checkboxes');
  }

  /** Navigate to dropdown page */
  async gotoDropdown(): Promise<void> {
    await this.navigate('/dropdown');
  }

  /** Navigate to inputs page */
  async gotoInputs(): Promise<void> {
    await this.navigate('/inputs');
  }

  /** Toggle a checkbox by index (0-based) */
  async toggleCheckbox(index: number): Promise<void> {
    await this.checkboxes.nth(index).click();
  }

  /** Check if checkbox is checked by index */
  async isCheckboxChecked(index: number): Promise<boolean> {
    return await this.checkboxes.nth(index).isChecked();
  }

  /** Select dropdown option by value */
  async selectDropdownByValue(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  /** Select dropdown option by visible text */
  async selectDropdownByText(text: string): Promise<void> {
    await this.dropdown.selectOption({ label: text });
  }

  /** Get currently selected dropdown value */
  async getSelectedDropdownValue(): Promise<string> {
    return await this.dropdown.inputValue();
  }

  /** Enter a number in the inputs field */
  async enterNumber(value: string): Promise<void> {
    await this.fillInput(this.numberInput, value);
  }

  /** Get the number input value */
  async getNumberInputValue(): Promise<string> {
    return await this.numberInput.inputValue();
  }
}
