import { useApp } from '@/context/AppContext';
import { Globe, ArrowRight, Sprout, ShieldCheck } from 'lucide-react';
import type { Language } from '@/lib/types';
import { ScreenContainer } from '@/components/ui';

export function LanguageScreen() {
  const { setLanguage, navigate, t } = useApp();

  const languages: { code: Language; label: string; native: string; flag: string }[] = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  return (
    <ScreenContainer>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-kisan-green-50 via-white to-white">
        <div className="tricolor-bar h-2 w-full" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
          <div className="mb-10 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 shadow-xl shadow-kisan-green-600/30 mb-4">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">KisanFlow</h1>
            <p className="text-slate-500 mt-1">{t('appTagline')}</p>
          </div>

          <div className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-kisan-green-600" />
              <h2 className="text-lg font-bold text-slate-900">{t('chooseLanguage')}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">{t('languageSubtitle')}</p>

            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-kisan-green-400 hover:shadow-md transition-all duration-200 group"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">{lang.native}</p>
                    <p className="text-sm text-slate-500">{lang.label}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-kisan-green-500 transition-colors" />
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('modeSelect')}
              className="btn-primary w-full mt-6"
            >
              {t('continue')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Government of India Initiative</span>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
