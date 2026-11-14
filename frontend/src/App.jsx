import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  UploadCloud,
  Wrench,
  AlertTriangle,
  History,
  Mic,
  CreditCard,
  PhoneCall,
  Sparkles,
  Layers,
  ShoppingBag
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

const API_BASE = 'http://127.0.0.1:8000';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viewingInvoiceDevice, setViewingInvoiceDevice] = useState(null);
  const [extendingWarrantyDevice, setExtendingWarrantyDevice] = useState(null);
  const [preselectedServiceDevice, setPreselectedServiceDevice] = useState(null);

  // New Modals for User Request
  const [isStrategicOverviewOpen, setIsStrategicOverviewOpen] = useState(false);
  const [isPaymentSimulatorOpen, setIsPaymentSimulatorOpen] = useState(false);
  const [isExpiryCallOpen, setIsExpiryCallOpen] = useState(false);
  const [expiryCallDevice, setExpiryCallDevice] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [purchasesRes, statsRes, centersRes, bookingsRes, recallsRes, notifsRes] =
        await Promise.all([
          axios.get(`${API_BASE}/api/purchases`),
          axios.get(`${API_BASE}/api/dashboard/stats`),
          axios.get(`${API_BASE}/api/service-centers`),
          axios.get(`${API_BASE}/api/service-bookings`),
          axios.get(`${API_BASE}/api/recalls`),
          axios.get(`${API_BASE}/api/notifications`)
        ]);

      setPurchases(purchasesRes.data);
      setStats(statsRes.data);
      setServiceCenters(centersRes.data);
      setBookings(bookingsRes.data);
      setRecalls(recallsRes.data);
      setNotifications(notifsRes.data);
    } catch (err) {
      console.error('Failed to load data from API:', err);
    }
  };

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

  const handleWarrantyExtensionSuccess = (deviceId, planName) => {
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
      subtitle: 'Warranty & Protection',
      icon: <ShieldCheck size={18} />
    },
    {
      id: 'scanner',
      label: 'AI Invoice Scanner',
      subtitle: 'Instant Asset Onboarding',
      icon: <UploadCloud size={18} />,
      badge: 'AI Vision'
    },
    {
      id: 'service',
      label: 'Service Booking',
      subtitle: 'Doorstep & Centers (O2O)',
      icon: <Wrench size={18} />
    },
    {
      id: 'recalls',
      label: 'Warranty & Recalls',
      subtitle: 'Safety Bulletins & AMC',
      icon: <AlertTriangle size={18} />,
      badge: recalls.length ? `${recalls.length} Alerts` : null
    },
    {
      id: 'ledger',
      label: 'Digital Asset Ledger',
      subtitle: 'Passport & Resale Value',
      icon: <History size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-gray-800 flex flex-col">
      {/* 1. Global Navbar */}
      <Navbar
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenStrategicOverview={() => setIsStrategicOverviewOpen(true)}
        onOpenPaymentSimulator={() => setIsPaymentSimulatorOpen(true)}
        onOpenExpiryVoiceCall={() => {
          // Defaults to HP Laptop if none selected
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Top Stats Overview */}
        <StatsOverview
          stats={stats}
          onSelectFilter={() => setActiveTab('dashboard')}
        />

        {/* Layout Grid: Sidebar Navigation + Tab Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
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
                onSelectDevice={(device) => setViewingInvoiceDevice(device)}
                onBookService={handleBookServiceForDevice}
                onOpenLedger={handleOpenLedgerForDevice}
                onExtendWarranty={(device) => setExtendingWarrantyDevice(device)}
                onOpenScanner={() => setActiveTab('scanner')}
                onViewInvoice={(device) => setViewingInvoiceDevice(device)}
                onOpenPaymentSimulator={() => setIsPaymentSimulatorOpen(true)}
                onOpenStrategicOverview={() => setIsStrategicOverviewOpen(true)}
                onTriggerExpiryVoiceCall={handleTriggerExpiryVoiceCall}
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
                onBookService={handleBookServiceForDevice}
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
        onPaymentSuccessAndOpenScanner={(device) => {
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
    </div>
  );
}

export default App;
