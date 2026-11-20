
export default function PrivacyPage() {
  return (
    <div className="flex-grow px-3 sm:px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="py-6 sm:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero-Log & Zero-Knowledge Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Privacy Policy & <span className="text-gradient">Zero-Knowledge Guarantee</span>
        </h1>
        <p className="text-syphrone-muted text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
          Effective Date: August 20, 2026 · Syphrone Platform (Techyboy) · Transparent Cryptographic Data-Handling Pledge
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-syphrone-muted leading-relaxed">

        {/* ── Core Guarantee Pledge Card ─────────────────────── */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 space-y-3 shadow-[0_0_35px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-lg shadow-inner">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">The Syphrone Absolute Privacy Pledge</h2>
              <p className="text-[11px] text-emerald-300">Mathematical Privacy · No Server Interception</p>
            </div>
          </div>
          <p className="text-syphrone-text leading-relaxed pt-2">
            Syphrone is architected from the ground up as a <strong>100% client-side application</strong> running inside your browser’s isolated JavaScript sandbox. We do not store, intercept, analyze, log, or transmit any cleartext messages, ciphertexts, passphrases, symmetric keys, RSA key pairs, or user telemetry to any external server.
          </p>
        </div>

        {/* ── Section 1: What We Do Not Collect ──────────────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">1</span>
            <span>Information We Absolutely Do Not Collect</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                icon: 'fa-file-lines',
                color: 'text-blue-400',
                title: 'No Plaintext Messages',
                desc: 'Your text is encrypted directly in browser RAM via the Web Crypto API. Plaintext is destroyed immediately upon component unmount.'
              },
              {
                icon: 'fa-key',
                color: 'text-purple-400',
                title: 'No Passwords or Keys',
                desc: 'Keys derived via PBKDF2 (310,000 iterations) exist only in transient cryptographic memory and are never saved or sent anywhere.'
              },
              {
                icon: 'fa-cookie-bite',
                color: 'text-amber-400',
                title: 'No Tracking Cookies',
                desc: 'We do not deploy third-party advertising cookies, cross-site trackers, device fingerprinting scripts, or user session cookies.'
              },
              {
                icon: 'fa-database',
                color: 'text-rose-400',
                title: 'No Remote Databases',
                desc: 'There are zero backend databases holding your cipher operations, notes, or usage patterns. Syphrone has zero backend servers.'
              },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-syphrone-bg/70 border border-syphrone-border/70 flex gap-3">
                <i className={`fa-solid ${item.icon} ${item.color} text-base mt-0.5 shrink-0`} />
                <div>
                  <h4 className="text-white font-bold text-xs">{item.title}</h4>
                  <p className="text-[11px] text-syphrone-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Local Storage & Data Ownership ──────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono">2</span>
            <span>Client-Side Local Storage & User Data Ownership</span>
          </h3>
          <p>
            Any preferences (active visual theme, audio/haptic toggles, screen shield, cipher history metadata, and encrypted Secure Vault notes) are stored exclusively in your browser’s local storage (<code className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10">localStorage</code> / <code className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10">IndexedDB</code>).
          </p>
          <p>
            You retain 100% control over this data. You can erase all stored data at any moment by clicking "Clear All" in Cipher History, or by clearing your browser site data.
          </p>
        </div>

        {/* ── Section 3: Network Security & Headers ──────────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">3</span>
            <span>Transport Security & Content Headers</span>
          </h3>
          <p>
            Syphrone enforces strict HTTP headers served through modern CDN edge infrastructure, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-syphrone-muted">
            <li><strong className="text-white">Strict-Transport-Security (HSTS):</strong> Enforces modern TLS 1.3 encryption across all network transfers.</li>
            <li><strong className="text-white">Content-Security-Policy (CSP):</strong> Prevents unauthorized script injections, cross-site scripting (XSS), and data exfiltration.</li>
            <li><strong className="text-white">X-Frame-Options: DENY:</strong> Protects against clickjacking and unauthorized embedding in foreign iframes.</li>
            <li><strong className="text-white">Referrer-Policy:</strong> Enforces strict-origin-when-cross-origin to eliminate URL leakage.</li>
          </ul>
        </div>

        {/* ── Section 4: Contact & Inquiries ─────────────────── */}
        <div className="glass-card rounded-2xl p-6 border border-syphrone-border space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-mono">4</span>
            <span>Security Inquiries & Open Inquiries</span>
          </h3>
          <p>
            For security audits, vulnerability disclosures, or questions regarding Syphrone’s zero-knowledge architecture, contact lead engineer Armaan Sunasara directly:
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:contact@techyboy.live"
              className="px-4 py-2.5 rounded-xl glass-card border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/20 font-semibold text-xs transition-all flex items-center gap-2 no-underline"
            >
              <i className="fa-solid fa-envelope" /> contact@techyboy.live
            </a>
            <a
              href="https://techyboy.live"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl glass-card border border-purple-500/30 text-purple-400 hover:text-white hover:bg-purple-500/20 font-semibold text-xs transition-all flex items-center gap-2 no-underline"
            >
              <i className="fa-solid fa-globe" /> techyboy.live
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
