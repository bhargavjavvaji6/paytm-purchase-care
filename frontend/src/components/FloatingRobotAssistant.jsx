import { useState, useEffect } from 'react';
import {
  Mic,
  UploadCloud,
  PhoneCall,
  CreditCard,
  X,
  MessageSquare,
  HelpCircle,
  PhoneForwarded
} from 'lucide-react';

export default function FloatingRobotAssistant({
  onOpenVoiceAssistant,
  onOpenPaymentSimulator,
  onOpenExpiryCall,
  onNavigateToScan,
  onOpenCustomerCare
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState('Hi! Tap me for 24x7 Care (0120-4440440) & Voice AI');
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // Rotating companion suggestions
  useEffect(() => {
    const tips = [
      '📞 24x7 Helpline: Connect Call to 0120-4440440',
      '💬 Chat with Paytm Customer Care Specialist Live',
      '❓ Ask a question about your appliance warranty',
      '🧾 Snap any invoice to auto-detect model & warranty',
      '🎙️ Try Voice AI in Telugu, Tamil, Hindi & 4 more!',
      '⚡ 1 Laptop warranty expiring in 6 days. Renew now?',
      '🥛 Zepto milk & groceries tracked for freshness!'
    ];

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % tips.length;
      setSpeechBubbleText(tips[idx]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* Speech Bubble */}
      {isBubbleVisible && !isMenuOpen && (
        <div className="mb-2 max-w-[220px] sm:max-w-[260px] bg-white text-gray-900 border-2 border-[#002970]/15 rounded-2xl p-2.5 sm:p-3 shadow-xl text-[11px] sm:text-xs font-semibold animate-bounce-subtle relative transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBubbleVisible(false);
            }}
            className="absolute -top-1.5 -right-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-4 h-4 flex items-center justify-center text-[9px]"
            title="Dismiss"
          >
            ×
          </button>
          <div className="flex items-start gap-2">
            <span className="text-sm shrink-0">✨</span>
            <p className="leading-snug text-gray-800">{speechBubbleText}</p>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#002970]/15 transform rotate-45" />
        </div>
      )}

      {/* Expanded Quick Action Menu */}
      {isMenuOpen && (
        <div className="mb-3 w-72 bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl shadow-2xl p-3 text-xs space-y-2 animate-scale-up border-t-4 border-t-[#00b9f5]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-extrabold text-[#002970] text-xs">Paytm AI Care Companion</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {/* 1. Connect Paytm Customer Care Call */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenCustomerCare) onOpenCustomerCare('call');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#0d3b8e] hover:from-[#081e4f] hover:to-[#092b6a] text-white font-bold flex items-center gap-2.5 transition-all shadow-xs group border border-white/10"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#002970] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                <PhoneCall size={16} className="text-[#002970]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-white leading-tight">Paytm Customer Care Call</span>
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">24x7</span>
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">📞 0120-4440440 (Toll Free)</div>
              </div>
            </button>

            {/* 2. Chat with Customer Care Option */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenCustomerCare) onOpenCustomerCare('chat');
              }}
              className="w-full text-left p-2 rounded-xl bg-sky-50/80 hover:bg-sky-100/90 text-[#002970] font-bold flex items-center gap-2.5 transition-all shadow-xs group border border-sky-200/60"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00b9f5] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">Chat with Customer Care</div>
                <div className="text-[9px] text-sky-700">Live Agent Helpdesk & Claims</div>
              </div>
            </button>

            {/* 3. Ask a Question to Care Team */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenCustomerCare) onOpenCustomerCare('ask');
              }}
              className="w-full text-left p-2 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 text-purple-900 font-bold flex items-center gap-2.5 transition-all shadow-xs group border border-purple-200/60"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HelpCircle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">Ask a Question to Support</div>
                <div className="text-[9px] text-purple-700">Warranties, Repairs, Zepto Refunds</div>
              </div>
            </button>

            <div className="border-t border-gray-100 my-1 pt-1" />

            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenVoiceAssistant) onOpenVoiceAssistant();
              }}
              className="w-full text-left p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-[#002970] font-bold flex items-center gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#002970] text-[#00b9f5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mic size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">Vernacular AI Voice Chat</div>
                <div className="text-[9px] text-gray-500">7 Regional Indian Languages</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenExpiryCall) onOpenExpiryCall();
              }}
              className="w-full text-left p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-bold flex items-center gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PhoneForwarded size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">Laptop Expiry Voice Call</div>
                <div className="text-[9px] text-amber-700">Simulate Sarvam AI Voice Call</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onNavigateToScan) onNavigateToScan();
              }}
              className="w-full text-left p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 font-bold flex items-center gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <UploadCloud size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">AI Invoice Scanner</div>
                <div className="text-[9px] text-emerald-700">Scan Bill / Zepto / Appliances</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenPaymentSimulator) onOpenPaymentSimulator();
              }}
              className="w-full text-left p-2 rounded-xl bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 font-bold flex items-center gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00b9f5] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-900 leading-tight">Paytm Payment Simulator</div>
                <div className="text-[9px] text-sky-700">Sent Successfully + Auto Bill</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Animated Robot Bot Button */}
      <button
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsBubbleVisible(false);
        }}
        className="relative group p-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
        aria-label="Open AI Assistant"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00b9f5]/40 to-purple-600/40 blur-md group-hover:blur-lg transition-all" />

        {/* Outer Ring */}
        <div className="relative w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center">
          {/* Animated Pixel-Style Robot matching reference image */}
          <div className="w-full h-full animate-robot-bob drop-shadow-xl hover:scale-110 transition-transform duration-200">
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
            >
              <defs>
                {/* Eye Glow Filter */}
                <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Head / Helmet Outline */}
              <ellipse cx="50" cy="40" rx="32" ry="28" fill="#0d1117" />
              <ellipse cx="50" cy="40" rx="30" ry="26" fill="#f0eff7" stroke="#251a3b" strokeWidth="2.5" />

              {/* Helmet Crest / Top Segment */}
              <path
                d="M38 16 C42 12, 58 12, 62 16 L60 22 C55 20, 45 20, 40 22 Z"
                fill="#ffffff"
                stroke="#251a3b"
                strokeWidth="2"
              />
              <path d="M46 22 L54 22 L53 26 L47 26 Z" fill="#b9b3d9" stroke="#251a3b" strokeWidth="1.5" />

              {/* Left Headphone / Earcup */}
              <rect x="14" y="32" width="10" height="20" rx="4" fill="#f0eff7" stroke="#251a3b" strokeWidth="2" />
              <circle cx="19" cy="42" r="5" fill="#00b9f5" filter="url(#cyanGlow)" />
              <circle cx="19" cy="42" r="2.5" fill="#ffffff" />

              {/* Right Headphone / Earcup */}
              <rect x="76" y="32" width="10" height="20" rx="4" fill="#f0eff7" stroke="#251a3b" strokeWidth="2" />
              <circle cx="81" cy="42" r="5" fill="#00b9f5" filter="url(#cyanGlow)" />
              <circle cx="81" cy="42" r="2.5" fill="#ffffff" />

              {/* Dark Visor Screen */}
              <rect
                x="28"
                y="26"
                width="44"
                height="28"
                rx="14"
                fill="#130924"
                stroke="#251a3b"
                strokeWidth="2"
              />

              {/* Glowing Purple Robot Eyes (Blinking Animation in CSS) */}
              <g className="animate-robot-blink">
                <rect
                  x="38"
                  y="35"
                  width="7"
                  height="12"
                  rx="3.5"
                  fill="#c084fc"
                  filter="url(#purpleGlow)"
                />
                <rect x="39.5" y="37" width="4" height="4" rx="2" fill="#ffffff" />

                <rect
                  x="55"
                  y="35"
                  width="7"
                  height="12"
                  rx="3.5"
                  fill="#c084fc"
                  filter="url(#purpleGlow)"
                />
                <rect x="56.5" y="37" width="4" height="4" rx="2" fill="#ffffff" />
              </g>

              {/* Cyan / Blue Scarf around neck */}
              <path
                d="M30 60 C38 56, 62 56, 70 60 C66 68, 34 68, 30 60 Z"
                fill="#38bdf8"
                stroke="#1e3a8a"
                strokeWidth="2"
              />
              <path d="M48 64 C52 64, 56 68, 54 74 C50 72, 48 68, 48 64 Z" fill="#0284c7" />

              {/* Robot Body */}
              <path
                d="M34 68 L66 68 L68 90 L32 90 Z"
                fill="#312255"
                stroke="#170e2b"
                strokeWidth="2.5"
              />

              {/* Center Belly White Armor Plate */}
              <ellipse cx="50" cy="78" rx="12" ry="8" fill="#f0eff7" stroke="#251a3b" strokeWidth="1.5" />

              {/* Left Arm & Hand */}
              <path d="M32 70 L24 82 L28 86 L36 74 Z" fill="#f0eff7" stroke="#251a3b" strokeWidth="1.8" />
              <circle cx="26" cy="85" r="5" fill="#312255" stroke="#170e2b" strokeWidth="1.8" />

              {/* Right Arm & Hand */}
              <path d="M68 70 L76 82 L72 86 L64 74 Z" fill="#f0eff7" stroke="#251a3b" strokeWidth="1.8" />
              <circle cx="74" cy="85" r="5" fill="#312255" stroke="#170e2b" strokeWidth="1.8" />

              {/* Left Leg & Boot */}
              <rect x="36" y="88" width="9" height="12" fill="#312255" stroke="#170e2b" strokeWidth="1.5" />
              <rect x="33" y="98" width="13" height="7" rx="3" fill="#f0eff7" stroke="#251a3b" strokeWidth="2" />

              {/* Right Leg & Boot */}
              <rect x="55" y="88" width="9" height="12" fill="#312255" stroke="#170e2b" strokeWidth="1.5" />
              <rect x="54" y="98" width="13" height="7" rx="3" fill="#f0eff7" stroke="#251a3b" strokeWidth="2" />
            </svg>
          </div>

          {/* Active status beacon */}
          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>
      </button>
    </div>
  );
}
