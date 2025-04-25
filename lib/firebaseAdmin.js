import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Firebase Admin 초기화 (서버 사이드 전용)
if (!getApps().length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('Firebase Admin 초기화 완료');
  } catch (error) {
    console.error('Firebase Admin 초기화 오류:', error);
  }
}

const db = admin.firestore();
const storage = admin.storage();

/**
 * 이미지 생성 요청의 초기 Firestore 항목 생성
 * @param {Object} data 이미지 생성 정보
 * @returns {Promise<string>} 생성된 문서 ID
 */
export async function createInitialImageGeneration(data) {
  try {
    const docRef = await db.collection('imageGenerations').add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('초기 이미지 생성 항목 생성 오류:', error);
    throw error;
  }
}

/**
 * 이미지 생성 결과 업데이트
 * @param {string} genId 문서 ID
 * @param {Object} updateData 업데이트할 데이터
 */
export async function updateImageGeneration(genId, updateData) {
  try {
    await db.collection('imageGenerations').doc(genId).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`이미지 생성 기록 ${genId} 업데이트 완료`);
    return true;
  } catch (error) {
    console.error(`이미지 생성 기록 ${genId} 업데이트 오류:`, error);
    throw error;
  }
}

/**
 * 스타일 통계 업데이트
 * @param {string} styleId 스타일 ID
 * @param {string} styleName 스타일 이름
 */
export async function updateStyleStatistics(styleId, styleName) {
  try {
    if (!styleId) return;
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
    // 1. 전체 스타일 사용 통계 업데이트
    const styleStatsRef = db.collection('styleStatistics').doc(styleId);
    const styleStatsDoc = await styleStatsRef.get();
    
    if (styleStatsDoc.exists) {
      // 문서가 존재하면 카운트만 증가
      await styleStatsRef.update({
        count: admin.firestore.FieldValue.increment(1),
        lastUsed: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // 문서가 없으면 새로 생성
      await styleStatsRef.set({
        styleId: styleId,
        styleName: styleName || '알 수 없는 스타일',
        count: 1,
        firstUsed: admin.firestore.FieldValue.serverTimestamp(),
        lastUsed: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // 2. 일별 통계 업데이트
    const dailyStatsRef = db.collection('dailyStyleStatistics').doc(dateString);
    const dailyStatsDoc = await dailyStatsRef.get();
    
    if (dailyStatsDoc.exists) {
      // 해당 날짜의 문서가 존재하면, 특정 스타일 카운트 증가
      const fieldPath = `styles.${styleId}`;
      const updateData = {};
      updateData[fieldPath] = admin.firestore.FieldValue.increment(1);
      
      await dailyStatsRef.update(updateData);
    } else {
      // 해당 날짜의 문서가 없으면 새로 생성
      const initialData = {
        date: dateString,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        styles: {}
      };
      initialData.styles[styleId] = 1;
      
      await dailyStatsRef.set(initialData);
    }
    
    console.log(`스타일 통계 업데이트 완료 (스타일 ID: ${styleId})`);
    return true;
  } catch (error) {
    console.error('스타일 통계 업데이트 오류:', error);
    throw error;
  }
}

export { db, storage };