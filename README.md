# AI Crop Guardian 🌾
**Intelligent Agriculture Decision-Support & Proactive Intelligence Platform (Full-Stack MERN)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ishanarora0901/kisan-crop-guardian)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ishanarora0901/kisan-crop-guardian)

> **USP**: *"Don't wait for the crop problem to happen. Predict the risk early, take preventive action, and make smarter decisions to improve expected profitability."*
>
> **Core Philosophy**: **DETECT → PREDICT → PREVENT → OPTIMIZE → VERIFY → CONSULT**

---

## 🚀 1-Click Live Deployment Instructions

### 1. Deploy Frontend on Vercel (Free & Instant)
1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/ishanarora0901/kisan-crop-guardian)** button above.
2. Sign in with GitHub and click **Deploy**.
3. Your live web app URL (e.g. `https://kisan-crop-guardian.vercel.app`) will be generated in under 60 seconds!

### 2. Deploy Full-Stack Backend on Render (Free)
1. Click the **[Deploy to Render](https://render.com/deploy?repo=https://github.com/ishanarora0901/kisan-crop-guardian)** button above.
2. Click **Apply** to automatically spin up both the Node.js API and static frontend from the included `render.yaml` blueprint.

---

## 🌟 Key Capabilities & Architecture

1. **Proactive AI Crop Risk Prediction Engine**:
   - Ingests Crop Type, Variety, Age, Growth Stage, Soil NPK, pH, Moisture, Historical Outbreaks, and Live Weather Telemetry.
   - Computes a weighted **Crop Health Score (0–100)** and risk severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Generates 6 specific risk vectors: **Disease Risk** (72%), **Pest Risk** (38%), **Water Stress Risk** (21%), **Heat Stress Risk** (54%), **Heavy Rainfall Risk** (67%), and **Expected Yield Loss Risk** (31%).

2. **Early Warning Notification System**:
   - Dispatches proactive alerts before pathogens sporulate or weather anomalies damage root zones.
   - Outlines contributing factors, probability %, expected time window, and preventive precautions.

3. **Historical Crop Intelligence System**:
   - Retains multi-season farm memory.
   - Triggers `⚠️ HISTORICAL RISK ALERT` when current microclimatic patterns match past disease or yield-loss events.

4. **AI Computer Vision Disease Scanner**:
   - Upload leaf/stem/fruit photos or capture via mobile camera.
   - Computer vision diagnostic engine identifies disease, confidence score (e.g., 88%), visible symptoms, causes, and preventive protocols with one-click specialist referral.

5. **Financial Analytics & What-If Crop Simulator**:
   - Side-by-side comparison: **Last Season Actuals** (₹40,000 profit) vs **Current Season AI Estimates** (₹55,000 profit, **+₹15,000 Potential Improvement**).
   - Formulas:
     $$\text{Total Revenue} = \text{Total Yield} \times \text{Selling Price}$$
     $$\text{Net Profit} = \text{Total Revenue} - \text{Total Cost}$$
   - "What-If" Sensitivity Simulator compares Crop A vs Crop B across yield, expenses, revenues, disease/weather resilience, and water demand.

6. **Blockchain-Based Farmer Crop Passport**:
   - Verifiable cryptographic timeline with SHA-256 block hashing and Merkle root calculation.
   - Public QR verification at `/verify/:passportId` for banks, grain buyers, and crop insurance certifiers.

7. **Agricultural Specialist Advisory Network**:
   - Verified agronomists review farmer requests, inspect AI vision scans, and issue official prescriptions.

8. **Dedicated Admin Operations Portal (`/admin`)**:
   - Platform KPIs, regional disease matrix, emergency broadcast alert dispatcher, user management, and blockchain ledger audit.

---

## 👥 Demo Personas & Pre-Configured Accounts

Quick 1-click login buttons are provided directly on the login page:

| Persona | Role | Email | Password | Primary Feature Access |
| :--- | :--- | :--- | :--- | :--- |
| **Harpreet Singh** | Farmer | `farmer@cropguardian.ai` | `password123` | Farm Command Center, Disease Scanner, What-If Simulator, Passport |
| **Dr. Ramesh Sharma** | Specialist | `specialist@cropguardian.ai` | `password123` | Consultation Queue, Pathological Review, Prescription Issuer |
| **Chief Agri Officer** | Admin | `admin@cropguardian.ai` | `adminpassword123` | Dedicated Admin Portal (`/admin`), Broadcast Dispatcher, Blockchain Ledger |

---

## 💻 Local Development Setup

### 1. Start Both Backend & Frontend in 1 Command
```bash
cd ai-crop-guardian
npm install
npm run dev
```
*(Or on Windows, simply double-click **`start.bat`**).*

- **Web App URL**: `http://localhost:3000/`
- **Admin Portal**: `http://localhost:3000/admin`
- **Public Passport Verifier**: `http://localhost:3000/verify/CROP-PASS-WHEAT-2026`
- **Backend Health Check**: `http://localhost:5000/api/health`

---

## 🧪 Automated Integration Tests (18/18 Passing)
```bash
cd backend
node utils/verifySystem.js
```
Expected output: `🎉 ALL TESTS COMPLETED: 18 PASSED, 0 FAILED`
