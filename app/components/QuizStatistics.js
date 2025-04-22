// /components/QuizStatistics.js
import { useState } from 'react';

export default function QuizStatistics({ questionStats, questions }) {
  const [showStats, setShowStats] = useState(false);
  
  // 정답률 계산 함수
  const calculateCorrectRate = (stat) => {
    if (stat.totalAttempts === 0) return 0;
    return (stat.correctAnswers / stat.totalAttempts) * 100;
  };
  
  // 정답률 낮은 순으로 정렬 (어려운 문제 찾기 위해)
  const sortedStats = [...questionStats].sort((a, b) => {
    return calculateCorrectRate(a) - calculateCorrectRate(b);
  });
  
  // 상위 3개 어려운 문제 (정답률 낮은 문제)
  const hardestQuestions = sortedStats.slice(0, 3).filter(stat => stat.totalAttempts > 0);

  // 총 참여자 수 (중복 없이)
  const totalParticipants = questionStats.length > 0 ? 
    Math.max(...questionStats.map(stat => stat.totalAttempts)) : 0;

  return (
    <div className="mt-8 bg-white bg-opacity-80 p-4 rounded-lg border border-fuchsia-100">
      <button 
        onClick={() => setShowStats(!showStats)}
        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-fuchsia-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-fuchsia-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-fuchsia-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          통계 보기
        </h3>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${showStats ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showStats && (
        <div className="mt-4 space-y-6 animate-fade-in">
          {/* 총 참여자 수 */}
          <div className="text-center">
            <p className="text-gray-600">지금까지 <span className="font-bold text-fuchsia-700">{totalParticipants}</span>명이 퀴즈에 참여했습니다!</p>
          </div>
          
          {/* 난이도 높은 문제 */}
          {hardestQuestions.length > 0 && (
            <div>
              <h4 className="text-fuchsia-800 font-semibold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-fuchsia-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                가장 어려운 문제
              </h4>
              <div className="space-y-3">
                {hardestQuestions.map(stat => {
                  const question = questions.find(q => q.id === stat.questionId);
                  const correctRate = calculateCorrectRate(stat);
                  
                  return (
                    <div key={stat.questionId} className="bg-fuchsia-50 p-3 rounded-lg border border-fuchsia-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-fuchsia-900 truncate pr-2">
                          {question ? `${question.id}. ${question.question.substring(0, 30)}${question.question.length > 30 ? '...' : ''}` : `문제 ${stat.questionId}`}
                        </span>
                        <span className="font-bold text-sm text-green-600">{correctRate.toFixed(1)}% 정답</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
                          style={{ width: `${correctRate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 문제별 정답률 */}
          <div>
            <h4 className="text-fuchsia-800 font-semibold mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1 text-fuchsia-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              문제별 정답률
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sortedStats.map(stat => {
                const correctRate = calculateCorrectRate(stat);
                
                return (
                  <div key={stat.questionId} className="text-center p-2 bg-white rounded-lg border border-gray-100">
                    <div className="font-medium text-xs text-gray-600 mb-1">문제 {stat.questionId}</div>
                    <div className="font-bold text-sm">
                      <span className={correctRate < 50 ? 'text-red-600' : 'text-green-600'}>
                        {correctRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}