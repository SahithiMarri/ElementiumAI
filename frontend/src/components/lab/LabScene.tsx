import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Text } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Suspense, useRef } from 'react'
import LabEnvironment from './LabEnvironment'
import ApparatusShelf from './apparatus/ApparatusShelf'
import ChemicalShelf from './chemicals/ChemicalShelf'
import WorkbenchSetup from './WorkbenchSetup'
import { useLabStore } from '../../store/labStore'

/**
 * Photorealistic academic chemistry laboratory scene.
 * - Eye-level student perspective on the EDTA Workstation
 * - Architectural lab room with benches, fume hood, safety station, windows, lighting
 * - Zero obstructing foreground slabs
 * - Smooth OrbitControls with reset view option
 */
export default function LabScene() {
  const { isDraggingApparatus } = useLabStore()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const cameraRef = useRef<any>(null)

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2.4, 6.0)
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.35, 0.6)
      controlsRef.current.update()
    }
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        className="w-full h-full"
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ camera }) => {
          cameraRef.current = camera
        }}
      >
        <color attach="background" args={['#c7d1cd']} />
        <fog attach="fog" args={['#c7d1cd', 35, 72]} />

        <PerspectiveCamera makeDefault position={[0, 2.4, 6.0]} fov={52} near={0.1} far={120} />

        {/* Ambient & Daylight Hemisphere Lights */}
        <ambientLight intensity={1.45} color="#e9f2ed" />
        <hemisphereLight intensity={1.2} color="#fbfff9" groundColor="#87938f" />

        {/* Sun Directional Light with Shadows */}
        <directionalLight
          castShadow
          position={[-12, 18, 8]}
          intensity={2.65}
          color="#fff6dc"
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-bias={-0.0005}
        />

        {/* Specialized Lab Point Light */}
        <pointLight position={[8, 6, -7]} intensity={15} distance={24} color="#d6fff2" />

        <Suspense fallback={null}>
          <LabEnvironment />

          {/* Academic Laboratory Header 3D Banner */}
          <Text
            position={[0, 5.65, -10.35]}
            fontSize={0.22}
            color="#285c55"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            ELEMENTIUM · UNDERGRADUATE CHEMISTRY LABORATORY
          </Text>

          {/* Soft Ground Contact Shadows */}
          <ContactShadows position={[0, 0.81, 0.6]} opacity={0.35} scale={12} blur={2.0} far={4} />

          {/* Interactive Lab Apparatus and Chemical Shelves */}
          <ApparatusShelf />
          <ChemicalShelf />
          <WorkbenchSetup />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enabled={!isDraggingApparatus}
          target={[0, 1.35, 0.6]}
          minDistance={2.2}
          maxDistance={8.5}
          minAzimuthAngle={-0.85}
          maxAzimuthAngle={0.85}
          minPolarAngle={0.8}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableDamping
          dampingFactor={0.12}
          zoomSpeed={1.8}
        />
      </Canvas>

      {/* Camera Reset Button */}
      <button
        type="button"
        onClick={resetCamera}
        className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-stone-200 text-[10px] font-bold tracking-wider uppercase border border-stone-700/60 shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5"
        title="Reset Camera View"
      >
        <span>🔄</span> Reset View
      </button>
    </div>
  )
}
