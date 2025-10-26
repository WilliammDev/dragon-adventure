
import React from 'react';

// Placeholder for a cute dragon character
// Using a simple SVG for demonstration
const DragonCharacter: React.FC = () => {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 transition-transform duration-500 hover:scale-105">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#84CC16" d="M57,-51.7C71.1,-41.8,78.9,-20.9,79.5,0.7C80.1,22.3,73.5,44.6,58.8,56.5C44.1,68.4,22,70,-2.1,72.3C-26.2,74.5,-52.4,77.5,-64.2,65.9C-76.1,54.3,-73.6,28.2,-68.8,6.8C-64,-14.5,-56.8,-31.1,-45.5,-41.9C-34.1,-52.7,-17.1,-57.8,2.1,-60.2C21.2,-62.7,42.9,-61.6,57,-51.7Z" transform="translate(100 100)" />
      </svg>
    </div>
  );
};

export default DragonCharacter;
