//app/components/StyleStatistics.js
"use client";

import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const StyleStatistics = ({ limitCount = 5, className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [styleStats, setStyleStats] = useState([]);
  
  // 색상 배열
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
    '#d0ed57', '#ffc658', '#ff8042', '#ff6361', '#bc5090'
  ];
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // 스타일 통계 데이터 가져오기
      const styleStatsQuery = query(
        collection(db, 'styleStatistics'),
        orderBy('count', 'desc'),
        limit(limitCount)
      );
      
      const styleStatsSnapshot = await getDocs(styleStatsQuery);
      const stylesData = [];
      
      styleStatsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.count) {
          stylesData.push({
            id: doc.id,
            name: data.styleName || '알 수 없는 스타일',
            count: data.count,
            lastUsed: data.lastUsed?.toDate() || null
          });
        }
      });
      
      setStyleStats(stylesData);
      
    } catch (error) {
      console.error('Statistics fetching error:', error);
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 데이터 로딩 중 표시
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-40 ${className}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-fuchsia-900"></div>
      </div>
    );
  }
  
  // 오류 발생 시
  if (error) {
    return (
      <div className={`text-center text-red-500 ${className}`}>
        {error}
      </div>
    );
  }
  
  // 데이터가 없는 경우
  if (styleStats.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        아직 통계 데이터가 없습니다.
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-fuchsia-900 mb-4">인기 아트 스타일 Top {limitCount}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={styleStats}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.name} (${entry.count})`}
            >
              {styleStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}회`, '사용 횟수']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <ul className="space-y-2">
          {styleStats.map((style, index) => (
            <li key={style.id} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">
                {style.name}: <span className="font-medium">{style.count}회</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StyleStatistics;