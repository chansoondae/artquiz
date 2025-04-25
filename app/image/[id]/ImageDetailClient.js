'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImageDetailClient({ id, initialImageData }) {
  const router = useRouter();
  const [imageData, setImageData] = useState(initialImageData.error ? null : initialImageData);
  const [error, setError] = useState(initialImageData.error || null);

  // 타임스탬프를 읽기 쉬운 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    // 한국 시간 형식으로 변환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">오류 발생</h2>
            <p>{error}</p>
            <div className="mt-6">
              <Link href="/image" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                ← 이미지 생성 페이지로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">이미지를 찾을 수 없음</h2>
            <p>요청하신 이미지 정보를 찾을 수 없습니다.</p>
            <div className="mt-6">
              <Link href="/image" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                ← 이미지 생성 페이지로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-fuchsia-900">
            {imageData.styleName || '커스텀 스타일'} 이미지
          </h1>
          <p className="text-gray-600">
            생성일: {formatDate(imageData.timestamp)}
          </p>
          
          {/* 사용자 정보 표시 */}
          {imageData.userId && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {imageData.userId}
            </div>
          )}
        </div>

        {imageData.status === 'error' ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2">이미지 생성 실패</h2>
            <p>{imageData.errorMessage || '알 수 없는 오류로 이미지 생성에 실패했습니다.'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-fuchsia-100">
            <div className="p-6">
              {/* 생성된 이미지만 표시 */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 max-w-lg mx-auto">
                  {imageData.generatedImageUrl ? (
                    <img
                      src={imageData.generatedImageUrl}
                      alt={`${imageData.styleName || '커스텀'} 스타일 이미지`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {imageData.status === 'processing' ? '처리 중...' : '이미지 없음'}
                    </div>
                  )}
                </div>
                {imageData.generatedImageUrl && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={imageData.generatedImageUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fuchsia-600 hover:text-fuchsia-800 flex items-center px-4 py-2 rounded-full bg-fuchsia-50 hover:bg-fuchsia-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      이미지 다운로드
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/image" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
            ← 이미지 생성 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}