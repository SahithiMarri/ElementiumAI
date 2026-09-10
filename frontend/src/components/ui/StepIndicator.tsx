import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore, type ExperimentStep } from '../../store/labStore'
import exp01 from '../../experiments/exp01_edta/config'

const STEP_ORDER: ExperimentStep[] = [
  'SETUP_APPARATUS',
  'PREPARE_SAMPLE',
  'ADD_BUFFER',
  'ADD_INDICATOR',
  'FILL_BURETTE',
  'PERFORM_TITRATION',
]

export default function StepIndicator() {
  const {
    currentStep,
    startExperiment,
    experimentStarted,
    apparatus,
    placeApparatus,
    flask,
    burette,
    isCompleted,
  } = useLabStore()

  const [isMinimized, setIsMinimized] = useState(false)

  // Don't render behind result screen
  if (isCompleted) return null

  const currentStepIndex = STEP_ORDER.indexOf(currentStep as any)
  const currentStepConfig = exp01.steps.find((s) => s.id === currentStep)
  const progressPercent =
    currentStep === 'ENDPOINT_REACHED' || currentStep === 'COMPLETED'
      ? 100
      : currentStepIndex >= 0
      ? Math.round((currentStepIndex / STEP_ORDER.length) * 100)
      : 0

  return (
    <div className="absolute top-14 left-4 z-20 w-72 sm:w-80 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-slate-200 shadow-xl pointer-events-auto text-slate-900"
      >
        {/* Header with Title, Progress & Minimize Toggle */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🧪</span>
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
              {experimentStarted ? 'Workflow' : 'Ready'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              {progressPercent}%
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-slate-700 text-xs p-1 rounded-md hover:bg-slate-100 transition-colors"
              title={isMinimized ? 'Expand Workflow' : 'Minimize Workflow'}
            >
              {isMinimized ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {!experimentStarted || currentStep === 'IDLE' ? (
                <div className="text-center py-1">
                  <p className="text-[11px] text-slate-600 mb-2 leading-snug">
                    Learn EDTA complexometric titration to estimate water hardness.
                  </p>
                  <button
                    onClick={() => {
                      startExperiment()
                    }}
                    className="w-full btn-primary text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Start Experiment
                  </button>
                </div>
              ) : (
                <div>
                  {/* Step Title Badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                      {currentStepIndex >= 0
                        ? `Step ${currentStepIndex + 1}/${STEP_ORDER.length}`
                        : 'Done'}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {currentStepConfig?.title.split('—')[1] || currentStepConfig?.title || 'Experiment Complete'}
                    </h3>
                  </div>

                  {/* Instruction Box */}
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-medium mb-2">
                    {currentStepConfig?.instruction}
                  </div>

                  {/* Step 1 Checklist */}
                  {currentStep === 'SETUP_APPARATUS' && (
                    <div className="space-y-1 bg-slate-100/70 p-2 rounded-xl border border-slate-200 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <span>{apparatus.buretteStand.placed ? '✅' : '⚪'}</span>
                          <span>1. Burette Stand</span>
                        </span>
                        {!apparatus.buretteStand.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('buretteStand', 'standZone', [-0.8, 0.82, 0.6])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-bold"
                          >
                            + Place
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <span>{apparatus.burette.placed ? '✅' : '⚪'}</span>
                          <span>2. Burette</span>
                        </span>
                        {apparatus.buretteStand.placed && !apparatus.burette.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('burette', 'buretteZone', [-0.8, 3.52, 0.72])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-bold"
                          >
                            + Affix
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <span>{apparatus.conicalFlask.placed ? '✅' : '⚪'}</span>
                          <span>3. Conical Flask</span>
                        </span>
                        {apparatus.burette.placed && !apparatus.conicalFlask.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('conicalFlask', 'flaskZone', [-0.8, 0.82, 0.72])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-bold"
                          >
                            + Place
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Titration Live Metrics */}
                  {currentStep === 'PERFORM_TITRATION' && (
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-sky-50/70 p-2 rounded-xl border border-sky-100 font-mono">
                      <div>
                        <span className="text-slate-500">EDTA: </span>
                        <span className="text-sky-700 font-bold">
                          {(flask.edtaAdded * 15.0).toFixed(1)} mL
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Burette: </span>
                        <span className="text-teal-700 font-bold">
                          {(burette.liquidLevel * 50).toFixed(1)} mL
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
