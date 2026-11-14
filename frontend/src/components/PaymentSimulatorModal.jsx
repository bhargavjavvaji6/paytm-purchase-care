import React, { useState } from 'react';
import axios from 'axios';
import {
  X,
  CreditCard,
  CheckCircle,
  FileText,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  Laptop,
  Wind,
  ShoppingBag
} from 'lucide-react';

export default function PaymentSimulatorModal({
  isOpen,
  onClose,
  onPaymentSuccessAndOpenScanner,
  onDeviceRegistered
}) {
  const [selectedPreset, setSelectedPreset] = useState('laptop');
  const [merchant, setMerchant] = useState('Croma Electronics - Koramangala');
  const [productName, setProductName] = useState('HP Pavilion Gaming Laptop 16 (Ryzen 7, RTX 4060)');
  const [category, setCategory] = useState('laptops');
  const [amount, setAmount] = useState(86990);
  const [paymentMode, setPaymentMode] = useState('Paytm UPI');

  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'laptop',
      icon: <Laptop size={15} />,
      title: 'HP Pavilion Gaming Laptop',
      merchant: 'Croma Electronics - Koramangala',
      category: 'laptops',
      amount: 86990
    },
    {
      id: 'smartphone',
      icon: <Smartphone size={15} />,
      title: 'Samsung Galaxy S24 5G',
      merchant: 'Reliance Digital Megastore',
      category: 'electronics',
      amount: 79999
    },
    {
      id: 'appliance',
      icon: <Wind size={15} />,
      title: 'LG 1.5 Ton 5-Star Split AC',
      merchant: 'LG Brand Plaza (MG Road)',
      category: 'appliances',
      amount: 44990
    },
    {
      id: 'groceries',
      icon: <ShoppingBag size={15} />,
      title: 'Zepto Fresh Dairy & Grocery Provisions',
      merchant: 'Zepto 10-Min Fast Delivery',
      category: 'groceries',
      amount: 540
    }
  ];

  const handleSelectPreset = (p) => {
    setSelectedPreset(p.id);
    setMerchant(p.merchant);
    setProductName(p.title);
    setCategory(p.category);
    setAmount(p.amount);
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/add-realtime-purchase', {
        merchant: merchant,
        product_name: productName,
        category: category,
        amount: parseFloat(amount),
        payment_mode: paymentMode,
        invoice_uploaded: false
      });

      setSuccessResult(res.data);
      if (onDeviceRegistered) onDeviceRegistered();
    } catch (err) {
      console.error('Payment simulation error:', err);
      alert('Failed to simulate transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] to-[#0a358c] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00b9f5] text-[#002970] flex items-center justify-center font-black shadow-md">
              <CreditCard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider block">
                Paytm Soundbox & Checkout Simulator
              </span>
              <h3 className="font-black text-base">Make a Purchase via Paytm</h3>
            </div>
          </div>

          <button
            onClick={() => {
              setSuccessResult(null);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successResult ? (
            /* Successful Payment Screen with Instant Bill Submission Prompt */
            <div className="space-y-4 text-center">
              {/* Green Paytm Tick */}
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle size={36} />
              </div>

              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Payment Successful
                </span>
                <h4 className="text-xl font-black text-gray-900 mt-2">
                  ₹{amount.toLocaleString('en-IN')} Paid to {merchant}
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Txn ID: {successResult.transaction_id} • via {paymentMode}
                </p>
              </div>

              {/* Bill Submission Prompt Card */}
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50/50 to-emerald-50/60 p-4 rounded-2xl border border-blue-200 text-left space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-[#002970] font-black text-xs">
                  <ShieldCheck size={16} className="text-[#00b9f5]" />
                  <span>Protect This Purchase with Paytm Care Hub!</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Would you like to snap or upload your invoice bill now?
                  {category === 'groceries'
                    ? ' Submitting the bill tracks freshness expiry dates and food safety advisories.'
                    : ' Submitting your invoice automatically activates 1-year warranty countdowns, recall alerts, and digital resale passport.'}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onPaymentSuccessAndOpenScanner(successResult.device);
                      setSuccessResult(null);
                      onClose();
                    }}
                    className="w-full py-2.5 bg-[#002970] hover:bg-[#081e4c] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud size={15} className="text-[#00b9f5]" />
                    Submit & Scan Invoice Bill Now
                  </button>

                  <button
                    onClick={() => {
                      setSuccessResult(null);
                      onClose();
                    }}
                    className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                  >
                    Saved to Care Hub (Upload Bill Later)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Purchase Configuration Form */
            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Quick Sample Purchase:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                        selectedPreset === p.id
                          ? 'border-[#002970] bg-blue-50/60 font-bold text-[#002970] ring-1 ring-[#002970]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="p-1 rounded-lg bg-white border border-gray-200 text-[#002970]">
                        {p.icon}
                      </div>
                      <div className="truncate">
                        <span className="block truncate text-[11px] font-bold">{p.title}</span>
                        <span className="text-[10px] text-gray-400">₹{p.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Store / Merchant Name</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none text-xs font-bold text-gray-900 focus:bg-white focus:border-[#00b9f5]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Product Description</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#00b9f5]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none text-xs font-semibold text-gray-900"
                  >
                    <option value="laptops">Laptops & PCs</option>
                    <option value="electronics">Smartphones & Gadgets</option>
                    <option value="appliances">Home Appliances</option>
                    <option value="groceries">Groceries & Perishables</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none text-xs font-black text-[#002970]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Paytm Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full border rounded-xl p-2.5 bg-gray-50 outline-none text-xs font-semibold text-gray-800"
                >
                  <option value="Paytm UPI">Paytm UPI (Instant Bank Transfer)</option>
                  <option value="Paytm Soundbox QR">In-Store Paytm Soundbox QR</option>
                  <option value="Paytm Wallet">Paytm Wallet Balance</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-[#002970] hover:bg-[#071e4d] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
              >
                {isProcessing ? 'Processing Transaction...' : `Pay ₹${amount.toLocaleString('en-IN')} with Paytm`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

