import { motion } from 'framer-motion';
import { useCoins } from '../utils/rewards';

const THEMES = [
  // 20 Themes — 100% Free & Open for Everyone
  { id: 'default',    name: 'Syphrone Blue',   primary: '#4a6aff', secondary: '#a855f7', gradient: 'from-blue-500 to-purple-600', premium: false },
  { id: 'terminal',   name: 'Terminal Green',  primary: '#00ff41', secondary: '#00cc33', gradient: 'from-green-400 to-green-600', premium: false },
  { id: 'cyberred',   name: 'Cyber Red',       primary: '#ff1744', secondary: '#ff5252', gradient: 'from-red-500 to-red-700', premium: false },
  { id: 'neonblue',   name: 'Neon Blue',       primary: '#00e5ff', secondary: '#2979ff', gradient: 'from-cyan-400 to-blue-600', premium: false },
  { id: 'purplehack', name: 'Purple Hack',     primary: '#aa00ff', secondary: '#e040fb', gradient: 'from-purple-500 to-purple-800', premium: false },
  { id: 'matrix',     name: 'Matrix Code',     primary: '#76ff03', secondary: '#00e676', gradient: 'from-green-300 to-green-500', premium: false },
  { id: 'orange',     name: 'Molten Orange',   primary: '#ff6d00', secondary: '#ff3d00', gradient: 'from-orange-500 to-red-600', premium: false },
  { id: 'nebula',     name: 'Sunset Nebula',   primary: '#ff5e62', secondary: '#ff9966', gradient: 'from-rose-500 to-orange-400', premium: false },
  { id: 'frost',      name: 'Arctic Frost',    primary: '#38bdf8', secondary: '#818cf8', gradient: 'from-sky-400 to-indigo-500', premium: false },
  { id: 'emerald',    name: 'Aether Emerald',  primary: '#10b981', secondary: '#06b6d4', gradient: 'from-emerald-400 to-cyan-500', premium: false },
  { id: 'gold',       name: 'Gold Elite',      primary: '#FFD700', secondary: '#FFA000', gradient: 'from-yellow-400 to-amber-600', premium: false },
  { id: 'rosegold',   name: 'Rose Gold Luxe',  primary: '#f43f5e', secondary: '#fbbf24', gradient: 'from-rose-400 to-amber-500', premium: false },
  { id: 'oled',       name: 'Midnight OLED',   primary: '#00f2fe', secondary: '#4facfe', gradient: 'from-cyan-300 to-blue-500', premium: false },
  { id: 'tokyo',      name: 'Tokyo Cyberpunk', primary: '#ec4899', secondary: '#3b82f6', gradient: 'from-pink-500 to-blue-600', premium: false },
  { id: 'stealth',    name: 'Stealth Mode',    primary: '#90a4ae', secondary: '#546e7a', gradient: 'from-slate-400 to-slate-600', premium: false },
  { id: 'toxic',      name: 'Toxic Neon',      primary: '#CCFF00', secondary: '#76FF03', gradient: 'from-lime-400 to-green-500', premium: false },
  { id: 'phantom',    name: 'Phantom Violet',  primary: '#7C4DFF', secondary: '#B388FF', gradient: 'from-violet-500 to-violet-700', premium: false },
  { id: 'titanium',   name: 'Titanium Silver', primary: '#e2e8f0', secondary: '#94a3b8', gradient: 'from-gray-200 to-slate-400', premium: false },
  { id: 'solar',      name: 'Solar Flare',     primary: '#f97316', secondary: '#eab308', gradient: 'from-orange-500 to-yellow-500', premium: false },
  { id: 'space',      name: 'Deep Space',      primary: '#c084fc', secondary: '#38bdf8', gradient: 'from-purple-400 to-sky-400', premium: false },
];

export default function ThemeChanger({ activeTheme, coins: propCoins, onThemeChange, onClose }) {
  const { coins: storeCoins } = useCoins();
  const coins = propCoins !== undefined ? propCoins : storeCoins;
  const handleThemeClick = (theme) => {
    onThemeChange(theme.id, { primary: theme.primary, secondary: theme.secondary });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container" style={{ maxWidth: 580 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-syphrone-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <i className="fa-solid fa-palette text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Signal Palettes</h2>
              <p className="text-xs text-syphrone-muted">20 Themes · 100% Free & Open for Everyone</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {coins !== undefined && (
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5">
                <span>🪙</span>
                <span className="text-xs font-bold text-amber-400">{coins} Coins</span>
              </div>
            )}
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
              <i className="fa-solid fa-xmark" />
            </motion.button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-[62vh] overflow-y-auto custom-scrollbar pr-1">
            {THEMES.map(theme => {
              const isActive = activeTheme === theme.id;
              return (
                <motion.button key={theme.id} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleThemeClick(theme)}
                  className={`relative rounded-2xl p-4 text-left transition-all border ${
                    isActive
                      ? 'border-blue-500 shadow-[0_0_20px_rgba(74,106,255,0.35)]'
                      : 'border-syphrone-border hover:border-syphrone-muted'
                  } glass-card cursor-pointer`}
                >
                  {/* Gradient preview */}
                  <div className={`h-16 rounded-xl mb-3 bg-gradient-to-br ${theme.gradient} relative overflow-hidden shadow-inner`}>
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                        <i className="fa-solid fa-check text-black text-[10px]" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{theme.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm" style={{ background: theme.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm" style={{ background: theme.secondary }} />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                      Free
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export { THEMES };
