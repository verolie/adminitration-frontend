// utils/numberFormat.ts

/**
 * Format a number string with comma for thousands and dot for decimal.
 * @param value - The numeric string to format.
 * @returns Formatted string like "1,234.56"
 */
export const formatNumber = (value: string): string => {
    const cleaned = value.replace(/,/g, '');
    const number = parseFloat(cleaned);
    if (isNaN(number) || cleaned.endsWith('.')) return value; // preserve input in progress
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
};

/**
 * Remove formatting (commas) from a formatted number string.
 * @param formattedValue - e.g., "1,234.56"
 * @returns Raw number string, e.g., "1234.56"
 */
export const unformatNumber = (formattedValue: string): string => {
    return formattedValue.replace(/,/g, '');
};

/**
 * Check if a string is a valid numeric input (integer or decimal).
 * @param value - The input string.
 * @returns true if valid numeric input.
 */
export const isNumericInput = (value: string): boolean => {
    return /^(\d+|\d*\.\d*|\.)$/.test(value);
};
