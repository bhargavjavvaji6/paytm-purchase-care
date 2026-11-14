# Paytm Purchase Care Hub

> **A Strategic Shift from Pure Transactional Commerce to Lifelong Product & Appliance Management.**

The **Paytm Purchase Care Hub** transforms Paytm into the user's default platform for managing electronics, home appliances, and smart gadgets long after the initial payment is completed. By providing post-purchase lifecycle care, Paytm drives multi-year customer stickiness and unlocks lucrative O2O service commissions, insurance, and resale partnerships.

---

## 🚀 Core Mechanics & Business Value

### 1. Frictionless Asset Onboarding (AI Invoice Scanning)
* **Offline-to-Online Bridge:** Users snap a photo or upload crumpled paper bills, receipts, or PDFs from any merchant (Reliance Digital, Croma, Apple, Vijay Sales, Amazon).
* **Neural Vision OCR:** Automatically parses product model, brand, serial number, purchase date, invoice number, and calculates warranty expiration dates.
* **1-Click Testing:** Includes sample receipt presets for immediate demo.

### 2. Proactive Lifecycle Management (Dashboard & Recalls)
* **Central Purchase Dashboard:** Real-time visual warranty timelines, countdowns (<30 days alert), and active protection statuses.
* **Automated Recall Bulletins:** Direct manufacturer safety alerts (e.g., Samsung battery calibration updates, Apple 67W power plug exchange) with 0-cost remedy claims.
* **Paytm Care Shield Marketplace:** Monetizable AMC (Annual Maintenance Contracts) and Extended Warranty upsells.

### 3. Monetizable O2O (Online-to-Offline) Partnerships
* **Revenue Engine:** Paytm partners with authorized brand service networks (Samsung Care, LG Direct, Apple Authorized, Multi-Brand QuickRepair) earning commissions and referral fees.
* **Two Service Modes:** Verified Doorstep Technician visit or Authorized Center Drop-off appointment.
* **Live Stepper & Security OTP:** Transparent pricing, OTP verification for technician handover, and real-time status tracking.

### 4. Digital Asset Ledger & Resale Logbook
* **Verified Maintenance Passport:** Cryptographically logged service records, genuine parts certificates, and condition grades (A+ Mint, Good, Fair).
* **+15% to 25% Resale Value Premium:** Proving regular authorized maintenance commands higher market valuations.
* **1-Click Cashify Partner Sell:** Guaranteed valuation quote locked for 7 days with instant Paytm UPI payout upon doorstep pickup.

### 5. Vernacular AI Accessibility (Sarvam AI / Indus)
* **Multilingual Spoken AI:** Native support for Hindi (हिन्दी), English (India), Tamil, Telugu, Bengali, Marathi, Gujarati, and Kannada.
* **Conversational Intent Resolution:** Ask *"मेरी LG AC की वारंटी कब खत्म होगी?"* or *"Book repair for my AC"* to automatically highlight devices or launch booking flows.
* **Dual Audio Architecture:** Powered by **Sarvam AI TTS** with graceful fallback to browser Web Speech Synthesis for uninterrupted real-time vernacular audio.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, Tailwind CSS v4, Vite 8, Lucide React, Axios, Web Speech API
* **Backend:** FastAPI, Python 3.14, Pydantic v2, Uvicorn, Python-Multipart
* **AI & Voice Services:** Sarvam AI (`auras-tts` / `bulbul:v1`), Neural Optical OCR simulation
* **Data Layer:** In-memory reactive state with verified Indian appliances & electronics seed database

---

## 🏃 Running the Application

### Option A: 1-Click Script (Recommended on Windows)
Double-click `run_app.bat` or run in PowerShell:
```powershell
.\run_app.ps1
```

### Option B: Manual Startup

#### 1. Start the FastAPI Backend
```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```
API Documentation (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### 2. Start the React Frontend
```powershell
cd frontend
npm run dev
```
Open in browser: [http://localhost:5173](http://localhost:5173)

---

## 📱 Implementation Priority Completed

1. ✅ **Purchase Dashboard:** Visual warranty gauge, category filters, urgent expiration banners, digital invoice preview.
2. ✅ **AI Invoice Scanning:** Optical document upload, instant test presets, confidence rating, editable metadata form.
3. ✅ **Warranty & Recall Notifications:** Proactive expiry alerts, manufacturer safety bulletins, Care Shield AMC marketplace.
4. ✅ **Service-Centre Booking:** O2O partner directory, doorstep booking, transparent quote breakdown, live tracking stepper.
5. ✅ **Repair & Resale History:** Digital asset logbook, maintenance score, +15% verified ledger bonus, 1-click Cashify resale.
6. ✅ **Vernacular Sarvam AI Agent:** Spoken Hindi/English assistant with voice recognition and audio speech synthesis.

