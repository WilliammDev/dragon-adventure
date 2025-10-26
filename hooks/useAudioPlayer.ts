import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { getAudioContext, resumeAudioContext } from '../utils/audioContext';

export const useAudioPlayer = (text: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(getAudioContext());
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (e) {
            // Ignore errors from stopping an already stopped source
        }
      }
    };
  }, []);

  const loadAndPrepareAudio = useCallback(async (textToSpeak: string) => {
    if (!textToSpeak || !audioContextRef.current) return;
    setIsLoading(true);
    // Invalidate previous buffer
    setAudioBuffer(null); 
    if (sourceRef.current) {
        try {
            sourceRef.current.stop();
        } catch(e) {}
        sourceRef.current = null;
    }
    setIsPlaying(false);

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
  // The dependency array intentionally omits loadAndPrepareAudio because we only want this to re-run when `text` changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const play = useCallback(() => {
    // Ensure the audio context is active
    resumeAudioContext();
    const audioContext = audioContextRef.current;

    if (!audioBuffer || !audioContext || isPlaying) return;

    // Stop any previous sound
    if (sourceRef.current) {
       try {
        sourceRef.current.stop();
       } catch(e){}
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
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
