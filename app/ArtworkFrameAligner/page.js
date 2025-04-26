//app/ArtworkFrameAligner/page.js
import ArtworkFrameAligner from './FrameAligner';

export const metadata = {
  title: '미술 작품 프레임 자동 정렬 - 수평 수직 정확하게 보정하기',
  description: '미술 작품 사진의 프레임을 자동으로 감지하고 수평/수직을 정렬하여 완벽한 디스플레이를 위한 이미지를 만드세요.',
  metadataBase: new URL('https://artfrnd.com'),
  openGraph: {
    title: '미술 작품 프레임 자동 정렬 - 수평 수직 정확하게 보정하기',
    description: '미술 작품 사진의 프레임을 자동으로 감지하고 수평/수직을 정렬하여 완벽한 디스플레이를 위한 이미지를 만드세요.',
    images: ['/images/artworkframealigner.jpg'],
    url: 'https://artfrnd.com/artworkframealigner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '미술 작품 프레임 자동 정렬 - 수평 수직 정확하게 보정하기',
    description: '미술 작품 사진의 프레임을 자동으로 감지하고 수평/수직을 정렬하여 완벽한 디스플레이를 위한 이미지를 만드세요.',
    images: ['/images/artworkframealigner.jpg'],
  },
  keywords: ['미술', '작품', '프레임', '정렬', '보정', '수평', '수직', '이미지 처리', '자동 보정', '컴퓨터 비전'],
};

export default function TransformImagePage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-indigo-900">프레임 자동 정렬</h1>
        <p className="text-lg text-gray-700">작품 사진의 반듯한 보정을 위한 도구</p>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-indigo-900 mx-auto mt-4"></div>
      </header>
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">이 도구는 무엇인가요?</h2>

          <ArtworkFrameAligner />

          <p className="text-gray-600 mb-3">
            미술 작품 사진을 찍었을 때 약간 기울어지거나 원근감이 왜곡되는 경우가 많습니다. 
            이 도구는 컴퓨터 비전 기술을 활용하여 작품의 프레임을 자동으로 감지하고, 
            수평과 수직을 완벽하게 맞춰 전문적인 이미지로 변환해줍니다.
          </p>
          <p className="text-gray-600">
            작품의 프레임이 명확하게 보이는 사진에서 가장 좋은 결과를 얻을 수 있습니다.
          </p>
        </div>
        

      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 ART FRIENDS | 아트프렌즈를 사랑하는 모든 분들을 위해</p>
      </footer>
    </main>
  );
}