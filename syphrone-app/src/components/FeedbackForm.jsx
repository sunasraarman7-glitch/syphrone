import { useState } from 'react';
import { motion } from 'framer-motion';

const TYPES = ['General', 'Bug Report', 'Feature Request', 'Praise'];

export default function FeedbackForm({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('General');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { setError('Please write a message'); return; }
    setSending(true); setError('');
    try {
      await fetch('https://formspree.io/f/xyzndgby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, type, message, version: 'v3.0', timestamp: new Date().toISOString() }),
      });
      setSuccess(true);
      setTimeout(() => onClose(), 3000);
    } catch {
      setError('Failed to send. Please try again.');
    }
    setSending(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container p-6" style={{ maxWidth: 460 }}
        onClick={e => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4">✅</motion.div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Thanks for your feedback!</h3>
            <p className="text-syphrone-muted text-sm">We'll read it carefully. Closing in 3s...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <i className="fa-solid fa-comment-dots text-blue-400" />
                </div>
                <h2 className="text-lg font-bold">Send Feedback</h2>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
                <i className="fa-solid fa-xmark" />
              </motion.button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
                  className="input-field rounded-xl px-4 py-3 text-sm" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email (optional)"
                  className="input-field rounded-xl px-4 py-3 text-sm" />
              </div>
              <div className="relative">
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-xs" />
                </div>
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                placeholder="Tell us what you think, report a bug, or suggest a feature..." required
                className="w-full input-field rounded-xl p-4 text-sm resize-none" />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={sending}
                className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {sending ? <span className="spinner" /> : <i className="fa-solid fa-paper-plane" />}
                {sending ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
