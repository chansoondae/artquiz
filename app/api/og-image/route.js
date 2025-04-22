// /app/api/og-image/route.js
import { ImageResponse } from 'next/og'; // Updated import path for Next.js 14+

export const runtime = 'edge';

// 동적 OG 이미지 생성 API 엔드포인트
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 쿼리 파라미터 가져오기
  const score = searchParams.get('score') || '0';
  const total = searchParams.get('total') || '10';
  const nickname = searchParams.get('nickname') || '';

  // 배경 이미지 URL (미리 준비된 배경 이미지)
  const bgImageUrl = 'https://your-static-hosting.com/og-background.jpg';
  
  try {
    // 폰트 로딩 (Next.js Edge Runtime에서 사용)
    const fontData = await fetch(
      new URL('../../assets/NotoSansKR-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    // 점수에 따른 메시지 생성
    let message = '';
    const scoreNum = parseInt(score);
    const totalNum = parseInt(total);
    
    if (scoreNum === totalNum) {
      message = '완벽한 점수를 받았어요!';
    } else if (scoreNum >= totalNum * 0.7) {
      message = '훌륭한 점수를 받았어요!';
    } else if (scoreNum >= totalNum * 0.4) {
      message = '좋은 점수를 받았어요!';
    } else {
      message = '다음에는 더 잘할 수 있을 거예요!';
    }

    // OG 이미지 생성
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#FDF4FF',
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: 'cover',
            padding: '40px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              width: '90%',
              maxWidth: '1000px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#701A75',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              미술 퀴즈 결과
            </h1>
            
            {nickname && (
              <h2
                style={{
                  fontSize: '36px',
                  color: '#86198F',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                {nickname}님의 점수
              </h2>
            )}
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
              }}
            >
              <span
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: '#BE185D',
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: '40px',
                  color: '#6B7280',
                  marginLeft: '10px',
                }}
              >
                / {total}
              </span>
            </div>
            
            <p
              style={{
                fontSize: '32px',
                color: '#4B5563',
                textAlign: 'center',
              }}
            >
              {message}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'NotoSansKR',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG 이미지 생성 오류:', error);
    
    // 에러 발생 시 기본 이미지 반환
    return new Response('OG 이미지 생성에 실패했습니다', { status: 500 });
  }
}