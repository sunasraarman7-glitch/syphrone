import { motion } from 'framer-motion';
import { setHapticEnabled } from '../utils/haptics';
import { setSoundEnabled } from '../utils/coinSound';

const AUTO_CLEAR_OPTIONS = [
  { label: 'Never (Off)', value: 0 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
];

function Toggle({ enabled, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
        enabled ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(74,106,255,0.4)]' : 'bg-syphrone-border'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 25 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </motion.button>
  );
}

export default function SettingsModal({
  hapticEnabled, onHapticChange, soundEnabled, onSoundChange,
  screenShield, onScreenShieldChange, autoClearSeconds, onAutoClearChange, onClose,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-syphrone-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <i className="fa-solid fa-sliders text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quick Settings</h2>
              <p className="text-xs text-syphrone-muted">Stored locally on your device</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </motion.button>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Sound Effects */}
          <div className="glass-card rounded-2xl p-4 border border-syphrone-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <i className={`fa-solid fa-${soundEnabled ? 'volume-high' : 'volume-xmark'} text-xs`} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Audio Effects</p>
                <p className="text-[11px] text-syphrone-muted">{soundEnabled ? 'Enabled' : 'Muted'}</p>
              </div>
            </div>
            <Toggle
              enabled={soundEnabled}
              onToggle={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                onSoundChange(next);
              }}
            />
          </div>

          {/* Haptic Feedback */}
          <div className="glass-card rounded-2xl p-4 border border-syphrone-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-mobile-screen text-xs" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Haptic Feedback</p>
                <p className="text-[11px] text-syphrone-muted">Vibration on Android</p>
              </div>
            </div>
            <Toggle
              enabled={hapticEnabled}
              onToggle={() => {
                const next = !hapticEnabled;
                setHapticEnabled(next);
                onHapticChange(next);
              }}
            />
          </div>

          {/* Screen Shield */}
          <div className="glass-card rounded-2xl p-4 border border-syphrone-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-eye-slash text-xs" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Screen Shield</p>
                <p className="text-[11px] text-syphrone-muted">Blur on focus loss</p>
              </div>
            </div>
            <Toggle
              enabled={screenShield}
              onToggle={() => {
                const next = !screenShield;
                localStorage.setItem('syphrone-screen-shield', next.toString());
                onScreenShieldChange(next);
              }}
            />
          </div>

          {/* Auto-Clear */}
          <div className="glass-card rounded-2xl p-4 border border-syphrone-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-clock text-xs" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Auto-Clear Timer</p>
                <p className="text-[11px] text-syphrone-muted">Erase text on inactivity</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={autoClearSeconds}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  localStorage.setItem('syphrone-auto-clear', v.toString());
                  onAutoClearChange(v);
                }}
                className="input-field rounded-xl px-3 py-1.5 text-xs appearance-none cursor-pointer pr-7"
              >
                {AUTO_CLEAR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-syphrone-muted pointer-events-none">
                <i className="fa-solid fa-chevron-down text-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
