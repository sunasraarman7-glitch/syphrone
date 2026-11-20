const MAGIC = 'SYPH:';

// ─── Encode text into PNG image using LSB steganography ───────────────────
export async function encodeToImage(text, imageFile = null) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (imageFile) {
    const img = await loadImage(imageFile);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  } else {
    // Generate a colorful noise carrier image
    canvas.width = 512;
    canvas.height = 512;
    const imgData = ctx.createImageData(512, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i]     = Math.floor(Math.random() * 256);
      imgData.data[i + 1] = Math.floor(Math.random() * 256);
      imgData.data[i + 2] = Math.floor(Math.random() * 256);
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const payload = MAGIC + text;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payload);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // First 32 bits = payload length
  const length = bytes.length;
  const lengthBits = [];
  for (let i = 31; i >= 0; i--) lengthBits.push((length >> i) & 1);

  const allBits = [...lengthBits];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) allBits.push((byte >> i) & 1);
  }

  const requiredPixels = allBits.length;
  if (requiredPixels > pixels.length * 0.75) {
    throw new Error('Image too small to hold this message. Use a larger image or shorter message.');
  }

  // Embed bits into LSB of R, G, B channels
  let bitIdx = 0;
  for (let i = 0; i < pixels.length && bitIdx < allBits.length; i += 4) {
    if (bitIdx < allBits.length) { pixels[i]     = (pixels[i]     & 0xFE) | allBits[bitIdx++]; }
    if (bitIdx < allBits.length) { pixels[i + 1] = (pixels[i + 1] & 0xFE) | allBits[bitIdx++]; }
    if (bitIdx < allBits.length) { pixels[i + 2] = (pixels[i + 2] & 0xFE) | allBits[bitIdx++]; }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

// ─── Decode hidden text from PNG ──────────────────────────────────────────
export async function decodeFromImage(imageFile) {
  const img = await loadImage(imageFile);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Extract all LSBs from R, G, B
  const bits = [];
  for (let i = 0; i < pixels.length; i += 4) {
    bits.push(pixels[i] & 1);
    bits.push(pixels[i + 1] & 1);
    bits.push(pixels[i + 2] & 1);
  }

  // Read length from first 32 bits
  let length = 0;
  for (let i = 0; i < 32; i++) length = (length << 1) | bits[i];

  if (length <= 0 || length > 1000000) throw new Error('No hidden message found in this image');

  // Read payload bytes
  const payloadBits = bits.slice(32, 32 + length * 8);
  const bytes = [];
  for (let i = 0; i < payloadBits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (payloadBits[i + j] || 0);
    bytes.push(byte);
  }

  const text = new TextDecoder().decode(new Uint8Array(bytes));
  if (!text.startsWith(MAGIC)) throw new Error('No Syphrone message found in this image');

  return text.slice(MAGIC.length);
}

// ─── Helper: load image from File ────────────────────────────────────────
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}
