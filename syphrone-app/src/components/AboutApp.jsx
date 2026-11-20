import { motion } from 'framer-motion';

const FEATURES = [
  { icon: 'fa-shield-halved', color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'AES-256-GCM', desc: 'Military-grade authenticated encryption' },
  { icon: 'fa-fingerprint', color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'PBKDF2', desc: '310,000 iterations key derivation' },
  { icon: 'fa-eye-slash', color: 'text-cyan-400', bg: 'bg-cyan-500/10', title: 'Zero Knowledge', desc: 'We never see or store your data' },
  { icon: 'fa-signal', color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'Morse Code', desc: 'Classic dot-dash cipher' },
  { icon: 'fa-dna', color: 'text-green-400', bg: 'bg-green-500/10', title: 'DNA Code', desc: 'ATCG nucleotide sequence' },
  { icon: 'fa-face-smile', color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Emoji Encryptor', desc: 'Fun emoji character mapping' },
  { icon: 'fa-code-branch', color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Binary & Hex', desc: 'Low-level base encodings' },
  { icon: 'fa-bolt', color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Lightning Fast', desc: 'Instant browser-side crypto' },
  { icon: 'fa-bomb', color: 'text-red-400', bg: 'bg-red-500/10', title: 'Self-Destruct', desc: 'Configurable expiry timers' },
  { icon: 'fa-wifi-slash', color: 'text-green-400', bg: 'bg-green-500/10', title: 'Offline Capable', desc: 'Works without internet (PWA)' },
  { icon: 'fa-key', color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'RSA-2048', desc: 'Asymmetric key pair generation' },
  { icon: 'fa-image', color: 'text-pink-400', bg: 'bg-pink-500/10', title: 'Steganography', desc: 'Hide messages in PNG images' },
  { icon: 'fa-code', color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'Zero-Width', desc: 'Invisible Unicode encoding' },
  { icon: 'fa-wave-square', color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Entropy Analyzer', desc: 'Shannon entropy visualization' },
  { icon: 'fa-shield', color: 'text-violet-400', bg: 'bg-violet-500/10', title: 'Screen Shield', desc: 'Auto-blur on focus loss' },
  { icon: 'fa-terminal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Command Palette', desc: 'Spotlight-style launcher' },
  { icon: 'fa-database', color: 'text-rose-400', bg: 'bg-rose-500/10', title: 'No Data Storage', desc: 'Nothing sent to any server' },
];

export default function AboutApp({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-syphrone-border backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1 border border-blue-500/30 flex items-center justify-center shadow-lg">
              <img
                src="/syphrone-logo.png"
                onError={(e) => { e.target.src = 'https://i.ibb.co/fdVXv3ww/syphrone.png'; }}
                alt="Syphrone Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">About Syphrone</h2>
              <p className="text-xs text-syphrone-muted">Encrypt. Protect. Vanish.</p>
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

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Version badges */}
          <div className="flex flex-wrap gap-2">
            {['v3.0 Stable', 'AES-256-GCM', 'Web Crypto API', '100% Client-Side', 'Zero Servers'].map((badge) => (
              <span key={badge} className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold font-mono">
                {badge}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="glass-card rounded-2xl p-4 border border-syphrone-border space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-blue-400" /> What is Syphrone?
            </h3>
            <p className="text-xs sm:text-sm text-syphrone-muted leading-relaxed">
              Syphrone is a next-generation cryptographic platform running 100% in your browser. All encryption happens locally using hardware-accelerated Web Crypto API primitives (AES-256-GCM + PBKDF2), RSA-2048, PNG Steganography, Zero-Width Unicode, Morse Code, DNA, and Emoji Ciphers!
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-syphrone-muted uppercase tracking-wider">Features Overview</h3>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="glass-card rounded-xl p-3 border border-syphrone-border flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${f.bg} flex items-center justify-center ${f.color} shrink-0`}>
                    <i className={`fa-solid ${f.icon} text-xs`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{f.title}</p>
                    <p className="text-[10px] text-syphrone-muted truncate">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
