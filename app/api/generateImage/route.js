//app/api/generateImage/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { storage } from '../../../lib/firebase';
import { db } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc, setDoc, increment } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const prompt = formData.get('prompt');
    const styleId = formData.get('styleId');
    const styleName = formData.get('styleName');
    const logFirst = formData.get('logFirst');
    const saveStats = formData.get('saveStats'); // 통계 저장 여부 플래그
    
    if (!imageFile) {
      return NextResponse.json({ message: '이미지 파일이 필요합니다.' }, { status: 400 });
    }
    
    if (!prompt) {
      return NextResponse.json({ message: '이미지 생성 프롬프트가 필요합니다.' }, { status: 400 });
    }
    
    // Get file data
    const fileBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    
    // Create unique filename
    const uniqueId = uuidv4();
    const originalFilename = imageFile.name.replace(/\s+/g, '_');
    const extension = originalFilename.split('.').pop();
    const fileName = `${uniqueId}_original.${extension}`;
    
    // 로그 문서 참조를 스코프 맨 위에 선언
    let logDocRef = null;
    
    try {
      // Firebase Storage에 원본 이미지 업로드
      const imageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(imageRef, buffer, {
        contentType: imageFile.type
      });
      
      // 업로드된 이미지의 URL 가져오기
      const originalImageUrl = await getDownloadURL(imageRef);
      
      // 요청된 경우 먼저 Firestore에 로그 정보 저장
      if (logFirst === 'true') {
        // 초기 로그 정보 저장 (시간, 이미지, 프롬프트 id)
        const initialLogRecord = {
          originalImageUrl: originalImageUrl,
          prompt: prompt,
          styleId: styleId || null,
          styleName: styleName || null,
          timestamp: serverTimestamp(),
          userId: formData.get('userId') || 'anonymous',
          status: 'processing', // 초기 상태는 처리 중
        };
        
        logDocRef = await addDoc(collection(db, 'imageGenerations'), initialLogRecord);
        console.log("Initial log created with ID:", logDocRef.id);
        
        // 통계 정보 저장 (요청된 경우)
        if (saveStats === 'true' && styleId) {
          await updateStyleStatistics(styleId, styleName);
        }
      }
      
      // OpenAI API 키 확인
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        // API 키가 없는 경우 로그 업데이트
        if (logFirst === 'true' && logDocRef) {
          // 오류 상태로 로그 업데이트
          await updateGenerationLog(logDocRef.id, {
            status: 'error',
            errorMessage: 'OpenAI API 키가 설정되지 않았습니다.'
          });
        }
        
        return NextResponse.json({ 
          message: 'OpenAI API 키가 설정되지 않았습니다.',
          originalImageUrl: originalImageUrl,
          errorMessage: 'OpenAI API 키가 설정되지 않았습니다.'
        }, { status: 500 });
      }
      
      // OpenAI 클라이언트 초기화
      const openai = new OpenAI({
        apiKey: openaiApiKey,
      });
      
      // OpenAI images/edits 엔드포인트에 전송하기 위한 파일 준비
      // FormData와 파일을 사용하기 위한 OpenAI SDK 방식
      const formDataForApi = new FormData();
      
      // 이미지 파일 추가
      formDataForApi.append('image', new Blob([buffer], { type: imageFile.type || 'image/png' }), originalFilename);
      
      // 프롬프트 추가
      formDataForApi.append('prompt', prompt);
      
      // 모델 지정
      formDataForApi.append('model', 'gpt-image-1');
      
      // API 직접 호출 (SDK가 FormData 처리에 문제가 있을 수 있음)
      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: formDataForApi
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `OpenAI API 오류: ${errorData.error?.message || JSON.stringify(errorData)}`;
        
        // 로그 업데이트
        if (logFirst === 'true' && logDocRef) {
          await updateGenerationLog(logDocRef.id, {
            status: 'error',
            errorMessage: errorMessage
          });
        }
        
        return NextResponse.json({ 
          message: errorMessage,
          originalImageUrl: originalImageUrl,
          errorMessage: errorMessage
        }, { status: 400 });
      }
      
      const editResponse = await response.json();
      
      // API 응답에서 base64 데이터 가져오기 (gpt-image-1 모델은 항상 base64 반환)
      const generatedImageBase64 = editResponse.data[0].b64_json;
      
      // base64를 버퍼로 변환
      const generatedImageBuffer = Buffer.from(generatedImageBase64, "base64");
      
      // Firebase Storage에 생성된 이미지 업로드
      const generatedImageRef = ref(storage, `images/${uniqueId}_generated.png`);
      await uploadBytes(generatedImageRef, generatedImageBuffer, {
        contentType: 'image/png'
      });
      
      // 생성된 이미지의 URL 가져오기
      const generatedImageUrl = await getDownloadURL(generatedImageRef);
      
      // logFirst가 true이면 기존 로그 업데이트, 아니면 새로운 레코드 생성
      let recordId;
      
      if (logFirst === 'true' && logDocRef) {
        // 기존 로그 업데이트
        await updateGenerationLog(logDocRef.id, {
          generatedImageUrl: generatedImageUrl,
          status: 'completed'
        });
        recordId = logDocRef.id;
      } else {
        // 새로운 레코드 생성
        const imageGenRecord = {
          originalImageUrl: originalImageUrl,
          generatedImageUrl: generatedImageUrl,
          prompt: prompt,
          styleId: styleId || null,
          styleName: styleName || null,
          timestamp: serverTimestamp(),
          userId: formData.get('userId') || 'anonymous',
          status: 'completed'
        };
        
        const docRef = await addDoc(collection(db, 'imageGenerations'), imageGenRecord);
        recordId = docRef.id;
        
        // 통계 정보 저장 (logFirst가 아닌 경우)
        if (saveStats === 'true' && styleId) {
          await updateStyleStatistics(styleId, styleName);
        }
      }
      
      // 결과 반환
      return NextResponse.json({ 
        message: '이미지가 성공적으로 생성되었습니다.',
        imageUrl: generatedImageUrl,
        originalImageUrl: originalImageUrl,
        recordId: recordId
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      // 로그 업데이트
      if (logFirst === 'true' && logDocRef) {
        await updateGenerationLog(logDocRef.id, {
          status: 'error',
          errorMessage: error.message || '알 수 없는 오류'
        });
      }
      
      if (error.response) {
        // OpenAI API 오류
        console.error('OpenAI API error details:', error.response.data);
        return NextResponse.json({
          message: `이미지 생성 중 API 오류가 발생했습니다: ${error.response.data.error?.message || '알 수 없는 오류'}`,
          error: error.response.data,
          originalImageUrl: originalImageUrl,
          errorMessage: error.response.data.error?.message || '알 수 없는 오류'
        }, { status: error.response.status || 500 });
      } else {
        return NextResponse.json({ 
          message: '이미지 생성 중 오류가 발생했습니다: ' + error.message,
          originalImageUrl: originalImageUrl,
          errorMessage: error.message
        }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({ 
      message: '요청을 처리하는 중 오류가 발생했습니다: ' + error.message,
      errorMessage: error.message
    }, { status: 500 });
  }
}

// Firestore 로그 레코드를 업데이트하는 헬퍼 함수
async function updateGenerationLog(docId, updateData) {
  try {
    const docRef = doc(db, 'imageGenerations', docId);
    await updateDoc(docRef, updateData);
    console.log(`Log record ${docId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating log record ${docId}:`, error);
  }
}

// 스타일 통계를 업데이트하는 헬퍼 함수
async function updateStyleStatistics(styleId, styleName) {
  try {
    if (!styleId) return;
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
    // 1. 전체 스타일 사용 통계 업데이트
    const styleStatsRef = doc(db, 'styleStatistics', styleId);
    const styleStatsDoc = await getDoc(styleStatsRef);
    
    if (styleStatsDoc.exists()) {
      // 문서가 존재하면 카운트만 증가
      await updateDoc(styleStatsRef, {
        count: increment(1),
        lastUsed: serverTimestamp()
      });
    } else {
      // 문서가 없으면 새로 생성
      await setDoc(styleStatsRef, {
        styleId: styleId,
        styleName: styleName || '알 수 없는 스타일',
        count: 1,
        firstUsed: serverTimestamp(),
        lastUsed: serverTimestamp()
      });
    }
    
          // 2. 일별 통계 업데이트
    const dailyStatsRef = doc(db, 'dailyStyleStatistics', dateString);
    const dailyStatsDoc = await getDoc(dailyStatsRef);
    
    if (dailyStatsDoc.exists()) {
      // 해당 날짜의 문서가 존재하면, 특정 스타일 카운트 증가
      const fieldPath = `styles.${styleId}`;
      const updateData = {};
      updateData[fieldPath] = increment(1);
      
      await updateDoc(dailyStatsRef, updateData);
    } else {
      // 해당 날짜의 문서가 없으면 새로 생성
      const initialData = {
        date: dateString,
        timestamp: serverTimestamp(),
        styles: {}
      };
      initialData.styles[styleId] = 1;
      
      await setDoc(dailyStatsRef, initialData);
    }
    
    console.log(`Style statistics updated for style ID: ${styleId}`);
  } catch (error) {
    console.error('Error updating style statistics:', error);
  }
}