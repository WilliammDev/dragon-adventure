// This module loads sound effects from reliable CDN links.
const sounds = {
  // A pleasant 'correct' chime.
  correct: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
  // A fun 'boing' sound for incorrect answers.
  incorrect: 'https://cdn.freesound.org/previews/529/529384_10334845-lq.mp3',
  // A magical 'success' sound.
  success: 'https://cdn.freesound.org/previews/171/171671_2437358-lq.mp3'
};

// This will cache the decoded audio buffers to avoid re-fetching and re-decoding.
let soundBuffers: { [key: string]: AudioBuffer } = {};
let soundsLoaded = false;

/**
 * Fetches and decodes the sound files into AudioBuffers.
 * Must be called once with a valid AudioContext.
 * @param audioContext The global AudioContext instance.
 */
export async function loadSounds(audioContext: AudioContext) {
  if (soundsLoaded) return;
  
  const loadPromises: Promise<void>[] = [];

  for (const key in sounds) {
      const promise = fetch(sounds[key as keyof typeof sounds])
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          soundBuffers[key] = audioBuffer;
        })
        .catch(err => console.error(`Failed to load sound: ${key}`, err));
      loadPromises.push(promise);
  }
  
  await Promise.all(loadPromises);
  soundsLoaded = true;
}

/**
 * Plays a pre-loaded sound effect.
 * @param audioContext The global AudioContext instance.
 * @param name The name of the sound to play ('correct', 'incorrect', 'success').
 */
export function playSound(audioContext: AudioContext, name: string) {
  if (soundBuffers[name]) {
    try {
      const source = audioContext.createBufferSource();
      source.buffer = soundBuffers[name];
      source.connect(audioContext.destination);
      source.start(0);
    } catch (err) {
      console.error("Error playing sound:", err);
    }
  }
}