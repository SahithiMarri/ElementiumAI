import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const experiments = [
  {
    id: 'exp01_edta',
    number: 1,
    title: 'Estimation of Hardness of Water by EDTA Method',
    type: 'Complexometric Titration',
    duration: '45 min',
    difficulty: 'Intermediate',
    available: true,
    color: 'from-sky-50 to-blue-50/60',
    borderColor: 'border-sky-300',
    accentColor: 'text-sky-700',
    icon: '💧',
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `exp0${i + 2}`,
    number: i + 2,
    title: [
      'Standardisation of NaOH Solution',
      'Estimation of Acetic Acid',
      'COD of Water Sample',
      'Spectrophotometric Fe Analysis',
      'Dissolved Oxygen Estimation',
      'pH Titration of Amino Acids',
      'Conductometric Titration',
    ][i],
    type: 'Coming Soon',
    duration: '—',
    difficulty: '—',
    available: false,
    color: 'from-slate-50 to-slate-100/60',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-400',
    icon: ['🧪', '🍶', '💧', '🔴', '🌊', '🧬', '⚡'][i],
  })),
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-lab-gradient flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">⚗</span>
          <div>
            <div className="text-base font-extrabold text-gradient">Elementium AI</div>
            <div className="text-xs text-slate-400">Virtual Chemistry Lab</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="space-y-1 flex-1">
          {[
            { icon: '🏠', label: 'Home', path: '/' },
            { icon: '📊', label: 'Dashboard', path: '/dashboard', active: true },
            { icon: '🔬', label: 'Experiments', path: '/dashboard' },
            { icon: '📓', label: 'Lab Notebook', path: '/dashboard' },
            { icon: '🤖', label: 'AI Tutor', path: '/dashboard' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                item.active
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="mt-auto pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-wider">
            Overall Progress
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-600">Experiments Done</span>
                <span className="text-sky-600 font-mono">0 / 8</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full rounded-full bg-sky-500 w-0" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Laboratory Dashboard</h1>
            <p className="text-slate-500 text-sm">
              Select an experiment to begin your hands-on virtual laboratory practical
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary text-slate-700 text-sm flex items-center gap-2"
          >
            <span>←</span> Back to Home
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Available', value: '1', icon: '✅', color: 'text-emerald-600' },
            { label: 'Completed', value: '0', icon: '🏆', color: 'text-amber-600' },
            { label: 'Coming Soon', value: '7', icon: '⏳', color: 'text-slate-500' },
            { label: 'Time Spent', value: '0h', icon: '⏱️', color: 'text-sky-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-black ${s.color} mb-0.5 font-mono`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Experiment Grid */}
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🔬</span> Available Chemistry Practicals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={exp.available ? { y: -4, scale: 1.01 } : {}}
              className={`relative rounded-2xl p-5 bg-gradient-to-br ${exp.color} border ${exp.borderColor} shadow-sm transition-all duration-300 ${
                exp.available ? 'cursor-pointer hover:shadow-md' : 'opacity-70'
              }`}
            >
              {/* Coming soon overlay */}
              {!exp.available && (
                <div className="absolute top-3.5 right-3.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-semibold">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Icon + number */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                    exp.available ? 'bg-white text-sky-600 border border-sky-100' : 'bg-slate-200/80 text-slate-400'
                  }`}
                >
                  {exp.icon}
                </div>
                <span className={`text-xs font-extrabold ${exp.accentColor}`}>
                  EXPERIMENT {String(exp.number).padStart(2, '0')}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-sm font-bold leading-snug mb-2 ${
                  exp.available ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {exp.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-5 font-medium">
                <span>{exp.type}</span>
                {exp.duration !== '—' && (
                  <>
                    <span>·</span>
                    <span>⏱ {exp.duration}</span>
                  </>
                )}
              </div>

              {/* Button */}
              {exp.available ? (
                <button
                  onClick={() => navigate(`/lab/${exp.id}`)}
                  className="w-full btn-primary text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>🚀</span> Start Experiment
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-200/80 text-slate-400 cursor-not-allowed"
                >
                  Curriculum Module Locked
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* AI Tutor quick chat widget */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-lg text-white shadow-md">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Elementium AI Tutor</h3>
              <p className="text-xs text-slate-500">Gemini-Powered Chemistry Guidance</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
              Online & Ready
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
            👋 Welcome! Click on <strong className="text-sky-700">Experiment 1</strong> above to launch the 3D lab. I'll guide you step-by-step through apparatus setup, buffer preparation, indicator addition, and titration endpoint detection!
          </div>
        </div>
      </main>
    </div>
  )
}
