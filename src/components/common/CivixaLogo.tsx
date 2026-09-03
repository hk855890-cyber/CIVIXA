import React from 'react';

interface CivixaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  tagline?: boolean;
  className?: string;
}

export const CivixaLogo: React.FC<CivixaLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  tagline = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      iconSize: 'w-8 h-8',
      svgSize: 32,
      textSize: 'text-lg',
      taglineSize: 'text-[9px]',
    },
    md: {
      iconSize: 'w-11 h-11',
      svgSize: 44,
      textSize: 'text-xl',
      taglineSize: 'text-[11px]',
    },
    lg: {
      iconSize: 'w-14 h-14',
      svgSize: 56,
      textSize: 'text-2xl',
      taglineSize: 'text-xs',
    },
    xl: {
      iconSize: 'w-18 h-18',
      svgSize: 72,
      textSize: 'text-3xl',
      taglineSize: 'text-sm',
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Visual Emblem: Citizen + Happy Smile + Problem Solving Resolution Check */}
      <div
        className={`${current.iconSize} rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform`}
      >
        {/* Subtle background glow circle */}
        <div className="absolute inset-0 bg-radial from-white/25 via-transparent to-transparent opacity-60 pointer-events-none" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Outer Protective Resolution Shield / Civic Node Ring */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="white"
            strokeWidth="2.5"
            strokeOpacity="0.3"
            strokeDasharray="4 3"
          />

          {/* Citizen Head with cheerful spark */}
          <circle
            cx="24"
            cy="15"
            r="6"
            fill="white"
            className="drop-shadow-xs"
          />

          {/* Happy Citizen Eyes & Smile Face Accent */}
          <path
            d="M21.5 14C21.5 13.5 22 13 22.5 13"
            stroke="#059669"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M26.5 14C26.5 13.5 26 13 25.5 13"
            stroke="#059669"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M22 16.5C22.8 17.5 25.2 17.5 26 16.5"
            stroke="#059669"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Citizen Welcoming Torso / Uplifting Shoulders */}
          <path
            d="M13 34C13 28.5 17.8 24.5 24 24.5C30.2 24.5 35 28.5 35 34"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Happy Golden Smile Arc - Symbol of Relief & Happiness */}
          <path
            d="M17 31.5C19.5 35.5 28.5 35.5 31 31.5"
            stroke="#fde047"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-[0_1px_3px_rgba(250,204,21,0.6)]"
          />

          {/* Glowing Problem-Solving Checkmark Crest (Upper Right - Resolution Badge) */}
          <circle
            cx="35"
            cy="12"
            r="7"
            fill="#10b981"
            stroke="white"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          <path
            d="M32 12L34.2 14.2L38.2 9.8"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${current.textSize} font-black tracking-tight leading-none ${
              textColor === 'light' ? 'text-white' : 'text-slate-900'
            }`}
          >
            CIVI<span className="text-emerald-500">XA</span>
          </span>

          {tagline && (
            <span
              className={`${current.taglineSize} font-bold tracking-wider uppercase leading-tight mt-0.5 ${
                textColor === 'light' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Citizen Voice • Rapid Resolution
            </span>
          )}
        </div>
      )}
    </div>
  );
};
