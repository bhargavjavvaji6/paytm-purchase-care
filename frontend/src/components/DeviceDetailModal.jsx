import React from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle,
  Download,
  Calendar,
  DollarSign,
  Tag,
  Hash,
  MapPin,
  Building
} from 'lucide-react';

export default function DeviceDetailModal({ device, isOpen, onClose }) {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] to-[#0a358c] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#00b9f5]">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider block">
                Digital Invoice Vault
              </span>
              <h3 className="font-black text-base">{device.product_name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Scanned Tax Invoice & Certificate */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Authentic Tax Invoice Replica */}
          <div className="bg-amber-50/20 border-2 border-dashed border-gray-300 rounded-2xl p-6 font-mono text-xs text-gray-800 space-y-4 shadow-inner">
            <div className="flex justify-between items-start border-b border-gray-300 pb-3">
              <div>
                <span className="font-black text-sm text-[#002970]">{device.merchant_name}</span>
                <p className="text-[11px] text-gray-500 font-sans">Authorized Brand Retailer • Tax Invoice / Cash Memo</p>
                <p className="text-[10px] text-gray-400 font-sans">GSTIN: 29AAACR9012F1Z4 | CIN: U72200KA2015PTC081234</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 font-sans text-[10px] font-bold px-2 py-0.5 rounded">
                  VERIFIED BY PAYTM
                </span>
                <p className="text-[10px] text-gray-500 mt-1">Invoice: {device.invoice_number}</p>
              </div>
            </div>

            {/* Item Table */}
            <div className="space-y-2 py-1">
              <div className="flex justify-between text-gray-400 font-bold text-[10px] border-b pb-1">
                <span>DESCRIPTION</span>
                <span>QTY</span>
                <span>RATE (INR)</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span className="font-sans font-semibold text-xs max-w-[280px]">{device.product_name}</span>
                <span>1</span>
                <span>₹{device.purchase_price.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-sans">
                Serial / IMEI: <span className="font-mono text-gray-800 font-semibold">{device.serial_number}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-sans">
                Model Code: <span className="font-mono text-gray-800 font-semibold">{device.model_number || 'Standard OEM'}</span>
              </div>
            </div>

            {/* Total Section */}
            <div className="border-t border-gray-300 pt-2 space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{Math.round(device.purchase_price / 1.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>CGST (9%) + SGST (9%):</span>
                <span>₹{Math.round(device.purchase_price - device.purchase_price / 1.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#002970] border-t pt-1">
                <span>Total Amount Paid:</span>
                <span>₹{device.purchase_price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Stamp */}
            <div className="flex justify-between items-end pt-3 border-t border-gray-200">
              <div className="text-[10px] text-gray-400 font-sans">
                Purchased On: {device.purchase_date} • Mode: Paytm POS / UPI
              </div>
              <div className="border-2 border-emerald-600 text-emerald-700 font-black text-[10px] px-3 py-1 rounded uppercase tracking-widest rotate-[-3deg]">
                ✓ 100% PAID & VERIFIED
              </div>
            </div>
          </div>

          {/* Warranty Terms */}
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/70 text-xs space-y-2">
            <span className="font-bold text-[#002970] text-xs flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#00b9f5]" />
              Manufacturer Warranty Certificate
            </span>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              This appliance is registered with <span className="font-semibold text-gray-900">{device.brand}</span> for {device.warranty_months} months from purchase date.
              Expiration date: <span className="font-bold text-[#002970]">{device.warranty_expiry}</span>.
              For service requests, this digital invoice is accepted directly by all authorized service centers in India.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium">Digital bill permanently archived in Paytm Cloud.</span>
          <button
            onClick={() => {
              alert('Downloading official GST Tax Invoice PDF...');
            }}
            className="px-4 py-2 bg-[#002970] text-white text-xs font-bold rounded-xl hover:bg-[#081e4c] transition flex items-center gap-1.5"
          >
            <Download size={14} className="text-[#00b9f5]" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

