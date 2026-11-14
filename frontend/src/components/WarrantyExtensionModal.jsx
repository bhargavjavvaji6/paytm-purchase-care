import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Lock,
  Star
} from 'lucide-react';

export default function WarrantyExtensionModal({ device, isOpen, onClose, onSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('1yr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen || !device) return null;

  const plans = [
    {
      id: '1yr',
      name: '1-Year Extended Warranty',
      price: 899,
      save: 'Save 45%',
      features: [
        '100% cashless repairs for mechanical & electrical failures',
        'Covers PCB motherboard, inverter chips & power supplies',
        'Zero depreciation on spare parts replacement'
      ]
    },
    {
      id: 'amc',
      name: '2-Year Full AMC (Annual Maintenance)',
      price: 1499,
      save: 'Most Popular',
      popular: true,
      features: [
        '2 Free deep jet wet cleaning & preventive servicing visits',
        'Free refrigerant gas leak repair & pressure top-up',
        'Priority emergency technician doorstep visit within 4 hours',
        'Covers all internal functional parts'
      ]
    },
    {
      id: 'total',
      name: 'Paytm Care Shield Ultra (All-Risk)',
      price: 1999,
      save: 'Complete Cover',
      features: [
        'Everything in AMC + Extended Warranty',
        'Accidental liquid damage & power surge protection',
        'Guaranteed brand replacement if repair exceeds 7 days'
      ]
    }
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      if (onSuccess) onSuccess(device.id, currentPlan.name);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] via-[#092562] to-[#00b9f5] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#00b9f5]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider block">
                Paytm Care Shield Marketplace
              </span>
              <h3 className="font-black text-base">Extend Appliance Protection</h3>
            </div>
          </div>

          <button
            onClick={() => {
              setPaymentSuccess(false);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {paymentSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <h4 className="font-black text-xl text-gray-900">
                Care Shield Protection Activated!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Your <span className="font-bold text-gray-900">{device.product_name}</span> is now protected under{' '}
                <span className="font-bold text-[#002970]">{currentPlan.name}</span>. Policy certificate has been issued and stored in your Digital Ledger.
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 border text-xs max-w-sm mx-auto text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className="font-bold text-gray-900">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">₹{currentPlan.price} (via Paytm UPI)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-bold text-blue-600">Active (Instant Cover)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaymentSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#002970] text-white text-xs font-bold rounded-xl hover:bg-[#071d49] transition"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Target Device Summary */}
              <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Target Device</span>
                  <span className="font-bold text-gray-900">{device.product_name}</span>
                  <span className="text-gray-500 block text-[11px]">Expires: {device.warranty_expiry}</span>
                </div>
                <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  {device.warranty_status}
                </span>
              </div>

              {/* Plan Options */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Select Protection Tier:
                </label>

                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                      selectedPlan === plan.id
                        ? 'border-[#002970] bg-blue-50/40 ring-2 ring-[#002970]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{plan.name}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              plan.popular
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-[#002970]'
                            }`}
                          >
                            {plan.save}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((f, i) => (
                            <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                              <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="text-xl font-black text-[#002970]">₹{plan.price}</span>
                        <span className="text-[10px] text-gray-400 block">All taxes incl.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Info */}
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total Payable:</span>
                  <span className="text-2xl font-black text-[#002970]">₹{currentPlan.price}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-[#002970] hover:bg-[#071e4d] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Lock size={14} className="text-[#00b9f5]" />
                  {isProcessing ? 'Processing Paytm UPI...' : `Pay ₹${currentPlan.price} via Paytm`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

