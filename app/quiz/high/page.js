// /app/quiz/high/page.js
import QuizHigh from '../../components/QuizHigh';
import { quizQuestionsHigh } from '../../../data/questions_high';

export const metadata = {
  title: '전문가급 미술 퀴즈 - 당신의 미술 전문성을 테스트해보세요!',
  description: '진정한 미술 애호가들을 위한 전문가 수준의 미술 퀴즈. 어려운 문제로 당신의 깊이 있는 미술 지식을 테스트해보세요!',
  metadataBase: new URL('https://artfrnd.com'),
  openGraph: {
    title: '전문가급 미술 퀴즈 - 당신의 미술 전문성을 테스트해보세요!',
    description: '진정한 미술 애호가들을 위한 전문가 수준의 미술 퀴즈. 어려운 문제로 당신의 깊이 있는 미술 지식을 테스트해보세요!',
    images: ['/images/high1.jpg'],
    url: 'https://artfrnd.com/quiz/high',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '전문가급 미술 퀴즈 - 당신의 미술 전문성을 테스트해보세요!',
    description: '진정한 미술 애호가들을 위한 전문가 수준의 미술 퀴즈. 어려운 문제로 당신의 깊이 있는 미술 지식을 테스트해보세요!',
    images: ['/images/high1.jpg'],
  },
  keywords: ['미술', '퀴즈', '전문가급', '고급', '미술사', '화가', '미술퀴즈', '예술', '명화'],
};

export default function HighLevelQuizPage() {
  return (
    <main className="min-h-screen py-2 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">전문가급 미술 퀴즈</h1>
        <p className="text-lg text-gray-700">진정한 미술 애호가를 위한, 한층 깊이 있는 문제들</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
      </header>
      
      <QuizHigh questions={quizQuestionsHigh} />
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 ART FRIENDS | 아트프렌즈를 사랑하는 모든 분들을 위해</p>
      </footer>
    </main>
  );
}