# AI Crop Guardian 🌾
**Intelligent Agriculture Decision-Support & Proactive Intelligence Platform (Full-Stack MERN)**

> 🌐 **LIVE DEMO SERVER (CLICK TO VIEW LIVE)**: **[https://kisan-crop-guardian-r6y3.vercel.app](https://kisan-crop-guardian-r6y3.vercel.app)**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online%20(HTTPS)-emerald?style=for-the-badge&logo=googlechrome&logoColor=white)](https://kisan-crop-guardian-r6y3.vercel.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ishanarora0901/kisan-crop-guardian)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ishanarora0901/kisan-crop-guardian)

> **USP**: *"Don't wait for the crop problem to happen. Predict the risk early, take preventive action, and make smarter decisions to improve expected profitability."*
>
> **Core Philosophy**: **DETECT → PREDICT → PREVENT → OPTIMIZE → VERIFY → CONSULT**

---

## 🔗 Instant Live Access Links

| Module | Direct Live URL | Description |
| :--- | :--- | :--- |
| 🌾 **Farmer Command Center** | **[Live Web App](https://kisan-crop-guardian-r6y3.vercel.app/login)** | Real-time crop health score (81/100), soil telemetry, weather anomalies & proactive alerts |
| 🛡️ **Dedicated Admin Operations Portal** | **[Admin Portal](https://kisan-crop-guardian-r6y3.vercel.app/admin)** | Regional platform KPIs, emergency broadcast dispatcher, user management, blockchain ledger |
| 📜 **Blockchain Crop Passport Verifier** | **[Public Verifier](https://kisan-crop-guardian-r6y3.vercel.app/verify/CROP-PASS-WHEAT-2026)** | Cryptographic SHA-256 tamper-proof ledger & Merkle verification for buyers & banks |
| 🔬 **AI Vision Leaf Disease Scanner** | **[Disease Scanner](https://kisan-crop-guardian-r6y3.vercel.app/disease-scanner)** | Instant computer vision diagnosis with 88% confidence score & specialist referral |
| 📊 **Financial & What-If Simulator** | **[What-If Simulator](https://kisan-crop-guardian-r6y3.vercel.app/what-if-simulator)** | Multi-season comparison (+₹15,000 profit gain) and crop-to-crop sensitivity engine |
| 💬 **Specialist Consultation Advisory** | **[Consultations](https://kisan-crop-guardian-r6y3.vercel.app/consultations)** | Agronomist review queue, direct messaging & digitally signed ICAR prescriptions |

---

## 👥 1-Click Demo Personas & Credentials

On the login page, simply click any of the **Quick Demo Login Buttons**:

| Persona | Role | Email | Password | Primary Feature Access |
| :--- | :--- | :--- | :--- | :--- |
| **Harpreet Singh** | Farmer | `farmer@cropguardian.ai` | `password123` | Farm Command Center, Disease Scanner, What-If Simulator, Passport |
| **Dr. Ramesh Sharma** | Specialist | `specialist@cropguardian.ai` | `password123` | Consultation Queue, Pathological Review, Prescription Issuer |
| **Chief Agri Officer** | Admin | `admin@cropguardian.ai` | `adminpassword123` | Dedicated Admin Portal (`/admin`), Broadcast Dispatcher, Blockchain Ledger |

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

## 🚀 Deployment & Cloud Configuration Guide

### 🗄️ 1. MongoDB Atlas Configuration (`MONGODB_URI`)
To enable full persistent database storage on your deployment:
1. Create a free account & cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user (e.g. username: `admin`, password: `<your-password>`).
3. Under **Network Access**, click **Add IP Address** -> select **Allow Access From Anywhere (`0.0.0.0/0`)**.
4. In **Clusters** -> click **Connect** -> **Drivers** -> Copy your connection string.
5. Set `MONGODB_URI` as an environment variable in your cloud service settings:
   ```env
   MONGODB_URI=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/cropguardian?retryWrites=true&w=majority
   ```

---

### 📦 2. Production Build Architecture (Frontend Build-Time & Backend Serving)
In production deployments, the frontend is compiled at **image-build time** with Vite (`frontend/dist`) and served directly by the high-performance Node.js backend. This eliminates running Vite dev servers in production and prevents port conflicts.

#### **Option A: Docker Multi-Stage Container (Recommended for Containers)**
The repository includes a production multi-stage [Dockerfile](file:///Dockerfile) that compiles the frontend and packages the backend:
```bash
# Build the production container
docker build -t ai-crop-guardian .

# Run container with your MongoDB Atlas URI
docker run -p 5000:5000 -e MONGODB_URI="mongodb+srv://admin:pass@cluster0.xxxxx.mongodb.net/cropguardian?retryWrites=true&w=majority" ai-crop-guardian
```

#### **Option B: Render (Unified Full-Stack Service)**
1. Deploy using the included [`render.yaml`](file:///render.yaml).
2. In the Render Dashboard -> **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/cropguardian?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
3. Build Command: `cd backend && npm install && cd ../frontend && npm install && npm run build`
4. Start Command: `node backend/server.js`

#### **Option C: Vercel (1-Click Static + Serverless / Standalone)**
1. Fork or import this repository into your Vercel account.
2. Build command: `cd frontend && npm install && npm run build`
3. Output directory: `frontend/dist`
4. Deployed URL automatically routes API requests and features seamless client-side simulated data fallback.

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
