"use client"

import React, { useState } from 'react';
import { Gift, Calendar, MapPin, Users, Star, ChevronDown, Search, Filter, Bell, Clock } from 'lucide-react';

export default function ArtBusMain() {
  const [activeTab, setActiveTab] = useState('전체');
  const [sortBy, setSortBy] = useState('추천순');
  const [viewMode, setViewMode] = useState('individual');
  const [selectedFilter, setSelectedFilter] = useState('전체');

  const tabs = ['전체', '🖼️ 아트 버스', '📷 포토 버스'];
  const filterOptions = ['전체', '출발일순', '지역별', '예약 가능', '종료된 아트버스'];

  const tours = [
    {
      id: 1,
      title: '[6/21] 원주 뮤지엄산 🚌 아트버스',
      location: '합정/양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 156,
      venue: '원주 뮤지엄산',
      date: '6/21',
      soldOut: false,
      isEnded: false,
      city: 'wonju'
    },
    {
      id: 2,
      title: '[6/25] 원주 뮤지엄산 🚌 아트버스',
      location: '양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 203,
      venue: '원주 뮤지엄산',
      date: '6/25',
      soldOut: true,
      isEnded: false,
      city: 'wonju'
    },
    {
      id: 3,
      title: '[5/28] 원주 뮤지엄산 🚌 아트버스',
      location: '합정/양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 89,
      venue: '원주 뮤지엄산',
      date: '5/28',
      soldOut: false,
      isEnded: true,
      city: 'wonju'
    },
    {
      id: 4,
      title: '[7/5] 대구간송 & 대구미술관 션 스컬리',
      location: '합정/양재 출발',
      price: '38,000원~',
      image: '/api/placeholder/300/200',
      tag: '대구',
      rating: 5.0,
      participants: 234,
      festival: true,
      venue: '대구간송 & 대구미술관',
      date: '7/5',
      soldOut: false,
      isEnded: false,
      city: 'daegu'
    },
    {
      id: 5,
      title: '[7/12] 광주 아시아문화전당 투어',
      location: '강남 출발',
      price: '35,000원~',
      image: '/api/placeholder/300/200',
      tag: '광주',
      rating: 4.8,
      participants: 156,
      venue: '아시아 문화전당',
      date: '7/12',
      soldOut: false,
      isEnded: false,
      city: 'gwangju'
    },
    {
      id: 6,
      title: '[7/20] 부산현대미술관 특별전',
      location: '서울역 출발',
      price: '42,000원~',
      image: '/api/placeholder/300/200',
      tag: '부산',
      rating: 4.9,
      participants: 187,
      venue: '부산현대 미술관',
      date: '7/20',
      soldOut: true,
      isEnded: false,
      city: 'busan'
    }
  ];

  const cityLocations = {
    seoul: {
      name: '서울',
      venue: '출발지',
      top: '30%',
      left: '46%'
    },
    wonju: { 
      name: '원주', 
      venue: '뮤지엄산', 
      top: '26%',
      left: '53%',
      boxTop: '20%',
      boxLeft: '75%',
      transform: 'translate(250%, 10%)'
    },
    gwangju: { 
      name: '광주', 
      venue: '아시아 문화전당', 
      top: '65%',
      left: '40%',
      boxTop: '90%',
      boxLeft: '10%',
      transform: 'translate(60%, 180%)'
    },
    daegu: { 
      name: '대구', 
      venue: '간송미술관\n대구 미술관', 
      top: '45%',
      left: '55%',
      boxTop: '50%',
      boxLeft: '80%',
      transform: 'translate(250%, 100%)'
    },
    busan: { 
      name: '부산', 
      venue: '부산현대 미술관', 
      top: '60%',
      left: '59%',
      boxTop: '100%',
      boxLeft: '50%',
      transform: 'translate(250%, 210%)'
    }
  };

  const destinations = ['wonju', 'gwangju', 'daegu', 'busan'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              ART BUS
            </h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <nav className="flex space-x-6">
                  <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">투어</a>
                  <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">예약확인</a>
                  <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">고객센터</a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 bg-gradient-to-r from-pink-200 to-orange-200">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-md max-w-6xl p-8 cursor-pointer">
            <div className="flex items-center space-x-3">
              <Gift className="text-pink-500 w-8 h-8" />
              <p className="text-lg text-gray-700 font-medium">
                친구에게 아트버스 티켓을 보내보세요! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

              {/* Request Section */}
              <section className="relative py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide space-x-4">
              <div className="flex-shrink-0 bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/20 min-w-80">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🚌</div>
                  <div>
                    <p className="text-xl text-gray-700 font-bold mb-1">
                      신규 셔틀 개설 문의! ✨
                    </p>
                    <p className="text-sm text-gray-600">
                      원하는 행사나 노선을 요청하세요 &gt;
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/20 min-w-80">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🤝</div>
                  <div>
                    <p className="text-xl text-gray-700 font-bold mb-1">
                      함께 만드는 더 나은 셔틀! ✨
                    </p>
                    <p className="text-sm text-gray-600">
                      소중한 의견을 전해주세요 &gt;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pb-8">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide backdrop-blur-md p-2 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Korea Map Section */}
        <div className="p-4 bg-white">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">전국 아트버스 투어</h2>
            
            {/* Extended Container for Map + Info Boxes */}
            <div className="relative mx-auto w-full max-w-4xl h-[500px] mb-8">
  
              
                {/* Korea Map */}
              
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-no-repeat opacity-90 z-0"
                  style={{
                    backgroundImage: `url('/koreamap.jpg')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center 60%'
                  }}
                >
                </div>

                {/* Seoul Center Marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                  style={{ top: cityLocations.seoul.top, left: cityLocations.seoul.left }}
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-xl animate-pulse">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap">
                    서울 출발
                  </div>
                </div>

                {/* Curved Routes from Seoul to each city */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {destinations.map((cityKey, index) => {
                    const city = cityLocations[cityKey];
                    const seoul = cityLocations.seoul;
                    
                    // 곡선의 제어점 계산 (중간점을 위나 아래로 이동시켜 곡선 생성)
                    const startX = parseFloat(seoul.left);
                    const startY = parseFloat(seoul.top);
                    const endX = parseFloat(city.left);
                    const endY = parseFloat(city.top);
                    
                    // 곡선의 높이 조정 (도시별로 다른 곡선)
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    const curveOffset = index % 2 === 0 ? -15 : 15; // 위아래 번갈아가며
                    const controlY = midY + curveOffset;
                    
                    return (
                      <g key={cityKey}>
                        {/* 메인 곡선 */}
                        <path
                          d={`M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`}
                          stroke="#ec4899"
                          strokeWidth="0.4"
                          fill="none"
                          opacity="0.8"
                          strokeDasharray="2,1"
                          className="animate-pulse"
                        />
                        {/* 그림자 곡선 */}
                        <path
                          d={`M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`}
                          stroke="#f97316"
                          strokeWidth="0.2"
                          fill="none"
                          opacity="0.4"
                          strokeDasharray="2,1"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* City Markers with Info Boxes */}
                {destinations.map((cityKey) => {
                  const city = cityLocations[cityKey];
                  return (
                    <div key={cityKey}>
                      {/* Marker */}
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                        style={{ top: city.top, left: city.left }}
                      >
                        <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform cursor-pointer">
                          <div className="absolute inset-0 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
                        </div>
                      </div>

                      {/* Info Box */}
                      <div
                        className="absolute z-30 group"
                        style={{ 
                          top: `${city.boxTop}%`, 
                          left: `${city.boxLeft}%`,
                          transform: city.transform || 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-3 min-w-52 hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer">
                          {/* Header with city icon */}
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              cityKey === 'wonju' ? 'bg-green-400' :
                              cityKey === 'gwangju' ? 'bg-purple-400' :
                              cityKey === 'daegu' ? 'bg-red-400' : 'bg-orange-400'
                            } shadow-lg`}></div>
                            <div className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {city.name}
                            </div>
                          </div>
                          
                          {/* Venue info */}
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                              {city.venue}
                            </div>
                            
                            {/* Bottom accent */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500 font-medium">아트버스 운행</span>
                              </div>
                              {/* <div className={`w-6 h-1 rounded-full ${
                                cityKey === 'wonju' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                                cityKey === 'gwangju' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                                cityKey === 'daegu' ? 'bg-gradient-to-r from-red-400 to-pink-400' : 
                                'bg-gradient-to-r from-orange-400 to-red-400'
                              }`}></div> */}
                            </div>
                          </div>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Info Box Connection Line */}
                      <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none z-15"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1={parseFloat(city.left)}
                          y1={parseFloat(city.top)}
                          x2={parseFloat(city.boxLeft)}
                          y2={parseFloat(city.boxTop)}
                          stroke="#94a3b8"
                          strokeWidth="0.2"
                          strokeDasharray="1,1"
                          opacity="0.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  );
                })}
              
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-4 bg-white">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="뮤지엄산, 원주, 대구, 아시아문화전당, 간송미술관..."
                className="pl-12 pr-4 py-4 w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-gray-200 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 placeholder-gray-500 text-base"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap justify-center gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 font-medium transition-all duration-300 ${
                    selectedFilter === option
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white/70 backdrop-blur-md border-gray-200 hover:border-pink-300 text-gray-700'
                  }`}
                >
                  <span>{option}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter and Sort */}
        <div className="flex justify-between items-center p-4 bg-white">
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="font-medium">총 {tours.length}개</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">보기:</span>
              <button
                onClick={() => setViewMode('individual')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'individual'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                }`}
              >
                일정별
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'grouped'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                }`}
              >
                장소별
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 hover:border-pink-300 transition-colors">
              <Filter className="w-4 h-4" />
              <span>필터</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 hover:border-pink-300 transition-colors">
              <span>{sortBy}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tour Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className={`group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 relative ${
                tour.isEnded 
                  ? 'border-gray-200 opacity-60' 
                  : tour.soldOut 
                    ? 'border-orange-300' 
                    : 'border-pink-300 border-opacity-80'
              }`}
            >
              {/* Status Overlays */}
              {tour.isEnded && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-10 rounded-3xl flex items-center justify-center">
                  <div className="bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>종료됨</span>
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="relative overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${
                  tour.festival 
                    ? 'from-purple-600 via-pink-600 to-orange-600' 
                    : tour.city === 'wonju'
                      ? 'from-green-500 via-teal-500 to-blue-600'
                      : tour.city === 'gwangju'
                        ? 'from-blue-500 via-purple-500 to-pink-500'
                        : tour.city === 'daegu'
                          ? 'from-red-500 via-pink-500 to-purple-500'
                          : 'from-orange-500 via-red-500 to-pink-500'
                } flex items-center justify-center`}>
                  {tour.festival ? (
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold mb-2">Sean Scully</div>
                      <div className="text-lg font-bold">DAEGU ART MUSEUM</div>
                      <div className="text-sm">MAR/18~AUG/17</div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="text-lg font-bold mb-2">{tour.venue}</div>
                      <div className="text-sm">{tour.date}</div>
                      <div className="text-xs mt-2">{tour.location}</div>
                    </div>
                  )}
                </div>
                
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tour.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{tour.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`font-bold text-lg mb-3 group-hover:text-pink-600 transition-colors line-clamp-2 ${
                  tour.isEnded ? 'text-gray-500' : 'text-gray-800'
                }`}>
                  {tour.title}
                </h3>
                
                <div className={`flex items-center space-x-2 mb-3 ${
                  tour.isEnded ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tour.location}</span>
                </div>

                <div className={`flex items-center space-x-2 mb-4 ${
                  tour.isEnded ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{tour.participants}명 참여</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className={`text-2xl font-bold ${
                    tour.isEnded ? 'text-gray-400' : 'text-pink-600'
                  }`}>
                    {tour.price}
                  </div>
                  
                  {tour.isEnded ? (
                    <button className="px-6 py-2 rounded-xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed">
                      종료됨
                    </button>
                  ) : tour.soldOut ? (
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                        대기
                      </button>
                      <button className="px-4 py-2 rounded-xl font-medium border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors flex items-center space-x-1">
                        <Bell className="w-4 h-4" />
                        <span>알림</span>
                      </button>
                    </div>
                  ) : (
                    <button className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                      예약
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white/70 backdrop-blur-md text-gray-700 px-8 py-3 rounded-2xl font-medium hover:bg-white/90 transition-colors border border-gray-200 hover:border-pink-300">
            더 많은 투어 보기
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
          <Calendar className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}