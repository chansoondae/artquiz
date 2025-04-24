// app/image/layout.js

export const metadata = {
    title: 'AI 이미지 생성기 - 당신만의 예술 작품을 만들어보세요!',
    description: '이미지를 업로드하고 다양한 예술 스타일로 변환해보세요. AI를 활용한 간편한 이미지 변환 서비스를 경험하세요.',
    openGraph: {
      title: 'AI 이미지 생성기 - 당신만의 예술 작품을 만들어보세요!',
      description: '이미지를 업로드하고 다양한 예술 스타일로 변환해보세요. AI를 활용한 간편한 이미지 변환 서비스를 경험하세요.',
      images: ['/images/image-generator.jpg'],
      url: 'https://artfrnd.com/image',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI 이미지 생성기 - 당신만의 예술 작품을 만들어보세요!',
      description: '이미지를 업로드하고 다양한 예술 스타일로 변환해보세요. AI를 활용한 간편한 이미지 변환 서비스를 경험하세요.',
      images: ['/images/image-generator.jpg'],
    },
    keywords: ['AI', '이미지 생성', '예술 스타일', '이미지 변환', '아트 스타일', '명화 스타일', '그림 생성', '예술 작품', '이미지 에디터'],
  };
  
  export default function ImageLayout({ children }) {
    return <>{children}</>;
  }