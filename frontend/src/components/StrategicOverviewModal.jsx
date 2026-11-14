import {
  ShieldCheck,
  X,
  Target,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function StrategicOverviewModal({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const priorities = [
    { num: 1, title: 'Purchase Dashboard', desc: 'Central timeline tracking, days countdown & active protection monitoring.', tab: 'dashboard' },
    { num: 2, AI: true, title: 'AI Invoice Scanning', desc: 'Bridge offline-online gap; auto-extract product model, serial & warranty months.', tab: 'scanner' },
    { num: 3, title: 'Warranty & Recall Notifications', desc: 'Proactive expiry notifications & safety recalls with 0-cost manufacturer remedies.', tab: 'recalls' },
    { num: 4, title: 'Service-Centre Booking', desc: 'Monetizable O2O network with authorized brand centers & doorstep technicians.', tab: 'service' },
    { num: 5, title: 'Repair & Resale History', desc: 'Digital asset logbook proving maintenance, boosting resale trade-in value by +15%.', tab: 'ledger' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92dvh] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] via-[#092562] to-[#00b9f5] text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 text-[#00b9f5] flex items-center justify-center border border-white/20 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#00b9f5] uppercase block">
                Official Strategic Vision
              </span>
              <h3 className="font-black text-lg sm:text-xl">Paytm Purchase Care Hub</h3>
              <p className="text-[11px] sm:text-xs text-blue-100 mt-0.5">
                Strategic shift from pure transactional commerce to lifelong product management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {/* Strategic Overview Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Category */}
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Category
              </span>
              <h4 className="font-black text-xs text-[#002970] leading-snug">
                Post-purchase customer experience
              </h4>
            </div>

            {/* Target users */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Target size={11} /> Target Users
              </span>
              <p className="font-semibold text-xs text-emerald-950 leading-snug">
                Every Paytm customer purchasing electronics, appliances and other eligible products.
              </p>
            </div>

            {/* Business opportunity */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100">
              <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Briefcase size={11} /> Business Opportunity
              </span>
              <p className="font-semibold text-xs text-purple-950 leading-snug">
                Service-booking partnerships, merchant partnerships and value-added services.
              </p>
            </div>
          </div>

          {/* Implementation Priority */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
                <Layers size={16} className="text-[#002970]" />
                Implementation Priority (1 to 5):
              </h4>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> 100% Fully Built & Functional
              </span>
            </div>

            <div className="space-y-2.5">
              {priorities.map((p) => (
                <div
                  key={p.num}
                  onClick={() => {
                    onClose();
                    onNavigate(p.tab);
                  }}
                  className="bg-gray-50/80 hover:bg-blue-50/70 border border-gray-200/80 hover:border-[#00b9f5] rounded-2xl p-3.5 transition flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#002970] text-[#00b9f5] font-black text-xs flex items-center justify-center shrink-0">
                      {p.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-[#002970] transition">
                          {p.title}
                        </span>
                        {p.AI && (
                          <span className="text-[9px] bg-[#00b9f5] text-[#002970] font-black px-1.5 py-0.2 rounded">
                            AI VISION
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{p.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#002970] font-bold text-xs group-hover:translate-x-1 transition shrink-0 ml-2">
                    <span className="text-[10px] hidden sm:inline text-gray-400">Open</span>
                    <ArrowRight size={14} className="text-[#00b9f5]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-500 text-[11px]">
            Paytm Ecosystem Stickiness: 3-5 Year Recurring Customer Engagement
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#002970] hover:bg-[#071d49] text-white font-bold rounded-xl shadow-xs transition"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

