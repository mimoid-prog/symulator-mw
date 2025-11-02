'use client';

import { useCallback } from 'react';
import { trackEvent, trackClick } from './ga';

export function useTrackEvent(
 action: string,
 baseParams?: Record<string, unknown>
) {
 return useCallback(
  (params?: Record<string, unknown>) =>
   trackEvent(action, { ...(baseParams ?? {}), ...(params ?? {}) }),
  [action, baseParams]
 );
}

export function useGaClick(
 label: string,
 extra?: Record<string, unknown>
): React.MouseEventHandler {
 const send = useCallback(() => trackClick(label, extra), [label, extra]);
 return useCallback<React.MouseEventHandler>(
  (e) => {
   send();
  },
  [send]
 );
}

export function wrapOnClickWithGa<E extends React.MouseEvent<any, MouseEvent>>(
 onClick: ((event: E) => void) | undefined,
 label: string,
 extra?: Record<string, unknown>
) {
 return (e: E) => {
  trackClick(label, extra);
  if (onClick) onClick(e);
 };
}
