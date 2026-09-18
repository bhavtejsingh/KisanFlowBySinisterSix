import { useApp } from '@/context/AppContext';
import { Phone, MessageSquare, Mic, Calendar, Users, Wallet, MapPin, HelpCircle, Info } from 'lucide-react';
import { ScreenContainer } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';

export function HelpCenterScreen() {
  const { navigate, t } = useApp();

  const helpItems = [
    { icon: Calendar, label: t('bookSlot'), desc: 'Learn how to book a procurement slot', screen: 'findMandis' as const },
    { icon: Users, label: t('queueStatus'), desc: 'Track your queue position in real time', screen: 'queueTracking' as const },
    { icon: Wallet, label: t('paymentStatus'), desc: 'Check your MSP payment status', screen: 'paymentTracking' as const },
    { icon: MapPin, label: t('findMandis'), desc: 'Find mandis near your location', screen: 'findMandis' as const },
    { icon: Mic, label: t('voiceAssistant'), desc: 'Use voice commands to navigate', screen: 'voiceAssistant' as const },
  ];

  return (
    <ScreenContainer>
      <Header title={t('helpCenter')} />
      <div className="px-4 py-4 pb-28 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8" />
            <h2 className="text-xl font-bold">{t('helpCenter')}</h2>
          </div>
          <p className="text-sm opacity-90">Get help with booking slots, tracking payments, and using the voice assistant.</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-kisan-orange-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-kisan-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Helpline Number</p>
              <p className="text-lg font-bold text-kisan-green-600">1800-180-1551</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">Toll-free support available 8 AM to 8 PM, all days.</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">SMS Support</p>
              <p className="text-sm text-slate-500">Send "HELP" to 51969 for assistance</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">IVR Support</p>
              <p className="text-sm text-slate-500">Call 1800-180-1551 and follow voice prompts</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="section-title mb-3">Quick Help Topics</h3>
          <div className="space-y-2">
            {helpItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.screen)}
                className="card-hover w-full flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-kisan-green-50 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-kisan-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-slate-50">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500">
              KisanFlow is a Government of India initiative for smart mandi procurement. Your data is securely stored and verified through Aadhaar and land records.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
