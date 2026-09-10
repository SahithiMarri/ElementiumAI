# ⚗️ Elementium AI — Intelligent Virtual Chemistry Laboratory

Elementium AI is an interactive, 3D web-based Virtual Chemistry Laboratory built for curriculum-aligned practical learning. Built with **React 18**, **Three.js / React Three Fiber**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **FastAPI** with **MongoDB Atlas** and **Google Gemini AI**.

---

## 🌟 Key Features

- **360° 3D Laboratory Exploration**: OrbitControls with rotate, pan, and zoom around a fully rendered virtual laboratory.
- **Low-GPU Optimization**: Procedurally generated Three.js geometry with lightweight `MeshStandardMaterial` for smooth performance on standard laptops.
- **Drag-and-Drop Apparatus System**: Drag burette stands, burettes, and conical flasks directly onto the workbench with snapping physics.
- **Dynamic Chemical Reactions & Color Change Engine**: Smooth multi-stage chemical transitions (`Wine Red` ➔ `Purple` ➔ `Permanent Pure Blue`) during titration.
- **Interactive Titration & Swirling**: Real-time droplet animation with interactive stopcock flow control and flask swirling mechanics.
- **Gemini-Powered AI Tutor**: Real-time contextual guidance, concept explanations (EBT complex, EDTA chelation, buffer role), and mistake feedback.
- **Rule-Based Mistake Detection Engine**: Enforces correct experimental sequence and safety protocols with error prevention alerts.
- **Automated Observation Notebook**: Auto-records all reagent volumes, observations, and timestamps without manual data entry.
- **Automated Calculations & Results Screen**: Automatic hardness derivation in ppm CaCO₃ equivalent upon reaching the endpoint.
- **Extensible Architecture**: Experiment configuration data pattern allows adding Experiments 2–8 without modifying core engine logic.

---

## 🚀 Quick Start (Local Setup)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 2. Backend Setup (Optional for Demo Mode)

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/elementium_ai?retryWrites=true&w=majority
DATABASE_NAME=elementium_ai
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the FastAPI backend:
```bash
uvicorn app.main:app --reload --port 8000
```

---

## ☁️ Deployment Guide

### Deploying Frontend to Vercel

1. Push the code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset: **Vite**.
6. Build Command: `npm run build`.
7. Output Directory: `dist`.
8. Add Environment Variable:
   - `VITE_BACKEND_URL`: URL of your deployed backend (e.g. `https://your-backend.railway.app`).
9. Click **Deploy**.

### Deploying Backend to Railway / Render

1. Connect your repository on [Railway](https://railway.app) or [Render](https://render.com).
2. Set Root Directory to `backend`.
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add Environment Variables:
   - `MONGODB_URL`: Your MongoDB Atlas URI.
   - `DATABASE_NAME`: `elementium_ai`.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
