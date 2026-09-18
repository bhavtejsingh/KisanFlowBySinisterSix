import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language, AppMode, Farmer, Officer } from '@/lib/types';
import { t as translate, type TranslationKey } from '@/lib/i18n';

export type ScreenName =
  | 'language'
  | 'modeSelect'
  | 'farmerLogin'
  | 'farmerDashboard'
  | 'voiceAssistant'
  | 'verification'
  | 'findMandis'
  | 'slotBooking'
  | 'bookingConfirmation'
  | 'queueTracking'
  | 'paymentTracking'
  | 'myBookings'
  | 'officerLogin'
  | 'officerDashboard'
  | 'liveQueue'
  | 'qrVerification'
  | 'procurementEntry'
  | 'procurementApproval'
  | 'paymentProcessing'
  | 'analytics'
  | 'helpCenter';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  mode: AppMode | null;
  setMode: (mode: AppMode | null) => void;
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  t: (key: TranslationKey) => string;
  farmer: Farmer | null;
  setFarmer: (farmer: Farmer | null) => void;
  officer: Officer | null;
  setOfficer: (officer: Officer | null) => void;
  selectedMandiId: string | null;
  setSelectedMandiId: (id: string | null) => void;
  lastBookingId: string | null;
  setLastBookingId: (id: string | null) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedProcurementId: string | null;
  setSelectedProcurementId: (id: string | null) => void;
  verifiedBookingId: string | null;
  setVerifiedBookingId: (id: string | null) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<AppMode | null>(null);
  const [history, setHistory] = useState<ScreenName[]>(['language']);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [selectedMandiId, setSelectedMandiId] = useState<string | null>(null);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedProcurementId, setSelectedProcurementId] = useState<string | null>(null);
  const [verifiedBookingId, setVerifiedBookingId] = useState<string | null>(null);

  const currentScreen = history[history.length - 1];

  const navigate = useCallback((screen: ScreenName) => {
    setHistory((prev) => [...prev, screen]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language]
  );

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        mode,
        setMode,
        currentScreen,
        navigate,
        goBack,
        t,
        farmer,
        setFarmer,
        officer,
        setOfficer,
        selectedMandiId,
        setSelectedMandiId,
        lastBookingId,
        setLastBookingId,
        selectedBookingId,
        setSelectedBookingId,
        selectedProcurementId,
        setSelectedProcurementId,
        verifiedBookingId,
        setVerifiedBookingId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
