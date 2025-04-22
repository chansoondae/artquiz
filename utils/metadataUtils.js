// /utils/metadataUtils.js

// 동적 메타데이터 생성 함수
export function generateDynamicMetadata(score, totalQuestions, nickname) {
    // 점수에 따른 메시지 생성
    const generateMessage = () => {
      if (score === totalQuestions) return '완벽한 점수를 받았어요!';
      if (score >= totalQuestions * 0.7) return '훌륭한 점수를 받았어요!';
      if (score >= totalQuestions * 0.4) return '좋은 점수를 받았어요!';
      return '다음에는 더 잘할 수 있을 거예요!';
    };
    
    const title = nickname 
      ? `${nickname}님이 미술 퀴즈에서 ${score}/${totalQuestions} 점수를 받았어요!` 
      : `미술 퀴즈에서 ${score}/${totalQuestions} 점수를 받았어요!`;
      
    const description = `${generateMessage()} 당신도 미술 퀴즈에 도전해 보세요!`;
    
    // 동적 OG 이미지 URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-website-url.com';
    const imageUrl = `${baseUrl}/api/og-image?score=${score}&total=${totalQuestions}${nickname ? `&nickname=${encodeURIComponent(nickname)}` : ''}`;
  
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
      },
      twitter: {
        title,
        description,
        images: [{ url: imageUrl }],
        card: 'summary_large_image',
      }
    };
  }
  
  // 메타데이터 결합 함수 (클라이언트 컴포넌트용)
  export function combineMetadata(baseMetadata, additionalMetadata) {
    return {
      ...baseMetadata,
      ...additionalMetadata,
      openGraph: {
        ...baseMetadata.openGraph,
        ...additionalMetadata.openGraph,
      },
      twitter: {
        ...baseMetadata.twitter,
        ...additionalMetadata.twitter,
      }
    };
  }