'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { decodeShareState } from '@/utils/share';

export const ShareHydrator = () => {
 const searchParams = useSearchParams();
 const shareParam = searchParams?.get('s');
 const appliedShareRef = useRef<string | null>(null);
 const store = useStore();

 useEffect(() => {
  if (!shareParam) {
   return;
  }

  if (appliedShareRef.current === shareParam) {
   return;
  }

  const decoded = decodeShareState(shareParam);
  if (!decoded) {
   return;
  }

  store.hydrateFromShare(decoded);
  appliedShareRef.current = shareParam;
 }, [shareParam]);

 return null;
};
