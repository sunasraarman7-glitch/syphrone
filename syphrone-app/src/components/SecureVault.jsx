import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import haptic from '../utils/haptics';
import { copyToClipboard } from '../utils/clipboard';

const VAULT_KEY = 'syphrone-vault';
const LOCK_TIMEOUT = 5 * 60 * 1000;

export default function SecureVault({ onClose }) {
  const [locked, setLocked] = useState(true);
  const [masterPwd, setMasterPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [visibleNotes, setVisibleNotes] = useState(new Set());
  const [unlockAnim, setUnlockAnim] = useState(false);
  const lockTimerRef = useRef(null);

  const resetLockTimer = () => {
    clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => { setLocked(true); setNotes([]); }, LOCK_TIMEOUT);
  };

  useEffect(() => () => clearTimeout(lockTimerRef.current), []);

  const unlock = async () => {
    if (!masterPwd) { setError('Enter master password'); return; }
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) {
        const { message } = await decryptMessage(stored, masterPwd);
        setNotes(JSON.parse(message));
      } else {
        setNotes([]);
      }
      setLocked(false);
      setError('');
      setUnlockAnim(true);
      setTimeout(() => setUnlockAnim(false), 600);
      haptic.success();
      resetLockTimer();
    } catch {
      setError('Wrong master password');
      haptic.error();
    }
  };

  const save = async (updatedNotes) => {
    const enc = await encryptMessage(JSON.stringify(updatedNotes), masterPwd);
    localStorage.setItem(VAULT_KEY, enc);
    setNotes(updatedNotes);
    resetLockTimer();
  };

  const addNote = async () => {
    if (!newTitle.trim()) return;
    const updated = [{ id: Date.now(), title: newTitle, content: newContent, created: Date.now() }, ...notes];
    await save(updated);
    setAddMode(false);
    setNewTitle('');
    setNewContent('');
    haptic.success();
  };

  const deleteNote = async (id) => {
    await save(notes.filter(n => n.id !== id));
    haptic.medium();
  };

  const toggleVisible = (id) => {
    setVisibleNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container"
        style={{ maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-syphrone-border">
          <div className="flex items-center gap-3">
            <div className={`text-3xl ${unlockAnim ? 'vault-unlock' : ''}`}>🔐</div>
            <div>
              <h2 className="text-lg font-bold">Secure Vault</h2>
              <p className="text-xs text-syphrone-muted">{locked ? 'Enter master password' : `${notes.length} notes encrypted`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!locked && (
              <button onClick={() => { setLocked(true); setNotes([]); }} className="text-xs text-syphrone-muted hover:text-white px-3 py-1.5 rounded-lg border border-syphrone-border transition-colors">
                <i className="fa-solid fa-lock mr-1" /> Lock
              </button>
            )}
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
              <i className="fa-solid fa-xmark" />
            </motion.button>
          </div>
        </div>

        <div className="p-5">
          {locked ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={masterPwd}
                  onChange={e => setMasterPwd(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && unlock()}
                  placeholder="Master password..."
                  className="w-full input-field rounded-xl px-4 py-3.5 pr-12 text-sm"
                />
                <button onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted hover:text-white">
                  <i className={`fa-regular fa-eye${showPwd ? '' : '-slash'}`} />
                </button>
              </div>
              {error && <p className="text-red-400 text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation" />{error}</p>}
              <button onClick={unlock} className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2">
                <i className="fa-solid fa-lock-open" /> Unlock Vault
              </button>
              <p className="text-xs text-center text-syphrone-muted">Auto-locks after 5 minutes of inactivity</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
              {/* Add note form */}
              {addMode ? (
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Note title..."
                    className="w-full input-field rounded-lg px-3 py-2 text-sm" />
                  <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Secret content..."
                    rows={4} className="w-full input-field rounded-lg px-3 py-2 text-sm resize-none" />
                  <div className="flex gap-2">
                    <button onClick={addNote} className="flex-1 py-2 rounded-lg btn-gradient text-white text-sm font-medium">Save Note</button>
                    <button onClick={() => setAddMode(false)} className="flex-1 py-2 rounded-lg border border-syphrone-border text-syphrone-muted text-sm hover:text-white transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddMode(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-syphrone-border text-syphrone-muted hover:text-white hover:border-blue-500/50 text-sm transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-plus" /> Add Encrypted Note
                </button>
              )}

              {/* Notes list */}
              {notes.length === 0 && !addMode && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-syphrone-muted text-sm">No notes yet. Add your first secret note!</p>
                </div>
              )}
              {notes.map(note => (
                <div key={note.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">{note.title}</h3>
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleVisible(note.id)} className="w-7 h-7 rounded-lg bg-syphrone-border/30 flex items-center justify-center text-syphrone-muted hover:text-white transition-colors">
                        <i className={`fa-regular fa-eye${visibleNotes.has(note.id) ? '' : '-slash'} text-xs`} />
                      </button>
                      <button onClick={async () => { await copyToClipboard(note.content); haptic.copy(); }}
                        className="w-7 h-7 rounded-lg bg-syphrone-border/30 flex items-center justify-center text-syphrone-muted hover:text-white transition-colors">
                        <i className="fa-regular fa-copy text-xs" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors">
                        <i className="fa-regular fa-trash-can text-xs" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-syphrone-muted mb-1">{new Date(note.created).toLocaleString('en-IN')}</p>
                  {visibleNotes.has(note.id) ? (
                    <p className="text-sm text-syphrone-text bg-syphrone-bg/60 rounded-lg p-2 break-words">{note.content}</p>
                  ) : (
                    <p className="text-sm text-syphrone-muted">{'•'.repeat(Math.min(note.content.length, 24))}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
