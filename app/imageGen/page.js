"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function ImageGenerator() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Reset generated image and error
      setGeneratedImage(null);
      setError('');
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
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
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', prompt);
      
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이미지 생성 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || '이미지 생성 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">이미지 생성기</h1>
        <p className="text-lg text-gray-700">이미지를 업로드하고 AI를 통해 새로운 작품을 만들어보세요!</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
      </header>

      <div className="art-card bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-fuchsia-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-lg font-medium text-fuchsia-900 mb-2">
              이미지 업로드
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-fuchsia-300 rounded-lg">
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
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
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

          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-fuchsia-900 mb-2">
              이미지 생성 프롬프트
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={4}
              value={prompt}
              onChange={handlePromptChange}
              placeholder="원하는 이미지 스타일과 내용을 상세히 설명해주세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`gradient-button px-8 py-3 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '생성 중...' : '이미지 생성하기'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </form>

        {/* Generated Image Result */}
        {generatedImage && (
          <div className="mt-8 p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-200">
            <h2 className="text-xl font-bold text-fuchsia-900 mb-4">생성된 이미지</h2>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src={generatedImage}
                alt="Generated Image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 flex justify-center">
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
          </div>
        )}
      </div>
    </div>
  );
}