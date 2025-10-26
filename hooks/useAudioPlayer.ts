import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { getAudioContext, resumeAudioContext } from '../utils/audioContext';

interface UseAudioPlayerProps {
  text: string;
  onEnd?: () => void;
}

export const useAudioPlayer = ({ text, onEnd }: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(getAudioContext());
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const textForBufferRef = useRef<string | null>(null);

  // This effect handles loading the audio data.
  // It only re-runs when the `text` prop changes.
  useEffect(() => {
    const loadAudio = async () => {
      // Don't do anything if there's no text or if the current audio buffer
      // is already for the correct text.
      if (!text || text === textForBufferRef.current) {
        return;
      }
      
      // Stop any audio that might be playing from a previous text.
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch (e) { /* ignore */ }
        sourceRef.current = null;
        setIsPlaying(false);
      }
      
      // We are now fetching for this new text.
      textForBufferRef.current = text;
      setIsLoading(true);
      setAudioBuffer(null); // Clear previous buffer

      try {
        const base64Audio = await generateSpeech(text);
        // Ensure the component hasn't requested a different text while we were fetching.
        if (base64Audio && audioContextRef.current && text === textForBufferRef.current) {
          const decodedBytes = decode(base64Audio);
          const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
          setAudioBuffer(buffer);
        }
      } catch (error) {
        console.error("Failed to load audio:", error);
        // If loading fails, nullify the ref to allow a retry for the same text.
        textForBufferRef.current = null;
      } finally {
        // Only stop loading if we are on the same text request.
        if (text === textForBufferRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadAudio();
  }, [text]);

  // Keep a ref to the onEnd callback to ensure `play` can be stable.
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  // This callback starts playback.
  // It's stable with regard to `isPlaying` and `onEnd` state.
  const play = useCallback(() => {
    resumeAudioContext();
    const audioContext = audioContextRef.current;
    
    if (!audioBuffer || !audioContext) return;

    // Use a functional update to avoid a dependency on `isPlaying`.
    setIsPlaying(currentlyPlaying => {
      if (currentlyPlaying) return true; // Already playing.

      // Stop any lingering source before creating a new one.
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch(e) {}
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
        if (onEndRef.current) {
          onEndRef.current();
        }
      };
      source.start(0);
      sourceRef.current = source;
      return true; // Set state to playing.
    });
  }, [audioBuffer]);

  return { play, isLoading, isPlaying, isReady: !!audioBuffer };
};
