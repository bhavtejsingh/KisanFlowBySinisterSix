import { useApp } from '@/context/AppContext';
import { ArrowLeft, LogOut, Wifi, WifiOff, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header({ title, showBack = true }: { title: string; showBack?: boolean }) {
  const { goBack, t, mode } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnline = () => setIsOnline(true);
    const updateOffline = () => setIsOnline(false);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOffline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="tricolor-bar h-1 w-full" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={goBack}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={t('back')}
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isOnline ? 'bg-kisan-green-50 text-kisan-green-600' : 'bg-orange-50 text-orange-600'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : t('offlineMode')}</span>
          </div>
          {mode && (
            <div
              className={`badge ${
                mode === 'farmer' ? 'badge-green' : 'badge-orange'
              }`}
            >
              {mode === 'farmer' ? t('farmerMode') : t('officerMode')}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
