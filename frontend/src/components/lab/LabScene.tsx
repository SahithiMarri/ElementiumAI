import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import LabEnvironment from './LabEnvironment'
import ApparatusShelf from './apparatus/ApparatusShelf'
import ChemicalShelf from './chemicals/ChemicalShelf'
import WorkbenchSetup from './WorkbenchSetup'
import { useLabStore } from '../../store/labStore'

/**
 * Low-GPU optimized Light-Themed 3D Lab Scene.
 * - Clean daylight laboratory ambiance
 * - Balanced framing for left apparatus shelf, central workbench, and right chemical shelf
 * - OrbitControls disabled automatically during dragging
 */
export default function LabScene() {
  const { isDraggingApparatus } = useLabStore()

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      className="w-full h-full"
      style={{ paddingTop: '48px' }}
      gl={{
        antialias: true,
        powerPreference: 'low-power',
        alpha: false,
      }}
    >
      {/* Light daylight background and fog */}
      <color attach="background" args={['#eef4f8']} />
      <fog attach="fog" args={['#eef4f8', 12, 28]} />

      <PerspectiveCamera makeDefault position={[0, 3.0, 8.2]} fov={52} near={0.1} far={60} />

      {/* Daylight Lighting */}
      <ambientLight intensity={0.85} color="#ffffff" />
      <directionalLight
        position={[4, 9, 5]}
        intensity={1.3}
        color="#ffffff"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />
      {/* Lab ceiling daylight fill lights */}
      <pointLight position={[-2.5, 4.5, 0]} intensity={0.4} color="#f0f9ff" />
      <pointLight position={[2.5, 4.5, 0]} intensity={0.4} color="#f0f9ff" />

      <Suspense fallback={null}>
        <LabEnvironment />
        <ApparatusShelf />
        <ChemicalShelf />
        <WorkbenchSetup />
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={!isDraggingApparatus}
        enablePan={!isDraggingApparatus}
        enableZoom={!isDraggingApparatus}
        enableRotate={!isDraggingApparatus}
        minDistance={3}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.3, 0]}
        zoomSpeed={0.8}
        rotateSpeed={0.6}
        panSpeed={0.6}
      />
    </Canvas>
  )
}
