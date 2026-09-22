import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useLabStore } from '../../../store/labStore'
import { useAIAssistant } from '../../../hooks/useAIAssistant'

/**
 * PPE Stand — a full-height coat stand against the back wall of the lab,
 * standing in front of the right-hand window, holding the student's brown
 * apron and a pair of nitrile gloves.
 *
 * The stand is a permanent fixture: it stays in the scene for the whole
 * session. Only the gear leaves it — each item disappears as it is worn.
 *
 * Interaction: during WEAR_PPE a single marker sits on the floor in front of
 * the stand. Clicking it walks the camera over; the apron and gloves are then
 * clicked directly, and the camera returns to where it came from.
 */

// The floor sits at y = -1.77 in world space (LabEnvironment is offset by that much).
const FLOOR_Y = -1.77

// Back wall, in front of the window at x 4.8. That x is deliberate: the
// background benches occupy x -9..3 (Station A) and x 2.0..3.6 (Station B), so
// a stand at 4.8 has an unbroken sightline from the default camera, while the
// other two windows would have its base hidden behind Station A.
const STAND_POS: [number, number, number] = [4.8, FLOOR_Y, -9.7]

// Room scale: the bench counter is 2.59 units tall for a ~1m bench, so one
// unit is roughly 0.39 m. A coat stand is therefore a little over 4 units.
const POLE_HEIGHT = 4.2
const BAR_Y = 4.3

// Close-up framing. Both camera and target share the stand's x, so the orbit
// azimuth stays at 0 throughout the move and never hits the ±0.85 clamp.
const VIEW_TARGET = new THREE.Vector3(STAND_POS[0], FLOOR_Y + 2.95, STAND_POS[2])
const VIEW_CAMERA = new THREE.Vector3(STAND_POS[0], FLOOR_Y + 3.65, STAND_POS[2] + 4.1)

const FLIGHT_SECONDS = 1.1

const APRON_BROWN = '#7d4f2a'
const APRON_BROWN_DARK = '#5e3a1e'
const STRAP_BROWN = '#9a6a3c'
const GLOVE_BLUE = '#8fb9c4'
const STEEL = '#8d9895'

type OrbitLike = {
  target: THREE.Vector3
  enabled: boolean
  update: () => void
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// Gentle idle sway so the hanging gear reads as cloth, not furniture.
function Sway({
  children,
  amplitude = 0.035,
  speed = 1.4,
  offset = 0,
}: {
  children: React.ReactNode
  amplitude?: number
  speed?: number
  offset?: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * speed + offset) * amplitude
  })
  return <group ref={ref}>{children}</group>
}

function Apron({ highlight }: { highlight: boolean }) {
  const glow = highlight ? 0.45 : 0
  return (
    <Sway offset={0}>
      {/* neck strap */}
      <mesh position={[0, -0.16, 0]}>
        <torusGeometry args={[0.16, 0.022, 8, 20, Math.PI]} />
        <meshStandardMaterial color={STRAP_BROWN} roughness={0.82} />
      </mesh>

      {/* bib */}
      <mesh position={[0, -0.52, 0]} castShadow>
        <boxGeometry args={[0.42, 0.46, 0.045]} />
        <meshStandardMaterial
          color={APRON_BROWN}
          roughness={0.86}
          emissive={APRON_BROWN}
          emissiveIntensity={glow}
        />
      </mesh>

      {/* waist ties */}
      <mesh position={[-0.3, -0.76, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.3, 0.05, 0.04]} />
        <meshStandardMaterial color={STRAP_BROWN} roughness={0.82} />
      </mesh>
      <mesh position={[0.3, -0.76, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.3, 0.05, 0.04]} />
        <meshStandardMaterial color={STRAP_BROWN} roughness={0.82} />
      </mesh>

      {/* skirt */}
      <mesh position={[0, -1.18, 0]} castShadow>
        <boxGeometry args={[0.66, 0.86, 0.05]} />
        <meshStandardMaterial
          color={APRON_BROWN}
          roughness={0.86}
          emissive={APRON_BROWN}
          emissiveIntensity={glow}
        />
      </mesh>

      {/* hem + front pocket */}
      <mesh position={[0, -1.6, 0.005]}>
        <boxGeometry args={[0.67, 0.05, 0.055]} />
        <meshStandardMaterial color={APRON_BROWN_DARK} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.12, 0.035]}>
        <boxGeometry args={[0.34, 0.2, 0.02]} />
        <meshStandardMaterial color={APRON_BROWN_DARK} roughness={0.8} />
      </mesh>
    </Sway>
  )
}

function Glove({ flip = false, highlight = false }: { flip?: boolean; highlight?: boolean }) {
  const s = flip ? -1 : 1
  const mat = (
    <meshStandardMaterial
      color={GLOVE_BLUE}
      roughness={0.55}
      emissive={GLOVE_BLUE}
      emissiveIntensity={highlight ? 0.5 : 0}
    />
  )
  return (
    <group scale={[s, 1, 1]}>
      {/* cuff */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.062, 0.07, 0.12, 12]} />
        {mat}
      </mesh>
      {/* palm */}
      <mesh position={[0, -0.24, 0]} castShadow>
        <boxGeometry args={[0.13, 0.26, 0.055]} />
        {mat}
      </mesh>
      {/* fingers */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.125, 0.12, 0.05]} />
        {mat}
      </mesh>
      {/* thumb */}
      <mesh position={[0.085, -0.25, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.05, 0.13, 0.045]} />
        {mat}
      </mesh>
    </group>
  )
}

export default function PPEStand() {
  const {
    currentStep,
    ppe,
    wearPPE,
    advanceStep,
    addNotebookEntry,
    addAIMessage,
    isCompleted,
  } = useLabStore()
  const { sendGuidance } = useAIAssistant()

  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as OrbitLike | null

  const [atStand, setAtStand] = useState(false)
  const [hover, setHover] = useState<'apron' | 'gloves' | 'marker' | null>(null)

  // Where the camera was before walking over, so it can be put back exactly.
  const home = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null)
  const flight = useRef<{
    fromPos: THREE.Vector3
    toPos: THREE.Vector3
    fromTarget: THREE.Vector3
    toTarget: THREE.Vector3
    t: number
  } | null>(null)

  const bothWorn = ppe.apron && ppe.gloves
  const isPickupStep = currentStep === 'WEAR_PPE' && !isCompleted
  const canPick = isPickupStep && atStand

  const setCursor = (v: string) => {
    document.body.style.cursor = v
  }

  const flyTo = (toPos: THREE.Vector3, toTarget: THREE.Vector3) => {
    if (!controls) return
    flight.current = {
      fromPos: camera.position.clone(),
      toPos: toPos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: toTarget.clone(),
      t: 0,
    }
    controls.enabled = false
  }

  const goToStand = () => {
    if (!controls || flight.current) return
    home.current = { pos: camera.position.clone(), target: controls.target.clone() }
    setAtStand(true)
    flyTo(VIEW_CAMERA, VIEW_TARGET)
  }

  const returnToBench = () => {
    setCursor('auto')
    setHover(null)
    setAtStand(false)
    if (home.current) flyTo(home.current.pos, home.current.target)
  }

  useFrame((_, delta) => {
    const f = flight.current
    if (!f || !controls) return

    f.t = Math.min(1, f.t + delta / FLIGHT_SECONDS)
    const e = easeInOutCubic(f.t)
    camera.position.lerpVectors(f.fromPos, f.toPos, e)
    controls.target.lerpVectors(f.fromTarget, f.toTarget, e)
    controls.update()

    if (f.t >= 1) {
      flight.current = null
      controls.enabled = true
    }
  })

  // Release the orbit controls if this unmounts mid-flight.
  useEffect(() => {
    return () => {
      if (controls && flight.current) {
        controls.enabled = true
        flight.current = null
      }
      setCursor('auto')
    }
  }, [controls])

  // Once fully kitted out, head back to the bench and move on.
  useEffect(() => {
    if (currentStep !== 'WEAR_PPE' || !bothWorn) return

    addNotebookEntry({
      step: 'WEAR_PPE',
      text: '✓ Personal protective equipment worn: brown lab apron and nitrile gloves.',
      type: 'success',
    })
    addAIMessage({
      text: '✓ Apron on, gloves on. You are cleared to work at the bench — now set up your apparatus.',
      type: 'success',
    })
    if (atStand) returnToBench()
    advanceStep('SETUP_APPARATUS')
    sendGuidance('SETUP_APPARATUS')
  }, [currentStep, bothWorn])

  const grab = (item: 'apron' | 'gloves') => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setCursor('auto')
    setHover(null)
    wearPPE(item)
    addNotebookEntry({
      step: 'WEAR_PPE',
      text:
        item === 'apron'
          ? '✓ Brown lab apron taken from the PPE stand and worn.'
          : '✓ Nitrile gloves taken from the PPE stand and worn.',
      type: 'observation',
    })
  }

  const pickHandlers = (item: 'apron' | 'gloves') =>
    canPick
      ? {
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            setHover(item)
            setCursor('pointer')
          },
          onPointerOut: () => {
            setHover(null)
            setCursor('auto')
          },
          onClick: grab(item),
        }
      : {}

  return (
    <group name="PPEStand" position={STAND_POS}>
      {/* ── Stand frame ──────────────────────────────────────────────── */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.58, 0.12, 20]} />
        <meshStandardMaterial color={STEEL} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0, POLE_HEIGHT / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, POLE_HEIGHT, 14]} />
        <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, BAR_Y, 0]} castShadow>
        <boxGeometry args={[2.0, 0.09, 0.09]} />
        <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* peg caps */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, BAR_Y, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#4f5a57" roughness={0.35} metalness={0.75} />
        </mesh>
      ))}

      <Text
        position={[0, BAR_Y + 0.45, 0]}
        fontSize={0.3}
        color="#285c55"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        PPE STAND
      </Text>

      {/* ── Brown apron on the left peg ──────────────────────────────── */}
      {!ppe.apron && (
        <group
          position={[-0.68, BAR_Y - 0.05, 0]}
          scale={hover === 'apron' ? 1.58 : 1.5}
          {...pickHandlers('apron')}
        >
          <Apron highlight={hover === 'apron'} />
        </group>
      )}

      {/* ── Gloves on the right peg ──────────────────────────────────── */}
      {!ppe.gloves && (
        <group
          position={[0.82, BAR_Y - 0.08, 0]}
          scale={hover === 'gloves' ? 1.58 : 1.5}
          {...pickHandlers('gloves')}
        >
          <Sway offset={1.2} amplitude={0.05} speed={1.7}>
            <group position={[-0.1, 0, 0]}>
              <Glove highlight={hover === 'gloves'} />
            </group>
            <group position={[0.12, -0.03, 0.02]}>
              <Glove flip highlight={hover === 'gloves'} />
            </group>
          </Sway>
        </group>
      )}

      {/* ── Floor marker: the one thing to click from across the room ─── */}
      {isPickupStep && !atStand && (
        <group position={[0, 0.02, 1.7]}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              goToStand()
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation()
              setHover('marker')
              setCursor('pointer')
            }}
            onPointerOut={() => {
              setHover(null)
              setCursor('auto')
            }}
            scale={hover === 'marker' ? 1.12 : 1}
          >
            <ringGeometry args={[0.55, 0.9, 36]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={0.9}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color="#22c55e" intensity={0.6} distance={2.4} />

          <Html position={[0, 1.15, 0]} center>
            <button
              onClick={goToStand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/40 border border-emerald-300 animate-bounce whitespace-nowrap transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>🥼 Go to PPE Stand</span>
            </button>
          </Html>
        </group>
      )}

      {/* ── At the stand: one small panel, clear of the gear itself ───── */}
      {canPick && (
        <Html position={[0, 0.55, 1.9]} center>
          <div className="flex flex-col items-center gap-1.5 bg-[#fbf4e8]/95 border border-[#d9c3a0] px-3 py-2 rounded-xl backdrop-blur-md shadow-xl text-[#3d2b1c] whitespace-nowrap">
            <span className="text-[11px] font-bold">
              Click the {!ppe.apron && 'brown apron'}
              {!ppe.apron && !ppe.gloves && ' and the '}
              {!ppe.gloves && 'gloves'} to put {!ppe.apron && !ppe.gloves ? 'them' : 'it'} on
            </span>
            <button
              onClick={returnToBench}
              className="px-2.5 py-1 rounded-lg bg-[#ecdbc0] hover:bg-[#e0cba6] text-[#3d2b1c] text-[10px] font-bold border border-[#d9c3a0] transition-colors cursor-pointer"
            >
              ← Back to bench
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}
