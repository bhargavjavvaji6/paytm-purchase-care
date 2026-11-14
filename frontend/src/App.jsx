import { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  Wrench,
  AlertTriangle,
  History,
  Mic,
  CreditCard,
  PhoneCall
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import PurchaseDashboard from './components/PurchaseDashboard';
import InvoiceScanner from './components/InvoiceScanner';
import ServiceBookingTab from './components/ServiceBookingTab';
import SafetyRecallsTab from './components/SafetyRecallsTab';
import DigitalLedgerTab from './components/DigitalLedgerTab';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import DeviceDetailModal from './components/DeviceDetailModal';
import WarrantyExtensionModal from './components/WarrantyExtensionModal';
import StrategicOverviewModal from './components/StrategicOverviewModal';
import PaymentSimulatorModal from './components/PaymentSimulatorModal';
import ExpiryVoiceCallModal from './components/ExpiryVoiceCallModal';
import FloatingRobotAssistant from './components/FloatingRobotAssistant';

import { DataService } from './services/dataService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recalls, setRecalls] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Language & Modals State
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSpeaking] = useState(false);
  const [viewingInvoiceDevice, setViewingInvoiceDevice] = useState(null);
  const [extendingWarrantyDevice, setExtendingWarrantyDevice] = useState(null);
  const [preselectedServiceDevice, setPreselectedServiceDevice] = useState(null);

  // New Modals for User Request
  const [isStrategicOverviewOpen, setIsStrategicOverviewOpen] = useState(false);
  const [isPaymentSimulatorOpen, setIsPaymentSimulatorOpen] = useState(false);
  const [isExpiryCallOpen, setIsExpiryCallOpen] = useState(false);
  const [expiryCallDevice, setExpiryCallDevice] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      const pData = await DataService.getPurchases();
      const sData = await DataService.getStats(pData);
      const cData = await DataService.getServiceCenters();
      const bData = await DataService.getServiceBookings();
      const rData = await DataService.getRecalls();
      const nData = await DataService.getNotifications();

      setPurchases(pData);
      setStats(sData);
      setServiceCenters(cData);
      setBookings(bData);
      setRecalls(rData);
      setNotifications(nData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadInitialData = async () => {
      try {
        const pData = await DataService.getPurchases();
        const sData = await DataService.getStats(pData);
        const cData = await DataService.getServiceCenters();
        const bData = await DataService.getServiceBookings();
        const rData = await DataService.getRecalls();
        const nData = await DataService.getNotifications();

        if (!ignore) {
          setPurchases(pData);
          setStats(sData);
          setServiceCenters(cData);
          setBookings(bData);
          setRecalls(rData);
          setNotifications(nData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDeviceAdded = () => {
    fetchAllData();
    setActiveTab('dashboard');
  };

  const handleBookServiceForDevice = (device) => {
    setPreselectedServiceDevice(device);
    setActiveTab('service');
  };

  const handleOpenLedgerForDevice = (device) => {
    setPreselectedServiceDevice(device);
    setActiveTab('ledger');
  };

  const handleWarrantyExtensionSuccess = (deviceId) => {
    setPurchases((prev) =>
      prev.map((p) =>
        p.id === deviceId
          ? {
              ...p,
              extended_warranty: true,
              warranty_status: 'Active',
              days_remaining: (p.days_remaining || 0) + 365
            }
          : p
      )
    );
    fetchAllData();
  };

  const handleTriggerExpiryVoiceCall = (device) => {
    setExpiryCallDevice(device);
    setIsExpiryCallOpen(true);
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Purchase Dashboard',
      shortLabel: 'Dashboard',
      subtitle: 'Warranty & Protection',
      icon: <ShieldCheck size={18} />
    },
    {
      id: 'scanner',
      label: 'AI Invoice Scanner',
      shortLabel: 'Scan Bill',
      subtitle: 'Instant Asset Onboarding',
      icon: <UploadCloud size={18} />,
      badge: 'AI Vision'
    },
    {
      id: 'service',
      label: 'Service Booking',
      shortLabel: 'Services',
      subtitle: 'Doorstep & Centers (O2O)',
      icon: <Wrench size={18} />
    },
    {
      id: 'recalls',
      label: 'Warranty & Recalls',
      shortLabel: 'Recalls',
      subtitle: 'Safety Bulletins & AMC',
      icon: <AlertTriangle size={18} />,
      badge: recalls.length ? `${recalls.length} Alerts` : null
    },
    {
      id: 'ledger',
      label: 'Digital Asset Ledger',
      shortLabel: 'Ledger',
      subtitle: 'Passport & Resale Value',
      icon: <History size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-gray-800 flex flex-col pb-16 lg:pb-0">
      {/* 1. Global Navbar */}
      <Navbar
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenStrategicOverview={() => setIsStrategicOverviewOpen(true)}
        onOpenPaymentSimulator={() => setIsPaymentSimulatorOpen(true)}
        onOpenExpiryVoiceCall={() => {
          const laptopDev = purchases.find(
            (p) => (p.category === 'Laptops & PCs' || p.product_name.includes('Laptop')) && p.warranty_status === 'Expiring Soon'
          ) || purchases[3] || purchases[0];
          handleTriggerExpiryVoiceCall(laptopDev);
        }}
        isSpeaking={isSpeaking}
        notifications={notifications}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
        {/* Top Stats Overview */}
        <StatsOverview
          stats={stats}
          onSelectFilter={() => setActiveTab('dashboard')}
        />

        {/* Mobile / Tablet Horizontal Navigation Tabs */}
        <div className="lg:hidden mb-4 bg-white rounded-2xl border border-gray-200/80 p-1.5 shadow-xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  activeTab === item.id
                    ? 'bg-[#002970] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.shortLabel}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#00b9f5] text-[#002970] font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Quick Action Buttons Bar */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-100 mt-1">
            <button
              onClick={() => setIsPaymentSimulatorOpen(true)}
              className="bg-blue-50 text-[#002970] hover:bg-blue-100 p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center text-center transition"
            >
              <CreditCard size={15} className="text-[#00b9f5] mb-0.5" />
              <span>Simulate Pay</span>
            </button>
            <button
              onClick={() => {
                const laptopDev = purchases.find(
                  (p) => (p.category === 'Laptops & PCs' || p.product_name.includes('Laptop')) && p.warranty_status === 'Expiring Soon'
                ) || purchases[3] || purchases[0];
                handleTriggerExpiryVoiceCall(laptopDev);
              }}
              className="bg-amber-50 text-amber-900 hover:bg-amber-100 p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center text-center transition"
            >
              <PhoneCall size={15} className="text-amber-600 mb-0.5" />
              <span>Expiry Call</span>
            </button>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-[#002970] text-white p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center text-center transition"
            >
              <Mic size={15} className="text-[#00b9f5] mb-0.5" />
              <span>Indus AI Voice</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Navigation + Tab Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Desktop Navigation Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-xs sticky top-20">
              <div className="px-3 py-2 text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Lifecycle Navigation</span>
                <span
                  onClick={() => setIsStrategicOverviewOpen(true)}
                  className="text-[10px] text-[#00b9f5] cursor-pointer hover:underline font-bold"
                >
                  Blueprint ℹ
                </span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition text-left ${
                      activeTab === item.id
                        ? 'bg-[#002970] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-blue-50/60 hover:text-[#002970]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          activeTab === item.id ? 'text-[#00b9f5]' : 'text-gray-400'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div
                          className={`text-[10px] font-normal ${
                            activeTab === item.id ? 'text-blue-200' : 'text-gray-400'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeTab === item.id
                            ? 'bg-[#00b9f5] text-[#002970]'
                            : 'bg-blue-100 text-[#002970]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Action Buttons in Sidebar */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {/* 1. Simulate Paytm Payment */}
                <button
                  onClick={() => setIsPaymentSimulatorOpen(true)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-[#002970] p-3 rounded-xl border border-blue-200 shadow-xs transition flex items-center gap-2.5 text-left text-xs font-bold"
                >
                  <CreditCard size={17} className="text-[#00b9f5] shrink-0" />
                  <div>
                    <span className="block leading-tight">Simulate Purchase</span>
                    <span className="text-[10px] text-gray-500 font-normal">Soundbox Pay & Bill Prompt</span>
                  </div>
                </button>

                {/* 2. Automated AI Voice Expiry Alert Call */}
                <button
                  onClick={() => {
                    const laptopDev = purchases.find(
                      (p) => (p.category === 'Laptops & PCs' || p.product_name.includes('Laptop')) && p.warranty_status === 'Expiring Soon'
                    ) || purchases[3] || purchases[0];
                    handleTriggerExpiryVoiceCall(laptopDev);
                  }}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 p-3 rounded-xl border border-amber-200 shadow-xs transition flex items-center gap-2.5 text-left text-xs font-bold"
                >
                  <PhoneCall size={17} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="block leading-tight">Laptop Expiry Call</span>
                    <span className="text-[10px] text-amber-700 font-normal">Hear Sarvam Voice AI</span>
                  </div>
                </button>

                {/* 3. Vernacular Voice Assistant */}
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="w-full bg-gradient-to-r from-[#002970] to-[#0d3b8e] hover:to-[#002970] text-white p-3 rounded-xl shadow-xs transition flex items-center gap-2.5 text-left text-xs font-bold group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#00b9f5] text-[#002970] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <Mic size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#00b9f5] uppercase tracking-wider block font-bold">
                      Sarvam AI Indus
                    </span>
                    <span className="text-xs font-extrabold text-white block">
                      Voice Support (हिन्दी)
                    </span>
                  </div>
                </button>
              </div>

              {/* Paytm Care Assurance Badge */}
              <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Paytm Care Assurance</span>
                </div>
                <p className="text-[10px] text-emerald-700 leading-snug">
                  100% Genuine brand parts, verified digital bills & guaranteed resale quotations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <PurchaseDashboard
                purchases={purchases}
                onBookService={handleBookServiceForDevice}
                onOpenLedger={handleOpenLedgerForDevice}
                onExtendWarranty={(device) => setExtendingWarrantyDevice(device)}
                onOpenScanner={() => setActiveTab('scanner')}
                onViewInvoice={(device) => setViewingInvoiceDevice(device)}
                onOpenPaymentSimulator={() => setIsPaymentSimulatorOpen(true)}
                onOpenStrategicOverview={() => setIsStrategicOverviewOpen(true)}
                onTriggerExpiryVoiceCall={handleTriggerExpiryVoiceCall}
                onDeleteDevice={fetchAllData}
              />
            )}

            {activeTab === 'scanner' && (
              <InvoiceScanner
                onDeviceAdded={handleDeviceAdded}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'service' && (
              <ServiceBookingTab
                purchases={purchases}
                serviceCenters={serviceCenters}
                bookings={bookings}
                preselectedDevice={preselectedServiceDevice}
                onBookingCreated={fetchAllData}
              />
            )}

            {activeTab === 'recalls' && (
              <SafetyRecallsTab
                recalls={recalls}
                purchases={purchases}
                onExtendWarranty={(device) => setExtendingWarrantyDevice(device)}
              />
            )}

            {activeTab === 'ledger' && (
              <DigitalLedgerTab
                purchases={purchases}
                preselectedDevice={preselectedServiceDevice}
                onDeviceUpdated={fetchAllData}
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Footer */}
      <footer className="bg-[#0b192e] text-gray-400 py-6 text-xs border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-base">Paytm</span>
            <span className="text-[#00b9f5] font-bold text-sm">Purchase Care Hub</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-[11px]">Lifelong Product Lifecycle & Resale Ecosystem</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Sarvam AI (Indus)</span>
            <span>•</span>
            <span>Paytm Care Shield</span>
            <span>•</span>
            <span>Cashify Resale Partner</span>
          </div>
        </div>
      </footer>

      {/* 4. Global Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setActiveTab={setActiveTab}
        onSelectPreselectedDevice={handleBookServiceForDevice}
      />

      <DeviceDetailModal
        device={viewingInvoiceDevice}
        isOpen={!!viewingInvoiceDevice}
        onClose={() => setViewingInvoiceDevice(null)}
      />

      <WarrantyExtensionModal
        device={extendingWarrantyDevice}
        isOpen={!!extendingWarrantyDevice}
        onClose={() => setExtendingWarrantyDevice(null)}
        onSuccess={handleWarrantyExtensionSuccess}
      />

      <StrategicOverviewModal
        isOpen={isStrategicOverviewOpen}
        onClose={() => setIsStrategicOverviewOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <PaymentSimulatorModal
        isOpen={isPaymentSimulatorOpen}
        onClose={() => setIsPaymentSimulatorOpen(false)}
        onPaymentSuccessAndOpenScanner={() => {
          setActiveTab('scanner');
        }}
        onDeviceRegistered={fetchAllData}
      />

      <ExpiryVoiceCallModal
        isOpen={isExpiryCallOpen}
        onClose={() => setIsExpiryCallOpen(false)}
        targetDevice={expiryCallDevice}
        onRenewSuccess={handleWarrantyExtensionSuccess}
      />

      {/* Floating Animated Robot Assistant on bottom-right corner */}
      <FloatingRobotAssistant
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        onOpenPaymentSimulator={() => setIsPaymentSimulatorOpen(true)}
        onOpenExpiryCall={() => setIsExpiryCallOpen(true)}
        onNavigateToScan={() => setActiveTab('scanner')}
      />
    </div>
  );
}

export default App;
