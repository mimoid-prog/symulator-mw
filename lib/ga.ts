// log the pageview with their URL
export const pageview = (url: string) => {
  if (
    typeof window === 'undefined' ||
    typeof window.gtag !== 'function' ||
    !process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
  ) {
    return;
  }
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({
 action,
 params,
}: {
 action: string;
 params: Record<string, unknown>;
}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', action, params);
};

export type GaEventParams = {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

export const trackEvent = (action: string, params?: GaEventParams) =>
  event({ action, params: params ?? {} });

export const trackClick = (label: string, extra?: Record<string, unknown>) =>
  trackEvent('click', { label, ...(extra ?? {}) });
