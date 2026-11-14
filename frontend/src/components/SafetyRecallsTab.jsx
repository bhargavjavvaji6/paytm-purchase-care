import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function SafetyRecallsTab({
  recalls = [],
  purchases = [],
  onExtendWarranty,
  onBookService
}) {
  const [claimedRecalls, setClaimedRecalls] = useState({});

  const handleClaim = (recallId) => {
    setClaimedRecalls((prev) => ({ ...prev, [recallId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-[#002970] to-[#00b9f5] rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 text-[#00b9f5] font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert size={15} /> Proactive Lifecycle Management
        </div>
        <h2 className="text-2xl font-black">Warranty Timeline & Manufacturer Safety Recalls</h2>
        <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
          Paytm continuously scans global manufacturer safety bulletins, CPSC advisories, and firmware updates.
          If your serial batch is flagged, we notify you immediately so you can claim free official replacements or software patches.
        </p>
      </div>

      {/* Recalls Grid */}
      <div>
        <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          Active Manufacturer Advisories & Bulletins ({recalls.length})
        </h3>

        <div className="space-y-4">
          {recalls.map((recall) => {
            const isClaimed = claimedRecalls[recall.id];

            return (
              <div
                key={recall.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs hover:border-gray-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        recall.severity === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : recall.severity === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-[#002970]'
                      }`}
                    >
                      {recall.severity} Advisory
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      Brand: <span className="text-gray-900 font-extrabold">{recall.brand}</span>
                    </span>
                    <span className="text-xs text-gray-400">• Published: {recall.date}</span>
                  </div>

                  <span className="text-xs font-mono text-gray-400 font-semibold">
                    Bulletin ID: {recall.id}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-gray-900">{recall.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {recall.description}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-500 text-[10px] uppercase block">
                      Target Models / Batches:
                    </span>
                    <span className="font-mono font-semibold text-gray-800">
                      {recall.affected_models || recall.product_pattern}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 text-[10px] uppercase block">
                      Official Remedy:
                    </span>
                    <span className="font-semibold text-emerald-700">
                      {recall.remedy}
                    </span>
                  </div>
                </div>

                {/* Claim Action */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span>Free brand authorized replacement covered under consumer safety laws.</span>
                  </div>

                  {isClaimed ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <CheckCircle size={14} /> Service Request Registered with Brand
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaim(recall.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      Claim Free Brand Remedy
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paytm Care Shield Extended Warranty Plans */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} /> Paytm Monetizable Protection Plans
            </div>
            <h3 className="text-lg font-black text-gray-900 mt-0.5">
              Paytm Care Shield & Extended Warranty Marketplace
            </h3>
            <p className="text-xs text-gray-500">
              Extend protection before your original factory warranty expires to save up to 60% on future repairs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Plan 1 */}
          <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#002970] text-[#00b9f5] text-[10px] font-extrabold px-2 py-0.5 rounded">
                POPULAR
              </span>
              <h4 className="font-bold text-sm text-[#002970]">1-Year Extended Warranty</h4>
              <p className="text-xs text-gray-600">
                100% coverage on internal component breakdowns, motherboards, and power supplies.
              </p>
              <div className="pt-2">
                <span className="text-2xl font-black text-gray-900">₹899</span>
                <span className="text-xs text-gray-400"> / year</span>
              </div>
            </div>
            <button
              onClick={() => onExtendWarranty(purchases[1] || purchases[0])}
              className="mt-4 w-full py-2 bg-[#002970] text-white text-xs font-bold rounded-xl hover:bg-[#071d49] transition"
            >
              Get Instant Quote
            </button>
          </div>

          {/* Plan 2 */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                BEST FOR APPLIANCES
              </span>
              <h4 className="font-bold text-sm text-emerald-900">Annual Maintenance Contract (AMC)</h4>
              <p className="text-xs text-gray-600">
                Includes 2 free deep jet services, refrigerant gas top-up, and priority emergency visits.
              </p>
              <div className="pt-2">
                <span className="text-2xl font-black text-gray-900">₹1,199</span>
                <span className="text-xs text-gray-400"> / year</span>
              </div>
            </div>
            <button
              onClick={() => onExtendWarranty(purchases[1] || purchases[0])}
              className="mt-4 w-full py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition"
            >
              Enroll in AMC
            </button>
          </div>

          {/* Plan 3 */}
          <div className="border border-purple-200 bg-purple-50/40 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                TOTAL DAMAGE COVER
              </span>
              <h4 className="font-bold text-sm text-purple-900">Screen & Liquid Protection</h4>
              <p className="text-xs text-gray-600">
                Covers accidental drops, shattered OLED displays, and liquid spill damage with zero hassle.
              </p>
              <div className="pt-2">
                <span className="text-2xl font-black text-gray-900">₹1,499</span>
                <span className="text-xs text-gray-400"> / year</span>
              </div>
            </div>
            <button
              onClick={() => onExtendWarranty(purchases[0])}
              className="mt-4 w-full py-2 bg-purple-700 text-white text-xs font-bold rounded-xl hover:bg-purple-800 transition"
            >
              Protect Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

