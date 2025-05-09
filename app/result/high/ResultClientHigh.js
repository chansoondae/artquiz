"use client";

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import QuizStatistics from '../../components/QuizStatistics';
import TopScorersBoard from '../../components/TopScorersBoard';
import { quizQuestionsHigh } from '../../../data/questions_high';  // 전문가급 퀴즈 불러오기

export default function ResultClientHigh() {
  const [topScorers, setTopScorers] = useState([]);
  const [perfectScorers, setPerfectScorers] = useState([]);
  const [questionStats, setQuestionStats] = useState([]);
  const [questions, setQuestions] = useState(quizQuestionsHigh);  // 전문가급 퀴즈 질문으로 초기화
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalNum, setTotalNum] = useState(0); // 전체 참여자

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 최고 득점자 가져오기 - 컬렉션 이름 변경
        try {
          const topScorersQuery = query(
            collection(db, 'quizResultsHigh'),  // 'quizResults' 대신 'quizResultsHigh' 사용
            orderBy('score', 'desc'),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
          
          const querySnapshot = await getDocs(topScorersQuery);
          const scorers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setTopScorers(scorers);
        } catch (err) {
          console.error('Error fetching top scorers:', err);
        }
        
        // 만점자 가져오기 - 컬렉션 이름 변경
        try {
          const totalQuestions = quizQuestionsHigh.length;  // 전문가급 퀴즈 문제 수
            
          const perfectScorersQuery = query(
            collection(db, 'quizResultsHigh'),  // 'quizResults' 대신 'quizResultsHigh' 사용
            where('score', '==', totalQuestions),
            orderBy('timestamp', 'desc')
          );
          
          const perfectSnapshot = await getDocs(perfectScorersQuery);
          const perfectScorersList = perfectSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setPerfectScorers(perfectScorersList);
        } catch (err) {
          console.error('Error fetching perfect scorers:', err);
        }
        
        // 통계 데이터 가져오기 - 문서 이름 변경
        try {
          console.log("통계 데이터 가져오기 시도...");
          const statsDoc = await getDoc(doc(db, 'statistics', 'questionStatsHigh'));  // 'questionStats' 대신 'questionStatsHigh' 사용
          console.log("통계 문서 응답:", statsDoc.exists() ? "문서 있음" : "문서 없음");
          
          if (statsDoc.exists()) {
            const stats = statsDoc.data().stats || [];
            console.log("가져온 통계 데이터:", stats);
            setQuestionStats(stats);

            // 첫 번째 questionId 저장
            if (stats.length > 0) {
              const totalNum = stats[0].totalAttempts;
              console.log("전체 참여자수:", totalNum);
              setTotalNum(totalNum);
            }
          } else {
            console.log("통계 문서가 없습니다.");
          }
        } catch (err) {
          console.error('Error fetching statistics:', err.message, err.code);
          setError(`통계 데이터 가져오기 실패: ${err.code} - ${err.message}`);
        }
        
      } catch (error) {
        console.error('Error fetching results data:', error);
        setError(error.message || 'Firebase 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-fuchsia-800 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg p-6 rounded-lg bg-white shadow-lg">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">데이터 접근 오류</h2>
          <p className="mt-2 text-gray-600">Firebase 데이터에 접근할 수 없습니다. 권한이 부족하거나 네트워크 문제가 발생했습니다.</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <a 
              href="/quiz/high"
              className="inline-block gradient-button px-6 py-2 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              전문가급 퀴즈 페이지로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 통계가 있는지 확인
  const hasQuizStats = questionStats && questionStats.length > 0;
  console.log("렌더링 전 통계 데이터:", questionStats);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-fuchsia-900">
        전문가급 미술 퀴즈 결과 및 통계
      </h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-800 border-b border-fuchsia-200 pb-2">
          퀴즈 통계
        </h2>
        {hasQuizStats ? (
          <QuizStatistics questionStats={questionStats} questions={questions} initialExpanded={true}/>
        ) : (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-md border border-fuchsia-100">
            <p className="text-gray-600 italic">통계 데이터를 불러올 수 없습니다. 권한이 필요하거나 아직 데이터가 없을 수 있습니다.</p>
          </div>
        )}
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-800 border-b border-fuchsia-200 pb-2">
          만점자 명단 {perfectScorers.length}명 / {totalNum}명 
          {totalNum > 0 && (
            <span className="text-fuchsia-600 ml-1">
              (비율: {((perfectScorers.length / totalNum) * 100).toFixed(1)}%)
            </span>
          )}
        </h2>
        {perfectScorers.length > 0 ? (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-md border border-fuchsia-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {perfectScorers.map((scorer) => {
                // timestamp가 있고 toDate 메서드가 있는지 확인
                const date = scorer.timestamp && typeof scorer.timestamp.toDate === 'function' 
                  ? new Date(scorer.timestamp.toDate()).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })
                  : '날짜 정보 없음';
                  
                return (
                  <div 
                    key={scorer.id} 
                    className="flex items-center p-3 bg-fuchsia-50 rounded-lg border border-fuchsia-100"
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-fuchsia-200 rounded-full mr-3">
                      <span className="text-fuchsia-800 font-bold">
                        {scorer.nickname ? scorer.nickname.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-fuchsia-900">{scorer.nickname || '익명'}</p>
                      <p className="text-sm text-gray-600">{date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-md border border-fuchsia-100">
            <p className="text-gray-600 italic">만점자 데이터를 불러올 수 없습니다. 권한이 필요하거나 아직 만점자가 없을 수 있습니다.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <a 
          href="/quiz/high"
          className="inline-block gradient-button px-6 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          전문가급 퀴즈 다시 풀기
        </a>
        
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          기본 퀴즈 풀기
        </a>
      </div>
    </div>
  );
}