import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const colors = {
  floor: '#c4cbc8',
  floorLine: '#aeb7b3',
  wall: '#e8ece9',
  wallTrim: '#c5cfcb',
  cabinet: '#d7dedb',
  cabinetDark: '#8b9691',
  counter: '#4c5755',
  counterEdge: '#2f3a38',
  steel: '#aab5b2',
  steelDark: '#65716e',
  teal: '#287d78',
  tealBright: '#54aaa0',
  amber: '#cc9146',
  red: '#b85147',
  glass: '#c8e8e4',
  rubber: '#27302e',
  wood: '#b08d67',
}

const matte = (color: string, roughness = 0.74, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness })

function Box({
  position,
  scale,
  color,
  roughness,
  metalness,
  cast = true,
  receive = true,
}: {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
  roughness?: number
  metalness?: number
  cast?: boolean
  receive?: boolean
}) {
  return (
    <mesh position={position} scale={scale} castShadow={cast} receiveShadow={receive}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={matte(color, roughness, metalness)} attach="material" />
    </mesh>
  )
}

function Cylinder({
  position,
  radius,
  height,
  color,
  radial = 24,
  metalness = 0,
}: {
  position: [number, number, number]
  radius: number
  height: number
  color: string
  radial?: number
  metalness?: number
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, radial]} />
      <primitive object={matte(color, 0.52, metalness)} attach="material" />
    </mesh>
  )
}

function Floor() {
  const tiles = useMemo(() => {
    const items: { position: [number, number, number]; accent: boolean }[] = []
    for (let x = -15; x <= 15; x += 2) {
      for (let z = -10; z <= 10; z += 2) {
        items.push({ position: [x, 0.01, z], accent: (x + z) % 4 === 0 })
      }
    }
    return items
  }, [])
  return (
    <group name="Floor">
      <Box position={[0, -0.16, 0]} scale={[32, 0.32, 22]} color={colors.floor} roughness={0.9} />
      {tiles.map((tile, index) => (
        <Box
          key={index}
          position={tile.position}
          scale={[1.94, 0.018, 1.94]}
          color={tile.accent ? '#bac3bf' : colors.floor}
          roughness={0.94}
          cast={false}
        />
      ))}
      <Box position={[0, 0.03, -10.55]} scale={[32, 0.1, 0.12]} color={colors.floorLine} roughness={0.85} />
      <Box position={[-15.55, 0.03, 0]} scale={[0.12, 0.1, 22]} color={colors.floorLine} roughness={0.85} />
      <Box position={[15.55, 0.03, 0]} scale={[0.12, 0.1, 22]} color={colors.floorLine} roughness={0.85} />
    </group>
  )
}

function WallShell() {
  return (
    <group name="LabRoom">
      <Box position={[0, 4.5, -10.7]} scale={[32, 9, 0.3]} color={colors.wall} roughness={0.88} />
      <Box position={[-15.7, 4.5, 0]} scale={[0.3, 9, 22]} color={colors.wall} roughness={0.88} />
      <Box position={[15.7, 4.5, 0]} scale={[0.3, 9, 22]} color={colors.wall} roughness={0.88} />
      <Box position={[0, 9.1, 0]} scale={[32, 0.28, 22]} color="#dfe5e2" roughness={0.92} />
      <Box position={[0, 8.75, -10.45]} scale={[31.7, 0.42, 0.18]} color={colors.wallTrim} roughness={0.7} />
      <Box position={[-15.45, 8.75, 0]} scale={[0.18, 0.42, 21.7]} color={colors.wallTrim} roughness={0.7} />
    </group>
  )
}

function WindowUnit({ position, width = 4.8 }: { position: [number, number, number]; width?: number }) {
  return (
    <group name="Window" position={position}>
      <Box position={[0, 0, 0]} scale={[width, 3.5, 0.12]} color="#8c9895" roughness={0.5} metalness={0.35} />
      <Box position={[0, 0, 0.08]} scale={[width - 0.24, 3.25, 0.05]} color="#a6cfce" roughness={0.22} metalness={0.05} />
      <Box position={[0, 0, 0.13]} scale={[0.08, 3.3, 0.04]} color="#dfe8e5" roughness={0.35} />
      <Box position={[0, 0, 0.14]} scale={[width - 0.16, 0.08, 0.04]} color="#dfe8e5" roughness={0.35} />
      <Box position={[-width / 2 - 0.13, 0, 0]} scale={[0.16, 3.75, 0.2]} color={colors.wallTrim} roughness={0.75} />
      <Box position={[width / 2 + 0.13, 0, 0]} scale={[0.16, 3.75, 0.2]} color={colors.wallTrim} roughness={0.75} />
    </group>
  )
}

function Cabinet({ position, width = 2.25, drawers = 2 }: { position: [number, number, number]; width?: number; drawers?: number }) {
  return (
    <group name="Cabinet" position={position}>
      <Box position={[0, 1.15, 0]} scale={[width, 2.3, 0.68]} color={colors.cabinet} roughness={0.62} />
      <Box position={[0, 0.02, -0.37]} scale={[width + 0.04, 0.08, 0.04]} color={colors.cabinetDark} roughness={0.65} />
      {Array.from({ length: drawers }).map((_, index) => (
        <group key={index}>
          <Box position={[0, 1.63 - index * 0.64, 0.36]} scale={[width - 0.22, 0.51, 0.04]} color="#c7d0cd" roughness={0.66} />
          <Box position={[0, 1.63 - index * 0.64, 0.405]} scale={[0.55, 0.035, 0.025]} color={colors.steelDark} roughness={0.4} metalness={0.6} />
        </group>
      ))}
      <Box position={[-width / 2 + 0.05, 1.15, 0.39]} scale={[0.05, 2.08, 0.05]} color={colors.steelDark} roughness={0.4} metalness={0.5} />
      <Box position={[width / 2 - 0.05, 1.15, 0.39]} scale={[0.05, 2.08, 0.05]} color={colors.steelDark} roughness={0.4} metalness={0.5} />
    </group>
  )
}

function Sink({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group name="Sink" position={position} rotation={[0, rotation, 0]}>
      <Box position={[0, 0.02, 0]} scale={[1.25, 0.055, 0.82]} color="#384341" roughness={0.35} metalness={0.55} />
      <Box position={[0, 0.065, 0]} scale={[1.09, 0.035, 0.66]} color="#1e2725" roughness={0.25} metalness={0.45} />
      <Cylinder position={[0, 0.1, 0]} radius={0.075} height={0.04} color="#c6cfcc" metalness={0.8} />
      <mesh position={[0, 0.76, -0.26]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.38, 0.055, 12, 24, Math.PI]} />
        <primitive object={matte(colors.steel, 0.27, 0.75)} attach="material" />
      </mesh>
      <Box position={[0, 0.44, 0.1]} scale={[0.11, 0.7, 0.11]} color={colors.steel} roughness={0.28} metalness={0.8} />
      <Box position={[0, 0.18, 0.1]} scale={[0.38, 0.1, 0.24]} color={colors.steel} roughness={0.28} metalness={0.8} />
    </group>
  )
}

function Faucet({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group name="Faucet" position={position} rotation={[0, rotation, 0]}>
      <Cylinder position={[0, 0.19, 0]} radius={0.075} height={0.38} color={colors.steel} metalness={0.8} />
      <mesh position={[0, 0.43, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.045, 10, 18, Math.PI]} />
        <primitive object={matte(colors.steel, 0.26, 0.84)} attach="material" />
      </mesh>
      <Box position={[0, 0.42, -0.31]} scale={[0.09, 0.09, 0.26]} color={colors.steel} roughness={0.25} metalness={0.8} />
      <Box position={[-0.18, 0.13, 0]} scale={[0.06, 0.2, 0.06]} color={colors.steelDark} roughness={0.35} metalness={0.7} />
      <Box position={[0.18, 0.13, 0]} scale={[0.06, 0.2, 0.06]} color={colors.steelDark} roughness={0.35} metalness={0.7} />
    </group>
  )
}

function Outlet({ position }: { position: [number, number, number] }) {
  return (
    <group name="ElectricalOutlet" position={position}>
      <Box position={[0, 0, 0]} scale={[0.36, 0.23, 0.06]} color="#f0f2ef" roughness={0.56} />
      <Box position={[-0.075, 0, 0.034]} scale={[0.035, 0.12, 0.012]} color="#6f7774" roughness={0.45} />
      <Box position={[0.075, 0, 0.034]} scale={[0.035, 0.12, 0.012]} color="#6f7774" roughness={0.45} />
    </group>
  )
}

function LabBench({
  position,
  rotation = 0,
  length = 11,
  depth = 1.52,
  sinkAtEnd = true,
  label = 'Bench',
}: {
  position: [number, number, number]
  rotation?: number
  length?: number
  depth?: number
  sinkAtEnd?: boolean
  label?: string
}) {
  const cabinetCount = Math.max(3, Math.floor(length / 2.6))
  return (
    <group name="LabBench" position={position} rotation={[0, rotation, 0]}>
      {/* Dark slate countertop */}
      <Box position={[0, 2.48, 0]} scale={[length, 0.22, depth]} color={colors.counter} roughness={0.42} metalness={0.14} />
      <Box position={[0, 2.36, 0]} scale={[length + 0.06, 0.08, depth + 0.06]} color={colors.counterEdge} roughness={0.46} />
      <Box position={[-length / 2 + 0.16, 1.25, 0]} scale={[0.18, 2.22, depth - 0.14]} color={colors.steelDark} roughness={0.55} metalness={0.6} />
      <Box position={[length / 2 - 0.16, 1.25, 0]} scale={[0.18, 2.22, depth - 0.14]} color={colors.steelDark} roughness={0.55} metalness={0.6} />
      {Array.from({ length: cabinetCount }).map((_, index) => (
        <Cabinet key={index} position={[-length / 2 + 1.3 + index * 2.6, 0.1, 0]} width={2.28} drawers={index % 2 === 0 ? 2 : 3} />
      ))}
      <Box position={[0, 2.13, -0.77]} scale={[length - 0.45, 0.12, 0.12]} color={colors.cabinetDark} roughness={0.57} />
      <Outlet position={[-length / 2 + 2.2, 2.75, -0.78]} />
      <Outlet position={[0, 2.75, -0.78]} />
      <Outlet position={[length / 2 - 2.2, 2.75, -0.78]} />
      {sinkAtEnd && <Sink position={[length / 2 - 1.35, 2.61, 0]} />}
      {sinkAtEnd && <Faucet position={[length / 2 - 1.35, 2.72, 0]} />}
      <Text position={[0, 2.62, -0.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#dfe7e4" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        {label.toUpperCase()} · CLEAR WORK SURFACE
      </Text>
    </group>
  )
}

function Stool({ position }: { position: [number, number, number] }) {
  return (
    <group name="Stool" position={position}>
      <Cylinder position={[0, 1.33, 0]} radius={0.58} height={0.12} color={colors.wood} metalness={0.08} />
      <Cylinder position={[0, 0.65, 0]} radius={0.1} height={1.3} color={colors.steelDark} metalness={0.72} />
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.56, 0.06, 10, 24]} />
        <primitive object={matte(colors.steelDark, 0.4, 0.7)} attach="material" />
      </mesh>
      <Box position={[0, 0.31, 0]} scale={[1.15, 0.06, 0.06]} color={colors.steelDark} roughness={0.44} metalness={0.75} />
      <Box position={[0, 0.31, 0]} scale={[0.06, 0.06, 1.15]} color={colors.steelDark} roughness={0.44} metalness={0.75} />
    </group>
  )
}

function FumeHood({ position }: { position: [number, number, number] }) {
  return (
    <group name="FumeHood" position={position}>
      <Box position={[0, 3.25, 0]} scale={[4.4, 0.22, 1.75]} color={colors.steelDark} roughness={0.42} metalness={0.66} />
      <Box position={[-2.05, 1.68, 0]} scale={[0.22, 3.0, 1.72]} color={colors.steel} roughness={0.42} metalness={0.6} />
      <Box position={[2.05, 1.68, 0]} scale={[0.22, 3.0, 1.72]} color={colors.steel} roughness={0.42} metalness={0.6} />
      <Box position={[0, 0.3, 0]} scale={[4.15, 0.26, 1.55]} color={colors.counter} roughness={0.42} metalness={0.2} />
      <Box position={[0, 1.76, -0.74]} scale={[3.85, 2.58, 0.04]} color="#b7d5d1" roughness={0.16} metalness={0.1} />
      <Box position={[0, 1.72, 0.5]} scale={[3.82, 0.06, 0.1]} color={colors.teal} roughness={0.42} metalness={0.2} />
      <Box position={[0, 3.0, 0.5]} scale={[3.82, 0.06, 0.1]} color={colors.teal} roughness={0.42} metalness={0.2} />
      <Box position={[-1.3, 1.72, 0.5]} scale={[0.06, 2.62, 0.1]} color={colors.teal} roughness={0.42} metalness={0.2} />
      <Box position={[1.3, 1.72, 0.5]} scale={[0.06, 2.62, 0.1]} color={colors.teal} roughness={0.42} metalness={0.2} />
      <Box position={[0, 3.95, 0]} scale={[1.05, 1.08, 0.95]} color={colors.steelDark} roughness={0.48} metalness={0.62} />
      <Box position={[0, 4.55, 0]} scale={[0.72, 0.22, 0.7]} color={colors.steelDark} roughness={0.44} metalness={0.72} />
      <Text position={[0, 3.12, 0.58]} rotation={[0, 0, 0]} fontSize={0.18} color="#e3f3ee" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        FUME HOOD · EXTRACTION
      </Text>
    </group>
  )
}

function StorageWall({ position }: { position: [number, number, number] }) {
  return (
    <group name="ChemicalStorage" position={position}>
      <Box position={[0, 2.45, 0]} scale={[4.8, 4.9, 1.0]} color={colors.cabinetDark} roughness={0.54} metalness={0.48} />
      <Box position={[0, 2.38, -0.54]} scale={[4.4, 4.55, 0.06]} color="#44514e" roughness={0.42} />
      <Box position={[-1.15, 2.5, -0.59]} scale={[1.92, 3.8, 0.04]} color="#8fa6a2" roughness={0.18} metalness={0.1} />
      <Box position={[1.15, 2.5, -0.59]} scale={[1.92, 3.8, 0.04]} color="#8fa6a2" roughness={0.18} metalness={0.1} />
      <Box position={[0, 0.2, -0.64]} scale={[4.45, 0.18, 0.18]} color={colors.counterEdge} roughness={0.5} />
      <Text position={[0, 4.52, -0.61]} fontSize={0.22} color="#f4f8f3" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        CHEMICAL STORAGE
      </Text>
      <Text position={[-1.15, 2.5, -0.65]} fontSize={0.15} color="#21423e" anchorX="center" anchorY="middle" maxWidth={1.65} textAlign="center" lineHeight={1.4}>
        ACIDS{'\n'}BASES{'\n'}LOCKED
      </Text>
      <Text position={[1.15, 2.5, -0.65]} fontSize={0.15} color="#21423e" anchorX="center" anchorY="middle" maxWidth={1.65} textAlign="center" lineHeight={1.4}>
        SOLVENTS{'\n'}OXIDIZERS{'\n'}LOCKED
      </Text>
    </group>
  )
}

function SafetyStation({ position }: { position: [number, number, number] }) {
  return (
    <group name="SafetyStation" position={position}>
      <Box position={[0, 1.65, 0]} scale={[2.6, 2.65, 0.38]} color="#f1f3ed" roughness={0.62} />
      <Box position={[0, 2.65, -0.22]} scale={[2.25, 0.55, 0.08]} color={colors.teal} roughness={0.5} />
      <Text position={[0, 2.68, -0.28]} fontSize={0.18} color="#eaf8f3" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        EMERGENCY SAFETY STATION
      </Text>
      <Box position={[-0.76, 1.75, -0.23]} scale={[0.72, 0.82, 0.06]} color="#b8d9d4" roughness={0.25} />
      <Box position={[0.76, 1.75, -0.23]} scale={[0.72, 0.82, 0.06]} color="#b8d9d4" roughness={0.25} />
      <Text position={[-0.76, 1.74, -0.29]} fontSize={0.13} color="#205c57" anchorX="center" anchorY="middle" maxWidth={0.6} textAlign="center">
        EYEWASH
      </Text>
      <Text position={[0.76, 1.74, -0.29]} fontSize={0.13} color="#205c57" anchorX="center" anchorY="middle" maxWidth={0.6} textAlign="center">
        SHOWER
      </Text>
      <Box position={[0, 0.54, 0]} scale={[2.2, 0.12, 0.56]} color={colors.steelDark} roughness={0.48} metalness={0.65} />
      <Cylinder position={[-0.74, 0.9, -0.2]} radius={0.12} height={0.85} color={colors.steel} metalness={0.76} />
      <Cylinder position={[0.74, 0.9, -0.2]} radius={0.12} height={0.85} color={colors.steel} metalness={0.76} />
    </group>
  )
}

function WasteBin({ position, accent = colors.teal }: { position: [number, number, number]; accent?: string }) {
  return (
    <group name="WasteBin" position={position}>
      <Box position={[0, 0.62, 0]} scale={[0.7, 1.22, 0.7]} color={colors.steelDark} roughness={0.63} metalness={0.35} />
      <Box position={[0, 1.27, 0]} scale={[0.78, 0.12, 0.78]} color={accent} roughness={0.44} metalness={0.15} />
      <Text position={[0, 0.62, 0.37]} rotation={[0, 0, 0]} fontSize={0.13} color="#eaf4f0" anchorX="center" anchorY="middle" letterSpacing={0.06}>
        WASTE
      </Text>
    </group>
  )
}

function FireExtinguisher({ position }: { position: [number, number, number] }) {
  return (
    <group name="FireExtinguisher" position={position}>
      <Cylinder position={[0, 1.05, 0]} radius={0.22} height={1.38} color={colors.red} radial={20} />
      <Cylinder position={[0, 1.82, 0]} radius={0.13} height={0.18} color={colors.steelDark} metalness={0.7} />
      <Box position={[0.22, 1.65, 0]} scale={[0.06, 0.52, 0.06]} color={colors.rubber} roughness={0.8} />
      <Box position={[0, 2.14, 0]} scale={[0.52, 0.08, 0.06]} color="#f4efdd" roughness={0.56} />
      <Text position={[0, 2.15, 0.05]} fontSize={0.11} color="#8e312d" anchorX="center" anchorY="middle">
        FIRE
      </Text>
    </group>
  )
}

function Signage() {
  return (
    <group name="SafetySignage">
      <group position={[-12.5, 5.75, -10.48]}>
        <Box position={[0, 0, 0]} scale={[2.5, 0.72, 0.06]} color={colors.teal} roughness={0.5} />
        <Text position={[0, 0, 0.05]} fontSize={0.17} color="#f3faf5" anchorX="center" anchorY="middle" letterSpacing={0.12}>
          UNDERGRADUATE TEACHING LAB
        </Text>
      </group>
      <group position={[8.5, 5.5, -10.48]}>
        <Box position={[0, 0, 0]} scale={[1.9, 1.06, 0.06]} color="#f0d67c" roughness={0.56} />
        <Text position={[0, 0.18, 0.05]} fontSize={0.13} color="#594a20" anchorX="center" anchorY="middle" letterSpacing={0.08}>
          PPE REQUIRED
        </Text>
        <Text position={[0, -0.16, 0.05]} fontSize={0.11} color="#594a20" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          EYE PROTECTION · COAT · CLOSED SHOES
        </Text>
      </group>
      <group position={[12.3, 5.4, -10.48]}>
        <Box position={[0, 0, 0]} scale={[1.18, 1.18, 0.06]} color="#f2ead2" roughness={0.56} />
        <Text position={[0, 0.2, 0.05]} fontSize={0.18} color="#285c55" anchorX="center" anchorY="middle">
          ✓
        </Text>
        <Text position={[0, -0.18, 0.05]} fontSize={0.1} color="#285c55" anchorX="center" anchorY="middle" letterSpacing={0.04}>
          WASH HANDS
        </Text>
      </group>
    </group>
  )
}

function CeilingFixtures() {
  const fixtures = [-11, -4, 3, 10]
  return (
    <group name="LightFixtures">
      {fixtures.map((x) => (
        <group key={x} position={[x, 8.78, -1]}>
          <Box position={[0, 0, 0]} scale={[4.4, 0.08, 0.36]} color="#f5f6ef" roughness={0.22} metalness={0.18} />
          <Box position={[0, -0.055, 0]} scale={[3.9, 0.028, 0.22]} color="#fff6d9" roughness={0.2} metalness={0.1} />
          <rectAreaLight width={4} height={0.28} intensity={5} color="#fff4d0" position={[0, -0.12, 0]} rotation={[Math.PI, 0, 0]} />
        </group>
      ))}
    </group>
  )
}

function Door({ position }: { position: [number, number, number] }) {
  return (
    <group name="Door" position={position}>
      <Box position={[0, 2.3, 0]} scale={[2.6, 4.6, 0.22]} color="#74817e" roughness={0.62} metalness={0.32} />
      <Box position={[0, 2.45, 0.14]} scale={[1.86, 3.4, 0.05]} color="#8fb5b2" roughness={0.26} metalness={0.04} />
      <Box position={[-0.78, 2.45, 0.18]} scale={[0.06, 3.3, 0.04]} color="#d5e5df" roughness={0.32} />
      <Box position={[0.8, 2.45, 0.18]} scale={[0.06, 3.3, 0.04]} color="#d5e5df" roughness={0.32} />
      <Box position={[0.78, 2.25, 0.25]} scale={[0.08, 0.5, 0.08]} color="#c9d4ce" roughness={0.3} metalness={0.65} />
      <Text position={[0, 4.88, 0.15]} fontSize={0.14} color="#285c55" anchorX="center" anchorY="middle" letterSpacing={0.11}>
        MAIN EXIT
      </Text>
    </group>
  )
}

export default function LabEnvironment() {
  return (
    <group position={[0, -1.77, 0]}>
      <Floor />
      <WallShell />
      <WindowUnit position={[-7.8, 5.5, -10.5]} width={5.2} />
      <WindowUnit position={[-1.5, 5.5, -10.5]} width={5.2} />
      <WindowUnit position={[4.8, 5.5, -10.5]} width={5.2} />
      <Door position={[12.35, 2.35, -10.5]} />
      {/* Background Benches (placed safely behind/away from camera) */}
      <LabBench position={[-3.0, 0, -5.3]} length={12} sinkAtEnd label="Station A" />
      <LabBench position={[2.8, 0, -4.5]} rotation={Math.PI / 2} length={8} sinkAtEnd label="Station B" />
      {/* Central Student EDTA Workstation Benchmark Counter */}
      <LabBench position={[0, 0, 0.6]} length={16} depth={2.6} sinkAtEnd={false} label="EDTA WORKSTATION" />
      <FumeHood position={[10.6, 0, -5.3]} />
      <StorageWall position={[10.6, 0, 3.2]} />
      <SafetyStation position={[-12.9, 0, -4.4]} />
      <FireExtinguisher position={[-12.85, 0, 0.6]} />
      <WasteBin position={[10.8, 0, 5.4]} accent={colors.amber} />
      <WasteBin position={[-11.1, 0, 6.9]} accent={colors.teal} />
      <Stool position={[-6.2, 0, -2.5]} />
      <Stool position={[6.2, 0, -2.5]} />
      <Signage />
      <CeilingFixtures />
    </group>
  )
}
