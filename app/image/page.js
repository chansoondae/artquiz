//app/image/page.js
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageGenerationHistory from '../components/ImageGenerationHistory';
import artStyles from './../../utils/ArtStyles'; // Import art styles (adjust path as needed)
import NicknameModal from '../components/NicknameModal'; // 닉네임 모달 컴포넌트 추가

export default function ImageGencerator() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [submittingNickname, setSubmittingNickname] = useState(false);
  const [pendingImageGeneration, setPendingImageGeneration] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [processingGenId, setProcessingGenId] = useState(null); // 처리 중인 이미지 생성 ID 저장
  const [countdownActive, setCountdownActive] = useState(false);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);
  
  // 카운트다운 효과
  useEffect(() => {
    if (!countdownActive || timeRemaining <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdownActive, timeRemaining]);
  
  // 이미지 생성 후 히스토리 새로고침을 위한 함수
  const triggerHistoryRefresh = () => {
    setRefreshHistory(prev => prev + 1);
  };
  
  // 닉네임 제출 처리
  const handleNicknameSubmit = async (submittedNickname) => {
    setSubmittingNickname(true);
    try {
      // 닉네임 저장
      setNickname(submittedNickname);
      localStorage.setItem('userNickname', submittedNickname);
      
      // 모달 닫기
      setShowNicknameModal(false);
      
      // 대기 중인 이미지 생성 작업이 있으면 실행
      if (pendingImageGeneration) {
        await processImageGeneration(pendingImageGeneration, submittedNickname);
        setPendingImageGeneration(null);
      }
    } catch (error) {
      console.error('Error saving nickname:', error);
    } finally {
      setSubmittingNickname(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // 파일 크기 체크 (10MB 제한)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      
      // 파일 타입 체크
      if (!selectedFile.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      
      setFile(selectedFile);
      
      // 미리보기 URL 생성
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // 기존 결과 초기화
      setGeneratedImage(null);
      setOriginalImage(null);
      setError('');
      setSuccess('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // 파일 크기와 타입 체크
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      
      if (!droppedFile.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      
      setFile(droppedFile);
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
      
      setGeneratedImage(null);
      setOriginalImage(null);
      setError('');
      setSuccess('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setPrompt(style.prompt); // 선택한 스타일의 프롬프트로 설정
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('이미지 파일을 업로드해주세요.');
      return;
    }
    
    if (!prompt.trim()) {
      setError('이미지 생성을 위한 프롬프트를 입력해주세요.');
      return;
    }
    
    // 닉네임이 없는 경우 모달 표시
    if (!nickname) {
      // 폼 데이터를 저장해 두고 닉네임 모달 표시
      setPendingImageGeneration({
        file,
        prompt,
        selectedStyle
      });
      setShowNicknameModal(true);
      return;
    }
    
    // 닉네임이 있는 경우 직접 처리
    await processImageGeneration({
      file,
      prompt,
      selectedStyle
    }, nickname);
  };
  
  // 실제 이미지 생성 처리 함수
  const processImageGeneration = async (data, userNickname) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('image', data.file);
      formData.append('prompt', data.prompt);
      
      // 사용자 닉네임 추가
      formData.append('userId', userNickname);
      
      // 선택된 스타일 정보도 추가
      if (data.selectedStyle) {
        formData.append('styleId', data.selectedStyle.id);
        formData.append('styleName', data.selectedStyle.koreanName);
      }
      
      // 먼저 Firestore에 로그 정보를 저장 (시간, 이미지, 프롬프트 id)
      // API에서 처리하도록 플래그 추가
      formData.append('logFirst', 'true');
      
      // Firebase에 통계 정보 저장하도록 플래그 추가
      formData.append('saveStats', 'true');
      
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이미지 생성 중 오류가 발생했습니다.');
      }
      
      const responseData = await response.json();
      
              // SQS에 메시지가 성공적으로 전송된 경우
      if (responseData.genId) {
        // 생성 ID 저장
        setProcessingGenId(responseData.genId);
        
        // 원본 이미지 URL 설정
        if (responseData.originalImageUrl) {
          setOriginalImage(responseData.originalImageUrl);
        }
        
        // 현재 처리 중임을 표시
        setSuccess('이미지 생성 요청이 처리 중입니다. 잠시만 기다려주세요...');
        
        // 카운트다운 시작
        setTimeRemaining(60);
        setCountdownActive(true);
        
        // 60초 후에 이미지 상세 페이지로 이동
        setTimeout(() => {
          console.log('60초 타이머 완료, 이미지 상세 페이지로 이동');
          setCountdownActive(false);
          
          if (responseData.genId) {
            // 이미지 상세 페이지로 이동
            router.push(`/image/${responseData.genId}`);
          } else {
            // genId가 없는 경우 히스토리 새로고침만 수행
            triggerHistoryRefresh();
            setLoading(false);
            setSuccess('이미지가 생성되었습니다. 히스토리에서 확인하세요.');
          }
        }, 60000);
      } else {
        // API 응답에 genId가 없는 경우 오류 처리
        setError('이미지 생성 요청 처리 중 오류가 발생했습니다.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || '이미지 생성 중 알 수 없는 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setPrompt('');
    setGeneratedImage(null);
    setOriginalImage(null);
    setError('');
    setSuccess('');
    setSelectedStyle(null);
    setProcessingGenId(null);
  };

  // 자주 사용되는 스타일 (처음 8개만 표시)
  const popularStyles = artStyles.slice(0, 8);

  return (
    <div className="min-h-screen py-2 px-4 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">예술가 따라하기</h1>
        <p className="text-lg text-gray-700"> AI로 새로운 작품을 만들어보세요!</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
        
        {/* 사용자 닉네임 표시 */}
        {nickname && (
          <div className="mt-4 flex justify-center items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {nickname}
              <button 
                onClick={() => {
                  localStorage.removeItem('userNickname');
                  setNickname('');
                }}
                className="ml-2 text-fuchsia-600 hover:text-fuchsia-800"
                title="닉네임 변경"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="art-card bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-fuchsia-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="block text-lg font-medium text-fuchsia-900 mb-2">
                이미지 업로드
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-fuchsia-300 rounded-lg"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <div className="space-y-1 text-center">
                  {!previewUrl ? (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-fuchsia-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-fuchsia-600 hover:text-fuchsia-500 focus-within:outline-none"
                          onClick={(e) => e.stopPropagation()} // 이벤트 전파 중단
                        >
                          <span>파일 선택하기</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">또는 드래그 앤 드롭</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                    </>
                  ) : (
                    <div className="relative w-full aspect-square max-w-md mx-auto">
                      {/* Next.js Image 대신 일반 img 태그 사용 */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-contain rounded-lg w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 전파 중단
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Art Style Selection */}
            <div>
              <label className="block text-lg font-medium text-fuchsia-900 mb-2">
                아트 스타일 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {(showAllStyles ? artStyles : popularStyles).map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleStyleSelect(style)}
                    className={`p-2 text-sm rounded-lg transition-all ${
                      selectedStyle?.id === style.id
                        ? 'bg-fuchsia-600 text-white font-bold shadow-md'
                        : 'bg-white border border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-50'
                    }`}
                  >
                    {style.koreanName}
                  </button>
                ))}
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllStyles(!showAllStyles)}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium"
              >
                {showAllStyles ? '적게 보기' : '모든 스타일 보기'}
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                // disabled={loading}
                disabled={true}
                className={`gradient-button px-8 py-3 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리 중...
                  </span>
                ) : selectedStyle ? `${selectedStyle.koreanName} 스타일로 생성하기 (한도초과)` : '예술가 따라하기(한도 초과)'}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="reset-button px-6 py-3 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                초기화
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}
          </form>
        </div>

        {/* Result Section */}
        <div className="art-card bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-fuchsia-100">
          {generatedImage || (originalImage && loading) ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-fuchsia-900 mb-4">
                {selectedStyle ? `${selectedStyle.koreanName} 스타일로 생성된 이미지` : '생성된 이미지'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {originalImage && (
                  <div className="relative aspect-square">
                    <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
                    <img
                      src={originalImage}
                      alt="Original Image"
                      className="object-contain rounded-lg border border-gray-200 w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm py-1 rounded-b-lg">
                      원본
                    </div>
                  </div>
                )}
                
                <div className="relative aspect-square">
                  {generatedImage ? (
                    <>
                      <img
                        src={generatedImage}
                        alt="Generated Image"
                        className="object-contain rounded-lg border border-gray-200 w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm py-1 rounded-b-lg">
                        {selectedStyle ? `${selectedStyle.koreanName} 스타일` : '생성됨'}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full w-full border border-gray-200 rounded-lg">
                      <div className="text-center p-4">
                        <div className="mx-auto mb-3 relative w-16 h-16">
                          {/* 원형 프로그레스 배경 */}
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle 
                              className="text-gray-200" 
                              strokeWidth="8" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="45" 
                              cx="50" 
                              cy="50" 
                            />
                          </svg>
                          
                          {/* 원형 프로그레스 진행 표시 - 시계 방향으로 진행 */}
                          <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90" viewBox="0 0 100 100">
                            <circle 
                              className="text-fuchsia-500" 
                              strokeWidth="8" 
                              strokeDasharray={`${2 * Math.PI * 45}`}
                              strokeDashoffset={`${2 * Math.PI * 45 * (timeRemaining / 60)}`}
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="45" 
                              cx="50" 
                              cy="50" 
                            />
                          </svg>
                          
                          {/* 중앙 카운트다운 숫자 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-fuchsia-700 font-bold text-lg">{timeRemaining}</span>
                          </div>
                        </div>
                        <p className="text-fuchsia-700 font-medium">처리 중...</p>
                        <p className="text-gray-500 text-sm mt-1">곧 완료됩니다</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {generatedImage && (
                <div className="flex justify-center gap-3 mt-4">
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    className="gradient-button px-4 py-2 text-white font-bold rounded-full text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    다운로드
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-fuchsia-50 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-fuchsia-900 mb-2">이미지를 업로드하고 스타일을 선택해주세요</h3>
              <p className="text-gray-600">
                다양한 예술 스타일 중 하나를 선택하여 AI로 이미지를 변환해보세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 이미지 생성 히스토리 */}
      <div className="mt-16">
        <ImageGenerationHistory limitCount={6} refreshTrigger={refreshHistory} />
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <Link href="/" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
            ← 홈으로 돌아가기
          </Link>
          <Link href="/image/statistics" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            스타일 사용 통계 보기
          </Link>
        </div>
      </div>
      
      {/* 닉네임 모달 */}
      <NicknameModal 
        isOpen={showNicknameModal} 
        onClose={() => {
          setShowNicknameModal(false);
          setPendingImageGeneration(null);
        }} 
        onSubmit={handleNicknameSubmit}
        isSubmitting={submittingNickname}
      />
    </div>
  );
}