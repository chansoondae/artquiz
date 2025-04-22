// /components/Quiz.js
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { db } from './../../lib/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, getDoc, doc, runTransaction } from 'firebase/firestore';
import NicknameModal from './NicknameModal';
import TopScorersBoard from './TopScorersBoard';
import QuizStatistics from './QuizStatistics';
import LoadingSpinner from './LoadingSpinner';
import LoadingOverlay from './LoadingOverlay';
import ShareButtons from './ShareButtons';

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
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(10);
  const resultsRef = useRef(null);

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
    
    // Loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [resultSubmitted]);

  // Update progress bar
  useEffect(() => {
    setProgressPercentage((currentQuestion / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleOptionSelect = (questionId, optionId) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    // Auto advance to next question after selection with a small delay
    if (currentQuestion < questions.length && questionId === currentQuestion) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 500);
    }
  };

  const goToQuestion = (questionNumber) => {
    if (questionNumber >= 1 && questionNumber <= questions.length) {
      setCurrentQuestion(questionNumber);
    }
  };

  const checkAnswers = () => {
    // 모든 문제에 답했는지 확인
    if (Object.keys(selectedAnswers).length < questions.length) {
      const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
      alert(`아직 ${unansweredCount}개의 문제에 답하지 않았습니다. 모든 문제에 답해주세요!`);
      
      // Find first unanswered question
      for (let i = 1; i <= questions.length; i++) {
        if (!selectedAnswers[i]) {
          setCurrentQuestion(i);
          break;
        }
      }
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
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCorrectCount(0);
    setResultSubmitted(false);
    setCurrentQuestion(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getOptionClassName = (question, optionId) => {
    const baseClass = "option-label flex items-center p-3 sm:p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-200";
    
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

  // Get current question details
  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="fuchsia" className="mx-auto mb-4" />
          <p className="text-fuchsia-800 text-lg font-medium">퀴즈를 불러오는 중입니다...</p>
          <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6">
      {!showResults && (
        <>
          {/* Progress bar */}
          <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-20 pt-4 px-2 rounded-b-xl shadow-sm">
            <div className="flex justify-between text-sm text-fuchsia-900 mb-1 px-1">
              <span className="font-medium">진행률</span>
              <span>{currentQuestion} / {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div 
                className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-700 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Question navigator */}
            <div className="flex justify-center pb-3 mb-2 overflow-x-auto no-scrollbar">
              <div className="flex space-x-1.5">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(q.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                      currentQuestion === q.id
                        ? 'bg-fuchsia-600 text-white font-bold shadow-md transform scale-110'
                        : selectedAnswers[q.id]
                        ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={`Go to question ${q.id}`}
                  >
                    {q.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current question */}
          <div 
            key={currentQuestionData.id} 
            className="art-card mb-8 mt-4 sm:mb-12 bg-white bg-opacity-80 backdrop-blur-sm p-5 sm:p-8 rounded-xl shadow-lg border border-fuchsia-100 transition-all duration-300"
          >
            <div className="mb-5 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-fuchsia-900">
                <span className="inline-block bg-fuchsia-100 text-fuchsia-800 rounded-full px-3 py-1 mr-2 text-base">
                  Q{currentQuestionData.id}
                </span>
                {currentQuestionData.question}
              </h2>
              <div className="relative w-full aspect-square max-w-lg mx-auto overflow-hidden rounded-xl mb-6 shadow-md border border-fuchsia-50">
                {!currentQuestionData.image && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                )}
                {currentQuestionData.image && (
                  <Image 
                    src={currentQuestionData.image} 
                    alt={`Question ${currentQuestionData.id} image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                    className="object-cover rounded-xl"
                    priority
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <label 
                  key={option.id}
                  className={getOptionClassName(currentQuestionData, option.id)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionData.id}`}
                    value={option.id}
                    checked={selectedAnswers[currentQuestionData.id] === option.id}
                    onChange={() => handleOptionSelect(currentQuestionData.id, option.id)}
                    disabled={showResults}
                    className="mr-2 sm:mr-3 h-5 w-5 accent-fuchsia-700"
                  />
                  <span className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-900 font-semibold mr-3 sm:mr-4 text-base sm:text-lg">
                    {option.id}
                  </span>
                  <span className="flex-grow text-base sm:text-lg">{option.text}</span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              {currentQuestion > 1 && (
                <button 
                  onClick={() => goToQuestion(currentQuestion - 1)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-fuchsia-900 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  이전
                </button>
              )}
              
              {currentQuestion < questions.length ? (
                <button 
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className={`flex items-center px-4 py-2 ml-auto ${
                    selectedAnswers[currentQuestion] 
                      ? 'bg-fuchsia-600 text-white' 
                      : 'bg-gray-100 text-fuchsia-900'
                  } rounded-lg hover:opacity-90 transition-all`}
                  disabled={!selectedAnswers[currentQuestion]}
                >
                  다음
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={checkAnswers}
                  className={`flex items-center px-5 py-2 ml-auto font-medium ${
                    Object.keys(selectedAnswers).length === questions.length
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } rounded-lg hover:opacity-90 transition-all`}
                >
                  결과 확인하기
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="sticky bottom-4 flex justify-center gap-4 py-4 z-10">
        {!showResults ? (
          <button 
            onClick={checkAnswers} 
            className={`gradient-button px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
              Object.keys(selectedAnswers).length < questions.length ? 'opacity-70' : 'opacity-100'
            }`}
          >
            {Object.keys(selectedAnswers).length < questions.length 
              ? `${Object.keys(selectedAnswers).length}/${questions.length} 답변 완료`
              : '정답 확인'}
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
        <div 
          id="results" 
          ref={resultsRef}
          className="art-card bg-white bg-opacity-90 p-6 sm:p-8 rounded-xl mb-12 text-center shadow-lg border border-fuchsia-200 animate-fade-in"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-fuchsia-800">{correctCount}/{questions.length}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-fuchsia-900">
              퀴즈 결과
            </h2>
            <p className="text-lg sm:text-xl mb-2">
              {nickname && <span className="font-bold text-fuchsia-800">{nickname} 님,</span> }
              <span className="font-bold text-fuchsia-700">{correctCount}문제</span> 맞았습니다!
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 sm:mb-6">
            <div 
              className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-700 h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${(correctCount / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-8 p-5 rounded-lg bg-gradient-to-r from-fuchsia-50 to-purple-50 border border-fuchsia-100">
            <p className="text-lg sm:text-xl font-medium text-fuchsia-900">
              {correctCount === questions.length && "완벽해요! 당신은 진정한 미술 전문가입니다! 👏"}
              {correctCount >= 7 && correctCount < questions.length && "훌륭해요! 미술에 대한 지식이 상당하군요! 👍"}
              {correctCount >= 4 && correctCount < 7 && "괜찮아요! 미술에 대한 관심이 느껴집니다. 👌"}
              {correctCount < 4 && "미술의 세계는 무궁무진해요! 좀 더 배워보세요! 😊"}
            </p>
          </div>
          
          {/* 틀린 문제 요약 */}
          {correctCount < questions.length && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-fuchsia-800 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                틀린 문제 확인
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map(question => {
                  if (selectedAnswers[question.id] !== question.correctAnswer) {
                    const correctOption = question.options.find(o => o.id === question.correctAnswer);
                    const selectedOption = question.options.find(o => o.id === selectedAnswers[question.id]);
                    
                    return (
                      <div key={question.id} className="bg-white p-4 rounded-lg shadow-sm border border-red-100 text-left">
                        <p className="font-medium mb-2 text-gray-800">
                          <span className="text-red-600 font-bold">Q{question.id}.</span> {question.question}
                        </p>
                        <p className="text-sm text-red-600 mb-1">
                          <span className="font-bold">내 답변:</span> {selectedOption ? selectedOption.text : '답변 없음'}
                        </p>
                        <p className="text-sm text-green-600">
                          <span className="font-bold">정답:</span> {correctOption ? correctOption.text : ''}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
          
          {!nickname && correctCount >= 3 && !resultSubmitted && (
            <div className="mb-8 p-5 bg-fuchsia-50 rounded-lg border border-fuchsia-200">
              <p className="mb-4 text-fuchsia-900 font-medium">당신의 결과를 저장하고 랭킹에 참여하세요!</p>
              <button
                onClick={() => setShowNicknameModal(true)}
                className="gradient-button px-5 py-2.5 text-white font-semibold rounded-full text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="-ml-1 mr-2" />
                    제출 중...
                  </span>
                ) : '닉네임 등록하기'}
              </button>
            </div>
          )}
          
          {resultSubmitted && (
            <div className="mb-8 p-5 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                결과가 성공적으로 저장되었습니다!
              </p>
            </div>
          )}
          
          {/* 통계 컴포넌트 */}
          {questionStats.length > 0 && (
            <QuizStatistics questionStats={questionStats} questions={questions} />
          )}
        </div>
      )}
      
      {/* 최고 득점자 명단 */}
      {topScorers.length > 0 && showResults && (
        <TopScorersBoard topScorers={topScorers} totalQuestions={questions.length} />
      )}
      
      {/* 로딩 오버레이 */}
      <LoadingOverlay isVisible={isSubmitting} message="결과를 저장하는 중입니다..." />
      
      {/* 닉네임 입력 모달 */}
      <NicknameModal 
        isOpen={showNicknameModal} 
        onClose={() => setShowNicknameModal(false)} 
        onSubmit={handleNicknameSubmit}
        isSubmitting={isSubmitting}
      />
      {/* 공유 버튼 컴포넌트 */}
      <ShareButtons 
            score={correctCount} 
            totalQuestions={questions.length} 
            nickname={nickname} 
          />
    </div>
  );
}