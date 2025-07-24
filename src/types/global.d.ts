export {};

declare global {
  interface Window {
    HSOverlay?: {
      autoInit: () => void;
    };
  }
}
