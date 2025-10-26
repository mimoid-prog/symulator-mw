export {};

declare global {
 interface Window {
  gtag(
   command: 'config',
   targetId: string,
   config?: {
    page_path?: string;
    [key: string]: unknown;
   }
  ): void;
  gtag(
   command: 'event',
   action: string,
   params?: Record<string, unknown>
  ): void;
 }
}
