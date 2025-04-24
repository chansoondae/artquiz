// /components/GoogleAnalytics.jsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, Suspense } from 'react';

// GA ID를 환경 변수에서 직접 가져옵니다
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// 페이지 추적을 위한 컴포넌트
function AnalyticsTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    // 페이지 경로 변경 시 GA에 통보
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // gtag가 로드된 후 페이지뷰 추적
    const timer = setTimeout(() => {
      if (window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
          page_path: url,
        });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  // GA ID가 없으면 아무것도 렌더링하지 않음
  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
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
        <AnalyticsTracking />
      </Suspense>
    </>
  );
}