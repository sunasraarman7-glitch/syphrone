import CryptoJS from 'crypto-js';

const LEGACY_KEY = 'CipherVault-Default-Key-2024';
const DEFAULT_KEY = 'syphrone-default-v1-key';
const PBKDF2_ITERATIONS = 310000;
const SALT_SIZE = 16;
const IV_SIZE = 12;
const MAX_MESSAGE = 50000;
const MAX_PASSWORD = 1000;

// ─── Safe Base64 & Binary Helpers (Prevents Call Stack & Encoding Errors) ───
export function bytesToBase64(bytes) {
  let bin = '';
  const len = bytes.byteLength || bytes.length;
  for (let i = 0; i < len; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}

export function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// ─── AES-256-GCM Encrypt ──────────────────────────────────────────────────
export async function encryptMessage(message, password = '', options = {}) {
  if (message.length > MAX_MESSAGE) throw new Error('Message too long (max 50,000 chars)');
  const pwd = (password || DEFAULT_KEY).slice(0, MAX_PASSWORD);

  const payload = JSON.stringify({ m: message, ...(options.expiresAt ? { exp: options.expiresAt } : {}) });
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv   = crypto.getRandomValues(new Uint8Array(IV_SIZE));

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(pwd), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, SALT_SIZE);
  combined.set(new Uint8Array(ciphertext), SALT_SIZE + IV_SIZE);

  return 'v3:' + bytesToBase64(combined);
}

// ─── AES-256-GCM Decrypt ──────────────────────────────────────────────────
export async function decryptMessage(encrypted, password = '') {
  if (!encrypted) throw new Error('No message provided');
  const pwd = password || DEFAULT_KEY;

  // Legacy CryptoJS support
  if (!encrypted.startsWith('v3:')) {
    try {
      const legacyKey = password || LEGACY_KEY;
      const bytes = CryptoJS.AES.decrypt(encrypted, legacyKey);
      const plain = bytes.toString(CryptoJS.enc.Utf8);
      if (!plain) throw new Error('Wrong password');
      return { message: plain, expired: false, expiresAt: null };
    } catch {
      throw new Error('Invalid message or wrong password');
    }
  }

  let bytes;
  try {
    const base64 = encrypted.slice(3).trim();
    bytes = base64ToBytes(base64);
  } catch {
    throw new Error('Invalid encrypted payload formatting');
  }

  if (bytes.length < SALT_SIZE + IV_SIZE) {
    throw new Error('Corrupted or truncated message payload');
  }

  const salt = bytes.slice(0, SALT_SIZE);
  const iv   = bytes.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
  const ciphertext = bytes.slice(SALT_SIZE + IV_SIZE);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(pwd), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  let plainData;
  try {
    plainData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  } catch {
    throw new Error('Decryption failed — wrong password or corrupted message');
  }

  let decoded;
  try {
    decoded = new TextDecoder().decode(plainData);
    const payload = JSON.parse(decoded);
    const now = Date.now();
    const expired = payload.exp ? now > payload.exp : false;
    return { message: payload.m, expired, expiresAt: payload.exp || null };
  } catch {
    throw new Error('Malformed decrypted payload');
  }
}

// ─── Password Strength ─────────────────────────────────────────────────────
export function measurePasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', color: '#1e243b', percent: 0, entropyBits: 0 };

  let score = 0;
  const checks = {
    length8:     password.length >= 8,
    length12:    password.length >= 12,
    length16:    password.length >= 16,
    length20:    password.length >= 20,
    uppercase:   /[A-Z]/.test(password),
    lowercase:   /[a-z]/.test(password),
    numbers:     /[0-9]/.test(password),
    symbols:     /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length8)   score += 1;
  if (checks.length12)  score += 1;
  if (checks.length16)  score += 1;
  if (checks.length20)  score += 1;
  if (checks.uppercase) score += 1;
  if (checks.lowercase) score += 1;
  if (checks.numbers)   score += 1;
  if (checks.symbols)   score += 2;

  const maxScore = 10;
  const percent = Math.min(100, Math.round((score / maxScore) * 100));

  let label = 'Weak';
  let color = '#ff3333';
  if (percent >= 80) { label = 'Very Strong'; color = '#00ff88'; }
  else if (percent >= 55) { label = 'Strong'; color = '#00cc44'; }
  else if (percent >= 30) { label = 'Fair'; color = '#ff9900'; }

  let charsetSize = 0;
  if (checks.lowercase) charsetSize += 26;
  if (checks.uppercase) charsetSize += 26;
  if (checks.numbers)   charsetSize += 10;
  if (checks.symbols)   charsetSize += 32;
  const entropyBits = charsetSize > 0 ? Math.round(password.length * Math.log2(charsetSize)) : 0;

  return { score, label, color, percent, entropyBits, checks };
}

// ─── RSA-2048 Key Pair Generation ─────────────────────────────────────────
export async function generateRSAKeyPair(modulusLength = 2048) {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt']
  );

  const [pubRaw, privRaw] = await Promise.all([
    crypto.subtle.exportKey('spki', keyPair.publicKey),
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
  ]);

  const toPEM = (buf, type) => {
    const b64 = bytesToBase64(new Uint8Array(buf));
    const lines = b64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
  };

  return {
    publicKey: toPEM(pubRaw, 'PUBLIC KEY'),
    privateKey: toPEM(privRaw, 'PRIVATE KEY'),
  };
}

// ─── RSA Encrypt / Decrypt ────────────────────────────────────────────────
function pemToBuf(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const bytes = base64ToBytes(b64);
  return bytes.buffer;
}

export async function rsaEncrypt(message, publicKeyPEM) {
  const keyBuf = pemToBuf(publicKeyPEM);
  const key = await crypto.subtle.importKey('spki', keyBuf, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const enc = new TextEncoder().encode(message);
  const cipherBuf = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, enc);
  return 'rsa:' + bytesToBase64(new Uint8Array(cipherBuf));
}

export async function rsaDecrypt(encrypted, privateKeyPEM) {
  if (!encrypted.startsWith('rsa:')) throw new Error('Invalid RSA message prefix');
  const b64 = encrypted.slice(4).trim();
  const bytes = base64ToBytes(b64);

  const keyBuf = pemToBuf(privateKeyPEM);
  const key = await crypto.subtle.importKey('pkcs8', keyBuf, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, bytes.buffer);
  return new TextDecoder().decode(plain);
}

// ─── Zero-Width Encoding ──────────────────────────────────────────────────
const ZW_0 = '\u200B'; // ZWSP
const ZW_1 = '\u200C'; // ZWNJ
const ZW_S = '\u200D'; // separator (ZWJ)
const ZW_E = '\uFEFF'; // end marker (BOM)

export function encryptZeroWidth(text, carrier = '') {
  const bits = Array.from(new TextEncoder().encode(text))
    .map(b => b.toString(2).padStart(8, '0'))
    .join('');
  const zw = bits.split('').map(b => b === '0' ? ZW_0 : ZW_1).join(ZW_S) + ZW_E;
  return carrier ? carrier + zw : zw;
}

export function decryptZeroWidth(text) {
  const zwChars = new Set([ZW_0, ZW_1, ZW_S, ZW_E]);
  const extracted = text.split('').filter(c => zwChars.has(c)).join('');
  if (!extracted) throw new Error('No zero-width hidden characters found');
  const endIdx = extracted.indexOf(ZW_E);
  const payload = endIdx >= 0 ? extracted.slice(0, endIdx) : extracted;
  const bits = payload.split(ZW_S).map(c => c === ZW_0 ? '0' : '1').join('');
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ─── Morse Code Cipher ────────────────────────────────────────────────────
const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
  ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
  '@': '.--.-.'
};

const REVERSE_MORSE_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export function encryptMorse(text) {
  return text.toUpperCase().split('').map(char => MORSE_MAP[char] || char).join(' ');
}

export function decryptMorse(morse) {
  return morse.trim().split(/\s+/).map(code => REVERSE_MORSE_MAP[code] || (code === '/' ? ' ' : code)).join('');
}

// ─── DNA Code Cipher ──────────────────────────────────────────────────────
const DNA_MAP = { '00': 'A', '01': 'T', '10': 'C', '11': 'G' };
const REVERSE_DNA_MAP = { 'A': '00', 'T': '01', 'C': '10', 'G': '11' };

export function encryptDNA(text) {
  const bytes = new TextEncoder().encode(text);
  let dna = 'DNA:';
  for (const b of bytes) {
    const bits = b.toString(2).padStart(8, '0');
    for (let i = 0; i < 8; i += 2) {
      dna += DNA_MAP[bits.slice(i, i + 2)];
    }
  }
  return dna;
}

export function decryptDNA(dnaText) {
  const clean = dnaText.replace(/^DNA:\s*/i, '').replace(/[^ATCG]/gi, '').toUpperCase();
  if (clean.length % 4 !== 0 || clean.length === 0) {
    throw new Error('Invalid DNA sequence length or format');
  }
  const bytes = [];
  for (let i = 0; i < clean.length; i += 4) {
    let bits = '';
    for (let j = 0; j < 4; j++) {
      const char = clean[i + j];
      if (!REVERSE_DNA_MAP[char]) throw new Error(`Invalid DNA character: ${char}`);
      bits += REVERSE_DNA_MAP[char];
    }
    bytes.push(parseInt(bits, 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ─── Emoji Encryptor ─────────────────────────────────────────────────────
const EMOJI_PALETTE = ['🔒', '🔑', '🛡️', '⚡', '🌟', '🚀', '💎', '🔮', '🧬', '🌀', '🎯', '👾', '🌌', '🛰️', '⚓', '⚔️'];
const REVERSE_EMOJI_MAP = Object.fromEntries(EMOJI_PALETTE.map((emoji, idx) => [emoji, idx.toString(16)]));

export function encryptEmoji(text) {
  const bytes = new TextEncoder().encode(text);
  let result = 'EMOJI: ';
  for (const b of bytes) {
    const hex = b.toString(16).padStart(2, '0');
    const n1 = parseInt(hex[0], 16);
    const n2 = parseInt(hex[1], 16);
    result += EMOJI_PALETTE[n1] + EMOJI_PALETTE[n2];
  }
  return result;
}

export function decryptEmoji(emojiText) {
  const clean = emojiText.replace(/^EMOJI:\s*/i, '').trim();
  const emojis = Array.from(clean);
  if (emojis.length === 0 || emojis.length % 2 !== 0) {
    throw new Error('Invalid Emoji encrypted sequence');
  }
  const bytes = [];
  for (let i = 0; i < emojis.length; i += 2) {
    const h1 = REVERSE_EMOJI_MAP[emojis[i]];
    const h2 = REVERSE_EMOJI_MAP[emojis[i + 1]];
    if (h1 === undefined || h2 === undefined) {
      throw new Error('Unrecognized Emoji in message');
    }
    bytes.push(parseInt(h1 + h2, 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ─── Binary Code ──────────────────────────────────────────────────────────
export function encryptBinary(text) {
  return Array.from(new TextEncoder().encode(text))
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

export function decryptBinary(binaryText) {
  const clean = binaryText.trim().split(/\s+/);
  const bytes = [];
  for (const b of clean) {
    if (!/^[01]{8}$/.test(b)) throw new Error('Invalid 8-bit binary sequence');
    bytes.push(parseInt(b, 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ─── Base64 & Hex Encoders ────────────────────────────────────────────────
export function encryptBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

export function decryptBase64(b64) {
  try {
    const bytes = base64ToBytes(b64.trim());
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error('Invalid Base64 string');
  }
}

export function encryptHex(text) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

export function decryptHex(hex) {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(clean)) {
    throw new Error('Invalid Hex string');
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

// ─── Shannon Entropy ──────────────────────────────────────────────────────
export function generateEntropy(base64Text) {
  let bytes;
  try {
    const bin = atob(base64Text.replace(/^v3:/, '').replace(/\s/g, '').slice(0, 2000));
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } catch {
    bytes = new TextEncoder().encode(base64Text);
  }

  const freq = new Array(256).fill(0);
  for (const b of bytes) freq[b]++;
  const total = bytes.length || 1;

  let entropy = 0;
  for (const f of freq) {
    if (f > 0) {
      const p = f / total;
      entropy -= p * Math.log2(p);
    }
  }

  const buckets = new Array(64).fill(0);
  for (let i = 0; i < 256; i++) {
    buckets[Math.floor(i / 4)] += freq[i];
  }
  const maxBucket = Math.max(...buckets, 1);
  const normalizedBuckets = buckets.map(v => v / maxBucket);

  let label = 'Low';
  if (entropy >= 7.9) label = 'Excellent';
  else if (entropy >= 7.0) label = 'Very Good';
  else if (entropy >= 5.0) label = 'Good';
  else if (entropy >= 3.0) label = 'Fair';

  return { entropy: entropy.toFixed(2), label, buckets: normalizedBuckets, totalBytes: total };
}

// ─── SHA-256 Fingerprint ──────────────────────────────────────────────────
export async function sha256Fingerprint(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  const hex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  const shortHash = hex.slice(0, 8).toUpperCase();
  return { hex, shortHash };
}
