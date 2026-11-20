import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import MessageExpiry from '../components/MessageExpiry';
import MessageStats from '../components/MessageStats';
import EntropyVisualizer from '../components/EntropyVisualizer';
import HexInspector from '../components/HexInspector';
import QRCodeModal from '../components/QRCodeModal';
import {
  encryptMessage, decryptMessage,
  encryptZeroWidth, decryptZeroWidth,
  encryptMorse, decryptMorse,
  encryptDNA, decryptDNA,
  encryptEmoji, decryptEmoji,
  encryptBinary, decryptBinary,
  encryptBase64, decryptBase64,
  encryptHex, decryptHex
} from '../utils/encryption';
import { encodeToImage, decodeFromImage } from '../utils/steganography';
import { copyToClipboard, pasteFromClipboard, shareText, downloadText, downloadBlob } from '../utils/clipboard';
import { addHistoryEntry } from '../utils/history';
import haptic from '../utils/haptics';

const ALGORITHMS = [
  'AES-256-GCM (Military Grade)',
  'Morse Code (Dots & Dashes)',
  'DNA Code (Nucleotide ATCG)',
  'Emoji Encryptor (Obfuscation)',
  'Binary Code (8-bit bytes)',
  'Base64 Encoder (URL Safe)',
  'Hex Encoder (Hexadecimal)',
  'Zero-Width Unicode (Invisible)',
  'Steganography (PNG Image Carrier)'
];

const ALGO_RAW_NAMES = [
  'AES-256-GCM',
  'Morse Code',
  'DNA Code',
  'Emoji Encryptor',
  'Binary Code',
  'Base64 Encoder',
  'Hex Encoder',
  'Zero-Width Unicode',
  'Steganography (PNG)'
];

export default function HomePage({ autoClearSeconds }) {
  const [mode, setMode] = useState('encrypt'); // 'encrypt' | 'decrypt'
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [algorithm, setAlgorithm] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [output, setOutput] = useState('');
  const [decryptedMsg, setDecryptedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [encryptTime, setEncryptTime] = useState(0);
  const [expiryWarning, setExpiryWarning] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [stegoImage, setStegoImage] = useState(null);
  const [zwCarrier, setZwCarrier] = useState('');
  const fileRef = useRef(null);
  const txtUploadRef = useRef(null);
  const autoRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Auto-clear timer
  const resetAutoTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (autoRef.current) clearTimeout(autoRef.current);
    if (autoClearSeconds > 0) {
      autoRef.current = setTimeout(() => {
        setMessage(''); setPassword(''); setOutput(''); setDecryptedMsg(''); setError('');
      }, autoClearSeconds * 1000);
    }
  }, [autoClearSeconds]);

  useEffect(() => {
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, []);

  const handleActivity = () => resetAutoTimer();

  const generateRandomKey = () => {
    haptic.medium();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars[array[i] % chars.length];
    }
    setPassword(key);
    setShowPwd(true);
    handleActivity();
  };

  const handleEncrypt = async () => {
    if (!message.trim()) { setError('Please enter a message to encrypt'); return; }
    setLoading(true); setError(''); setOutput('');
    const t0 = performance.now();
    try {
      let result = '';
      const algoName = ALGO_RAW_NAMES[algorithm];

      switch (algoName) {
        case 'Morse Code':
          result = encryptMorse(message);
          break;
        case 'DNA Code':
          result = encryptDNA(message);
          break;
        case 'Emoji Encryptor':
          result = encryptEmoji(message);
          break;
        case 'Binary Code':
          result = encryptBinary(message);
          break;
        case 'Base64 Encoder':
          result = encryptBase64(message);
          break;
        case 'Hex Encoder':
          result = encryptHex(message);
          break;
        case 'Zero-Width Unicode':
          result = encryptZeroWidth(message, zwCarrier);
          break;
        case 'Steganography (PNG)':
          const blob = await encodeToImage(message, stegoImage || null);
          downloadBlob(blob, 'syphrone-secret.png');
          setOutput('[PNG file downloaded with hidden message]');
          haptic.success();
          setLoading(false);
          return;
        case 'AES-256-GCM':
        default:
          result = await encryptMessage(message, password, { expiresAt });
          break;
      }

      setOutput(result);
      setEncryptTime(Math.round(performance.now() - t0));
      haptic.success();

      // Log to local history (metadata only)
      addHistoryEntry({
        mode: 'encrypt',
        algorithm: algoName,
        inputSize: message.length,
        outputSize: result.length,
        hasPassword: !!password,
        hasExpiry: !!expiresAt,
      });
    } catch (err) {
      setError(err.message || 'Encryption failed');
      haptic.error();
    }
    setLoading(false);
    resetAutoTimer();
  };

  const handleDecrypt = async () => {
    if (!message.trim()) { setError('Please enter an encrypted message to decrypt'); return; }
    setLoading(true); setError(''); setDecryptedMsg(''); setExpiryWarning('');
    try {
      let result = '';
      const trimmed = message.trim();

      if (algorithm === 0) {
        // Auto-detect mode
        if (trimmed.startsWith('v3:') || trimmed.startsWith('v2:')) {
          const res = await decryptMessage(trimmed, password);
          result = res.message;
          if (res.isExpired) setExpiryWarning('⚠️ Warning: This message had a self-destruct timer.');
        } else if (trimmed.startsWith('DNA:')) {
          result = decryptDNA(trimmed);
        } else if (trimmed.startsWith('EMOJI:')) {
          result = decryptEmoji(trimmed);
        } else if (/^[\u200B-\u200D\uFEFF]/.test(trimmed) || /[\u200B-\u200D\uFEFF]/.test(trimmed)) {
          result = decryptZeroWidth(trimmed);
        } else if (/^[.\-/\s]+$/.test(trimmed) && (trimmed.includes('.') || trimmed.includes('-'))) {
          result = decryptMorse(trimmed);
        } else if (/^[01\s]+$/.test(trimmed) && trimmed.replace(/\s/g, '').length % 8 === 0) {
          result = decryptBinary(trimmed);
        } else if (/^[0-9a-fA-F\s]+$/.test(trimmed) && trimmed.length % 2 === 0) {
          result = decryptHex(trimmed);
        } else {
          try {
            result = decryptBase64(trimmed);
          } catch {
            const res = await decryptMessage(trimmed, password);
            result = res.message;
          }
        }
      } else {
        const algoName = ALGO_RAW_NAMES[algorithm - 1];
        switch (algoName) {
          case 'Morse Code':
            result = decryptMorse(trimmed);
            break;
          case 'DNA Code':
            result = decryptDNA(trimmed);
            break;
          case 'Emoji Encryptor':
            result = decryptEmoji(trimmed);
            break;
          case 'Binary Code':
            result = decryptBinary(trimmed);
            break;
          case 'Base64 Encoder':
            result = decryptBase64(trimmed);
            break;
          case 'Hex Encoder':
            result = decryptHex(trimmed);
            break;
          case 'Zero-Width Unicode':
            result = decryptZeroWidth(trimmed);
            break;
          case 'Steganography (PNG)':
            if (!stegoImage) {
              setError('Please select a PNG file to decode the hidden text from.');
              setLoading(false);
              return;
            }
            result = await decodeFromImage(stegoImage);
            break;
          case 'AES-256-GCM':
          default:
            const res = await decryptMessage(trimmed, password);
            result = res.message;
            if (res.isExpired) setExpiryWarning('⚠️ This message has passed its self-destruct expiration time.');
            break;
        }
      }

      setDecryptedMsg(result);
      haptic.success();

      // Log to history
      addHistoryEntry({
        mode: 'decrypt',
        algorithm: algorithm === 0 ? 'Auto-Detect' : ALGO_RAW_NAMES[algorithm - 1],
        inputSize: trimmed.length,
        outputSize: result.length,
        hasPassword: !!password,
      });
    } catch (err) {
      setError(err.message || 'Decryption failed. Check key or ciphertext format.');
      haptic.error();
    }
    setLoading(false);
    resetAutoTimer();
  };

  const handleCopy = async (text) => {
    await copyToClipboard(text);
    setCopied(true);
    haptic.light();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      setMessage(text);
      handleActivity();
      haptic.light();
    }
  };

  const handleClear = () => {
    setMessage('');
    setPassword('');
    setOutput('');
    setDecryptedMsg('');
    setError('');
    haptic.medium();
  };

  const handleDownload = () => {
    if (!output) return;
    downloadText(output, 'syphrone-cipher.txt');
    haptic.light();
  };

  const handleShare = async () => {
    if (!output) return;
    await shareText('Syphrone Ciphertext', output);
  };

  // Drag-and-drop .txt or PNG file
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (file.type === 'image/png') {
      setStegoImage(file);
      setAlgorithm(ALGO_RAW_NAMES.indexOf('Steganography (PNG)'));
      if (mode === 'decrypt') {
        const secret = await decodeFromImage(file);
        setDecryptedMsg(secret);
      }
      haptic.success();
    } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setMessage(text);
      haptic.success();
    }
  };

  const handleTxtFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setMessage(text);
    haptic.success();
  };

  const isEncrypt = mode === 'encrypt';

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">

      {/* ── Hero Section ───────────────────────────────────── */}
      <section aria-label="Syphrone Hero" className="flex items-center justify-between py-6 sm:py-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3 shadow-[0_0_15px_rgba(74,106,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero-Knowledge · 100% In-Browser</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {isEncrypt ? 'Encrypt Your' : 'Decrypt Your'}{' '}
            <span className="text-gradient">Message</span>
          </h1>
          <p className="text-syphrone-muted text-xs sm:text-sm mt-2.5 max-w-md leading-relaxed">
            {isEncrypt
              ? 'Multi-cipher browser platform with military-grade AES-256-GCM, steganography, and zero server storage.'
              : 'Reveal and decipher your secret messages with automatic cipher detection in real time.'}
          </p>
        </div>

        <div className="shrink-0 hidden xs:flex justify-end relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl rounded-full" />
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl glass-card border border-blue-500/40 flex items-center justify-center p-3 shadow-[0_0_35px_rgba(74,106,255,0.3)]"
          >
            <img
              src="/syphrone-logo.png"
              onError={(e) => { e.target.src = 'https://i.ibb.co/fdVXv3ww/syphrone.png'; }}
              alt="Syphrone Logo"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,106,255,0.7)]"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Encrypt / Decrypt Segmented Toggle ─────────────── */}
      <div className="flex bg-syphrone-card/90 rounded-2xl p-1.5 mb-5 border border-syphrone-border shadow-lg">
        <button
          onClick={() => { setMode('encrypt'); setError(''); setOutput(''); setDecryptedMsg(''); haptic.light(); }}
          className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
            isEncrypt
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(74,106,255,0.35)]'
              : 'text-syphrone-muted hover:text-white'
          }`}
        >
          <i className="fa-solid fa-lock text-xs" />
          <span>Encrypt Message</span>
        </button>
        <button
          onClick={() => { setMode('decrypt'); setError(''); setOutput(''); setDecryptedMsg(''); haptic.light(); }}
          className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
            !isEncrypt
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
              : 'text-syphrone-muted hover:text-white'
          }`}
        >
          <i className="fa-solid fa-lock-open text-xs" />
          <span>Decrypt Message</span>
        </button>
      </div>

      {/* ── Main Input Card ───────────────────────────────── */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-syphrone-border/90">

        {/* Message Input Header */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-xs sm:text-sm font-bold flex items-center gap-2 text-white">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <i className="fa-regular fa-file-lines text-xs" />
              </div>
              <span>{isEncrypt ? 'Plaintext Secret Message' : 'Ciphertext to Decrypt'}</span>
            </label>

            <div className="flex items-center gap-2">
              <input type="file" accept=".txt,text/plain" ref={txtUploadRef} onChange={handleTxtFileUpload} className="hidden" />
              <button
                onClick={() => txtUploadRef.current?.click()}
                title="Upload .txt file"
                className="text-[11px] font-medium text-syphrone-muted hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-upload text-[10px]" /> Upload .txt
              </button>
              <button
                onClick={handlePaste}
                title="Paste from clipboard"
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer ml-1"
              >
                <i className="fa-regular fa-clipboard" /> Paste
              </button>
              {message && (
                <button
                  onClick={handleClear}
                  title="Clear text"
                  className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer ml-1"
                >
                  <i className="fa-solid fa-xmark text-[10px]" /> Clear
                </button>
              )}
            </div>
          </div>

          <div
            className={`relative rounded-xl transition-all ${
              dragOver ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); handleActivity(); }}
              className="w-full input-field rounded-xl p-4 min-h-[130px] sm:min-h-[140px] text-xs sm:text-sm font-sans resize-none placeholder:text-syphrone-muted/50 leading-relaxed"
              placeholder={
                isEncrypt
                  ? 'Type or paste your secret message here...\nTip: You can also drag & drop any .txt file directly into this box.'
                  : 'Paste your encrypted ciphertext here (starts with v3:, DNA:, EMOJI:, dots/dashes, or drag & drop)...'
              }
              maxLength={50000}
            />
            <div className="absolute bottom-3 right-4 text-[10px] font-mono px-2 py-0.5 rounded-md bg-syphrone-card/80 text-syphrone-muted/70 border border-syphrone-border">
              {message.length.toLocaleString()} / 50,000 chars
            </div>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div>
          <label className="text-xs sm:text-sm font-bold flex items-center gap-2 text-white mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <i className="fa-solid fa-shield text-xs" />
            </div>
            <span>{isEncrypt ? 'Encryption Algorithm' : 'Decryption Engine'}</span>
          </label>
          <div className="relative">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(Number(e.target.value))}
              className="w-full input-field rounded-xl px-4 py-3.5 text-xs sm:text-sm appearance-none cursor-pointer pr-10 font-medium"
            >
              {isEncrypt
                ? ALGORITHMS.map((algo, i) => <option key={i} value={i}>{algo}</option>)
                : (
                  <>
                    <option value={0}>⚡ Auto-Detect Cipher (Recommended)</option>
                    {ALGORITHMS.map((algo, i) => <option key={i + 1} value={i + 1}>{algo}</option>)}
                  </>
                )
              }
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted pointer-events-none">
              <i className="fa-solid fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        {/* Password / Secret Key (AES-256-GCM) */}
        {(algorithm === 0 || ALGO_RAW_NAMES[isEncrypt ? algorithm : algorithm - 1] === 'AES-256-GCM') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold flex items-center gap-2 text-white">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <i className="fa-solid fa-key text-xs" />
                </div>
                <span>Secret Passphrase / Key (AES-256)</span>
              </label>

              {isEncrypt && (
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-dice" /> Generate 16-Char Key
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); handleActivity(); }}
                placeholder="Enter passphrase (optional for default key)..."
                className="w-full input-field rounded-xl px-4 py-3.5 pr-12 text-xs sm:text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted hover:text-white transition-colors cursor-pointer"
                title={showPwd ? 'Hide passphrase' : 'Show passphrase'}
              >
                <i className={`fa-regular fa-eye${showPwd ? '' : '-slash'} text-sm`} />
              </button>
            </div>

            {isEncrypt && password && (
              <PasswordStrengthMeter password={password} />
            )}
          </div>
        )}

        {/* Steganography carrier options */}
        {isEncrypt && ALGO_RAW_NAMES[algorithm] === 'Steganography (PNG)' && (
          <div className="glass-card rounded-xl p-4 border border-pink-500/30 bg-pink-500/5">
            <p className="text-xs text-pink-300 mb-3 flex items-center gap-2 font-medium">
              <i className="fa-solid fa-image text-sm" /> Carrier PNG Image (Optional):
            </p>
            <input
              type="file"
              accept="image/png"
              ref={fileRef}
              className="hidden"
              onChange={(e) => setStegoImage(e.target.files[0] || null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-xl border border-dashed border-pink-500/40 text-syphrone-text text-xs hover:border-pink-400 hover:bg-pink-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <i className="fa-solid fa-cloud-arrow-up" />
              {stegoImage ? `Selected: ${stegoImage.name}` : 'Select Carrier PNG (Or we generate one for you)'}
            </button>
          </div>
        )}

        {/* Zero-Width carrier text */}
        {isEncrypt && ALGO_RAW_NAMES[algorithm] === 'Zero-Width Unicode' && (
          <div>
            <label className="text-xs font-semibold text-syphrone-muted mb-2 block">
              Optional Carrier Text (Hidden message will be invisibly inserted inside this text):
            </label>
            <input
              value={zwCarrier}
              onChange={(e) => setZwCarrier(e.target.value)}
              placeholder="e.g. 'Good morning! Hope you have a wonderful day ahead.'"
              className="w-full input-field rounded-xl px-4 py-3 text-xs sm:text-sm"
            />
          </div>
        )}

        {/* Self-destruct timer (encrypt AES-256-GCM only) */}
        {isEncrypt && ALGO_RAW_NAMES[algorithm] === 'AES-256-GCM' && (
          <MessageExpiry expiresAt={expiresAt} onChange={setExpiresAt} />
        )}

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-3.5 border border-red-500/40 bg-red-500/10 flex items-start gap-2.5 text-red-300 text-xs sm:text-sm"
          >
            <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5 text-base shrink-0" />
            <p className="leading-snug">{error}</p>
          </motion.div>
        )}

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={isEncrypt ? handleEncrypt : handleDecrypt}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-sm sm:text-base text-white btn-gradient shadow-[0_0_25px_rgba(74,106,255,0.4)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="spinner" />
              <span>{isEncrypt ? 'Encrypting with Web Crypto...' : 'Deciphering in browser...'}</span>
            </>
          ) : (
            <>
              <i className={`fa-solid fa-${isEncrypt ? 'lock' : 'lock-open'} text-sm`} />
              <span>{isEncrypt ? 'Encrypt Message Now' : 'Decrypt Message Now'}</span>
              <i className="fa-solid fa-arrow-right text-xs ml-1" />
            </>
          )}
        </motion.button>
      </div>

      {/* ── Encrypted Output Card ─────────────────────────── */}
      <AnimatePresence>
        {isEncrypt && output && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="mt-6 space-y-4"
          >
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-blue-500/30 shadow-[0_0_25px_rgba(74,106,255,0.15)]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-lock text-blue-400" />
                  <span>Ciphertext Output ({ALGO_RAW_NAMES[algorithm]})</span>
                </label>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fa-solid fa-check text-[9px]" /> Generated In-Browser
                </span>
              </div>

              <textarea
                value={output}
                readOnly
                rows={5}
                className="w-full input-field rounded-xl p-3.5 text-xs font-mono resize-none mb-4 leading-relaxed select-all"
              />

              {/* Action buttons row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    icon: copied ? 'fa-check' : 'fa-copy',
                    label: copied ? 'Copied!' : 'Copy Cipher',
                    action: () => handleCopy(output),
                    color: copied ? 'text-green-400 border-green-500/40 bg-green-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                  },
                  {
                    icon: 'fa-download',
                    label: 'Download File',
                    action: handleDownload,
                    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                  },
                  {
                    icon: 'fa-share-nodes',
                    label: 'Share Cipher',
                    action: handleShare,
                    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
                  },
                  {
                    icon: 'fa-qrcode',
                    label: 'View QR Code',
                    action: () => setShowQR(output),
                    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${btn.color}`}
                  >
                    <i className={`fa-solid ${btn.icon} text-sm`} />
                    <span className="text-xs font-semibold">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <MessageStats originalSize={message.length} encryptedSize={output.length} encryptTime={encryptTime} password={password} />
            <EntropyVisualizer encryptedText={output} />
            <HexInspector encryptedText={output} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Decrypted Output Card ─────────────────────────── */}
      <AnimatePresence>
        {!isEncrypt && decryptedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="mt-6"
          >
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-lock-open text-emerald-400" />
                  <span>Decrypted Plaintext Message</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fa-solid fa-check text-[9px]" /> Verified
                </span>
              </div>

              {expiryWarning && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl mb-3 flex items-center gap-2 font-medium">
                  <i className="fa-solid fa-triangle-exclamation text-amber-400 shrink-0" />
                  <span>{expiryWarning}</span>
                </div>
              )}

              <div className="bg-syphrone-bg/90 border border-syphrone-border rounded-xl p-4 mb-4 text-xs sm:text-sm text-syphrone-text font-sans break-words leading-relaxed select-all">
                {decryptedMsg}
              </div>

              <button
                onClick={() => handleCopy(decryptedMsg)}
                className="w-full py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold text-xs sm:text-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <i className={`fa-solid fa-${copied ? 'check' : 'copy'}`} />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Decrypted Message'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Privacy & Trust Feature Highlights ─────────────── */}
      <section aria-label="Privacy Guarantees" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
        {[
          { icon: 'fa-shield-halved', color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Military Grade', sub: 'AES-256-GCM + PBKDF2' },
          { icon: 'fa-eye-slash', color: 'text-cyan-400', bg: 'bg-cyan-500/10', title: 'Zero Server Logs', sub: '100% in-browser crypto' },
          { icon: 'fa-bolt', color: 'text-amber-400', bg: 'bg-amber-500/10', title: 'Real-Time Speed', sub: 'Native Web Crypto API' },
          { icon: 'fa-lock', color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'No Account Needed', sub: 'Free & open for everyone' },
        ].map((f) => (
          <div
            key={f.title}
            className="glass-card rounded-xl p-3.5 flex flex-col items-center justify-center text-center gap-1.5 border border-syphrone-border"
          >
            <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center ${f.color} text-sm`}>
              <i className={`fa-solid ${f.icon}`} />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold leading-tight">{f.title}</h4>
              <p className="text-syphrone-muted text-[10px] mt-0.5 leading-snug">{f.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Explore Platform Internal Navigation ──────────── */}
      <nav aria-label="Explore Platform" className="mt-8 mb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs text-syphrone-muted uppercase tracking-widest font-bold">Explore Syphrone Platform</p>
          <span className="text-[10px] font-semibold text-blue-400">100% Client-Side</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { href: '/blog',      icon: 'fa-newspaper',         label: 'Security Blog',      desc: '20+ guides & crypto articles', color: 'text-blue-400',   bg: 'bg-blue-500/10' },
            { href: '/faq',       icon: 'fa-circle-question',   label: 'FAQ & Help',         desc: 'Questions & security answers', color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
            { href: '/about',     icon: 'fa-circle-info',       label: 'About Platform',     desc: 'Web Crypto API architecture', color: 'text-emerald-400',bg: 'bg-emerald-500/10' },
            { href: '/developer', icon: 'fa-user-astronaut',    label: 'Developer Profile',  desc: 'Armaan Sunasara · Techyboy',   color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { href: '/vault',     icon: 'fa-vault',             label: 'Secure Vault',       desc: 'Encrypted local note storage', color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { href: '/privacy',   icon: 'fa-shield-halved',     label: 'Privacy Policy',     desc: 'Zero-log guarantees & pledge', color: 'text-green-400',  bg: 'bg-green-500/10' },
            { href: '/history',   icon: 'fa-clock-rotate-left', label: 'Cipher History',     desc: 'Review past local ciphers',    color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { href: '/settings',  icon: 'fa-sliders',           label: 'App Settings',       desc: 'Audio, haptics & themes',      color: 'text-slate-400',  bg: 'bg-slate-500/10' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              title={link.label}
              className="glass-card rounded-xl p-3.5 flex flex-col justify-between border border-syphrone-border hover:border-blue-500/40 hover:bg-white/5 transition-all group no-underline"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`w-7 h-7 rounded-lg ${link.bg} flex items-center justify-center shrink-0`}>
                  <i className={`fa-solid ${link.icon} ${link.color} text-xs`} />
                </div>
                <p className="text-white text-xs font-bold group-hover:text-blue-400 transition-colors truncate">{link.label}</p>
              </div>
              <p className="text-syphrone-muted text-[10px] leading-snug">{link.desc}</p>
            </a>
          ))}
        </div>
      </nav>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && <QRCodeModal text={showQR} onClose={() => setShowQR(false)} />}
      </AnimatePresence>
    </div>
  );
}
