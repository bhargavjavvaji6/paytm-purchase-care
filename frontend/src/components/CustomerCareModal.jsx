import { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  MessageSquare,
  HelpCircle,
  X,
  Send,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  UserCheck,
  Sparkles,
  PhoneForwarded
} from 'lucide-react';

export default function CustomerCareModal({
  isOpen,
  onClose,
  initialTab = 'call', // 'call' | 'chat' | 'ask'
  purchases = [],
  onNavigateToTab
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveSubTab(initialTab);
  }

  const [copiedPhone, setCopiedPhone] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      name: 'Pooja Sharma',
      role: 'Paytm Care Specialist (Senior)',
      text: 'Namaste! Welcome to Paytm 24x7 Customer Care Helpdesk. How can I assist you with your purchases, warranty claims, or service bookings today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedDeviceForQuery, setSelectedDeviceForQuery] = useState(purchases[0]?.id || '');
  const [isTyping, setIsTyping] = useState(false);
  const [ticketId] = useState('PTM-CARE-829410');

  // Ask Question State
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionCategory, setQuestionCategory] = useState('Warranty & Care Shield');
  const [submittedQuestion, setSubmittedQuestion] = useState(null);

  const chatEndRef = useRef(null);
  const msgCounterRef = useRef(100);

  useEffect(() => {
    if (activeSubTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeSubTab]);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('0120-4440440');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSendChatMessage = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    msgCounterRef.current += 1;
    const userMsg = {
      id: msgCounterRef.current,
      sender: 'user',
      text: text,
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Contextual simulated response
    setTimeout(() => {
      let replyText = 'Thank you for your query. Our Care Team is actively reviewing your record.';
      const lower = text.toLowerCase();

      if (lower.includes('call') || lower.includes('phone') || lower.includes('number')) {
        replyText = 'You can reach our 24x7 customer support directly on 0120-4440440 anytime for instant phone assistance.';
      } else if (lower.includes('warranty') || lower.includes('shield') || lower.includes('expiry')) {
        replyText = 'Under Paytm Care Shield, your device gets 100% cashless repairs at authorized service centers even after factory warranty ends. Would you like me to renew it for ₹899?';
      } else if (lower.includes('repair') || lower.includes('service') || lower.includes('technician')) {
        replyText = 'You can schedule an authorized doorstep technician directly from the Service Booking tab. Inspection starts at just ₹149 with genuine parts guarantee.';
      } else if (lower.includes('zepto') || lower.includes('milk') || lower.includes('grocery') || lower.includes('spoil') || lower.includes('fresh')) {
        replyText = 'For Zepto grocery orders, if any dairy or perishable item is spoiled within 48 hours of delivery, you are eligible for an instant 100% refund into your Paytm Wallet.';
      } else if (lower.includes('invoice') || lower.includes('bill')) {
        replyText = 'All verified tax invoices scanned via AI are permanently archived in your Paytm Care Hub digital ledger and can be downloaded anytime for GST filing.';
      } else {
        replyText = `Understood. I have logged ticket #${ticketId} regarding this query. An authorized specialist has been assigned to assist you with priority resolution.`;
      }

      msgCounterRef.current += 1;
      setChatMessages((prev) => [
        ...prev,
        {
          id: msgCounterRef.current,
          sender: 'agent',
          name: 'Pooja Sharma',
          role: 'Paytm Care Specialist',
          text: replyText,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleAskQuestionSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    msgCounterRef.current += 1;
    const currentDevice = purchases.find((p) => p.id === selectedDeviceForQuery);
    setSubmittedQuestion({
      id: `QUE-82${msgCounterRef.current}`,
      question: customQuestion,
      category: questionCategory,
      device: currentDevice ? currentDevice.product_name : 'General Account / Hub',
      status: 'Answered by Senior Specialist',
      answer: `Thank you for asking! For ${questionCategory}, Paytm Care Hub provides end-to-end assistance. You can also connect directly with our toll-free customer care helpline at 0120-4440440 (24x7) for immediate live resolution.`
    });
    setCustomQuestion('');
  };

  const faqPrompts = [
    'How do I claim Paytm Care Shield warranty?',
    'When will my doorstep technician arrive?',
    'How to claim 100% refund for spoiled Zepto groceries?',
    'Where can I download my warranty invoice copy?',
    'Can I talk to a human customer care executive right now?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-blue-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] via-[#082054] to-[#00b9f5] p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#00b9f5] border border-white/15">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight">Paytm 24x7 Customer Care</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Now
                </span>
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Helpline: <span className="font-bold text-white font-mono">0120-4440440</span> • Post-Purchase Care & Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('call')}
            className={`pb-2.5 px-3 rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeSubTab === 'call'
                ? 'border-[#002970] text-[#002970] bg-white shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <PhoneCall size={14} className={activeSubTab === 'call' ? 'text-amber-500' : ''} />
            <span>Connect Call (0120-4440440)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`pb-2.5 px-3 rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeSubTab === 'chat'
                ? 'border-[#002970] text-[#002970] bg-white shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <MessageSquare size={14} className={activeSubTab === 'chat' ? 'text-[#00b9f5]' : ''} />
            <span>Chat with Customer Care</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ask')}
            className={`pb-2.5 px-3 rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeSubTab === 'ask'
                ? 'border-[#002970] text-[#002970] bg-white shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <HelpCircle size={14} className={activeSubTab === 'ask' ? 'text-purple-600' : ''} />
            <span>Ask a Question</span>
          </button>
        </div>

        {/* Tab 1: Connect Helpline Call */}
        {activeSubTab === 'call' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 border-2 border-[#002970]/15 rounded-2xl p-5 sm:p-6 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#002970] text-[#00b9f5] flex items-center justify-center mx-auto mb-3 shadow-md animate-bounce-subtle">
                <PhoneCall size={30} />
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#002970] bg-blue-100 px-2.5 py-1 rounded-full">
                Official Paytm 24x7 Care Helpline
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-mono mt-3">
                0120-4440440
              </h3>

              <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                Connect directly with our dedicated customer care executives for warranty disputes, authorized service center escalations, Zepto freshness refunds, or merchant bill verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
                <a
                  href="tel:01204440440"
                  className="w-full sm:w-auto px-6 py-3 bg-[#002970] hover:bg-[#061e4f] text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
                >
                  <PhoneForwarded size={16} className="text-[#00b9f5] group-hover:scale-110 transition-transform" />
                  <span>Call 0120-4440440 Now</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {copiedPhone ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedPhone ? 'Copied to Clipboard!' : 'Copy Number'}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200/70 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-emerald-600" /> 24x7 Available
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck size={13} className="text-[#002970]" /> Verified Executives
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[#00b9f5]" /> Toll-Free Pan-India
                </span>
              </div>
            </div>

            {/* Support Topics */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                What Can Customer Care Help With?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <div>
                    <strong className="text-gray-900 block font-bold">Warranty Claims</strong>
                    <span className="text-gray-500 text-[11px]">Paytm Care Shield and OEM warranty claims.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-start gap-2">
                  <span className="text-[#00b9f5] font-bold">✓</span>
                  <div>
                    <strong className="text-gray-900 block font-bold">Technician Scheduling</strong>
                    <span className="text-gray-500 text-[11px]">Track and expedite authorized repair visits.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <div>
                    <strong className="text-gray-900 block font-bold">Zepto Grocery Refunds</strong>
                    <span className="text-gray-500 text-[11px]">Instant reimbursement for spoiled dairy/groceries.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <div>
                    <strong className="text-gray-900 block font-bold">Digital Invoice Archival</strong>
                    <span className="text-gray-500 text-[11px]">Retrieve official tax invoices for GST claims.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Chat with Customer Care Specialist */}
        {activeSubTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-[380px] max-h-[500px] overflow-hidden">
            {/* Agent Bar */}
            <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#002970] text-white flex items-center justify-center font-bold text-xs">
                  PS
                </div>
                <div>
                  <div className="font-extrabold text-[#002970] flex items-center gap-1.5">
                    Pooja Sharma
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                      Verified Specialist
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">Ticket: <span className="font-mono font-bold text-gray-700">{ticketId}</span></div>
                </div>
              </div>

              {/* Call Hotline Shortcut */}
              <a
                href="tel:01204440440"
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-blue-200 text-[#002970] font-bold text-[11px] rounded-lg flex items-center gap-1 transition shadow-2xs"
                title="Switch to Phone Call"
              >
                <PhoneCall size={12} className="text-amber-500" />
                <span>0120-4440440</span>
              </a>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#002970] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                    }`}
                  >
                    {m.sender === 'agent' && (
                      <div className="text-[10px] font-bold text-[#00b9f5] mb-1 flex items-center gap-1">
                        <Sparkles size={11} /> {m.name} ({m.role})
                      </div>
                    )}
                    <p>{m.text}</p>
                    <span
                      className={`text-[9px] mt-1 block text-right ${
                        m.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-gray-400 text-xs italic bg-white p-2 rounded-xl border border-gray-200 self-start w-32 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span>Agent typing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Quick Queries:</span>
              {faqPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(prompt)}
                  className="text-[11px] whitespace-nowrap bg-blue-50/70 hover:bg-blue-100/70 text-[#002970] font-semibold px-2.5 py-1 rounded-lg border border-blue-100 transition shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type your message to customer care specialist..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#00b9f5] focus:bg-white"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={!chatInput.trim()}
                className="p-2 bg-[#002970] hover:bg-[#061e4f] disabled:opacity-40 text-white rounded-xl transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Ask a Question */}
        {activeSubTab === 'ask' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm mb-1">
                <HelpCircle size={16} className="text-purple-600" />
                Ask Any Question to Paytm Care Team
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">
                Have a doubt about warranties, technician arrivals, Zepto orders, or invoice scanning? Ask below for verified priority answers.
              </p>
            </div>

            <form onSubmit={handleAskQuestionSubmit} className="space-y-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Which Product / Service is this regarding?
                </label>
                <select
                  value={selectedDeviceForQuery}
                  onChange={(e) => setSelectedDeviceForQuery(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 border border-gray-200 rounded-xl p-2 bg-gray-50 focus:bg-white outline-none"
                >
                  <option value="">General Purchase Care Hub Account</option>
                  {purchases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} ({p.brand}) - {p.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 border border-gray-200 rounded-xl p-2 bg-gray-50 focus:bg-white outline-none"
                >
                  <option value="Warranty & Care Shield">Warranty & Care Shield Extension</option>
                  <option value="Service Center & Technician">Service Center & Doorstep Technician</option>
                  <option value="Zepto & Grocery Freshness">Zepto & Grocery Freshness Refund</option>
                  <option value="Invoice & GST Verification">Invoice & GST Verification</option>
                  <option value="Resale Ledger & Upgrade">Resale Ledger & Upgrade Bonus</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Your Question
                </label>
                <textarea
                  rows={3}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g. How do I get an authorized service center technician visit booked for my LG AC before the warranty expires?"
                  className="w-full text-xs text-gray-900 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!customQuestion.trim()}
                className="w-full py-2.5 bg-[#002970] hover:bg-[#061e4f] disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Submit Question to Care Specialist</span>
              </button>
            </form>

            {/* Submitted Question Resolution Card */}
            {submittedQuestion && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2 animate-scale-up">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                    Query {submittedQuestion.id} Answered
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{submittedQuestion.device}</span>
                </div>
                <h4 className="text-xs font-black text-emerald-950">"{submittedQuestion.question}"</h4>
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold text-emerald-950 block mb-0.5">Paytm Care Specialist Resolution:</span>
                  {submittedQuestion.answer}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="tel:01204440440"
                    className="px-3 py-1.5 bg-[#002970] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs"
                  >
                    <PhoneCall size={12} /> Call 0120-4440440
                  </a>
                  <button
                    onClick={() => setActiveSubTab('chat')}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs"
                  >
                    <MessageSquare size={12} /> Open Live Chat
                  </button>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab('services')}
                      className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-[#002970] text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs hover:bg-blue-100"
                    >
                      Book Service
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 text-gray-600 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            24x7 Helpline: <strong className="text-[#002970] font-mono">0120-4440440</strong>
          </span>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
