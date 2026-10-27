import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Heart, Send, Check } from 'lucide-react';
import { MealReview } from '../types/neis';

interface MealReviewSectionProps {
  schoolCode: string;
  dateStr: string;
  schoolName: string;
}

export const MealReviewSection: React.FC<MealReviewSectionProps> = ({
  schoolCode,
  dateStr,
  schoolName,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<'delicious' | 'healthy' | 'love' | 'soso'>('delicious');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<MealReview[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`geupsik_reviews_${schoolCode}_${dateStr}`);
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        // default starter cute review for lively community feel
        setReviews([
          {
            id: 'default-1',
            schoolCode,
            date: dateStr,
            sticker: 'delicious',
            rating: 5,
            comment: '오늘 불고기랑 국물 꿀조합 인정! 밥 두 그릇 뚝딱 비웠어요 😋',
            createdAt: Date.now() - 3600000,
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, [schoolCode, dateStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: MealReview = {
      id: Date.now().toString(),
      schoolCode,
      date: dateStr,
      sticker: selectedSticker,
      rating,
      comment: comment.trim(),
      createdAt: Date.now(),
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`geupsik_reviews_${schoolCode}_${dateStr}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const stickers = [
    { key: 'delicious' as const, emoji: '🍯', label: '꿀맛 인정' },
    { key: 'love' as const, emoji: '💖', label: '최애 메뉴' },
    { key: 'healthy' as const, emoji: '🥗', label: '건강뿜뿜' },
    { key: 'soso' as const, emoji: '😐', label: '평범해요' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-sky-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-sky-950 font-cute">
              오늘 급식 만족도 한 줄 평
            </h3>
            <p className="text-xs text-sky-700/80">
              {schoolName} 친구들과 함께 오늘 급식 소감을 남겨보세요!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl">
          <Heart className="w-3.5 h-3.5 fill-amber-500" />
          <span>리뷰 {reviews.length}개</span>
        </div>
      </div>

      {/* Write review form */}
      <form onSubmit={handleSubmit} className="bg-sky-50/60 rounded-2xl p-4 border border-sky-100 space-y-3">
        {/* Sticker Picker */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-sky-900 mr-1">스티커:</span>
          {stickers.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setSelectedSticker(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedSticker === st.key
                  ? 'bg-sky-600 text-white shadow-xs scale-105'
                  : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span>{st.emoji}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-sky-900 mr-1">별점:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-extrabold text-amber-600 ml-1">
            {rating}점 / 5점
          </span>
        </div>

        {/* Comment input & submit */}
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="오늘의 급식은 어땠나요? 솔직한 한 줄 소감을 남겨주세요!"
            className="flex-1 px-4 py-2 bg-white border border-sky-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            {submitted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>등록됨!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>등록</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Review list */}
      <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1">
        {reviews.map((rev) => {
          const matchedSticker = stickers.find((s) => s.key === rev.sticker) || stickers[0];
          return (
            <div
              key={rev.id}
              className="p-3 bg-white rounded-xl border border-sky-100 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-2xl mt-0.5 shrink-0">{matchedSticker.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-sky-900">{matchedSticker.label}</span>
                    <div className="flex items-center">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {rev.comment}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
