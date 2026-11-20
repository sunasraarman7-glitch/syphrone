let hapticEnabled = localStorage.getItem('syphrone-haptic') !== 'false';

export function setHapticEnabled(val) {
  hapticEnabled = val;
  localStorage.setItem('syphrone-haptic', val.toString());
}

export function isHapticEnabled() {
  return hapticEnabled && 'vibrate' in navigator;
}

function vibrate(pattern) {
  if (isHapticEnabled()) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

const haptic = {
  light:   () => vibrate(8),
  medium:  () => vibrate(16),
  heavy:   () => vibrate(30),
  success: () => vibrate([8, 40, 12]),
  error:   () => vibrate([40, 25, 40, 25, 80]),
  copy:    () => vibrate([6, 20, 6]),
  warning: () => vibrate([20, 30, 60]),
};

export default haptic;
