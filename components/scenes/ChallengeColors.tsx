import React, { useState, useEffect } from 'react';
import DialogueBox from '../DialogueBox';

const items = [
    { id: 'car', color: 'red', name: 'Ô tô', isTarget: true, pos: 'top-10 left-10' },
    { id: 'ball', color: 'blue', name: 'Bóng', isTarget: false, pos: 'top-1/3 right-10' },
    { id: 'hat', color: 'red', name: 'Mũ', isTarget: true, pos: 'bottom-10 right-1/2' },
    { id: 'book', color: 'green', name: 'Sách', isTarget: false, pos: 'bottom-1/4 left-1/4' },
    { id: 'apple', color: 'red', name: 'Táo', isTarget: true, pos: 'top-1/2 left-1/2' }
];

const Item: React.FC<{ color: string, name: string, selected: boolean, onClick: () => void }> = ({ color, name, selected, onClick }) => (
    <div onClick={onClick} className={`w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-all duration-300 ${selected ? 'ring-4 ring-yellow-400 scale-110' : ''} bg-${color}-500 hover:scale-105`}>
        {name}
    </div>
);

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


// FIX: Destructure onComplete from props to make it available in the component.
const ChallengeColors: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [dialogue, setDialogue] = useState("Viên ngọc thứ hai lấp lánh rồi! Giờ là viên ngọc cuối cùng! Tí Hon thích màu ĐỎ! Bé ơi, hãy chỉ cho Tí Hon tất cả những gì có màu ĐỎ trong phòng này đi!");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [selectedReds, setSelectedReds] = useState<Set<string>>(new Set());

    const [matched, setMatched] = useState({ yellow: false, blue: false });

    const handleSelectRed = (id: string) => {
        if (step !== 1) return;
        const newSelected = new Set(selectedReds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedReds(newSelected);
    };

    useEffect(() => {
        if (step === 1 && selectedReds.size === 3) {
            setFeedback('correct');
            setDialogue("Giỏi quá! Cuối cùng, bạn nhỏ hãy ghép cặp con bướm màu VÀNG với bông hoa màu XANH DƯƠNG nhé!");
            setTimeout(() => {
                setStep(2);
                setFeedback(null);
            }, 2500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReds]);
    
    useEffect(() => {
        if (matched.yellow && matched.blue) {
             setFeedback('correct');
             setDialogue("Tuyệt vời! Chúng ta đã có viên ngọc cuối cùng! Cảm ơn bạn nhỏ!");
             setTimeout(onComplete, 3000);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matched, onComplete]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, color: string) => {
        e.dataTransfer.setData("color", color);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColor: string) => {
        e.preventDefault();
        const droppedColor = e.dataTransfer.getData("color");
        if (droppedColor === targetColor) {
            setMatched(prev => ({ ...prev, [targetColor]: true }));
        } else {
            setFeedback('incorrect');
            setDialogue("Sai rồi, thử lại nhé!");
            setTimeout(() => setFeedback(null), 1500);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();


    const renderStep = () => {
        if (step === 1) {
            return (
                <div className="w-full h-full flex flex-wrap justify-center items-center gap-4">
                    {items.filter(item => item.isTarget).map(item => <Item key={item.id} {...item} selected={selectedReds.has(item.id)} onClick={() => handleSelectRed(item.id)} />)}
                     {items.filter(item => !item.isTarget).map(item => <Item key={item.id} {...item} selected={false} onClick={() => {}} />)}
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
            <DialogueBox text={dialogue} autoPlay={true} />
        </div>
    );
};

export default ChallengeColors;
