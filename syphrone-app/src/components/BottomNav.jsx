import { memo } from 'react';
import { motion } from 'framer-motion';
import haptic from '../utils/haptics';

const tabs = [
  {
    id: 'home',
    href: '/',
    icon: 'fa-lock',
    label: 'Encrypt',
    title: 'Encrypt & Decrypt Messages — Syphrone',
  },
  {
    id: 'blog',
    href: '/blog',
    icon: 'fa-newspaper',
    label: 'Blog',
    title: 'Security & Encryption Guides — Syphrone',
  },
  {
    id: 'history',
    href: '/history',
    icon: 'fa-clock-rotate-left',
    label: 'History',
    title: 'Cipher History — Syphrone',
  },
  {
    id: 'vault',
    href: '/vault',
    icon: 'fa-vault',
    label: 'Vault',
    title: 'Secure Vault — Syphrone',
  },
  {
    id: 'settings',
    href: '/settings',
    icon: 'fa-sliders',
    label: 'Settings',
    title: 'Settings & Preferences — Syphrone',
  },
];

function BottomNavComponent({ activeTab, onTabChange }) {
  const handleClick = (e, tabId) => {
    e.preventDefault();
    if (activeTab !== tabId) {
      haptic.light();
      onTabChange(tabId);
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-syphrone-bg/92 backdrop-blur-2xl border-t border-syphrone-border/80 pb-safe pt-1.5 px-2 flex justify-around items-center shadow-[0_-10px_35px_rgba(0,0,0,0.5)] select-none"
    >
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.a
              key={tab.id}
              href={tab.href}
              title={tab.title}
              aria-label={tab.title}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleClick(e, tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 min-w-[56px] min-h-[50px] cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-syphrone-muted/65 hover:text-syphrone-muted'
              }`}
            >
              {/* Active animated background pill */}
              {isActive && (
                <motion.div
                  layoutId="activeBottomTabPill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/20 to-purple-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(74,106,255,0.25)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <i
                className={`fa-solid ${tab.icon} text-base sm:text-lg transition-transform duration-200 relative z-10 ${
                  isActive
                    ? 'text-blue-400 scale-110 drop-shadow-[0_0_10px_rgba(74,106,255,0.8)]'
                    : 'text-syphrone-muted/70 group-hover:text-white'
                }`}
              />

              {/* Label */}
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none font-semibold relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-blue-300 font-bold' : 'text-syphrone-muted/60'
                }`}
              >
                {tab.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(BottomNavComponent);
