
import React from 'react';
import DialogueBox from '../DialogueBox';

interface EndScreenProps {
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ onRestart }) => {
  const successDialogue = "Tuyệt vời! Anh hùng tí hon của Tí Hon giỏi quá! Lâu đài Pha Lê đã sáng lại rồi! Cảm ơn bé ơi!";
  const summaryDialogue = "Hôm nay chúng ta đã học về Hình khối, Số đếm, và Màu sắc đó nha! Tạm biệt và hẹn gặp lại bạn nhỏ lần sau! Chụt chụt!";

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-6 text-center animate-fade-in">
        <div className="space-y-4">
            <DialogueBox text={successDialogue} autoPlay={true} />
            <DialogueBox text={summaryDialogue} />
        </div>
        <button
            onClick={onRestart}
            className="mt-8 px-12 py-4 bg-green-500 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
            Chơi lại
        </button>
    </div>
  );
};

export default EndScreen;
