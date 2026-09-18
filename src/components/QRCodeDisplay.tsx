import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';

export function QRCodeDisplay({ data, size = 200 }: { data: string; size?: number }) {
  return (
    <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
      <QRCodeCanvas
        value={data}
        size={size}
        level="M"
        includeMargin={false}
        fgColor="#14532d"
      />
    </div>
  );
}

export function downloadQR(data: string, filename: string) {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}
