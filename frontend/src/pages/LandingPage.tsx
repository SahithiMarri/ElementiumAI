import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// ─── Floating Molecule Canvas (Light theme) ───────────────────────────────────
function FloatingMolecules() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Chemistry symbols floating
    const symbols = ['H₂O', 'Ca²⁺', 'Mg²⁺', 'EDTA', 'pH', 'EBT', 'CO₃²⁻', 'OH⁻', '⚗', '🧪', 'Na⁺', 'Cl⁻']
    const particles: { x: number; y: number; vx: number; vy: number; sym: string; opacity: number; size: number }[] = []

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        sym: symbols[Math.floor(Math.random() * symbols.length)],
        opacity: Math.random() * 0.25 + 0.12,
        size: Math.random() * 14 + 11,
      })
    }

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.strokeStyle = `rgba(2, 132, 199, ${0.12 * (1 - dist / 160)})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw symbols
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(2, 132, 199, ${p.opacity})`
        ctx.font = `600 ${p.size}px 'Inter', monospace`
        ctx.fillText(p.sym, p.x, p.y)

        p.x += p.vx
        p.y += p.vy

        if (p.x < -60) p.x = canvas.width + 60
        if (p.x > canvas.width + 60) p.x = -60
        if (p.y < -40) p.y = canvas.height + 40
        if (p.y > canvas.height + 40) p.y = -40
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

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
      whileHover={isAvailable ? { scale: 1.02, y: -4 } : {}}
      className={`rounded-2xl p-5 border transition-all duration-300 ${
        isAvailable
          ? 'bg-white border-sky-200 shadow-md hover:shadow-xl hover:border-sky-400 cursor-pointer'
          : 'bg-slate-100/70 border-slate-200 opacity-60'
      }`}
      onClick={isAvailable ? onClick : undefined}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isAvailable ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
          }`}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${isAvailable ? 'text-slate-800' : 'text-slate-500'}`}>
            {title}
          </p>
          {!isAvailable && (
            <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-500 font-medium">
              Coming Soon
            </span>
          )}
          {isAvailable && (
            <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 font-medium">
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
    <div className="min-h-screen bg-hero-gradient relative overflow-hidden text-slate-900">
      <FloatingMolecules />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚗</span>
          <span className="text-xl font-extrabold text-gradient">Elementium AI (VNR VJIET) </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/lab/exp01_edta')}
            className="btn-primary"
          >
            Launch Lab
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse-slow" />
            Interactive 3D Virtual Chemistry Laboratory
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl sm:text-7xl font-black mb-4 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-slate-900">Elementium </span>
            <span className="text-gradient">AI</span>
          </motion.h1>

          <motion.p
            className="text-lg text-slate-600 mb-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Curriculum-Based Virtual Practical Platform
          </motion.p>

          <motion.p
            className="text-2xl sm:text-3xl font-light text-slate-700 mb-10 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            "Learn Chemistry by Performing{' '}
            <span className="text-sky-600 font-semibold">Experiments Virtually.</span>"
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => navigate('/lab/exp01_edta')}
              className="btn-primary text-base px-8 py-4 rounded-2xl flex items-center gap-2"
            >
              <span>🚀</span> Enter the Laboratory
            </button>
            <button
              onClick={() => document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4 rounded-2xl"
            >
              🔬 Explore Experiments
            </button>
          </motion.div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2.5 mt-14 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {['360° 3D Laboratory', 'Drag & Drop Apparatus', 'Live Color Reactions', 'Gemini AI Guidance', 'Mistake Detection', 'Automated Notebook'].map((f) => (
            <span key={f} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 border border-slate-200 text-slate-700 shadow-sm">
              {f}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features Strip */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔬',
              title: 'Immersive 3D Lab',
              desc: 'Freely navigate a realistic 3D laboratory. Pick up glassware, pour chemicals, and observe authentic reactions in real time.',
            },
            {
              icon: '🤖',
              title: 'AI-Guided Learning',
              desc: 'Your personal Gemini-powered lab assistant provides step-by-step guidance, answers questions, and corrects mistakes instantly.',
            },
            {
              icon: '⚗️',
              title: 'Real Chemical Reactions',
              desc: 'Simulates genuine complexometric transitions from wine red to sharp permanent blue with accurate endpoint physics.',
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-7 border border-slate-200"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experiments List */}
      <section id="experiments" className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Experiment Catalogue</h2>
          <p className="text-slate-600">VNR VJIET chemistry lab at your finger tips!</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {experiments.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <ExpCard
                number={i + 1}
                title={exp.title}
                isAvailable={exp.available}
                onClick={exp.available ? () => navigate('/dashboard') : undefined}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 py-8 px-8 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 Elementium AI — Intelligent Virtual Chemistry Laboratory. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
