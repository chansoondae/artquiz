// /app/quiz-result/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db } from './../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import TopScorersBoard from './../components/TopScorersBoard';
import QuizStatistics from './../components/QuizStatistics';
import ShareButtons from './../components/ShareButtons';

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(10);
  const [nickname, setNickname] = useState('퀴즈 참가자');
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [topScorers, setTopScorers] = useState([]);
  const [questionStats, setQuestionStats] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (searchParams) {
      setScore(parseInt(searchParams.get('score') || '0'));
      setTotal(parseInt(searchParams.get('total') || '10'));
      setNickname(searchParams.get('nickname') || '퀴즈 참가자');
    }
    
    // 데이터 로딩
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 최고 득점자 데이터 가져오기
        const q = query(
          collection(db, 'quizResults'), 
          orderBy('score', 'desc'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const scorers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTopScorers(scorers);
        
        // 통계 데이터 가져오기
        const statsDoc = await getDoc(doc(db, 'statistics', 'questionStats'));
        if (statsDoc.exists()) {
          setQuestionStats(statsDoc.data().stats || []);
        }
        
        // 문제 데이터 가져오기
        // 참고: 여기서는 questions 데이터가 다른 방식으로 로드되어야 할 수 있습니다
        // 예를 들어, Firestore에서 문제 데이터를 가져오거나 API를 호출할 수 있습니다
        // 여기서는 간단하게 questionStats에서 문제 ID를 기반으로 더미 데이터를 생성합니다
        if (statsDoc.exists() && statsDoc.data().stats) {
          const dummyQuestions = statsDoc.data().stats.map(stat => ({
            id: stat.questionId,
            question: `문제 ${stat.questionId}`,
            options: [
              { id: 'A', text: '옵션 A' },
              { id: 'B', text: '옵션 B' },
              { id: 'C', text: '옵션 C' },
              { id: 'D', text: '옵션 D' }
            ],
            correctAnswer: 'A'
          }));
          
          setQuestions(dummyQuestions);
        }
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);

  // 퀴즈 결과에 따른 메시지 생성
  const getMessage = () => {
    if (score === total) return '완벽해요! 당신은 진정한 미술 전문가입니다! 👏';
    if (score >= total * 0.7) return '훌륭해요! 미술에 대한 지식이 상당하군요! 👍';
    if (score >= total * 0.4) return '괜찮아요! 미술에 대한 관심이 느껴집니다. 👌';
    return '미술의 세계는 무궁무진해요! 좀 더 배워보세요! 😊';
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          alert('URL 복사 실패. 직접 주소를 복사해주세요.');
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-fuchsia-800 text-lg font-medium">결과를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="art-card bg-white bg-opacity-90 p-5 sm:p-8 rounded-xl mb-6 text-center shadow-lg border border-fuchsia-200">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-fuchsia-800">{score}/{total}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-fuchsia-900">
              퀴즈 결과
            </h1>
            <p className="text-lg sm:text-xl mb-2">
              <span className="font-bold text-fuchsia-800">{nickname}</span>님, 
              <span className="font-bold text-fuchsia-700"> {score}문제</span> 맞았습니다!
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 sm:mb-6">
            <div 
              className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-700 h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${(score / total) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-8 p-5 rounded-lg bg-gradient-to-r from-fuchsia-50 to-purple-50 border border-fuchsia-100">
            <p className="text-lg sm:text-xl font-medium text-fuchsia-900">
              {getMessage()}
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/" 
              className="gradient-button px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              퀴즈 다시 풀기
            </Link>
          </div>
          
        </div>
        
        {/* 통계 컴포넌트 */}
        {questionStats.length > 0 && (
          <div className="mb-6">
            <QuizStatistics questionStats={questionStats} questions={questions} />
          </div>
        )}
        
        {/* 최고 득점자 명단 */}
        {topScorers.length > 0 && (
          <div className="mb-6">
            <TopScorersBoard topScorers={topScorers} totalQuestions={total} />
          </div>
        )}
        
        {/* 공유 버튼 컴포넌트 */}
        <ShareButtons 
            score={score} 
            totalQuestions={total} 
            nickname={nickname} 
          />
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2025 ART FRIENDS | 아트프렌즈를 사랑하는 모든 분들을 위해
          </p>
        </div>
      </div>
    </div>
  );
}