// /app/page.js
import Quiz from './components/Quiz';
import { quizQuestions } from '../data/questions';

export default function Home() {
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