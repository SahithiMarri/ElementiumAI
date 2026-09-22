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
            className="w-80 sm:w-96 bg-[#fbf4e8]/95 backdrop-blur-2xl rounded-2xl border border-[#d9c3a0] shadow-2xl overflow-hidden flex flex-col mb-3 text-[#3d2b1c]"
          >
            {/* Header */}
            <div className="bg-[#ecdbc0]/80 p-3 border-b border-[#d9c3a0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#a9713a] flex items-center justify-center text-sm shadow-sm text-white font-bold">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3d2b1c] flex items-center gap-1.5">
                    Elementium AI Tutor
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  </h4>
                  <p className="text-[9px] text-[#8a7052] font-medium">Contextual Lab Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8a7052] hover:text-[#3d2b1c] text-xs p-1 rounded hover:bg-[#d9c3a0]/50 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="p-3 max-h-60 overflow-y-auto space-y-2 text-xs bg-[#fbf4e8]">
              {aiMessages.length === 0 ? (
                <div className="text-[#8a7052] text-center py-4 leading-relaxed">
                  👋 Hello! I am your AI Chemistry Lab Assistant. I will guide you through each step and explain the chemistry principles.
                </div>
              ) : (
                aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl text-xs leading-relaxed font-medium shadow-2xs ${
                      msg.type === 'correction'
                        ? 'bg-rose-100 border border-rose-300 text-rose-950'
                        : msg.type === 'explanation'
                        ? 'bg-[#f0dcb8] border border-[#d9c3a0] text-[#3d2b1c]'
                        : msg.type === 'success'
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
                        : 'bg-white/80 border border-[#d9c3a0] text-[#3d2b1c]'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}

              {isAITyping && (
                <div className="flex items-center gap-1.5 p-1.5 text-[#8a7052] text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a9713a] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a9713a] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a9713a] animate-bounce [animation-delay:0.4s]" />
                  <span>AI Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chemistry Inquiry Chips */}
            <div className="px-2.5 py-1.5 bg-[#ecdbc0]/60 border-t border-[#d9c3a0] flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => sendExplanation('ebt')}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-[#f0dcb8] text-[9px] text-[#3d2b1c] font-semibold border border-[#d9c3a0] whitespace-nowrap transition-colors"
              >
                ❓ Wine Red
              </button>
              <button
                onClick={() => sendExplanation('edta')}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-[#f0dcb8] text-[9px] text-[#3d2b1c] font-semibold border border-[#d9c3a0] whitespace-nowrap transition-colors"
              >
                ❓ EDTA Chelation
              </button>
              <button
                onClick={() => sendExplanation('buffer')}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-[#f0dcb8] text-[9px] text-[#3d2b1c] font-semibold border border-[#d9c3a0] whitespace-nowrap transition-colors"
              >
                ❓ pH 10 Buffer
              </button>
              <button
                onClick={() => sendExplanation('endpoint')}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-[#f0dcb8] text-[9px] text-[#3d2b1c] font-semibold border border-[#d9c3a0] whitespace-nowrap transition-colors"
              >
                ❓ Blue Endpoint
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleAskQuestion}
              className="p-2 bg-[#ecdbc0] border-t border-[#d9c3a0] flex gap-1.5"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask AI about reactions..."
                className="flex-1 bg-white border border-[#d9c3a0] rounded-lg px-2.5 py-1 text-xs text-[#3d2b1c] placeholder-[#8a7052] focus:outline-none focus:border-[#a9713a]"
              />
              <button
                type="submit"
                className="primary-button text-xs py-1 px-3 rounded-lg"
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
          className="bg-[#fbf4e8] border border-[#d9c3a0] hover:border-[#a9713a] rounded-full px-3.5 py-2 shadow-xl text-[#3d2b1c] flex items-center gap-2 group transition-all"
        >
          <span className="text-base">🤖</span>
          <span className="text-xs font-bold text-[#3d2b1c] group-hover:text-[#a9713a] pr-1">
            AI Tutor
          </span>
        </motion.button>
      )}
    </div>
  )
}
