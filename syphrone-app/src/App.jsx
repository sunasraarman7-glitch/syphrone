import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout (eager)
import SyphroneBackground from './components/SyphroneBackground';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Core active page (eager for instant first paint)
import HomePage from './pages/HomePage';

// Secondary pages (lazy-loaded for high performance & minimal bundle size)
const BlogPage = lazy(() => import('./pages/BlogPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));

// Modals (lazy-loaded on demand)
const AboutApp = lazy(() => import('./components/AboutApp'));
const AboutDeveloper = lazy(() => import('./components/AboutDeveloper'));
const ThemeChanger = lazy(() => import('./components/ThemeChanger'));
const DonateModal = lazy(() => import('./components/DonateModal'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const OtherApps = lazy(() => import('./components/OtherApps'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const SecureVault = lazy(() => import('./components/SecureVault'));
const KeyPairGenerator = lazy(() => import('./components/KeyPairGenerator'));
const InstallAppModal = lazy(() => import('./components/InstallAppModal'));
const DecoyMode = lazy(() => import('./components/DecoyMode'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px] py-12">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );
}

// ─── SEO metadata per tab (Section 7 — Guide) ───────────────────────────────
const TAB_SEO = {
  home: {
    title: 'Syphrone — Secure Message Encryption & Steganography',
    description: 'Encrypt messages online with Syphrone. Privacy-focused AES-256-GCM encryption, steganography, RSA-2048 key generation — 100% client-side. Zero server tracking.',
  },
  blog: {
    title: 'Syphrone Blog — Encryption, Privacy & Security Guides',
    description: 'Learn about AES-GCM encryption, steganography, client-side cryptography, and web security with articles from the Syphrone team.',
  },
  history: {
    title: 'Cipher History — Syphrone',
    description: 'Review your recent encryption and decryption operations stored locally in your browser.',
  },
  vault: {
    title: 'Secure Vault — Syphrone',
    description: 'Store encrypted notes and messages in your AES-GCM local secure vault. No server. No cloud.',
  },
  settings: {
    title: 'Settings — Syphrone',
    description: 'Customise Syphrone: haptics, screen shield, auto-clear, themes and more.',
  },
  about: {
    title: 'About Syphrone — Zero-Knowledge Client-Side Cryptography Platform',
    description: 'Learn about Syphrone architecture: AES-256-GCM, PBKDF2 310,000 iterations, Web Crypto API, and zero-knowledge privacy guarantees.',
  },
  developer: {
    title: 'Armaan Sunasara — Lead Developer & Co-Founder of Techyboy',
    description: 'Developer profile of Armaan Sunasara, Co-Founder of Techyboy and creator of Syphrone encryption platform. Full Stack Engineer and security enthusiast.',
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ) — Syphrone Security & Encryption',
    description: 'Find answers to common questions about Syphrone AES-256-GCM encryption, PNG steganography, zero-log policies, and Web Crypto API security.',
  },
  privacy: {
    title: 'Privacy Policy & Zero-Log Guarantee — Syphrone',
    description: 'Syphrone zero-knowledge privacy policy. No cleartext storage, no cookies, no user tracking, 100% client-side cryptographic guarantees.',
  },
};

function useSEO(activeTab) {
  useEffect(() => {
    // If on blog with deep article subpath, BlogPage handles its own specific article SEO
    if (activeTab === 'blog' && window.location.pathname.startsWith('/blog/')) {
      return;
    }

    const seo = TAB_SEO[activeTab] || TAB_SEO.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', seo.title);

    // Update Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const path = activeTab === 'home' ? '/' : `/${activeTab}`;
    const targetUrl = `https://syphrone.netlify.app${path}`;
    if (canonical) canonical.setAttribute('href', targetUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', targetUrl);
  }, [activeTab]);
}

import haptic, { isHapticEnabled } from './utils/haptics';
import { isSoundEnabled } from './utils/coinSound';

// ─── Theme helpers ──────────────────────────────────────────────────────────
function applyTheme(primary, secondary) {
  document.documentElement.style.setProperty('--syph-primary', primary);
  document.documentElement.style.setProperty('--syph-secondary', secondary);
}

function loadSavedTheme() {
  return localStorage.getItem('syphrone-theme') || localStorage.getItem('cipher-vault-theme') || 'default';
}

const THEME_COLORS = {
  // 10 Free Themes
  default:    { primary: '#4a6aff', secondary: '#a855f7' },
  terminal:   { primary: '#00ff41', secondary: '#00cc33' },
  cyberred:   { primary: '#ff1744', secondary: '#ff5252' },
  neonblue:   { primary: '#00e5ff', secondary: '#2979ff' },
  purplehack: { primary: '#aa00ff', secondary: '#e040fb' },
  matrix:     { primary: '#76ff03', secondary: '#00e676' },
  orange:     { primary: '#ff6d00', secondary: '#ff3d00' },
  nebula:     { primary: '#ff5e62', secondary: '#ff9966' },
  frost:      { primary: '#38bdf8', secondary: '#818cf8' },
  emerald:    { primary: '#10b981', secondary: '#06b6d4' },

  // 10 Premium Themes
  gold:       { primary: '#FFD700', secondary: '#FFA000' },
  rosegold:   { primary: '#f43f5e', secondary: '#fbbf24' },
  oled:       { primary: '#00f2fe', secondary: '#4facfe' },
  tokyo:      { primary: '#ec4899', secondary: '#3b82f6' },
  stealth:    { primary: '#90a4ae', secondary: '#546e7a' },
  toxic:      { primary: '#CCFF00', secondary: '#76FF03' },
  phantom:    { primary: '#7C4DFF', secondary: '#B388FF' },
  titanium:   { primary: '#e2e8f0', secondary: '#94a3b8' },
  solar:      { primary: '#f97316', secondary: '#eab308' },
  space:      { primary: '#c084fc', secondary: '#38bdf8' },
};

const VALID_TABS = ['home', 'blog', 'history', 'vault', 'settings', 'about', 'developer', 'faq', 'privacy'];

function resolveTabKey(rawStr) {
  if (!rawStr) return null;
  const clean = rawStr.replace(/^[#/]+|[#/]+$/g, '').toLowerCase().trim();
  const segment = clean.split('/')[0];

  if (VALID_TABS.includes(segment)) return segment;

  if (['encrypt', 'decrypt', 'home', 'tool', 'encoder', 'decoder', 'cipher'].includes(segment)) return 'home';
  if (['blogs', 'blog', 'articles', 'article', 'guides', 'guide', 'news'].includes(segment)) return 'blog';
  if (['about-developer', 'developer-profile', 'developer', 'aboutdev', 'dev', 'author', 'creator', 'armaan', 'armaansunasara'].includes(segment)) return 'developer';
  if (['about-syphrone', 'about-app', 'about', 'platform', 'architecture', 'overview'].includes(segment)) return 'about';
  if (['faq', 'faqs', 'questions', 'frequently-asked-questions', 'help', 'support'].includes(segment)) return 'faq';
  if (['vault', 'saved', 'notes', 'secure-vault', 'saved-notes', 'passwords'].includes(segment)) return 'vault';
  if (['history', 'cipher-history', 'past-ciphers', 'recent', 'logs'].includes(segment)) return 'history';
  if (['settings', 'config', 'preferences', 'options', 'themes', 'theme'].includes(segment)) return 'settings';
  if (['privacy', 'privacy-policy', 'privacy-guarantee', 'terms', 'legal', 'security-policy'].includes(segment)) return 'privacy';

  return null;
}

function getTabFromUrl() {
  const hash = window.location.hash;
  const path = window.location.pathname;

  const tabFromHash = resolveTabKey(hash);
  const tabFromPath = resolveTabKey(path);

  if (tabFromHash && hash !== '#' && hash !== '#/') {
    return tabFromHash;
  }
  if (tabFromPath) {
    return tabFromPath;
  }

  return 'home';
}

export default function App() {
  // Active tab synchronized with both pathname and hash routing
  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Dynamic SEO metadata per active tab
  useSEO(activeTab);

  // Theme
  const savedThemeId = loadSavedTheme();
  const [themeId, setThemeId] = useState(savedThemeId);
  const [themeColors, setThemeColors] = useState(THEME_COLORS[savedThemeId] || THEME_COLORS.default);

  // Settings
  const [hapticEnabled, setHapticEnabledState] = useState(isHapticEnabled());
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled());
  const [screenShield, setScreenShield] = useState(localStorage.getItem('syphrone-screen-shield') === 'true');
  const [autoClearSeconds, setAutoClearSeconds] = useState(Number(localStorage.getItem('syphrone-auto-clear') || '0'));
  const [blurred, setBlurred] = useState(false);

  // Modal states
  const [showAbout, setShowAbout] = useState(false);
  const [showAboutDev, setShowAboutDev] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showOtherApps, setShowOtherApps] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showKeyPairGen, setShowKeyPairGen] = useState(false);
  const [showInstallApp, setShowInstallApp] = useState(false);
  const [decoyMode, setDecoyMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Listen for PWA beforeinstallprompt event for Android 1-tap install
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Check if any modal is currently open
  const isAnyModalOpen = showAbout || showAboutDev || showThemes || showDonate ||
    showFeedback || showOtherApps || showSettings || showKeyboardShortcuts ||
    showCommandPalette || showVault || showKeyPairGen || showInstallApp || decoyMode;

  const closeTopmostModal = useCallback(() => {
    if (showCommandPalette) setShowCommandPalette(false);
    else if (showVault) setShowVault(false);
    else if (showKeyPairGen) setShowKeyPairGen(false);
    else if (showInstallApp) setShowInstallApp(false);
    else if (showSettings) setShowSettings(false);
    else if (showThemes) setShowThemes(false);
    else if (showAbout) setShowAbout(false);
    else if (showAboutDev) setShowAboutDev(false);
    else if (showDonate) setShowDonate(false);
    else if (showFeedback) setShowFeedback(false);
    else if (showOtherApps) setShowOtherApps(false);
    else if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
    else if (decoyMode) setDecoyMode(false);
  }, [
    showCommandPalette, showVault, showKeyPairGen, showInstallApp, showSettings,
    showThemes, showAbout, showAboutDev, showDonate,
    showFeedback, showOtherApps, showKeyboardShortcuts, decoyMode
  ]);

  // Navigate to tab and update URL cleanly
  const navigateToTab = useCallback((tab, subpath = '') => {
    if (VALID_TABS.includes(tab)) {
      setActiveTab(tab);
      const targetPath = tab === 'home' ? '/' : `/${tab}${subpath ? `/${subpath}` : ''}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab, subpath }, '', targetPath);
      }
    }
  }, []);

  // Sync tab with URL changes (browser back/forward & hash changes)
  useEffect(() => {
    const handleUrlChange = () => {
      const currentTab = getTabFromUrl();
      setActiveTab(currentTab);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Android Back Button (popstate listener) & History State
  useEffect(() => {
    const handlePopState = () => {
      if (isAnyModalOpen) {
        closeTopmostModal();
        haptic.light();
      } else {
        const tab = getTabFromUrl();
        setActiveTab(tab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAnyModalOpen, closeTopmostModal]);

  // Push history state when opening a modal so Android Back button closes modal instead of exiting app
  const openModal = useCallback((setter) => {
    window.history.pushState({ modal: true }, '', window.location.pathname || '/');
    setter(true);
    haptic.light();
  }, []);

  // Apply theme on init
  useEffect(() => {
    const colors = THEME_COLORS[themeId] || THEME_COLORS.default;
    applyTheme(colors.primary, colors.secondary);
  }, [themeId]);

  // Screen Shield
  useEffect(() => {
    if (!screenShield) return;
    const onBlur  = () => setBlurred(true);
    const onFocus = () => setBlurred(false);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => { window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus); };
  }, [screenShield]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'k') { e.preventDefault(); openModal(setShowCommandPalette); }
      if (ctrl && e.key === '/') { e.preventDefault(); openModal(setShowKeyboardShortcuts); }
      if (ctrl && e.key === ',') { e.preventDefault(); openModal(setShowSettings); }
      if (ctrl && e.shiftKey && e.key === 'V') { e.preventDefault(); openModal(setShowVault); }
      if (ctrl && e.shiftKey && e.key === 'D') { e.preventDefault(); openModal(setDecoyMode); }
      if (e.key === 'Escape') {
        closeTopmostModal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeTopmostModal, openModal]);

  const handleThemeChange = (id, colors) => {
    setThemeId(id);
    setThemeColors(colors);
    applyTheme(colors.primary, colors.secondary);
    localStorage.setItem('syphrone-theme', id);
  };

  // Command Palette actions
  const commandActions = [
    { id: 'install', icon: '📱', label: 'Download / Install App', action: () => openModal(setShowInstallApp) },
    { id: 'encrypt', icon: '🔒', label: 'Encrypt Message', action: () => navigateToTab('home') },
    { id: 'decrypt', icon: '🔓', label: 'Decrypt Message', action: () => navigateToTab('home') },
    { id: 'blog', icon: '📰', label: 'Security Blog & Guides', action: () => navigateToTab('blog') },
    { id: 'about', icon: 'ℹ️', label: 'About Syphrone', action: () => navigateToTab('about') },
    { id: 'developer', icon: '👨‍💻', label: 'Developer Profile', action: () => navigateToTab('developer') },
    { id: 'faq', icon: '❓', label: 'FAQ & Questions', action: () => navigateToTab('faq') },
    { id: 'privacy', icon: '🛡️', label: 'Privacy Policy', action: () => navigateToTab('privacy') },
    { id: 'vault', icon: '🔐', label: 'Open Secure Vault', hint: 'Ctrl+Shift+V', action: () => openModal(setShowVault) },
    { id: 'history', icon: '📜', label: 'Cipher History', action: () => navigateToTab('history') },
    { id: 'keypair', icon: '🔑', label: 'Generate RSA Keys', action: () => openModal(setShowKeyPairGen) },
    { id: 'themes', icon: '🎨', label: 'Change Theme', action: () => openModal(setShowThemes) },
    { id: 'settings', icon: '⚙️', label: 'Settings', hint: 'Ctrl+,', action: () => navigateToTab('settings') },
    { id: 'decoy', icon: '🕵️', label: 'Toggle Decoy Mode', hint: 'Ctrl+Shift+D', action: () => openModal(setDecoyMode) },
    { id: 'feedback', icon: '💬', label: 'Send Feedback', action: () => openModal(setShowFeedback) },
    { id: 'donate', icon: '❤️', label: 'Support / Donate', action: () => openModal(setShowDonate) },
    { id: 'otherapps', icon: '🧩', label: 'Our Other Apps', action: () => openModal(setShowOtherApps) },
    { id: 'shortcuts', icon: '⌨️', label: 'Keyboard Shortcuts', hint: 'Ctrl+/', action: () => openModal(setShowKeyboardShortcuts) },
  ];

  const headerProps = {
    onShowAbout: () => navigateToTab('about'),
    onShowAboutDev: () => navigateToTab('developer'),
    onShowThemes: () => openModal(setShowThemes),
    onShowDonate: () => openModal(setShowDonate),
    onShowFeedback: () => openModal(setShowFeedback),
    onShowOtherApps: () => openModal(setShowOtherApps),
    onShowSettings: () => navigateToTab('settings'),
    onShowKeyboardShortcuts: () => openModal(setShowKeyboardShortcuts),
    onShowCommandPalette: () => openModal(setShowCommandPalette),
    onShowVault: () => openModal(setShowVault),
    onShowKeyPairGen: () => openModal(setShowKeyPairGen),
    onShowHistory: () => navigateToTab('history'),
    onShowBlog: () => navigateToTab('blog'),
    onShowFaq: () => navigateToTab('faq'),
    onShowPrivacy: () => navigateToTab('privacy'),
    onShowInstallApp: () => openModal(setShowInstallApp),
    onToggleDecoy: () => openModal(setDecoyMode),
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':      return <HomePage autoClearSeconds={autoClearSeconds} />;
      case 'blog':      return <Suspense fallback={<PageLoader />}><BlogPage onNavigateTab={navigateToTab} onShowKeyPairGen={() => openModal(setShowKeyPairGen)} /></Suspense>;
      case 'history':   return <Suspense fallback={<PageLoader />}><HistoryPage /></Suspense>;
      case 'vault':     return <Suspense fallback={<PageLoader />}><VaultPage /></Suspense>;
      case 'about':     return <Suspense fallback={<PageLoader />}><AboutPage onNavigateTab={navigateToTab} /></Suspense>;
      case 'developer': return <Suspense fallback={<PageLoader />}><DeveloperPage onNavigateTab={navigateToTab} /></Suspense>;
      case 'faq':       return <Suspense fallback={<PageLoader />}><FaqPage onNavigateTab={navigateToTab} /></Suspense>;
      case 'privacy':   return <Suspense fallback={<PageLoader />}><PrivacyPage onNavigateTab={navigateToTab} /></Suspense>;
      case 'settings':  return (
        <Suspense fallback={<PageLoader />}>
          <SettingsPage
            hapticEnabled={hapticEnabled} onHapticChange={setHapticEnabledState}
            soundEnabled={soundEnabled} onSoundChange={setSoundEnabledState}
            screenShield={screenShield} onScreenShieldChange={setScreenShield}
            autoClearSeconds={autoClearSeconds} onAutoClearChange={setAutoClearSeconds}
            onShowAbout={() => navigateToTab('about')}
            onShowAboutDev={() => navigateToTab('developer')}
            onShowFaq={() => navigateToTab('faq')}
            onShowPrivacy={() => navigateToTab('privacy')}
            onShowThemes={() => openModal(setShowThemes)}
            onShowDonate={() => openModal(setShowDonate)}
            onShowFeedback={() => openModal(setShowFeedback)}
            onShowOtherApps={() => openModal(setShowOtherApps)}
            onShowKeyboardShortcuts={() => openModal(setShowKeyboardShortcuts)}
            onShowVault={() => openModal(setShowVault)}
            onShowKeyPairGen={() => openModal(setShowKeyPairGen)}
            onShowInstallApp={() => openModal(setShowInstallApp)}
          />
        </Suspense>
      );
      default: return <HomePage autoClearSeconds={autoClearSeconds} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      {/* Animated background (Ultra-smooth GPU radial gradient + lean canvas) */}
      <SyphroneBackground themeColors={themeColors} />

      {/* Decoy mode */}
      <AnimatePresence>
        {decoyMode && (
          <Suspense fallback={null}>
            <DecoyMode onExit={() => setDecoyMode(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Main content (with screen shield) */}
      <div className={`relative flex flex-col min-h-screen ${blurred ? 'screen-shield-active' : ''}`} style={{ zIndex: 10 }}>
        <Header {...headerProps} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav activeTab={activeTab} onTabChange={navigateToTab} />
      </div>

      {/* Modals (Lazy loaded on demand with Suspense) */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showAbout && <AboutApp onClose={() => setShowAbout(false)} />}
          {showAboutDev && <AboutDeveloper onClose={() => setShowAboutDev(false)} />}
          {showThemes && (
            <ThemeChanger
              activeTheme={themeId}
              onThemeChange={handleThemeChange}
              onClose={() => setShowThemes(false)}
            />
          )}
          {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}
          {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
          {showOtherApps && <OtherApps onClose={() => setShowOtherApps(false)} />}
          {showSettings && (
            <SettingsModal
              hapticEnabled={hapticEnabled} onHapticChange={setHapticEnabledState}
              soundEnabled={soundEnabled} onSoundChange={setSoundEnabledState}
              screenShield={screenShield} onScreenShieldChange={setScreenShield}
              autoClearSeconds={autoClearSeconds} onAutoClearChange={setAutoClearSeconds}
              onClose={() => setShowSettings(false)}
            />
          )}
          {showKeyboardShortcuts && <KeyboardShortcutsModal onClose={() => setShowKeyboardShortcuts(false)} />}
          {showCommandPalette && <CommandPalette actions={commandActions} onClose={() => setShowCommandPalette(false)} />}
          {showVault && <SecureVault onClose={() => setShowVault(false)} />}
          {showKeyPairGen && <KeyPairGenerator onClose={() => setShowKeyPairGen(false)} />}
          {showInstallApp && (
            <InstallAppModal
              deferredPrompt={deferredPrompt}
              onClose={() => setShowInstallApp(false)}
              onInstallSuccess={() => setDeferredPrompt(null)}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
