// /components/Quiz.js
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from './../../lib/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, getDoc, doc, runTransaction } from 'firebase/firestore';
import NicknameModal from './NicknameModal';
import TopScorersBoard from './TopScorersBoard';
import QuizStatistics from './QuizStatistics';

export default function Quiz({ questions }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [topScorers, setTopScorers] = useState([]);
  const [questionStats, setQuestionStats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSubmitted, setResultSubmitted] = useState(false);

  // 최고 득점자 불러오기
  useEffect(() => {
    const fetchTopScorers = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching top scorers:', error);
      }
    };
    
    // 통계 데이터 불러오기
    const fetchQuestionStats = async () => {
      try {
        const statsDoc = await getDoc(doc(db, 'statistics', 'questionStats'));
        if (statsDoc.exists()) {
          setQuestionStats(statsDoc.data().stats || []);
        }
      } catch (error) {
        console.error('Error fetching question statistics:', error);
      }
    };
    
    fetchTopScorers();
    fetchQuestionStats();
  }, [resultSubmitted]);

  const handleOptionSelect = (questionId, optionId) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const checkAnswers = () => {
    // 모든 문제에 답했는지 확인
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert('모든 문제에 답해주세요!');
      return;
    }

    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    setCorrectCount(correct);
    setShowResults(true);
    
    // 점수가 만점이거나 최소 3문제 이상 맞췄을 때 닉네임 모달 표시
    if (correct === questions.length || correct >= 3) {
      setShowNicknameModal(true);
    }
    
    // 결과 섹션으로 스크롤
    setTimeout(() => {
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCorrectCount(0);
    setResultSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getOptionClassName = (question, optionId) => {
    const baseClass = "option-label flex items-center p-2 sm:p-3 mb-2 border rounded-lg cursor-pointer";
    
    if (!showResults && selectedAnswers[question.id] === optionId) {
      return `${baseClass} selected`;
    }
    
    if (showResults) {
      if (question.correctAnswer === optionId) {
        return `${baseClass} correct`;
      }
      if (selectedAnswers[question.id] === optionId && question.correctAnswer !== optionId) {
        return `${baseClass} incorrect`;
      }
    }
    
    return baseClass;
  };

  const handleNicknameSubmit = async (nickname) => {
    setIsSubmitting(true);
    try {
      setNickname(nickname);
      
      // 결과 저장
      const timestamp = new Date();
      await addDoc(collection(db, 'quizResults'), {
        nickname,
        score: correctCount,
        answers: selectedAnswers,
        totalQuestions: questions.length,
        timestamp
      });
      
      // 통계 업데이트
      const statsRef = doc(db, 'statistics', 'questionStats');
      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        
        let stats = statsDoc.exists() ? statsDoc.data().stats : [];
        
        // 최초 데이터 생성
        if (!stats.length) {
          stats = questions.map(q => ({
            questionId: q.id,
            totalAttempts: 0,
            correctAnswers: 0
          }));
        }
        
        // 통계 업데이트
        questions.forEach(question => {
          const questionStat = stats.find(s => s.questionId === question.id);
          if (questionStat) {
            questionStat.totalAttempts++;
            if (selectedAnswers[question.id] === question.correctAnswer) {
              questionStat.correctAnswers++;
            }
          }
        });
        
        transaction.set(statsRef, { stats });
      });
      
      setResultSubmitted(true);
      setShowNicknameModal(false);
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6">
      <div className="mb-8">
        {questions.map((question) => (
          <div 
            key={question.id} 
            className="art-card mb-8 sm:mb-12 bg-white bg-opacity-70 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md border border-fuchsia-100"
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-fuchsia-900">{question.id}. {question.question}</h2>
              <div className="relative w-full aspect-square max-w-md mx-auto overflow-hidden rounded-lg mb-4">
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                {question.image && (
                  <Image 
                    src={question.image} 
                    alt={`Question ${question.id} image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover rounded-lg"
                    priority={question.id <= 3} // 처음 3개 이미지는 우선 로딩
                  />
                )}
              </div>
            </div>
            
            <div>
              {question.options.map((option) => (
                <label 
                  key={option.id}
                  className={getOptionClassName(question, option.id)}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={selectedAnswers[question.id] === option.id}
                    onChange={() => handleOptionSelect(question.id, option.id)}
                    disabled={showResults}
                    className="mr-1 sm:mr-2 h-4 w-4 accent-fuchsia-700"
                  />
                  <span className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-900 font-semibold mr-2 sm:mr-3 text-sm sm:text-base">
                    {option.id}
                  </span>
                  <span className="flex-grow text-sm sm:text-base">{option.text}</span>
                  
                  {showResults && question.correctAnswer === option.id && (
                    <span className="ml-1 sm:ml-2 text-green-600">✓</span>
                  )}
                  
                  {showResults && selectedAnswers[question.id] === option.id && question.correctAnswer !== option.id && (
                    <span className="ml-1 sm:ml-2 text-red-600">✗</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-4 flex justify-center gap-4 py-4 z-10">
        {!showResults ? (
          <button 
            onClick={checkAnswers} 
            className="gradient-button px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            정답 확인
          </button>
        ) : (
          <button 
            onClick={resetQuiz} 
            className="reset-button px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            다시 하기
          </button>
        )}
      </div>

      {showResults && (
        <div id="results" className="art-card bg-white bg-opacity-90 p-5 sm:p-8 rounded-xl mb-12 text-center shadow-lg border border-fuchsia-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-fuchsia-900">퀴즈 결과</h2>
          <p className="text-xl sm:text-2xl mb-2">
            {nickname && <span className="font-bold text-fuchsia-800">{nickname} 님</span> }
            10문제 중 <span className="font-bold text-fuchsia-700">{correctCount}문제</span> 정답!
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 sm:mb-6">
            <div 
              className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-700 h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${(correctCount / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-base sm:text-lg mb-6">
            {correctCount === questions.length && "완벽해요! 당신은 진정한 미술 전문가입니다! 👏"}
            {correctCount >= 7 && correctCount < questions.length && "훌륭해요! 미술에 대한 지식이 상당하군요! 👍"}
            {correctCount >= 4 && correctCount < 7 && "괜찮아요! 미술에 대한 관심이 느껴집니다. 👌"}
            {correctCount < 4 && "미술의 세계는 무궁무진해요! 좀 더 배워보세요! 😊"}
          </p>
          
          {!nickname && correctCount >= 3 && !resultSubmitted && (
            <div className="mb-6 p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-200">
              <p className="mb-3 text-fuchsia-900">당신의 결과를 저장하고 랭킹에 참여하세요!</p>
              <button
                onClick={() => setShowNicknameModal(true)}
                className="gradient-button px-4 py-2 text-white font-semibold rounded-full text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? '제출 중...' : '닉네임 등록하기'}
              </button>
            </div>
          )}
          
          {resultSubmitted && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">결과가 성공적으로 저장되었습니다!</p>
            </div>
          )}
          
          {/* 통계 컴포넌트 */}
          {questionStats.length > 0 && (
            <QuizStatistics questionStats={questionStats} questions={questions} />
          )}
        </div>
      )}
      
      {/* 최고 득점자 명단 */}
      {topScorers.length > 0 && (
        <TopScorersBoard topScorers={topScorers} totalQuestions={questions.length} />
      )}
      
      {/* 닉네임 입력 모달 */}
      <NicknameModal 
        isOpen={showNicknameModal} 
        onClose={() => setShowNicknameModal(false)} 
        onSubmit={handleNicknameSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}