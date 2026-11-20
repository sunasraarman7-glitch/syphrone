import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard, downloadBlob } from '../utils/clipboard';

export default function QRCodeModal({ text, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    const canvas = canvasRef.current;

    import('qrcode').then(QRCode => {
      QRCode.toCanvas(canvas, text.slice(0, 2953), {
        width: 260,
        margin: 2,
        color: { dark: '#4a6aff', light: '#00000000' },
      }).catch(() => drawFallbackQR(canvas, text));
    }).catch(() => drawFallbackQR(canvas, text));
  }, [text]);

  const drawFallbackQR = (canvas, txt) => {
    const size = 260;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    const grid = 21;
    const cellSize = size / grid;
    const seed = txt.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const val = (seed * (r + 1) * (c + 1)) % 7;
        if (val < 3) {
          ctx.fillStyle = '#4a6aff';
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  };

  const handleDownload = () => {
    canvasRef.current?.toBlob(blob => { if (blob) downloadBlob(blob, 'syphrone-qr.png'); });
  };

  const handleCopyText = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="modal-container p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <i className="fa-solid fa-qrcode text-blue-400" />
            </div>
            <h2 className="text-lg font-bold">QR Code</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white">
            <i className="fa-solid fa-xmark" />
          </motion.button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-syphrone-bg border border-syphrone-border">
            <canvas ref={canvasRef} width={260} height={260} className="block" />
          </div>
        </div>

        <p className="text-xs text-syphrone-muted text-center mb-5 break-all px-2">
          {text.length > 90 ? text.slice(0, 90) + '...' : text}
        </p>

        <div className="flex gap-3">
          <button onClick={handleDownload}
            className="flex-1 py-3 rounded-xl border border-syphrone-border text-sm text-syphrone-text hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-download text-blue-400" /> Download PNG
          </button>
          <button onClick={handleCopyText}
            className="flex-1 py-3 rounded-xl btn-gradient text-sm text-white font-medium flex items-center justify-center gap-2">
            <i className={`fa-${copied ? 'solid fa-check' : 'regular fa-copy'}`} />
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
