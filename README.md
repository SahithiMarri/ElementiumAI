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

