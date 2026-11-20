import { useState, useEffect, useRef } from 'react';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import haptic from '../utils/haptics';
import { copyToClipboard } from '../utils/clipboard';

const VAULT_KEY = 'syphrone-vault';
const LOCK_TIMEOUT = 5 * 60 * 1000;

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const [masterPwd, setMasterPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleNotes, setVisibleNotes] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
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

  const save = async (updated) => {
    const enc = await encryptMessage(JSON.stringify(updated), masterPwd);
    localStorage.setItem(VAULT_KEY, enc);
    setNotes(updated);
    resetLockTimer();
  };

  const addNote = async () => {
    if (!newTitle.trim()) return;
    await save([{ id: Date.now(), title: newTitle, content: newContent, created: Date.now() }, ...notes]);
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    haptic.light();
  };

  const handleCopyNote = async (note) => {
    await copyToClipboard(note.content);
    setCopiedId(note.id);
    haptic.success();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(n =>
    !searchQuery.trim() ||
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>AES-256-GCM Encrypted Storage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Secure <span className="text-gradient">Vault</span>
          </h1>
          <p className="text-syphrone-muted text-xs sm:text-sm mt-2 max-w-xl">
            {locked ? 'Encrypted notes stored in your browser memory · Auto-locks in 5 minutes' : `${notes.length} encrypted notes in local vault`}
          </p>
        </div>

        {!locked && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddMode(true)}
              className="px-4 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <i className="fa-solid fa-plus" /> Add Note
            </button>
            <button
              onClick={() => { setLocked(true); setNotes([]); }}
              className="px-3.5 py-2.5 rounded-xl glass-card border border-syphrone-border text-syphrone-muted hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-lock" /> Lock
            </button>
          </div>
        )}
      </div>

      {/* ── Locked State: Master Password Card ──────────────── */}
      {locked ? (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-orange-500/30 max-w-md mx-auto text-center space-y-5 shadow-[0_0_35px_rgba(249,115,22,0.15)]">
          <div className={`text-5xl mx-auto ${unlockAnim ? 'vault-unlock' : ''}`}>🔐</div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Enter Vault Master Password</h2>
            <p className="text-xs text-syphrone-muted mt-1.5 max-w-xs mx-auto">
              All vault notes are encrypted locally with AES-256-GCM. We never store or transmit your master password.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={masterPwd}
                onChange={(e) => setMasterPwd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && unlock()}
                placeholder="Enter master password..."
                className="w-full input-field rounded-xl px-4 py-3.5 pr-12 text-xs sm:text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted hover:text-white cursor-pointer"
              >
                <i className={`fa-regular fa-eye${showPwd ? '' : '-slash'} text-sm`} />
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              onClick={unlock}
              className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <i className="fa-solid fa-unlock" /> Unlock Vault
            </button>
          </div>
        </div>
      ) : (
        /* ── Unlocked State: Notes List ────────────────────── */
        <div className="space-y-4">

          {/* Search Notes */}
          {notes.length > 0 && (
            <div className="relative mb-4">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-syphrone-muted text-xs" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search encrypted notes..."
                className="w-full input-field rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm"
              />
            </div>
          )}

          {/* Add Note Modal/Card */}
          {addMode && (
            <div className="glass-card rounded-2xl p-5 border border-orange-500/40 space-y-3 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-plus text-orange-400" /> New Encrypted Note
              </h3>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note title (e.g. Server recovery phrase, API Token)..."
                className="w-full input-field rounded-xl px-4 py-2.5 text-xs sm:text-sm"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Confidential note content..."
                rows={4}
                className="w-full input-field rounded-xl p-3.5 text-xs sm:text-sm resize-none font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddMode(false)}
                  className="px-4 py-2 rounded-xl glass-card text-xs text-syphrone-muted hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="px-5 py-2 rounded-xl btn-gradient text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <i className="fa-solid fa-check" /> Save & Encrypt
                </button>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div className="space-y-3">
            {filteredNotes.map((note) => {
              const isVisible = visibleNotes.has(note.id);
              return (
                <div key={note.id} className="glass-card rounded-2xl p-4 sm:p-5 border border-syphrone-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{note.title}</h3>
                      <p className="text-[10px] text-syphrone-muted mt-0.5">
                        Saved on {new Date(note.created).toLocaleDateString()} at {new Date(note.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleVisible(note.id)}
                        className="p-2 rounded-xl glass-card text-syphrone-muted hover:text-white transition-colors cursor-pointer text-xs"
                        title={isVisible ? 'Hide Content' : 'Reveal Content'}
                      >
                        <i className={`fa-regular fa-eye${isVisible ? '-slash' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-2 rounded-xl glass-card text-syphrone-muted hover:text-emerald-400 transition-colors cursor-pointer text-xs"
                        title="Copy note content"
                      >
                        <i className={`fa-solid fa-${copiedId === note.id ? 'check text-emerald-400' : 'copy'}`} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-2 rounded-xl glass-card text-syphrone-muted hover:text-rose-400 transition-colors cursor-pointer text-xs"
                        title="Delete note"
                      >
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-syphrone-bg/80 border border-syphrone-border font-mono text-xs text-syphrone-text break-words select-all">
                    {isVisible ? note.content : '••••••••••••••••••••••••••••••••'}
                  </div>
                </div>
              );
            })}

            {notes.length === 0 && !addMode && (
              <div className="glass-card rounded-2xl p-10 text-center border border-syphrone-border space-y-3">
                <div className="text-4xl">📝</div>
                <h3 className="text-sm font-bold text-white">Your Vault is Empty</h3>
                <p className="text-xs text-syphrone-muted max-w-xs mx-auto">
                  Store recovery phrases, API keys, and sensitive notes encrypted locally with AES-256.
                </p>
                <button
                  onClick={() => setAddMode(true)}
                  className="px-5 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow"
                >
                  <i className="fa-solid fa-plus" /> Create First Note
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
