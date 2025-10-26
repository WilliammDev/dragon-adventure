
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAudioContext } from '../utils/audioContext';
import { loadSounds, playSound as playSfx } from '../utils/soundEffects';

interface AudioContextType {
  isVoiceEnabled: boolean;
  disableVoice: () => void;
  playSound: (name: 'correct' | 'incorrect' | 'success') => void;
}

const AudioContext = createContext<AudioContextType>({
  isVoiceEnabled: true,
  disableVoice: () => {},
  playSound: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const audioContext = getAudioContext();

  useEffect(() => {
    const initSounds = async () => {
        if (audioContext && !soundsLoaded) {
          await loadSounds(audioContext);
          setSoundsLoaded(true);
        }
    }
    initSounds();
  }, [audioContext, soundsLoaded]);

  const disableVoice = useCallback(() => {
    console.warn("AI voice has been disabled due to an API error. Falling back to sound effects.");
    setIsVoiceEnabled(false);
}, []);

  const playSound = useCallback((name: 'correct' | 'incorrect' | 'success') => {
    if (audioContext && soundsLoaded) {
      playSfx(audioContext, name);
    }
  }, [audioContext, soundsLoaded]);

  const value = { isVoiceEnabled, disableVoice, playSound };

  return (
    <AudioContext.Provider value={value}>
        {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
