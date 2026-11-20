import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CommandPalette({ actions, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
    setSelected(0);
  }, [query]);

  const execute = (action) => {
    action.action?.();
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')     { if (filtered[selected]) execute(filtered[selected]); }
    if (e.key === 'Escape')    { onClose(); }
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="w-full max-w-[560px] mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="glass-strong rounded-2xl overflow-hidden border border-syphrone-border shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-syphrone-border">
            <i className="fa-solid fa-terminal text-blue-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-syphrone-text placeholder-syphrone-muted text-sm outline-none"
            />
            <kbd className="text-[10px] text-syphrone-muted border border-syphrone-border rounded px-1.5 py-0.5">ESC</kbd>
          </div>

          {/* Action list */}
          <div className="max-h-72 overflow-y-auto custom-scrollbar py-2">
            {filtered.length === 0 ? (
              <p className="text-center text-syphrone-muted text-sm py-8">No commands found</p>
            ) : (
              filtered.map((action, i) => (
                <button key={action.id} onClick={() => execute(action)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                    i === selected
                      ? 'bg-blue-500/10 border-l-2 border-blue-500'
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}>
                  <span className="text-xl w-7 text-center">{action.icon}</span>
                  <span className="text-sm text-syphrone-text">{action.label}</span>
                  {action.hint && <span className="ml-auto text-[10px] text-syphrone-muted">{action.hint}</span>}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-syphrone-border flex items-center justify-between">
            <span className="text-[10px] text-syphrone-muted font-mono">SYPHRONE Command Palette</span>
            <div className="flex items-center gap-3 text-[10px] text-syphrone-muted">
              <span><kbd className="border border-syphrone-border rounded px-1">↑↓</kbd> navigate</span>
              <span><kbd className="border border-syphrone-border rounded px-1">↵</kbd> select</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
