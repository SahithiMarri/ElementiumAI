import { useRef, useState, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useLabStore } from '../../../store/labStore'

interface ChemicalBottleProps {
  id: string
  name: string
  shortName: string
  color: string
  bottleColor?: string
  shelfPosition: [number, number, number]
  targetPosition: [number, number, number]
  pourPosition: [number, number, number]
  targetLabel: string
  onPour: () => void
  disabled?: boolean
}

export function ChemicalBottle({
  id,
  name,
  shortName,
  color,
  bottleColor = '#90caf9',
  shelfPosition,
  targetPosition,
  pourPosition,
  targetLabel,
  onPour,
  disabled = false,
}: ChemicalBottleProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [currentPos, setCurrentPos] = useState<[number, number, number]>(shelfPosition)

  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.2))
  const targetVec = useRef(new THREE.Vector3())

  const {
    isPouring,
    activePourChemical,
    isCompleted,
    setIsDraggingApparatus,
  } = useLabStore()

  const isCurrentPouring = isPouring && activePourChemical === id

  // Check if dragged bottle is close to target vessel
  const checkTargetProximity = useCallback(
    (pos: [number, number, number]) => {
      const dx = pos[0] - targetPosition[0]
      const dz = pos[2] - targetPosition[2]
      const dist = Math.sqrt(dx * dx + dz * dz)
      return dist < 2.5 || (pos[0] < 1.5 && pos[0] > -3.0 && pos[2] > -1.5 && pos[2] < 3.0)
    },
    [targetPosition]
  )

  useFrame(({ raycaster, pointer, camera }, delta) => {
    if (!groupRef.current) return

    // 1. Pouring animation state (Tilts smoothly to the LEFT towards the flask/burette mouth)
    if (isCurrentPouring) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        pourPosition[0],
        delta * 6
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        pourPosition[1],
        delta * 6
      )
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        pourPosition[2],
        delta * 6
      )

      // Positive Z tilt rotates top of bottle to the LEFT towards negative X (directly over flask mouth)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        Math.PI / 3.0,
        delta * 8
      )
      return
    }

    // 2. Dragging state
    if (isDragging) {
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(planeRef.current, targetVec.current)

      const newPos: [number, number, number] = [
        targetVec.current.x,
        Math.max(1.5, targetVec.current.y),
        targetVec.current.z,
      ]
      setCurrentPos(newPos)
      groupRef.current.position.set(newPos[0], newPos[1], newPos[2])
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.12, delta * 8)
      return
    }

    // 3. Resting / Returning to shelf state
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      shelfPosition[0],
      delta * 8
    )
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      isHovered && !disabled ? shelfPosition[1] + 0.1 : shelfPosition[1],
      delta * 8
    )
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      shelfPosition[2],
      delta * 8
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 8)
  })

  return (
    <group
      ref={groupRef}
      position={shelfPosition}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (!disabled && !isPouring) {
          onPour()
        }
      }}
      onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (!disabled && !isPouring) {
          setIsHovered(true)
          setShowTooltip(true)
          document.body.style.cursor = 'grab'
        }
      }}
      onPointerLeave={() => {
        setIsHovered(false)
        setShowTooltip(false)
        if (!isDragging) {
          document.body.style.cursor = 'auto'
        }
      }}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (disabled || isPouring) return
        setIsDragging(true)
        setIsDraggingApparatus(true)
        document.body.style.cursor = 'grabbing'
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (!isDragging) return
        setIsDragging(false)
        setIsDraggingApparatus(false)
        document.body.style.cursor = 'auto'

        const isNear = checkTargetProximity(currentPos)
        if (isNear) {
          onPour()
        }
      }}
    >
      {/* Selection Glow Ring */}
      {(isHovered || isDragging) && !disabled && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.32, 24]} />
          <meshStandardMaterial
            color={isDragging ? '#16a34a' : '#a9713a'}
            emissive={isDragging ? '#16a34a' : '#a9713a'}
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Bottle Base & Body */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.19, 0.55, 16]} />
        <meshStandardMaterial
          color={bottleColor}
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Chemical Liquid Inside */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.42, 14]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Bottle Shoulder */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.18, 0.1, 16]} />
        <meshStandardMaterial
          color={bottleColor}
          transparent
          opacity={0.35}
          roughness={0.1}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.12, 14]} />
        <meshStandardMaterial
          color={bottleColor}
          transparent
          opacity={0.35}
          roughness={0.1}
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.08, 14]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Label on Bottle */}
      <mesh position={[0, 0.28, 0.182]}>
        <planeGeometry args={[0.24, 0.28]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* HTML Hover Tooltip (hidden when completed) */}
      {showTooltip && !isCompleted && (
        <Html position={[0, 0.95, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-[#fbf4e8]/95 text-[#3d2b1c] border border-[#d9c3a0] shadow-xl whitespace-nowrap text-xs">
            <span className="font-bold text-[#a9713a]">{name}</span>
            <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
              <span>💧</span> Drag to {targetLabel}
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}
