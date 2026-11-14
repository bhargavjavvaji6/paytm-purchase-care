import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Wrench, Layers } from 'lucide-react';

export default function StatsOverview({ stats, onSelectFilter }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {/* 1. Total Assets */}
      <div 
        onClick={() => onSelectFilter && onSelectFilter('All')}
        className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs hover:border-[#00b9f5] cursor-pointer transition group"
      >
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-semibold text-gray-500">Protected Assets</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#002970] group-hover:bg-[#002970] group-hover:text-white transition">
            <Layers size={16} />
          </div>
        </div>
        <div className="text-xl font-black text-gray-900">{stats.total_assets} <span className="text-xs font-normal text-gray-500">Items</span></div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
          <ShieldCheck size={12} /> 100% Invoices Verified
        </div>
      </div>

      {/* 2. Portfolio Value */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-semibold text-gray-500">Portfolio Value</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <span className="font-bold text-xs">₹</span>
          </div>
        </div>
        <div className="text-xl font-black text-gray-900">
          ₹{(stats.total_portfolio_value || 0).toLocaleString('en-IN')}
        </div>
        <div className="text-[11px] text-gray-500 font-medium mt-0.5">
          Insured & Managed
        </div>
      </div>

      {/* 3. Expiring Soon Alert */}
      <div 
        onClick={() => onSelectFilter && onSelectFilter('Expiring')}
        className={`p-3.5 rounded-xl border shadow-xs cursor-pointer transition ${
          stats.expiring_soon_count > 0
            ? 'bg-amber-50/60 border-amber-300 hover:bg-amber-100/50'
            : 'bg-white border-gray-200/80'
        }`}
      >
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-bold text-amber-900">Expiring Soon</span>
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 animate-pulse">
            <AlertCircle size={16} />
          </div>
        </div>
        <div className="text-xl font-black text-amber-900">
          {stats.expiring_soon_count} <span className="text-xs font-normal text-amber-700">&lt; 30 Days</span>
        </div>
        <div className="text-[11px] text-amber-800 font-bold mt-0.5">
          Action Recommended →
        </div>
      </div>

      {/* 4. Resale Value Locked */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-semibold text-gray-500">Resale Value</span>
          <div className="p-1.5 rounded-lg bg-cyan-50 text-[#002970]">
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="text-xl font-black text-[#002970]">
          ₹{(stats.total_resale_locked || 0).toLocaleString('en-IN')}
        </div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
          +15% Verified Logbook
        </div>
      </div>

      {/* 5. Active Service */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-semibold text-gray-500">Active Bookings</span>
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
            <Wrench size={16} />
          </div>
        </div>
        <div className="text-xl font-black text-gray-900">
          {stats.active_service_bookings} <span className="text-xs font-normal text-gray-500">Service</span>
        </div>
        <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
          Technician Assigned
        </div>
      </div>
    </div>
  );
}

