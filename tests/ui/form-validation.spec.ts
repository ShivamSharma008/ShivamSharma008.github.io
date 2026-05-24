/**
 * Form Validation Tests - UI Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: Checkboxes, dropdowns, inputs with data-driven approach
 * Target: https://the-internet.herokuapp.com
 * Cross-browser: Runs on chromium, firefox, webkit via Playwright projects
 */
import { test, expect } from '@playwright/test';
import { FormPage } from '../../src/pages/FormPage';
import { loadCsvData } from '../../src/utils/helpers';

const dropdownData = loadCsvData('form-data.csv');

test.describe('Form Validation Tests', () => {
  let formPage: FormPage;

  test.describe('Checkbox Tests', () => {
    test.beforeEach(async ({ page }) => {
      formPage = new FormPage(page);
      await formPage.gotoCheckboxes();
    });

    test('TC-FORM-001: Should toggle checkbox on', async () => {
      const initialState = await formPage.isCheckboxChecked(0);
      await formPage.toggleCheckbox(0);
      const newState = await formPage.isCheckboxChecked(0);
      expect(newState).not.toBe(initialState);
    });

    test('TC-FORM-002: Should toggle checkbox off', async () => {
      // Checkbox 2 is checked by default
      expect(await formPage.isCheckboxChecked(1)).toBeTruthy();
      await formPage.toggleCheckbox(1);
      expect(await formPage.isCheckboxChecked(1)).toBeFalsy();
    });
  });

  test.describe('Dropdown Tests', () => {
    test.beforeEach(async ({ page }) => {
      formPage = new FormPage(page);
      await formPage.gotoDropdown();
    });

    // Data-driven dropdown tests from CSV
    for (const row of dropdownData) {
      test(`TC-FORM-003: Should select dropdown "${row.expected_text}"`, async () => {
        await formPage.selectDropdownByValue(row.dropdown_value);
        const selectedValue = await formPage.getSelectedDropdownValue();
        expect(selectedValue).toBe(row.dropdown_value);
      });
    }

    test('TC-FORM-004: Should have default empty selection', async () => {
      const value = await formPage.getSelectedDropdownValue();
      expect(value).toBe('');
    });
  });

  test.describe('Input Tests', () => {
    test.beforeEach(async ({ page }) => {
      formPage = new FormPage(page);
      await formPage.gotoInputs();
    });

    test('TC-FORM-005: Should accept numeric input', async () => {
      await formPage.enterNumber('42');
      const value = await formPage.getNumberInputValue();
      expect(value).toBe('42');
    });

    test('TC-FORM-006: Should accept negative numbers', async () => {
      await formPage.enterNumber('-10');
      const value = await formPage.getNumberInputValue();
      expect(value).toBe('-10');
    });
  });
});
