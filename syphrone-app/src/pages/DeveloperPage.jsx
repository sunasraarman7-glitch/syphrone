import { useState } from 'react';

const SPECIALIZATIONS = [
  'Client-Side Cryptography & Web Security',
  'Full Stack Web & Mobile App Development',
  'React, Vite & Modern Frontend Architectures',
  'Progressive Web Apps (PWA) Offline Systems',
  'Zero-Knowledge Architectures & Ciphers',
  'Steganography & Invisible Unicode Encoding',
  'High-Performance UI/UX & Micro-Animations',
  'Security Tooling & Cryptographic Analysis',
];

const PROJECTS = [
  {
    name: 'Syphrone',
    desc: 'Zero-knowledge browser cryptographic platform featuring AES-256-GCM, RSA-2048, and LSB PNG steganography.',
    badge: 'Cryptography Platform',
    icon: 'fa-shield-halved',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    name: 'TechyBoy Ecosystem',
    desc: 'Digital products laboratory building modern web solutions, developer utilities, and security tools.',
    badge: 'Startup & Lab',
    icon: 'fa-cubes',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    name: 'Rahi Tag',
    desc: 'Smart QR-based vehicle identification and emergency contact infrastructure with instant notifications.',
    badge: 'Smart QR Platform',
    icon: 'fa-qrcode',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    name: 'School ERP Suite',
    desc: 'Comprehensive educational management solution with dedicated portals for teachers, students, and admins.',
    badge: 'ERP Solution',
    icon: 'fa-school',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

const TECH_STACK = {
  Frontend: ['React 19', 'Vite 8', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'JavaScript (ESNext)'],
  Cryptography: ['Web Crypto API', 'AES-256-GCM', 'PBKDF2 (310k)', 'RSA-2048 OAEP', 'LSB Steganography'],
  Development: ['Node.js', 'Express', 'Git & GitHub', 'Netlify', 'VS Code', 'Figma'],
};

export default function DeveloperPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Creator Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          About <span className="text-gradient">Armaan Sunasara</span>
        </h1>
        <p className="text-syphrone-muted text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
          Full Stack Developer, Cybersecurity Enthusiast, and Co-Founder of Techyboy. Creator of the Syphrone Cryptographic Platform.
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Hero Profile Card ──────────────────────────────── */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.15)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              {!imgError ? (
                <img
                  src="/arman-sunasara.png"
                  alt="Armaan Sunasara"
                  onError={(e) => {
                    if (e.target.src.indexOf('arman-sunasara.png') !== -1) {
                      e.target.src = 'https://i.ibb.co/qYqt02D6/Arman-Sunasara.png';
                    } else {
                      setImgError(true);
                    }
                  }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-purple-500/50 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl">
                  AS
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-syphrone-bg flex items-center justify-center text-[10px] text-white shadow"
                title="Available for projects & collaborations"
              >
                ✓
              </span>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Armaan Sunasara</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Lead Developer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-300 font-medium mb-3">
                Co-Founder @ TechyBoy · Web Security & Cryptography Architect
              </p>
              <p className="text-xs text-syphrone-muted leading-relaxed max-w-xl mb-4">
                Specialized in engineering high-security web applications, client-side encryption primitives, responsive PWAs, and zero-knowledge privacy systems. Believes privacy should be accessible to all without technical barriers.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <a
                  href="https://techyboy.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl glass-card border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all no-underline"
                >
                  <i className="fa-solid fa-globe text-xs" /> techyboy.live
                </a>
                <a
                  href="https://github.com/sunasraarman7-glitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl glass-card border border-syphrone-border text-syphrone-muted hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-all no-underline"
                >
                  <i className="fa-brands fa-github text-xs" /> GitHub
                </a>
                <a
                  href="https://www.instagram.com/sunasaraah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl glass-card border border-pink-500/30 text-pink-400 hover:text-white hover:bg-pink-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all no-underline"
                >
                  <i className="fa-brands fa-instagram text-xs" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Specializations ────────────────────────────────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-code text-blue-400" /> Core Engineering Competencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {SPECIALIZATIONS.map((spec) => (
              <div key={spec} className="p-3 rounded-xl bg-syphrone-bg/70 border border-syphrone-border/60 flex items-center gap-2.5 text-xs text-syphrone-text">
                <i className="fa-solid fa-check text-blue-400 text-xs shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured Projects ──────────────────────────────── */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-3.5 flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-purple-400" /> Featured Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECTS.map((proj) => (
              <div
                key={proj.name}
                className="glass-card rounded-2xl p-5 border border-syphrone-border hover:border-purple-500/30 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${proj.bg} flex items-center justify-center ${proj.color}`}>
                      <i className={`fa-solid ${proj.icon} text-sm`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-syphrone-border/50 text-syphrone-muted border border-syphrone-border">
                      {proj.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{proj.name}</h4>
                  <p className="text-xs text-syphrone-muted leading-relaxed">{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Technical Stack Breakdown ──────────────────────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-microchip text-cyan-400" /> Technology Stack
          </h3>
          <div className="space-y-3">
            {Object.entries(TECH_STACK).map(([category, items]) => (
              <div key={category}>
                <span className="text-[11px] font-bold text-syphrone-muted uppercase tracking-wider">{category}</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {items.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-lg bg-syphrone-bg/80 text-syphrone-text border border-syphrone-border font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
