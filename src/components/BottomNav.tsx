import { useApp, ScreenName } from '@/context/AppContext';
import { Home, Search, Calendar, Mic, Wallet } from 'lucide-react';

export function BottomNav() {
  const { currentScreen, navigate, t } = useApp();

  const items: { screen: ScreenName; label: string; icon: typeof Home }[] = [
    { screen: 'farmerDashboard', label: t('dashboard'), icon: Home },
    { screen: 'findMandis', label: t('findMandis'), icon: Search },
    { screen: 'myBookings', label: t('myBookings'), icon: Calendar },
    { screen: 'paymentTracking', label: t('payments'), icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {items.map((item) => {
          const active = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-kisan-green-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'fill-kisan-green-100' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
