import { Wifi, Signal, BatteryFull } from 'lucide-react';
import { useApp } from '../App';
import type { ScreenId } from '../data';
import { Mic } from 'lucide-react';

export default function MobileFrame({
  children,
  screen,
}: {
  children: React.ReactNode;
  screen: ScreenId;
}) {
  const { go } = useApp();
  const showMic = screen !== 'language' && screen !== 'login' && screen !== 'voice' && screen !== 'verification' && screen !== 'findmandi' && screen !== 'bookings' && screen !== 'home';

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="mobile-frame">
        {/* Status bar */}
        <div className="status-bar">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryFull className="w-4 h-4" />
          </div>
        </div>

        {/* Screen content */}
        <div className="screen-scroll relative">{children}</div>

        {/* Floating mic */}
        {showMic && (
          <button
            onClick={() => go('voice')}
            className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-saffron-500 shadow-lg flex items-center justify-center active:scale-90 transition-transform hover:bg-saffron-600 z-50"
            aria-label="Voice Assistant"
          >
            <Mic className="w-6 h-6 text-white" />
            <span className="absolute inset-0 rounded-full bg-saffron-400 animate-pulse-ring -z-10" />
          </button>
        )}
      </div>
    </div>
  );
}
