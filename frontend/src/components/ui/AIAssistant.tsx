import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLabStore } from '../../store/labStore'
import { useAIAssistant } from '../../hooks/useAIAssistant'

export default function AIAssistant() {
  const { aiMessages, isAITyping, currentStep, isCompleted } = useLabStore()
  const { sendGuidance, sendExplanation } = useAIAssistant()
  const [isOpen, setIsOpen] = useState(true)
  const [inputQuestion, setInputQuestion] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Trigger guidance whenever the step updates
  useEffect(() => {
    if (currentStep !== 'IDLE') {
      sendGuidance(currentStep)
    }
  }, [currentStep])

  // Scroll to bottom of message stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, isAITyping])

  // Do not show behind result screen
  if (isCompleted) return null

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputQuestion.trim()) return

    const q = inputQuestion.toLowerCase()
    if (q.includes('ebt') || q.includes('indicator') || q.includes('red') || q.includes('wine')) {
      sendExplanation('ebt')
    } else if (q.includes('edta') || q.includes('complex') || q.includes('chelat')) {
      sendExplanation('edta')
    } else if (q.includes('hard') || q.includes('calcium') || q.includes('magnesium')) {
      sendExplanation('hardness')
    } else if (q.includes('buffer') || q.includes('ph') || q.includes('ammonia')) {
      sendExplanation('buffer')
    } else if (q.includes('end') || q.includes('blue') || q.includes('color') || q.includes('colour')) {
      sendExplanation('endpoint')
    } else {
      sendGuidance(currentStep, inputQuestion)
    }
    setInputQuestion('')
  }

  return (
    <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col mb-3 text-slate-900"
          >
            {/* Header */}
            <div className="bg-slate-50/90 p-3.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm shadow-sm text-white font-bold">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Elementium AI Tutor
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Contextual Lab Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="p-3.5 max-h-64 overflow-y-auto space-y-2.5 text-xs bg-white">
              {aiMessages.length === 0 ? (
                <div className="text-slate-500 text-center py-4 leading-relaxed">
                  👋 Hello! I am your AI Chemistry Lab Assistant. I will guide you through each step and explain the chemistry principles.
                </div>
              ) : (
                aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs leading-relaxed font-medium shadow-sm ${
                      msg.type === 'correction'
                        ? 'bg-rose-50 border border-rose-200 text-rose-800'
                        : msg.type === 'explanation'
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                        : msg.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}

              {isAITyping && (
                <div className="flex items-center gap-1.5 p-2 text-slate-400 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                  <span>AI Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chemistry Inquiry Chips */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => sendExplanation('ebt')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 text-[10px] text-slate-600 font-semibold border border-slate-200 whitespace-nowrap transition-colors shadow-2xs"
              >
                ❓ Why Wine Red?
              </button>
              <button
                onClick={() => sendExplanation('edta')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 text-[10px] text-slate-600 font-semibold border border-slate-200 whitespace-nowrap transition-colors shadow-2xs"
              >
                ❓ EDTA Chelation
              </button>
              <button
                onClick={() => sendExplanation('buffer')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 text-[10px] text-slate-600 font-semibold border border-slate-200 whitespace-nowrap transition-colors shadow-2xs"
              >
                ❓ Role of Buffer
              </button>
              <button
                onClick={() => sendExplanation('endpoint')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 text-[10px] text-slate-600 font-semibold border border-slate-200 whitespace-nowrap transition-colors shadow-2xs"
              >
                ❓ Endpoint
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleAskQuestion}
              className="p-2.5 bg-slate-100/80 border-t border-slate-200 flex gap-1.5"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask AI about reactions or reagents..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="bg-white border border-slate-200 hover:border-sky-400 rounded-full px-4 py-2.5 shadow-xl text-slate-800 flex items-center gap-2 group transition-all"
        >
          <span className="text-lg">🤖</span>
          <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 pr-1">
            AI Assistant
          </span>
        </motion.button>
      )}
    </div>
  )
}
