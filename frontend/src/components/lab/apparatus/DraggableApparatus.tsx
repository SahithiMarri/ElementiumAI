import { useRef, useState, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useLabStore } from '../../../store/labStore'

interface SnapZone {
  id: string
  position: [number, number, number]
  radius: number
}

interface DraggableApparatusProps {
  id: string
  name: string
  children: React.ReactNode
  initialPosition: [number, number, number]
  snapZones: SnapZone[]
  onSnap?: (snapZoneId: string, position: [number, number, number]) => void
  disabled?: boolean
  shelfHint?: string
}

const WORKBENCH_Y = 0.82

export function DraggableApparatus({
  id,
  name,
  children,
  initialPosition,
  snapZones,
  onSnap,
  disabled = false,
  shelfHint = 'Drag or Click to Place',
}: DraggableApparatusProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState<[number, number, number]>(initialPosition)
  const [showLabel, setShowLabel] = useState(false)

  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -WORKBENCH_Y))
  const targetVec = useRef(new THREE.Vector3())

  const { apparatus, placeApparatus, setIsDraggingApparatus } = useLabStore()
  const placed = apparatus[id]?.placed

  // Check if position is near any snap zone or over the workbench area
  const checkSnap = useCallback(
    (pos: [number, number, number]) => {
      // 1. First check explicit snap zones
      for (const zone of snapZones) {
        const dx = pos[0] - zone.position[0]
        const dz = pos[2] - zone.position[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist <= zone.radius) {
          return zone
        }
      }

      // 2. Generous workbench zone check: if dropped anywhere near workbench (-3.0 to +3.0 in X, -1.0 to +3.0 in Z)
      if (pos[0] > -3.0 && pos[0] < 3.0 && pos[2] > -1.0 && pos[2] < 3.0) {
        return snapZones[0] || null
      }

      return null
    },
    [snapZones]
  )

  // Direct snap-to-target action (for click-to-place)
  const snapToTarget = useCallback(() => {
    if (disabled) return
    const targetZone = snapZones[0]
    if (targetZone) {
      setIsDragging(false)
      setIsDraggingApparatus(false)
      setPosition(targetZone.position)
      placeApparatus(id, targetZone.id, targetZone.position)
      onSnap?.(targetZone.id, targetZone.position)
    }
  }, [disabled, snapZones, id, placeApparatus, onSnap, setIsDraggingApparatus])

  useFrame(({ raycaster, pointer, camera }) => {
    if (!isDragging || !groupRef.current) return
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(planeRef.current, targetVec.current)

    const newPos: [number, number, number] = [
      targetVec.current.x,
      Math.max(WORKBENCH_Y, targetVec.current.y),
      targetVec.current.z,
    ]
    setPosition(newPos)
    groupRef.current.position.set(newPos[0], newPos[1], newPos[2])
  })

  // Once placed, the main active workbench model renders inside WorkbenchSetup
  if (placed) return null

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (!disabled) {
          snapToTarget()
        }
      }}
      onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (!disabled) {
          setIsHovered(true)
          setShowLabel(true)
          document.body.style.cursor = 'grab'
        }
      }}
      onPointerLeave={() => {
        setIsHovered(false)
        setShowLabel(false)
        if (!isDragging) {
          document.body.style.cursor = 'auto'
        }
      }}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (disabled) return
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

        const snapped = checkSnap(position)
        if (snapped) {
          setPosition(snapped.position)
          placeApparatus(id, snapped.id, snapped.position)
          onSnap?.(snapped.id, snapped.position)
        } else {
          // Snap directly if dragged towards workbench
          snapToTarget()
        }
      }}
    >
      {/* Selection Glow / Ring */}
      {(isHovered || isDragging) && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.35, 24]} />
          <meshStandardMaterial
            color={isDragging ? '#16a34a' : '#0284c7'}
            transparent
            opacity={0.7}
            emissive={isDragging ? '#16a34a' : '#0284c7'}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}

      {/* 3D Apparatus model on shelf */}
      <group scale={isHovered ? 1.05 : 1}>{children}</group>

      {/* Label and Click-to-Place tooltip */}
      {showLabel && (
        <Html position={[0, 0.8, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center bg-white/95 text-slate-900 border border-sky-300 px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap text-xs">
            <span className="font-bold text-sky-800">{name}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>⚡</span> {shelfHint}
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}
