import { create } from 'zustand'

// ─── Experiment Steps ───────────────────────────────────────────────────────
export type ExperimentStep =
  | 'IDLE'
  | 'WEAR_PPE'
  | 'SETUP_APPARATUS'
  | 'PREPARE_SAMPLE'
  | 'ADD_BUFFER'
  | 'ADD_INDICATOR'
  | 'FILL_BURETTE'
  | 'PERFORM_TITRATION'
  | 'ENDPOINT_REACHED'
  | 'COMPLETED'

// ─── Apparatus Placement ─────────────────────────────────────────────────────
export interface ApparatusState {
  id: string
  placed: boolean
  snapZoneId: string | null
  position: [number, number, number]
  rotation: [number, number, number]
}

// ─── Notebook Entry ───────────────────────────────────────────────────────────
export interface NotebookEntry {
  id: string
  step: ExperimentStep
  text: string
  timestamp: Date
  type: 'info' | 'success' | 'observation'
}

// ─── AI Message ───────────────────────────────────────────────────────────────
export interface AIMessage {
  id: string
  text: string
  type: 'guidance' | 'help' | 'explanation' | 'correction' | 'success'
  timestamp: Date
}

// ─── Full Lab State ───────────────────────────────────────────────────────────
export interface LabState {
  // Navigation
  currentStep: ExperimentStep
  experimentStarted: boolean
  isCompleted: boolean

  // Personal protective equipment, worn before touching the bench
  ppe: {
    apron: boolean
    gloves: boolean
  }

  // Apparatus
  apparatus: Record<string, ApparatusState>
  isDraggingApparatus: boolean

  // Pouring state
  isPouring: boolean
  activePourChemical: string | null
  pouringProgress: number // 0.0 -> 1.0

  // Flask contents
  flask: {
    sampleAdded: boolean
    bufferAdded: boolean
    indicatorAdded: boolean
    edtaAdded: number // 0.0 -> 1.0 (fraction of endpoint volume)
    liquidLevel: number // 0.0 -> 1.0
    liquidColor: string // hex
  }

  // Burette
  burette: {
    filled: boolean
    liquidLevel: number // 0.0 -> 1.0
    isOpen: boolean
    dropsDispensed: number
  }

  // Interactions
  selectedItem: string | null
  activeAnimation: string | null
  isSwirling: boolean

  // Notification / mistake
  mistakeMessage: string | null
  showMistake: boolean

  // Notebook
  notebookEntries: NotebookEntry[]
  isNotebookOpen: boolean

  // AI
  aiMessages: AIMessage[]
  isAITyping: boolean

  // Actions ─────────────────────────────────────────────────────────────────
  startExperiment: () => void
  advanceStep: (step: ExperimentStep) => void

  wearPPE: (item: 'apron' | 'gloves') => void

  setIsDraggingApparatus: (isDragging: boolean) => void
  placeApparatus: (id: string, snapZoneId: string, pos: [number, number, number]) => void
  resetApparatus: (id: string) => void

  startPour: (chemicalId: string) => void
  endPour: () => void

  addSampleToFlask: () => void
  addBufferToFlask: () => void
  addIndicatorToFlask: () => void
  fillBurette: () => void
  openStopcock: () => void
  closeStopcock: () => void
  addEdtaDrop: () => void
  triggerSwirl: () => void
  stopSwirl: () => void

  showMistakeMessage: (msg: string) => void
  clearMistake: () => void

  addNotebookEntry: (entry: Omit<NotebookEntry, 'id' | 'timestamp'>) => void
  toggleNotebook: () => void

  addAIMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void
  setAITyping: (v: boolean) => void

  selectItem: (id: string | null) => void
  resetExperiment: () => void
}

// ─── Color stages for EDTA titration ─────────────────────────────────────────
export function getFlaskColor(edtaFraction: number, indicatorAdded: boolean): string {
  if (!indicatorAdded) return '#c8e6f5'

  const stages = [
    { at: 0.0, r: 139, g: 0, b: 0 }, // wine red
    { at: 0.3, r: 180, g: 20, b: 50 }, // lighter wine
    { at: 0.6, r: 120, g: 0, b: 120 }, // purple
    { at: 0.8, r: 70, g: 50, b: 180 }, // bluish purple
    { at: 1.0, r: 0, g: 80, b: 220 }, // permanent sharp blue
  ]

  const t = Math.max(0, Math.min(1, edtaFraction))

  for (let i = 0; i < stages.length - 1; i++) {
    if (t >= stages[i].at && t <= stages[i + 1].at) {
      const span = stages[i + 1].at - stages[i].at
      const local = (t - stages[i].at) / span
      const r = Math.round(stages[i].r + (stages[i + 1].r - stages[i].r) * local)
      const g = Math.round(stages[i].g + (stages[i + 1].g - stages[i].g) * local)
      const b = Math.round(stages[i].b + (stages[i + 1].b - stages[i].b) * local)
      return `rgb(${r},${g},${b})`
    }
  }
  return `rgb(0,80,220)`
}

const initialApparatus: Record<string, ApparatusState> = {
  buretteStand: {
    id: 'buretteStand',
    placed: false,
    snapZoneId: null,
    position: [-4.5, 0.82, -1.2],
    rotation: [0, 0, 0],
  },
  burette: {
    id: 'burette',
    placed: false,
    snapZoneId: null,
    position: [-4.5, 1.6, 0.0],
    rotation: [0, 0, 0],
  },
  conicalFlask: {
    id: 'conicalFlask',
    placed: false,
    snapZoneId: null,
    position: [-4.5, 0.82, 1.2],
    rotation: [0, 0, 0],
  },
}

export const useLabStore = create<LabState>((set, get) => ({
  currentStep: 'IDLE',
  experimentStarted: false,
  isCompleted: false,

  ppe: { apron: false, gloves: false },

  apparatus: initialApparatus,
  isDraggingApparatus: false,

  isPouring: false,
  activePourChemical: null,
  pouringProgress: 0,

  flask: {
    sampleAdded: false,
    bufferAdded: false,
    indicatorAdded: false,
    edtaAdded: 0,
    liquidLevel: 0,
    liquidColor: '#c8e6f5',
  },

  burette: {
    filled: false,
    liquidLevel: 0,
    isOpen: false,
    dropsDispensed: 0,
  },

  selectedItem: null,
  activeAnimation: null,
  isSwirling: false,

  mistakeMessage: null,
  showMistake: false,

  notebookEntries: [],
  isNotebookOpen: false,

  aiMessages: [],
  isAITyping: false,

  startExperiment: () =>
    set({ experimentStarted: true, currentStep: 'WEAR_PPE' }),

  advanceStep: (step) => set({ currentStep: step }),

  wearPPE: (item) => set((s) => ({ ppe: { ...s.ppe, [item]: true } })),

  setIsDraggingApparatus: (isDragging) => set({ isDraggingApparatus: isDragging }),

  placeApparatus: (id, snapZoneId, pos) =>
    set((s) => ({
      apparatus: {
        ...s.apparatus,
        [id]: { ...s.apparatus[id], placed: true, snapZoneId, position: pos },
      },
      isDraggingApparatus: false,
    })),

  resetApparatus: (id) =>
    set((s) => ({
      apparatus: {
        ...s.apparatus,
        [id]: { ...initialApparatus[id] },
      },
    })),

  startPour: (chemicalId) =>
    set({ isPouring: true, activePourChemical: chemicalId, isDraggingApparatus: false }),

  endPour: () => set({ isPouring: false, activePourChemical: null }),

  addSampleToFlask: () =>
    set((s) => ({
      flask: {
        ...s.flask,
        sampleAdded: true,
        liquidLevel: 0.35,
        liquidColor: '#c8e6f5',
      },
      isPouring: false,
      activePourChemical: null,
    })),

  addBufferToFlask: () =>
    set((s) => ({
      flask: {
        ...s.flask,
        bufferAdded: true,
        liquidLevel: Math.min(s.flask.liquidLevel + 0.08, 0.55),
      },
      isPouring: false,
      activePourChemical: null,
    })),

  addIndicatorToFlask: () =>
    set((s) => ({
      flask: {
        ...s.flask,
        indicatorAdded: true,
        liquidColor: getFlaskColor(0, true),
      },
      isPouring: false,
      activePourChemical: null,
    })),

  fillBurette: () =>
    set((s) => ({
      burette: { ...s.burette, filled: true, liquidLevel: 1.0 },
      isPouring: false,
      activePourChemical: null,
    })),

  openStopcock: () => set((s) => ({ burette: { ...s.burette, isOpen: true } })),

  closeStopcock: () => set((s) => ({ burette: { ...s.burette, isOpen: false } })),

  addEdtaDrop: () => {
    const s = get()
    if (!s.burette.isOpen) return
    if (s.flask.edtaAdded >= 1) {
      set((st) => ({
        flask: {
          ...st.flask,
          edtaAdded: 1,
          liquidColor: getFlaskColor(1, true),
        },
        burette: { ...st.burette, isOpen: false },
        currentStep: 'ENDPOINT_REACHED',
      }))
      return
    }
    const newEdta = Math.min(s.flask.edtaAdded + 0.025, 1)
    const newDrops = s.burette.dropsDispensed + 1
    const newBuretteLevel = Math.max(0, s.burette.liquidLevel - 0.025)
    set({
      flask: {
        ...s.flask,
        edtaAdded: newEdta,
        liquidColor: getFlaskColor(newEdta, true),
        liquidLevel: Math.min(s.flask.liquidLevel + 0.01, 0.85),
      },
      burette: {
        ...s.burette,
        dropsDispensed: newDrops,
        liquidLevel: newBuretteLevel,
      },
    })
  },

  triggerSwirl: () => set({ isSwirling: true }),
  stopSwirl: () => set({ isSwirling: false }),

  showMistakeMessage: (msg) => set({ mistakeMessage: msg, showMistake: true }),
  clearMistake: () => set({ mistakeMessage: null, showMistake: false }),

  addNotebookEntry: (entry) =>
    set((s) => ({
      notebookEntries: [
        ...s.notebookEntries,
        { ...entry, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),

  toggleNotebook: () => set((s) => ({ isNotebookOpen: !s.isNotebookOpen })),

  addAIMessage: (msg) =>
    set((s) => ({
      aiMessages: [
        ...s.aiMessages,
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),

  setAITyping: (v) => set({ isAITyping: v }),

  selectItem: (id) => set({ selectedItem: id }),

  resetExperiment: () =>
    set({
      currentStep: 'IDLE',
      experimentStarted: false,
      isCompleted: false,
      ppe: { apron: false, gloves: false },
      apparatus: initialApparatus,
      isDraggingApparatus: false,
      isPouring: false,
      activePourChemical: null,
      pouringProgress: 0,
      flask: {
        sampleAdded: false,
        bufferAdded: false,
        indicatorAdded: false,
        edtaAdded: 0,
        liquidLevel: 0,
        liquidColor: '#c8e6f5',
      },
      burette: { filled: false, liquidLevel: 0, isOpen: false, dropsDispensed: 0 },
      selectedItem: null,
      activeAnimation: null,
      isSwirling: false,
      mistakeMessage: null,
      showMistake: false,
      notebookEntries: [],
      aiMessages: [],
      isAITyping: false,
    }),
}))
