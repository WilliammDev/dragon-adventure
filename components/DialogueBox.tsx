import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAudio } from '../contexts/AudioProvider';

interface DialogueBoxProps {
  text: string;
  autoPlay?: boolean;
  onPlaybackEnd?: () => void;
}

const SpeakerIcon: React.FC<{ isLoading: boolean, isPlaying: boolean, onClick: () => void, isReady: boolean }> = ({ isLoading, isPlaying, onClick, isReady }) => {
  const Icon = () => {
    if (isLoading) {
      return (
        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    if (isPlaying) {
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />;
    }
     if (!isReady) { // Muted / Disabled icon
       return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.5v-13M6.464 15.536L5.05 16.95M17.536 6.464L19.95 4.05M9 12l-6 6M15 12l6-6" />;
    }
    return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M4.732 3.732a9 9 0 0114.536 0M4.732 20.268a9 9 0 0014.536 0M12 18.5a4.5 4.5 0 004.5-4.5H12v4.5zM12 5.5a4.5 4.5 0 014.5 4.5H12V5.5z" />;
  };

  return (
    <button
      onClick={onClick}
      disabled={!isReady || isLoading}
      className={`p-3 rounded-full transition-all duration-300 ${!isReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
      aria-label={isPlaying ? "Dừng" : "Phát âm thanh"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <Icon />
      </svg>
    </button>
  );
};

const DialogueBox: React.FC<DialogueBoxProps> = ({ text, autoPlay = false, onPlaybackEnd }) => {
  const { isVoiceEnabled } = useAudio();
  const { play, isLoading, isPlaying, isReady } = useAudioPlayer({ text: isVoiceEnabled ? text : '', onEnd: onPlaybackEnd });
  const autoPlayedRef = useRef(false);

  // This effect ensures that auto-play only happens once when the audio becomes ready.
  // It prevents the loop that occurred when `isPlaying` became false after playback ended.
  useEffect(() => {
    // When new text arrives, the audio is not ready, so we reset the auto-play flag.
    if (!isReady) {
      autoPlayedRef.current = false;
    }

    if (autoPlay && isReady && !isPlaying && !autoPlayedRef.current) {
      play();
      autoPlayedRef.current = true; // Mark that auto-play has happened for this audio.
    }
  }, [autoPlay, isReady, isPlaying, play]);

  return (
    <div className="w-full bg-white/50 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-4 shadow-lg border border-white/30">
      <div className="flex-shrink-0">
        <SpeakerIcon isLoading={isLoading} isPlaying={isPlaying} onClick={play} isReady={isReady} />
      </div>
      <p className="text-lg md:text-xl font-medium text-gray-800 flex-grow">
        {text}
      </p>
    </div>
  );
};

export default DialogueBox;
