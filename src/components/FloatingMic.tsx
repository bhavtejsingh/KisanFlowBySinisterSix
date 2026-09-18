import { useApp, ScreenName } from '@/context/AppContext';
import { Mic, X } from 'lucide-react';
import { useState } from 'react';

export function FloatingMic() {
  const { navigate, t } = useApp();
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <button
        onClick={() => navigate('voiceAssistant')}
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 shadow-lg shadow-kisan-green-600/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse-slow"
        aria-label={t('voiceAssistant')}
      >
        <Mic className="w-6 h-6" />
      </button>
      {showHint && (
        <div className="fixed bottom-36 right-4 z-50 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-fade-in">
          {t('voiceAssistant')}
        </div>
      )}
    </>
  );
}

export function VoiceOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useApp();
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">{t('voiceAssistant')}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-20 h-20 rounded-full bg-kisan-green-100 flex items-center justify-center animate-pulse">
            <Mic className="w-10 h-10 text-kisan-green-600" />
          </div>
          <p className="text-slate-600 font-medium">{t('voiceListening')}</p>
        </div>
      </div>
    </div>
  );
}
