'use client';
import { Dialog, Button, Text, Box, CloseButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import shortenGold from '../utils/shortenGold';
import { useStore } from '@/lib/store-context';
import { SimulationContent } from './simulation-content';
import { useEffect, useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { encodeShareState } from '@/utils/share';

export const MwSimulationModal = observer(() => {
 const store = useStore();
 const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

 useEffect(() => {
  if (copyState !== 'copied') {
   return;
  }

  const timeoutId = window.setTimeout(() => setCopyState('idle'), 2000);
  return () => window.clearTimeout(timeoutId);
 }, [copyState]);

 const shareValue = encodeShareState(store);
 const isCopyDisabled = !shareValue;
 const buttonLabel = copyState === 'copied' ? 'Skopiowano' : 'Skopiuj link';

 const copyShareLink = async (text: string) => {
  if (navigator.clipboard?.writeText) {
   try {
    await navigator.clipboard.writeText(text);
    return true;
   } catch {
    // fall back to execCommand below
    console.error('Failed to copy to clipboard');
   }
  }

  try {
   const textarea = document.createElement('textarea');
   textarea.value = text;
   textarea.style.position = 'fixed';
   textarea.style.opacity = '0';
   textarea.style.pointerEvents = 'none';
   document.body.appendChild(textarea);
   textarea.focus();
   textarea.select();
   const successful = document.execCommand('copy');
   document.body.removeChild(textarea);
   return successful;
  } catch {
   return false;
  }
 };

 const handleCopy = async () => {
  if (!shareValue) {
   return;
  }

  const url = new URL(`${window.location.origin}${window.location.pathname}`);
  url.searchParams.set('share', shareValue);
  const shareUrl = url.toString();

  const copied = await copyShareLink(shareUrl);
  if (copied) {
   setCopyState('copied');
  }
 };

 return (
  <Dialog.Root
   open={store.isMwSimulationModalOpen}
   onOpenChange={(d) => !d.open && store.closeMwSimulationModal()}
   size="lg"
  >
   <Dialog.Backdrop />
   <Dialog.Positioner>
    <Dialog.Content>
     <Dialog.CloseTrigger asChild>
      <CloseButton size="md" />
     </Dialog.CloseTrigger>
     <Dialog.Header>
      <Dialog.Title fontSize="xl">Symulacja MW</Dialog.Title>
     </Dialog.Header>
     <Dialog.Body>
      <Text fontWeight={700} fontSize="md">
       Wydane złoto: {shortenGold(store.mwTotalGold)}
      </Text>
      <Text fontWeight={700} fontSize="md">
       Wydane SŁ: {store.mwTotalCurrency}
      </Text>

      {store.simulation && <SimulationContent simulation={store.simulation} />}
     </Dialog.Body>

     <Dialog.Footer display="flex" justifyContent="flex-end" pt="4">
      <Button
       size="sm"
       variant="outline"
       onClick={handleCopy}
       gap="2"
       disabled={isCopyDisabled}
      >
       {copyState === 'copied' ? <FiCheck /> : <FiCopy />}
       {buttonLabel}
      </Button>
     </Dialog.Footer>

     <Dialog.CloseTrigger />
    </Dialog.Content>
   </Dialog.Positioner>
  </Dialog.Root>
 );
});
