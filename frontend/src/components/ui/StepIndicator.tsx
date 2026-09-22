import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore, type ExperimentStep } from '../../store/labStore'
import exp01 from '../../experiments/exp01_edta/config'

const STEP_ORDER: ExperimentStep[] = [
  'WEAR_PPE',
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
    ppe,
    wearPPE,
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
    <div className="absolute top-3 left-3 z-20 w-72 sm:w-80 max-w-[calc(100vw-24px)] pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fbf4e8]/95 backdrop-blur-xl rounded-2xl p-3.5 border border-[#d9c3a0] shadow-xl pointer-events-auto text-[#3d2b1c]"
      >
        {/* Header with Title, Progress & Minimize Toggle */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🧪</span>
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#a9713a]">
              {experimentStarted ? 'Workflow' : 'Ready'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#8a7052] font-bold">
              {progressPercent}%
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[#8a7052] hover:text-[#3d2b1c] text-xs p-1 rounded-md hover:bg-[#ecdbc0]/60 transition-colors"
              title={isMinimized ? 'Expand Workflow' : 'Minimize Workflow'}
            >
              {isMinimized ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className="h-1.5 w-full bg-[#ecdbc0] rounded-full overflow-hidden mb-2 border border-[#d9c3a0]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c9973f] to-[#a9713a] rounded-full"
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
                  <p className="text-[11px] text-[#8a7052] mb-2 leading-snug">
                    Learn EDTA complexometric titration to estimate water hardness.
                  </p>
                  <button
                    onClick={() => {
                      startExperiment()
                    }}
                    className="w-full primary-button text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Start Experiment
                  </button>
                </div>
              ) : (
                <div>
                  {/* Step Title Badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#f0dcb8] text-[#3d2b1c] border border-[#d9c3a0]">
                      {currentStepIndex >= 0
                        ? `Step ${currentStepIndex + 1}/${STEP_ORDER.length}`
                        : 'Done'}
                    </span>
                    <h3 className="text-xs font-bold text-[#3d2b1c] truncate">
                      {currentStepConfig?.title.split('—')[1] || currentStepConfig?.title || 'Experiment Complete'}
                    </h3>
                  </div>

                  {/* Instruction Box */}
                  <div className="bg-[#f4e8d8]/80 rounded-xl p-2 border border-[#d9c3a0] text-[11px] text-[#3d2b1c] leading-relaxed font-medium mb-2">
                    {currentStepConfig?.instruction}
                  </div>

                  {/* Safety Gear Checklist */}
                  {currentStep === 'WEAR_PPE' && (
                    <div className="space-y-1 bg-[#ecdbc0]/50 p-2 rounded-xl border border-[#d9c3a0] text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#3d2b1c] font-medium">
                          <span>{ppe.apron ? '✅' : '⚪'}</span>
                          <span>1. Brown Lab Apron</span>
                        </span>
                        {!ppe.apron && (
                          <button
                            onClick={() => wearPPE('apron')}
                            className="px-1.5 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[9px] font-bold"
                          >
                            + Wear
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#3d2b1c] font-medium">
                          <span>{ppe.gloves ? '✅' : '⚪'}</span>
                          <span>2. Nitrile Gloves</span>
                        </span>
                        {!ppe.gloves && (
                          <button
                            onClick={() => wearPPE('gloves')}
                            className="px-1.5 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[9px] font-bold"
                          >
                            + Wear
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apparatus Checklist */}
                  {currentStep === 'SETUP_APPARATUS' && (
                    <div className="space-y-1 bg-[#ecdbc0]/50 p-2 rounded-xl border border-[#d9c3a0] text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#3d2b1c] font-medium">
                          <span>{apparatus.buretteStand.placed ? '✅' : '⚪'}</span>
                          <span>1. Burette Stand</span>
                        </span>
                        {!apparatus.buretteStand.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('buretteStand', 'standZone', [-0.8, 0.82, 0.6])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[9px] font-bold"
                          >
                            + Place
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#3d2b1c] font-medium">
                          <span>{apparatus.burette.placed ? '✅' : '⚪'}</span>
                          <span>2. Burette</span>
                        </span>
                        {apparatus.buretteStand.placed && !apparatus.burette.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('burette', 'buretteZone', [-0.8, 3.52, 0.72])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[9px] font-bold"
                          >
                            + Affix
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#3d2b1c] font-medium">
                          <span>{apparatus.conicalFlask.placed ? '✅' : '⚪'}</span>
                          <span>3. Conical Flask</span>
                        </span>
                        {apparatus.burette.placed && !apparatus.conicalFlask.placed && (
                          <button
                            onClick={() =>
                              placeApparatus('conicalFlask', 'flaskZone', [-0.8, 0.82, 0.72])
                            }
                            className="px-1.5 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[9px] font-bold"
                          >
                            + Place
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Titration Live Metrics */}
                  {currentStep === 'PERFORM_TITRATION' && (
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-[#f0dcb8]/60 p-2 rounded-xl border border-[#d9c3a0] font-mono">
                      <div>
                        <span className="text-[#8a7052]">EDTA: </span>
                        <span className="text-[#a9713a] font-bold">
                          {(flask.edtaAdded * 15.0).toFixed(1)} mL
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8a7052]">Burette: </span>
                        <span className="text-teal-800 font-bold">
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
