
import React, { useState, useEffect } from 'react';
import DialogueBox from '../DialogueBox';
import { useAudio } from '../../contexts/AudioProvider';

const items = [
    { id: 'car', color: 'red', name: 'Ô tô', isTarget: true, pos: 'top-10 left-10' },
    { id: 'ball', color: 'blue', name: 'Bóng', isTarget: false, pos: 'top-1/3 right-10' },
    { id: 'hat', color: 'red', name: 'Mũ', isTarget: true, pos: 'bottom-10 right-1/2' },
    { id: 'book', color: 'green', name: 'Sách', isTarget: false, pos: 'bottom-1/4 left-1/4' },
    { id: 'apple', color: 'red', name: 'Táo', isTarget: true, pos: 'top-1/2 left-1/2' }
];

const AppleIcon: React.FC = () => (
    <div className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow" viewBox="0 0 24 24">
            <path fill="#ef4444" d="M19.78 11.78a2.5 2.5 0 0 0-3.54 0a2.5 2.5 0 0 1-3.54 0a2.5 2.5 0 0 0-3.54 0a2.5 2.5 0 0 1-3.54 0a2.5 2.5 0 0 0-3.54 0c-.32.32-.5.75-.5 1.22c0 1.25.64 2.45 1.53 3.34c1.13 1.13 2.58 2.05 4.34 2.55c.42.12.87.18 1.33.18h.2c.46 0 .91-.06 1.33-.18c1.76-.5 3.2-1.42 4.34-2.55c.89-.89 1.53-2.09 1.53-3.34c0-.47-.18-.9-.5-1.22Z"/>
            <path fill="#78350f" d="M15 4.25a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0-2.5 2.5V5h6Z"/>
        </svg>
    </div>
);

const Item: React.FC<{ item: typeof items[0], selected: boolean, onClick: () => void, disabled: boolean }> = ({ item, selected, onClick, disabled }) => {
    const content = item.id === 'apple' ? <AppleIcon /> : item.name;
    const bgClass = item.id === 'apple' ? 'bg-transparent' : `bg-${item.color}-500`;
    const cursorClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

    return (
        <div onClick={disabled ? undefined : onClick} className={`w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${selected ? 'ring-4 ring-yellow-400 scale-110' : ''} ${bgClass} ${cursorClass} ${!disabled && 'hover:scale-105'}`}>
            {content}
        </div>
    );
};

const MatchItem: React.FC<{ color: string, content: string, onDragStart: (e: React.DragEvent<HTMLDivElement>) => void, id: string }> = ({color, content, onDragStart, id}) => (
    <div id={id} draggable onDragStart={onDragStart} className={`w-24 h-24 bg-${color}-400 rounded-lg flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing`}>
        {content}
    </div>
);

const DropZone: React.FC<{ onDrop: (e: React.DragEvent<HTMLDivElement>) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, children?: React.ReactNode, color: string }> = ({ onDrop, onDragOver, children, color }) => (
    <div onDrop={onDrop} onDragOver={onDragOver} className={`w-28 h-28 border-4 border-dashed border-${color}-500 rounded-lg flex items-center justify-center bg-gray-200/50`}>
        {children || "Thả vào đây"}
    </div>
);


const ChallengeColors: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [dialogue, setDialogue] = useState("Viên ngọc thứ hai lấp lánh rồi! Giờ là viên ngọc cuối cùng! Tí Hon thích màu ĐỎ! Bé ơi, hãy chỉ cho Tí Hon tất cả những gì có màu ĐỎ trong phòng này đi!");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [selectedReds, setSelectedReds] = useState<Set<string>>(new Set());
    const [matched, setMatched] = useState({ yellow: false, blue: false });
    const [actionOnDialogueEnd, setActionOnDialogueEnd] = useState<(() => void) | null>(null);
    const { isVoiceEnabled, playSound } = useAudio();

    const handleSelectRed = (id: string) => {
        if (step !== 1) return;
        const newSelected = new Set(selectedReds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedReds(newSelected);
    };

    useEffect(() => {
        if (step === 1 && selectedReds.size === 3) {
            const transitionToStep2 = () => {
                setStep(2);
                setFeedback(null);
            };
            setFeedback('correct');
            if(isVoiceEnabled){
                setDialogue("Giỏi quá! Cuối cùng, bạn nhỏ hãy ghép cặp con bướm màu VÀNG với bông hoa màu XANH DƯƠNG nhé!");
                setActionOnDialogueEnd(() => () => {
                    playSound('correct');
                    transitionToStep2();
                });
            } else {
                playSound('correct');
                setDialogue("Bây giờ, hãy ghép cặp con bướm màu VÀNG với bông hoa màu XANH DƯƠNG nhé!");
                setTimeout(transitionToStep2, 1000);
            }
        }
    }, [selectedReds, step, isVoiceEnabled, playSound]);
    
    useEffect(() => {
        if (matched.yellow && matched.blue) {
             setFeedback('correct');
             if(isVoiceEnabled){
                setDialogue("Tuyệt vời! Chúng ta đã có viên ngọc cuối cùng! Cảm ơn bạn nhỏ!");
                setActionOnDialogueEnd(() => () => {
                    playSound('success');
                    onComplete();
                });
             } else {
                 playSound('success');
                 setTimeout(onComplete, 1000);
             }
        }
    }, [matched, onComplete, isVoiceEnabled, playSound]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, color: string) => {
        e.dataTransfer.setData("color", color);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColor: string) => {
        e.preventDefault();
        const droppedColor = e.dataTransfer.getData("color");
        if (droppedColor === targetColor) {
            playSound('correct');
            setMatched(prev => ({ ...prev, [targetColor]: true }));
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
            if(isVoiceEnabled){
                setDialogue("Sai rồi, thử lại nhé!");
                setActionOnDialogueEnd(() => () => setFeedback(null));
            } else {
                setTimeout(() => setFeedback(null), 1000);
            }
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    
    const handlePlaybackEnd = () => {
        if (actionOnDialogueEnd) {
            actionOnDialogueEnd();
            setActionOnDialogueEnd(null);
        }
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <div className="w-full h-full flex flex-wrap justify-center items-center gap-4">
                    {items.map(item => <Item key={item.id} item={item} selected={selectedReds.has(item.id)} onClick={() => item.isTarget && handleSelectRed(item.id)} disabled={!item.isTarget} />)}
                </div>
            );
        }
        return (
            <div className="w-full h-full flex justify-around items-center">
                <div className="flex flex-col items-center gap-4">
                    {!matched.yellow && <MatchItem id="butterfly" color="yellow" content="🦋" onDragStart={(e) => handleDragStart(e, 'yellow')} />}
                    {!matched.blue && <MatchItem id="flower" color="blue" content="🌸" onDragStart={(e) => handleDragStart(e, 'blue')} />}
                </div>
                <div className="flex flex-col items-center gap-4">
                    <DropZone onDrop={(e) => handleDrop(e, 'yellow')} onDragOver={handleDragOver} color="yellow">
                        {matched.yellow && <span className="text-4xl">🦋</span>}
                    </DropZone>
                     <DropZone onDrop={(e) => handleDrop(e, 'blue')} onDragOver={handleDragOver} color="blue">
                        {matched.blue && <span className="text-4xl">🌸</span>}
                    </DropZone>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-between p-4 animate-fade-in">
            <div className="flex-grow">{renderStep()}</div>
            {feedback && <div className={`text-2xl font-bold text-center p-2 rounded-lg ${feedback === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{feedback === 'correct' ? 'Đúng rồi!' : 'Chưa đúng!'}</div>}
            <DialogueBox text={dialogue} autoPlay={true} onPlaybackEnd={handlePlaybackEnd} />
        </div>
    );
};

export default ChallengeColors;
