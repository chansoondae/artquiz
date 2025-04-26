//app/ArtworkFrameAligner/ArtworkFrameAligner.js

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';

const ArtworkFrameAligner = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cv, setCv] = useState(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const [isLoadingCV, setIsLoadingCV] = useState(true);

  useEffect(() => {
    const loadOpenCV = async () => {
      setIsLoadingCV(true);
      const opencvSources = [
        'https://docs.opencv.org/4.7.0/opencv.js',
        'https://docs.opencv.org/4.5.5/opencv.js',
        'https://docs.opencv.org/4.6.0/opencv.js'
      ];
      let loaded = false;
      for (const source of opencvSources) {
        if (loaded) break;
        try {
          const script = document.createElement('script');
          script.src = source;
          script.async = true;
          await new Promise((resolve, reject) => {
            script.onload = () => {
              if (window.cv) {
                setCv(window.cv);
                setIsLoadingCV(false);
                console.log(`OpenCV loaded successfully from ${source}`);
                loaded = true;
                resolve();
              } else {
                reject(new Error('OpenCV object not found'));
              }
            };
            script.onerror = () => reject(new Error(`Failed to load OpenCV from ${source}`));
            document.body.appendChild(script);
          });
        } catch (error) {
          console.error('Error loading OpenCV:', error);
        }
      }
      if (!loaded) {
        console.error('Failed to load OpenCV');
        setIsLoadingCV(false);
        setErrorMsg('OpenCV 로딩 실패. 페이지를 새로고침하거나 다시 시도해주세요.');
      }
    };
    loadOpenCV();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMsg('');

    clearDebugCanvases();

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        setRotation(0);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Firebase에 정렬 통계 업데이트 함수
  const updateAlignmentStats = async () => {
    try {
      const statsRef = doc(db, 'statistics', 'numAlign');
      const clientTimestamp = new Date(); // 클라이언트 타임스탬프 생성
      
      // 문서가 존재하는지 확인
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        // 문서가 존재하면 카운트 증가 및 최근 사용 시간 업데이트
        await updateDoc(statsRef, {
          count: increment(1),
          lastUsed: serverTimestamp(),
          usageLog: [...(statsDoc.data().usageLog || []), {
            timestamp: clientTimestamp, // 클라이언트 타임스탬프 사용
          }]
        });
      } else {
        // 문서가 존재하지 않으면 새로 생성
        await setDoc(statsRef, {
          count: 1,
          firstUsed: serverTimestamp(),
          lastUsed: serverTimestamp(),
          usageLog: [{
            timestamp: clientTimestamp, // 클라이언트 타임스탬프 사용
          }]
        });
      }
      
      console.log('Alignment usage statistics updated successfully');
    } catch (error) {
      console.error('Failed to update alignment statistics:', error);
      // 통계 업데이트 실패해도 사용자 경험에 영향 없도록 에러 메시지 표시하지 않음
    }
  };

  const processImage = () => {
    if (!originalImage || !cv) {
      setErrorMsg('이미지가 없거나 OpenCV가 준비되지 않았습니다.');
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const canvas = canvasRef.current;
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(originalImage, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      const src = cv.matFromImageData(imgData);
      const dst = new cv.Mat();
      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edges = new cv.Mat();
      const thresh = new cv.Mat();
  
      // 1. 그레이 변환
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
      // 2. 블러 처리 (노이즈 제거)
      cv.GaussianBlur(gray, blurred, new cv.Size(7, 7), 0);
  
      // 3. Adaptive Threshold로 이진화
      cv.adaptiveThreshold(
        blurred, thresh,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY_INV,
        11, 2
      );
  
      // 4. Dilation(팽창)으로 외곽선 강화
      const M = cv.Mat.ones(5, 5, cv.CV_8U);
      cv.dilate(thresh, thresh, M);
  
      // ✅ 디버깅: Canny Edge 대신 thresh 결과 출력
      const debugEdges = document.getElementById('debug-edges');
      if (debugEdges) cv.imshow(debugEdges, thresh);
  
      // 5. HoughLinesP 검출
      const lines = new cv.Mat();
      cv.HoughLinesP(thresh, lines, 1, Math.PI / 180, 100, 100, 10);
  
      const colorSrc = new cv.Mat();
      cv.cvtColor(gray, colorSrc, cv.COLOR_GRAY2RGBA, 0);
      for (let i = 0; i < lines.rows; ++i) {
        const [x1, y1, x2, y2] = lines.data32S.slice(i * 4, i * 4 + 4);
        cv.line(colorSrc, new cv.Point(x1, y1), new cv.Point(x2, y2), [255, 0, 0, 255], 2);
      }
      const debugLines = document.getElementById('debug-lines');
      if (debugLines) cv.imshow(debugLines, colorSrc);
  
      // 6. Contours 검출
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
      const contourDebug = new cv.Mat.zeros(thresh.rows, thresh.cols, cv.CV_8UC3);
      for (let i = 0; i < contours.size(); ++i) {
        const color = new cv.Scalar(Math.random() * 255, Math.random() * 255, Math.random() * 255);
        cv.drawContours(contourDebug, contours, i, color, 1, cv.LINE_8, hierarchy, 0);
      }
      const debugContours = document.getElementById('debug-contours');
      if (debugContours) cv.imshow(debugContours, contourDebug);
  
      // 7. 가장 큰 Contour 찾기 (Aspect Ratio 조건 추가)
      let bestContour = null;
      let maxArea = 0;
  
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
  
        if (area > maxArea) {
          const rect = cv.boundingRect(contour);
          const aspectRatio = rect.width / rect.height;
  
          if (aspectRatio > 0.6 && aspectRatio < 1.4) {  // 거의 정사각형 또는 약간 직사각형
            bestContour = contour;
            maxArea = area;
          }
        }
      }
  
      if (bestContour) {
        const epsilon = 0.02 * cv.arcLength(bestContour, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(bestContour, approx, epsilon, true);
  
        let corners = [];
  
        if (approx.rows >= 4) {
          const hull = new cv.Mat();
          cv.convexHull(approx, hull, true, true);
  
          if (hull.rows >= 4) {
            for (let i = 0; i < 4; i++) {
              corners.push({
                x: hull.data32S[i * 2],
                y: hull.data32S[i * 2 + 1]
              });
            }
          }
          hull.delete();
        }
  
        if (corners.length === 4) {
          corners.sort((a, b) => a.y - b.y);
          const top = corners.slice(0, 2).sort((a, b) => a.x - b.x);
          const bottom = corners.slice(2, 4).sort((a, b) => a.x - b.x);
          const sortedCorners = [...top, ...bottom.reverse()];
  
          const dx = sortedCorners[1].x - sortedCorners[0].x;
          const dy = sortedCorners[1].y - sortedCorners[0].y;
          const angleRad = Math.atan2(dy, dx);
          const angleDeg = angleRad * (180 / Math.PI);
          setRotation(angleDeg);
  
          const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            sortedCorners[0].x, sortedCorners[0].y,
            sortedCorners[1].x, sortedCorners[1].y,
            sortedCorners[2].x, sortedCorners[2].y,
            sortedCorners[3].x, sortedCorners[3].y,
          ]);
  
          const width = Math.max(
            Math.hypot(sortedCorners[1].x - sortedCorners[0].x, sortedCorners[1].y - sortedCorners[0].y),
            Math.hypot(sortedCorners[3].x - sortedCorners[2].x, sortedCorners[3].y - sortedCorners[2].y)
          );
  
          const height = Math.max(
            Math.hypot(sortedCorners[3].x - sortedCorners[0].x, sortedCorners[3].y - sortedCorners[0].y),
            Math.hypot(sortedCorners[2].x - sortedCorners[1].x, sortedCorners[2].y - sortedCorners[1].y)
          );
  
          const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            width, 0,
            width, height,
            0, height
          ]);
  
          const perspectiveM = cv.getPerspectiveTransform(srcPoints, dstPoints);
          cv.warpPerspective(src, dst, perspectiveM, new cv.Size(width, height));
  
          const outputCanvas = outputCanvasRef.current;
          outputCanvas.width = width;
          outputCanvas.height = height;
          cv.imshow(outputCanvas, dst);
  
          setProcessedImage(outputCanvas.toDataURL());
  
          srcPoints.delete();
          dstPoints.delete();
          perspectiveM.delete();
        } else {
          setErrorMsg('프레임 꼭짓점을 정확히 찾을 수 없습니다.');
        }
        approx.delete();
      } else {
        setErrorMsg('적합한 프레임을 찾을 수 없습니다.');
      }
  
      src.delete(); dst.delete(); gray.delete(); blurred.delete(); edges.delete(); thresh.delete(); lines.delete(); contours.delete(); hierarchy.delete();
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      setErrorMsg('이미지 처리 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessClick = () => {
    setIsProcessing(true);
    
    // Firebase에 통계 업데이트
    // updateAlignmentStats();
  
    setTimeout(() => {
      processImage();
    }, 100); // 100ms 정도만 줘도 충분!
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'aligned-artwork.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearDebugCanvases = () => {
    const ids = ['debug-edges', 'debug-lines', 'debug-contours'];
    ids.forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        // ✅ 캔버스 크기 초기화 (이게 가장 확실하게 깨끗하게 지우는 방법)
        const width = canvas.width;
        const height = canvas.height;
        canvas.width = width;   // width를 재설정하면 clear됨
        canvas.height = height; // height도 재설정
      }
    });
  };


  return (
    <div className="flex flex-col items-center w-full">
      {isLoadingCV && (
        <div className="w-full max-w-lg mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          이미지 처리 엔진(OpenCV)을 로딩 중입니다...
        </div>
      )}
      
      <div className="mb-6 w-full max-w-lg">
        <label htmlFor="image-upload" className="block mb-2 text-lg font-medium text-gray-700">
          미술 작품 이미지 선택
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isProcessing} 
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <button
          onClick={handleProcessClick}
          disabled={!originalImage || isProcessing || !cv}
          className={`w-full mt-4 p-3 rounded-md text-white font-medium transition-colors ${
            !originalImage || isProcessing || !cv
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800'
          }`}
        >
          {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </>
            ) : (
              '프레임 정렬하기'
            )}
        </button>
        
        {/* 버튼 비활성화 이유 표시 */}
        {(!originalImage || isProcessing || !cv) && (
          <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-md border border-orange-200">
            {!originalImage && <p>⚠️ 이미지를 먼저 업로드해주세요.</p>}
            {!cv && <p>⚠️ OpenCV 라이브러리를 로딩 중입니다. 잠시만 기다려주세요.</p>}
            {isProcessing && <p>⚠️ 이미지 처리가 진행 중입니다.</p>}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="w-full max-w-lg p-3 mb-4 bg-red-100 text-red-700 rounded-md border border-red-300">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-l-4 border-indigo-500 pl-3">원본 이미지</h2>
          {originalImage ? (
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <img
                src={originalImage.src}
                alt="Original"
                className="max-w-full h-auto"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-md p-12 text-center text-gray-500 bg-gray-50">
              이미지를 업로드해주세요
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="flex-1 min-w-0 mt-6 md:mt-0">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-l-4 border-indigo-500 pl-3">
            정렬된 이미지 {rotation !== 0 && `(회전: ${rotation.toFixed(2)}°)`}
          </h2>
          {processedImage ? (
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <img
                src={processedImage}
                alt="Processed"
                className="max-w-full h-auto"
              />
              <div className="p-3 bg-gray-50 border-t border-gray-300">
                <button
                  onClick={downloadImage}
                  className="w-full p-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-md font-medium transition-colors"
                >
                  이미지 다운로드
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-md p-12 text-center text-gray-500 bg-gray-50">
              처리된 이미지가 여기에 표시됩니다
            </div>
          )}
          <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
        </div>
      </div>
        {/* 디버깅용 캔버스 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div>
            <h3 className="text-center text-sm font-medium mb-2 text-gray-700">Canny Edge 결과</h3>
            <canvas id="debug-edges" className="border rounded shadow w-full max-w-[400px] mx-auto" />
          </div>
          <div>
            <h3 className="text-center text-sm font-medium mb-2 text-gray-700">Hough Lines 결과</h3>
            <canvas id="debug-lines" className="border rounded shadow w-full max-w-[400px] mx-auto" />
          </div>
          <div>
            <h3 className="text-center text-sm font-medium mb-2 text-gray-700">Contours 결과</h3>
            <canvas id="debug-contours" className="border rounded shadow w-full max-w-[400px] mx-auto" />
          </div>
      </div>
    </div>
  );
};

export default ArtworkFrameAligner;