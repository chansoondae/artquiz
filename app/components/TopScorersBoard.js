// /components/TopScorersBoard.js
import { useEffect } from 'react';

export default function TopScorersBoard({ topScorers, totalQuestions }) {
  // 만점자 필터링
  const perfectScorers = topScorers.filter(scorer => scorer.score === totalQuestions);
  
  // 애니메이션 효과
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });
    
    const scorerItems = document.querySelectorAll('.scorer-item');
    scorerItems.forEach(item => observer.observe(item));
    
    return () => {
      scorerItems.forEach(item => observer.unobserve(item));
    };
  }, [perfectScorers]);

  if (perfectScorers.length === 0) {
    return null; // 만점자가 없으면 표시하지 않음
  }

  return (
    <div className="art-card bg-gradient-to-r from-purple-50 to-fuchsia-50 p-5 sm:p-8 rounded-xl mb-12 shadow-md border border-fuchsia-100">
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center">
          <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-xl sm:text-2xl font-bold text-fuchsia-900">명예의 전당</h3>
          
        </div>
      </div>
      
      <p className="text-center mb-6 text-fuchsia-800">모든 문제를 맞춘 최근 미술 고수들</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        {perfectScorers.slice(0, 10).map((scorer, index) => (
          <div 
            key={scorer.id} 
            className="scorer-item opacity-0 bg-white p-3 rounded-lg shadow-sm border border-fuchsia-100 text-center"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-lg sm:text-xl font-bold text-fuchsia-800 mb-1 truncate">
              {scorer.nickname}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(scorer.timestamp.seconds * 1000).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>
      
      {perfectScorers.length === 0 && (
        <p className="text-center text-gray-500 my-6">아직 만점자가 없습니다. 첫 번째 만점자가 되어보세요!</p>
      )}
    </div>
  );
}