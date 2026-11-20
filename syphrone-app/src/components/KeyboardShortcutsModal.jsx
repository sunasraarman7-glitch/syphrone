import { motion } from 'framer-motion';

const SHORTCUTS = [
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'],         desc: 'Open Command Palette' },
    { keys: ['Ctrl', '/'],         desc: 'Keyboard Shortcuts' },
    { keys: ['Ctrl', ','],         desc: 'Open Settings' },
    { keys: ['Escape'],            desc: 'Close modal / palette' },
  ]},
  { category: 'Features', items: [
    { keys: ['Ctrl', 'Shift', 'V'], desc: 'Open Secure Vault' },
    { keys: ['Ctrl', 'Shift', 'D'], desc: 'Toggle Decoy Mode' },
  ]},
  { category: 'Panel Actions', items: [
    { keys: ['Ctrl', 'Enter'],     desc: 'Encrypt / Decrypt' },
    { keys: ['Ctrl', 'Shift', 'C'],desc: 'Copy output' },
    { keys: ['Ctrl', 'L'],         desc: 'Clear all fields' },
    { keys: ['Ctrl', 'D'],         desc: 'Download output' },
    { keys: ['Ctrl', 'Q'],         desc: 'Show QR Code' },
  ]},
];

export default function KeyboardShortcutsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container" style={{ maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-syphrone-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <i className="fa-solid fa-keyboard text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {SHORTCUTS.map((section, si) => (
            <motion.div key={section.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.06 }}>
              <h3 className="text-xs font-semibold text-syphrone-muted uppercase tracking-wider mb-3">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: si * 0.06 + i * 0.04 }}
                    className="flex items-center justify-between glass-card rounded-xl px-4 py-3">
                    <span className="text-sm text-syphrone-text">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, ki) => (
                        <span key={ki}>
                          <kbd className="px-2 py-1 text-[10px] font-mono bg-syphrone-bg border border-syphrone-border rounded text-syphrone-text">{k}</kbd>
                          {ki < item.keys.length - 1 && <span className="text-syphrone-muted text-[10px] mx-0.5">+</span>}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
