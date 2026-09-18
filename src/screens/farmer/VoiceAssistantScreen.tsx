import { useApp } from '@/context/AppContext';
import { Mic, Calendar, Users, Wallet, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import { ScreenContainer } from '@/components/ui';
import { Header } from '@/components/common';

export function VoiceAssistantScreen() {
  const { navigate, t } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const commands = [
    { icon: Calendar, label: t('cmdBookSlot'), action: 'findMandis' as const },
    { icon: Users, label: t('cmdCheckQueue'), action: 'queueTracking' as const },
    { icon: Wallet, label: t('cmdCheckPayment'), action: 'paymentTracking' as const },
    { icon: MapPin, label: t('cmdFindMandi'), action: 'findMandis' as const },
  ];

  const handleMic = () => {
    setListening(true);
    setTranscript('');
    setTimeout(() => {
      setListening(false);
      setTranscript(t('cmdBookSlot'));
      setTimeout(() => navigate('findMandis'), 1500);
    }, 2500);
  };

  return (
    <ScreenContainer>
      <Header title={t('voiceAssistantTitle')} />
      <div className="px-4 py-6 pb-28">
        <div className="flex flex-col items-center gap-6">
          <p className="text-slate-500 text-center">{t('voiceSubtitle')}</p>

          <button
            onClick={handleMic}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              listening
                ? 'bg-gradient-to-br from-kisan-orange-400 to-kisan-orange-600 scale-110'
                : 'bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 hover:scale-105'
            } shadow-2xl`}
          >
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-kisan-orange-400 animate-ping opacity-20" />
                <span className="absolute inset-0 rounded-full bg-kisan-orange-400 animate-pulse opacity-30" style={{ animationDelay: '0.3s' }} />
              </>
            )}
            <Mic className="w-14 h-14 text-white" />
          </button>

          {listening ? (
            <div className="text-center animate-fade-in">
              <p className="text-lg font-semibold text-kisan-orange-600">{t('voiceListening')}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-8 bg-kisan-orange-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">{t('tapToSpeak')}</p>
          )}

          {transcript && (
            <div className="w-full p-4 rounded-2xl bg-kisan-green-50 border-2 border-kisan-green-200 animate-slide-up">
              <p className="text-slate-700 text-sm mb-1">You said:</p>
              <p className="font-semibold text-slate-900">"{transcript}"</p>
            </div>
          )}

          <div className="w-full mt-4">
            <h3 className="section-title mb-3">{t('voiceCommands')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => navigate(cmd.action)}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border border-slate-100 hover:border-kisan-green-300 hover:shadow-md transition-all active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-kisan-green-50 flex items-center justify-center">
                    <cmd.icon className="w-6 h-6 text-kisan-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 text-center">{cmd.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
