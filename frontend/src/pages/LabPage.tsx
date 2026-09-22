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
    <div className="w-full h-full flex flex-col items-center justify-center text-stone-800" style={{ background: 'var(--bg)' }}>
      <div className="text-5xl mb-3 animate-bounce">⚗️</div>
      <h2 className="text-base font-bold text-stone-900 mb-1">Initializing 3D Chemistry Laboratory…</h2>
      <p className="text-stone-600 text-xs mb-4">Setting up workstation apparatus, reagents, and AI guidance</p>
      <div className="flex gap-1.5">
        {[0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#a9713a] animate-bounce"
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
    <div className="w-full h-screen flex flex-col overflow-hidden select-none" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Academic Laboratory Navigation Bar (Always visible, non-overlapping) */}
      <header className="h-13 w-full px-4 sm:px-6 bg-[#f0ece9] border-b border-[#d9c3a0] flex items-center justify-between z-30 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-stone-700 hover:text-stone-900 transition-colors text-xs font-semibold px-2.5 py-1 rounded bg-[#e5dcd2] hover:bg-[#d9c3a0] border border-[#d9c3a0]"
          >
            ← Dashboard
          </button>
          <div className="h-4 w-px bg-[#d9c3a0]" />
          <div className="flex items-center gap-2">
            <span className="text-base">💧</span>
            <div>
              <p className="text-[#3d2b1c] text-xs font-bold leading-none">Experiment 1 · EDTA Titration</p>
              <p className="text-[#8a7052] text-[10px] leading-none mt-0.5">
                Estimation of Total Hardness of Water Sample
              </p>
            </div>
          </div>
        </div>

        {/* Live Lab Practical Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3d2b1c] bg-[#fbf4e8] px-2.5 py-1 rounded-full border border-[#d9c3a0]">
            <span
              className={`online-dot ${
                currentStep !== 'IDLE' ? 'bg-emerald-600' : 'bg-stone-400'
              }`}
            />
            <span>{currentStep === 'IDLE' ? 'Ready to Start' : 'Practical in Progress'}</span>
          </div>
          <span className="text-[10px] text-[#8a7052] font-mono hidden md:inline">
            Interactive 3D Workstation
          </span>
        </div>
      </header>

      {/* 3D Scene Container with Responsive UI Overlays */}
      <main className="flex-1 w-full relative overflow-hidden">
        <Suspense fallback={<LabLoadingFallback />}>
          <LabScene />
        </Suspense>

        {/* Responsive Floating Workflow Card (Top-Left) */}
        <StepIndicator />

        {/* Responsive Lab Notebook (Top-Right) */}
        <Notebook />

        {/* AI Assistant Tutor (Bottom-Right) */}
        <AIAssistant />

        {/* Mistake Alert Banner */}
        <MistakeAlert />

        {/* Result Screen Modal */}
        {isCompleted && <ResultScreen />}

        {/* 3D Navigation Controls Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-3 bg-stone-900/80 text-stone-200 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-700 text-[11px] shadow-lg pointer-events-none">
          <span>🖱️ Drag to rotate view</span>
          <span className="text-stone-500">·</span>
          <span>🖱️ Scroll to zoom</span>
          <span className="text-stone-500">·</span>
          <span>⇧ Shift + Drag to pan</span>
        </div>
      </main>
    </div>
  )
}
