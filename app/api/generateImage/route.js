import { NextResponse } from 'next/server';
import { sendToQueue } from './../../../lib/sqs';
import { createInitialImageGeneration } from './../../../lib/firebaseAdmin';
import { storage } from './../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    console.log('이미지 생성 API 요청 받음');
    
    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const prompt = formData.get('prompt');
    const styleId = formData.get('styleId');
    const styleName = formData.get('styleName');
    const saveStats = formData.get('saveStats');
    const userId = formData.get('userId') || 'anonymous';
    
    // Validation
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
    
    try {
      // Firebase Storage에 원본 이미지 업로드
      console.log('원본 이미지 업로드 중...');
      const imageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(imageRef, buffer, {
        contentType: imageFile.type
      });
      
      // 업로드된 이미지의 URL 가져오기
      const originalImageUrl = await getDownloadURL(imageRef);
      console.log('원본 이미지 업로드 완료:', originalImageUrl);
      
      // 1. Firestore에 초기 문서 생성 (processing 상태)
      console.log('Firestore 초기 문서 생성 중...');
      const initialData = {
        originalImageUrl,
        prompt,
        styleId: styleId || null,
        styleName: styleName || null,
        userId,
        status: 'processing',
        saveStats: saveStats === 'true'
      };
      
      let genId;
      try {
        genId = await createInitialImageGeneration(initialData);
        console.log('Firestore 문서 생성 완료:', genId);
      } catch (dbError) {
        console.error('Firestore 문서 생성 오류:', dbError);
        return NextResponse.json(
          { 
            message: '데이터베이스 오류가 발생했습니다.', 
            originalImageUrl,
            errorMessage: dbError.message 
          }, 
          { status: 500 }
        );
      }
      
      // 2. SQS에 메시지 전송
      console.log('SQS 메시지 전송 중...');
      const messageData = {
        type: 'GENERATE_IMAGE',
        genId, // 생성된 문서 ID
        originalImageUrl,
        prompt,
        styleId: styleId || null,
        styleName: styleName || null,
        userId,
        fileName: uniqueId, // 파일 이름 베이스 (Lambda에서 생성된 이미지 저장 시 사용)
        saveStats: saveStats === 'true',
        timestamp: new Date().toISOString()
      };
      
      // SQS에 전송
      let messageId;
      try {
        messageId = await sendToQueue(messageData);
        console.log('SQS 메시지 전송 완료:', messageId);
      } catch (sqsError) {
        console.error('SQS 메시지 전송 오류:', sqsError);
        // SQS 오류가 발생해도 genId는 반환 (처리는 실패할 수 있음)
        return NextResponse.json(
          {
            genId,
            originalImageUrl,
            status: 'error',
            message: 'SQS 메시지 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.'
          }, 
          { status: 202 }
        );
      }
      
      // 3. 클라이언트에 즉시 genId와 originalImageUrl 반환
      console.log('API 응답 전송:', { genId, requestId: messageId });
      return NextResponse.json({
        message: '이미지 생성 요청이 처리 중입니다.',
        genId,
        requestId: messageId,
        originalImageUrl,
        status: 'processing'
      });
      
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      return NextResponse.json({ 
        message: '이미지 처리 중 오류가 발생했습니다: ' + error.message,
        errorMessage: error.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('요청 처리 중 오류:', error);
    return NextResponse.json({ 
      message: '요청을 처리하는 중 오류가 발생했습니다: ' + error.message,
      errorMessage: error.message
    }, { status: 500 });
  }
}