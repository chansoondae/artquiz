// app/image/[id]/page.js
// 이 파일은 서버 컴포넌트입니다. ('use client' 지시어가 없음)

import React from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ImageDetailClient from './ImageDetailClient';

// 타임스탬프 객체를 처리하기 위한 함수
function convertTimestampToISO(obj) {
  // 객체가 null이거나 undefined인 경우
  if (!obj) return obj;
  
  // 기본 타입인 경우 그대로 반환
  if (typeof obj !== 'object') return obj;
  
  // 배열인 경우 각 항목을 재귀적으로 처리
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestampToISO(item));
  }

  // Firestore Timestamp 객체 처리
  if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
    return new Date(obj.seconds * 1000 + obj.nanoseconds / 1000000).toISOString();
  }
  
  // 일반 객체인 경우 각 속성을 재귀적으로 처리
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = convertTimestampToISO(obj[key]);
    }
  }
  return result;
}

// 서버 컴포넌트에서 데이터 가져오기
async function getImageData(id) {
  try {
    const docRef = doc(db, 'imageGenerations', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { error: '해당 ID의 이미지를 찾을 수 없습니다.' };
    }
    
    // Firestore 데이터를 일반 객체로 변환
    const data = docSnap.data();
    
    // Timestamp 객체를 ISO 문자열로 변환
    const serializedData = convertTimestampToISO({
      id: docSnap.id,
      ...data
    });
    
    return serializedData;
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