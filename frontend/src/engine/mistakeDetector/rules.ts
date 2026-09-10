/**
 * Mistake Detection Engine
 * Rule-based validation system that prevents incorrect experimental steps.
 * Each rule returns a blocking message if violated, or null if ok.
 */
import type { LabState, ExperimentStep } from '../../store/labStore'

export interface MistakeRule {
  id: string
  triggerStep: ExperimentStep   // the step being attempted
  check: (state: LabState) => string | null   // returns error message or null
}

export const mistakeRules: MistakeRule[] = [
  // ── Step 2: Prepare Sample ──────────────────────────────────────────────
  {
    id: 'SAMPLE_BEFORE_SETUP',
    triggerStep: 'PREPARE_SAMPLE',
    check: (s) => {
      if (!s.apparatus.conicalFlask.placed) {
        return 'Place the conical flask on the workbench before transferring the sample.'
      }
      return null
    },
  },

  // ── Step 3: Add Buffer ──────────────────────────────────────────────────
  {
    id: 'BUFFER_BEFORE_SAMPLE',
    triggerStep: 'ADD_BUFFER',
    check: (s) => {
      if (!s.flask.sampleAdded) {
        return 'You must transfer the hard water sample into the flask before adding buffer.'
      }
      return null
    },
  },

  // ── Step 4: Add Indicator ────────────────────────────────────────────────
  {
    id: 'INDICATOR_BEFORE_SAMPLE',
    triggerStep: 'ADD_INDICATOR',
    check: (s) => {
      if (!s.flask.sampleAdded) {
        return 'Transfer the hard water sample first before adding the EBT indicator.'
      }
      return null
    },
  },
  {
    id: 'INDICATOR_BEFORE_BUFFER',
    triggerStep: 'ADD_INDICATOR',
    check: (s) => {
      if (!s.flask.bufferAdded) {
        return 'Add the buffer solution (pH 10) before adding the EBT indicator.'
      }
      return null
    },
  },

  // ── Step 5: Fill Burette ─────────────────────────────────────────────────
  {
    id: 'FILL_BURETTE_WITHOUT_INDICATOR',
    triggerStep: 'FILL_BURETTE',
    check: (s) => {
      if (!s.flask.indicatorAdded) {
        return 'Add the Eriochrome Black T indicator to the flask before filling the burette.'
      }
      return null
    },
  },
  {
    id: 'BURETTE_NOT_PLACED',
    triggerStep: 'FILL_BURETTE',
    check: (s) => {
      if (!s.apparatus.burette.placed) {
        return 'Place the burette on the stand before filling it with EDTA.'
      }
      return null
    },
  },

  // ── Step 6: Titration ────────────────────────────────────────────────────
  {
    id: 'TITRATE_WITHOUT_FILLING',
    triggerStep: 'PERFORM_TITRATION',
    check: (s) => {
      if (!s.burette.filled) {
        return 'Fill the burette with EDTA solution before starting the titration.'
      }
      return null
    },
  },
  {
    id: 'TITRATE_WITHOUT_INDICATOR',
    triggerStep: 'PERFORM_TITRATION',
    check: (s) => {
      if (!s.flask.indicatorAdded) {
        return 'The EBT indicator must be added to the flask before starting titration.'
      }
      return null
    },
  },
]

/**
 * Validate a step transition.
 * Returns null if ok, or the blocking error message.
 */
export function validateStep(
  attemptedStep: ExperimentStep,
  state: LabState
): string | null {
  const applicable = mistakeRules.filter((r) => r.triggerStep === attemptedStep)
  for (const rule of applicable) {
    const err = rule.check(state)
    if (err) return err
  }
  return null
}
