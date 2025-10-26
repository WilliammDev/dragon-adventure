
import React, { useState, useMemo, useEffect } from 'react';
import { GameStage } from './types';
import StartScreen from './components/scenes/StartScreen';
import ChallengeShapes from './components/scenes/ChallengeShapes';
import ChallengeCounting from './components/scenes/ChallengeCounting';
import ChallengeColors from './components/scenes/ChallengeColors';
import EndScreen from './components/scenes/EndScreen';
import DragonCharacter from './components/DragonCharacter';
import GemIndicator from './components/GemIndicator';
import { resumeAudioContext } from './utils/audioContext';
import { AudioProvider } from './contexts/AudioProvider';

export default function App(): React.ReactElement {
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.START);
  const [gems, setGems] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const unlockAudio = () => {
      resumeAudioContext();
      // Remove listeners once the audio context is unlocked.
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);


  const advanceTo = (stage: GameStage) => {
    setGameStage(stage);
  };

  const collectGem = (index: number) => {
    setGems(prevGems => {
      const newGems = [...prevGems];
      newGems[index] = true;
      return newGems;
    });
  };
  
  const restartGame = () => {
    setGems([false, false, false]);
    setGameStage(GameStage.START);
  };

  const renderScene = () => {
    switch (gameStage) {
      case GameStage.START:
        return <StartScreen onStart={() => advanceTo(GameStage.SHAPES)} />;
      case GameStage.SHAPES:
        return <ChallengeShapes onComplete={() => { collectGem(0); advanceTo(GameStage.COUNTING); }} />;
      case GameStage.COUNTING:
        return <ChallengeCounting onComplete={() => { collectGem(1); advanceTo(GameStage.COLORS); }} />;
      case GameStage.COLORS:
        return <ChallengeColors onComplete={() => { collectGem(2); advanceTo(GameStage.END); }} />;
      case GameStage.END:
        return <EndScreen onRestart={restartGame} />;
      default:
        return <StartScreen onStart={() => advanceTo(GameStage.SHAPES)} />;
    }
  };

  const backgroundClass = useMemo(() => {
    switch (gameStage) {
      case GameStage.START:
      case GameStage.END:
        return 'from-sky-300 to-indigo-400';
      case GameStage.SHAPES:
        return 'from-green-300 to-cyan-400';
      case GameStage.COUNTING:
        return 'from-yellow-200 to-orange-400';
      case GameStage.COLORS:
        return 'from-pink-300 to-purple-400';
      default:
        return 'from-sky-300 to-indigo-400';
    }
  }, [gameStage]);

  return (
    <AudioProvider>
        <main className={`w-full h-screen overflow-hidden bg-gradient-to-br ${backgroundClass} text-gray-800 flex flex-col justify-center items-center p-4`}>
            <div className="absolute top-4 left-4 z-20">
                <h1 className="text-2xl md:text-3xl font-bold text-white text-shadow">Cuộc Phiêu Lưu Của Rồng Con</h1>
            </div>
            <div className="absolute top-4 right-4 z-20">
                <GemIndicator gems={gems} />
            </div>
            <div className="relative w-full max-w-5xl h-full max-h-[90vh] md:max-h-[600px] flex flex-col md:flex-row items-end bg-white/30 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6">
                <div className="w-full md:w-1/3 h-1/4 md:h-full flex items-end justify-center">
                    <DragonCharacter />
                </div>
                <div className="w-full md:w-2/3 h-3/4 md:h-full flex-grow">
                    {renderScene()}
                </div>
            </div>
        </main>
    </AudioProvider>
  );
}
