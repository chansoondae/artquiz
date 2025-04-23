// /components/GoogleAnalytics.jsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { pageview, GA_TRACKING_ID } from './../../lib/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isGtagLoaded, setIsGtagLoaded] = useState(false);

  useEffect(() => {
    if (!GA_TRACKING_ID || !isGtagLoaded) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams, isGtagLoaded]);

  // Only render GA script tags in production
  if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          console.log("Google Analytics script loaded");
          setIsGtagLoaded(true);
        }}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google Analytics initialization complete");
        }}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
