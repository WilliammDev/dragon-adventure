import React from 'react';

// Placeholder for a cute dragon character
// Using a simple SVG for demonstration
const DragonCharacter: React.FC = () => {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 transition-transform duration-500 hover:scale-105">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="50" ry="10" fill="rgba(0,0,0,0.1)" />
        
        {/* Left Foot */}
        <path d="M75 165 C 65 185, 90 185, 80 165 Z" fill="#6EE7B7" />
        {/* Right Foot */}
        <path d="M125 165 C 115 185, 140 185, 130 165 Z" fill="#6EE7B7" />

        {/* Body */}
        <path d="M100 70 C 60 70, 50 180, 100 180 S 140 70, 100 70" fill="#A7F3D0" />
        
        {/* Belly Patch */}
        <path d="M100 110 C 80 110, 75 170, 100 170 S 120 110, 100 110" fill="#D1FAE5" />
        
        {/* Head */}
        <circle cx="100" cy="80" r="50" fill="#A7F3D0" />
        
        {/* Snout */}
        <ellipse cx="100" cy="95" rx="25" ry="15" fill="#D1FAE5" />
        <path d="M95 95 C 93 92, 98 92, 97 95" fill="#6EE7B7" />
        <path d="M105 95 C 103 92, 108 92, 107 95" fill="#6EE7B7" />

        {/* Eyes */}
        <circle cx="80" cy="75" r="10" fill="white" />
        <circle cx="120" cy="75" r="10" fill="white" />
        <circle cx="82" cy="78" r="6" fill="#2F3136" />
        <circle cx="122" cy="78" r="6" fill="#2F3136" />
        <circle cx="79" cy="73" r="2.5" fill="white" />
        <circle cx="119" cy="73" r="2.5" fill="white" />

        {/* Smile */}
        <path d="M90 108 C 95 115, 105 115, 110 108" stroke="#525252" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Horns */}
        <path d="M70 45 C 60 25, 85 25, 75 45" fill="#FDE047" />
        <path d="M130 45 C 120 25, 145 25, 135 45" fill="#FDE047" />

        {/* Wings */}
        <path d="M60 100 C 20 80, 20 140, 60 120 Z" fill="#C4B5FD" />
        <path d="M140 100 C 180 80, 180 140, 140 120 Z" fill="#C4B5FD" />
      </svg>
    </div>
  );
};

export default DragonCharacter;
