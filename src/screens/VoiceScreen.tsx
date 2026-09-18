import { useState, useEffect } from 'react';
import { Mic, X, BookMarked, Users, Wallet, MapPin } from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';

const commands = [
  { icon: BookMarked, text: 'Book a slot', action: 'booking' as const },
  { icon: Users, text: 'Check my queue', action: 'queue' as const },
  { icon: Wallet, text: 'Check payment status', action: 'payment' as const },
  { icon: MapPin, text: 'Find nearest mandi', action: 'booking' as const },
];

export default function VoiceScreen() {
  const { tr, go } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!listening) return;
    const phrases = ['Book a slot for wheat', 'Check my queue status', 'Check payment status', 'Find nearest mandi'];
    let i = 0;
    const timer = setInterval(() => {
      if (i < phrases.length) {
        setTranscript(phrases[i]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 800);
    return () => clearInterval(timer);
  }, [listening]);

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.voiceAssistant} />

      <div className="flex flex-col items-center px-6 pt-8 pb-6">
        {/* Mic button with waveform */}
        <div className="relative flex items-center justify-center mb-8">
          {listening && (
            <div className="absolute inset-0 rounded-full bg-saffron-300 animate-pulse-ring" />
          )}
          <button
            onClick={() => {
              setListening(!listening);
              setTranscript('');
            }}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
              listening ? 'bg-saffron-500' : 'bg-kisan-600'
            }`}
          >
            {listening ? <X className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
          </button>
        </div>

        {/* Waveform */}
        {listening && (
          <div className="flex items-center gap-1.5 h-12 mb-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-saffron-500 rounded-full animate-wave"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${0.8 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        <p className="text-lg font-bold text-gray-700 mb-2">
          {listening ? tr.listening : tr.tapToSpeak}
        </p>
        <p className="text-sm text-gray-400 text-center mb-6">
          हिन्दी • ਪੰਜਾਬੀ • English
        </p>

        {transcript && (
          <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 animate-fade-in">
            <p className="text-xs text-gray-400 font-semibold mb-1">You said:</p>
            <p className="text-base font-semibold text-gray-800">"{transcript}"</p>
          </div>
        )}

        {/* Command suggestions */}
        <div className="w-full space-y-3">
          <p className="text-sm font-bold text-gray-500 uppercase">Try saying</p>
          {commands.map((c) => (
            <button
              key={c.text}
              onClick={() => go(c.action)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-[0.98] hover:border-kisan-300 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-kisan-100 flex items-center justify-center">
                <c.icon className="w-6 h-6 text-kisan-600" />
              </div>
              <span className="text-base font-semibold text-gray-700 flex-1 text-left">{c.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
