
// This module manages a single, shared AudioContext instance for the entire application.
// This is crucial for complying with browser autoplay policies, which often require a user
// interaction to start or resume an AudioContext.

// Fix for Safari and older browsers
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

let audioContext: AudioContext | null = null;

/**
 * Returns the singleton AudioContext instance, creating it if it doesn't exist.
 * @returns The shared AudioContext instance.
 */
export const getAudioContext = (): AudioContext | null => {
  if (!audioContext && AudioContext) {
    audioContext = new AudioContext({ sampleRate: 24000 });
  }
  return audioContext;
};

/**
 * Resumes the shared AudioContext if it is in a suspended state.
 * This function should be called in response to a user gesture (e.g., a click).
 */
export const resumeAudioContext = (): void => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(err => console.error("Error resuming AudioContext:", err));
  }
};
