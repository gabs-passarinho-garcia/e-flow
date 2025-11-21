/**
 * Type declarations for @testing-library/jest-dom matchers
 */
import '@testing-library/jest-dom';

declare module 'bun:test' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string | RegExp): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveClass(...classNames: string[]): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeRequired(): R;
    toHaveValue(value: string | number | string[]): R;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveFocus(): R;
    toBeInvalid(): R;
    toBeValid(): R;
    toContainElement(element: HTMLElement | null): R;
    toContainHTML(html: string): R;
    toHaveAccessibleDescription(expectedDescription?: string | RegExp): R;
    toHaveAccessibleName(expectedName?: string | RegExp): R;
    toHaveDescription(expectedDescription?: string | RegExp): R;
    toHaveErrorMessage(message?: string | RegExp): R;
    toHaveFormValues(expectedValues: Record<string, unknown>): R;
    toHaveStyle(css: string | Record<string, unknown>): R;
    toBeEmptyDOMElement(): R;
  }
}

