//app/image/history/page.js
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, where } from 'firebase/firestore';

export default function ImageHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchPrompt, setSearchPrompt] = useState('');
  const pageSize = 12;

  const fetchHistory = async (lastDoc = null) => {
    try {
      setLoading(true);
      
      let q = query(
        collection(db, 'imageGenerations'),
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(
          collection(db, 'imageGenerations'),
          orderBy('timestamp', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Firestore Timestamp를 JavaScript Date 객체로 변환
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      if (lastDoc) {
        setHistory(prev => [...prev, ...historyData]);
      } else {
        setHistory(historyData);
      }
      
      // 다음 페이지가 있는지 확인
      setHasMore(querySnapshot.docs.length === pageSize);
    } catch (err) {
      console.error('Error fetching image generation history:', err);
      setError('이미지 생성 기록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchHistory(lastVisible);
    }
  };

  const handleSearch = async () => {
    if (!searchPrompt.trim()) {
      fetchHistory();
      return;
    }
    
    try {
      setLoading(true);
      
      // 프롬프트 검색 (Firestore에서 문자열 포함 검색은 제한적이므로 단순 비교만 수행)
      const q = query(
        collection(db, 'imageGenerations'),
        where('prompt', '>=', searchPrompt),
        where('prompt', '<=', searchPrompt + '\uf8ff'),
        orderBy('prompt'),
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );
      
      const querySnapshot = await getDocs(q);
      
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      setHistory(historyData);
      setHasMore(false); // 검색 결과에는 더 로드하기 비활성화
    } catch (err) {
      console.error('Error searching history:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchPrompt('');
    setFilterType('all');
    setLastVisible(null);
    fetchHistory();
  };
  
  // 이미지 클릭 시 상세 페이지로 이동
  const navigateToDetail = (id) => {
    router.push(`/image/${id}`);
  };
  
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">이미지 생성 히스토리</h1>
        <p className="text-lg text-gray-700">생성된 모든 이미지 기록을 확인해보세요</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
      </header>

      {/* 검색 및 필터링 */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search-prompt" className="block text-sm font-medium text-gray-700 mb-1">
              프롬프트로 검색
            </label>
            <div className="flex">
              <input
                type="text"
                id="search-prompt"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="프롬프트 키워드 입력..."
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="gradient-button px-4 py-2 text-white rounded-r-md"
              >
                검색
              </button>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="reset-button px-4 py-2 text-white rounded-md w-full md:w-auto"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      
      {/* 히스토리 목록 */}
      {error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-8">
          {error}
        </div>
      ) : (
        <>
          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="art-card bg-white bg-opacity-70 p-4 rounded-lg shadow-md border border-fuchsia-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigateToDetail(item.id)}
                >
                  <div className="flex h-60 mb-3">
                    <div className="w-1/2 relative">
                      <img
                        src={item.originalImageUrl}
                        alt="Original"
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                        원본
                      </div>
                    </div>
                    <div className="w-1/2 relative">
                      <img
                        src={item.generatedImageUrl}
                        alt="Generated"
                        className="w-full h-full object-cover rounded-r-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                        생성됨
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                      <span className="font-medium">스타일:</span> {item.styleName || '커스텀 스타일'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {item.timestamp.toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      <div className="flex gap-2">
                        <a
                          href={item.generatedImageUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-fuchsia-600 text-white py-1 px-2 rounded hover:bg-fuchsia-700"
                          onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                        >
                          다운로드
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="art-card bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-fuchsia-100 text-center">
              {loading ? (
                <div className="animate-pulse-custom">
                  <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ) : (
                <p className="text-gray-500">기록이 없거나 검색 결과가 없습니다.</p>
              )}
            </div>
          )}
          
          {/* 로딩 상태 및 더 보기 버튼 */}
          {loading && history.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-700"></div>
            </div>
          )}
          
          {!loading && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="gradient-button px-6 py-2 text-white font-medium rounded-full"
              >
                더 보기
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/image" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
          ← 이미지 생성으로 돌아가기
        </Link>
      </div>
    </div>
  );
}