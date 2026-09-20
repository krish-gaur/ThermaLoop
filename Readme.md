# ThermaLoop — Intelligent Cooling Optimization for Commercial Buildings

> **Autonomous Supervisory Chiller Plant Intelligence & Constrained Optimization Engine**  
> Built for commercial facilities (IT tech parks, hospitals, airports, and commercial real estate).

---

## 1. Product Overview

ThermaLoop is an enterprise climate-tech platform that integrates with central chilled-water HVAC plants to uncover hidden thermo-hydraulic inefficiencies, eliminate **Low $\Delta T$ Syndrome**, and execute physics-informed setpoint co-optimization without requiring expensive hardware replacements.

### Core Value Proposition
- **Detect:** Continuous telemetry monitoring via non-invasive BACnet/IP and Modbus protocols.
- **Diagnose:** Automatic identification of Low $\Delta T$ collapses, flow bypassing, and premature chiller staging.
- **Optimize:** Constrained thermodynamic solver (Gordon-Ng part-load modeling + pump affinity laws) recommending optimal supply temperatures, pump frequencies, and machine staging.
- **Explain:** Dedicated industrial AI Operations Copilot grounded strictly in real plant telemetry with tool calling.
- **Quantify:** Audit-ready IPMVP Option B energy, cost, and carbon reduction calculations.

---

## 2. System Architecture

```
                            ┌─────────────────────────────────────────┐
                            │    Frontend: Next.js 16+ / React / TS   │
                            │  - Port 3000                            │
                            │  - Digital Twin Animated SVG Schematic  │
                            │  - High-density Industrial Cockpit      │
                            │  - AI Operations Copilot                │
                            └────────────────────┬────────────────────┘
                                                 │
                                                 │ REST API (/api/v1)
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │      Backend: FastAPI / Python 3.11+    │
                            │  - Port 8000                            │
                            │  - Physics-Informed Simulation Engine   │
                            │  - Constrained Optimization Engine      │
                            │  - Anomaly Diagnostic Engine            │
                            │  - ThermaLoop Intelligence Agent        │
                            └─────────────────────────────────────────┘
```

---

## 3. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (v20+ recommended)
- **npm**: `v9.0.0` or higher
- **Python**: `3.10` or higher (3.11+ recommended)
- **pip**: Python package manager
- **Git** (optional, for cloning)

---

## 4. Step-by-Step Setup from Scratch

### Step 1: Clone or Navigate to the Repository

```bash
cd /path/to/project
```

The repository structure should look like this:
```
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes (/plant, /optimization, /ai, etc.)
│   │   ├── core/         # Config and database sessions
│   │   ├── models/       # SQLAlchemy ORM entities
│   │   ├── schemas/      # Pydantic validation models
│   │   ├── services/     # Simulation, Optimization, Anomaly, AI Agent
│   │   └── main.py       # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router (page.tsx, globals.css)
│   │   ├── components/   # Dashboard, Digital Twin, Delta-T, AI Copilot, etc.
│   │   └── types/        # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts    # Configured with proxy rewrites to :8000
└── README.md
```

---

### Step 2: Backend Setup (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment (recommended):**
   ```bash
   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install required Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic httpx python-multipart numpy scipy
   ```

4. **(Optional) Configure Environment Variables:**
   Create an optional `.env` file in `backend/`:
   ```env
   PROJECT_NAME=ThermaLoop
   VERSION=1.0.0
   DATABASE_URL=sqlite:///./thermaloop.db
   # Optional: Add your OpenAI API key for live external LLM generation
   # If left blank, ThermaLoop uses its built-in deterministic operations copilot
   OPENAI_API_KEY=
   LLM_MODEL=gpt-4o-mini
   ```

5. **Start the FastAPI Backend Server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   - **Backend API:** `http://localhost:8000`
   - **Interactive Swagger Docs:** `http://localhost:8000/docs`
   - **Health Check:** `http://localhost:8000/health`

---

### Step 3: Frontend Setup (Next.js)

Open a **new terminal tab/window**:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Verify Next.js API Proxy Configuration:**
   Ensure `frontend/next.config.ts` includes the API rewrite (already included in the repo):
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     reactStrictMode: true,
     async rewrites() {
       return [
         {
           source: "/api/v1/:path*",
           destination: "http://127.0.0.1:8000/api/v1/:path*",
         },
       ];
     },
   };

   export default nextConfig;
   ```

4. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```

   *(Or build and run in production mode: `npm run build && npm run start`)*

5. **Open the Application in your browser:**
   ```
   http://localhost:3000
   ```

---

## 5. Navigating the Hackathon Demo Flow (3 Minutes)

When presenting to judges, follow this sequence:

| Step | Tab / Screen | What to Demonstrate | Key Talking Point |
|---|---|---|---|
| **1. The Problem** | **Executive Overview** | Point to the 1,000 TR facility drawing **489 kW** with hydronic $\Delta T$ critically collapsed at **2.8°C** (vs 5.5°C design). | *"85% of commercial buildings in India waste up to 30% of cooling energy due to Low $\Delta T$ syndrome."* |
| **2. The Diagnosis** | **ΔT Intelligence** | Show the -49% deficit, the excess circulation (+96% GPM), and the root causes (AHU valve bypass leaks). | *"The BMS falsely thinks the building needs more cooling and starts an extra 500-ton chiller unnecessarily."* |
| **3. The AI Copilot** | **ThermaLoop Copilot** | Click the suggested prompt *"Why is ΔT low?"* and watch the agent cite exact plant values and execute diagnostic tools. | *"Our copilot reasons strictly over structured plant telemetry—it does not hallucinate sensor numbers."* |
| **4. The Optimization** | **Constrained Optimizer** | Click **Run Optimization**. Watch the sequence re-tune CHW Supply (6.0°C $\to$ 6.8°C), modulate pump VFD (94% $\to$ 76%), and de-stage Chiller 02. | *"Instantaneous power drops from 489 kW to 351 kW—a 28.2% drop while strictly preserving comfort."* |
| **5. The Wow Climax** | **Digital Twin** | Toggle between *Current State* and *Optimized State*. Watch the return water flow turn from cold-blue to warm-amber and Chiller 02 de-stage. | *"Zero CapEx, zero hardware installations, and immediate BACnet/IP compatibility."* |
| **6. The Impact** | **Impact & Verification** | Review the 12-month seasonal profile: **580,000+ kWh saved**, **₹60+ Lakhs cost reduction**, and **415 tCO₂e avoided**. | *"Audit-ready under IPMVP Option B with payback in under 4 months."* |

---

## 6. Available Demo Scenarios

In the top header bar, select from 5 realistic plant operating scenarios:
1. **Low $\Delta T$ Event (Default):** Severe secondary bypass, flow collapse to 2.8°C, 2 chillers running at poor 51% load.
2. **Normal Balanced:** Nominal ASHRAE conditions, 5.4°C $\Delta T$, optimal part-load operation.
3. **Summer Peak (42°C):** Extreme heatwave afternoon requiring 92% plant capacity.
4. **Excessive Pumping:** Pumps locked at 98% (50 Hz) despite partial 440 TR building cooling load.
5. **Chiller Degradation:** Condenser tube fouling on Chiller 02 elevating specific power to 0.92 kW/TR.

---

## 7. Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/plant/overview` | Executive metrics, scenario metadata, and recent anomalies |
| `GET` | `/api/v1/plant/telemetry` | Full instantaneous thermodynamic readings and equipment status |
| `GET` | `/api/v1/anomalies` | Detected anomalies categorized by severity (Critical / Warning / Advisory) |
| `POST` | `/api/v1/optimization/run` | Executes the constrained thermodynamic solver and returns setpoint vectors |
| `POST` | `/api/v1/ai/chat` | Interacts with the ThermaLoop AI Operations Copilot |
| `POST` | `/api/v1/scenarios/apply` | Switches active simulation scenario (`low_delta_t`, `normal`, `high_load`, etc.) |
| `GET` | `/api/v1/impact` | 12-month projected energy, financial (₹), and emissions calculations |
| `POST` | `/api/v1/reports/generate` | Generates a standardized plant engineering audit report |

---

## 8. Troubleshooting

- **CORS or Connection Issues:** Ensure the backend is running on `http://localhost:8000`. The frontend forwards `/api/v1/*` requests via Next.js rewrites.
- **Port Conflicts:**
  - If port 8000 is occupied: `uvicorn app.main:app --port 8001` (update rewrite destination in `frontend/next.config.ts`).
  - If port 3000 is occupied: `npm run dev -- -p 3001`.
- **Missing Dependencies:** Run `pip install -r requirements.txt` (or install manually as listed in Step 2) and `npm install` inside `frontend/`.
