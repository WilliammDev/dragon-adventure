
import React, { useState, useEffect } from 'react';
import DialogueBox from '../DialogueBox';
import { useAudio } from '../../contexts/AudioProvider';

interface ChallengeShapesProps {
  onComplete: () => void;
}

const shapes = [
    { id: 't1', type: 'triangle', color: 'text-red-500', isTarget: true, content: <path d="M10 90 L50 10 L90 90 Z" /> },
    { id: 's1', type: 'square', color: 'text-blue-500', isTarget: false, content: <rect x="10" y="10" width="80" height="80" /> },
    { id: 't2', type: 'triangle', color: 'text-green-500', isTarget: true, content: <path d="M10 90 L50 10 L90 90 Z" /> },
    { id: 'c1', type: 'circle', color: 'text-yellow-500', isTarget: false, content: <circle cx="50" cy="50" r="40" /> },
    { id: 't3', type: 'triangle', color: 'text-purple-500', isTarget: true, content: <path d="M10 90 L50 10 L90 90 Z" /> },
    { id: 'r1', type: 'rectangle', color: 'text-orange-500', isTarget: false, isFinalTarget: true, content: <rect x="10" y="25" width="80" height="50" /> },
];

const ChallengeShapes: React.FC<ChallengeShapesProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [dialogue, setDialogue] = useState("Thử thách đầu tiên! Hãy tìm giúp Tí Hon tất cả đồ vật có hình TAM GIÁC nha, bé ơi! Có 3 cái lận đó!");
  const [actionOnDialogueEnd, setActionOnDialogueEnd] = useState<(() => void) | null>(null);
  const { isVoiceEnabled, playSound } = useAudio();

  const handleSelect = (id: string) => {
    if (step !== 1) return;
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };
  
  const handleFinalSelect = () => {
      if (step !== 2) return;
      setFeedback('correct');
      
      if(isVoiceEnabled) {
        setDialogue("Chính xác! Yeeee! Bạn nhỏ giỏi quá! Chúng mình đã tìm thấy viên ngọc Hình Khối. Mời bé vỗ tay thật to nè!");
        setActionOnDialogueEnd(() => () => {
            playSound('success');
            onComplete();
        });
      } else {
          playSound('success');
          setTimeout(onComplete, 1000);
      }
  }

  useEffect(() => {
    if (step === 1 && selected.size === 3) {
      const isCorrect = Array.from(selected).every(id => shapes.find(s => s.id === id)?.isTarget);
      
      const transitionToStep2 = () => {
          setStep(2);
          setFeedback(null);
      };

      if (isCorrect) {
        setFeedback('correct');
        if (isVoiceEnabled) {
            setDialogue("Chà, giỏi quá! Bây giờ, hãy nói to xem, hình CHỮ NHẬT là cái nào nhỉ? Bấm vào cái cửa sổ hình chữ nhật đi!");
            setActionOnDialogueEnd(() => () => {
                playSound('correct');
                transitionToStep2();
            });
        } else {
            playSound('correct');
            setTimeout(transitionToStep2, 1000);
            setDialogue("Bây giờ, hãy bấm vào cái cửa sổ hình chữ nhật đi!");
        }
      } else {
        setFeedback('incorrect');
        if (isVoiceEnabled) {
            setDialogue("Ồ, Tí Hon nghĩ bạn nhỏ còn có thể làm tốt hơn! Thử lại một lần nữa nha.");
            setActionOnDialogueEnd(() => () => {
              playSound('incorrect');
              setSelected(new Set());
              setFeedback(null);
              setDialogue("Hãy tìm giúp Tí Hon tất cả đồ vật có hình TAM GIÁC nha, bé ơi!");
            });
        } else {
            playSound('incorrect');
            setTimeout(() => {
                setSelected(new Set());
                setFeedback(null);
            }, 1000);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, step, isVoiceEnabled, playSound]);
  
  const handlePlaybackEnd = () => {
    if (actionOnDialogueEnd) {
      actionOnDialogueEnd();
      setActionOnDialogueEnd(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 animate-fade-in">
      <div className="flex-grow grid grid-cols-3 gap-4 place-items-center">
        {shapes.map(({ id, content, color, isFinalTarget }) => (
          <div key={id} onClick={() => step === 1 ? handleSelect(id) : (isFinalTarget && handleFinalSelect())} className={`w-24 h-24 md:w-32 md:h-32 p-2 rounded-lg transition-all duration-300 cursor-pointer ${step === 2 && !isFinalTarget ? 'opacity-30 cursor-not-allowed' : ''} ${selected.has(id) ? 'bg-yellow-300 scale-110' : 'bg-white/70 hover:bg-yellow-100'}`}>
            <svg viewBox="0 0 100 100" className={`w-full h-full ${color} fill-current`}>
              {content}
            </svg>
          </div>
        ))}
      </div>
      {feedback && <div className={`text-2xl font-bold text-center p-2 rounded-lg ${feedback === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{feedback === 'correct' ? 'Đúng rồi!' : 'Thử lại nhé!'}</div>}
      <DialogueBox text={dialogue} autoPlay={true} onPlaybackEnd={handlePlaybackEnd} />
    </div>
  );
};

export default ChallengeShapes;
