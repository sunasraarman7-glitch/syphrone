import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoinRewards, useCoins } from '../utils/rewards';

function CoinPill({ onShowThemes }) {
  const { coins, secondsLeft, showRewardToast, rewardAmount } = useCoinRewards();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        onClick={onShowThemes}
        title="Earn 200 coins every 30s! Tap to explore 20 free themes."
        aria-label={`${coins} Syphrone coins. Next reward in ${secondsLeft} seconds.`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0"
      >
        <span className="text-sm leading-none animate-pulse">🪙</span>
        <span className="text-xs font-bold text-amber-400 tabular-nums">{coins}</span>
        <span className="hidden sm:inline text-[10px] font-medium text-amber-300/70 border-l border-amber-500/30 pl-1.5">
          +{200} in {secondsLeft}s
        </span>
      </motion.button>

      {/* Floating 30-Second Coin Reward Notification */}
      <AnimatePresence>
        {showRewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center gap-2 pointer-events-none"
          >
            <span className="text-sm">🪙</span>
            <span>+{rewardAmount} Coins Earned!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileCoinPreview({ onShowThemes, onClose }) {
  const { coins } = useCoins();
  return (
    <div
      onClick={() => { onShowThemes(); onClose(); }}
      className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-all shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
          🪙
        </div>
        <div>
          <p className="text-sm font-bold text-white">{coins} Syphrone Coins</p>
          <p className="text-xs text-amber-400/90">+200 earned every 30s · 100% Free Themes Unlocked</p>
        </div>
      </div>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
        Palettes →
      </span>
    </div>
  );
}

function HeaderComponent({
  onShowAbout, onShowAboutDev, onShowThemes, onShowDonate,
  onShowFeedback, onShowOtherApps, onShowSettings, onShowKeyboardShortcuts,
  onShowCommandPalette, onShowVault, onShowKeyPairGen, onShowHistory,
  onShowBlog, onShowFaq, onShowPrivacy, onShowInstallApp, onToggleDecoy,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuSections = [
    {
      title: 'Knowledge & Guides',
      items: [
        { icon: 'fa-newspaper',        label: 'Security Blog',        sub: '20+ guides & crypto articles', action: onShowBlog,              color: 'text-blue-400',   bg: 'bg-blue-500/10' },
        { icon: 'fa-circle-question',  label: 'FAQ & Help',           sub: 'Security questions & answers', action: onShowFaq,               color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
        { icon: 'fa-shield-halved',    label: 'Privacy Policy',       sub: 'Zero-log & zero-knowledge guarantee', action: onShowPrivacy,     color: 'text-emerald-400',bg: 'bg-emerald-500/10' },
        { icon: 'fa-circle-info',      label: 'About Platform',       sub: 'Architecture & Web Crypto API', action: onShowAbout,           color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { icon: 'fa-user-astronaut',   label: 'Developer Profile',    sub: 'Armaan Sunasara · Techyboy',  action: onShowAboutDev,          color: 'text-purple-400', bg: 'bg-purple-500/10' },
      ]
    },
    {
      title: 'Tools & Utilities',
      items: [
        { icon: 'fa-palette',          label: 'Signal Palettes',      sub: '20 free visual themes',       action: onShowThemes,            color: 'text-amber-400',  bg: 'bg-amber-500/10' },
        { icon: 'fa-vault',            label: 'Secure Vault',         sub: 'AES-encrypted local notes (Ctrl+Shift+V)', action: onShowVault, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { icon: 'fa-key',              label: 'RSA Key Pair Generator', sub: 'Generate asymmetric key pairs', action: onShowKeyPairGen,    color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { icon: 'fa-clock-rotate-left',label: 'Cipher History',       sub: 'Local past cryptographic operations', action: onShowHistory,    color: 'text-slate-400',  bg: 'bg-slate-500/10' },
        { icon: 'fa-eye-slash',        label: 'Decoy Mode',           sub: 'Camouflage screen shield (Ctrl+Shift+D)', action: onToggleDecoy, color: 'text-pink-400', bg: 'bg-pink-500/10' },
      ]
    },
    {
      title: 'Controls & Support',
      items: [
        { icon: 'fa-terminal',         label: 'Command Palette',      sub: 'Quick action launcher (Ctrl+K)', action: onShowCommandPalette, color: 'text-teal-400',   bg: 'bg-teal-500/10' },
        { icon: 'fa-keyboard',         label: 'Keyboard Shortcuts',   sub: 'Hotkeys & keybindings (Ctrl+/)', action: onShowKeyboardShortcuts, color: 'text-sky-400',  bg: 'bg-sky-500/10' },
        { icon: 'fa-sliders',          label: 'Settings',             sub: 'Audio, haptics & auto-clear (Ctrl+,)', action: onShowSettings, color: 'text-slate-300', bg: 'bg-slate-500/10' },
        { icon: 'fa-download',         label: 'Download / Install PWA', sub: 'Offline browser application', action: onShowInstallApp,      color: 'text-green-400',  bg: 'bg-green-500/10' },
        { icon: 'fa-comment-dots',     label: 'Send Feedback',        sub: 'Suggestions & bug reports',   action: onShowFeedback,          color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { icon: 'fa-heart',            label: 'Support Us',           sub: 'Buy us a chai ☕',             action: onShowDonate,            color: 'text-red-400',    bg: 'bg-red-500/10' },
        { icon: 'fa-cubes',            label: 'Our Other Apps',       sub: 'Explore more apps by Techyboy', action: onShowOtherApps,       color: 'text-blue-400',   bg: 'bg-blue-500/10' },
      ]
    }
  ];

  const handleMenuClick = (action) => {
    action?.();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-syphrone-bg/85 backdrop-blur-xl border-b border-syphrone-border/60 transition-all">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 max-w-6xl mx-auto w-full">

        {/* ── Logo ─────────────────────────────────────────── */}
        <a
          href="/"
          aria-label="Syphrone — Home"
          className="flex items-center gap-3 no-underline shrink-0 group"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(74,106,255,0.25)] group-hover:shadow-[0_0_20px_rgba(74,106,255,0.45)] group-hover:scale-105 transition-all">
              <img
                src="/syphrone-logo.png"
                onError={(e) => { e.target.src = 'https://i.ibb.co/fdVXv3ww/syphrone.png'; }}
                alt="Syphrone Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-syphrone-bg ring-1 ring-emerald-400/40" title="100% Client-Side Safe" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Syphrone</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">v3.0</span>
            </div>
            <p className="text-[9px] sm:text-[10px] tracking-wider text-syphrone-muted uppercase leading-none font-medium">Encrypt · Protect · Vanish</p>
          </div>
        </a>

        {/* ── Right side controls ───────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Self-contained Coin Pill (Ticks independently without re-rendering Header or App) */}
          <CoinPill onShowThemes={onShowThemes} />

          {/* Desktop quick-action buttons */}
          <div className="hidden sm:flex gap-1.5">
            <button
              onClick={onShowCommandPalette}
              title="Command Palette (Ctrl+K)"
              aria-label="Command Palette"
              className="px-2.5 py-1.5 rounded-xl glass-card flex items-center gap-1.5 text-syphrone-muted hover:text-white border border-syphrone-border hover:border-blue-500/40 text-xs transition-all cursor-pointer"
            >
              <i className="fa-solid fa-terminal text-xs text-blue-400" />
              <span className="font-mono text-[11px] text-syphrone-muted">Ctrl+K</span>
            </button>
            <button
              onClick={onShowSettings}
              title="Settings"
              aria-label="Settings"
              className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-syphrone-muted hover:text-white border border-syphrone-border hover:border-blue-500/40 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-sliders text-xs" />
            </button>
          </div>

          {/* Hamburger button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass-card flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              menuOpen
                ? 'border-blue-500/60 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(74,106,255,0.3)]'
                : 'text-syphrone-muted hover:text-white border-syphrone-border hover:border-blue-500/40'
            }`}
          >
            <motion.i
              key={menuOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}
            />
          </motion.button>
        </div>
      </div>

      {/* ── Mobile & Desktop Mega Dropdown Drawer ─────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-syphrone-border/60 bg-syphrone-bg/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="max-w-4xl mx-auto max-h-[75vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-5">

              {/* Coin preview row (Listens to coins without 1s interval re-renders) */}
              <MobileCoinPreview onShowThemes={onShowThemes} onClose={() => setMenuOpen(false)} />

              {/* Categorized Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menuSections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-syphrone-muted/80 px-2">{section.title}</p>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleMenuClick(item.action)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition-all text-left cursor-pointer group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                            <i className={`fa-solid ${item.icon} text-xs ${item.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors truncate">{item.label}</p>
                            <p className="text-[10px] text-syphrone-muted truncate">{item.sub}</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-[10px] text-syphrone-muted/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="pt-4 border-t border-syphrone-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-syphrone-muted">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Client-Side Active</span>
                </span>
                <span className="text-[11px]">Syphrone Cryptographic Suite</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default memo(HeaderComponent);
