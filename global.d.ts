// global.d.ts
export {};

declare global {
  interface Window {
    sessionTimer: ReturnType<typeof setTimeout>;
  }
}
