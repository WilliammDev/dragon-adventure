import React, { useState, useEffect } from 'react';
import DialogueBox from '../DialogueBox';
import { useAudio } from '../../contexts/AudioProvider';

const FlowerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5z" />
        <path d="M10 12.5a1.5 1.5 0 01-3 0V12a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H6a1 1 0 001-1v-.5a1.5 1.5 0 013 0V7a1 1 0 001 1h.5a1.5 1.5 0 010 3H11a1 1 0 00-1 1v.5z" />
    </svg>
);

const AppleIcon: React.FC<{ id: string; onDragStart: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ id, onDragStart }) => (
    <div id={id} draggable onDragStart={onDragStart} className="w-16 h-16 cursor-grab active:cursor-grabbing">
        <img 
            src="https://storage.googleapis.com/aistudio-hub-generative-ai/b1392131-4b77-4402-a1f7-e722881a7051/ac755490-59f4-41d3-a4e9-063a89be1f60.png" 
            alt="A cute cartoon apple" 
            className="w-full h-full object-contain drop-shadow" 
        />
    </div>
);


const ChallengeCounting: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [dialogue, setDialogue] = useState("Wow! Viên ngọc thứ nhất đã về rồi! Giờ là Thử thách số 2! Hãy đếm giúp Tí Hon xem có bao nhiêu bông hoa ở đây nào.");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [applesInBasket, setApplesInBasket] = useState(0);
    const [actionOnDialogueEnd, setActionOnDialogueEnd] = useState<(() => void) | null>(null);
    const { isVoiceEnabled, playSound } = useAudio();

    const handleCountSelect = (count: number) => {
        const transitionToStep2 = () => {
            setStep(2);
            setFeedback(null);
        };

        if (count === 7) {
            setFeedback('correct');
            if (isVoiceEnabled) {
                setDialogue("Đúng rồi! Giờ bạn nhỏ ơi, hãy kéo 5 quả táo vào giỏ của Rồng con nào. Chỉ 5 thôi nha!");
                setActionOnDialogueEnd(() => () => {
                    playSound('correct');
                    transitionToStep2();
                });
            } else {
                playSound('correct');
                setDialogue("Hãy kéo 5 quả táo vào giỏ của Rồng con nào.");
                setTimeout(transitionToStep2, 1000);
            }
        } else {
            setFeedback('incorrect');
            if(isVoiceEnabled) {
                setDialogue("Ồ, chưa đúng rồi. Cùng đếm lại nào!");
                setActionOnDialogueEnd(() => () => {
                    playSound('incorrect');
                    setFeedback(null);
                });
            } else {
                playSound('incorrect');
                 setTimeout(() => setFeedback(null), 1000);
            }
        }
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("appleId", e.currentTarget.id);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const appleId = e.dataTransfer.getData("appleId");
        const appleEl = document.getElementById(appleId);
        if (appleEl && applesInBasket < 5) {
            appleEl.style.display = 'none';
            setApplesInBasket(prev => prev + 1);
        }
    };
    
    useEffect(() => {
        if (applesInBasket === 5) {
            setFeedback('correct');
            if (isVoiceEnabled) {
                setDialogue("Chính xác! Yeeee! Bạn nhỏ giỏi quá! Chúng mình đã tìm thấy viên ngọc Số Đếm!");
                setActionOnDialogueEnd(() => () => {
                    playSound('success');
                    onComplete();
                });
            } else {
                playSound('success');
                setTimeout(onComplete, 1000);
            }
        }
    }, [applesInBasket, onComplete, isVoiceEnabled, playSound]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handlePlaybackEnd = () => {
        if (actionOnDialogueEnd) {
            actionOnDialogueEnd();
            setActionOnDialogueEnd(null);
        }
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {Array(7).fill(0).map((_, i) => <FlowerIcon key={i} />)}
                    </div>
                    <div className="flex space-x-4">
                        {[5, 8, 7, 6].map(num => (
                            <button key={num} onClick={() => handleCountSelect(num)} className="px-6 py-3 bg-blue-500 text-white font-bold text-2xl rounded-lg hover:bg-blue-600 transition-transform hover:scale-110">
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-around h-full">
                <div className="flex flex-wrap justify-center gap-2">
                    {Array(8).fill(0).map((_, i) => <AppleIcon key={`apple-${i}`} id={`apple-${i}`} onDragStart={handleDragStart} />)}
                </div>
                <div onDrop={handleDrop} onDragOver={handleDragOver} className="w-48 h-32 bg-yellow-800/50 rounded-lg flex items-center justify-center text-xl font-bold border-2 border-dashed border-yellow-900">
                    Thả táo vào đây ({applesInBasket}/5)
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-between p-4 animate-fade-in">
            <div className="flex-grow">
                {renderStep()}
            </div>
            {feedback && <div className={`text-2xl font-bold text-center p-2 rounded-lg ${feedback === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{feedback === 'correct' ? 'Tuyệt vời!' : 'Thử lại nhé!'}</div>}
            <DialogueBox text={dialogue} autoPlay={true} onPlaybackEnd={handlePlaybackEnd} />
        </div>
    );
};

export default ChallengeCounting;