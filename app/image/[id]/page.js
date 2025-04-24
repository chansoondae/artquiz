// app/image/[id]/page.js
// 이 파일은 서버 컴포넌트입니다. ('use client' 지시어가 없음)

import React from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ImageDetailClient from './ImageDetailClient';

// 서버 컴포넌트에서 데이터 가져오기
async function getImageData(id) {
  try {
    const docRef = doc(db, 'imageGenerations', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { error: '해당 ID의 이미지를 찾을 수 없습니다.' };
    }
    
    const data = docSnap.data();
    
    // Firestore의 Timestamp를 변환 (서버에서는 다르게 처리해야 할 수 있음)
    return {
      id: docSnap.id,
      ...data,
      timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString()
    };
  } catch (err) {
    console.error('Error fetching image data:', err);
    return { error: '이미지 정보를 불러오는 중 오류가 발생했습니다.' };
  }
}

export default async function ImageDetailPage({ params }) {
  // params를 await로 비동기 처리
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const imageData = await getImageData(id);
  
  // 클라이언트 컴포넌트로 데이터 전달
  return <ImageDetailClient id={id} initialImageData={imageData} />;
}