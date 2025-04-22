// /components/ShareButtons.js
import { useState } from 'react';

export default function ShareButtons({ score, totalQuestions, nickname }) {
  const [copied, setCopied] = useState(false);
  
  // 공유 URL 및 메시지 생성
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/quiz-result?score=${score}&total=${totalQuestions}&nickname=${encodeURIComponent(nickname || '퀴즈 참가자')}`;
  const shareTitle = `${nickname ? nickname + '님이' : '제가'} 미술 퀴즈에서 ${score}/${totalQuestions} 문제를 맞혔어요!`;
  const shareMessage = `${shareTitle} 당신도 도전해보세요!`;
  
  // URL 복사 함수
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('URL 복사 실패:', err);
          alert('URL을 복사하는데 실패했습니다.');
        });
    } else {
      // 구형 브라우저용 대체 방법
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // 소셜 미디어 공유 URL 생성 함수
  const getFacebookShareUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`;
  };
  
  const getNaverCafeShareUrl = () => {
    return `https://share.naver.com/web/shareView.nhn?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
  };
  
  // 공유 함수
  const shareToFacebook = () => {
    window.open(getFacebookShareUrl(), '_blank', 'width=600,height=400');
  };
  
  const shareToNaverCafe = () => {
    window.open(getNaverCafeShareUrl(), '_blank', 'width=600,height=400');
  };
  
  const shareToInstagram = () => {
    // Instagram은 API를 통한 직접 공유가 제한적이므로 사용자에게 안내 메시지 제공
    alert('Instagram에 직접 공유할 수 없습니다. URL을 복사한 후 Instagram에 붙여넣기 해주세요.');
    copyToClipboard();
  };
  
  return (
    <div className="mt-8 p-5 bg-purple-50 rounded-lg border border-purple-100">
      <p className="mb-4 text-purple-900 font-medium">결과를 친구들과 공유해보세요!</p>
      <div className="flex flex-wrap justify-center gap-3">
        {/* Facebook 공유 버튼 */}
        <button 
          onClick={shareToFacebook}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors"
          aria-label="Facebook에 공유"
          title="Facebook에 공유"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
          <span className="hidden sm:inline-block sm:ml-2">Facebook</span>
        </button>
        
        {/* Instagram 공유 버튼 */}
        <button 
          onClick={shareToInstagram}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-sm hover:opacity-90 transition-opacity"
          aria-label="Instagram에 공유"
          title="Instagram에 공유"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="hidden sm:inline-block sm:ml-2">Instagram</span>
        </button>
        
        {/* Naver Cafe 공유 버튼 */}
        <button 
          onClick={shareToNaverCafe}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700 transition-colors"
          aria-label="Naver Cafe에 공유"
          title="Naver Cafe에 공유"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6z" fill="#1EB900"/>
            <path d="M8.5 6.5h-2v6h2v-6zm9 0h-2v6h-3.5l3 4.5h2.5v-10.5z" fill="white"/>
          </svg>
          <span className="hidden sm:inline-block sm:ml-2">Naver Cafe</span>
        </button>
        
        {/* URL 복사 버튼 */}
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-gray-600 text-white rounded-full shadow-sm hover:bg-gray-700 transition-colors"
          aria-label="URL 복사"
          title="URL 복사"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span className="hidden sm:inline-block sm:ml-2">{copied ? '복사 완료!' : 'URL 복사'}</span>
        </button>
      </div>
      
      {copied && (
        <div className="mt-3 text-green-600 text-sm font-medium">
          URL이 클립보드에 복사되었습니다!
        </div>
      )}
    </div>
  );
}