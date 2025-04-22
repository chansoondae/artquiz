// /app/page.js
import Quiz from './components/Quiz';
import { quizQuestions } from '../data/questions';

export default function Home() {
  // OG 이미지와 메타데이터 - 페이지별로 다르게 설정 가능
  const metadata = {
    title: '미술 작품 퀴즈 - 당신의 미술 지식을 테스트해보세요!',
    description: '유명 미술 작품과 화가들에 관한 재미있는 퀴즈. 당신의 미술 지식을 테스트하고 랭킹에 도전해보세요!',
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">미술 퀴즈 10선</h1>
        <p className="text-lg text-gray-700">당신의 미술 지식을 테스트해보세요!</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
      </header>
      
      <Quiz questions={quizQuestions} />
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 ART FRIENDS | 아트프렌즈를 사랑하는 모든 분들을 위해</p>
      </footer>
    </main>
  );
}