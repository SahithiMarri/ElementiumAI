import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const experiments = [
  {
    id: 'exp01_edta',
    number: 1,
    title: 'Estimation of Hardness of Water by EDTA Method',
    category: 'Complexometric Titration',
    difficulty: 'Intermediate',
    duration: '45 min',
    available: true,
    skills: ['Burette Setup', 'Buffer pH 10', 'EBT Chelation', 'Endpoint Swirl'],
    description: 'Estimate total water hardness (Ca²⁺/Mg²⁺) using standard disodium EDTA with Eriochrome Black-T indicator at pH 10.',
  },
  {
    id: 'exp02_standardisation',
    number: 2,
    title: 'Standardisation of NaOH using Oxalic Acid',
    category: 'Acid-Base Titration',
    difficulty: 'Beginner',
    duration: '35 min',
    available: false,
    skills: ['Primary Standard', 'Phenolphthalein', 'Neutralization'],
    description: 'Determine exact molarity of sodium hydroxide solution against primary standard oxalic acid dihydrate.',
  },
  {
    id: 'exp03_acetic_acid',
    number: 3,
    title: 'Estimation of Acetic Acid in Commercial Vinegar',
    category: 'Applied Analysis',
    difficulty: 'Beginner',
    duration: '40 min',
    available: false,
    skills: ['Aliquot Dilution', 'Acidity Factor', 'Volumetric Flask'],
    description: 'Quantify percentage purity and concentration of acetic acid in commercial retail vinegar samples.',
  },
  {
    id: 'exp04_cod',
    number: 4,
    title: 'Chemical Oxygen Demand (COD) of Wastewater',
    category: 'Environmental Chemistry',
    difficulty: 'Advanced',
    duration: '60 min',
    available: false,
    skills: ['Reflux Digestion', 'FAS Back Titration', 'Ferroin Indicator'],
    description: 'Determine organic pollutant load by potassium dichromate oxidation in concentrated sulfuric acid medium.',
  },
  {
    id: 'exp05_spectro',
    number: 5,
    title: 'Spectrophotometric Determination of Iron',
    category: 'Instrumental Methods',
    difficulty: 'Intermediate',
    duration: '50 min',
    available: false,
    skills: ['1,10-Phenanthroline', 'Beer-Lambert Law', 'Calibration Curve'],
    description: 'Colorimetric analysis of trace Fe(II) complex at 510 nm wavelength using standard spectrophotometer.',
  },
  {
    id: 'exp06_conductometry',
    number: 6,
    title: 'Conductometric Titration of Strong Acid vs Strong Base',
    category: 'Physical Chemistry',
    difficulty: 'Intermediate',
    duration: '40 min',
    available: false,
    skills: ['Conductivity Cell', 'Ionic Mobility', 'Equivalence Graph'],
    description: 'Track electrolytic conductance changes during HCl-NaOH neutralization to find sharp equivalence point.',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const filteredExperiments = activeTab === 'all'
    ? experiments
    : activeTab === 'titration'
    ? experiments.filter((e) => e.category.toLowerCase().includes('titration'))
    : experiments.filter((e) => e.available)

  return (
    <div className="app-shell" style={{ background: 'var(--bg)' }}>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="brand mb-6">
          <span className="brand-icon">⚗️</span>
          <div>
            <div className="leading-none">
              ELEMENTIUM <span className="brand-ai">LAB</span>
            </div>
            <small>VIRTUAL PRACTICAL SUITE</small>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-[9px] uppercase tracking-wider font-bold text-stone-500 px-3 mb-2">
          Practical Modules
        </div>
        <nav className="space-y-1 mb-6">
          <button className="nav-item selected">
            <span>🔬</span>
            <span>All Experiments</span>
          </button>
          <button onClick={() => navigate('/lab/exp01_edta')} className="nav-item">
            <span>💧</span>
            <span>EDTA Titration</span>
            <span className="ml-auto text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
              Active
            </span>
          </button>
          <button className="nav-item">
            <span>📓</span>
            <span>Lab Notebook</span>
          </button>
          <button className="nav-item">
            <span>🤖</span>
            <span>AI Lab Assistant</span>
          </button>
        </nav>

        {/* Scientist Level Card */}
        <div className="mt-auto">
          <div className="scientist-card">
            <div className="level-emblem">
              <span className="text-sm font-bold">L1</span>
            </div>
            <div className="flex-1">
              <small>STUDENT SCIENTIST</small>
              <strong className="text-[10px] text-stone-800">Undergraduate Chemist</strong>
            </div>
            <div className="progress-track mt-2">
              <i style={{ width: '25%' }} />
            </div>
            <div className="flex justify-between w-full text-[8px] text-stone-600 mt-1">
              <span>EDTA Module: Ready</span>
              <span>1 / 6 Modules</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Shell ──────────────────────────────────────────────────── */}
      <div className="main-shell">
        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>Curriculum</span>
            <span>/</span>
            <strong>Chemistry Practicals</strong>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
              <span className="online-dot" />
              <span>Interactive 3D Engine Online</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          {/* Page Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">
                Curriculum Practical Syllabus
              </div>
              <h1 className="text-2xl font-bold text-stone-900">
                Undergraduate Chemistry Laboratory
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Complete realistic 3D volumetric analysis, qualitative reactions, and physical chemistry experiments with automated observation tracking.
              </p>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-stone-300/80 bg-stone-200/50 mb-8">
            <div className="p-3 bg-white/80 rounded-lg border border-stone-200">
              <div className="text-xs text-stone-500 font-semibold">Available Module</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-1">1 Active</div>
              <div className="text-[10px] text-stone-500 mt-0.5">EDTA Hardness Practical</div>
            </div>
            <div className="p-3 bg-white/80 rounded-lg border border-stone-200">
              <div className="text-xs text-stone-500 font-semibold">Syllabus Modules</div>
              <div className="text-xl font-bold font-mono text-stone-800 mt-1">6 Practicals</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Undergraduate Chemistry</div>
            </div>
            <div className="p-3 bg-white/80 rounded-lg border border-stone-200">
              <div className="text-xs text-stone-500 font-semibold">Simulation Realism</div>
              <div className="text-xl font-bold font-mono text-stone-800 mt-1">3D Physics</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Drag, Pour & Titrate</div>
            </div>
            <div className="p-3 bg-white/80 rounded-lg border border-stone-200">
              <div className="text-xs text-stone-500 font-semibold">AI Lab Assistant</div>
              <div className="text-xl font-bold font-mono text-sky-800 mt-1">Gemini 2.0</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Live Practical Guidance</div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-stone-300 pb-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Practicals ({experiments.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'active'
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              Ready to Perform (1)
            </button>
            <button
              onClick={() => setActiveTab('titration')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'titration'
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              Titration Experiments
            </button>
          </div>

          {/* Experiment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <motion.div
                key={exp.id}
                whileHover={exp.available ? { y: -3 } : {}}
                className={`flex flex-col justify-between rounded-xl p-5 border shadow-sm transition-all ${
                  exp.available
                    ? 'bg-white border-stone-300 hover:border-stone-500 hover:shadow-md'
                    : 'bg-stone-100/70 border-stone-200 opacity-75'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[10px] font-bold text-stone-700 font-mono">
                      EXP {String(exp.number).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        exp.available
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {exp.available ? 'Ready to Perform' : 'Coming Soon'}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {exp.category}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {exp.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[9px] text-stone-600 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-stone-200 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">⏱ {exp.duration}</span>
                  {exp.available ? (
                    <button
                      onClick={() => navigate(`/lab/${exp.id}`)}
                      className="primary-button text-xs py-2 px-4"
                    >
                      <span>🚀</span> Enter 3D Lab
                    </button>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-medium italic">
                      Locked
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
