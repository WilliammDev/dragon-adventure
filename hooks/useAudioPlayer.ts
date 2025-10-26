import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

// This is a browser-only feature.
// FIX: Cast window to any to allow access to vendor-prefixed webkitAudioContext for Safari support.
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const useAudioPlayer = (text: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext only once
    if (!audioContextRef.current && AudioContext) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }

    return () => {
      // Cleanup on unmount
      sourceRef.current?.stop();
    };
  }, []);

  const loadAndPrepareAudio = useCallback(async (textToSpeak: string) => {
    if (!textToSpeak || !audioContextRef.current) return;
    setIsLoading(true);
    setAudioBuffer(null);
    try {
      const base64Audio = await generateSpeech(textToSpeak);
      if (base64Audio && audioContextRef.current) {
        const decodedBytes = decode(base64Audio);
        const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
        setAudioBuffer(buffer);
      }
    } catch (error) {
      console.error("Failed to load audio:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAndPrepareAudio(text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const play = useCallback(() => {
    if (!audioBuffer || !audioContextRef.current || isPlaying) return;

    // Stop any previous sound
    if (sourceRef.current) {
      sourceRef.current.stop();
    }
    
    // Resume context if it's suspended
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      setIsPlaying(false);
      sourceRef.current = null;
    };
    source.start(0);
    sourceRef.current = source;
    setIsPlaying(true);
  }, [audioBuffer, isPlaying]);

  return { play, isLoading, isPlaying, isReady: !!audioBuffer };
};
