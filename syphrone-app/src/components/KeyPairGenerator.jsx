import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateRSAKeyPair, rsaEncrypt, rsaDecrypt } from '../utils/encryption';
import { copyToClipboard, downloadText } from '../utils/clipboard';

const TABS = ['Generate', 'Encrypt', 'Decrypt'];

export default function KeyPairGenerator({ onClose }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const [pubKey, setPubKey] = useState('');
  const [privKey, setPrivKey] = useState('');
  const [encMsg, setEncMsg] = useState('');
  const [decMsg, setDecMsg] = useState('');
  const [encOut, setEncOut] = useState('');
  const [decOut, setDecOut] = useState('');
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const generate = async () => {
    setLoading(true); setError('');
    try {
      const kp = await generateRSAKeyPair(2048);
      setKeys(kp);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleEncrypt = async () => {
    setLoading(true); setError('');
    try {
      setEncOut(await rsaEncrypt(encMsg, pubKey));
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleDecrypt = async () => {
    setLoading(true); setError('');
    try {
      setDecOut(await rsaDecrypt(decMsg, privKey));
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copy = async (text, label) => {
    await copyToClipboard(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container" style={{ maxWidth: 540 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-syphrone-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <i className="fa-solid fa-key text-purple-400" />
            </div>
            <h2 className="text-lg font-bold">RSA Key Pair</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex bg-syphrone-bg/60 mx-5 mt-5 rounded-xl p-1 border border-syphrone-border">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === i ? 'bg-gradient-secondary text-white border border-purple-500/30' : 'text-syphrone-muted hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {error && <p className="text-red-400 text-sm flex gap-2"><i className="fa-solid fa-circle-exclamation mt-0.5" />{error}</p>}

          {tab === 0 && (
            <>
              <button onClick={generate} disabled={loading}
                className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <span className="spinner" /> : <i className="fa-solid fa-rotate" />}
                {loading ? 'Generating RSA-2048...' : 'Generate RSA-2048 Key Pair'}
              </button>
              {keys && (
                <>
                  {[['Public Key', keys.publicKey, 'pub'], ['Private Key', keys.privateKey, 'priv']].map(([label, val, id]) => (
                    <div key={id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{label}</span>
                        <div className="flex gap-2">
                          <button onClick={() => copy(val, id)} className="text-xs text-syphrone-muted hover:text-white flex items-center gap-1">
                            <i className={`fa-${copiedKey === id ? 'solid fa-check text-green-400' : 'regular fa-copy'}`} />
                            {copiedKey === id ? 'Copied!' : 'Copy'}
                          </button>
                          <button onClick={() => downloadText(val, `syphrone-${id}-key.pem`)} className="text-xs text-syphrone-muted hover:text-white">
                            <i className="fa-solid fa-download" /> PEM
                          </button>
                        </div>
                      </div>
                      <textarea value={val} readOnly rows={5}
                        className="w-full input-field rounded-xl p-3 text-[10px] font-mono resize-none" />
                    </div>
                  ))}
                </>
              )}
              <div className="glass-card rounded-xl p-3 border border-yellow-500/20">
                <p className="text-xs text-yellow-400 flex gap-2">
                  <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
                  RSA-2048 with OAEP padding. Keep your private key secret and never share it.
                </p>
              </div>
            </>
          )}

          {tab === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Public Key (PEM)</label>
                <textarea value={pubKey} onChange={e => setPubKey(e.target.value)} rows={5}
                  placeholder="-----BEGIN PUBLIC KEY-----&#10;..." className="w-full input-field rounded-xl p-3 text-xs font-mono resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Message to Encrypt</label>
                <textarea value={encMsg} onChange={e => setEncMsg(e.target.value)} rows={3}
                  placeholder="Enter your message..." className="w-full input-field rounded-xl p-3 text-sm resize-none" />
              </div>
              <button onClick={handleEncrypt} disabled={loading || !pubKey || !encMsg}
                className="w-full py-3 rounded-xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <span className="spinner" /> : <i className="fa-solid fa-lock" />}
                Encrypt with RSA
              </button>
              {encOut && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white">Encrypted Output</label>
                    <button onClick={() => copy(encOut, 'encout')} className="text-xs text-syphrone-muted hover:text-white flex items-center gap-1">
                      <i className="fa-regular fa-copy" /> {copiedKey === 'encout' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <textarea value={encOut} readOnly rows={4} className="w-full input-field rounded-xl p-3 text-xs font-mono resize-none" />
                </div>
              )}
            </>
          )}

          {tab === 2 && (
            <>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Private Key (PEM)</label>
                <textarea value={privKey} onChange={e => setPrivKey(e.target.value)} rows={5}
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;..." className="w-full input-field rounded-xl p-3 text-xs font-mono resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Encrypted Message</label>
                <textarea value={decMsg} onChange={e => setDecMsg(e.target.value)} rows={3}
                  placeholder="rsa:..." className="w-full input-field rounded-xl p-3 text-xs font-mono resize-none" />
              </div>
              <button onClick={handleDecrypt} disabled={loading || !privKey || !decMsg}
                className="w-full py-3 rounded-xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <span className="spinner" /> : <i className="fa-solid fa-lock-open" />}
                Decrypt with RSA
              </button>
              {decOut && (
                <div className="glass-card rounded-xl p-4 border border-green-500/20">
                  <p className="text-sm text-green-400 font-medium mb-2 flex items-center gap-2"><i className="fa-solid fa-check-circle" /> Decrypted Message</p>
                  <p className="text-sm text-syphrone-text break-words">{decOut}</p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
