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

export default function SettingsPage({
  hapticEnabled, onHapticChange, soundEnabled, onSoundChange,
  screenShield, onScreenShieldChange, autoClearSeconds, onAutoClearChange,
  onShowAbout, onShowAboutDev, onShowFaq, onShowPrivacy, onShowThemes,
  onShowDonate, onShowFeedback, onShowOtherApps, onShowKeyboardShortcuts,
  onShowVault, onShowKeyPairGen, onShowInstallApp,
}) {
  const preferences = [
    {
      icon: soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark',
      color: soundEnabled ? 'text-amber-400' : 'text-slate-400',
      bg: soundEnabled ? 'bg-amber-500/10' : 'bg-slate-500/10',
      label: 'Audio Effects',
      sub: soundEnabled ? 'Coin spinning & cryptographic interaction sounds active' : 'Muted (silent operations)',
      control: (
        <Toggle
          enabled={soundEnabled}
          onToggle={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            onSoundChange(next);
          }}
        />
      ),
    },
    {
      icon: 'fa-mobile-screen',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Haptic Feedback',
      sub: 'Tactile vibration response on supported mobile devices',
      control: (
        <Toggle
          enabled={hapticEnabled}
          onToggle={() => {
            const next = !hapticEnabled;
            setHapticEnabled(next);
            onHapticChange(next);
          }}
        />
      ),
    },
    {
      icon: 'fa-eye-slash',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      label: 'Screen Shield',
      sub: 'Auto-blur plaintext and ciphers when browser window loses focus',
      control: (
        <Toggle
          enabled={screenShield}
          onToggle={() => {
            const next = !screenShield;
            localStorage.setItem('syphrone-screen-shield', next.toString());
            onScreenShieldChange(next);
          }}
        />
      ),
    },
    {
      icon: 'fa-clock',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      label: 'Auto-Clear Memory Timer',
      sub: 'Automatically erases active messages after inactivity',
      control: (
        <div className="relative">
          <select
            value={autoClearSeconds}
            onChange={(e) => {
              const v = Number(e.target.value);
              localStorage.setItem('syphrone-auto-clear', v.toString());
              onAutoClearChange(v);
            }}
            className="input-field rounded-xl px-3.5 py-2 text-xs appearance-none cursor-pointer pr-8 font-medium"
          >
            {AUTO_CLEAR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-syphrone-muted pointer-events-none">
            <i className="fa-solid fa-chevron-down text-[9px]" />
          </div>
        </div>
      ),
    },
  ];

  const quickLinks = [
    { icon: 'fa-palette', color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Signal Palettes', sub: '20 free visual themes', action: onShowThemes },
    { icon: 'fa-key', color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'RSA Key Pair Generator', sub: 'Generate asymmetric keys in-browser', action: onShowKeyPairGen },
    { icon: 'fa-vault', color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Secure Vault', sub: 'Open AES encrypted note storage', action: onShowVault },
    { icon: 'fa-keyboard', color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Keyboard Shortcuts', sub: 'Spotlight shortcuts & hotkeys', action: onShowKeyboardShortcuts },
    { icon: 'fa-shield-halved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Privacy Policy', sub: 'Zero-log & zero-knowledge guarantee', action: onShowPrivacy },
    { icon: 'fa-circle-question', color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'FAQ & Questions', sub: 'Cryptographic knowledge base', action: onShowFaq },
    { icon: 'fa-circle-info', color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'About Platform', sub: 'Syphrone v3.0 architecture', action: onShowAbout },
    { icon: 'fa-user-astronaut', color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Developer Profile', sub: 'Armaan Sunasara · Techyboy', action: onShowAboutDev },
    { icon: 'fa-comment-dots', color: 'text-teal-400', bg: 'bg-teal-500/10', label: 'Send Feedback', sub: 'Bug reports & feature requests', action: onShowFeedback },
    { icon: 'fa-heart', color: 'text-red-400', bg: 'bg-red-500/10', label: 'Support Us', sub: 'Buy us a chai ☕', action: onShowDonate },
    { icon: 'fa-download', color: 'text-green-400', bg: 'bg-green-500/10', label: 'Install App (PWA)', sub: 'Add Syphrone to your home screen', action: onShowInstallApp },
    { icon: 'fa-cubes', color: 'text-indigo-400', bg: 'bg-indigo-500/10', label: 'Our Other Apps', sub: 'PuzzleVerse, WallCraft, PokenGo', action: onShowOtherApps },
  ];

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-300 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          <span>Local Device Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          App <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-syphrone-muted text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
          All settings and toggles are saved exclusively in your browser’s local storage.
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Preferences Section ────────────────────────────── */}
        <section aria-label="Preferences">
          <h2 className="text-xs font-bold text-syphrone-muted uppercase tracking-wider mb-3 px-1">
            Privacy & Performance Toggles
          </h2>
          <div className="glass-card rounded-2xl border border-syphrone-border overflow-hidden divide-y divide-syphrone-border/60">
            {preferences.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 sm:p-5 gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                    <i className={`fa-solid ${item.icon} text-sm`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[11px] text-syphrone-muted mt-0.5 leading-snug">{item.sub}</p>
                  </div>
                </div>
                {item.control}
              </div>
            ))}
          </div>
        </section>

        {/* ── Features & Shortcuts Grid ──────────────────────── */}
        <section aria-label="Quick Actions">
          <h2 className="text-xs font-bold text-syphrone-muted uppercase tracking-wider mb-3 px-1">
            Tools, Features & Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="glass-card rounded-xl p-3.5 border border-syphrone-border hover:border-blue-500/40 hover:bg-white/5 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                    <i className={`fa-solid ${item.icon} text-xs`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">{item.label}</p>
                    <p className="text-[10px] text-syphrone-muted truncate leading-snug">{item.sub}</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-syphrone-muted text-xs group-hover:translate-x-1 group-hover:text-blue-400 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
