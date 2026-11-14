import React, { useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle,
  FileCheck,
  Plus,
  ArrowRight,
  DollarSign,
  AlertCircle,
  History,
  Sparkles,
  Smartphone,
  Calendar,
  Wrench,
  Clock
} from 'lucide-react';

export default function DigitalLedgerTab({
  purchases = [],
  preselectedDevice = null,
  onDeviceUpdated
}) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    preselectedDevice ? preselectedDevice.id : (purchases[0]?.id || '')
  );
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  
  // New Log Form State
  const [serviceDate, setServiceDate] = useState('2026-11-14');
  const [serviceCenter, setServiceCenter] = useState('Paytm Authorized Care Network');
  const [issueDesc, setIssueDesc] = useState('Routine Hardware Inspection & Deep Clean');
  const [parts, setParts] = useState('Original Dust Seal');
  const [cost, setCost] = useState('999');
  const [techNotes, setTechNotes] = useState('Passed 24-point electrical and hardware safety test.');

  // Exchange Quote State
  const [payoutMethod, setPayoutMethod] = useState('Paytm UPI');
  const [accountIdentifier, setAccountIdentifier] = useState('9876543210@paytm');
  const [exchangeResult, setExchangeResult] = useState(null);
  const [isSubmittingExchange, setIsSubmittingExchange] = useState(false);

  const selectedDevice = purchases.find((p) => p.id === selectedDeviceId);

  if (!selectedDevice) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <p className="text-sm font-semibold text-gray-500">No device selected.</p>
      </div>
    );
  }

  // Calculate ledger score
  const logsCount = selectedDevice.repair_history?.length || 0;
  const maintenanceScore = Math.min(100, 85 + logsCount * 5);
  const resaleBonusAmount = Math.round((selectedDevice.current_resale_value || 0) * 0.15);

  const handleAddLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/purchases/${selectedDeviceId}/repair-log`, {
        service_date: serviceDate,
        service_center: serviceCenter,
        issue_description: issueDesc,
        parts_replaced: parts.split(',').map((s) => s.trim()),
        cost: parseFloat(cost) || 0,
        technician_notes: techNotes
      });

      setShowAddLogModal(false);
      if (onDeviceUpdated) onDeviceUpdated();
    } catch (err) {
      console.error('Error adding repair log:', err);
      alert('Failed to add service record.');
    }
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingExchange(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/resale/exchange', {
        device_id: selectedDeviceId,
        payout_method: payoutMethod,
        account_identifier: accountIdentifier
      });
      setExchangeResult(res.data);
      if (onDeviceUpdated) onDeviceUpdated();
    } catch (err) {
      console.error('Error submitting resale exchange:', err);
    } finally {
      setIsSubmittingExchange(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#002970] via-[#092257] to-[#00b9f5] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00b9f5] font-bold text-xs uppercase tracking-wider mb-1">
            <Award size={15} /> Digital Asset Ledger & Resale Passport
          </div>
          <h2 className="text-2xl font-black">Appliance & Device Maintenance Logbook</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Every verified repair, cleaning, and genuine parts replacement is cryptographically logged.
            This proves your device was properly maintained and commands up to +15% to 25% higher resale value when upgrading.
          </p>
        </div>

        {/* Device Dropdown Selector */}
        <div className="bg-black/25 p-2 rounded-xl border border-white/10 shrink-0 w-full md:w-auto">
          <label className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
            Switch Device:
          </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
              setExchangeResult(null);
            }}
            className="w-full text-xs font-bold bg-white text-gray-900 rounded-lg p-2 outline-none"
          >
            {purchases.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {dev.product_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Passport & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Passport Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Verified Device Passport
                </span>
                <h3 className="text-lg font-black text-gray-900">{selectedDevice.product_name}</h3>
                <p className="text-xs text-gray-500">
                  Serial Number: <span className="font-mono font-semibold text-gray-700">{selectedDevice.serial_number}</span>
                </p>
              </div>

              {/* Maintenance Score Badge */}
              <div className="flex items-center gap-3 bg-blue-50/70 border border-blue-100 px-3.5 py-2 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#002970] text-[#00b9f5] font-black flex items-center justify-center text-sm shadow-xs">
                  {maintenanceScore}
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Health Score</span>
                  <span className="text-xs font-extrabold text-[#002970]">
                    {maintenanceScore >= 90 ? 'Pristine Maintenance' : 'Good Condition'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Original Price</span>
                <span className="font-black text-gray-900 text-sm">
                  ₹{selectedDevice.purchase_price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Condition Grade</span>
                <span className="font-black text-emerald-700 text-sm">
                  {selectedDevice.condition_grade || 'A+ Mint'}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Battery / State</span>
                <span className="font-black text-gray-900 text-sm">
                  {selectedDevice.battery_health || '98% (Healthy)'}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Invoice Authenticity</span>
                <span className="font-black text-blue-600 text-sm flex items-center gap-1">
                  <CheckCircle size={14} className="text-emerald-500" /> Paytm Verified
                </span>
              </div>
            </div>
          </div>

          {/* Service & Repair History Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <History size={18} className="text-[#002970]" />
                  Service & Maintenance Logbook ({selectedDevice.repair_history?.length || 0})
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chronological tamper-proof ledger of technician inspections and parts replacement.
                </p>
              </div>

              <button
                onClick={() => setShowAddLogModal(true)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#002970] text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                <Plus size={14} /> Add Record
              </button>
            </div>

            {selectedDevice.repair_history && selectedDevice.repair_history.length > 0 ? (
              <div className="space-y-4 pt-1">
                {selectedDevice.repair_history.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="relative pl-6 pb-4 border-l-2 border-blue-200 last:border-l-0 last:pb-0"
                  >
                    {/* Timeline bullet */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#002970] border-2 border-white ring-2 ring-blue-100" />

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <span className="font-bold text-xs text-gray-900">{log.issue_description}</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
                          <Calendar size={12} /> {log.service_date}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <Wrench size={13} className="text-[#00b9f5]" />
                        <span>Center: {log.service_center}</span>
                      </div>

                      {log.parts_replaced && log.parts_replaced.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap text-[11px]">
                          <span className="text-gray-400 font-semibold">Parts Replaced:</span>
                          {log.parts_replaced.map((p, i) => (
                            <span
                              key={i}
                              className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-1 flex justify-between items-center text-[11px] border-t border-gray-200/60 mt-2">
                        <span className="text-gray-500 italic">"{log.technician_notes}"</span>
                        <span className="font-bold text-[#002970]">
                          Cost: {log.cost > 0 ? `₹${log.cost.toLocaleString('en-IN')}` : 'Free / Under Warranty'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs">
                <FileCheck size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="font-medium text-gray-500">No service records yet.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Add past repairs or book an inspection to start boosting your device's resale passport!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Resale Value Estimator & Cashify 1-Click Sell */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <TrendingUp size={15} /> Paytm Resale Valuation Engine
            </div>
            <h3 className="font-black text-lg text-gray-900">
              Guaranteed Resale Payout
            </h3>

            {/* Valuation display */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 rounded-2xl p-4 border border-blue-200/70 text-center space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Current Valuation Quote
              </span>
              <div className="text-3xl font-black text-[#002970]">
                ₹{(selectedDevice.current_resale_value || 0).toLocaleString('en-IN')}
              </div>
              <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1">
                <Sparkles size={12} /> Includes +₹{resaleBonusAmount.toLocaleString('en-IN')} Ledger Bonus
              </div>
            </div>

            {/* Breakdown explanation */}
            <div className="space-y-2 text-xs border-t pt-3">
              <div className="flex justify-between text-gray-500">
                <span>Base Market Depreciation</span>
                <span className="font-semibold text-gray-800">
                  ₹{((selectedDevice.current_resale_value || 0) - resaleBonusAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Verified Service Logbook (+15%)</span>
                <span>+ ₹{resaleBonusAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Quote Validity</span>
                <span className="font-semibold text-[#002970]">Locked for 7 Days</span>
              </div>
            </div>

            <button
              onClick={() => setShowExchangeModal(true)}
              className="w-full py-3 bg-[#002970] hover:bg-[#071d49] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <DollarSign size={16} className="text-[#00b9f5]" />
              Sell / Exchange on Paytm (Cashify)
            </button>
          </div>

          {/* Information Card on Ledger Value */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-[#002970] flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#00b9f5]" />
              Why the Digital Ledger Matters
            </span>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Second-hand buyers and exchange programs deduct up to 40% when maintenance history is unknown.
              Paytm's verified passport certifies genuine parts and regular servicing, delivering the highest guaranteed trade-in price in India.
            </p>
          </div>
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-base text-gray-900">Add Service / Repair Log</h3>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Service Date</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Service Center / Technician</label>
                <input
                  type="text"
                  value={serviceCenter}
                  onChange={(e) => setServiceCenter(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Issue / Service Description</label>
                <input
                  type="text"
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Parts Replaced (comma separated)</label>
                  <input
                    type="text"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Technician Inspection Notes</label>
                <textarea
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002970] text-white font-bold rounded-xl hover:bg-[#071e4d]"
                >
                  Save to Logbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cashify Resale Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-base text-gray-900">1-Click Resale / Trade-in</h3>
              <button
                onClick={() => {
                  setShowExchangeModal(false);
                  setExchangeResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {exchangeResult ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h4 className="font-black text-base text-gray-900">Resale Quote Locked!</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {exchangeResult.message}
                </p>
                <div className="bg-gray-50 p-3 rounded-xl border text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote ID:</span>
                    <span className="font-mono font-bold">{exchangeResult.quote_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payout Amount:</span>
                    <span className="font-black text-[#002970]">₹{exchangeResult.guaranteed_payout.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Doorstep Inspection:</span>
                    <span className="font-semibold text-emerald-700">{exchangeResult.inspection_window}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowExchangeModal(false);
                    setExchangeResult(null);
                  }}
                  className="w-full py-2.5 bg-[#002970] text-white text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="space-y-4 text-xs">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 text-[10px] block">Selling Device</span>
                    <span className="font-bold text-gray-900">{selectedDevice.product_name}</span>
                  </div>
                  <span className="text-base font-black text-[#002970]">
                    ₹{(selectedDevice.current_resale_value || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">Instant Payout Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none font-semibold text-gray-800"
                  >
                    <option value="Paytm UPI">Paytm UPI (Instant Credit)</option>
                    <option value="Paytm Wallet">Paytm Wallet</option>
                    <option value="Direct Bank Account">Direct Bank Account (NEFT/IMPS)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">UPI ID / Mobile / Account</label>
                  <input
                    type="text"
                    value={accountIdentifier}
                    onChange={(e) => setAccountIdentifier(e.target.value)}
                    className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none font-mono"
                    required
                  />
                </div>

                <div className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Free doorstep evaluation. Amount is transferred instantly to your account before handover.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingExchange}
                  className="w-full py-3 bg-[#002970] hover:bg-[#071e4d] text-white font-bold rounded-xl shadow-md transition"
                >
                  {isSubmittingExchange ? 'Locking Quote...' : 'Lock Quote & Request Doorstep Pickup'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

