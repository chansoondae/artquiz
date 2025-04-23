// /components/GoogleAnalytics.jsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState, Suspense } from 'react';
import { pageview, GA_TRACKING_ID } from './../../lib/gtag';

// Create a separate component for the part that uses useSearchParams
function GoogleAnalyticsTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isGtagLoaded, setIsGtagLoaded] = useState(false);

  // Set window.gtag loaded status from parent component
  useEffect(() => {
    const handleGtagLoaded = () => {
      setIsGtagLoaded(true);
    };
    
    window.addEventListener('gtag-loaded', handleGtagLoaded);
    
    // Check if gtag is already loaded
    if (window.gtag) {
      setIsGtagLoaded(true);
    }
    
    return () => {
      window.removeEventListener('gtag-loaded', handleGtagLoaded);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (!GA_TRACKING_ID || !isGtagLoaded) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams, isGtagLoaded]);

  return null;
}

// Main component that handles script loading
export default function GoogleAnalytics() {
  // Only render GA script tags in production
  if (typeof window !== 'undefined' && 
      (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID)) {
    return null;
  }

  const handleScriptLoad = () => {
    // Create and dispatch custom event for script loaded
    const event = new Event('gtag-loaded');
    window.dispatchEvent(event);
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={handleScriptLoad}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
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
      <Suspense fallback={null}>
        <GoogleAnalyticsTracking />
      </Suspense>
    </>
  );
}
