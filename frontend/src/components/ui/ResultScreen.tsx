import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLabStore } from '../../store/labStore'

export default function ResultScreen() {
  const navigate = useNavigate()
  const { resetExperiment, notebookEntries } = useLabStore()

  const vWater = 25.0
  const mEdta = 0.01
  const vEdta = 15.0
  const totalHardness = Math.round((vEdta * mEdta * 100000) / vWater)

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden text-slate-900"
      >
        {/* Celebration Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto mb-3 border border-emerald-300 shadow-md shadow-emerald-100"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            Experiment Completed!
          </h2>
          <p className="text-xs text-sky-700 font-bold uppercase tracking-wider">
            Estimation of Hardness of Water by EDTA Method
          </p>
        </div>

        {/* Observation & Calculations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Data Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>📊</span> Titration Parameters
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-1">
                <span>Sample Volume (V₁):</span>
                <span className="text-slate-900 font-bold">{vWater.toFixed(1)} mL</span>
              </div>
              <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-1">
                <span>EDTA Molarity (M₂):</span>
                <span className="text-slate-900 font-bold">{mEdta} M</span>
              </div>
              <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-1">
                <span>Indicator:</span>
                <span className="text-slate-900 font-bold">Eriochrome Black T</span>
              </div>
              <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-1">
                <span>Initial Color:</span>
                <span className="text-rose-600 font-bold">Wine Red</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Endpoint Color:</span>
                <span className="text-sky-600 font-bold">Permanent Pure Blue</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/80 rounded-2xl p-4 border border-sky-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>⚗️</span> Derived Results
              </h3>
              <div className="text-center py-2">
                <div className="text-xs text-slate-500 mb-0.5 font-medium">Total Water Hardness</div>
                <div className="text-4xl font-black text-sky-700 font-mono">
                  {totalHardness} <span className="text-sm font-bold text-slate-500">ppm</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  (mg/L CaCO₃ equivalent)
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-2 text-[10px] text-slate-700 font-mono text-center border border-sky-200 shadow-2xs font-semibold">
              Hardness = (V₂ × M₂ × 100,000) / V₁
            </div>
          </div>
        </div>

        {/* Observation log preview */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-6 max-h-32 overflow-y-auto text-xs space-y-1.5">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Activity Log ({notebookEntries.length} items recorded)
          </div>
          {notebookEntries.map((e) => (
            <div key={e.id} className="text-[11px] text-slate-700 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{e.text}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              resetExperiment()
            }}
            className="flex-1 btn-secondary text-xs py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <span>🔄</span> Restart Experiment
          </button>
          <button
            onClick={() => {
              resetExperiment()
              navigate('/dashboard')
            }}
            className="flex-1 btn-primary text-xs py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <span>📊</span> Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
