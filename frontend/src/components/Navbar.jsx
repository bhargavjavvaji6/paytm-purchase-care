import React, { useState } from 'react';
import {
  ShieldCheck,
  Mic,
  Bell,
  User,
  Globe,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Search,
  CreditCard,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  onOpenVoice,
  onOpenStrategicOverview,
  onOpenPaymentSimulator,
  onOpenExpiryVoiceCall,
  isSpeaking,
  notifications = [],
  selectedLanguage,
  setSelectedLanguage,
  setActiveTab
}) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const languages = [
    { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
    { code: 'en-IN', label: 'English (India)' },
    { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
    { code: 'te-IN', label: 'తెలుగు (Telugu)' },
    { code: 'bn-IN', label: 'বাংলা (Bengali)' },
    { code: 'mr-IN', label: 'मराठी (Marathi)' },
    { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  const unreadCount = notifications.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (
      searchVal.toLowerCase().includes('payment') ||
      searchVal.toLowerCase().includes('purchase') ||
      searchVal.toLowerCase().includes('care') ||
      searchVal.toLowerCase().includes('strategy')
    ) {
      onOpenStrategicOverview();
    } else {
      onOpenStrategicOverview();
    }
  };

  return (
    <header className="bg-[#002970] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <div className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <span className="text-2xl font-black tracking-tight text-white">Paytm</span>
              <span className="text-xl font-bold text-[#00b9f5] ml-1.5">Care Hub</span>
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-[#00b9f5] flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#00b9f5]" />
                Post-Purchase Lifecycle Ecosystem
              </span>
              <span className="text-[10px] text-gray-300">Electronics, Appliances & Groceries</span>
            </div>
          </div>

          {/* Search Bar (Triggers Strategic Overview on 'payment purchase') */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search 'payment purchase', 'warranty', 'service'..."
              className="w-full pl-9 pr-24 py-1.5 text-xs bg-white/10 text-white placeholder-gray-300 rounded-xl border border-white/20 focus:outline-none focus:bg-white focus:text-gray-900 transition"
            />
            <button
              type="button"
              onClick={onOpenStrategicOverview}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#00b9f5] text-[#002970] font-black text-[10px] px-2 py-0.5 rounded-md hover:bg-cyan-400 transition"
            >
              Overview
            </button>
          </form>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 1. Simulate Paytm Payment Button */}
            <button
              onClick={onOpenPaymentSimulator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold text-white transition shadow-xs"
              title="Simulate Online or Offline Soundbox Purchase"
            >
              <CreditCard size={14} className="text-[#00b9f5]" />
              <span>Simulate Pay</span>
            </button>

            {/* 2. Automated AI Voice Expiry Call Trigger */}
            <button
              onClick={onOpenExpiryVoiceCall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs animate-pulse"
              title="Simulate Proactive AI Voice Call for Expiring Laptop / Groceries"
            >
              <PhoneCall size={14} />
              <span className="hidden sm:inline">Expiry Voice Call</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-xs font-medium bg-white/10 hover:bg-white/15 px-2 py-1.5 rounded-lg border border-white/10 transition"
              >
                <Globe size={14} className="text-[#00b9f5]" />
                <span className="hidden lg:inline">
                  {languages.find(l => l.code === selectedLanguage)?.label.split(' ')[0] || 'हिन्दी'}
                </span>
                <ChevronDown size={12} />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs font-medium">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Sarvam AI Vernacular
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                        selectedLanguage === lang.code ? 'text-[#002970] font-bold bg-blue-50/70' : 'text-gray-700'
                      }`}
                    >
                      {lang.label}
                      {selectedLanguage === lang.code && <CheckCircle size={14} className="text-[#00b9f5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/15 transition border border-white/10 text-white"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-3 z-50">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-bold text-sm text-[#002970] flex items-center gap-1.5">
                      <Bell size={15} className="text-[#00b9f5]" />
                      Care Alerts & Recall Bulletins
                    </span>
                    <span className="text-[11px] bg-blue-100 text-[#002970] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} Active
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          notif.severity === 'critical' || notif.severity === 'warning'
                            ? 'bg-amber-50/60 border-amber-200 hover:bg-amber-50'
                            : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50'
                        }`}
                        onClick={() => {
                          setShowNotifMenu(false);
                          setActiveTab('recalls');
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-[#00b9f5] font-bold mt-1 inline-block">
                              {notif.action_label} →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Talk to Indus AI Voice Agent Button */}
            <button
              onClick={onOpenVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all ${
                isSpeaking
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-400/40'
                  : 'bg-[#00b9f5] hover:bg-[#00a8e0] text-[#002970] ring-2 ring-white/30'
              }`}
            >
              <Mic size={15} />
              <span>Talk to Indus AI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
