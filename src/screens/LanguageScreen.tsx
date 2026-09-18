import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import type { Language } from '../data';
import { useApp } from '../App';

const langs: { id: Language; label: string; sub: string; flag: string }[] = [
  { id: 'en', label: 'English', sub: 'English', flag: '🇬🇧' },
  { id: 'hi', label: 'हिन्दी', sub: 'Hindi', flag: '🇮🇳' },
  { id: 'pa', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi', flag: '🇮🇳' },
];

export default function LanguageScreen({
  setLang,
}: {
  setLang: (l: Language) => void;
}) {
  const { tr, go } = useApp();
  const [selected, setSelected] = useState<Language>('en');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-kisan-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-kisan-600 flex items-center justify-center mb-6 shadow-lg">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          {tr.chooseLang}
        </h1>
        <p className="text-sm text-gray-500 mb-8">भारत / India / ਭਾਰਤ</p>

        <div className="w-full space-y-3">
          {langs.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setSelected(l.id);
                setLang(l.id);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                selected === l.id
                  ? 'border-kisan-600 bg-kisan-50 shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="text-4xl">{l.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-xl font-bold text-gray-800">{l.label}</p>
                <p className="text-sm text-gray-400">{l.sub}</p>
              </div>
              {selected === l.id && (
                <div className="w-7 h-7 rounded-full bg-kisan-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={() => go('login')}
          className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] hover:bg-saffron-600 transition"
        >
          {tr.continue}
        </button>
      </div>
    </div>
  );
}
