//app/image/statistics/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import artStyles from '../../../utils/ArtStyles'; // 아트 스타일 데이터 임포트

export default function ImageStatistics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [styleStats, setStyleStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' | 'daily'
  
  // 색상 배열
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
    '#d0ed57', '#ffc658', '#ff8042', '#ff6361', '#bc5090', 
    '#58508d', '#003f5c', '#444e86', '#955196', '#dd5182', 
    '#ff6e54', '#ffa600'
  ];
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // 1. 스타일 통계 데이터 가져오기
      const styleStatsSnapshot = await getDocs(collection(db, 'styleStatistics'));
      const stylesData = [];
      let total = 0;
      
      styleStatsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.count) {
          total += data.count;
          stylesData.push({
            id: doc.id,
            name: data.styleName || '알 수 없는 스타일',
            count: data.count,
            lastUsed: data.lastUsed?.toDate() || null
          });
        }
      });
      
      // 사용량 기준으로 정렬
      stylesData.sort((a, b) => b.count - a.count);
      setStyleStats(stylesData);
      setTotalGenerations(total);
      
      // 2. 일별 통계 데이터 가져오기
      const dailyStatsSnapshot = await getDocs(
        query(collection(db, 'dailyStyleStatistics'), orderBy('date', 'desc'), limit(14))
      );
      
      const dailyData = [];
      dailyStatsSnapshot.forEach(doc => {
        const data = doc.data();
        const styles = data.styles || {};
        
        // 각 스타일의 카운트를 배열 형태로 변환
        const stylesArray = Object.entries(styles).map(([styleId, count]) => {
          // artStyles에서 해당 ID의 스타일 찾기
          const styleInfo = artStyles.find(style => style.id === styleId);
          return {
            styleId,
            name: styleInfo ? styleInfo.koreanName : '알 수 없는 스타일',
            count
          };
        });
        
        dailyData.push({
          date: data.date,
          total: Object.values(styles).reduce((sum, count) => sum + count, 0),
          styles: stylesArray
        });
      });
      
      // 날짜순으로 정렬 (오래된 것부터)
      dailyData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setDailyStats(dailyData);
      
    } catch (error) {
      console.error('Statistics fetching error:', error);
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 데이터 포맷팅 - 상위 10개 스타일만 표시
  const getTop10Styles = () => {
    if (!styleStats.length) return [];
    
    const top10 = styleStats.slice(0, 10);
    return top10.map((style, index) => ({
      ...style,
      fill: COLORS[index % COLORS.length]
    }));
  };
  
  // 일별 데이터 - 스타일별 차트용
  const formatDailyChartData = () => {
    if (!dailyStats.length) return [];
    
    // 가장 많이 사용된 상위 5개 스타일 ID 찾기
    const styleUsageCounts = {};
    styleStats.forEach(style => {
      styleUsageCounts[style.id] = style.count;
    });
    
    const topStyleIds = Object.entries(styleUsageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
    
    // 일별 데이터 포맷팅
    return dailyStats.map(day => {
      const result = { date: day.date };
      
      // 상위 5개 스타일에 대해서만 데이터 추가
      day.styles.forEach(style => {
        if (topStyleIds.includes(style.styleId)) {
          result[style.name] = style.count;
        }
      });
      
      return result;
    });
  };
  
  // 데이터 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">이미지 생성 통계</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
        </header>
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-900"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-fuchsia-900">이미지 생성 통계</h1>
        <p className="text-lg text-gray-700">지금까지 생성된 이미지의 스타일 통계를 확인하세요</p>
        <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 to-fuchsia-900 mx-auto mt-4"></div>
      </header>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-fuchsia-900">{totalGenerations}</div>
          <div className="text-gray-600">총 이미지 생성 횟수</div>
        </div>
        
        {/* 탭 메뉴 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'overall' 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'bg-white text-fuchsia-700 border border-fuchsia-300 hover:bg-fuchsia-50'
              }`}
            >
              전체 통계
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'daily'
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-white text-fuchsia-700 border border-fuchsia-300 hover:bg-fuchsia-50'
              }`}
            >
              일별 통계
            </button>
          </div>
        </div>
        
        {activeTab === 'overall' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 파이 차트 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-fuchsia-900 mb-4">스타일별 사용 비율</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTop10Styles()}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                    >
                      {getTop10Styles().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}회`, '사용 횟수']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                상위 10개 스타일만 표시됩니다
              </div>
            </div>
            
            {/* 바 차트 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-fuchsia-900 mb-4">인기 스타일 Top 10</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getTop10Styles()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value) => [`${value}회`, '사용 횟수']} />
                    <Bar dataKey="count" fill="#8884d8">
                      {getTop10Styles().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'daily' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-fuchsia-900 mb-4">일별 생성 통계</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatDailyChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {formatDailyChartData().length > 0 && 
                      styleStats.slice(0, 5).map((style, index) => (
                        <Bar 
                          key={style.id} 
                          dataKey={style.name} 
                          stackId="a" 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                최근 14일간의 데이터와 상위 5개 스타일만 표시됩니다
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 스타일 상세 테이블 */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-fuchsia-900 mb-4">스타일별 사용 현황</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-fuchsia-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-fuchsia-900 border-b border-fuchsia-100">스타일명</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-fuchsia-900 border-b border-fuchsia-100">사용 횟수</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-fuchsia-900 border-b border-fuchsia-100">마지막 사용</th>
              </tr>
            </thead>
            <tbody>
              {styleStats.map((style, index) => (
                <tr key={style.id} className={index % 2 === 0 ? 'bg-white' : 'bg-fuchsia-50'}>
                  <td className="py-2 px-4 border-b border-fuchsia-100">{style.name}</td>
                  <td className="py-2 px-4 border-b border-fuchsia-100">{style.count}회</td>
                  <td className="py-2 px-4 border-b border-fuchsia-100">
                    {style.lastUsed ? new Date(style.lastUsed).toLocaleDateString('ko-KR') : '-'}
                  </td>
                </tr>
              ))}
              
              {styleStats.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    아직 통계 데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/image" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
          ← 이미지 생성기로 돌아가기
        </Link>
      </div>
    </div>
  );
}