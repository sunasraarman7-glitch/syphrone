import { measurePasswordStrength } from '../utils/encryption';

export default function MessageStats({ originalSize, encryptedSize, encryptTime, password }) {
  const pwStr = password ? measurePasswordStrength(password) : null;

  const stats = [
    { label: 'Original', value: `${originalSize} B`, icon: 'fa-file-lines', color: 'text-blue-400' },
    { label: 'Encrypted', value: `${encryptedSize} B`, icon: 'fa-lock', color: 'text-purple-400' },
    { label: 'Size Ratio', value: `${originalSize > 0 ? ((encryptedSize / originalSize) * 100).toFixed(0) : 0}%`, icon: 'fa-chart-bar', color: 'text-cyan-400' },
    { label: 'Enc. Time', value: `${encryptTime} ms`, icon: 'fa-bolt', color: 'text-yellow-400' },
  ];

  return (
    <div className="glass-card rounded-xl p-4 border border-syphrone-border space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-chart-mixed text-syphrone-muted" />
        <span className="text-sm font-semibold text-white">Encryption Stats</span>
        <span className="ml-auto text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">AES-256-GCM</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map(s => (
          <div key={s.label} className="bg-syphrone-bg/60 rounded-lg p-3">
            <div className={`flex items-center gap-1.5 mb-1 ${s.color}`}>
              <i className={`fa-solid ${s.icon} text-xs`} />
              <span className="text-[10px] text-syphrone-muted">{s.label}</span>
            </div>
            <p className="text-white text-sm font-mono font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {pwStr && (
        <div className="flex items-center gap-2 pt-1 border-t border-syphrone-border">
          <span className="text-xs text-syphrone-muted">Key Strength:</span>
          <span className="text-xs font-medium" style={{ color: pwStr.color }}>{pwStr.label}</span>
          <span className="text-xs text-syphrone-muted ml-auto">{pwStr.entropyBits} bits entropy</span>
        </div>
      )}
    </div>
  );
}
