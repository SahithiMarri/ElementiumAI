import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore } from '../../store/labStore'

export default function Notebook() {
  const { notebookEntries, isNotebookOpen, toggleNotebook, flask, isCompleted } = useLabStore()

  // Hide when completion card is shown
  if (isCompleted) return null

  return (
    <div className="absolute top-16 right-5 z-20 pointer-events-auto">
      {/* Toggle Button */}
      <button
        onClick={toggleNotebook}
        className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-200 hover:border-sky-300 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-lg transition-all"
      >
        <span>📓</span>
        <span>Lab Notebook</span>
        {notebookEntries.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
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
            className="mt-2.5 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl p-4 text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📝</span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Observation Notebook
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Automated Practical Data Log</p>
                </div>
              </div>
              <button
                onClick={toggleNotebook}
                className="text-slate-400 hover:text-slate-700 text-xs p-1 rounded-md hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Entries List */}
            <div className="notebook-entries max-h-72 overflow-y-auto space-y-2 text-xs pr-1">
              {notebookEntries.length === 0 ? (
                <div className="text-center py-6 text-slate-400 italic">
                  No observations logged yet. Start setting up apparatus to see records automatically populate here.
                </div>
              ) : (
                notebookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-2.5 rounded-xl border text-[11px] leading-relaxed transition-all ${
                      entry.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                        : entry.type === 'observation'
                        ? 'bg-sky-50 border-sky-200 text-sky-900 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mb-1">
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
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-slate-600 font-mono mb-1">
                  <span>Sample Volume (V₁):</span>
                  <span className="text-slate-900 font-bold">25.0 mL</span>
                </div>
                <div className="flex justify-between text-slate-600 font-mono mb-1">
                  <span>EDTA Molarity (M₂):</span>
                  <span className="text-slate-900 font-bold">0.01 M</span>
                </div>
                <div className="flex justify-between text-slate-600 font-mono">
                  <span>Titre Volume (V₂):</span>
                  <span className="text-sky-700 font-bold">
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
