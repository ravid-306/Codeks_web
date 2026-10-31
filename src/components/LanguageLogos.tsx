import React from 'react';

interface LanguageLogoProps {
  id: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LanguageLogo: React.FC<LanguageLogoProps> = ({
  id,
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  switch (id.toLowerCase()) {
    case 'javascript':
    case 'js':
      return (
        <svg viewBox="0 0 630 630" className={`${sizeClass} ${className}`}>
          <rect width="630" height="630" fill="#f7df1e" rx="120" />
          <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.4-38.1-25.4-17.34 0-28.33 11-28.33 25.4 0 17.7 11 24.9 36.4 35.9l14.8 6.3c50.3 21.6 79.5 43.6 79.5 93 0 53.3-41.9 84.2-98.1 84.2-54.6 0-90.1-28.3-104.9-61.7zm-209.98 5.5c8.9 15.2 16.9 28 36.4 28 18.6 0 30.5-7.6 30.5-37.2v-200.77h57.9v202.1c0 60.9-35.5 88.4-86.7 88.4-44.4 0-69.8-23.3-83.3-51.6z" fill="#000000" />
        </svg>
      );

    case 'typescript':
    case 'ts':
      return (
        <svg viewBox="0 0 630 630" className={`${sizeClass} ${className}`}>
          <rect width="630" height="630" fill="#3178c6" rx="120" />
          <path d="M 284 316 L 244 316 L 244 490 L 180 490 L 180 316 L 140 316 L 140 262 L 284 262 Z M 310 440 C 324 456 348 470 380 470 C 408 470 422 454 422 436 C 422 396 360 390 340 370 C 310 342 320 294 366 266 C 392 250 422 254 444 264 L 426 312 C 408 304 388 300 372 300 C 352 300 342 312 342 324 C 342 358 406 362 428 386 C 452 412 452 458 410 496 C 382 522 334 522 292 494 Z" fill="#ffffff" />
        </svg>
      );

    case 'python':
      return (
        <svg viewBox="0 0 110 110" className={`${sizeClass} ${className}`}>
          <path d="M 54.5 10 C 27 10 28.5 22 28.5 22 L 28.5 34.5 L 55.5 34.5 L 55.5 38.3 L 18 38.3 C 18 38.3 6 36.9 6 64.5 C 6 92.1 16.5 90.6 16.5 90.6 L 24.5 90.6 L 24.5 79.3 C 24.5 65.8 35.8 66 35.8 66 L 63 66 C 74.3 66 74.3 54.8 74.3 54.8 L 74.3 22 C 74.3 22 75.8 10 54.5 10 Z M 42 17.5 C 45 17.5 47.5 20 47.5 23 C 47.5 26 45 28.5 42 28.5 C 39 28.5 36.5 26 36.5 23 C 36.5 20 39 17.5 42 17.5 Z" fill="#387eb8" />
          <path d="M 55.5 100 C 83 100 81.5 88 81.5 88 L 81.5 75.5 L 54.5 75.5 L 54.5 71.7 L 92 71.7 C 92 71.7 104 73.1 104 45.5 C 104 17.9 93.5 19.4 93.5 19.4 L 85.5 19.4 L 85.5 30.7 C 85.5 44.2 74.2 44 74.2 44 L 47 44 C 35.7 44 35.7 55.2 35.7 55.2 L 35.7 88 C 35.7 88 34.2 100 55.5 100 Z M 68 92.5 C 65 92.5 62.5 90 62.5 87 C 62.5 84 65 81.5 68 81.5 C 71 81.5 73.5 84 73.5 87 C 73.5 90 71 92.5 68 92.5 Z" fill="#ffe052" />
        </svg>
      );

    case 'html':
    case 'html5':
      return (
        <svg viewBox="0 0 512 512" className={`${sizeClass} ${className}`}>
          <path d="M71 460L30 0h452l-41 460-185 52z" fill="#e34f26" />
          <path d="M256 472l149-41 35-391H256z" fill="#ef652a" />
          <path d="M256 208h-74l-5-58h79V94H116l15 170h125zm0 146l-63-17-4-45h-56l7 89 116 32z" fill="#ebebeb" />
          <path d="M256 94v56h79l-8 84h-71v56h66l-7 74-59 16v58l116-32 16-177 3-35 8-100z" fill="#ffffff" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg viewBox="0 0 512 512" className={`${sizeClass} ${className}`}>
          <path d="M71 460L30 0h452l-41 460-185 52z" fill="#1572b6" />
          <path d="M256 472l149-41 35-391H256z" fill="#33a9dc" />
          <path d="M256 208h-74l-5-58h79V94H116l15 170h125zm0 146l-63-17-4-45h-56l7 89 116 32z" fill="#ebebeb" />
          <path d="M256 94v56h79l-8 84h-71v56h66l-7 74-59 16v58l116-32 16-177 3-35 8-100z" fill="#ffffff" />
        </svg>
      );

    case 'java':
      return (
        <svg viewBox="0 0 48 48" className={`${sizeClass} ${className}`}>
          <path d="M19.2 39.5c6.5 0 11.2-1.3 14.2-2.5 1-.4 1.7-.8 1.7-.8s-1.2.9-3.2 1.5c-3.7 1.1-9 1.8-14.8 1.8-5.6 0-10.4-.7-14.3-1.8C1 37.1 0 36.2 0 36.2s.8.4 1.8.8c3.2 1.2 9.2 2.5 17.4 2.5z" fill="#5382a1" />
          <path d="M18.8 34.6c6 0 10.2-1.2 12.8-2.3.9-.4 1.5-.7 1.5-.7s-1 .8-2.9 1.4c-3.3 1-8.1 1.6-13.3 1.6-5 0-9.4-.6-12.9-1.6C2.2 32.4 1.3 31.6 1.3 31.6s.7.3 1.6.7c2.8 1.1 8.2 2.3 15.9 2.3z" fill="#5382a1" />
          <path d="M30.4 27.2c3.5-3.6 1.2-7.8-3.4-9.5-3.3-1.2-8.2-1.6-11.8.5 2.8-.7 6.4-.3 8.7.6 3.6 1.3 5.4 4.1 2.8 7.3-1.6 1.9-4.8 3.5-7.7 4.8 3.5-.9 8.6-2.4 11.4-3.7z" fill="#e76f51" />
          <path d="M23.1 8.5c2.1 2.3-.9 5-3.3 6.6-2.2 1.5-4.4 2.3-4.4 2.3s1.7-.7 3.5-1.7c2.1-1.2 3.9-3.1 2.1-4.9-1.9-2-5.4-3.5-9.3-4 5.3.3 9.7 0 11.4 1.7z" fill="#e76f51" />
        </svg>
      );

    case 'kotlin':
      return (
        <svg viewBox="0 0 24 24" className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id="ktGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f52ff" />
              <stop offset="50%" stopColor="#c711e1" />
              <stop offset="100%" stopColor="#e4485d" />
            </linearGradient>
          </defs>
          <path d="M24 24H0V0h24L12 12Z" fill="url(#ktGrad)" />
        </svg>
      );

    case 'sql':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`}>
          <ellipse cx="32" cy="14" rx="24" ry="8" fill="#00b3a4" />
          <path d="M8 14v16c0 4.4 10.7 8 24 8s24-3.6 24-8V14" fill="none" stroke="#008080" strokeWidth="4" />
          <path d="M8 30v16c0 4.4 10.7 8 24 8s24-3.6 24-8V30" fill="none" stroke="#008080" strokeWidth="4" />
          <text x="32" y="36" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SQL</text>
        </svg>
      );

    case 'git':
      return (
        <svg viewBox="0 0 24 24" className={`${sizeClass} ${className}`}>
          <path d="M21.6 10.7L13.3 2.4c-.8-.8-2.1-.8-2.9 0L8 4.8l3.6 3.6c.9-.3 1.9-.1 2.6.6.7.7.9 1.7.6 2.6l3.5 3.5c.9-.3 1.9-.1 2.6.6 1 .1 1 2.7 0 3.7s-2.7 1-3.7 0c-.8-.8-.9-1.9-.6-2.8L12.5 15v-5.2c-.4.2-.9.3-1.4.3-.9 0-1.8-.4-2.4-1L5.1 12.7c-.8.8-.8 2.1 0 2.9l8.3 8.3c.8.8 2.1.8 2.9 0l8.3-8.3c.8-.8.8-2.1 0-2.9z" fill="#f05032" />
        </svg>
      );

    case 'c':
      return (
        <svg viewBox="0 0 128 128" className={`${sizeClass} ${className}`}>
          <path fill="#5c6bc0" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48.3 27.9c-1.9 1.1-3.1 3.1-3.1 5.3v55.7c0 2.2 1.2 4.2 3.1 5.3l48.3 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48.3-27.9c1.9-1.1 3.1-3.1 3.1-5.3V36c.1-2.2-1.1-4.2-3-5.3z" />
          <path fill="#ffffff" d="M64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c8.3 0 15.6 4.1 20.1 10.4l9.8-6.8C86.7 33.2 76 27.5 64 27.5c-20.1 0-36.5 16.4-36.5 36.5S43.9 100.5 64 100.5c12 0 22.7-5.7 29.9-15.6l-9.8-6.8c-4.5 6.3-11.8 10.4-20.1 10.4z" />
        </svg>
      );

    case 'cpp':
      return (
        <svg viewBox="0 0 128 128" className={`${sizeClass} ${className}`}>
          <path fill="#00599c" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48.3 27.9c-1.9 1.1-3.1 3.1-3.1 5.3v55.7c0 2.2 1.2 4.2 3.1 5.3l48.3 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48.3-27.9c1.9-1.1 3.1-3.1 3.1-5.3V36c.1-2.2-1.1-4.2-3-5.3z" />
          <path fill="#ffffff" d="M50 82c-10 0-18-8-18-18s8-18 18-18c6.1 0 11.5 3 14.8 7.6l7.2-5C67.5 41.5 59.5 37 50 37 35.1 37 23 49.1 23 64s12.1 27 27 27c9.5 0 17.5-4.5 22-11.6l-7.2-5c-3.3 4.6-8.7 7.6-14.8 7.6zm31-23h-4v-4h-4v4h-4v4h4v4h4v-4h4zm18 0h-4v-4h-4v4h-4v4h4v4h4v-4h4z" />
        </svg>
      );

    case 'csharp':
      return (
        <svg viewBox="0 0 128 128" className={`${sizeClass} ${className}`}>
          <path fill="#9b4f96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48.3 27.9c-1.9 1.1-3.1 3.1-3.1 5.3v55.7c0 2.2 1.2 4.2 3.1 5.3l48.3 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48.3-27.9c1.9-1.1 3.1-3.1 3.1-5.3V36c.1-2.2-1.1-4.2-3-5.3z" />
          <path fill="#ffffff" d="M50 82c-10 0-18-8-18-18s8-18 18-18c6.1 0 11.5 3 14.8 7.6l7.2-5C67.5 41.5 59.5 37 50 37 35.1 37 23 49.1 23 64s12.1 27 27 27c9.5 0 17.5-4.5 22-11.6l-7.2-5c-3.3 4.6-8.7 7.6-14.8 7.6zm32-26h-4l1-5h-4l-1 5h-4l1-5h-4l-1 5h-3v4h3.2l-1 5H70v4h3.4l-1.2 6h4l1.2-6h4l-1.2 6h4l1.2-6H89v-4h-3.8l1-5H90v-4h-4.2l1-5zm-5.8 9h-4l1-5h4z" />
        </svg>
      );

    case 'go':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`}>
          <circle cx="32" cy="32" r="30" fill="#00add8" />
          <text x="32" y="42" fill="#ffffff" fontSize="26" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">GO</text>
        </svg>
      );

    case 'rust':
      return (
        <svg viewBox="0 0 106 106" className={`${sizeClass} ${className}`}>
          <circle cx="53" cy="53" r="48" fill="#c2410c" />
          <circle cx="53" cy="53" r="38" fill="#0f0c1b" />
          <text x="53" y="66" fill="#dea584" fontSize="40" fontWeight="900" textAnchor="middle" fontFamily="serif">R</text>
        </svg>
      );

    case 'php':
      return (
        <svg viewBox="0 0 128 128" className={`${sizeClass} ${className}`}>
          <ellipse cx="64" cy="64" rx="60" ry="38" fill="#777bb4" />
          <text x="64" y="74" fill="#ffffff" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">PHP</text>
        </svg>
      );

    case 'swift':
      return (
        <svg viewBox="0 0 128 128" className={`${sizeClass} ${className}`}>
          <rect width="128" height="128" rx="28" fill="#f05138" />
          <path d="M106.8 69.3c-2.3 3.6-5 6.9-8.1 9.8-11.4 10.7-27.4 15.3-42.3 12.1 11.2-4.8 20.3-13.5 25.1-24.6.4-.9.7-1.8.9-2.7-5.8 4.7-12.8 7.9-20.2 9.2-11.5 2.1-23.4-.6-32.9-7.4 12.5.4 25.1-4.2 33.7-12.9 2-2.1 3.7-4.4 5-6.8-5.3 2.2-11 3.3-16.7 3.2-12.3-.2-23.9-6.3-30.8-16.4 10.7 4.1 22.8 4.1 33.5.1 4.5-1.7 8.7-4.2 12.3-7.3-6.5.6-13.1-.7-18.9-3.7-6.2-3.3-11-8.6-13.6-15 15.3 10.1 34.6 12.7 51.9 6.8 1.4-.5 2.8-1 4.1-1.6-4.9 6.8-11.4 12.3-19 16 10.9-1.9 21.2-7.1 29.7-14.7-1.9 4.3-4.5 8.3-7.7 11.8 7.3-3.7 13.9-8.7 19.3-14.8-1.5 6.1-4.5 11.8-8.8 16.5 6.4-3.5 12.2-8.1 17-13.5-1.8 6.4-5.3 12.3-10.1 17.1 6.5-3.3 12.3-7.8 17.2-13.1-2.1 6.6-6 12.5-11.2 17.3z" fill="#ffffff" />
        </svg>
      );

    case 'bash':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`}>
          <rect width="64" height="64" rx="16" fill="#16a34a" />
          <path d="M16 22l14 10-14 10M32 42h16" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    default:
      return (
        <div className={`${sizeClass} rounded-xl bg-[#6c4cf1] text-white flex items-center justify-center font-bold text-xs uppercase ${className}`}>
          {name.slice(0, 2)}
        </div>
      );
  }
};
