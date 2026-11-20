// Bulletproof Coin Sound Engine for universfield-spinning-coin-on-table-352448.mp3

const COIN_AUDIO_SRC = '/coin-spin.mp3';

let globalAudio = null;
let isAudioUnlocked = false;

export function isSoundEnabled() {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('syphrone-sound-enabled');
  return saved === null ? true : saved === 'true';
}

export function setSoundEnabled(enabled) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('syphrone-sound-enabled', String(enabled));
  }
}

function getGlobalAudio() {
  if (!globalAudio && typeof window !== 'undefined') {
    globalAudio = new Audio(COIN_AUDIO_SRC);
    globalAudio.preload = 'auto';
    globalAudio.volume = 0.95;
  }
  return globalAudio;
}

// Unlock audio on user interaction to bypass Chrome/Safari autoplay policy
export function unlockAudio() {
  if (isAudioUnlocked) return;
  const audio = getGlobalAudio();
  if (audio) {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      isAudioUnlocked = true;
    }).catch(() => {});
  }
}

// Attach auto-unlock listener to first touch, click, or key press
if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'touchstart', 'pointerdown', 'keydown'];
  const handleFirstInteraction = () => {
    unlockAudio();
    unlockEvents.forEach(evt => window.removeEventListener(evt, handleFirstInteraction));
  };
  unlockEvents.forEach(evt => window.addEventListener(evt, handleFirstInteraction, { once: true }));
}

export function playCoinSound() {
  try {
    if (!isSoundEnabled()) return;

    // Make sure context is unlocked
    unlockAudio();

    const audio = getGlobalAudio();
    if (audio) {
      // Clone audio node for rapid overlapping coin sounds
      const soundNode = audio.cloneNode(true);
      soundNode.volume = 0.95;
      soundNode.currentTime = 0;

      const playPromise = soundNode.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Primary audio retry
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
        });
      }
    }
  } catch {
    // Ignore media playback restrictions
  }
}
