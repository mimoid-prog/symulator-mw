'use client';

import {
 createContext,
 useContext,
 useEffect,
 useState,
 type ReactNode,
} from 'react';
import { createStore, Store } from '@/lib/Store';
import { decodeShareState } from '@/utils/share';
import { useSearchParams } from 'next/navigation';
import { enableStaticRendering } from 'mobx-react-lite';

// SSR support for MobX
enableStaticRendering(typeof window === 'undefined');

type StoreProviderProps = {
 initialSearchParams?: Record<string, string | string[] | undefined> | null;
 children: ReactNode;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({
 initialSearchParams = null,
 children,
}: StoreProviderProps) {
 const searchParams = useSearchParams();

 const [store] = useState(() => {
  const shareParamRaw = initialSearchParams?.['share'];
  const shareParam = Array.isArray(shareParamRaw)
   ? shareParamRaw[0]
   : shareParamRaw ?? null;
  const decoded = shareParam ? decodeShareState(shareParam) : null;
  return createStore(decoded ?? undefined);
 });

 useEffect(() => {
  const currentShare = searchParams?.get('s');
  if (!currentShare) return;
  const decoded = decodeShareState(currentShare);
  if (decoded) {
   store.hydrateFromShare(decoded);
  }
 }, [searchParams, store]);

 return (
  <StoreContext.Provider value={store}>
   {children}
  </StoreContext.Provider>
 );
}

export function useStore(): Store {
 const ctx = useContext(StoreContext);
 if (!ctx) {
  throw new Error('useStore must be used within a StoreProvider');
 }
 return ctx;
}
