"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BottomNav() {
  const pathname = usePathname();
  
  // 현재 경로에 따라 활성화된 탭 확인
  const isBasicActive = pathname === '/';
  const isAdvancedActive = pathname === '/quiz/high';
  
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-full flex items-center border border-fuchsia-100">
        <Link 
          href="/"
          className={`py-3 px-5 sm:px-8 rounded-full flex items-center transition-all duration-300 ${
            isBasicActive 
              ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold' 
              : 'text-gray-700 hover:bg-fuchsia-50'
          }`}
        >
          <svg 
            className="w-5 h-5 mr-2" 
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
          <span className="font-medium">중급 퀴즈</span>
        </Link>
        
        <div className="h-8 w-px bg-gray-200"></div>
        
        <Link 
          href="/quiz/high"
          className={`py-3 px-5 sm:px-8 rounded-full flex items-center transition-all duration-300 ${
            isAdvancedActive 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold' 
              : 'text-gray-700 hover:bg-fuchsia-50'
          }`}
        >
          <svg 
            className="w-5 h-5 mr-2" 
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
          <span className="font-medium">전문가급 퀴즈</span>
        </Link>
      </div>
    </div>
  );
}