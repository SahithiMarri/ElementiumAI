import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// ─── Experiment Card ──────────────────────────────────────────────────────────
interface ExpCardProps {
  number: number
  title: string
  isAvailable: boolean
  onClick?: () => void
}

function ExpCard({ number, title, isAvailable, onClick }: ExpCardProps) {
  return (
    <motion.div
      whileHover={isAvailable ? { y: -3, scale: 1.01 } : {}}
      className={`rounded-xl p-5 border transition-all duration-200 ${
        isAvailable
          ? 'bg-white/90 backdrop-blur-sm border-[#d9c3a0] shadow-sm hover:shadow-md hover:border-[#a9713a] cursor-pointer'
          : 'bg-[#ecdbc0]/40 border-[#d9c3a0]/50 opacity-60'
      }`}
      onClick={isAvailable ? onClick : undefined}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isAvailable ? 'bg-[#a9713a] text-white' : 'bg-[#d9c3a0] text-[#8a7052]'
          }`}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${isAvailable ? 'text-[#3d2b1c]' : 'text-[#8a7052]'}`}>
            {title}
          </p>
          {!isAvailable && (
            <span className="inline-block mt-2.5 text-[11px] px-2.5 py-0.5 rounded-full bg-[#d9c3a0]/40 text-[#8a7052] font-medium">
              Coming Soon
            </span>
          )}
          {isAvailable && (
            <span className="inline-block mt-2.5 text-[11px] px-2.5 py-0.5 rounded-full bg-[#a9713a]/10 text-[#a9713a] border border-[#a9713a]/30 font-medium">
              Ready to Launch
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  const experiments = [
    { title: 'Estimation of Hardness of Water by EDTA Method', available: true },
    { title: 'Preparation and Standardisation of NaOH Solution', available: false },
    { title: 'Estimation of Acetic Acid in Vinegar', available: false },
    { title: 'Determination of COD of Water Sample', available: false },
    { title: 'Spectrophotometric Determination of Iron', available: false },
    { title: 'Estimation of Dissolved Oxygen', available: false },
    { title: 'pH Titration of Amino Acids', available: false },
    { title: 'Conductometric Titration', available: false },
  ]

  return (
    <div className="min-h-screen bg-[#f4e8d8] relative overflow-hidden text-[#3d2b1c] font-sans">
      {/* ─── Very Transparent Chemistry Lab Background ────────────────────── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.14] bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/lab-bg.svg')`,
        }}
      />
      {/* Subtle radial ambient highlight */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(169,113,58,0.12),transparent_70%)]" />

      {/* ─── Sleek Header Navigation ───────────────────────────────────────── */}
      <header className="relative z-10 border-b border-[#d9c3a0]/60 bg-[#f4e8d8]/85 backdrop-blur-md sticky top-0">
        <div className="flex items-center justify-between px-6 lg:px-12 py-3.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#a9713a] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ⚗
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#3d2b1c] block leading-tight">
                Elementium AI - VNR VJIET
              </span>
              {/* <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a7052]">
                VNR VJIET
              </span> */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#3d2b1c] bg-[#ecdbc0]/80 hover:bg-[#ecdbc0] border border-[#d9c3a0] transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/lab/exp01_edta')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#a9713a] hover:bg-[#8e5c2b] shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>🧪</span> Launch Lab
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-16 pb-20 px-6 lg:px-12 text-center max-w-5xl mx-auto">
        {/* Academic Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#d9c3a0] text-[#8a7052] text-xs font-semibold mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#a9713a]" />
          Interactive 3D Virtual Chemistry Laboratory
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-[#3d2b1c]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          ELEMENTIUM AI<br />
          <span className="text-[#a9713a]"></span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg text-[#8a7052] mb-8 font-normal max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Perform quantitative volumetric analysis, EDTA titrations, and chemical experiments with real-time feedback and AI laboratory assistance.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-3.5 justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => navigate('/lab/exp01_edta')}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#a9713a] hover:bg-[#8e5c2b] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>🚀</span> Enter EDTA Laboratory
          </button>
          <button
            onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#3d2b1c] bg-white/90 hover:bg-white border border-[#d9c3a0] shadow-sm transition-all"
          >
            🔬 Browse Curriculum
          </button>
        </motion.div>

        {/* Sleek Feature Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-12 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            '360° Photorealistic Lab',
            'Authentic Glassware Physics',
            'Live Wine Red → Steel Blue Endpoint',
            'AI Lab Assistant',
            'Automated Observation Notebook',
          ].map((item) => (
            <span
              key={item}
              className="px-3 py-1 rounded-md text-xs font-medium bg-white/70 border border-[#d9c3a0]/80 text-[#5a4430] shadow-2xs"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ─── Highlights Section ────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: '🧪',
              title: 'Curriculum-Aligned Experiments',
              desc: 'Built specifically for standard undergraduate engineering chemistry practicals with accurate stoichiometric models.',
            },
            {
              icon: '⚗️',
              title: 'Interactive 3D Glassware',
              desc: 'Direct drag-and-drop apparatus assembly, precise chemical pouring, and responsive color-changing titration kinetics.',
            },
            {
              icon: '🤖',
              title: 'Intelligent AI Guidance',
              desc: 'Context-aware AI mentor provides guidance, detects procedural errors, and explains reaction mechanisms in real time.',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#d9c3a0] shadow-xs"
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="text-sm font-bold text-[#3d2b1c] mb-1.5">{card.title}</h3>
              <p className="text-xs text-[#8a7052] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Catalogue Section ─────────────────────────────────────────────── */}
      <section id="catalogue" className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#3d2b1c] tracking-tight">Experiment Catalogue</h2>
          <p className="text-xs text-[#8a7052] mt-1">Select an experiment to begin virtual lab practice</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {experiments.map((exp, i) => (
            <ExpCard
              key={i}
              number={i + 1}
              title={exp.title}
              isAvailable={exp.available}
              onClick={exp.available ? () => navigate('/lab/exp01_edta') : undefined}
            />
          ))}
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#d9c3a0]/60 bg-[#f4e8d8]/90 py-6 px-6 lg:px-12 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a7052]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#3d2b1c]">Elementium AI</span>
            <span>•</span>
            <span>Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology</span>
          </div>
          <p>© 2026 Elementium AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
