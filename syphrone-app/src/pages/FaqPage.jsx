import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does Syphrone encrypt my secret messages?',
    a: 'Syphrone uses the Web Crypto API native to your browser. By default, it applies military-grade AES-256-GCM symmetric authenticated encryption with a 256-bit key derived via PBKDF2 (310,000 SHA-256 iterations) alongside a unique 16-byte cryptographic salt and 12-byte IV.',
    category: 'Security',
  },
  {
    q: 'Is any of my data or plaintext sent to your servers?',
    a: 'No. Absolutely zero data ever leaves your device. Syphrone runs 100% client-side inside your browser sandbox. We have no backend servers, no Firebase authentication, no databases, no analytics trackers, and no remote storage.',
    category: 'Privacy',
  },
  {
    q: 'Can anyone intercept or crack my AES-256-GCM encrypted message?',
    a: 'AES-256 has a keyspace of 2²⁵⁶ combinations. Even with all supercomputers on Earth combined running for billions of years, brute-forcing an AES-256 key with PBKDF2 key stretching is computationally impossible.',
    category: 'Security',
  },
  {
    q: 'How does PNG Image Steganography work in Syphrone?',
    a: 'Our steganography tool embeds your secret text into the Least Significant Bits (LSB) of the image pixels in a PNG photo. Because the color variance is less than 0.39%, the carrier photo looks visually identical to the naked eye.',
    category: 'Features',
  },
  {
    q: 'Can I use Syphrone offline without an active internet connection?',
    a: 'Yes! Syphrone is a Progressive Web App (PWA). Once loaded or added to your home screen, it caches all assets and operates completely offline without needing cellular data or Wi-Fi.',
    category: 'General',
  },
  {
    q: 'What is the difference between Symmetric (AES) and Asymmetric (RSA) encryption?',
    a: 'Symmetric encryption (AES-256) uses one shared password/key for both encrypting and decrypting. Asymmetric encryption (RSA-2048) creates a public key (for others to encrypt messages for you) and a private key (which only you possess to decrypt them).',
    category: 'Education',
  },
  {
    q: 'How does the Secure Vault work in Syphrone?',
    a: 'The Secure Vault lets you save encrypted notes locally in your browser’s IndexedDB/LocalStorage, protected by your custom master passphrase. It automatically locks after 5 minutes of inactivity to prevent unauthorized access.',
    category: 'Features',
  },
  {
    q: 'What happens when a note has a self-destruct timer?',
    a: 'When you configure a self-destruct countdown, the decryption timestamp is verified upon unlocking. Once the timer expires, the decryption engine blocks and destroys the message payload permanently.',
    category: 'Features',
  },
  {
    q: 'Is Syphrone free to use?',
    a: 'Yes, Syphrone is 100% free and open for everyone. No accounts, no sign-in, and no backend servers required. All 20 signal themes and cryptographic tools are completely unlocked and free to use.',
    category: 'General',
  },
  {
    q: 'Who created Syphrone?',
    a: 'Syphrone was designed and developed by Armaan Sunasara, Co-Founder of Techyboy (https://techyboy.live), with the mission of providing accessible, uncompromising privacy tools for everyone.',
    category: 'General',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Security', 'Privacy', 'Features', 'Education', 'General'];

  const filteredFaqs = FAQS.filter(f => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const matchesQuery = !searchQuery.trim() ||
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Security Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h1>
        <p className="text-syphrone-muted text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
          Common questions and verified technical answers regarding AES-256-GCM encryption, PNG steganography, offline PWA capabilities, and zero-knowledge guarantees.
        </p>
      </div>

      {/* ── Search Bar ──────────────────────────────────────── */}
      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-syphrone-muted text-xs" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions: AES, steganography, passwords, offline, privacy..."
          className="w-full input-field rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted hover:text-white text-xs cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      {/* ── Category Filter Pills ──────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(74,106,255,0.4)]'
                : 'glass-card text-syphrone-muted hover:text-white border border-syphrone-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Accordion List ─────────────────────────────────── */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={faq.q}
              initial={false}
              className="glass-card rounded-2xl border border-syphrone-border overflow-hidden transition-colors hover:border-cyan-500/30"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">{faq.q}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-syphrone-border/50 text-syphrone-muted border border-syphrone-border hidden xs:inline">
                    {faq.category}
                  </span>
                  <motion.i
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="fa-solid fa-chevron-down text-syphrone-muted text-xs"
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-syphrone-muted leading-relaxed border-t border-syphrone-border/60">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center border border-syphrone-border">
            <p className="text-sm text-syphrone-muted">No answers found for "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-3 text-xs text-blue-400 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ── Still Have Questions CTA ───────────────────────── */}
      <div className="glass-card rounded-2xl p-6 text-center border border-syphrone-border mt-8 space-y-2">
        <h3 className="text-sm font-bold text-white">Have a specific question not covered here?</h3>
        <p className="text-xs text-syphrone-muted">
          Our security team and developer are always available to help.
        </p>
        <div className="pt-2">
          <a
            href="mailto:contact@techyboy.live"
            className="px-4 py-2 rounded-xl btn-gradient text-white font-bold text-xs inline-flex items-center gap-2 no-underline"
          >
            <i className="fa-solid fa-envelope" /> Ask a Question
          </a>
        </div>
      </div>
    </div>
  );
}
