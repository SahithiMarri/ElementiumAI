import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore } from '../../store/labStore'

export default function Notebook() {
  const { notebookEntries, isNotebookOpen, toggleNotebook, flask, isCompleted } = useLabStore()

  // Hide when completion card is shown
  if (isCompleted) return null

  return (
    <div className="absolute top-3 right-3 z-20 pointer-events-auto">
      {/* Toggle Button */}
      <button
        onClick={toggleNotebook}
        className="bg-[#fbf4e8]/95 backdrop-blur-md rounded-xl px-3 py-1.5 border border-[#d9c3a0] hover:border-[#a9713a] text-xs font-bold text-[#3d2b1c] flex items-center gap-1.5 shadow-lg transition-all"
      >
        <span>📓</span>
        <span>Lab Notebook</span>
        {notebookEntries.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#a9713a] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
            {notebookEntries.length}
          </span>
        )}
      </button>

      {/* Dockable Slide-Down Panel */}
      <AnimatePresence>
        {isNotebookOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-[#fbf4e8]/95 backdrop-blur-2xl rounded-2xl border border-[#d9c3a0] shadow-2xl p-3.5 text-[#3d2b1c]"
          >
            <div className="flex items-center justify-between border-b border-[#d9c3a0] pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">📝</span>
                <div>
                  <h3 className="text-xs font-extrabold text-[#3d2b1c] uppercase tracking-wider">
                    Observation Notebook
                  </h3>
                  <p className="text-[9px] text-[#8a7052] font-medium">Automated Practical Data Log</p>
                </div>
              </div>
              <button
                onClick={toggleNotebook}
                className="text-[#8a7052] hover:text-[#3d2b1c] text-xs p-1 rounded hover:bg-[#ecdbc0]"
              >
                ✕
              </button>
            </div>

            {/* Entries List */}
            <div className="notebook-entries max-h-60 overflow-y-auto space-y-1.5 text-xs pr-1">
              {notebookEntries.length === 0 ? (
                <div className="text-center py-4 text-[#8a7052] italic text-[11px]">
                  No observations logged yet. Apparatus placements and reagent additions will record automatically here.
                </div>
              ) : (
                notebookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-2 rounded-xl border text-[10px] leading-relaxed transition-all ${
                      entry.type === 'success'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-medium'
                        : entry.type === 'observation'
                        ? 'bg-[#f0dcb8] border-[#d9c3a0] text-[#3d2b1c] font-medium'
                        : 'bg-white/80 border-[#d9c3a0] text-[#3d2b1c]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] text-[#8a7052] font-mono mb-0.5">
                      <span className="font-bold">{entry.step}</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div>{entry.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* Titration Live Reading Summary */}
            {flask.edtaAdded > 0 && (
              <div className="mt-2.5 pt-2 border-t border-[#d9c3a0] text-[10px] bg-[#ecdbc0]/70 p-2 rounded-xl border border-[#d9c3a0]">
                <div className="flex justify-between text-[#8a7052] font-mono mb-0.5">
                  <span>Sample Volume (V₁):</span>
                  <span className="text-[#3d2b1c] font-bold">25.0 mL</span>
                </div>
                <div className="flex justify-between text-[#8a7052] font-mono mb-0.5">
                  <span>EDTA Molarity (M₂):</span>
                  <span className="text-[#3d2b1c] font-bold">0.01 M</span>
                </div>
                <div className="flex justify-between text-[#8a7052] font-mono">
                  <span>Titre Volume (V₂):</span>
                  <span className="text-[#a9713a] font-bold">
                    {(flask.edtaAdded * 15.0).toFixed(1)} mL
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
