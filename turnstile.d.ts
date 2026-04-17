export {};

declare global {
  interface Window {
    turnstileToken?: string;
    onTurnstileSuccess?: (token: string) => void;
    turnstile?: any;
  }
}
