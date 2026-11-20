import { memo } from 'react';
import { measurePasswordStrength } from '../utils/encryption';

function PasswordStrengthMeterComponent({ password }) {
  if (!password) return null;
  const { label, color, percent, entropyBits, checks } = measurePasswordStrength(password);

  const requirements = [
    { key: 'length8', label: '8+ chars' },
    { key: 'length12', label: '12+ chars' },
    { key: 'uppercase', label: 'Uppercase' },
    { key: 'lowercase', label: 'Lowercase' },
    { key: 'numbers', label: 'Numbers' },
    { key: 'symbols', label: 'Symbols' },
  ];

  return (
    <div className="mt-3 space-y-2">
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-syphrone-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      </div>

      {/* Entropy */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-syphrone-muted">Entropy: <span className="text-white font-mono">{entropyBits} bits</span></span>
        <span className="text-[10px] text-syphrone-muted">AES-256-GCM</span>
      </div>

      {/* Requirement chips */}
      <div className="flex flex-wrap gap-1.5">
        {requirements.map(req => (
          <span key={req.key}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${checks?.[req.key]
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-syphrone-border/30 border-syphrone-border text-syphrone-muted'
              }`}>
            {checks?.[req.key] ? '✓' : '○'} {req.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default memo(PasswordStrengthMeterComponent);
