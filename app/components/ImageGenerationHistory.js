//app/components/ImageGenerationHistory.js
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImageGenerationHistory({ limitCount = 6, refreshTrigger = 0 }) {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        
        // Firestore 쿼리 생성 - 최신순으로 정렬하고 limitCount만큼 가져오기
        const historyQuery = query(
          collection(db, 'imageGenerations'),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
        
        // 쿼리 실행
        const querySnapshot = await getDocs(historyQuery);
        
        // 결과 처리
        const items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // 완료된 항목만 표시
          if (data.status === 'completed' && data.generatedImageUrl) {
            items.push({
              id: doc.id,
              ...data,
              // Firestore Timestamp를 JavaScript Date로 변환
              timestamp: data.timestamp?.toDate() || new Date()
            });
          }
        });
        
        setHistoryItems(items);
      } catch (err) {
        console.error('Error fetching image generation history:', err);
        setError('이미지 생성 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [limitCount, refreshTrigger]); // refreshTrigger가 변경될 때마다 다시 불러오기

  // 타임스탬프를 읽기 쉬운 형식으로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return '';
    
    // 한국 시간 형식으로 변환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 이미지 클릭 시 상세 페이지로 이동
  const navigateToDetail = (id) => {
    router.push(`/image/${id}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-fuchsia-900 mb-6">최근 생성된 이미지</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : historyItems.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 p-8 rounded-md text-center">
          <p>아직 생성된 이미지가 없습니다.</p>
          <p className="mt-2 text-sm">이미지를 업로드하고 스타일을 선택하여 첫 이미지를 생성해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {historyItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-fuchsia-100 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToDetail(item.id)}
            >
              <div className="aspect-square relative">
                <img 
                  src={item.generatedImageUrl} 
                  alt={item.styleName || "생성된 이미지"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium text-fuchsia-900 line-clamp-1">
                    {item.styleName || "커스텀 스타일"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <a 
                    href={item.generatedImageUrl} 
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-fuchsia-600 hover:text-fuchsia-800 flex items-center"
                    onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    다운로드
                  </a>
                  <span className="text-sm text-fuchsia-600 hover:text-fuchsia-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    상세보기
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}