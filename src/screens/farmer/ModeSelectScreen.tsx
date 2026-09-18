import { useApp } from '@/context/AppContext';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { ScreenContainer } from '@/components/ui';

export function ModeSelectScreen() {
  const { setMode, navigate, t } = useApp();

  return (
    <ScreenContainer>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-kisan-green-50 to-white">
        <div className="tricolor-bar h-2 w-full" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
          <div className="mb-8 text-center animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900">{t('selectMode')}</h2>
          </div>

          <div className="w-full space-y-4 animate-slide-up">
            <button
              onClick={() => {
                setMode('farmer');
                navigate('farmerLogin');
              }}
              className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-kisan-green-400 hover:shadow-lg transition-all duration-200 group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-kisan-green-100 flex items-center justify-center group-hover:bg-kisan-green-500 transition-colors">
                  <User className="w-7 h-7 text-kisan-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{t('farmerMode')}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{t('farmerModeDesc')}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-kisan-green-500 mt-2 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => {
                setMode('officer');
                navigate('officerLogin');
              }}
              className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-kisan-orange-400 hover:shadow-lg transition-all duration-200 group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-kisan-orange-100 flex items-center justify-center group-hover:bg-kisan-orange-500 transition-colors">
                  <Briefcase className="w-7 h-7 text-kisan-orange-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{t('officerMode')}</h3>
 <p className="text-sm text-slate-500 mt-0.5">{t('officerModeDesc')}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-kisan-orange-500 mt-2 transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
