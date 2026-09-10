import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore } from '../../store/labStore'

export default function MistakeAlert() {
  const { mistakeMessage, showMistake, clearMistake } = useLabStore()

  useEffect(() => {
    if (showMistake) {
      const timer = setTimeout(() => {
        clearMistake()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [showMistake])

  return (
    <AnimatePresence>
      {showMistake && mistakeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 pointer-events-auto"
        >
          <div className="bg-white border-2 border-rose-400 shadow-2xl backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 text-slate-900">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
              ⚠️
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-rose-700 uppercase tracking-wider mb-0.5">
                Mistake Detected
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {mistakeMessage}
              </p>
            </div>
            <button
              onClick={clearMistake}
              className="text-slate-400 hover:text-slate-700 text-xs p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
