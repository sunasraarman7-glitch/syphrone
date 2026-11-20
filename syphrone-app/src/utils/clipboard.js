// ─── Copy text to clipboard ──────────────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback textarea method
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// ─── Paste from clipboard ────────────────────────────────────────────────
export async function pasteFromClipboard() {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return '';
  }
}

// ─── Web Share API ────────────────────────────────────────────────────────
export async function shareText(text, title = 'Syphrone Encrypted Message') {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  } else {
    return await copyToClipboard(text);
  }
}

// ─── Download text as file ────────────────────────────────────────────────
export function downloadText(text, filename = 'syphrone-message.txt') {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Download blob as file ────────────────────────────────────────────────
export function downloadBlob(blob, filename = 'syphrone-image.png') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
