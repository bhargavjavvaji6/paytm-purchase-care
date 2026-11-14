import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Sparkles,
  Globe,
  Radio,
  CheckCircle,
  HelpCircle,
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

  // Initialize Web Speech Recognition if available
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
  }, [selectedLanguage]);

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

  // Play audio response using Sarvam audio or browser fallback
  const playSpeechAudio = (base64Audio, fallbackText) => {
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

    // Fallback: Browser Web Speech API
    fallbackSpeechSynthesis(fallbackText);
  };

  const fallbackSpeechSynthesis = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find((v) => v.lang.startsWith(selectedLanguage.split('-')[0]));
      if (matchVoice) utterance.voice = matchVoice;

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    // Add user message to conversation
    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setConversation((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/voice-agent', {
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

      // Perform actionable intent if target tab specified
      if (action_tab && action_tab !== 'dashboard' && setActiveTab) {
        // Option to navigate directly or show button
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[620px] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#002970] to-[#0a358c] text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00b9f5] text-[#002970] flex items-center justify-center shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">Paytm Indus Voice AI</h3>
                <span className="text-[10px] bg-white/20 text-[#00b9f5] font-black px-1.5 py-0.5 rounded">
                  Sarvam AI
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Vernacular Accessibility for Appliances & Warranty
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPlayingAudio && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs text-cyan-300">
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

        {/* Audio Visualizer Wave Bar (When speaking or listening) */}
        {(isListening || isPlayingAudio) && (
          <div className="bg-[#0b192e] px-4 py-2.5 flex items-center justify-center gap-1.5 border-b border-white/10">
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
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/60">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#002970] text-white rounded-br-none shadow-xs'
                    : 'bg-white text-gray-800 border border-gray-200/90 rounded-bl-none shadow-xs'
                }`}
              >
                <p className="font-medium whitespace-pre-line">{msg.text}</p>

                {/* Interactive Action Pill if returned by agent */}
                {msg.action_tab && (
                  <button
                    onClick={() => {
                      if (onClose) onClose();
                      if (setActiveTab) setActiveTab(msg.action_tab);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#002970] font-bold px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] transition"
                  >
                    <span>Open {msg.action_tab.toUpperCase()} Section</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2 bg-white rounded-xl border w-fit">
              <Sparkles size={14} className="text-[#00b9f5] animate-spin" />
              Indus is processing and synthesizing vernacular response...
            </div>
          )}
        </div>

        {/* Quick Voice Prompts */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Suggestions:
            </span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendQuery(p.query)}
                className="bg-gray-100 hover:bg-blue-50 hover:text-[#002970] text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-gray-200 whitespace-nowrap transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls */}
        <div className="p-3.5 bg-white border-t border-gray-200 flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition shadow-xs shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-blue-50 text-[#002970] hover:bg-blue-100 border border-blue-200'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak via Microphone'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            placeholder={
              selectedLanguage === 'hi-IN'
                ? 'यहाँ बोलें या टाइप करें (उदा. LG AC की वारंटी कब खत्म होगी?)...'
                : 'Speak or type here (e.g. Check my Samsung warranty)...'
            }
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:bg-white focus:border-[#00b9f5]"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim() || isProcessing}
            className="w-11 h-11 rounded-2xl bg-[#002970] hover:bg-[#081e4c] disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

