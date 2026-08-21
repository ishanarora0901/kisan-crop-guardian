# AI Crop Guardian 🌾

**AI Crop Guardian** is an intelligent agriculture decision-support platform designed to transition farmers from reactive farming to proactive, data-driven, and more profitable agriculture.

> **USP**: *"Don't wait for the crop problem to happen. Predict the risk early, take preventive action, and make smarter decisions to improve expected profitability."*
>
> **Core Philosophy**: **DETECT → PREDICT → PREVENT → OPTIMIZE → VERIFY → CONSULT**

---

## 🌟 Key Capabilities & Architecture

1. **Proactive AI Crop Risk Prediction Engine**:
   - Ingests Crop Type, Variety, Age, Growth Stage, Soil NPK, pH, Moisture, Historical Outbreaks, and Live Weather Telemetry.
   - Computes a weighted **Crop Health Score (0–100)** and risk severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Generates 6 specific risk vectors: **Disease Risk**, **Pest Risk**, **Water Stress Risk**, **Heat Stress Risk**, **Heavy Rainfall Risk**, and **Expected Yield Loss Risk**.

2. **Early Warning Notification System**:
   - Dispatches proactive alerts before pathogens sporulate or weather anomalies damage root zones.
   - Outlines contributing factors, probability %, expected time window, and preventive precautions.

3. **Historical Crop Intelligence System**:
   - Retains multi-season farm memory.
   - Triggers `⚠️ HISTORICAL RISK ALERT` when current microclimatic patterns match past disease or yield-loss events.

4. **AI Computer Vision Disease Scanner**:
   - Upload leaf/stem/fruit photos or capture via mobile camera.
   - Computer vision diagnostic engine identifies disease, confidence score (e.g., 87%), visible symptoms, causes, and preventive protocols with one-click specialist referral.

5. **Financial Analytics & What-If Crop Simulator**:
   - Side-by-side comparison: **Last Season Actuals** vs **Current Season AI Estimates**.
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

Quick 1-click login buttons are provided on the login page:

| Persona | Role | Email | Password | Primary Feature Access |
| :--- | :--- | :--- | :--- | :--- |
| **Harpreet Singh** | Farmer | `farmer@cropguardian.ai` | `password123` | Farm Command Center, Disease Scanner, What-If Simulator, Passport |
| **Dr. Ramesh Sharma** | Specialist | `specialist@cropguardian.ai` | `password123` | Consultation Queue, Pathological Review, Prescription Issuer |
| **Chief Agri Officer** | Admin | `admin@cropguardian.ai` | `adminpassword123` | Dedicated Admin Portal (`/admin`), Broadcast Dispatcher, Blockchain Ledger |

---

## 🚀 Running the Application Locally

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **npm**: v9+

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
```
*Note: The backend automatically connects to MongoDB Atlas if `MONGODB_URI` is specified in `backend/.env`. If omitted, it automatically starts an in-memory MongoDB instance pre-seeded with realistic agricultural data.*

- **Backend Health Check**: `http://localhost:5000/api/health`

### 2. Start the Frontend React Client
```bash
cd frontend
npm install
npm run dev
```
- **Web App URL**: `http://localhost:3000/`
- **Admin Portal**: `http://localhost:3000/admin`
- **Public Passport Verifier**: `http://localhost:3000/verify/CROP-PASS-WHEAT-2026`

---

## 📊 Verification & Automated Test Suite

Run the automated integration test suite covering all 18 endpoints and agronomic formulas:
```bash
cd backend
node utils/verifySystem.js
```
Expected output:
```
🎉 ALL TESTS COMPLETED: 18 PASSED, 0 FAILED
```
