/**
 * Light-Themed Lab Room Environment.
 * Clean, modern scientific laboratory with white/light-grey walls,
 * light ceramic floor tiles, clean white countertop, and stainless steel accents.
 */
export default function LabEnvironment() {
  return (
    <group>
      {/* ── Floor (Light ceramic tiles) ───────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[22, 18]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Floor grid lines (subtle tile borders) */}
      <gridHelper
        args={[22, 22, '#cbd5e1', '#cbd5e1']}
        position={[0, 0.001, 0]}
      />

      {/* ── Back wall (Light off-white lab wall) ──────────────── */}
      <mesh position={[0, 4, -8]} receiveShadow>
        <boxGeometry args={[22, 8, 0.15]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Wall decorative accent stripe */}
      <mesh position={[0, 3.2, -7.9]}>
        <boxGeometry args={[22, 0.1, 0.02]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>

      {/* ── Left wall ─────────────────────────────────────────── */}
      <mesh position={[-11, 4, 0]} receiveShadow>
        <boxGeometry args={[0.15, 8, 18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* ── Right wall ────────────────────────────────────────── */}
      <mesh position={[11, 4, 0]} receiveShadow>
        <boxGeometry args={[0.15, 8, 18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────────── */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[22, 0.15, 18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* ── Daylight ceiling light strips ─────────────────────── */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 7.9, -1]}>
          <boxGeometry args={[0.4, 0.05, 5]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* ── Main Workbench ────────────────────────────────────── */}
      <Workbench />

      {/* ── Apparatus Shelf structure (Left) ──────────────────── */}
      <ShelfUnit position={[-4.5, 0, -2]} />

      {/* ── Chemical Shelf structure (Right) ─────────────────── */}
      <ShelfUnit position={[4.5, 0, -2]} />

      {/* ── Sink ──────────────────────────────────────────────── */}
      <Sink position={[-4.5, 0, 5.5]} />

      {/* ── Waste container ───────────────────────────────────── */}
      <WasteContainer position={[4.5, 0, 5.5]} />

      {/* ── Lab stools ────────────────────────────────────────── */}
      <Stool position={[0, 0, 5]} />
      <Stool position={[2.5, 0, 5]} />
    </group>
  )
}

// ─── Workbench ───────────────────────────────────────────────────────────────
function Workbench() {
  return (
    <group position={[0, 0, 1]}>
      {/* Clean white epoxy countertop */}
      <mesh position={[0, 0.78, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.08, 3.5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Edge trim */}
      <mesh position={[0, 0.75, 1.76]}>
        <boxGeometry args={[6.04, 0.06, 0.04]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>
      {/* Clean brushed steel legs */}
      {[[-2.8, -1.5], [-2.8, 1.5], [2.8, -1.5], [2.8, 1.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.38, z]} castShadow>
          <boxGeometry args={[0.12, 0.76, 0.12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Lower utility shelf */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[5.7, 0.05, 3.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
    </group>
  )
}

// ─── Shelf Unit ──────────────────────────────────────────────────────────────
function ShelfUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Back panel (light grey frame) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.2, 5, 0.08]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      {/* Shelves (clean white & aluminium trim) */}
      {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
        <group key={i} position={[0, y, 0.3]}>
          <mesh>
            <boxGeometry args={[2, 0.06, 0.7]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.01, 0.355]}>
            <boxGeometry args={[2.02, 0.04, 0.02]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Sink ─────────────────────────────────────────────────────────────────────
function Sink({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.08, 0.9]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Basin */}
      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Chrome Tap */}
      <mesh position={[0, 0.96, -0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.16, -0.15]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  )
}

// ─── Waste Container ──────────────────────────────────────────────────────────
function WasteContainer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.6, 12]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>
      {/* Biohazard / Waste Rim */}
      <mesh position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.3} />
      </mesh>
    </group>
  )
}

// ─── Lab Stool ────────────────────────────────────────────────────────────────
function Stool({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.22, 0.06, 14]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Chrome Post */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 10]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}
