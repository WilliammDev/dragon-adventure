import React, { useState } from 'react';
import DialogueBox from '../DialogueBox';
import DragonCharacter from '../DragonCharacter';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isReadyButtonActive, setIsReadyButtonActive] = useState(false);
  const introDialogue = "Chào mừng bạn nhỏ đến với Lâu đài Pha Lê của Tí Hon! Tí Hon cần bạn giúp thắp sáng lại lâu đài bằng cách thu thập 3 viên ngọc ma thuật. Bạn đã sẵn sàng chưa?";

  const handleAudioStateChange = (isAvailable: boolean) => {
    // If audio is not available (e.g., no API key), activate the button immediately.
    if (!isAvailable) {
      setIsReadyButtonActive(true);
    }
  };

  const handlePlaybackEnd = () => {
    // When audio playback finishes, activate the button.
    setIsReadyButtonActive(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-8 text-center animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold text-white text-stroke drop-shadow-xl" style={{fontFamily: 'Arial', WebkitTextStroke: '2px rgba(0,0,0,0.2)'}}>
          Bé Học Cùng Rồng Con
      </h1>
      
      <DragonCharacter />
      
      <div className="w-full max-w-2xl">
        <DialogueBox
          text={introDialogue}
          autoPlay={true}
          onPlaybackEnd={handlePlaybackEnd}
          onAudioAvailabilityChange={handleAudioStateChange}
        />
      </div>

      <button
        onClick={onStart}
        disabled={!isReadyButtonActive}
        className={`px-12 py-4 text-white font-bold text-2xl rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
          isReadyButtonActive
            ? 'bg-green-500 hover:bg-green-600 hover:scale-105 animate-pulse'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Sẵn sàng!
      </button>
    </div>
  );
};

export default StartScreen;
