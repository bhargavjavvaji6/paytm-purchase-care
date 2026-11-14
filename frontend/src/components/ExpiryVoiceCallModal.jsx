import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import {
  PhoneCall,
  Volume2,
  CheckCircle,
  Sparkles,
  Lock,
  X,
  Laptop,
  ShoppingBag
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

  const device = useMemo(
    () =>
      targetDevice || {
        id: 'paytm-prod-004',
        product_name: 'HP Pavilion Gaming Laptop 16 (Ryzen 7, RTX 4060)',
        brand: 'HP',
        category: 'Laptops & PCs',
        days_remaining: 6,
        warranty_expiry: '2026-11-20',
        purchase_price: 86990
      },
    [targetDevice]
  );

  const isGrocery = (device.category || '').toLowerCase() === 'groceries';

  // 7 Supported Vernacular Languages
  const languagesList = [
    { code: 'hi-IN', label: 'हिन्दी', name: 'Hindi' },
    { code: 'en-IN', label: 'English', name: 'English' },
    { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
    { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
    { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
    { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' }
  ];

  const stopVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const speakWithBrowserFallback = useCallback((text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select voice matching language if available in browser
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) => v.lang === lang || v.lang.startsWith(lang.split('-')[0])
      );
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const generateAndPlayVoiceAlert = useCallback(
    async (langCode) => {
      setIsLoadingAudio(true);
      stopVoice();

      try {
        const res = await axios.post(`${API_BASE}/api/voice-agent/expiry-alert`, {
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

        // Web Speech synthesis fallback
        speakWithBrowserFallback(res.data.speech_text, langCode);
      } catch (err) {
        console.error('Error generating voice alert:', err);
        // High-fidelity vernacular fallbacks across all 7 languages
        const fallbackMsgs = {
          'te-IN': isGrocery
            ? `నమస్తే భార్గవ్! మీరు Paytm Zepto ద్వారా కొనుగోలు చేసిన కిరాణా మరియు పాల ఉత్పత్తుల కాలపరిమితి ${device.days_remaining || 4} రోజుల్లో ముగియనుంది. దయచేసి తాజాగా ఉన్నప్పుడే వినియోగించండి.`
            : `నమస్తే భార్గవ్! మీ ${device.product_name} వారంటీ ఇంకా ${device.days_remaining || 6} రోజుల్లో ముగియబోతోంది. భవిష్యత్తులో ఖరీదైన రిపేర్ల నుండి రక్షణ కోసం ₹899 కే Paytm Care Shield ఎక్స్‌టెండెడ్ వారంటీని వెంటనే రెన్యూ చేయండి.`,
          'ta-IN': isGrocery
            ? `வணக்கம் பார்கவ்! Paytm Zepto-வில் நீங்கள் வாங்கிய பால் மற்றும் மளிகைப் பொருட்களின் பயன்பாட்டு காலம் இன்னும் ${device.days_remaining || 4} நாட்களில் முடிவடைகிறது. தயவுசெய்து விரைவாக பயன்படுத்தவும்.`
            : `வணக்கம் பார்கவ்! உங்கள் ${device.product_name} உத்தரவாதம் இன்னும் ${device.days_remaining || 6} நாட்களில் முடிகிறது. பழுது செலவுகளைத் தவிர்க்க ₹899 செலுத்தி Paytm Care Shield உத்தரவாதத்தை இப்போதே புதுப்பிக்கவும்.`,
          'kn-IN': isGrocery
            ? `ನಮಸ್ಕಾರ ಭಾರ್ಗವ್! Paytm Zepto ಮೂಲಕ ಖರೀದಿಸಿದ ದಿನಸಿ ಮತ್ತು ಹಾಲಿನ ಉತ್ಪನ್ನಗಳ ಅವಧಿಯು ಇನ್ನು ${device.days_remaining || 4} ದಿನಗಳಲ್ಲಿ ಮುಕ್ತಾಯವಾಗಲಿದೆ. ತಾಜಾವಾಗಿರುವಾಗಲೇ ಬಳಸಿ.`
            : `ನಮಸ್ಕಾರ ಭಾರ್ಗವ್! ನಿಮ್ಮ ${device.product_name} ಸಾಧನದ ವಾರಂಟಿ ಇನ್ನು ${device.days_remaining || 6} ದಿನಗಳಲ್ಲಿ ಮುಕ್ತಾಯಗೊಳ್ಳಲಿದೆ. ದುಬಾರಿ ರಿಪೇರಿ ವೆಚ್ಚಗಳಿಂದ ರಕ್ಷಣೆ ಪಡೆಯಲು ₹899 ಪಾವತಿಸಿ Paytm Care Shield ವಾರಂಟಿ ನವೀಕರಿಸಿ.`,
          'ml-IN': isGrocery
            ? `നമസ്കാരം ഭാർഗവ്! Paytm Zepto വഴി വാങ്ങിയ പാൽ, പലചരക്ക് സാധനങ്ങളുടെ കാലാവധി ${device.days_remaining || 4} ദിവസത്തിനുള്ളിൽ അവസാനിക്കും. അവ ഫ്രഷായിരിക്കുമ്പോൾ തന്നെ ഉപയോഗിക്കുക.`
            : `നമസ്കാരം ഭാർഗവ്! നിങ്ങളുടെ ${device.product_name} ഉപകരണത്തിന്റെ വാറന്റി കാലാവധി ${device.days_remaining || 6} ദിവസത്തിനുള്ളിൽ അവസാനിക്കുകയാണ്. ഭാവിയിലെ വലിയ റിപ്പയർ ചെലവുകൾ ഒഴിവാക്കാൻ വെറും ₹899-ന് Paytm Care Shield വഴി വാറന്റി ഇപ്പോൾ തന്നെ പുതുക്കൂ.`,
          'bn-IN': isGrocery
            ? `নমস্কার ভার্গব! Paytm Zepto থেকে কেনা আপনার দুধ এবং মুদি পণ্যের মেয়াদের আর মাত্র ${device.days_remaining || 4} দিন বাকি। দয়া করে তাজা থাকতেই ব্যবহার করুন।`
            : `নমস্কার ভার্গব! আপনার ${device.product_name}-এর ওয়ারেন্টির মেয়াদ আর মাত্র ${device.days_remaining || 6} দিনে শেষ হবে। অপ্রত্যাশিত মেরামতের খরচ এড়াতে মাত্র ₹899 দিয়ে Paytm Care Shield ওয়ারেন্টি এখনই রিনিউ করুন।`,
          'hi-IN': isGrocery
            ? `नमस्ते भार्गव! आपके Zepto ग्रोसरी और डेयरी उत्पादों की ताजगी की अवधि ${device.days_remaining || 4} दिनों में समाप्त हो रही है। कृपया उत्पाद की ताजगी जांचें और समय पर उपभोग करें।`
            : `नमस्ते भार्गव! आपके ${device.product_name} की वारंटी ${device.days_remaining || 6} दिनों में समाप्त हो रही है। कृपया ₹899 में Paytm Care Shield एक्सटेंडेड वारंटी रिन्यू करने के लिए भुगतान करें, ताकि भविष्य में महंगे रिपेयर से बचा जा सके।`,
          'en-IN': isGrocery
            ? `Hello Bhargav! Your fresh groceries and dairy items purchased on Paytm Zepto are nearing their expiration date in ${device.days_remaining || 4} days. Please consume while fresh.`
            : `Hello Bhargav! Your ${device.product_name} warranty is expiring in ${device.days_remaining || 6} days. Please renew your payment for Paytm Care Shield extended coverage to prevent high repair costs.`
        };

        const msg = fallbackMsgs[langCode] || fallbackMsgs['en-IN'];
        setSpeechText(msg);
        speakWithBrowserFallback(msg, langCode);
      } finally {
        setIsLoadingAudio(false);
      }
    },
    [device, isGrocery, stopVoice, speakWithBrowserFallback]
  );

  // Trigger voice alert when modal opens or language changes
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      generateAndPlayVoiceAlert(language);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, language, generateAndPlayVoiceAlert]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    generateAndPlayVoiceAlert(newLang);
  };

  const handleClose = () => {
    stopVoice();
    setRenewalDone(false);
    onClose();
  };

  const handleRenewPayment = () => {
    setIsRenewing(true);
    setTimeout(() => {
      setIsRenewing(false);
      setRenewalDone(true);
      if (onRenewSuccess) {
        onRenewSuccess(device.id, 'Paytm Care Shield 1-Year');
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92dvh]">
        {/* Calling Header */}
        <div className="bg-gradient-to-r from-red-600 via-[#002970] to-[#0a358c] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20 animate-pulse">
              <PhoneCall size={20} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-red-500/80 text-white font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Urgent Lifecycle Advisory
                </span>
                <span className="text-[10px] bg-white/20 text-[#00b9f5] font-black px-1.5 py-0.5 rounded">
                  Sarvam AI Indus
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base mt-0.5">Paytm Automated AI Voice Call</h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Target Item Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              {isGrocery ? <ShoppingBag size={20} /> : <Laptop size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                {isGrocery ? 'Perishable Provisions' : 'Flagged Expiring Device'}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                {device.product_name}
              </h4>
              <p className="text-[11px] text-amber-700">
                {isGrocery
                  ? 'Perishable lifecycle window expires in 4 days'
                  : `Expires in ${device.days_remaining || 6} days (${device.warranty_expiry || '2026-11-20'})`}
              </p>
            </div>
          </div>

          {/* Sarvam AI Speech Transcript Box */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-slate-300">Live Voice Stream</span>
                {isLoadingAudio && (
                  <span className="text-[10px] text-amber-400 animate-pulse">(Connecting...)</span>
                )}
              </div>

              {/* Vernacular Language Selector (All 7 Indian Languages) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold transition whitespace-nowrap ${
                      language === l.code
                        ? 'bg-[#00b9f5] text-[#002970] shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={l.name}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Audio Wave Visualizer */}
            {isPlaying && (
              <div className="flex items-center justify-center gap-1 py-1">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#00b9f5] rounded-full animate-bounce"
                    style={{
                      height: `${12 + (i % 5) * 4}px`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm leading-relaxed text-slate-100 font-medium italic">
              &quot;{speechText || 'Generating Sarvam voice stream...'}&quot;
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Sarvam Bulbul Speech Engine • {languagesList.find((l) => l.code === language)?.name}</span>
              <button
                onClick={() => generateAndPlayVoiceAlert(language)}
                className="text-[#00b9f5] font-bold hover:underline flex items-center gap-1"
              >
                <Volume2 size={12} /> Replay
              </button>
            </div>
          </div>

          {/* One-Click Renewal Call-to-Action */}
          {!renewalDone ? (
            <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-[#002970] text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                    1-Tap Renewal
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-[#002970] mt-1">
                    Paytm Care Shield 1-Year Extension
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    Avoid ₹14,000+ repair costs for motherboard or display
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-gray-900">₹899</span>
                  <span className="text-[10px] text-gray-400 block line-through">₹2,499</span>
                </div>
              </div>

              <button
                onClick={handleRenewPayment}
                disabled={isRenewing}
                className="w-full py-3 bg-[#002970] hover:bg-[#071d49] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-950/20"
              >
                {isRenewing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment via Paytm Wallet / UPI...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay ₹899 & Activate Warranty Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                <CheckCircle size={22} />
              </div>
              <h4 className="font-black text-emerald-900 text-sm">
                Warranty Successfully Renewed!
              </h4>
              <p className="text-xs text-emerald-700">
                Coverage extended by +365 days. Your digital ledger and warranty badge have been refreshed.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-[#00b9f5]" />
            Paytm Proactive Customer Lifecycle Shield
          </span>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
