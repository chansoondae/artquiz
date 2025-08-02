// app/component/BottomNav.js
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Bottomnav.module.css';

export default function BottomNav() {
  const pathname = usePathname();
  
  // Check active path
  const isBasicActive = pathname === '/';
  const isAdvancedActive = pathname === '/quiz/high';
  const isPersonalityActive = pathname === '/personality' || pathname.startsWith('/personality/');
  const isImageGeneratorActive = pathname === '/image' || pathname.startsWith('/image/');
  
  return (
    <div className={styles.navContainer}>
      <div className={styles.navWrapper}>
        <Link 
          href="/"
          className={`${styles.navItem} ${isBasicActive ? styles.activeBasic : ''}`}
        >
          <svg 
            className={styles.navIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
          <span className={styles.navText}>중급</span>
        </Link>
        
        <div className={styles.navDivider}></div>
        
        <Link 
          href="/quiz/high"
          className={`${styles.navItem} ${isAdvancedActive ? styles.activeAdvanced : ''}`}
        >
          <svg 
            className={styles.navIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
            />
          </svg>
          <span className={styles.navText}>전문가</span>
        </Link>
        
        <div className={styles.navDivider}></div>
        
        <Link 
          href="/personality"
          className={`${styles.navItem} ${isPersonalityActive ? styles.activePersonality : ''}`}
        >
          <svg 
            className={styles.navIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <span className={styles.navText}>성격</span>
        </Link>
{/*         
        <div className={styles.navDivider}></div>
        
        <Link 
          href="/image"
          className={`${styles.navItem} ${isImageGeneratorActive ? styles.activeImageGenerator : ''}`}
        >
          <svg 
            className={styles.navIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className={styles.navText}>이미지</span>
        </Link> */}
      </div>
    </div>
  );
}