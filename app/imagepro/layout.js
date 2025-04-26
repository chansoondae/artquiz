// app/imagepro/layout.js

export const metadata = {
    title: 'AI 이미지 프로 - 자유로운 프롬프트로 이미지를 변환하세요!',
    description: '이미지를 업로드하고 자유롭게 프롬프트를 입력하여 원하는 결과물을 만들어보세요. 고급 사용자를 위한 AI 이미지 변환 서비스입니다.',
    openGraph: {
      title: 'AI 이미지 프로 - 자유로운 프롬프트로 이미지를 변환하세요!',
      description: '이미지를 업로드하고 자유롭게 프롬프트를 입력하여 원하는 결과물을 만들어보세요. 고급 사용자를 위한 AI 이미지 변환 서비스입니다.',
      images: ['/images/image-generator-pro.jpg'],
      url: 'https://artfrnd.com/imagepro',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI 이미지 프로 - 자유로운 프롬프트로 이미지를 변환하세요!',
      description: '이미지를 업로드하고 자유롭게 프롬프트를 입력하여 원하는 결과물을 만들어보세요. 고급 사용자를 위한 AI 이미지 변환 서비스입니다.',
      images: ['/images/image-generator-pro.jpg'],
    },
    keywords: ['AI', '이미지 생성', '커스텀 프롬프트', '이미지 변환', '텍스트 투 이미지', '이미지 편집', '프롬프트 엔지니어링', '고급 이미지 생성', '이미지 에디터', '프로 버전'],
  };
  
  export default function ImageProLayout({ children }) {
    return <>{children}</>;
  }