
import React from 'react';

interface GemIndicatorProps {
  gems: boolean[];
}

const Gem: React.FC<{ collected: boolean; color: string }> = ({ collected, color }) => {
  return (
    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/50 flex items-center justify-center transition-all duration-500 ${collected ? `${color} shadow-lg` : 'bg-gray-500/50'}`}>
        {collected && 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        }
    </div>
  );
};


const GemIndicator: React.FC<GemIndicatorProps> = ({ gems }) => {
  const gemColors = ['bg-green-500', 'bg-yellow-500', 'bg-pink-500'];
  return (
    <div className="flex space-x-2 p-2 bg-black/20 rounded-full">
      {gems.map((collected, index) => (
        <Gem key={index} collected={collected} color={gemColors[index]} />
      ))}
    </div>
  );
};

export default GemIndicator;
