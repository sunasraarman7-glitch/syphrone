
const FEATURES = [
  { icon: 'fa-shield-halved', color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'AES-256-GCM', desc: 'Military-grade authenticated encryption' },
  { icon: 'fa-fingerprint', color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'PBKDF2 Derivation', desc: '310,000 SHA-256 key iterations' },
  { icon: 'fa-eye-slash', color: 'text-cyan-400', bg: 'bg-cyan-500/10', title: 'Zero Knowledge', desc: '100% in-browser client execution' },
  { icon: 'fa-signal', color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'Morse Code', desc: 'Standardized dot-dash audio & text' },
  { icon: 'fa-dna', color: 'text-green-400', bg: 'bg-green-500/10', title: 'DNA Cipher', desc: '2-bit nucleotide ATCG genetic mapping' },
  { icon: 'fa-face-smile', color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Emoji Encryptor', desc: 'Obfuscate text into emoji pairs' },
  { icon: 'fa-code-branch', color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Binary & Hex', desc: 'Direct 8-bit & hex byte encodings' },
  { icon: 'fa-bolt', color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Hardware Crypto', desc: 'Accelerated Web Crypto API speed' },
  { icon: 'fa-bomb', color: 'text-red-400', bg: 'bg-red-500/10', title: 'Self-Destruct Notes', desc: 'Auto-expiring confidential messages' },
  { icon: 'fa-wifi-slash', color: 'text-green-400', bg: 'bg-green-500/10', title: 'Offline PWA', desc: 'Runs offline without active internet' },
  { icon: 'fa-key', color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'RSA-2048', desc: 'Asymmetric public-private key pairs' },
  { icon: 'fa-image', color: 'text-pink-400', bg: 'bg-pink-500/10', title: 'PNG Steganography', desc: 'LSB hidden message pixel encoding' },
  { icon: 'fa-code', color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'Zero-Width Unicode', desc: 'Invisible text hidden in normal words' },
  { icon: 'fa-wave-square', color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Entropy Analyzer', desc: 'Shannon mathematical randomness score' },
  { icon: 'fa-shield', color: 'text-violet-400', bg: 'bg-violet-500/10', title: 'Screen Shield', desc: 'Auto-blur on window focus loss' },
  { icon: 'fa-database', color: 'text-rose-400', bg: 'bg-rose-500/10', title: 'Zero Data Storage', desc: 'No database, no accounts, no telemetry' },
];

export default function AboutPage({ onNavigateTab }) {
  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Platform Architecture & Cryptographic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          About <span className="text-gradient">Syphrone</span>
        </h1>
        <p className="text-syphrone-muted text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
          Syphrone is a browser-native cryptographic platform designed on the absolute premise that privacy is a fundamental human right. Powered entirely by the Web Crypto API.
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Core Architectural Pillars ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: 'fa-shield-halved',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              title: '100% In-Browser',
              desc: 'All cryptographic transformations execute locally using window.crypto.subtle. No server ever receives your plaintext or ciphertext.'
            },
            {
              icon: 'fa-lock',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              title: 'AES-256-GCM',
              desc: 'Galois/Counter Mode provides authenticated encryption with 128-bit authentication tags, preventing ciphertext tampering.'
            },
            {
              icon: 'fa-fingerprint',
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
              title: 'PBKDF2 Stretching',
              desc: '310,000 SHA-256 iterations with unique 16-byte random cryptographic salts neutralize offline brute-force and rainbow table attacks.'
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-syphrone-border hover:border-blue-500/30 flex flex-col justify-between transition-all"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${pillar.bg} flex items-center justify-center ${pillar.color} text-lg mb-3.5`}>
                  <i className={`fa-solid ${pillar.icon}`} />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base mb-1.5">{pillar.title}</h3>
                <p className="text-syphrone-muted text-xs leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Cryptographic Pipeline Steps ───────────────────── */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-syphrone-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <i className="fa-solid fa-gears text-sm" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">How Syphrone Encrypts Your Data</h2>
              <p className="text-xs text-syphrone-muted">Multi-stage pipeline following NIST SP 800-38D standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              {
                num: '01',
                title: 'Salt & IV Generation',
                desc: 'A 16-byte cryptographically secure random salt and a 12-byte initialization vector (IV) are generated per encryption operation via window.crypto.getRandomValues.'
              },
              {
                num: '02',
                title: 'PBKDF2 Key Stretching',
                desc: 'Your passphrase is fed through 310,000 SHA-256 iterations to derive a hardened 256-bit symmetric key, resistant to GPU acceleration attacks.'
              },
              {
                num: '03',
                title: 'AES-256-GCM Encryption',
                desc: 'AES in Galois/Counter Mode encrypts the plaintext and outputs an authenticated ciphertext along with a 128-bit authentication tag.'
              },
              {
                num: '04',
                title: 'Payload Formatting',
                desc: 'Salt, IV, auth tag, and ciphertext are packed into a versioned Base64 envelope (v3:...) ready for copy-pasting across any messaging service.'
              },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-syphrone-bg/80 border border-syphrone-border/70 hover:border-blue-500/30 transition-all">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{step.num}</span>
                <h4 className="text-xs sm:text-sm font-bold text-white mt-2 mb-1">{step.title}</h4>
                <p className="text-[11px] text-syphrone-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Suite Grid ─────────────────────────────── */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white mb-3.5 flex items-center gap-2">
            <i className="fa-solid fa-cubes text-purple-400" />
            <span>Complete Feature Suite (100% Free)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-xl p-3.5 border border-syphrone-border flex flex-col justify-between hover:border-blue-500/30 transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center mb-2.5 ${f.color}`}>
                  <i className={`fa-solid ${f.icon} text-xs`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{f.title}</h4>
                  <p className="text-[10px] text-syphrone-muted mt-1 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Action CTA ───────────────────────────────── */}
        <div className="glass-card rounded-2xl p-6 text-center border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 space-y-3">
          <h3 className="text-base font-bold text-white">Experience Uncompromising Privacy</h3>
          <p className="text-xs text-syphrone-muted max-w-md mx-auto">
            Encrypt your first message right now. Zero sign-up, zero cookies, zero server storage.
          </p>
          <button
            onClick={() => onNavigateTab?.('home')}
            className="px-6 py-3 rounded-xl btn-gradient text-white font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-lock" /> Open Free Encryption Tool
          </button>
        </div>
      </div>
    </div>
  );
}
