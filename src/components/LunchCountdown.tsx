import React, { useState, useEffect } from 'react';
import { Clock, Bell, Sparkles, Smile } from 'lucide-react';

export const LunchCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    status: 'before' | 'lunch' | 'after';
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'before',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Lunch window: 12:00 ~ 13:20
      const nowTotalSec = currentHour * 3600 + currentMinute * 60 + currentSecond;
      const lunchStartSec = 12 * 3600 + 30 * 60; // 12:30:00
      const lunchEndSec = 13 * 3600 + 30 * 60;   // 13:30:00

      if (nowTotalSec < lunchStartSec) {
        // Before lunch
        const diff = lunchStartSec - nowTotalSec;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft({ hours: h, minutes: m, seconds: s, status: 'before' });
      } else if (nowTotalSec <= lunchEndSec) {
        // During lunch!
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, status: 'lunch' });
      } else {
        // After lunch -> Next day's lunch
        const nextDayLunchSec = 24 * 3600 + lunchStartSec;
        const diff = nextDayLunchSec - nowTotalSec;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft({ hours: h, minutes: m, seconds: s, status: 'after' });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-sky-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
          {timeLeft.status === 'lunch' ? (
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-800">
              {timeLeft.status === 'lunch' ? '🎉 점심시간 진행 중!' : '⏰ 점심시간(12:30) 카운트다운'}
            </span>
          </div>

          {timeLeft.status === 'lunch' ? (
            <p className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
              <span>지금은 맛있는 점심시간이에요! 친구들과 맛있게 냠냠하세요</span>
              <Smile className="w-4 h-4" />
            </p>
          ) : (
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">급식까지</span>
              <span className="text-base font-black text-sky-900 font-mono tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-sky-600 font-medium ml-1">남았어요! 파이팅 힘내요 💪</span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-700 font-medium bg-sky-50 px-3 py-1.5 rounded-xl">
        <Clock className="w-3.5 h-3.5 text-sky-500" />
        <span>표준 점심 12:30 ~ 13:30</span>
      </div>
    </div>
  );
};
