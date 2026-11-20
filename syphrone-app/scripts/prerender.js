import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// Read dist/index.html
const templatePath = path.join(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}
const template = fs.readFileSync(templatePath, 'utf8');

// Blog posts metadata (from BlogPage.jsx)
const BLOG_POSTS = [
  {
    id: 'free-online-encryption-tool-2026',
    title: 'Best Free Online Encryption Tool in 2026 — No Sign-Up Required',
    category: 'Guides',
    date: 'August 20, 2026',
    readTime: '5 min read',
    summary: 'Looking for a free online encryption tool with no sign-up? Syphrone offers AES-256-GCM, steganography, RSA key generation and 8+ ciphers — 100% in-browser, zero server storage.',
    keywords: ['free online encryption tool', 'encrypt text online free', 'encrypt message without account', 'best encryption tool 2026', 'no sign up encryption'],
    content: `
      <h2>Why Most Encryption Tools Require an Account (And Why Syphrone Doesn't)</h2>
      <p>The majority of online encryption services require you to create an account, accept cookies, and hand over your email address before you can encrypt a single character. This defeats the purpose of privacy.</p>
      <p><strong>Syphrone</strong> is a completely free online encryption tool that requires zero sign-up. Open the page, type your message, choose your cipher, and you're done. No email. No cookies. No server.</p>
      <h2>What You Get — Completely Free</h2>
      <ul>
        <li>AES-256-GCM symmetric encryption with PBKDF2 key derivation</li>
        <li>RSA-2048 asymmetric key pair generation</li>
        <li>PNG Steganography — hide text inside images</li>
        <li>Zero-Width Unicode invisible text encoder</li>
        <li>Morse, DNA, Emoji, Binary, Hex, Base64 encoding tools</li>
        <li>Secure Vault — local encrypted note storage</li>
        <li>Cipher History — review past operations locally</li>
      </ul>
      <h2>Why Browser-Based Encryption Is Safer</h2>
      <p>When encryption runs entirely in your browser using the Web Crypto API, the server never receives your plaintext. Compare that to server-side tools where your data travels the network unprotected before being encrypted — a major risk window.</p>
      <p>With Syphrone, cryptographic operations are isolated inside your browser's JavaScript sandbox. Your keys, plaintext, and ciphertext never touch the internet.</p>
    `
  },
  {
    id: 'how-to-send-private-messages-online',
    title: 'How to Send Private Messages Online Without Being Tracked in 2026',
    category: 'Privacy',
    date: 'August 19, 2026',
    readTime: '6 min read',
    summary: 'Learn how to send private messages online without being tracked. Use client-side AES-256 encryption to protect messages on Gmail, WhatsApp Web, Telegram and any platform.',
    keywords: ['how to send private messages online', 'send encrypted message', 'private messaging without tracking', 'secure message sender'],
    content: `
      <h2>The Problem with "Private" Messaging Apps</h2>
      <p>Apps that claim to offer private messaging often still collect metadata — who you messaged, when, how often, from which device, and your IP address. True private messaging requires client-side encryption before message transmission.</p>
      <h2>The Platform-Agnostic Encryption Method</h2>
      <p>Encrypt your message using client-side AES-256-GCM in Syphrone, set a shared password, and paste the ciphertext into WhatsApp, Gmail, Telegram, or Discord. The platform sees only meaningless ciphertext.</p>
    `
  },
  {
    id: 'encrypt-whatsapp-messages-extra-layer',
    title: 'How to Add an Extra Encryption Layer to WhatsApp, Telegram & Gmail',
    category: 'Privacy',
    date: 'August 18, 2026',
    readTime: '5 min read',
    summary: 'Even end-to-end encrypted apps can be compromised at the endpoint. Learn how to add AES-256 encryption on top of WhatsApp, Telegram, and Gmail using Syphrone for zero-knowledge messaging.',
    keywords: ['encrypt WhatsApp messages', 'extra encryption layer telegram', 'secure gmail messages', 'double encrypt messages'],
    content: `
      <h2>Why WhatsApp's Encryption Isn't Always Enough</h2>
      <p>WhatsApp uses the Signal Protocol in transit, but decrypted messages sit in plaintext on your phone. If your device is unlocked, seized, or backed up to unencrypted cloud storage, your messages are exposed.</p>
      <h2>The Double-Encryption Workflow</h2>
      <p>Encrypt with Syphrone first. Send the encrypted ciphertext via WhatsApp. Your recipient decrypts it with your shared passphrase. Even if someone reads the chat, they see only AES-256 ciphertext.</p>
    `
  },
  {
    id: 'end-to-end-encryption-explained-beginners',
    title: "End-to-End Encryption Explained: A Beginner's Complete Guide (2026)",
    category: 'Education',
    date: 'August 17, 2026',
    readTime: '7 min read',
    summary: 'What is end-to-end encryption? How does AES-256, RSA, and public key cryptography work? This beginner-friendly guide explains E2EE with real examples you can test yourself.',
    keywords: ['end to end encryption explained', 'what is E2EE', 'how does encryption work', 'encryption for beginners', 'symmetric asymmetric encryption'],
    content: `
      <h2>What Is End-to-End Encryption?</h2>
      <p>End-to-end encryption (E2EE) guarantees that only the communicating users can read messages. No eavesdropper, internet service provider, or hosting server can decipher the encrypted data payload.</p>
      <h2>Symmetric (AES) vs Asymmetric (RSA) Cryptography</h2>
      <p>Symmetric encryption uses one shared key for encryption and decryption. Asymmetric encryption uses a public key to encrypt and a private key to decrypt.</p>
    `
  },
  {
    id: 'online-privacy-tools-2026',
    title: 'Top 10 Online Privacy Tools You Need in 2026 (Free & Open Source)',
    category: 'Privacy',
    date: 'August 16, 2026',
    readTime: '8 min read',
    summary: 'Protect your digital life with these 10 free privacy tools in 2026: browser-based encryption, VPNs, private search engines, secure messaging, and more — including Syphrone for message encryption.',
    keywords: ['online privacy tools 2026', 'free privacy tools', 'best privacy software', 'digital privacy tools list'],
    content: `
      <h2>Top 10 Privacy Tools in 2026</h2>
      <p>Syphrone for browser-based encryption, Signal for mobile messaging, ProtonMail for private emails, Mullvad for VPN connectivity, Bitwarden for open-source password management, and Tor Browser for anonymity.</p>
    `
  },
  {
    id: 'secure-encrypted-notes-online',
    title: "How to Keep Secure Encrypted Notes Online Without Any Cloud Service",
    category: 'Security',
    date: 'August 15, 2026',
    readTime: '5 min read',
    summary: "Stop trusting cloud services with your private notes. Learn how to use Syphrone's Secure Vault for AES-256 encrypted local note storage — no cloud, no account, no risk.",
    keywords: ['secure encrypted notes online', 'encrypted note taking app', 'private notes no cloud', 'local encrypted notes'],
    content: `
      <h2>The Problem with Cloud Notes</h2>
      <p>Cloud note providers store master keys on their servers. Syphrone Secure Vault keeps your notes in local browser memory, encrypted with AES-256-GCM and protected by an automatic 5-minute inactivity lock.</p>
    `
  },
  {
    id: 'cipher-text-generator-online',
    title: 'Cipher Text Generator Online: 9 Encryption Methods in One Tool',
    category: 'Cryptography',
    date: 'August 14, 2026',
    readTime: '5 min read',
    summary: 'Use Syphrone as your all-in-one cipher text generator online. AES-256-GCM, Morse code, DNA cipher, Emoji encryptor, binary, Base64, Hex, Zero-Width Unicode, and PNG steganography — all free.',
    keywords: ['cipher text generator online', 'online cipher tool', 'text cipher generator', 'multiple cipher tool'],
    content: `
      <h2>9 Cipher Methods in One Platform</h2>
      <p>From military-grade AES-256-GCM to image steganography, invisible zero-width Unicode, Morse code, DNA nucleotide mapping, and emoji obfuscation.</p>
    `
  },
  {
    id: 'cryptography-for-students-beginners',
    title: 'Cryptography for Students: Learn AES, RSA & Hashing with Live Examples',
    category: 'Education',
    date: 'August 13, 2026',
    readTime: '8 min read',
    summary: 'A student-friendly guide to modern cryptography. Learn AES symmetric encryption, RSA asymmetric keys, SHA hashing, PBKDF2 key derivation, and digital signatures — with live browser demos.',
    keywords: ['cryptography for beginners', 'learn encryption online', 'AES RSA explained for students'],
    content: `
      <h2>Interactive Cryptography Education</h2>
      <p>Learn how cryptographic algorithms work step-by-step using modern Web Crypto API primitives and interactive examples.</p>
    `
  },
  {
    id: 'secret-message-encryptor-guide',
    title: 'Secret Message Encryptor: How to Password-Protect Any Text Online',
    category: 'Guides',
    date: 'August 10, 2026',
    readTime: '4 min read',
    summary: 'Encrypt text messages with a custom password using client-side AES-256-GCM encryption. Share cipher text securely across any chat or email app.',
    keywords: ['secret message encryptor', 'password protect text', 'encrypt text with password online'],
    content: `
      <h2>Password-Protect Any Text</h2>
      <p>Type your message, set your custom secret key, and generate an authenticated AES-256 ciphertext that only your recipient can unlock.</p>
    `
  },
  {
    id: 'aes-256-gcm-guide',
    title: 'AES-256-GCM Encryption Explained: Why It Is the Gold Standard',
    category: 'Cryptography',
    date: 'August 8, 2026',
    readTime: '6 min read',
    summary: 'Deep dive into Galois/Counter Mode (GCM) and AES-256 symmetric encryption. Learn why banks, governments, and military organizations trust AES-GCM.',
    keywords: ['AES-256-GCM explained', 'galois counter mode', 'symmetric authenticated encryption', 'AES vs CBC'],
    content: `
      <h2>Why AES-256-GCM Is the Gold Standard</h2>
      <p>GCM provides authenticated encryption with associated data (AEAD), ensuring confidentiality and tamper resistance simultaneously.</p>
    `
  },
  {
    id: 'steganography-explained',
    title: 'PNG Image Steganography: How to Hide Secret Text Inside Photos',
    category: 'Steganography',
    date: 'August 6, 2026',
    readTime: '5 min read',
    summary: 'Understand Least Significant Bit (LSB) steganography and how Syphrone embeds confidential text into image pixels without perceptible visual changes.',
    keywords: ['image steganography online', 'hide text in image', 'LSB steganography tool', 'secret photo message'],
    content: `
      <h2>How Steganography Works</h2>
      <p>By altering only the least significant bits of pixel color channels in a PNG image, messages are concealed with zero perceptible distortion.</p>
    `
  },
  {
    id: 'zero-width-unicode-steganography',
    title: 'Zero-Width Unicode Steganography: The Art of Invisible Messages',
    category: 'Steganography',
    date: 'August 5, 2026',
    readTime: '5 min read',
    summary: 'Learn how zero-width non-joiners, spaces, and joiners allow hiding complete encrypted payloads inside normal visible carrier paragraphs.',
    keywords: ['zero width steganography', 'invisible text generator', 'hidden unicode cipher', 'secret text in plain sight'],
    content: `
      <h2>Invisible Text Steganography</h2>
      <p>Zero-width characters (\u200B, \u200C, \u200D) have no visual width, allowing confidential binary payloads to hide inside plain sentences.</p>
    `
  },
  {
    id: 'rsa-2048-key-pairs-guide',
    title: 'RSA-2048 Key Pairs: Asymmetric Cryptography and Public Key Security',
    category: 'Asymmetric Keys',
    date: 'August 3, 2026',
    readTime: '6 min read',
    summary: 'Master asymmetric cryptography with RSA-2048. Learn how to generate public/private key pairs and encrypt data for specific recipients.',
    keywords: ['rsa 2048 key generator', 'asymmetric encryption online', 'public private key generator', 'generate pem keys online'],
    content: `
      <h2>Understanding RSA Key Pairs</h2>
      <p>Public keys encrypt messages that only the private key can decrypt. Syphrone generates 2048-bit RSA-OAEP keys in standard PEM format.</p>
    `
  },
  {
    id: 'morse-code-audio-cipher',
    aliases: ['morse-code-translator-guide'],
    title: 'Online Morse Code Translator & Audio Cipher Tool',
    category: 'Ciphers',
    date: 'August 2, 2026',
    readTime: '4 min read',
    summary: 'Convert text to dots and dashes with an online Morse code translator and decrypter for classic military communication.',
    keywords: ['morse code translator', 'morse code encoder online', 'dot dash cipher', 'morse code decrypter'],
    content: `
      <h2>Classic Morse Code Translation</h2>
      <p>Encode any text message into dots and dashes or auto-detect and decode incoming Morse code streams instantly.</p>
    `
  },
  {
    id: 'dna-emoji-cipher-guide',
    title: 'DNA Sequence Cipher & Emoji Text Encryptor',
    category: 'Ciphers',
    date: 'August 1, 2026',
    readTime: '4 min read',
    summary: 'Discover how 2-bit DNA nucleotide sequences (A, T, C, G) and cyber emoji character mappings turn text into creative obfuscated messages.',
    keywords: ['dna cipher online', 'dna sequence encoder', 'emoji encryptor', 'emoji text cipher', 'fun text obfuscator'],
    content: `
      <h2>DNA & Emoji Ciphers</h2>
      <p>Map text bytes to genetic nucleotide sequences (Adenine, Thymine, Cytosine, Guanine) or playful cyber emoji pairs.</p>
    `
  },
  {
    id: 'self-destructing-notes-vault-security',
    aliases: ['self-destructing-notes-guide'],
    title: 'Self-Destructing Notes & Encrypted Vault Security Best Practices',
    category: 'Security',
    date: 'July 31, 2026',
    readTime: '5 min read',
    summary: 'Set self-destruct timers on secret messages and store sensitive recovery phrases in a local browser password vault with auto-lock protection.',
    keywords: ['self destructing note', 'auto expire message', 'encrypted vault online', 'browser password vault'],
    content: `
      <h2>Self-Destruct Timers & Vault Security</h2>
      <p>Attach expiry timestamps from 1 hour to 30 days. When the timer elapses, the decryption engine permanently destroys the payload.</p>
    `
  },
  {
    id: 'base64-hex-binary-encoder',
    aliases: ['base64-hex-converter-guide'],
    title: 'Base64 & Hexadecimal Encoder Decoder: Online Byte Conversion Tool',
    category: 'Tools',
    date: 'July 30, 2026',
    readTime: '4 min read',
    summary: 'Convert raw text bytes to Base64 strings and hexadecimal byte arrays with an online byte conversion tool for software developers.',
    keywords: ['base64 encoder online', 'hex decoder tool', 'byte converter', 'binary to hex converter'],
    content: `
      <h2>Base64, Hex & Binary Byte Encodings</h2>
      <p>Convert data between ASCII text, Base64 strings, hexadecimal byte representations, and raw 8-bit binary streams.</p>
    `
  },
  {
    id: 'zero-log-browser-cryptography',
    aliases: ['browser-privacy-zero-log-guide'],
    title: 'Browser Privacy & Zero-Log Architecture: Why Local Cryptography Wins',
    category: 'Security',
    date: 'July 29, 2026',
    readTime: '5 min read',
    summary: 'Discover why zero-log client-side browser encryption is superior to cloud-based security models where servers hold master keys.',
    keywords: ['zero log privacy app', 'client side cryptography', 'browser crypto vs cloud', 'private notes app'],
    content: `
      <h2>Why Local Cryptography Wins</h2>
      <p>Zero-knowledge browser cryptography isolates all calculations inside the local device. No third-party server ever touches the plaintext.</p>
    `
  },
  {
    id: 'entropy-analyzer-password-strength',
    aliases: ['entropy-calculator-guide'],
    title: 'Entropy Analyzer & Password Strength Calculator Online',
    category: 'Tools',
    date: 'July 28, 2026',
    readTime: '4 min read',
    summary: 'Calculate Shannon entropy bits and crack-time estimates for your encryption passwords with an online password strength meter.',
    keywords: ['shannon entropy calculator', 'password strength meter', 'key entropy analyzer', 'password security checker'],
    content: `
      <h2>Measuring Password Entropy</h2>
      <p>Shannon entropy calculates the mathematical randomness of your passphrases, indicating resistance against offline dictionary and brute-force attacks.</p>
    `
  },
  {
    id: 'decoy-mode-screen-shield-guide',
    title: 'Decoy Mode & Screen Shield: Protecting Against Visual Shoulder Surfing',
    category: 'Guides',
    date: 'July 27, 2026',
    readTime: '3 min read',
    summary: 'Learn how Decoy Mode and Screen Shield blur protect your screen from onlookers and visual shoulder surfing in public environments.',
    keywords: ['decoy mode privacy', 'screen shield blur', 'shoulder surfing protection', 'stealth privacy app'],
    content: `
      <h2>Protecting Against Shoulder Surfing</h2>
      <p>Decoy Mode transforms Syphrone into an authentic to-do list camouflage. Screen Shield blurs active ciphers immediately whenever focus is lost.</p>
    `
  }
];

// Core pages metadata
const CORE_PAGES = [
  {
    route: '/privacy',
    aliases: ['/privacy-policy'],
    title: 'Privacy Policy & Zero-Log Guarantee — Syphrone',
    description: 'Syphrone zero-knowledge privacy policy. No cleartext storage, no cookies, no user tracking, 100% client-side cryptographic guarantees.',
    heading: 'Privacy Policy & Zero-Knowledge Guarantee',
    content: `
      <p>Syphrone is architected from the ground up as a 100% client-side application. We do not store, intercept, analyze, harvest, or transmit any cleartext messages, ciphertexts, passwords, encryption keys, or biometric telemetry.</p>
      <h2>Zero-Knowledge Guarantees</h2>
      <ul>
        <li>No Plaintext Content: Messages are encrypted in browser memory via Web Crypto API.</li>
        <li>No Passwords or Keys: Derived keys are discarded immediately.</li>
        <li>No Tracking Cookies: Zero advertising or profiling cookies.</li>
        <li>No Central Database: Zero remote databases holding your cipher operations.</li>
      </ul>
    `
  },
  {
    route: '/about',
    aliases: ['/about-syphrone'],
    title: 'About Syphrone — Zero-Knowledge Client-Side Cryptography Platform',
    description: 'Learn about Syphrone architecture: AES-256-GCM, PBKDF2 310,000 iterations, Web Crypto API, and zero-knowledge privacy guarantees.',
    heading: 'Next-Generation Cryptographic Security',
    content: `
      <p>Syphrone is a high-performance, client-side encryption platform built with military-grade standards. We believe privacy is an absolute human right.</p>
      <h2>Cryptographic Architecture</h2>
      <p>Built with AES-256-GCM authenticated encryption, PBKDF2 key stretching (310,000 SHA-256 iterations), RSA-2048 key pairs, and PNG steganography.</p>
    `
  },
  {
    route: '/developer',
    aliases: ['/about-developer'],
    title: 'Armaan Sunasara — Lead Developer & Co-Founder of Techyboy',
    description: 'Developer profile of Armaan Sunasara, Co-Founder of Techyboy and creator of Syphrone encryption platform. Full Stack Engineer and security enthusiast.',
    heading: 'About Armaan Sunasara',
    content: `
      <p>Armaan Sunasara is a Full Stack Developer, Cybersecurity Enthusiast, and Co-Founder of TechyBoy. Creator of Syphrone, Rahi Tag, and modern digital utilities.</p>
      <p>Specialized in client-side cryptography, Web Crypto API, React, Vite, and high-performance privacy architectures.</p>
    `
  },
  {
    route: '/faq',
    aliases: ['/faqs'],
    title: 'Frequently Asked Questions (FAQ) — Syphrone Security & Encryption',
    description: 'Find answers to common questions about Syphrone AES-256-GCM encryption, PNG steganography, zero-log policies, and Web Crypto API security.',
    heading: 'Frequently Asked Questions & Security Answers',
    content: `
      <h2>Frequently Asked Questions</h2>
      <p>Everything you need to know about Syphrone AES-256-GCM encryption, zero-log policies, Web Crypto architecture, and steganography.</p>
    `
  },
  {
    route: '/vault',
    aliases: ['/saved'],
    title: 'Secure Vault — Syphrone',
    description: 'Store encrypted notes and messages in your AES-GCM local secure vault. No server. No cloud.',
    heading: 'Secure Encrypted Local Vault',
    content: `
      <p>The Syphrone Secure Vault allows storing encrypted notes and recovery phrases locally in your browser sandbox with master passphrase encryption and auto-lock protection.</p>
    `
  },
  {
    route: '/history',
    title: 'Cipher History — Syphrone',
    description: 'Review your recent encryption and decryption operations stored locally in your browser.',
    heading: 'Local Cipher History',
    content: `
      <p>Review past cryptographic operations stored locally in your browser sandbox. Message content is never logged.</p>
    `
  },
  {
    route: '/settings',
    title: 'Settings — Syphrone',
    description: 'Customise Syphrone: haptics, screen shield, auto-clear, themes and more.',
    heading: 'Application Settings & Preferences',
    content: `
      <p>Customize audio effects, haptic feedback on mobile, screen shield blur, and memory auto-clear timers.</p>
    `
  },
  {
    route: '/blog',
    aliases: ['/blogs'],
    title: 'Syphrone Blog — Encryption, Privacy & Security Guides',
    description: 'Learn about AES-GCM encryption, steganography, client-side cryptography, and web security with articles from the Syphrone team.',
    heading: 'Security Blog & Cryptographic Guides',
    content: `
      <p>20+ in-depth articles and tutorials on secret message encryption, steganography, RSA keys, and browser privacy.</p>
    `
  }
];

function generateHTML({ route, title, description, keywords, heading, date, category, content, schemaJson }) {
  const canonicalUrl = `https://syphrone.netlify.app${route}`;

  let html = template;

  // 1. Replace Canonical
  html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-link" href="${canonicalUrl}" />`);

  // 2. Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // 3. Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${description}" />`);

  // 4. Replace Keywords if provided
  if (keywords) {
    html = html.replace(/<meta name="keywords" content=".*?" \/>/i, `<meta name="keywords" content="${keywords.join(', ')}" />`);
  }

  // 5. Replace Open Graph
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // 6. Replace Twitter Cards
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // 7. Inject Schema JSON-LD before </head>
  if (schemaJson) {
    const schemaTag = `\n    <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n    </script>\n  </head>`;
    html = html.replace(/<\/head>/i, schemaTag);
  }

  // 8. Pre-rendered HTML inside <div id="root">
  const preRendered = `
    <div id="root">
      <div class="pre-rendered-seo" style="max-width: 820px; margin: 0 auto; padding: 2rem 1rem; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7;">
        <header style="margin-bottom: 2rem; border-bottom: 1px solid #1e243b; padding-bottom: 1.5rem;">
          <a href="/" style="display: inline-flex; align-items: center; gap: 8px; color: #4a6aff; text-decoration: none; font-weight: bold; font-size: 14px; margin-bottom: 1rem;">
            ← Return to Syphrone Encryptor
          </a>
          ${category ? `<span style="display: block; font-size: 12px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 0.5rem;">${category} · ${date || ''}</span>` : ''}
          <h1 style="font-size: 2rem; font-weight: 800; color: #ffffff; line-height: 1.25; margin: 0 0 0.5rem 0;">${heading || title}</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">${description}</p>
        </header>
        <article style="font-size: 15px; color: #cbd5e1; line-height: 1.75;">
          ${content}
        </article>
        <footer style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #1e243b; text-align: center;">
          <p style="color: #94a3b8; font-size: 13px;">Syphrone — 100% Client-Side Web Cryptography Platform by Armaan Sunasara (Techyboy).</p>
          <a href="/" style="display: inline-block; margin-top: 0.75rem; padding: 10px 20px; background: linear-gradient(135deg, #4a6aff, #a855f7); color: white; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 10px;">Launch Free Encryption Tool</a>
        </footer>
      </div>
    </div>
  `.trim();

  html = html.replace(/<div id="root"><\/div>/i, preRendered);

  return html;
}

function writePage(subPath, htmlContent) {
  const targetDir = path.join(distDir, subPath);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, htmlContent, 'utf8');
  console.log(`[SEO Prerender] Generated: ${subPath}/index.html`);
}

// 1. Generate Core Pages
for (const page of CORE_PAGES) {
  const schema = {
    "@context": "https://schema.org",
    "@type": page.route === '/faq' ? "FAQPage" : "WebPage",
    "name": page.title,
    "description": page.description,
    "url": `https://syphrone.netlify.app${page.route}`,
    "publisher": {
      "@type": "Organization",
      "name": "Syphrone",
      "url": "https://syphrone.netlify.app/"
    }
  };

  const html = generateHTML({
    route: page.route,
    title: page.title,
    description: page.description,
    heading: page.heading,
    content: page.content,
    schemaJson: schema
  });

  writePage(page.route.replace(/^\//, ''), html);

  // Write aliases
  if (page.aliases) {
    for (const alias of page.aliases) {
      writePage(alias.replace(/^\//, ''), html);
    }
  }
}

// 2. Generate All Blog Posts
for (const post of BLOG_POSTS) {
  const route = `/blog/${post.id}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "url": `https://syphrone.netlify.app${route}`,
    "datePublished": "2026-08-20",
    "dateModified": "2026-11-20",
    "author": {
      "@type": "Person",
      "name": "Armaan Sunasara",
      "url": "https://techyboy.live"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Syphrone",
      "url": "https://syphrone.netlify.app/"
    },
    "mainEntityOfPage": `https://syphrone.netlify.app${route}`
  };

  const html = generateHTML({
    route,
    title: `${post.title} — Syphrone`,
    description: post.summary,
    keywords: post.keywords,
    heading: post.title,
    date: post.date,
    category: post.category,
    content: post.content,
    schemaJson: schema
  });

  writePage(`blog/${post.id}`, html);

  // Also write any aliases
  if (post.aliases) {
    for (const alias of post.aliases) {
      const aliasRoute = `/blog/${alias}`;
      const aliasHtml = generateHTML({
        route: aliasRoute,
        title: `${post.title} — Syphrone`,
        description: post.summary,
        keywords: post.keywords,
        heading: post.title,
        date: post.date,
        category: post.category,
        content: post.content,
        schemaJson: schema
      });
      writePage(`blog/${alias}`, aliasHtml);
    }
  }
}

console.log('[SEO Prerender] Successfully generated all static pre-rendered pages with exact canonicals and structured data!');
