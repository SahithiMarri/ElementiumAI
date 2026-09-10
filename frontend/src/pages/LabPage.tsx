import { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLabStore } from '../store/labStore'
import LabScene from '../components/lab/LabScene'
import AIAssistant from '../components/ui/AIAssistant'
import Notebook from '../components/ui/Notebook'
import StepIndicator from '../components/ui/StepIndicator'
import MistakeAlert from '../components/ui/MistakeAlert'
import ResultScreen from '../components/ui/ResultScreen'

function LabLoadingFallback() {
  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
      <div className="text-5xl mb-6 animate-bounce">⚗️</div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Preparing Virtual Laboratory…</h2>
      <p className="text-slate-500 text-sm mb-6">Initializing 3D workspace, apparatus, and reagents</p>
      <div className="flex gap-1.5">
        {[0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function LabPage() {
  const navigate = useNavigate()
  const { currentStep, isCompleted } = useLabStore()

  return (
    <div className="w-full h-screen bg-slate-100 relative overflow-hidden text-slate-900">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200"
          >
            ← Dashboard
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚗️</span>
            <div>
              <p className="text-slate-900 text-xs font-bold leading-none">Experiment 1</p>
              <p className="text-slate-500 text-[11px] leading-none mt-1">
                Estimation of Hardness of Water by EDTA Method
              </p>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                currentStep !== 'IDLE' ? 'bg-emerald-500 animate-pulse-slow' : 'bg-slate-400'
              }`}
            />
            {currentStep === 'IDLE' ? 'Ready to Start' : 'Practical in Progress'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            3D Lab Active
          </span>
        </div>
      </div>

      {/* Main 3D Scene */}
      <Suspense fallback={<LabLoadingFallback />}>
        <LabScene />
      </Suspense>

      {/* UI Overlays */}
      <StepIndicator />
      <AIAssistant />
      <Notebook />
      <MistakeAlert />

      {/* Result screen */}
      {isCompleted && <ResultScreen />}

      {/* Controls Navigation Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-md">
        <span className="text-xs text-slate-600 font-medium">🖱️ Drag to rotate</span>
        <span className="text-xs text-slate-300">·</span>
        <span className="text-xs text-slate-600 font-medium">🖱️ Scroll to zoom</span>
        <span className="text-xs text-slate-300">·</span>
        <span className="text-xs text-slate-600 font-medium">⇧ Shift + Drag to pan</span>
      </div>
    </div>
  )
}
