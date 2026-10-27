import React from 'react';

interface MascotGeupsikProps {
  expression?: 'happy' | 'hungry' | 'eating' | 'empty' | 'proud';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export const MascotGeupsik: React.FC<MascotGeupsikProps> = ({
  expression = 'happy',
  size = 'md',
  className = '',
  showSpeechBubble = false,
  speechText,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="absolute -top-12 bg-white text-sky-900 text-xs font-semibold px-3 py-1.5 rounded-2xl shadow-md border border-sky-100 whitespace-nowrap animate-bounce z-10">
          {speechText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-sky-100 rotate-45" />
        </div>
      )}

      {/* Mascot Graphic */}
      <div className={`${sizeMap[size]} animate-float relative`}>
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="bodyGrad" x1="20" y1="20" x2="140" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F2FE" />
              <stop offset="0.6" stopColor="#BAE6FD" />
              <stop offset="1" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="trayRim" x1="10" y1="10" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="riceGrad" x1="30" y1="70" x2="70" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F1F5F9" />
            </linearGradient>
            <linearGradient id="soupGrad" x1="90" y1="70" x2="130" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Rounded Tray Body (Main Mascot Shell) */}
          <rect
            x="14"
            y="26"
            width="132"
            height="114"
            rx="28"
            fill="url(#bodyGrad)"
            stroke="url(#trayRim)"
            strokeWidth="4"
          />

          {/* Tray Ear Handles (Cute wings/ears) */}
          <path
            d="M14 65C8 65 6 75 6 83C6 91 8 101 14 101"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M146 65C152 65 154 75 154 83C154 91 152 101 146 101"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Mini compartments inside mascot body */}
          {/* Top-left compartment: Side dish */}
          <rect x="26" y="38" width="28" height="20" rx="7" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
          <circle cx="40" cy="48" r="4.5" fill="#EF4444" />
          <path d="M41 43.5C41 43.5 44 41 46 42" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />

          {/* Top-mid compartment: Meat/Protein */}
          <rect x="62" y="38" width="36" height="20" rx="7" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
          <path d="M70 48Q80 43 90 48" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />

          {/* Top-right compartment: Veggie/Kimchi */}
          <rect x="106" y="38" width="28" height="20" rx="7" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" />
          <circle cx="118" cy="48" r="3.5" fill="#16A34A" />
          <circle cx="123" cy="46" r="2.5" fill="#22C55E" />

          {/* Bottom-left: Rice Bowl with warm face */}
          <rect x="26" y="66" width="48" height="42" rx="14" fill="url(#riceGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Steam puffs from rice */}
          <path d="M42 63C42 61 44 59 42 57" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M54 62C54 60 56 58 54 56" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* Bottom-right: Soup Bowl */}
          <rect x="86" y="66" width="48" height="42" rx="14" fill="url(#soupGrad)" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="98" cy="84" r="3" fill="#D97706" opacity="0.5" />
          <circle cx="116" cy="78" r="2.5" fill="#D97706" opacity="0.5" />

          {/* Mascot Face: Centered between rice and soup */}
          {expression === 'happy' && (
            <g>
              {/* Smiling curved eyes */}
              <path d="M68 84C68 81 72 79 75 81" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M85 81C88 79 92 81 92 84" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="65" cy="89" r="4.5" fill="#FDA4AF" opacity="0.8" />
              <circle cx="95" cy="89" r="4.5" fill="#FDA4AF" opacity="0.8" />
              {/* Joyful open mouth */}
              <path d="M74 88C74 94 86 94 86 88C86 88 80 91 74 88Z" fill="#E11D48" />
            </g>
          )}

          {expression === 'hungry' && (
            <g>
              {/* Big sparkling curious eyes */}
              <ellipse cx="71" cy="83" rx="3.5" ry="5" fill="#0F172A" />
              <circle cx="72" cy="81" r="1.5" fill="#FFFFFF" />
              <ellipse cx="89" cy="83" rx="3.5" ry="5" fill="#0F172A" />
              <circle cx="90" cy="81" r="1.5" fill="#FFFFFF" />
              {/* Drool droplet */}
              <path d="M83 91C83 94 85 96 85 98C85 100 83 101 81 101C79 101 77 100 77 98C77 96 83 91 83 91Z" fill="#38BDF8" />
              {/* Rosy cheeks */}
              <circle cx="64" cy="88" r="4" fill="#FDA4AF" />
              <circle cx="96" cy="88" r="4" fill="#FDA4AF" />
              {/* Open hungry smile */}
              <path d="M74 87C74 93 84 93 84 87" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {expression === 'proud' && (
            <g>
              {/* Tiny chef hat on top */}
              <path
                d="M70 26C65 26 62 20 67 15C70 10 90 10 93 15C98 20 95 26 90 26Z"
                fill="#FFFFFF"
                stroke="#0284C7"
                strokeWidth="1.5"
              />
              <rect x="71" y="24" width="18" height="4" rx="1" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />
              {/* Confident happy wink */}
              <path d="M68 83L75 83" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="89" cy="82" rx="3" ry="4" fill="#0369A1" />
              <circle cx="90" cy="80" r="1" fill="#FFFFFF" />
              {/* Cheeks */}
              <circle cx="64" cy="87" r="4" fill="#FDA4AF" />
              <circle cx="96" cy="87" r="4" fill="#FDA4AF" />
              {/* Cute smile */}
              <path d="M75 87Q80 92 85 87" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {expression === 'empty' && (
            <g>
              {/* Sleeping/Resting face */}
              <path d="M68 84C70 82 73 82 75 84" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              <path d="M85 84C87 82 90 82 92 84" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="80" cy="90" r="2" fill="#94A3B8" />
              {/* Zzz marks */}
              <text x="100" y="70" fill="#0284C7" fontSize="12" fontWeight="bold" fontFamily="sans-serif">z</text>
              <text x="110" y="60" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">z</text>
            </g>
          )}

          {/* Tiny feet at bottom */}
          <ellipse cx="56" cy="142" rx="10" ry="5" fill="#38BDF8" />
          <ellipse cx="104" cy="142" rx="10" ry="5" fill="#38BDF8" />
        </svg>
      </div>
    </div>
  );
};
