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
    <div className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-[#fbf4e8] rounded-3xl border border-[#d9c3a0] p-7 shadow-2xl relative overflow-hidden text-[#3d2b1c]"
      >
        {/* Celebration Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-[#f0dcb8] text-[#a9713a] text-2xl flex items-center justify-center mx-auto mb-2 border border-[#d9c3a0] shadow-md"
          >
            🎉
          </motion.div>
          <h2 className="text-xl font-black text-[#3d2b1c] mb-0.5">
            Practical Completed Successfully!
          </h2>
          <p className="text-xs text-[#a9713a] font-bold uppercase tracking-wider">
            Estimation of Hardness of Water by EDTA Method
          </p>
        </div>

        {/* Observation & Calculations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Data Card */}
          <div className="bg-[#f4e8d8]/80 rounded-2xl p-3.5 border border-[#d9c3a0]">
            <h3 className="text-xs font-bold text-[#3d2b1c] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>📊</span> Titration Parameters
            </h3>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#8a7052] border-b border-[#d9c3a0]/60 pb-1">
                <span>Sample Volume (V₁):</span>
                <span className="text-[#3d2b1c] font-bold">{vWater.toFixed(1)} mL</span>
              </div>
              <div className="flex justify-between text-[#8a7052] border-b border-[#d9c3a0]/60 pb-1">
                <span>EDTA Molarity (M₂):</span>
                <span className="text-[#3d2b1c] font-bold">{mEdta} M</span>
              </div>
              <div className="flex justify-between text-[#8a7052] border-b border-[#d9c3a0]/60 pb-1">
                <span>Indicator:</span>
                <span className="text-[#3d2b1c] font-bold">Eriochrome Black T</span>
              </div>
              <div className="flex justify-between text-[#8a7052] border-b border-[#d9c3a0]/60 pb-1">
                <span>Initial Complex:</span>
                <span className="text-rose-700 font-bold">Wine Red</span>
              </div>
              <div className="flex justify-between text-[#8a7052]">
                <span>Endpoint Color:</span>
                <span className="text-teal-800 font-bold">Permanent Pure Blue</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#ecdbc0]/70 rounded-2xl p-3.5 border border-[#d9c3a0] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#a9713a] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>⚗️</span> Derived Results
              </h3>
              <div className="text-center py-1.5">
                <div className="text-xs text-[#8a7052] mb-0.5 font-medium">Total Water Hardness</div>
                <div className="text-3xl font-black text-[#3d2b1c] font-mono">
                  {totalHardness} <span className="text-sm font-bold text-[#8a7052]">ppm</span>
                </div>
                <div className="text-[10px] text-[#8a7052] font-mono mt-0.5">
                  (mg/L CaCO₃ equivalent)
                </div>
              </div>
            </div>

            <div className="bg-[#fbf4e8] rounded-xl p-2 text-[10px] text-[#3d2b1c] font-mono text-center border border-[#d9c3a0] font-semibold">
              Hardness = (V₂ × M₂ × 100,000) / V₁
            </div>
          </div>
        </div>

        {/* Observation log preview */}
        <div className="bg-[#f4e8d8]/80 rounded-2xl p-3 border border-[#d9c3a0] mb-5 max-h-28 overflow-y-auto text-xs space-y-1">
          <div className="text-[10px] text-[#8a7052] font-bold uppercase tracking-wider mb-1">
            Activity Log ({notebookEntries.length} items recorded)
          </div>
          {notebookEntries.map((e) => (
            <div key={e.id} className="text-[10px] text-[#3d2b1c] flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold">✓</span>
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
            className="flex-1 secondary-button text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <span>🔄</span> Restart Experiment
          </button>
          <button
            onClick={() => {
              resetExperiment()
              navigate('/dashboard')
            }}
            className="flex-1 primary-button text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <span>📊</span> Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
