import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, deleteHistoryEntry, clearHistory } from '../utils/history';
import haptic from '../utils/haptics';

function fmtTime(ts) {
  return new Date(ts).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = () => setEntries(getHistory());
  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    deleteHistoryEntry(id);
    load();
    haptic.medium();
  };

  const handleClear = () => {
    clearHistory();
    setEntries([]);
    setConfirmClear(false);
    haptic.success();
  };

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>Local Log Only · Zero Server Transmission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Cipher <span className="text-gradient">History</span>
          </h1>
          <p className="text-syphrone-muted text-xs sm:text-sm mt-2 max-w-xl">
            Metadata only (timestamps, algorithms, byte sizes) — message content is never stored.
          </p>
        </div>

        {entries.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex gap-2 items-center glass-card p-1.5 rounded-xl border border-red-500/30">
                <span className="text-xs text-syphrone-muted pl-2">Delete all?</span>
                <button
                  onClick={handleClear}
                  className="text-xs font-bold text-red-400 hover:text-white px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 transition-colors cursor-pointer"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-syphrone-muted hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-syphrone-muted hover:text-red-400 px-3.5 py-2.5 rounded-xl border border-syphrone-border hover:border-red-500/30 glass-card transition-all flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <i className="fa-regular fa-trash-can text-xs" /> Clear History
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      {entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-syphrone-border space-y-3 max-w-md mx-auto">
          <div className="text-5xl mb-2">📜</div>
          <h3 className="text-base font-bold text-white">No Operations Logged Yet</h3>
          <p className="text-xs text-syphrone-muted leading-relaxed">
            Your recent encryption and decryption operations will appear here locally in your browser sandbox.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs inline-flex items-center gap-2 no-underline shadow"
            >
              <i className="fa-solid fa-lock" /> Encrypt a Message
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.02 }}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-syphrone-border hover:border-blue-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                        entry.mode === 'encrypt'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      <i className={`fa-solid fa-${entry.mode === 'encrypt' ? 'lock' : 'lock-open'} text-[10px]`} />
                      <span>{entry.mode === 'encrypt' ? 'Encrypted' : 'Decrypted'}</span>
                    </span>
                    <span className="text-xs font-mono font-medium text-syphrone-text bg-syphrone-border/40 px-2.5 py-0.5 rounded-lg border border-syphrone-border/60">
                      {entry.algorithm}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-syphrone-muted hidden sm:inline">{fmtTime(entry.timestamp)}</span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-syphrone-muted hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete log"
                    >
                      <i className="fa-regular fa-trash-can text-xs" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-syphrone-bg/80 border border-syphrone-border/60 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-syphrone-muted">Input Size</p>
                    <p className="text-xs text-white font-mono font-bold mt-0.5">{entry.inputSize ? `${entry.inputSize} chars` : '—'}</p>
                  </div>
                  <div className="bg-syphrone-bg/80 border border-syphrone-border/60 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-syphrone-muted">Output Size</p>
                    <p className="text-xs text-white font-mono font-bold mt-0.5">{entry.outputSize ? `${entry.outputSize} chars` : '—'}</p>
                  </div>
                  <div className="bg-syphrone-bg/80 border border-syphrone-border/60 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-syphrone-muted">Passphrase</p>
                    <p className="text-xs font-bold mt-0.5">{entry.hasPassword ? <span className="text-emerald-400">✓ Key Set</span> : <span className="text-syphrone-muted">None</span>}</p>
                  </div>
                </div>

                <div className="flex sm:hidden items-center justify-between text-[10px] text-syphrone-muted pt-1 border-t border-syphrone-border/50">
                  <span>{fmtTime(entry.timestamp)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
