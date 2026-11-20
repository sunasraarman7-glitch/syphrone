import { useState } from 'react';

const PRESETS = [
  { label: '1 Hour',  ms: 60 * 60 * 1000 },
  { label: '6 Hours', ms: 6 * 60 * 60 * 1000 },
  { label: '24 Hours',ms: 24 * 60 * 60 * 1000 },
  { label: '3 Days',  ms: 3 * 24 * 60 * 60 * 1000 },
  { label: '7 Days',  ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
];

function fmtDate(ts) {
  return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function MessageExpiry({ expiresAt, onChange }) {
  const [enabled, setEnabled] = useState(!!expiresAt);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) onChange(Date.now() + PRESETS[2].ms);
    else onChange(null);
  };

  const selectPreset = (ms) => onChange(Date.now() + ms);

  return (
    <div className="glass-card rounded-xl p-4 border border-syphrone-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
            <i className="fa-regular fa-clock text-red-400 text-xs" />
          </div>
          <span className="text-sm font-semibold text-white">Self-Destruct Timer</span>
        </div>
        {/* Toggle */}
        <button onClick={toggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-500' : 'bg-syphrone-border'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => selectPreset(p.ms)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  expiresAt && Math.abs(expiresAt - (Date.now() + p.ms)) < 2000
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-syphrone-border text-syphrone-muted hover:border-blue-500/50'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
          {expiresAt && (
            <p className="text-xs text-syphrone-muted flex items-center gap-1.5">
              <i className="fa-solid fa-circle-exclamation text-yellow-400" />
              Expires: <span className="text-white">{fmtDate(expiresAt)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
