import { useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard } from '../utils/clipboard';

const AMOUNTS = [50, 100, 250, 500];
const UPI_ID = '9313560589@ybl';

export default function DonateModal({ onClose }) {
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);

  const finalAmount = custom || amount;
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Arman&am=${finalAmount}&tn=Donation%20for%20Syphrone&cu=INR`;

  const handleCopy = async () => {
    await copyToClipboard(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container p-6" style={{ maxWidth: 400 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <i className="fa-solid fa-heart text-red-400" />
            </div>
            <h2 className="text-lg font-bold">Support Us ☕</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        <p className="text-sm text-syphrone-muted mb-5 text-center">If Syphrone saved you time or kept your messages safe, consider buying us a chai! ☕</p>

        {/* Amount selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {AMOUNTS.map(a => (
            <button key={a} onClick={() => { setAmount(a); setCustom(''); }}
              className={`py-2 rounded-xl text-sm font-medium transition-all border ${amount === a && !custom ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-syphrone-border text-syphrone-muted hover:text-white'}`}>
              ₹{a}
            </button>
          ))}
        </div>

        <input value={custom} onChange={e => setCustom(e.target.value.replace(/\D/g, ''))}
          placeholder="Custom amount..."
          className="w-full input-field rounded-xl px-4 py-3 text-sm mb-4" />

        {/* QR code */}
        <div className="flex justify-center mb-4">
          <img src="https://i.ibb.co/F43hqvF0/my-donation-qr-code.jpg" alt="UPI QR"
            className="w-44 h-44 rounded-2xl border border-syphrone-border" />
        </div>

        <div className="space-y-2">
          <a href={upiUrl}
            className="block w-full py-3 rounded-xl btn-gradient text-white font-bold text-sm text-center">
            <i className="fa-solid fa-mobile-screen mr-2" /> Open UPI App to Pay ₹{finalAmount}
          </a>
          <button onClick={handleCopy}
            className="w-full py-2.5 rounded-xl border border-syphrone-border text-sm text-syphrone-muted hover:text-white transition-colors flex items-center justify-center gap-2">
            <i className={`fa-${copied ? 'solid fa-check text-green-400' : 'regular fa-copy'}`} />
            {copied ? 'Copied!' : `Copy UPI ID: ${UPI_ID}`}
          </button>
          <a href="https://www.buymeacoffee.com/ciphervault" target="_blank" rel="noopener noreferrer"
            className="block w-full py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm text-center hover:bg-yellow-500/20 transition-colors">
            ☕ Buy Me a Coffee
          </a>
        </div>
      </motion.div>
    </div>
  );
}
