'use client';

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { createStore, Store } from '@/lib/Store';
import { decodeShareState } from '@/utils/share';
import { useSearchParams } from 'next/navigation';

type StoreProviderProps = {
 initialSearchParams?: Record<string, string | string[] | undefined> | null;
 children: ReactNode;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ initialSearchParams = null, children }: StoreProviderProps) {
 const storeRef = useRef<Store | null>(null);
 const searchParams = useSearchParams();

 // Synchronously create and hydrate the store on first render (SSR-safe)
 if (storeRef.current === null) {
  const sParamRaw = initialSearchParams?.['s'];
  const sParam = Array.isArray(sParamRaw) ? sParamRaw[0] : sParamRaw ?? null;
  const decoded = sParam ? decodeShareState(sParam) : null;
  storeRef.current = createStore(decoded ?? undefined);
 }

 // React to client-side URL changes and re-hydrate if needed
 useEffect(() => {
  const currentShare = searchParams?.get('s');
  if (!currentShare) return;
  const decoded = decodeShareState(currentShare);
  if (decoded) {
   storeRef.current?.hydrateFromShare(decoded);
  }
 }, [searchParams]);

 const value = useMemo(() => storeRef.current as Store, []);

 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
 const ctx = useContext(StoreContext);
 if (!ctx) {
  throw new Error('useStore must be used within a StoreProvider');
 }
 return ctx;
}


