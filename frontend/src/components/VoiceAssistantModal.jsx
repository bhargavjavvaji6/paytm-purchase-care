import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  selectedLanguage,
  setSelectedLanguage,
  setActiveTab,
  onSelectPreselectedDevice
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'assistant',
      text:
        selectedLanguage === 'hi-IN'
          ? 'नमस्ते! मैं Paytm Purchase Care का Indus AI सहायक हूँ। आप मुझसे किसी भी उपकरण की वारंटी स्थिति, डोरस्टेप रिपेयर बुकिंग, या रीसेल वैल्यू के बारे में पूछ सकते हैं।'
          : 'Hello! I am your Indus AI Assistant for Paytm Purchase Care Hub. Ask me about device warranty, repair booking, or resale value in Hindi or English.',
      timestamp: 'Just now'
    }
  ]);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const samplePrompts = [
    { label: 'Check LG AC Warranty', query: 'मेरी LG AC की वारंटी कब खत्म होगी?' },
    { label: 'Book Repair Service', query: 'Book authorized repair for my AC' },
    { label: 'Check S24 Resale Value', query: 'Samsung फोन की रीसेल वैल्यू क्या है?' },
    { label: 'Active Safety Recalls', query: 'Are there any active recalls on my devices?' }
  ];

  const fallbackSpeechSynthesis = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find((v) => v.lang.startsWith(selectedLanguage.split('-')[0]));
      if (matchVoice) utterance.voice = matchVoice;

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedLanguage]);

  const playSpeechAudio = useCallback((base64Audio, fallbackText) => {
    if (base64Audio) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audioRef.current = audio;
        setIsPlayingAudio(true);
        audio.play();
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          fallbackSpeechSynthesis(fallbackText);
        };
        return;
      } catch (e) {
        console.warn('Sarvam audio playback error:', e);
      }
    }

    fallbackSpeechSynthesis(fallbackText);
  }, [fallbackSpeechSynthesis]);

  const handleSendQuery = useCallback(async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setConversation((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await axios.post(`${API_BASE}/api/voice-agent`, {
        text: textToSend,
        target_language: selectedLanguage
      });

      const { reply_text, audio_base64, action_tab, target_device } = res.data;

      const assistantMsg = {
        sender: 'assistant',
        text: reply_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action_tab: action_tab,
        target_device: target_device
      };

      setConversation((prev) => [...prev, assistantMsg]);
      playSpeechAudio(audio_base64, reply_text);

      if (action_tab && action_tab !== 'dashboard' && setActiveTab) {
        if (target_device && onSelectPreselectedDevice) {
          onSelectPreselectedDevice(target_device);
        }
      }
    } catch (err) {
      console.error('Voice agent API error:', err);
      const errorMsg = {
        sender: 'assistant',
        text:
          selectedLanguage === 'hi-IN'
            ? 'क्षमा करें, कनेक्शन में त्रुटि हुई। कृपया दोबारा प्रयास करें।'
            : 'Sorry, could not process request right now. Please try again.',
        timestamp: 'Just now'
      };
      setConversation((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, selectedLanguage, setActiveTab, onSelectPreselectedDevice, playSpeechAudio]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendQuery(transcript);
      };
      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage, handleSendQuery]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[90dvh] max-h-[620px] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#002970] to-[#0a358c] text-white p-3.5 sm:p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#00b9f5] text-[#002970] flex items-center justify-center shadow-md shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base">Paytm Indus Voice AI</h3>
                <span className="text-[10px] bg-white/20 text-[#00b9f5] font-black px-1.5 py-0.5 rounded">
                  Sarvam AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-blue-200">
                Vernacular Accessibility for Appliances & Warranty
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {setSelectedLanguage && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/10 text-white text-[11px] rounded-lg px-2 py-1 outline-none border border-white/20"
              >
                <option value="hi-IN" className="text-gray-900">हिन्दी</option>
                <option value="en-IN" className="text-gray-900">English</option>
                <option value="te-IN" className="text-gray-900">తెలుగు</option>
                <option value="ta-IN" className="text-gray-900">தமிழ்</option>
              </select>
            )}

            {isPlayingAudio && (
              <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs text-cyan-300">
                <Volume2 size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold">Speaking...</span>
              </div>
            )}
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Audio Visualizer Wave Bar */}
        {(isListening || isPlayingAudio) && (
          <div className="bg-[#0b192e] px-4 py-2 flex items-center justify-center gap-1.5 border-b border-white/10">
            <span className="text-[11px] font-bold text-[#00b9f5] mr-2">
              {isListening ? 'Listening to your voice...' : 'Indus Voice Playing'}
            </span>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#00b9f5] rounded-full wave-bar"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${0.6 + (i % 3) * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Conversation Message List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-gray-50/60">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#002970] text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                {msg.action_tab && (
                  <button
                    onClick={() => {
                      if (setActiveTab) setActiveTab(msg.action_tab);
                      onClose();
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-[#00b9f5] hover:bg-[#009fd4] text-[#002970] font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition"
                  >
                    <span>Open {msg.action_tab === 'service' ? 'Service Booking' : msg.action_tab}</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-gray-400 italic p-2 bg-white rounded-xl border border-gray-100 w-fit">
              <Sparkles size={14} className="text-[#00b9f5] animate-spin" />
              <span>Indus AI processing your voice query...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="p-2 sm:p-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(p.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-blue-50/70 hover:bg-blue-100 text-[#002970] rounded-lg text-[10px] font-semibold transition border border-blue-100/80"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition flex items-center justify-center shrink-0 shadow-xs ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-50 text-[#002970] hover:bg-[#002970] hover:text-white'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            placeholder={
              selectedLanguage === 'hi-IN'
                ? 'माइक दबाएं या टाइप करें (उदा: मेरी AC रिपेयर बुक करें)...'
                : 'Tap mic or type query (e.g. check warranty or book repair)...'
            }
            className="flex-1 bg-gray-100/80 border border-gray-200 rounded-2xl px-4 py-2.5 text-base sm:text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00b9f5] focus:bg-white transition"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-[#002970] hover:bg-[#092257] disabled:opacity-40 text-white transition flex items-center justify-center shrink-0 shadow-xs"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
