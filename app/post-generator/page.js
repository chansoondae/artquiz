'use client';

import { useState } from 'react';

const popularExhibitions = [
  { title: '론 뮤익', place: '국립현대미술관 서울관' },
  { title: '샤갈', place: '예술의전당' },
  { title: '모네에서 앤디워홀', place: '세종문화회관' },
  { title: '겸재정선', place: '호암' },
  { title: '피에르 위그: 리미널', place: '리움' },
];

const popularPlaces = ['국립현대미술관 서울관', '예술의전당', '세종문화회관', '호암', '리움'];

export default function ArtPostPage() {
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(today);
  const [highlight, setHighlight] = useState('');
  const [companion, setCompanion] = useState('');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');

  const handleSubmit = async () => {
    const payload = { title, place, date, highlight, companion, tip };
    setLoading(true);
    setGeneratedPost('');

    try {
      const response = await fetch("/api/generatePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate post");
      }

      const { result } = await response.json();
      setGeneratedPost(result);
    } catch (error) {
      console.error("❌ 글 생성 실패:", error);
      alert("❌ 글 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-fuchsia-900 text-center mb-6">아트프렌즈 글 자동 생성</h1>

      <div className="space-y-6">
        <div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                 placeholder="전시명" disabled={loading}
                 className="w-full border border-fuchsia-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
          <div className="flex flex-wrap gap-2 mt-2">
            {popularExhibitions.map((ex, idx) => (
              <button key={idx} disabled={loading} onClick={() => { setTitle(ex.title); setPlace(ex.place); }}
                      className="px-3 py-1 text-sm bg-fuchsia-100 text-fuchsia-800 rounded-lg hover:bg-fuchsia-200 transition">
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)}
                 placeholder="장소" disabled={loading}
                 className="w-full border border-fuchsia-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <div className="flex flex-wrap gap-2 mt-2">
            {popularPlaces.map((pl, idx) => (
              <button key={idx} disabled={loading} onClick={() => setPlace(pl)}
                      className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition">
                {pl}
              </button>
            ))}
          </div>
        </div>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading}
               className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />

        <textarea value={highlight} onChange={(e) => setHighlight(e.target.value)}
                  placeholder="감상 포인트 (작품 내용, 작가 정보 등)" disabled={loading}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" rows={3} />

        <div className="space-y-2">
          <p className="font-semibold text-fuchsia-900">함께 간 사람</p>
          <div className="flex gap-4">
            {['혼자', '친구', '아트프렌즈 멤버들과 함께'].map((option) => (
              <label key={option} className="flex items-center gap-2 text-fuchsia-800">
                <input type="radio" value={option} checked={companion === option} disabled={loading}
                       onChange={() => setCompanion(option)} className="accent-fuchsia-600" />
                {option}
              </label>
            ))}
          </div>
        </div>

        <textarea value={tip} onChange={(e) => setTip(e.target.value)} disabled={loading}
                  placeholder="기타 느낌/팁 (날씨, 맛집, 관람 팁 등)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" rows={3} />

        <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-2 rounded-full font-bold text-lg shadow-md hover:from-pink-600 hover:to-fuchsia-700 transition">
          {loading ? '후기 생성 중...' : '후기 생성하기'}
        </button>

        {loading && <div className="text-center text-fuchsia-700 animate-pulse">✨ 글을 생성 중입니다...</div>}

        {generatedPost && (
          <div className="mt-8 p-4 border-2 border-fuchsia-300 rounded-xl whitespace-pre-wrap bg-fuchsia-50 text-fuchsia-900">
            {generatedPost}
          </div>
        )}
      </div>
    </main>
  );
}