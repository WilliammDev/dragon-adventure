import React, { useState } from 'react';
import DialogueBox from '../DialogueBox';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const introDialogue = "Xin chào bé ơi! Tớ là Tí Hon, rồng con giữ Lâu đài Pha Lê. Ôi! Ôi! Lâu đài của tớ bị mất 3 viên ngọc quý rồi! Bé có thể giúp Tí Hon tìm lại không? Bé thật là anh hùng tí hon!";
  const secondDialogue = "Luật chơi đơn giản lắm! Chúng mình sẽ vượt qua 3 thử thách. Vượt qua một thử thách, chúng mình tìm được một viên ngọc! Sẵn sàng chưa, bạn nhỏ ơi?";
  
  // The button is disabled until the intro audio finishes or is confirmed unavailable.
  const [isInteractionAllowed, setIsInteractionAllowed] = useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-6 text-center animate-fade-in">
        <div className="space-y-4">
            <DialogueBox 
              text={introDialogue} 
              autoPlay={true}
              onPlaybackEnd={() => setIsInteractionAllowed(true)}
              onAudioAvailabilityChange={(isAvailable) => {
                if (!isAvailable) {
                  // If audio isn't available, allow the user to proceed immediately.
                  setIsInteractionAllowed(true);
                }
              }}
            />
            <DialogueBox text={secondDialogue} />
        </div>
        <button
            onClick={onStart}
            disabled={!isInteractionAllowed}
            className="mt-8 px-12 py-4 bg-yellow-400 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
        >
            Sẵn sàng!
        </button>
    </div>
  );
};

export default StartScreen;