
import React from 'react';

const AppleIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
    <div className={`${className} drop-shadow`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Shadow */}
            <ellipse cx="50" cy="95" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />

            {/* Stem */}
            <path d="M50 20 C 55 10, 65 15, 60 25 Z" fill="#8d5524" />

            {/* Leaf */}
            <path d="M60 25 C 75 10, 90 20, 75 35 Q 65 30 60 25 Z" fill="#4ade80" />
            <path d="M68 25 C 72 25, 75 28, 70 30" stroke="#22c55e" strokeWidth="1" fill="none" />

            {/* Apple Body */}
            <path d="M50 30 C 20 30, 10 60, 25 85 C 40 100, 60 100, 75 85 C 90 60, 80 30, 50 30 Z" fill="#ef4444" />
            <path d="M50 30 Q 55 35, 60 30" stroke="#dc2626" strokeWidth="2" fill="none" />
            
            {/* Shine */}
            <ellipse cx="35" cy="45" rx="8" ry="12" fill="rgba(255,255,255,0.7)" transform="rotate(-20 35 45)" />
            <circle cx="30" cy="65" r="3" fill="rgba(255,255,255,0.5)" />
        </svg>
    </div>
);

export default AppleIcon;
