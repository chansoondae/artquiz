import './globals.css';
import BottomNav from './components/BottomNav';
import GoogleAnalytics from './components/GoogleAnalytics';

export const metadata = {
  title: '미술 작품 퀴즈 - 당신의 미술 지식을 테스트해보세요!',
  description: '유명 미술 작품과 화가들에 관한 재미있는 퀴즈. 당신의 미술 지식을 테스트하고 랭킹에 도전해보세요!',
  metadataBase: new URL('https://artfrnd.com'),
  openGraph: {
    title: '미술 작품 퀴즈 - 당신의 미술 지식을 테스트해보세요!',
    description: '유명 미술 작품과 화가들에 관한 재미있는 퀴즈. 당신의 미술 지식을 테스트하고 랭킹에 도전해보세요!',
    images: ['/images/impression.png'],
    url: 'https://artfrnd.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '미술 작품 퀴즈 - 당신의 미술 지식을 테스트해보세요!',
    description: '유명 미술 작품과 화가들에 관한 재미있는 퀴즈. 당신의 미술 지식을 테스트하고 랭킹에 도전해보세요!',
    images: ['/images/impression.png'],
  },
  authors: ['아트프렌즈'],
  keywords: ['미술', '퀴즈', '미술작품', '화가', '미술퀴즈', '예술', '명화'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <main className="min-h-screen py-2 sm:py-12 pb-24">
          <GoogleAnalytics />
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}