import { createWriteStream } from 'fs';
import { createCanvas } from 'canvas';

// Simple pure-JS QR using the qrcode package installed via npx
import QRCode from 'qrcode';

const out = 'C:/Users/Admin/.gemini/antigravity/brain/4fa82427-c381-48b0-9379-01b30a4c2e3b/expo_scan_qr.png';
QRCode.toFile(out, 'exp://192.168.1.9:8081', { width: 500, margin: 3 }, (err) => {
    if (err) { console.error(err); process.exit(1); }
    console.log('QR saved to', out);
});
