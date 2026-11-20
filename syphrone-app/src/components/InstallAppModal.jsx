import { motion } from 'framer-motion';
import haptic from '../utils/haptics';

export default function InstallAppModal({ deferredPrompt, onClose, onInstallSuccess }) {

  const handleInstallClick = async () => {
    haptic.success();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onInstallSuccess?.();
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container"
        style={{ maxWidth: 520 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-syphrone-border backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1 border border-syphrone-border flex items-center justify-center shadow-lg">
              <img
                src="/syphrone-logo.png"
                onError={(e) => { e.target.src = 'https://i.ibb.co/fdVXv3ww/syphrone.png'; }}
                alt="Syphrone Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Install Syphrone App</h2>
              <p className="text-xs text-syphrone-muted">Download for Android & Mobile Devices</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Main Hero Card */}
          <div className="glass-card rounded-2xl p-5 border border-blue-500/30 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 mx-auto shadow-xl flex items-center justify-center">
              <div className="bg-syphrone-bg w-full h-full rounded-2xl flex items-center justify-center p-2">
                <img
                  src="/syphrone-logo.png"
                  onError={(e) => { e.target.src = 'https://i.ibb.co/fdVXv3ww/syphrone.png'; }}
                  alt="Syphrone Icon"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">Syphrone for Android & Web</h3>
            <p className="text-xs text-syphrone-muted leading-relaxed max-w-sm mx-auto">
              Install Syphrone directly onto your Android device homescreen for instantaneous 1-tap offline access without downloading heavy APK files.
            </p>

            {/* Direct Install Button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-sm shadow-[0_0_20px_rgba(74,106,255,0.4)] flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
              >
                <i className="fa-brands fa-android text-base" />
                Install Application Now
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-medium">
                ✨ Ready to Add to Homescreen
              </div>
            )}
          </div>

          {/* Android Manual Installation Guide */}
          <div className="glass-card rounded-2xl p-5 border border-syphrone-border space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-brands fa-android text-green-400 text-base" /> Android Installation Guide
            </h4>
            <p className="text-xs text-syphrone-muted">
              If the direct install prompt doesn't appear automatically, follow these simple 3 steps:
            </p>
            <div className="space-y-2.5">
              {[
                { step: '1', title: 'Open Browser Menu', desc: 'Tap the 3 dots (⋮) in the top-right corner of Chrome/Edge.' },
                { step: '2', title: 'Select "Add to Home screen"', desc: 'Or tap "Install app" in the options dropdown.' },
                { step: '3', title: 'Confirm Installation', desc: 'Tap "Install" to place Syphrone in your Android App Drawer.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3 p-2.5 rounded-xl bg-syphrone-bg border border-syphrone-border">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">{item.title}</h5>
                    <p className="text-[11px] text-syphrone-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key App Benefits */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" /> App Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'fa-wifi-slash', color: 'text-green-400', title: '100% Offline', desc: 'Works without internet connection' },
                { icon: 'fa-bolt', color: 'text-yellow-400', title: 'Zero Lag', desc: 'Lightning fast native performance' },
                { icon: 'fa-mobile-screen', color: 'text-cyan-400', title: 'Full Screen', desc: 'Distraction-free app UI window' },
                { icon: 'fa-shield-halved', color: 'text-purple-400', title: 'Zero Server Logs', desc: 'All crypto stays on your phone' },
              ].map(f => (
                <div key={f.title} className="glass-card rounded-xl p-3 flex items-center gap-2.5 border border-syphrone-border">
                  <i className={`fa-solid ${f.icon} ${f.color} text-sm`} />
                  <div>
                    <h5 className="text-xs font-semibold text-white">{f.title}</h5>
                    <p className="text-[10px] text-syphrone-muted leading-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-syphrone-muted pb-1">
            Syphrone Progressive Web App (PWA) · v3.0 · Arman Sunasra (TechyBoy)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
