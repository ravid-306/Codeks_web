import React from 'react';

export type KodiMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'oops' | 'sleepy';

interface KodiMascotProps {
  mood?: KodiMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  onClick?: () => void;
}

export const KodiMascot: React.FC<KodiMascotProps> = ({
  mood = 'idle',
  size = 'md',
  message,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Optional Speech Bubble */}
      {message && (
        <div className="mb-2 max-w-xs animate-bounce bg-white dark:bg-[#1a162b] text-[#1e1b4b] dark:text-[#f3efff] text-xs md:text-sm font-bold py-2 px-3.5 rounded-2xl rounded-bl-none shadow-md border-2 border-[#6c4cf1] relative">
          <p className="leading-snug">{message}</p>
          <div className="absolute -bottom-2 left-3 w-0 h-0 border-t-8 border-t-[#6c4cf1] border-r-8 border-r-transparent" />
        </div>
      )}

      {/* Corporate Memphis Mascot SVG */}
      <div className={`${sizeMap[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Memphis decorative shapes */}
          {mood === 'cheering' && (
            <g className="animate-pulse">
              <circle cx="25" cy="35" r="7" fill="#ffd23f" />
              <polygon points="175,30 185,50 165,50" fill="#ff7eb6" />
              <path d="M 160 140 Q 170 120 185 130" stroke="#00b3a4" strokeWidth="4" strokeLinecap="round" />
              <circle cx="35" cy="165" r="5" fill="#3a86ff" />
              <path d="M 20 80 Q 30 70 40 85" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {mood === 'thinking' && (
            <g className="animate-bounce">
              <path
                d="M 155 35 Q 165 20 175 35 T 185 35"
                stroke="#6c4cf1"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="170" cy="55" r="4" fill="#ff7eb6" />
              <circle cx="155" cy="70" r="2.5" fill="#ffd23f" />
            </g>
          )}

          {mood === 'sleepy' && (
            <g className="animate-pulse opacity-80">
              <text x="155" y="45" fill="#6c4cf1" fontSize="16" fontWeight="bold" fontFamily="monospace">Z</text>
              <text x="170" y="30" fill="#ff7eb6" fontSize="20" fontWeight="bold" fontFamily="monospace">Z</text>
              <text x="185" y="15" fill="#ffd23f" fontSize="24" fontWeight="bold" fontFamily="monospace">Z</text>
            </g>
          )}

          {/* Kodi's Soft Lilac / Purple Body (Organic Memphis Blob) */}
          <path
            d="M 60 175 C 40 170 30 140 35 105 C 40 65 65 45 100 45 C 135 45 160 65 165 105 C 170 140 160 170 140 175 C 115 180 85 180 60 175 Z"
            fill="url(#kodiBodyGradient)"
          />

          {/* Soft Belly Patch */}
          <ellipse cx="100" cy="125" rx="42" ry="40" fill="#f8f4ff" opacity="0.85" />

          {/* Playful Memphis Cheek Dots */}
          <circle cx="65" cy="115" rx="7" ry="5" fill="#ff7eb6" opacity="0.7" />
          <circle cx="135" cy="115" rx="7" ry="5" fill="#ff7eb6" opacity="0.7" />

          {/* Ears / Head Crest with Alegría asymmetry */}
          <path
            d="M 65 52 C 55 30 75 20 85 45 Z"
            fill="#6c4cf1"
          />
          <path
            d="M 135 52 C 145 30 125 20 115 45 Z"
            fill="#ff7eb6"
          />

          {/* Eyes according to Mood */}
          {mood === 'idle' && (
            <g>
              <circle cx="78" cy="95" r="7" fill="#1e1b4b" />
              <circle cx="122" cy="95" r="7" fill="#1e1b4b" />
              <circle cx="80" cy="93" r="2.5" fill="#ffffff" />
              <circle cx="124" cy="93" r="2.5" fill="#ffffff" />
            </g>
          )}

          {mood === 'happy' && (
            <g>
              {/* Joyful curved arches */}
              <path d="M 70 98 Q 78 86 86 98" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 114 98 Q 122 86 130 98" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          )}

          {mood === 'cheering' && (
            <g>
              {/* Starry excited eyes */}
              <path d="M 78 88 L 78 104 M 70 96 L 86 96" stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
              <path d="M 122 88 L 122 104 M 114 96 L 130 96" stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
              <circle cx="78" cy="96" r="3" fill="#1e1b4b" />
              <circle cx="122" cy="96" r="3" fill="#1e1b4b" />
            </g>
          )}

          {mood === 'thinking' && (
            <g>
              {/* Looking sideways / up in thought */}
              <circle cx="82" cy="90" r="7" fill="#1e1b4b" />
              <circle cx="126" cy="90" r="7" fill="#1e1b4b" />
              <circle cx="84" cy="88" r="2.5" fill="#ffffff" />
              <circle cx="128" cy="88" r="2.5" fill="#ffffff" />
              {/* One curious raised eyebrow */}
              <path d="M 72 82 Q 80 76 88 82" stroke="#6c4cf1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 116 80 Q 124 72 134 78" stroke="#6c4cf1" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          {mood === 'oops' && (
            <g>
              {/* Sympathetic wide blinking eyes */}
              <circle cx="78" cy="96" r="6" fill="#1e1b4b" />
              <circle cx="122" cy="96" r="6" fill="#1e1b4b" />
              {/* Sweat drop */}
              <path
                d="M 148 85 C 145 92 142 98 147 101 C 152 104 156 99 154 94 Z"
                fill="#3a86ff"
              />
            </g>
          )}

          {mood === 'sleepy' && (
            <g>
              {/* Closed restful eye lines */}
              <path d="M 70 96 Q 78 102 86 96" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 114 96 Q 122 102 130 96" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          {/* Mouth according to Mood */}
          {mood === 'idle' && (
            <path d="M 92 114 Q 100 122 108 114" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" />
          )}

          {(mood === 'happy' || mood === 'cheering') && (
            <path
              d="M 88 112 Q 100 130 112 112 Z"
              fill="#ff7eb6"
              stroke="#1e1b4b"
              strokeWidth="3.5"
            />
          )}

          {mood === 'thinking' && (
            <path d="M 94 116 Q 100 112 108 117" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" />
          )}

          {mood === 'oops' && (
            <ellipse cx="100" cy="116" rx="6" ry="7" fill="#1e1b4b" />
          )}

          {mood === 'sleepy' && (
            <ellipse cx="100" cy="115" rx="4" ry="4" fill="#ff7eb6" opacity="0.6" />
          )}

          {/* Memphis Oversized Limbs */}
          {mood === 'cheering' ? (
            <g>
              {/* Arms waving high in triumph */}
              <path
                d="M 45 105 C 20 80 15 50 30 40 C 45 30 50 65 60 95"
                fill="#6c4cf1"
              />
              <path
                d="M 155 105 C 180 80 185 50 170 40 C 155 30 150 65 140 95"
                fill="#ff7eb6"
              />
            </g>
          ) : mood === 'thinking' ? (
            <g>
              {/* One hand on chin */}
              <path
                d="M 150 120 C 160 135 150 155 130 145 C 115 138 115 125 110 124"
                stroke="#6c4cf1"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="108" cy="122" r="8" fill="#ffd23f" />
            </g>
          ) : (
            <g>
              {/* Relaxed curving arms */}
              <path
                d="M 40 115 C 22 125 24 150 42 145"
                stroke="#6c4cf1"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 160 115 C 178 125 176 150 158 145"
                stroke="#ff7eb6"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Sturdy Rounded Memphis Feet */}
          <ellipse cx="75" cy="178" rx="22" ry="12" fill="#ffd23f" />
          <ellipse cx="125" cy="178" rx="22" ry="12" fill="#00b3a4" />

          {/* Gradients */}
          <defs>
            <linearGradient id="kodiBodyGradient" x1="40" y1="45" x2="160" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.6" stopColor="#6c4cf1" />
              <stop offset="1" stopColor="#4f2cdb" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
