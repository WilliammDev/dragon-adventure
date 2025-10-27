import React from 'react';

const DragonCharacter: React.FC = () => {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 transition-transform duration-500 hover:scale-105 drop-shadow-lg">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shadow */}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0,0,0,0.1)" />

        {/* Wings */}
        <path d="M135 110 C 160 90, 160 140, 135 130 Z" fill="#f97316" transform="rotate(-10 135 110)" />
        <path d="M65 110 C 40 90, 40 140, 65 130 Z" fill="#f97316" transform="rotate(10 65 110)" />

        {/* Body */}
        <path d="M100 180 C 50 180, 40 100, 100 70 C 160 100, 150 180, 100 180 Z" fill="#86efac"/>
        
        {/* Belly */}
        <path d="M100 175 C 70 175, 70 120, 100 110 C 130 120, 130 175, 100 175 Z" fill="#fef08a" />
        
        {/* Head */}
        <circle cx="100" cy="80" r="55" fill="#86efac"/>
        
        {/* Snout */}
        <path d="M100 95 C 80 115, 120 115, 100 95 Z" fill="#a7f3d0" />
        
        {/* Eyes */}
        <circle cx="80" cy="80" r="14" fill="white"/>
        <circle cx="80" cy="80" r="8" fill="#333"/>
        <circle cx="77" cy="77" r="3" fill="white"/>
        
        <circle cx="120" cy="80" r="14" fill="white"/>
        <circle cx="120" cy="80" r="8" fill="#333"/>
        <circle cx="117" cy="77" r="3" fill="white"/>
        
        {/* Cheeks */}
        <circle cx="65" cy="95" r="7" fill="#fca5a5" opacity="0.7"/>
        <circle cx="135" cy="95" r="7" fill="#fca5a5" opacity="0.7"/>
        
        {/* Smile */}
        <path d="M 85 100 Q 100 115 115 100" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Horns */}
        <path d="M 80 40 C 85 25, 95 25, 90 40 Z" fill="#fcd34d" />
        <path d="M 120 40 C 115 25, 105 25, 110 40 Z" fill="#fcd34d" />
        
        {/* Head Spines */}
        <path d="M 95 35 L 100 25 L 105 35 Z" fill="#a7f3d0" />
      </svg>
    </div>
  );
};

export default DragonCharacter;