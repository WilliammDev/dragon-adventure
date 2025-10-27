import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { getAudioContext } from '../utils/audioContext';
import { loadSounds, playSound as playSfx } from '../utils/soundEffects';

const backgroundMusicUrl = 'https://freesound.orghttps://cdn.freesound.org/previews/709/709988_15232790-lq.mp3';

interface AudioContextType {
  isVoiceEnabled: boolean;
  disableVoice: () => void;
  playSound: (name: 'correct' | 'incorrect' | 'success') => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isVoiceEnabled: true,
  disableVoice: () => {},
  playSound: () => {},
  isMusicPlaying: true,
  toggleMusic: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  
  const audioContext = getAudioContext();
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!audioContext) return;
    let isMounted = true;

    const initAudio = async () => {
      // Load SFX
      if (!soundsLoaded) {
        await loadSounds(audioContext);
        if (isMounted) setSoundsLoaded(true);
      }
      
      // Load and play Music if not already playing
      if (musicSourceRef.current) return;

      try {
        const response = await fetch(backgroundMusicUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        if (!isMounted) return;

        const gainNode = audioContext.createGain();
        musicGainRef.current = gainNode;
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        musicSourceRef.current = source;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start with a soft volume, or muted.
        gainNode.gain.value = isMusicPlaying ? 0.3 : 0; 
        source.start(0);

      } catch (error) {
        console.error("Failed to load/play background music:", error);
      }
    };
    
    if (audioContext.state === 'running') {
        initAudio();
    } else {
        const resumeListener = () => {
            if (audioContext.state === 'running') {
                initAudio();
                audioContext.removeEventListener('statechange', resumeListener);
            }
        };
        audioContext.addEventListener('statechange', resumeListener);
    }
    
    return () => {
      isMounted = false;
      // Note: We don't stop the music on component unmount in a strict sense
      // because the provider wraps the whole app. But it's good practice.
      if (musicSourceRef.current) {
        try { musicSourceRef.current.stop(); } catch(e) {}
        musicSourceRef.current = null;
      }
    };
  }, [audioContext, soundsLoaded, isMusicPlaying]);

  const disableVoice = useCallback(() => {
    console.warn("AI voice has been disabled due to an API error. Falling back to sound effects.");
    setIsVoiceEnabled(false);
  }, []);

  const playSound = useCallback((name: 'correct' | 'incorrect' | 'success') => {
    if (audioContext && soundsLoaded) {
      playSfx(audioContext, name);
    }
  }, [audioContext, soundsLoaded]);
  
  const toggleMusic = useCallback(() => {
    if (!musicGainRef.current || !audioContext) return;
    
    setIsMusicPlaying(prev => {
        const newIsPlaying = !prev;
        const newVolume = newIsPlaying ? 0.3 : 0.0001; // Use a tiny value for fade out
        
        // Use exponentialRamp for a smooth fade effect
        musicGainRef.current?.gain.exponentialRampToValueAtTime(
          newVolume,
          audioContext.currentTime + 0.5
        );
        
        return newIsPlaying;
    });
  }, [audioContext]);

  const value = { isVoiceEnabled, disableVoice, playSound, isMusicPlaying, toggleMusic };

  return (
    <AudioContext.Provider value={value}>
        {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);