// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_BASE_URL || 'http://127.0.0.1:5000';

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV); 