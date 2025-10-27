import React from 'react';
import { useAudio } from '../contexts/AudioProvider';

const MusicToggleButton: React.FC = () => {
    const { isMusicPlaying, toggleMusic } = useAudio();

    const Icon = () => {
        if (isMusicPlaying) {
            return (
                // Music Note Icon
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            );
        }
        return (
            // Music Note with Slash Icon
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
            </>
        );
    };

    return (
        <button
            onClick={toggleMusic}
            className="p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
            aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <Icon />
            </svg>
        </button>
    );
};

export default MusicToggleButton;
