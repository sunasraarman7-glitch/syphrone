import { motion } from 'framer-motion';

const APPS = [
  { name: 'PuzzleVerse', desc: 'Challenge your mind with amazing brain-teasing puzzles.', url: 'https://puzzleverse1.netlify.app/', emoji: '🧩', gradient: 'from-purple-500 to-pink-500' },
  { name: 'WallCraft',   desc: 'Stunning high-quality wallpapers for all your devices.', url: 'https://wallcraft99.netlify.app/', emoji: '🎨', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'PokenGo',     desc: 'Catch and explore Pokémon adventures!', url: 'https://pokengo.netlify.app/', emoji: '⚡', gradient: 'from-red-500 to-yellow-500' },
];

export default function OtherApps({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container p-6" style={{ maxWidth: 440 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <i className="fa-solid fa-grid-2 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold">Our Other Apps</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        <div className="space-y-3">
          {APPS.map((app, i) => (
            <motion.a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-4 glass-card rounded-2xl p-4 border border-syphrone-border hover:border-syphrone-muted transition-all cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                {app.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{app.name}</p>
                <p className="text-xs text-syphrone-muted mt-0.5 leading-relaxed">{app.desc}</p>
              </div>
              <i className="fa-solid fa-arrow-up-right-from-square text-syphrone-muted text-sm shrink-0" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
