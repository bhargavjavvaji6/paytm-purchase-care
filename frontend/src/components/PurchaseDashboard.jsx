import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  FileText,
  Wrench,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Sparkles,
  Smartphone,
  Tv,
  Laptop,
  Wind,
  Headphones,
  Calendar,
  CreditCard,
  ShoppingBag,
  PhoneCall
} from 'lucide-react';

export default function PurchaseDashboard({
  purchases = [],
  onSelectDevice,
  onBookService,
  onOpenLedger,
  onExtendWarranty,
  onOpenScanner,
  onViewInvoice,
  onOpenPaymentSimulator,
  onOpenStrategicOverview,
  onTriggerExpiryVoiceCall
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All Items' },
    { id: 'Laptops & PCs', label: 'Laptops & PCs', icon: <Laptop size={14} /> },
    { id: 'Smartphones', label: 'Smartphones', icon: <Smartphone size={14} /> },
    { id: 'Home Appliances', label: 'Appliances', icon: <Wind size={14} /> },
    { id: 'Groceries', label: 'Groceries', icon: <ShoppingBag size={14} /> },
    { id: 'TV & Entertainment', label: 'TV & Gaming', icon: <Tv size={14} /> },
    { id: 'Audio & Wearables', label: 'Audio', icon: <Headphones size={14} /> },
  ];

  // Filter purchases
  const filtered = purchases.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.product_name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.merchant_name.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // Find expiring items
  const expiringLaptop = purchases.find(
    (p) => (p.category === 'Laptops & PCs' || p.product_name.toLowerCase().includes('laptop')) && p.warranty_status === 'Expiring Soon'
  );
  const expiringAppliance = purchases.find(
    (p) => (p.category === 'Home Appliances' || p.category === 'Smartphones') && p.warranty_status === 'Expiring Soon'
  );

  return (
    <div className="space-y-6">
      {/* 1. Official Strategic Vision Banner (Clickable) */}
      <div 
        onClick={onOpenStrategicOverview}
        className="bg-gradient-to-r from-[#002970] via-[#082054] to-[#00b9f5] rounded-2xl p-4 text-white shadow-xs cursor-pointer hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-[#00b9f5] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#00b9f5] text-[#002970] font-black px-2 py-0.5 rounded uppercase">
                Paytm Strategic Blueprint
              </span>
              <span className="text-xs text-blue-200">Category: Post-purchase customer experience</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">
              5 Core Priorities: Purchase Dashboard • AI Invoice Scanner • Warranty & Recalls • O2O Service • Resale Ledger
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenStrategicOverview();
          }}
          className="px-3.5 py-1.5 bg-white text-[#002970] hover:bg-gray-100 font-bold text-xs rounded-xl transition shadow-xs whitespace-nowrap"
        >
          View 5 Priorities →
        </button>
      </div>

      {/* 2. Proactive Lifecycle Alert Banner: Laptop Expiry (with Voice Call trigger) */}
      {expiringLaptop && (
        <div className="bg-gradient-to-r from-red-500/10 via-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Urgent Proactive Advisory
                </span>
                <span className="text-xs font-semibold text-amber-800">
                  Laptop Warranty Expires in {expiringLaptop.days_remaining || 6} Days!
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mt-1">
                {expiringLaptop.product_name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Factory coverage ends on <span className="font-semibold text-gray-800">{expiringLaptop.warranty_expiry}</span>. Listen to the automated Sarvam voice advisory or renew with Paytm Care Shield for ₹899.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onTriggerExpiryVoiceCall(expiringLaptop)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={14} />
              Hear AI Voice Call
            </button>
            <button
              onClick={() => onExtendWarranty(expiringLaptop)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#002970] hover:bg-[#0b1e4f] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-[#00b9f5]" />
              Renew Warranty (₹899)
            </button>
          </div>
        </div>
      )}

      {/* 3. Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#002970] text-white shadow-xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search model, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00b9f5] focus:bg-white transition"
            />
          </div>

          <button
            onClick={onOpenPaymentSimulator}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#002970] text-xs font-bold rounded-xl transition border border-blue-200 whitespace-nowrap"
            title="Simulate In-Store or Online Paytm Purchase"
          >
            <CreditCard size={14} className="text-[#00b9f5]" />
            <span>Simulate Pay</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#00b9f5] hover:bg-[#00a8e0] text-[#002970] text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap"
          >
            <PlusCircle size={15} />
            <span>Scan Bill</span>
          </button>
        </div>
      </div>

      {/* 4. Protected Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isGrocery = (item.category || '').toLowerCase() === 'groceries';
          const totalDays = item.warranty_months * 30 || 5;
          const daysLeft = Math.max(0, item.days_remaining || 0);
          const percentRemaining = Math.min(100, Math.max(0, Math.round((daysLeft / totalDays) * 100)));

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Header & Product Image */}
              <div>
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category & Care Shield Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    {item.extended_warranty && (
                      <span className="bg-[#002970] text-[#00b9f5] text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck size={11} /> Care Shield
                      </span>
                    )}
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3">
                    {item.warranty_status === 'Active' && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <ShieldCheck size={11} /> Active
                      </span>
                    )}
                    {item.warranty_status === 'Expiring Soon' && (
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
                        <Clock size={11} /> {item.days_remaining} Days Left
                      </span>
                    )}
                    {item.warranty_status === 'Expired' && (
                      <span className="bg-gray-700 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Product Title on overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-semibold text-[#00b9f5]">{item.brand}</p>
                    <h4 className="font-bold text-sm leading-snug line-clamp-1 drop-shadow-sm">
                      {item.product_name}
                    </h4>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-4 space-y-3">
                  {/* Merchant & Purchase metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                    <span className="truncate max-w-[170px]" title={item.merchant_name}>
                      📍 {item.merchant_name}
                    </span>
                    <span className="font-medium text-gray-700">
                      ₹{item.purchase_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Timeline Gauge */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        {isGrocery ? 'Purchased:' : 'Purchased:'} {item.purchase_date}
                      </span>
                      <span className="font-bold text-gray-800">
                        {isGrocery ? 'Best Before:' : 'Expires:'} {item.warranty_expiry}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.warranty_status === 'Expired'
                            ? 'bg-gray-400'
                            : item.warranty_status === 'Expiring Soon'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.warranty_status === 'Expired' ? 100 : Math.max(12, percentRemaining)}%` }}
                      />
                    </div>
                  </div>

                  {/* Valuation / Freshness Bar */}
                  <div className="bg-blue-50/60 rounded-xl p-2.5 flex items-center justify-between border border-blue-100/60">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        {isGrocery ? 'Perishable Status' : 'Current Resale Est.'}
                      </span>
                      <p className="text-sm font-black text-[#002970]">
                        {isGrocery ? 'Fresh Guarantee' : `₹${(item.current_resale_value || 0).toLocaleString('en-IN')}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {isGrocery ? 'Zepto 10-Min' : `Grade ${item.condition_grade || 'A Good'}`}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {isGrocery ? '3 Days Shelf Life' : `${item.repair_history?.length || 0} Service Logs`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-3 bg-gray-50/70 border-t border-gray-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewInvoice(item)}
                  className="px-2.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <FileText size={13} className="text-gray-500" />
                  View Bill
                </button>

                {isGrocery ? (
                  <button
                    onClick={() => onTriggerExpiryVoiceCall(item)}
                    className="px-2.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <PhoneCall size={13} />
                    Freshness Alert
                  </button>
                ) : (
                  <button
                    onClick={() => onBookService(item)}
                    className="px-2.5 py-2 text-xs font-bold text-white bg-[#002970] hover:bg-[#0a2050] rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Wrench size={13} className="text-[#00b9f5]" />
                    Book Repair
                  </button>
                )}

                {!isGrocery ? (
                  <>
                    <button
                      onClick={() => onOpenLedger(item)}
                      className="col-span-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#002970] hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <TrendingUp size={12} className="text-[#00b9f5]" />
                      Resale Logbook
                    </button>

                    <button
                      onClick={() => onExtendWarranty(item)}
                      className="col-span-1 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <ShieldCheck size={12} />
                      AMC / Shield
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onTriggerExpiryVoiceCall(item)}
                    className="col-span-2 px-2.5 py-1.5 text-[11px] font-bold text-[#002970] hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <Sparkles size={12} className="text-[#00b9f5]" />
                    AI Expiry Voice Call (Sarvam)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">No items found matching your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-[#00b9f5] font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
