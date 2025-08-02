"use client"

import React, { useState } from 'react';
import { Gift, Calendar, MapPin, Users, Star, ChevronDown, Search, Filter } from 'lucide-react';

export default function ArtBusMain() {
  const [activeTab, setActiveTab] = useState('전체');
  const [sortBy, setSortBy] = useState('추천순');
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'grouped'

  const tabs = ['전체', '🖼️ 아트 버스', '📷 포토 버스'];

  const tours = [
    {
      id: 1,
      title: '[6/21] 원주 뮤지엄산 🚌 아트버스',
      location: '합정/양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 26,
      venue: '원주 뮤지엄산',
      date: '6/21',
      soldOut: false
    },
    {
      id: 4,
      title: '[7/5] 대구간송 & 대구미술관 션 스컬리',
      location: '합정/양재 출발',
      price: '38,000원~',
      image: '/api/placeholder/300/200',
      tag: '대구',
      rating: 5.0,
      participants: 26,
      festival: true,
      venue: '대구간송 & 대구미술관',
      date: '7/5',
      soldOut: false
    },
    {
      id: 2,
      title: '[6/25] 원주 뮤지엄산 🚌 아트버스',
      location: '양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 26,
      venue: '원주 뮤지엄산',
      date: '6/25',
      soldOut: false
    },
    {
      id: 3,
      title: '[6/28] 원주 뮤지엄산 🚌 아트버스',
      location: '합정/양재 출발',
      price: '20,000원~',
      image: '/api/placeholder/300/200',
      tag: '강원',
      rating: 5.0,
      participants: 26,
      venue: '원주 뮤지엄산',
      date: '6/28',
      soldOut: false
    }
  ];

  // Group tours by venue for grouped view
  const groupedTours = tours.reduce((acc, tour) => {
    if (!acc[tour.venue]) {
      acc[tour.venue] = [];
    }
    acc[tour.venue].push(tour);
    return acc;
  }, {});

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
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="뮤지엄산, 원주, 대구, 사유원, 간송미술관..."
                  className="pl-10 pr-4 py-2 w-80 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 placeholder-gray-500 text-sm"
                />
              </div>
              
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
      <section className="relative px-4 bg-gradient-to-r from-pink-200 to-orange-200 ">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-md max-w-6xl  p-8 cursor-pointer">
            <div className="flex items-center space-x-3">
              <Gift className="text-pink-500 w-8 h-8" />
              <p className="text-lg text-gray-700 font-medium">
                친구에게 아트버스 티켓을 보내보세요! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pb-8 ">
                {/* Form Section */}
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

        {/* Category Tabs */}
        <div className="flex rounded-3xl overflow-x-auto scrollbar-hide backdrop-blur-md p-4 m-4  bg-white ">
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

        {/* Filter and Sort */}
        <div className="flex rounded-3xl justify-between items-center p-4 m-4  bg-white">
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="font-medium">총 40개</span>
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
        {viewMode === 'individual' ? (
          // Individual date view (current)
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 relative"
              >
                {/* Sold Out Badge */}
                {tour.soldOut && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-10 rounded-3xl flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                      품절
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className={`h-64 bg-gradient-to-br ${
                    tour.festival 
                      ? 'from-purple-600 via-pink-600 to-orange-600' 
                      : 'from-green-500 via-teal-500 to-blue-600' 
                  } flex items-center justify-center`}>
                    {tour.festival ? (
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-2">Sean Scully</div>
                        <div className="text-2xl font-bold">DAEGU ART MUSEUM</div>
                        <div className="text-xl">MAR/18~AUG/17</div>
                        <div className="mt-4 text-sm opacity-90">The Horizontal and The Vertical</div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="text-lg font-bold mb-2">Antony Gormley</div>
                        <div className="text-sm">JUN/20~NOV/30</div>
                        <div className="text-sm">MUSEUM SAN</div>
                        <div className="text-xs mt-2">10:00~18:00</div>
                        <div className="text-xs">@museumsan_official</div>
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
                  <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {tour.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tour.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tour.participants}명 참여</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-pink-600">
                      {tour.price}
                    </div>
                    <button 
                      disabled={tour.soldOut}
                      className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                        tour.soldOut 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {tour.soldOut ? '품절' : '예약'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grouped venue view
          <div className="p-4 space-y-8">
            {Object.entries(groupedTours).map(([venue, venueTours]) => (
              <div key={venue} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{venue}</h2>
                
                {/* Venue description */}
                <div className="mb-6">
                  <div className={`h-32 rounded-2xl bg-gradient-to-br ${
                    venueTours[0].festival 
                      ? 'from-purple-600 via-pink-600 to-orange-600' 
                      : 'from-green-500 via-teal-500 to-blue-600' 
                  } flex items-center justify-center`}>
                    {venueTours[0].festival ? (
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold">Sean Scully Exhibition</div>
                        <div className="text-sm">MAR/18~AUG/17</div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="text-xl font-bold">Antony Gormley</div>
                        <div className="text-sm">JUN/20~NOV/30</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Available dates */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">출발 일정</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {venueTours.map((tour) => (
                      <div 
                        key={tour.id} 
                        className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                          tour.soldOut 
                            ? 'border-gray-300 bg-gray-100 text-gray-500'
                            : 'border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100'
                        }`}
                      >
                        <div className="font-bold text-lg">{tour.date}</div>
                        <div className="text-sm text-gray-600">{tour.location}</div>
                        <div className="text-sm text-gray-600">{tour.participants}명 참여</div>
                        <div className="text-pink-600 font-bold mt-2">
                          {tour.soldOut ? '품절' : tour.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book button */}
                <div className="flex justify-end">
                  <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                    일정 선택하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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