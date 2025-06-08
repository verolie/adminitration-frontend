// utils/numberFormat.ts

/**
 * Format a number string with dot for thousands and comma for decimal.
 * @param value - The numeric string or number to format.
 * @returns Formatted string like "1.234,56"
 */
export const formatRupiah = (value: number | string): string => {
    const number = typeof value === "string" 
        ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
        : value;
    
    if (isNaN(number)) return "0";
    
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

/**
 * Parse a formatted number string back to a number.
 * @param str - The formatted string (e.g., "1.234,56")
 * @returns The parsed number
 */
export const parseInputNumber = (str: any) => {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const cleanStr = String(str).replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanStr);
};

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

/**
 * Format input number ke format rupiah tanpa otomatis ,00 jika belum ada koma.
 * @param value - string input user
 * @returns formatted string (misal: 1.000 atau 1.000,5)
 */
export const formatRupiahInput = (value: string): string => {
    if (!value) return "";
    // Hapus semua selain angka dan koma
    let clean = value.replace(/[^\d,]/g, "");
    // Pisahkan ribuan
    let [int, dec] = clean.split(",");
    int = int.replace(/^0+/, "") || "0";
    let intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (dec !== undefined) {
        return intFormatted + "," + dec;
    }
    return intFormatted;
};
