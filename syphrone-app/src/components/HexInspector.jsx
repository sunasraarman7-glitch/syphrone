import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import haptic from '../utils/haptics';

export default function HexInspector({ encryptedText }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!encryptedText) return null;

  let bytes = [];
  try {
    const b64 = encryptedText.replace('v3:', '');
    const bin = atob(b64);
    for (let i = 0; i < Math.min(bin.length, 256); i++) bytes.push(bin.charCodeAt(i));
  } catch {
    bytes = Array.from(new TextEncoder().encode(encryptedText)).slice(0, 256);
  }

  const hexStr = bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');

  const rows = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const row = bytes.slice(i, i + 16);
    const hex = row.map(b => b.toString(16).padStart(2, '0'));
    const ascii = row.map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.');
    rows.push({ offset: i, hex, ascii });
  }

  const getByteColor = (b) => {
    if (b > 191) return '#4a6aff';
    if (b > 127) return '#a855f7';
    if (b > 63)  return '#06b6d4';
    return '#94a3b8';
  };

  const handleCopy = async () => {
    await copyToClipboard(hexStr);
    haptic.copy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass-card rounded-xl border border-syphrone-border overflow-hidden">
      <button
        onClick={() => { setOpen(p => !p); haptic.light(); }}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
            <i className="fa-solid fa-code text-orange-400 text-xs" />
          </div>
          <span className="text-sm font-semibold text-white">Hex Inspector</span>
          <span className="text-[10px] text-syphrone-muted">({bytes.length} bytes)</span>
        </div>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-syphrone-muted text-xs`} />
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="bg-syphrone-bg rounded-xl p-3 font-mono text-[10px] overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-syphrone-muted">
                  <th className="text-left pr-4 pb-2 w-16">Offset</th>
                  <th className="text-left pb-2">Hex</th>
                  <th className="text-left pl-4 pb-2">ASCII</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.offset}>
                    <td className="text-syphrone-muted pr-4 py-0.5">{row.offset.toString(16).padStart(4, '0')}</td>
                    <td className="py-0.5">
                      {row.hex.map((h, i) => (
                        <span key={i} className="mr-1" style={{ color: getByteColor(parseInt(h, 16)) }}>{h}</span>
                      ))}
                    </td>
                    <td className="pl-4 py-0.5 text-syphrone-muted">{row.ascii.join('')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleCopy}
            className="mt-3 w-full py-2 text-xs rounded-lg border border-syphrone-border text-syphrone-muted hover:text-white hover:border-blue-500/50 transition-colors flex items-center justify-center gap-2">
            <i className={`fa-${copied ? 'solid fa-check text-green-400' : 'regular fa-copy'}`} />
            {copied ? 'Copied!' : 'Copy as Hex'}
          </button>
        </div>
      )}
    </div>
  );
}
