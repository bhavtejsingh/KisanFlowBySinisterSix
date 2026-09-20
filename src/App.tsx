import { AppProvider, useApp } from '@/context/AppContext';
import { LanguageScreen } from '@/screens/farmer/LanguageScreen';
import { ModeSelectScreen } from '@/screens/farmer/ModeSelectScreen';
import { FarmerLoginScreen } from '@/screens/farmer/FarmerLoginScreen';
import { FarmerDashboardScreen } from '@/screens/farmer/FarmerDashboardScreen';
import { VoiceAssistantScreen } from '@/screens/farmer/VoiceAssistantScreen';
import { VerificationScreen } from '@/screens/farmer/VerificationScreen';
import { FindMandisScreen } from '@/screens/farmer/FindMandisScreen';
import { SlotBookingScreen } from '@/screens/farmer/SlotBookingScreen';
import { BookingConfirmationScreen } from '@/screens/farmer/BookingConfirmationScreen';
import { QueueTrackingScreen } from '@/screens/farmer/QueueTrackingScreen';
import { PaymentTrackingScreen } from '@/screens/farmer/PaymentTrackingScreen';
import { MyBookingsScreen } from '@/screens/farmer/MyBookingsScreen';
import { OfficerLoginScreen } from '@/screens/officer/OfficerLoginScreen';
import { OfficerDashboardScreen } from '@/screens/officer/OfficerDashboardScreen';
import { LiveQueueScreen } from '@/screens/officer/LiveQueueScreen';
import { QRVerificationScreen } from '@/screens/officer/QRVerificationScreen';
import { ProcurementEntryScreen } from '@/screens/officer/ProcurementEntryScreen';
import { ProcurementApprovalScreen } from '@/screens/officer/ProcurementApprovalScreen';
import { PaymentProcessingScreen } from '@/screens/officer/PaymentProcessingScreen';
import { AnalyticsScreen } from '@/screens/officer/AnalyticsScreen';
import { HelpCenterScreen } from '@/screens/farmer/HelpCenterScreen';
import { WeatherAdvisoryScreen } from '@/screens/farmer/WeatherAdvisoryScreen';

function ScreenRouter() {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'language':
      return <LanguageScreen />;
    case 'modeSelect':
      return <ModeSelectScreen />;
    case 'farmerLogin':
      return <FarmerLoginScreen />;
    case 'farmerDashboard':
      return <FarmerDashboardScreen />;
    case 'voiceAssistant':
      return <VoiceAssistantScreen />;
    case 'verification':
      return <VerificationScreen />;
    case 'findMandis':
      return <FindMandisScreen />;
    case 'slotBooking':
      return <SlotBookingScreen />;
    case 'bookingConfirmation':
      return <BookingConfirmationScreen />;
    case 'queueTracking':
      return <QueueTrackingScreen />;
    case 'paymentTracking':
      return <PaymentTrackingScreen />;
    case 'myBookings':
      return <MyBookingsScreen />;
    case 'officerLogin':
      return <OfficerLoginScreen />;
    case 'officerDashboard':
      return <OfficerDashboardScreen />;
    case 'liveQueue':
      return <LiveQueueScreen />;
    case 'qrVerification':
      return <QRVerificationScreen />;
    case 'procurementEntry':
      return <ProcurementEntryScreen />;
    case 'procurementApproval':
      return <ProcurementApprovalScreen />;
    case 'paymentProcessing':
      return <PaymentProcessingScreen />;
    case 'analytics':
      return <AnalyticsScreen />;
    case 'helpCenter':
      return <HelpCenterScreen />;
    case 'weatherAdvisory':
      return <WeatherAdvisoryScreen />;
    default:
      return <LanguageScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
