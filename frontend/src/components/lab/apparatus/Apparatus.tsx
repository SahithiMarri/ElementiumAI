import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLabStore } from '../../../store/labStore'

// Refined Light-Theme Glass Material
const glassMat = {
  color: '#e0f2fe',
  transparent: true,
  opacity: 0.32,
  roughness: 0.1,
  metalness: 0.05,
  side: THREE.DoubleSide,
}

// ─── Conical Flask (Erlenmeyer) ───────────────────────────────────────────────
export function ConicalFlask({
  position = [0, 0, 0],
  isPlaced = false,
}: {
  position?: [number, number, number]
  isPlaced?: boolean
}) {
  const { flask, isSwirling } = useLabStore()
  const liquidRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const swirlt = useRef(0)

  // Flask profile for LatheGeometry
  const flaskPoints = [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(0.6, 0.02),
    new THREE.Vector2(0.72, 0.4),
    new THREE.Vector2(0.82, 0.9),
    new THREE.Vector2(0.75, 1.5),
    new THREE.Vector2(0.48, 1.85),
    new THREE.Vector2(0.2, 2.1),
    new THREE.Vector2(0.18, 2.6),
    new THREE.Vector2(0.21, 2.65),
  ]

  useFrame((_, delta) => {
    if (!liquidRef.current || !groupRef.current) return

    // Dynamic Swirl & Vortex physics
    if (isSwirling) {
      swirlt.current += delta * 6
      groupRef.current.rotation.z = Math.sin(swirlt.current) * 0.12
      groupRef.current.rotation.x = Math.cos(swirlt.current * 0.8) * 0.08
      liquidRef.current.rotation.y += delta * 8
      liquidRef.current.scale.x = 0.6 + Math.sin(swirlt.current * 2) * 0.04
      liquidRef.current.scale.z = 0.6 + Math.cos(swirlt.current * 2) * 0.04
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 8)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 8)
      liquidRef.current.scale.x = THREE.MathUtils.lerp(liquidRef.current.scale.x, 0.6, delta * 8)
      liquidRef.current.scale.z = THREE.MathUtils.lerp(liquidRef.current.scale.z, 0.6, delta * 8)
    }

    // Update liquid level
    const targetLevel = flask.liquidLevel
    const currentLevel = liquidRef.current.scale.y
    liquidRef.current.scale.y = THREE.MathUtils.lerp(currentLevel, targetLevel, 0.08)
    liquidRef.current.position.y = liquidRef.current.scale.y * 0.6 * 0.5

    // Update liquid color
    const mat = liquidRef.current.material as THREE.MeshStandardMaterial
    if (mat.color) {
      const target = new THREE.Color(flask.liquidColor)
      mat.color.lerp(target, 0.06)
    }
  })

  const parseColor = (hex: string) => {
    try {
      return new THREE.Color(hex)
    } catch {
      return new THREE.Color('#c8e6f5')
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Glass body */}
      <mesh castShadow>
        <latheGeometry args={[flaskPoints, 18]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>

      {/* Liquid fill */}
      {flask.liquidLevel > 0 && (
        <mesh
          ref={liquidRef}
          position={[0, flask.liquidLevel * 0.6 * 0.5, 0]}
          scale={[0.6, flask.liquidLevel * 0.6, 0.6]}
        >
          <cylinderGeometry args={[1, 1.3, 1, 16]} />
          <meshStandardMaterial
            color={parseColor(flask.liquidColor)}
            transparent
            opacity={0.85}
            roughness={0.15}
            emissive={parseColor(flask.liquidColor)}
            emissiveIntensity={0.08}
          />
        </mesh>
      )}

      {/* Bottom disc */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.02, 18]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>

      {/* Label if placed */}
      {isPlaced && (
        <mesh position={[0, 0.85, 0.83]}>
          <planeGeometry args={[0.55, 0.3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      )}
    </group>
  )
}

// ─── Burette ──────────────────────────────────────────────────────────────────
export function Burette({
  position = [0, 0, 0],
}: {
  position?: [number, number, number]
}) {
  const { burette, openStopcock, closeStopcock } = useLabStore()
  const liquidRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!liquidRef.current) return
    const targetLevel = burette.liquidLevel
    liquidRef.current.scale.y = THREE.MathUtils.lerp(liquidRef.current.scale.y, targetLevel, 0.05)
    liquidRef.current.position.y = 2.0 - (1 - burette.liquidLevel) * 2.0 * 0.5
  })

  return (
    <group position={position}>
      {/* Glass tube */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.07, 4.0, 12]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>

      {/* Calibration graduation lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, 1.5 - i * 0.4, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.01, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      ))}

      {/* EDTA liquid inside */}
      {burette.filled && (
        <mesh
          ref={liquidRef}
          position={[0, 2.0 - (1 - burette.liquidLevel) * 2.0 * 0.5, 0]}
          scale={[0.85, burette.liquidLevel, 0.85]}
        >
          <cylinderGeometry args={[0.058, 0.058, 4.0, 12]} />
          <meshStandardMaterial
            color="#bbf7d0"
            transparent
            opacity={0.75}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Stopcock housing */}
      <mesh position={[0, -2.1, 0]} castShadow>
        <boxGeometry args={[0.25, 0.14, 0.12]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Stopcock handle */}
      <mesh
        position={[burette.isOpen ? 0.22 : 0, -2.1, 0]}
        rotation={[0, burette.isOpen ? Math.PI / 2 : 0, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          burette.isOpen ? closeStopcock() : openStopcock()
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.28, 0.06, 0.06]} />
        <meshStandardMaterial
          color={burette.isOpen ? '#16a34a' : '#dc2626'}
          emissive={burette.isOpen ? '#15803d' : '#b91c1c'}
          emissiveIntensity={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Tip */}
      <mesh position={[0, -2.25, 0]}>
        <cylinderGeometry args={[0.02, 0.005, 0.3, 10]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
    </group>
  )
}

// ─── Burette Stand ────────────────────────────────────────────────────────────
export function BuretteStand({
  position = [0, 0, 0],
}: {
  position?: [number, number, number]
}) {
  return (
    <group position={position}>
      {/* Heavy cast iron / coated steel base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.7]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Chrome vertical rod */}
      <mesh position={[-0.5, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 4.6, 10]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Clamp ring */}
      <mesh position={[-0.5, 1.8, 0.12]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Clamp arm */}
      <mesh position={[-0.25, 1.8, 0.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}

// ─── Pipette ──────────────────────────────────────────────────────────────────
export function Pipette({
  position = [0, 0, 0],
}: {
  position?: [number, number, number]
}) {
  return (
    <group position={position} rotation={[0, 0, Math.PI * 0.07]}>
      {/* Upper tube */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.0, 10]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      {/* Lower tip */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.008, 0.9, 10]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
    </group>
  )
}

// ─── Wash Bottle ─────────────────────────────────────────────────────────────
export function WashBottle({
  position = [0, 0, 0],
}: {
  position?: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.15, 1.2, 12]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.2, 10]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.5} roughness={0.2} />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0.1, 0.85, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.015, 0.008, 0.4, 8]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.6} roughness={0.2} />
      </mesh>
    </group>
  )
}
