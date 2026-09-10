/**
 * AI Assistant Hook
 * Manages Gemini API calls via backend proxy, with fallback messages.
 */
import { useCallback } from 'react'
import { useLabStore, type ExperimentStep } from '../store/labStore'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Fallback messages per step (shown if backend is unavailable)
const FALLBACK_MESSAGES: Record<ExperimentStep, string> = {
  IDLE: 'Welcome to the EDTA Hardness Estimation lab! Click "Start Experiment" to begin.',
  SETUP_APPARATUS:
    'Set up your apparatus first. Drag the burette stand to the workbench, attach the burette, and place the conical flask.',
  PREPARE_SAMPLE:
    'Pick up the pipette, click on the Hard Water bottle to fill it, then transfer 25 mL into the conical flask.',
  ADD_BUFFER:
    'Click the Buffer Solution (pH 10) bottle and pour approximately 2 mL into the conical flask. The buffer maintains optimal pH for the indicator.',
  ADD_INDICATOR:
    'Add 2–3 drops of Eriochrome Black T. Watch the solution turn wine red — this is the EBT-metal complex forming!',
  FILL_BURETTE:
    'Fill the burette with the standard EDTA solution. Ensure there are no air bubbles in the burette tip.',
  PERFORM_TITRATION:
    'Open the stopcock and let EDTA drip into the flask. Swirl gently after each drop. Watch for the colour change!',
  ENDPOINT_REACHED:
    '🎉 Endpoint reached! The permanent blue colour indicates all Ca²⁺ and Mg²⁺ ions have complexed with EDTA.',
  COMPLETED:
    'Excellent work! You have successfully estimated the hardness of water using the EDTA method.',
}

export function useAIAssistant() {
  const { addAIMessage, setAITyping } = useLabStore()

  const sendGuidance = useCallback(
    async (step: ExperimentStep, context?: string) => {
      setAITyping(true)

      // Try backend AI
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step,
            context: context || '',
            experiment: 'EDTA Hardness Estimation',
          }),
          signal: AbortSignal.timeout(8000),
        })

        if (response.ok) {
          const data = await response.json()
          addAIMessage({ text: data.message, type: 'guidance' })
          setAITyping(false)
          return
        }
      } catch {
        // Fall through to fallback
      }

      // Fallback: use hardcoded message
      await new Promise((r) => setTimeout(r, 600)) // simulate slight delay
      addAIMessage({
        text: FALLBACK_MESSAGES[step] || 'Continue with the experiment.',
        type: 'guidance',
      })
      setAITyping(false)
    },
    [addAIMessage, setAITyping]
  )

  const sendCorrection = useCallback(
    async (errorMsg: string) => {
      setAITyping(true)
      await new Promise((r) => setTimeout(r, 400))
      addAIMessage({
        text: `⚠️ ${errorMsg}`,
        type: 'correction',
      })
      setAITyping(false)
    },
    [addAIMessage, setAITyping]
  )

  const sendExplanation = useCallback(
    async (topic: string) => {
      setAITyping(true)

      const explanations: Record<string, string> = {
        ebt: 'EBT (Eriochrome Black T) forms a wine-red complex with Ca²⁺ and Mg²⁺ ions at pH 10. When EDTA is added, it displaces EBT from the complex, and the free indicator turns blue.',
        edta: 'EDTA is a chelating agent that forms very stable 1:1 complexes with most divalent metal ions, including Ca²⁺ and Mg²⁺ responsible for water hardness.',
        hardness:
          'Water hardness is caused by dissolved calcium and magnesium ions. Temporary hardness is due to bicarbonates; permanent hardness is from sulphates and chlorides.',
        endpoint:
          'The endpoint is when the last metal ion reacts with EDTA. The indicator is released in its free form, giving the permanent blue colour. One drop past this point is the endpoint.',
        buffer:
          'The ammonia buffer maintains pH 10, which is essential for EBT to function as an indicator. At this pH, the EBT-metal complex is wine red and the free EBT is blue.',
      }

      await new Promise((r) => setTimeout(r, 500))
      addAIMessage({
        text: explanations[topic] || `Ask me about: ebt, edta, hardness, endpoint, or buffer.`,
        type: 'explanation',
      })
      setAITyping(false)
    },
    [addAIMessage, setAITyping]
  )

  return { sendGuidance, sendCorrection, sendExplanation }
}
