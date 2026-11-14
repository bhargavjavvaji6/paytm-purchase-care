import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  UserCheck,
  Tag
} from 'lucide-react';

export default function ServiceBookingTab({
  purchases = [],
  serviceCenters = [],
  bookings = [],
  preselectedDevice = null,
  onBookingCreated
}) {
  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book' | 'my-bookings'
  
  // Booking Form State
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    preselectedDevice ? preselectedDevice.id : (purchases[0]?.id || '')
  );
  const [serviceType, setServiceType] = useState('Doorstep Repair');
  const [selectedPartnerId, setSelectedPartnerId] = useState('sc-01');
  const [issueDescription, setIssueDescription] = useState('Annual Preventive Servicing & Diagnostic Check');
  const [scheduledDate, setScheduledDate] = useState('2026-11-18');
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Common issues by category
  const commonIssues = [
    'Annual Preventive Servicing & Diagnostic Check',
    'Cooling Failure / Gas Refill Required',
    'Display Glitch / Screen Damage',
    'Battery Drain / Power Failure',
    'Compressor Noise / High Vibration',
    'Liquid Damage / Water Ingress',
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeviceId) {
      alert('Please select an appliance or gadget.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/service-bookings`, {
        device_id: selectedDeviceId,
        service_type: serviceType,
        service_partner_id: selectedPartnerId,
        issue: issueDescription,
        scheduled_date: scheduledDate,
        scheduled_slot: scheduledSlot,
        address: address,
        phone: phone,
      });

      setBookingSuccess(res.data.booking);
      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to confirm service booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.post(`${API_BASE}/api/service-bookings/${bookingId}/cancel`);
      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      console.error('Error cancelling:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#002970] via-[#0b2963] to-[#00b9f5]/80 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00b9f5] font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck size={15} /> Monetizable O2O Service Network
          </div>
          <h2 className="text-2xl font-black">Authorized Service-Centre & Doorstep Booking</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Book verified brand technicians with genuine parts guarantee. Paytm Care Shield covers diagnostics,
            parts warranty, and guarantees transparent pricing.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveSubTab('book')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'book' ? 'bg-[#00b9f5] text-[#002970] shadow-sm' : 'text-gray-200 hover:text-white'
            }`}
          >
            Book New Service
          </button>
          <button
            onClick={() => setActiveSubTab('my-bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'my-bookings' ? 'bg-[#00b9f5] text-[#002970] shadow-sm' : 'text-gray-200 hover:text-white'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'book' ? (
        bookingSuccess ? (
          /* Confirmation Success Card */
          <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-2">
                Technician Visit Scheduled!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Booking Reference ID: <span className="font-mono font-bold text-gray-900">{bookingSuccess.id}</span>
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b pb-1.5 border-blue-200/50">
                <span className="text-gray-500">Device</span>
                <span className="font-bold text-gray-900">{bookingSuccess.device_name}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-blue-200/50">
                <span className="text-gray-500">Service Partner</span>
                <span className="font-bold text-[#002970]">{bookingSuccess.service_partner}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-blue-200/50">
                <span className="text-gray-500">Scheduled Time</span>
                <span className="font-bold text-gray-900">{bookingSuccess.scheduled_date} ({bookingSuccess.scheduled_slot})</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-blue-200/50">
                <span className="text-gray-500">Assigned Technician</span>
                <span className="font-bold text-gray-900">{bookingSuccess.technician_name} ({bookingSuccess.technician_phone})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Verification OTP for Tech</span>
                <span className="font-mono font-black text-emerald-700 text-sm tracking-widest">{bookingSuccess.otp}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  setActiveSubTab('my-bookings');
                }}
                className="px-5 py-2.5 bg-[#002970] text-white text-xs font-bold rounded-xl hover:bg-[#091f52] transition"
              >
                Track Live Status
              </button>
              <button
                onClick={() => setBookingSuccess(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          /* Main Booking Wizard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* 1. Device Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    1. Select Appliance / Gadget
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full text-xs font-bold text-gray-900 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-[#00b9f5] outline-none"
                  >
                    {purchases.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.product_name} ({dev.brand}) — Warranty: {dev.warranty_status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Issue Selection / Diagnostics */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    2. Describe Issue or Select Diagnostic
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {commonIssues.map((issue) => (
                      <button
                        type="button"
                        key={issue}
                        onClick={() => setIssueDescription(issue)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                          issueDescription === issue
                            ? 'bg-[#002970] text-white border-[#002970] font-bold'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {issue}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="E.g. AC cooling low, compressor rattling, screen flickering..."
                    className="w-full text-xs text-gray-800 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-[#00b9f5] outline-none"
                    required
                  />
                </div>

                {/* 3. Service Mode */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    3. Service Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType('Doorstep Repair')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        serviceType === 'Doorstep Repair'
                          ? 'border-[#002970] bg-blue-50/50 text-[#002970] ring-1 ring-[#002970]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <UserCheck size={18} className="mt-0.5 text-[#00b9f5]" />
                      <div>
                        <span className="text-xs font-bold block">Doorstep Technician Visit</span>
                        <span className="text-[10px] text-gray-500">Paytm-verified tech visits your home</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('Service Center Visit')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        serviceType === 'Service Center Visit'
                          ? 'border-[#002970] bg-blue-50/50 text-[#002970] ring-1 ring-[#002970]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <MapPin size={18} className="mt-0.5 text-gray-500" />
                      <div>
                        <span className="text-xs font-bold block">Authorized Center Drop-off</span>
                        <span className="text-[10px] text-gray-500">Visit brand flagship service lounge</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Choose Partner */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    4. Select Verified Service Partner
                  </label>
                  <div className="space-y-2">
                    {serviceCenters.map((partner) => (
                      <div
                        key={partner.id}
                        onClick={() => setSelectedPartnerId(partner.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          selectedPartnerId === partner.id
                            ? 'border-[#002970] bg-blue-50/40 ring-1 ring-[#002970]'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedPartnerId === partner.id ? 'border-[#002970] bg-[#002970]' : 'border-gray-300'
                          }`}>
                            {selectedPartnerId === partner.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900">{partner.name}</span>
                              <span className="text-[10px] bg-blue-100 text-[#002970] font-bold px-1.5 py-0.2 rounded">
                                {partner.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                <Star size={11} fill="currentColor" /> {partner.rating} ({partner.review_count})
                              </span>
                              <span>•</span>
                              <span>📍 {partner.distance_km} km away</span>
                              <span>•</span>
                              <span>⏱ {partner.avg_turnaround}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-900">₹{partner.inspection_fee}</span>
                          <span className="text-[10px] text-gray-400 block">Inspection Fee</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Date & Slot Picker */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full text-xs font-semibold text-gray-900 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Time Slot
                    </label>
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="w-full text-xs font-semibold text-gray-900 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Midday)</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Address & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Service Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs text-gray-900 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Phone Number (OTP Verification)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs text-gray-900 border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#002970] hover:bg-[#081e4c] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} className="text-[#00b9f5]" />
                  {isSubmitting ? 'Confirming with Partner Center...' : 'Confirm Booking (Paytm Protected)'}
                </button>
              </form>
            </div>

            {/* Right 1 Col: Transparent Pricing & Paytm Care Shield Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2">
                  Pricing & Coverage Estimate
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Doorstep Visit & Diagnosis</span>
                    <span>₹299</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Paytm Care Shield Member Discount</span>
                    <span>- ₹100</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Parts & Repair Guarantee</span>
                    <span className="text-gray-400">90 Days Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-black text-gray-900 text-sm">
                    <span>Estimated Visit Due</span>
                    <span className="text-[#002970]">₹199</span>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <ShieldCheck size={14} /> Paytm Genuine Guarantee
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Only OEM authorized parts used. All repairs logged directly to your Digital Asset Ledger.
                  </p>
                </div>
              </div>

              {/* Commission & Merchant Ecosystem Note */}
              <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-bold text-[#002970] text-xs flex items-center gap-1">
                  <Tag size={13} className="text-[#00b9f5]" />
                  Paytm O2O Marketplace Partner
                </span>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Paytm partners with 1,200+ authorized brand repair hubs and local merchants across India, ensuring standard rates and guaranteed turnaround.
                </p>
              </div>
            </div>
          </div>
        )
      ) : (
        /* My Active Bookings View */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <Wrench size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No active service bookings found.</p>
              <button
                onClick={() => setActiveSubTab('book')}
                className="mt-3 text-xs bg-[#002970] text-white font-bold px-4 py-2 rounded-xl"
              >
                Book a Technician Now
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#00b9f5] uppercase tracking-wider">
                      Reference: {booking.id}
                    </span>
                    <h3 className="font-black text-base text-gray-900">{booking.device_name}</h3>
                    <p className="text-xs text-gray-500">Service: {booking.service_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-blue-100 text-[#002970] px-3 py-1 rounded-full">
                      Status: {booking.status}
                    </span>
                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto text-[10px]">
                      ✓
                    </div>
                    <span className="font-bold text-gray-800 text-[11px] block">Confirmed</span>
                    <span className="text-[10px] text-gray-400">Order Placed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#002970] text-white font-bold flex items-center justify-center mx-auto text-[10px]">
                      2
                    </div>
                    <span className="font-bold text-gray-800 text-[11px] block">Tech Assigned</span>
                    <span className="text-[10px] text-gray-500">{booking.technician_name}</span>
                  </div>
                  <div className="space-y-1 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center mx-auto text-[10px]">
                      3
                    </div>
                    <span className="font-semibold text-gray-600 text-[11px] block">Diagnosis</span>
                    <span className="text-[10px] text-gray-400">Doorstep Visit</span>
                  </div>
                  <div className="space-y-1 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center mx-auto text-[10px]">
                      4
                    </div>
                    <span className="font-semibold text-gray-600 text-[11px] block">Completed</span>
                    <span className="text-[10px] text-gray-400">Logbook Updated</span>
                  </div>
                </div>

                {/* Technician & Appointment Info */}
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-gray-500">Assigned Technician:</span>
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <UserCheck size={14} className="text-[#002970]" />
                      {booking.technician_name} ({booking.technician_phone})
                    </div>
                    <div className="text-[11px] text-gray-500">
                      📅 {booking.scheduled_date} at {booking.scheduled_slot}
                    </div>
                  </div>
                  <div className="bg-white border px-3 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">Handover OTP</span>
                    <span className="font-mono text-base font-black text-emerald-600 tracking-wider">
                      {booking.otp || '4829'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

