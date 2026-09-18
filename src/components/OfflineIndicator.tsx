import { Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setOffline((o) => !o), 12000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        offline
          ? 'bg-amber-100 text-amber-700'
          : 'bg-kisan-100 text-kisan-700'
      }`}
    >
      {offline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
      {offline ? 'Offline Mode' : 'Online'}
    </div>
  );
}
