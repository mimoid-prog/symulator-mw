import React, { useEffect } from 'react';
import Script from 'next/script';

export const TopHoriozntalAd = () => {
 useEffect(() => {
  try {
   //@ts-ignore
   (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
   console.error(err);
  }
 }, []);

 return (
  <>
   <Script
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4826354147584961"
    strategy="afterInteractive"
    crossOrigin="anonymous"
   />
   <ins
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-4826354147584961"
    data-ad-slot="1925291613"
    data-ad-format="auto"
    data-full-width-responsive="true"
   />
  </>
 );
};
