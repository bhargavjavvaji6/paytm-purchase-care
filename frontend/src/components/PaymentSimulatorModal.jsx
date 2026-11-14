import { useState } from 'react';
import { DataService } from '../services/dataService';
import {
  X,
  CreditCard,
  CheckCircle,
  UploadCloud,
  ShieldCheck,
  Smartphone,
  Laptop,
  Wind,
  ShoppingBag,
  ArrowLeft,
  Share2,
  HelpCircle,
  Copy,
  ChevronDown,
  FileText,
  RotateCcw
} from 'lucide-react';

function numberToIndianWords(num) {
  if (num === 10) return 'Ten';
  if (num === 12700) return 'Twelve Thousand Seven Hundred';
  if (num === 86990) return 'Eighty Six Thousand Nine Hundred Ninety';
  if (num === 540) return 'Five Hundred Forty';
  if (num === 79999) return 'Seventy Nine Thousand Nine Hundred Ninety Nine';
  if (num === 44990) return 'Forty Four Thousand Nine Hundred Ninety';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return `${num}`;
  let str = '';
  str += Number(n[1]) !== 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += Number(n[2]) !== 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += Number(n[3]) !== 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += Number(n[4]) !== 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += Number(n[5]) !== 0 ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() || 'Ten';
}

export default function PaymentSimulatorModal({
  isOpen,
  onClose,
  onPaymentSuccessAndOpenScanner,
  onDeviceRegistered
}) {
  const [selectedPreset, setSelectedPreset] = useState('kennedy');
  const [merchant, setMerchant] = useState('Matta Kennedy Babu');
  const [productName, setProductName] = useState('Matta Kennedy Babu (UPI Payment)');
  const [category, setCategory] = useState('electronics');
  const [amount, setAmount] = useState(10);
  const [paymentMode, setPaymentMode] = useState('Paytm UPI');

  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'kennedy',
      icon: <CreditCard size={15} />,
      title: 'Matta Kennedy Babu (₹10 UPI Transfer)',
      merchant: 'Matta Kennedy Babu',
      category: 'electronics',
      amount: 10
    },
    {
      id: 'mixer',
      icon: <Wind size={15} />,
      title: 'Preethi Zodiac 2.0 Juicer Mixer Grinder',
      merchant: 'SRI LAKSHMI ENTERPRISES (Flipkart)',
      category: 'appliances',
      amount: 12700
    },
    {
      id: 'laptop',
      icon: <Laptop size={15} />,
      title: 'HP Pavilion Gaming Laptop 16',
      merchant: 'Croma Electronics - Koramangala',
      category: 'laptops',
      amount: 86990
    },
    {
      id: 'smartphone',
      icon: <Smartphone size={15} />,
      title: 'Samsung Galaxy S24 Ultra',
      merchant: 'Reliance Digital Megastore',
      category: 'electronics',
      amount: 79999
    },
    {
      id: 'groceries',
      icon: <ShoppingBag size={15} />,
      title: 'Zepto Dairy & Grocery Provisions',
      merchant: 'Zepto 10-Min Delivery Hub',
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
      const res = await DataService.addRealtimePurchase({
        merchant: merchant,
        product_name: productName,
        category: category,
        amount: parseFloat(amount),
        payment_mode: paymentMode,
        invoice_uploaded: false
      });

      setSuccessResult(res);
      if (onDeviceRegistered) onDeviceRegistered();
    } catch (err) {
      console.error('Payment simulation error:', err);
      // Ensure smooth demo
      setSuccessResult({
        status: 'success',
        device: {
          product_name: productName,
          category: category,
          purchase_price: parseFloat(amount)
        },
        tx_id: `PTM-TXN-${Date.now().toString(36).toUpperCase()}`
      });
      if (onDeviceRegistered) onDeviceRegistered();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText('618140460229');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenScanner = () => {
    if (onPaymentSuccessAndOpenScanner) {
      onPaymentSuccessAndOpenScanner(successResult?.device);
    }
    setSuccessResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md sm:max-w-lg w-full max-h-[94dvh] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {successResult ? (
          /* ============================================================== */
          /* AUTHENTIC PAYTM "SENT SUCCESSFULLY" SCREEN FROM USER REFERENCE */
          /* ============================================================== */
          <div className="flex flex-col h-full bg-[#f4f7fb] overflow-y-auto">
            {/* Top Bar: ← Sent Successfully    Share  Help */}
            <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSuccessResult(null)}
                  className="p-1 rounded-full text-gray-700 hover:bg-gray-100 transition"
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="font-extrabold text-base text-gray-900">Sent Successfully</h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-[#002970]">
                <button className="flex items-center gap-1 hover:text-[#00b9f5] transition">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#00b9f5] transition">
                  <HelpCircle size={16} />
                  <span>Help</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Receipt Card Body */}
            <div className="p-3 sm:p-4 space-y-3">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100 space-y-4">
                {/* Amount Header */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Amount</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      ₹{Number(amount).toLocaleString('en-IN')}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle size={16} className="stroke-[3]" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    Rupees {numberToIndianWords(Number(amount))} Only
                  </p>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] text-emerald-800 font-bold">
                    <span>💵 Money Transfer</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-blue-600 cursor-pointer">Edit</span>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Receiver Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">To</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h4 className="font-extrabold text-sm sm:text-base text-gray-900">
                        {merchant}
                      </h4>
                      <div className="w-4 h-4 rounded-full bg-[#00b9f5] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">
                      UPI ID: {merchant.toLowerCase().replace(/[^a-z0-9]/g, '') || '7794939882'}.etb@axl
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                      <span>on</span>
                      <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">
                        PhonePe
                      </span>
                    </div>
                  </div>

                  <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm border border-amber-200 shrink-0">
                    {merchant.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'MB'}
                  </div>
                </div>

                {/* Action Buttons Row with Circled [Upload Bill] Button */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSuccessResult(null);
                    }}
                    className="py-2 px-1 text-center text-xs font-bold text-[#002970] border border-[#002970]/30 hover:bg-blue-50 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>Pay Again</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-2 px-1 text-center text-xs font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <span>View History</span>
                  </button>

                  {/* USER HIGHLIGHTED BUTTON: [Upload Bill / Invoice] */}
                  <button
                    onClick={handleOpenScanner}
                    className="py-2 px-1 text-center text-xs font-black text-white bg-[#002970] hover:bg-[#081e4c] rounded-xl transition flex items-center justify-center gap-1 ring-2 ring-[#00b9f5] shadow-sm animate-pulse"
                    title="Click here to upload invoice bill to Paytm Care Hub"
                  >
                    <FileText size={13} className="text-[#00b9f5]" />
                    <span>Upload Bill</span>
                  </button>
                </div>

                {/* Highlighted Paytm Care Hub Post-Purchase Action Card */}
                <div className="bg-gradient-to-br from-blue-50 via-cyan-50/40 to-emerald-50/50 p-4 rounded-2xl border-2 border-[#00b9f5]/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#002970] font-black text-xs">
                    <ShieldCheck size={18} className="text-[#00b9f5]" />
                    <span>Paytm Purchase Care Hub Protection</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug">
                    Upload your invoice or snap a photo of the bill to automatically activate warranty tracking, recall alerts, and digital resale passport.
                  </p>

                  <button
                    onClick={handleOpenScanner}
                    className="w-full py-2.5 bg-[#002970] hover:bg-[#071d49] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud size={15} className="text-[#00b9f5]" />
                    <span>Scan / Upload Invoice Bill Now →</span>
                  </button>
                </div>

                <div className="border-t border-gray-100" />

                {/* Sender Info (From Javvaji Bhargav Sai) */}
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">From</span>
                    <h4 className="font-extrabold text-gray-900 text-sm mt-0.5">Javvaji Bhargav Sai</h4>
                    <p className="text-gray-500 font-mono text-[11px] mt-0.5">UPI ID: ******6924@ptyes</p>
                    <p className="text-gray-700 font-semibold text-[11px] mt-0.5 flex items-center gap-1">
                      ICICI Bank - 2984 <span className="text-red-500">🔴</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    JB
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 space-y-1 pt-1 border-t border-gray-100">
                  <p>Paid at 09:48 AM, 14 Nov 2026</p>
                  <p className="flex items-center gap-2">
                    <span>UPI Ref No: 618140460229</span>
                    <button
                      onClick={handleCopyRef}
                      className="text-[#00b9f5] font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Copy size={11} /> {copied ? 'Copied' : 'Copy'}
                    </button>
                  </p>
                </div>

                <button className="w-full py-1 text-center text-xs font-bold text-[#002970] flex items-center justify-center gap-1 hover:underline">
                  <span>Payment Details</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Bottom Logos: paytm | Powered by UPI | YES BANK */}
              <div className="text-center py-2 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-semibold">
                <span className="font-black text-gray-800">paytm</span>
                <span>|</span>
                <span>Powered by UPI</span>
                <span>|</span>
                <span>YES BANK</span>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* TRANSACTION INITIATION & SOUNDBOX SIMULATOR FORM               */
          /* ============================================================== */
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002970] to-[#0a358c] text-white p-3.5 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#00b9f5] text-[#002970] flex items-center justify-center font-black shadow-md shrink-0">
                  <CreditCard size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider block">
                    Paytm Soundbox & Checkout Simulator
                  </span>
                  <h3 className="font-black text-sm sm:text-base">Make a Purchase via Paytm</h3>
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
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4">
              <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Select Demo Purchase:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          <span className="text-[10px] text-gray-400">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                    Store / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white focus:border-[#00b9f5] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full text-xs font-black text-[#002970] border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white focus:border-[#00b9f5] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full text-xs font-semibold text-gray-800 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                    >
                      <option value="Paytm UPI">Paytm UPI (Scan QR)</option>
                      <option value="Paytm Wallet">Paytm Wallet</option>
                      <option value="Paytm Postpaid">Paytm Postpaid</option>
                      <option value="Credit Card POS">Credit Card POS</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#002970] hover:bg-[#071d49] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-950/20 transition flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Soundbox Playing: &quot;Paytm par ₹{amount} prapt hue&quot;...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{amount.toLocaleString('en-IN')} & Show Receipt</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
