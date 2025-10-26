
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { getAudioContext } from '../utils/audioContext';
import { useAudio } from '../contexts/AudioProvider';

interface UseAudioPlayerProps {
  text: string;
  onEnd?: () => void;
}

export const useAudioPlayer = ({ text, onEnd }: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  
  const { isVoiceEnabled, disableVoice } = useAudio();
  const audioContextRef = useRef<AudioContext | null>(getAudioContext());
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const textForBufferRef = useRef<string | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      if (!text || text === textForBufferRef.current || !isVoiceEnabled) {
        return;
      }
      
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch (e) { /* ignore */ }
        sourceRef.current = null;
        setIsPlaying(false);
      }
      
      textForBufferRef.current = text;
      setIsLoading(true);
      setAudioBuffer(null);

      try {
        const base64Audio = await generateSpeech(text);
        
        if (base64Audio === null) {
          // API failed, disable voice for the rest of the session
          disableVoice();
          setIsLoading(false);
          return;
        }

        if (audioContextRef.current && text === textForBufferRef.current) {
          const decodedBytes = decode(base64Audio);
          const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
          setAudioBuffer(buffer);
        }
      } catch (error) {
        console.error("Failed to load audio:", error);
        disableVoice();
        textForBufferRef.current = null;
      } finally {
        if (text === textForBufferRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadAudio();
  }, [text, isVoiceEnabled, disableVoice]);

  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const play = useCallback(() => {
    if (!audioBuffer || !audioContextRef.current || !isVoiceEnabled) return;

    setIsPlaying(currentlyPlaying => {
      if (currentlyPlaying) return true;

      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch(e) {}
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
        if (onEndRef.current) {
          onEndRef.current();
        }
      };
      source.start(0);
      sourceRef.current = source;
      return true;
    });
  }, [audioBuffer, isVoiceEnabled]);

  return { play, isLoading, isPlaying, isReady: !!audioBuffer && isVoiceEnabled };
};
