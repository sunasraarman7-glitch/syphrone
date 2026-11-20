import { memo } from 'react';
import { generateEntropy } from '../utils/encryption';

function EntropyVisualizerComponent({ encryptedText }) {
  if (!encryptedText) return null;
  const { entropy, label, buckets, totalBytes } = generateEntropy(encryptedText);

  const labelColor = {
    'Excellent': '#00ff88',
    'Very Good': '#00cc44',
    'Good':      '#ff9900',
    'Fair':      '#ff6600',
    'Low':       '#ff3333',
  }[label] || '#94a3b8';

  return (
    <div className="glass-card rounded-xl p-4 border border-syphrone-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
            <i className="fa-solid fa-wave-square text-cyan-400 text-xs" />
          </div>
          <span className="text-sm font-semibold text-white">Entropy Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white">{entropy} bits</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color: labelColor, borderColor: labelColor + '44', background: labelColor + '15' }}>{label}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-px h-16 mb-3">
        {buckets.map((val, i) => (
          <div key={i} className="flex-1 rounded-sm transition-all duration-500"
            style={{
              height: `${Math.max(3, val * 100)}%`,
              background: `linear-gradient(180deg, #a855f7, #4a6aff)`,
              opacity: 0.6 + val * 0.4,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-syphrone-muted">
        <span>{totalBytes} bytes</span>
        <span>256 byte values</span>
        <span>Shannon entropy</span>
      </div>
    </div>
  );
}

export default memo(EntropyVisualizerComponent);
