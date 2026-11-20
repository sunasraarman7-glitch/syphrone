import { useState } from 'react';
import { motion } from 'framer-motion';

const SPECIALIZATIONS = [
  'Client-Side Cryptography & Security',
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
  },
  {
    name: 'TechyBoy Ecosystem',
    desc: 'Digital products laboratory building modern web solutions, developer utilities, and security tools.',
    badge: 'Startup & Lab',
    icon: 'fa-cubes',
    color: 'text-purple-400',
  },
  {
    name: 'Rahi Tag',
    desc: 'Smart QR-based vehicle identification and emergency contact infrastructure with instant notifications.',
    badge: 'Smart QR Platform',
    icon: 'fa-qrcode',
    color: 'text-emerald-400',
  },
  {
    name: 'School ERP Suite',
    desc: 'Comprehensive educational management solution with dedicated portals for teachers, students, and admins.',
    badge: 'ERP Solution',
    icon: 'fa-school',
    color: 'text-cyan-400',
  },
];


export default function AboutDeveloper({ onClose }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container"
        style={{ maxWidth: 580 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-syphrone-border backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <i className="fa-solid fa-user-astronaut text-base" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Developer Profile</h2>
              <p className="text-xs text-syphrone-muted">Armaan Sunasara · TechyBoy</p>
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

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Main Profile Hero Card */}
          <div className="glass-card rounded-2xl p-5 border border-purple-500/30 relative overflow-hidden shadow-md">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Photo */}
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
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500/50 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                    AS
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-syphrone-bg flex items-center justify-center text-[9px] text-white">
                  ✓
                </span>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">Armaan Sunasara</h3>
                <p className="text-xs text-purple-400 font-semibold mb-2">
                  Co-Founder @ TechyBoy · Full Stack & Security Engineer
                </p>
                <p className="text-xs text-syphrone-muted leading-relaxed mb-3">
                  Passionate about engineering privacy-focused applications, zero-knowledge browser cryptography, and intuitive user experiences.
                </p>

                {/* Social Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://techyboy.live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg glass-card border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 no-underline hover:text-white"
                  >
                    <i className="fa-solid fa-globe text-xs" /> Website
                  </a>
                  <a
                    href="https://github.com/sunasraarman7-glitch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg glass-card border border-syphrone-border text-syphrone-muted text-xs font-semibold flex items-center gap-1.5 no-underline hover:text-white"
                  >
                    <i className="fa-brands fa-github text-xs" /> GitHub
                  </a>
                  <a
                    href="https://www.instagram.com/sunasaraah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg glass-card border border-pink-500/30 text-pink-400 text-xs font-semibold flex items-center gap-1.5 no-underline hover:text-white"
                  >
                    <i className="fa-brands fa-instagram text-xs" /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Competencies */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-syphrone-muted uppercase tracking-wider">Specializations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec} className="p-2.5 rounded-xl bg-syphrone-bg/80 border border-syphrone-border flex items-center gap-2 text-xs text-syphrone-text">
                  <i className="fa-solid fa-check text-blue-400 text-xs shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-syphrone-muted uppercase tracking-wider">Featured Projects</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROJECTS.map((p) => (
                <div key={p.name} className="glass-card rounded-xl p-3.5 border border-syphrone-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`fa-solid ${p.icon} ${p.color} text-xs`} />
                    <span className="text-xs font-bold text-white">{p.name}</span>
                  </div>
                  <p className="text-[11px] text-syphrone-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
