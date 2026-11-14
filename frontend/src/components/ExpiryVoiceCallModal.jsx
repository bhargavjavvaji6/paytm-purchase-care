import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Lock,
  Globe,
  RefreshCw,
  X,
  Laptop,
  ShoppingBag,
  Wind
} from 'lucide-react';

export default function ExpiryVoiceCallModal({
  isOpen,
  onClose,
  targetDevice,
  onRenewSuccess
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalDone, setRenewalDone] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef(null);

  const device = targetDevice || {
    id: 'paytm-prod-004',
    product_name: 'HP Pavilion Gaming Laptop 16 (Ryzen 7, RTX 4060)',
    brand: 'HP',
    category: 'Laptops & PCs',
    days_remaining: 6,
    warranty_expiry: '2026-11-20',
    purchase_price: 86990
  };

  const isGrocery = (device.category || '').toLowerCase() === 'groceries';

  // Fetch or trigger voice speech when modal opens
  useEffect(() => {
    if (isOpen) {
      setRenewalDone(false);
      generateAndPlayVoiceAlert(language);
    } else {
      stopVoice();
    }
  }, [isOpen, language]);

  const generateAndPlayVoiceAlert = async (langCode) => {
    setIsLoadingAudio(true);
    stopVoice();

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/voice-agent/expiry-alert', {
        product_name: device.product_name,
        target_language: langCode,
        category: device.category || 'laptops',
        days_left: device.days_remaining || 6
      });

      setSpeechText(res.data.speech_text);

      if (res.data.audio_base64) {
        try {
          const audio = new Audio(`data:audio/wav;base64,${res.data.audio_base64}`);
          audioRef.current = audio;
          setIsPlaying(true);
          audio.play();
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            speakWithBrowserFallback(res.data.speech_text, langCode);
          };
          return;
        } catch (e) {
          console.warn('Sarvam audio playback error:', e);
        }
      }

      // Fallback
      speakWithBrowserFallback(res.data.speech_text, langCode);
    } catch (err) {
      console.error('Error generating voice alert:', err);
      // Hardcoded high-fidelity fallback text
      const fallbackMsg =
        langCode === 'hi-IN'
          ? `नमस्ते Bhargav! आपके ${device.product_name} की वारंटी ${device.days_remaining || 6} दिनों में समाप्त हो रही है। कृपया ₹899 में Paytm Care Shield एक्सटेंडेड वारंटी रिन्यू करने के लिए भुगतान करें।`
          : `Hello Bhargav! Your ${device.product_name} warranty is expiring in ${device.days_remaining || 6} days. Please renew your warranty payment with Paytm Care Shield.`;
      setSpeechText(fallbackMsg);
      speakWithBrowserFallback(fallbackMsg, langCode);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const speakWithBrowserFallback = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleRenewPayment = () => {
    setIsRenewing(true);
    setTimeout(() => {
      setIsRenewing(false);
      setRenewalDone(true);
      stopVoice();
      if (onRenewSuccess) onRenewSuccess(device.id, '1-Year Paytm Care Shield');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Call Status Header */}
        <div className="bg-gradient-to-r from-[#002970] via-[#092257] to-[#00b9f5] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md animate-pulse">
              <PhoneCall size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider block">
                Automated AI Voice Advisory
              </span>
              <h3 className="font-black text-sm">Paytm Care Indus Agent</h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopVoice();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Call Visualizer Area */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow-lg mx-auto flex items-center justify-center overflow-hidden">
              {isGrocery ? (
                <ShoppingBag size={36} className="text-[#002970]" />
              ) : (
                <Laptop size={36} className="text-[#002970]" />
              )}
            </div>

            {isPlaying && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm animate-bounce">
                <Volume2 size={14} />
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {isGrocery ? 'Freshness Alert' : 'Warranty Expiring Soon'}
            </span>
            <h4 className="font-black text-base text-gray-900 mt-2">
              {device.product_name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {isGrocery
                ? `Best before: ${device.warranty_expiry} (2 Days remaining)`
                : `Factory warranty ends: ${device.warranty_expiry} (${device.days_remaining || 6} Days remaining)`}
            </p>
          </div>

          {/* Spoken Text Transcript & Audio Visualizer */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-[#002970] font-black text-[11px]">
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-[#00b9f5]" />
                Spoken Voice Advisory (Sarvam AI Indus)
              </span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setLanguage('hi-IN')}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    language === 'hi-IN' ? 'bg-[#002970] text-white' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage('en-IN')}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    language === 'en-IN' ? 'bg-[#002970] text-white' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <p className="text-gray-800 font-medium leading-relaxed italic bg-white/70 p-3 rounded-xl border border-blue-100">
              "{speechText}"
            </p>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center justify-center gap-1 pt-1 h-6">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-[#00b9f5] rounded-full transition-all ${
                    isPlaying ? 'wave-bar' : 'h-1.5 opacity-30'
                  }`}
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    animationDuration: `${0.5 + (i % 3) * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Action Section */}
          {renewalDone ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle size={28} className="text-emerald-600 mx-auto" />
              <h5 className="font-black text-sm text-emerald-900">
                Coverage Renewed Successfully!
              </h5>
              <p className="text-xs text-emerald-700">
                1-Year Extended Warranty has been added to your Paytm Care Hub ledger.
              </p>
            </div>
          ) : !isGrocery ? (
            <div className="space-y-2 pt-1">
              <button
                onClick={handleRenewPayment}
                disabled={isRenewing}
                className="w-full py-3 bg-[#002970] hover:bg-[#071d49] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
              >
                <Lock size={14} className="text-[#00b9f5]" />
                {isRenewing ? 'Processing Renewal with Paytm UPI...' : 'Renew Warranty Now (Pay ₹899 via Paytm)'}
              </button>

              <button
                onClick={() => {
                  stopVoice();
                  onClose();
                }}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
              >
                Remind Me Later
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  stopVoice();
                  onClose();
                }}
                className="w-full py-2.5 bg-[#002970] text-white font-bold rounded-xl text-xs hover:bg-[#081e4c]"
              >
                Got It, Thank You
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

