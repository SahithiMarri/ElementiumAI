import { useRef, useEffect } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ConicalFlask, Burette, BuretteStand } from './apparatus/Apparatus'
import { useLabStore } from '../../store/labStore'
import { useAIAssistant } from '../../hooks/useAIAssistant'

// Droplet particle system for titration
function FallingDrops() {
  const { burette, addEdtaDrop } = useLabStore()
  const dropRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!dropRef.current) return

    if (burette.isOpen) {
      const currentY = dropRef.current.position.y
      if (currentY <= 0.95) {
        dropRef.current.position.y = 1.12
        addEdtaDrop()
      } else {
        dropRef.current.position.y -= delta * 3.0
      }
      dropRef.current.visible = true
    } else {
      dropRef.current.visible = false
      dropRef.current.position.y = 1.12
    }
  })

  return (
    <mesh ref={dropRef} position={[-0.8, 1.12, 0.72]} visible={false}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color="#38bdf8"
        transparent
        opacity={0.9}
        emissive="#0284c7"
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

// Glowing Green Holographic Snap Signal Component
function GreenSnapSignal({
  position,
  label,
  onClick,
  type = 'base',
}: {
  position: [number, number, number]
  label: string
  onClick: () => void
  type?: 'base' | 'clamp' | 'mouth'
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { isCompleted } = useLabStore()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 4) * 0.08
    meshRef.current.scale.set(scale, scale, scale)
  })

  // Do not render any 3D HTML tags if final completion card is shown
  if (isCompleted) return null

  return (
    <group position={position}>
      {type === 'base' ? (
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onClick()
          }}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <ringGeometry args={[0.3, 0.5, 32]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : type === 'mouth' ? (
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onClick()
          }}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <ringGeometry args={[0.15, 0.35, 24]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onClick()
          }}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <torusGeometry args={[0.18, 0.04, 16, 32]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      <pointLight color="#22c55e" intensity={0.5} distance={1.5} />

      <Html position={[0, type === 'clamp' ? 0.35 : 0.35, 0]} center>
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/40 border border-emerald-300 animate-bounce whitespace-nowrap transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{label}</span>
        </button>
      </Html>
    </group>
  )
}

export default function WorkbenchSetup() {
  const {
    currentStep,
    apparatus,
    placeApparatus,
    flask,
    burette,
    triggerSwirl,
    stopSwirl,
    isSwirling,
    openStopcock,
    closeStopcock,
    advanceStep,
    addNotebookEntry,
    isCompleted,
  } = useLabStore()

  const { sendGuidance } = useAIAssistant()

  useEffect(() => {
    if (currentStep === 'ENDPOINT_REACHED') {
      addNotebookEntry({
        step: 'ENDPOINT_REACHED',
        text: '🎉 Endpoint Reached: Solution turned permanent Pure Blue. Volume of EDTA consumed recorded automatically.',
        type: 'success',
      })
      sendGuidance('ENDPOINT_REACHED')

      const timer = setTimeout(() => {
        advanceStep('COMPLETED')
        useLabStore.setState({ isCompleted: true })
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const standPos: [number, number, number] = [-0.8, 0.82, 0.6]
  const burettePos: [number, number, number] = [-0.8, 3.52, 0.72]
  const flaskPos: [number, number, number] = [-0.8, 0.82, 0.72]

  return (
    <group>
      {/* ── Step 1 Green Snap Signals ───────────────────────────────────────── */}
      {!isCompleted && currentStep === 'SETUP_APPARATUS' && !apparatus.buretteStand.placed && (
        <GreenSnapSignal
          position={standPos}
          label="Place Burette Stand Here"
          onClick={() => placeApparatus('buretteStand', 'standZone', standPos)}
          type="base"
        />
      )}

      {!isCompleted &&
        currentStep === 'SETUP_APPARATUS' &&
        apparatus.buretteStand.placed &&
        !apparatus.burette.placed && (
          <GreenSnapSignal
            position={[-0.8, 2.62, 0.72]}
            label="Affix Burette to Stand"
            onClick={() => placeApparatus('burette', 'buretteZone', burettePos)}
            type="clamp"
          />
        )}

      {!isCompleted &&
        currentStep === 'SETUP_APPARATUS' &&
        apparatus.burette.placed &&
        !apparatus.conicalFlask.placed && (
          <GreenSnapSignal
            position={flaskPos}
            label="Place Flask Below Burette"
            onClick={() => placeApparatus('conicalFlask', 'flaskZone', flaskPos)}
            type="base"
          />
        )}

      {/* ── Step 2-5 Chemical Drop Signals above Vessels ───────────────────── */}
      {!isCompleted && currentStep === 'PREPARE_SAMPLE' && apparatus.conicalFlask.placed && (
        <GreenSnapSignal
          position={[-0.8, 1.45, 0.72]}
          label="💧 Drag Hard Water into Flask"
          onClick={() => {}}
          type="mouth"
        />
      )}

      {!isCompleted && currentStep === 'ADD_BUFFER' && apparatus.conicalFlask.placed && (
        <GreenSnapSignal
          position={[-0.8, 1.45, 0.72]}
          label="💧 Drag Buffer into Flask"
          onClick={() => {}}
          type="mouth"
        />
      )}

      {!isCompleted && currentStep === 'ADD_INDICATOR' && apparatus.conicalFlask.placed && (
        <GreenSnapSignal
          position={[-0.8, 1.45, 0.72]}
          label="💧 Drag EBT Indicator into Flask"
          onClick={() => {}}
          type="mouth"
        />
      )}

      {!isCompleted && currentStep === 'FILL_BURETTE' && apparatus.burette.placed && (
        <GreenSnapSignal
          position={[-0.8, 5.5, 0.72]}
          label="💧 Drag EDTA into Burette Top"
          onClick={() => {}}
          type="mouth"
        />
      )}

      {/* ── 1. Placed Burette Stand on Workbench ────────────────────────────── */}
      {apparatus.buretteStand.placed && (
        <group position={standPos}>
          <BuretteStand position={[0, 0, 0]} />
        </group>
      )}

      {/* ── 2. Placed Burette Clamped to Stand ───────────────────────────────── */}
      {apparatus.burette.placed && (
        <group position={burettePos}>
          <Burette position={[0, 0, 0]} />

          {/* Stopcock HUD button (hidden when completed) */}
          {!isCompleted && currentStep === 'PERFORM_TITRATION' && (
            <Html position={[0.6, -2.1, 0]} center>
              <div className="flex flex-col items-center gap-1 bg-white/95 border border-slate-200 p-2 rounded-xl backdrop-blur-md shadow-xl text-slate-900">
                <button
                  onClick={() => (burette.isOpen ? closeStopcock() : openStopcock())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    burette.isOpen
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {burette.isOpen ? '⏹ Close Stopcock' : '▶ Open Stopcock'}
                </button>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {burette.isOpen ? 'Dripping EDTA...' : 'Flow Stopped'}
                </span>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ── 3. Titration Droplets Animation ─────────────────────────────────── */}
      {apparatus.burette.placed && apparatus.conicalFlask.placed && <FallingDrops />}

      {/* ── 4. Placed Conical Flask on Workbench ────────────────────────────── */}
      {apparatus.conicalFlask.placed && (
        <group
          position={flaskPos}
          onPointerDown={() => triggerSwirl()}
          onPointerUp={() => stopSwirl()}
          onPointerLeave={() => stopSwirl()}
        >
          <ConicalFlask position={[0, 0, 0]} isPlaced={true} />

          {/* Swirl Flask button positioned BESIDE the flask so swirling liquid is clearly visible */}
          {!isCompleted && currentStep === 'PERFORM_TITRATION' && (
            <Html position={[0.72, 0.35, 0]} center>
              <div className="flex flex-col items-start bg-white/95 border border-slate-200 p-2 rounded-2xl shadow-xl backdrop-blur-md">
                <button
                  onMouseDown={() => triggerSwirl()}
                  onMouseUp={() => stopSwirl()}
                  onTouchStart={() => triggerSwirl()}
                  onTouchEnd={() => stopSwirl()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                    isSwirling
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                  }`}
                >
                  <span>{isSwirling ? '🌀' : '🔄'}</span>
                  <span>{isSwirling ? 'Swirling Flask...' : 'Click & Hold to Swirl'}</span>
                </button>
                <span className="text-[9px] text-slate-500 font-medium mt-1 pl-1">
                  Swirl to mix EDTA evenly
                </span>
              </div>
            </Html>
          )}

          {/* Live Color / State Tag above Flask (hidden when completed) */}
          {!isCompleted && flask.sampleAdded && (
            <Html position={[0, 1.4, 0]} center style={{ pointerEvents: 'none' }}>
              <div
                className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-md border border-white/40 whitespace-nowrap"
                style={{
                  backgroundColor: flask.liquidColor,
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.85)',
                }}
              >
                {flask.indicatorAdded
                  ? flask.edtaAdded >= 1.0
                    ? 'Permanent Blue (Endpoint)'
                    : flask.edtaAdded >= 0.6
                    ? 'Purple Transition'
                    : 'Wine Red Complex'
                  : 'Water Sample'}
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  )
}
