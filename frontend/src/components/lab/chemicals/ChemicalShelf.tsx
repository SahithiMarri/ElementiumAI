import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ChemicalBottle } from './ChemicalBottle'
import { useLabStore } from '../../../store/labStore'
import { useAIAssistant } from '../../../hooks/useAIAssistant'
import { validateStep } from '../../../engine/mistakeDetector/rules'
import exp01 from '../../../experiments/exp01_edta/config'

// Ray-aligned animated liquid stream pouring directly into vessel interior
function LiquidPourStream({
  startPos,
  endPos,
  color,
}: {
  startPos: [number, number, number]
  endPos: [number, number, number]
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const { mid, length, quat } = useMemo(() => {
    const a = new THREE.Vector3(...startPos)
    const b = new THREE.Vector3(...endPos)
    const delta = new THREE.Vector3().subVectors(b, a)
    const length = Math.max(0.1, delta.length())
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.clone().normalize()
    )
    return { mid, length, quat }
  }, [startPos, endPos])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Subtle stream thickness pulse
    const s = 1 + Math.sin(t * 22) * 0.12
    meshRef.current.scale.set(s, 1, s)
  })

  return (
    <group position={[mid.x, mid.y, mid.z]} quaternion={quat}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.024, 0.038, length, 12]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.92}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>
    </group>
  )
}

export default function ChemicalShelf() {
  const {
    currentStep,
    advanceStep,
    isPouring,
    activePourChemical,
    startPour,
    endPour,
    addSampleToFlask,
    addBufferToFlask,
    addIndicatorToFlask,
    fillBurette,
    addNotebookEntry,
    addAIMessage,
    showMistakeMessage,
  } = useLabStore()

  const { sendGuidance, sendCorrection } = useAIAssistant()

  // Target vessel rim coordinates
  const FLASK_TARGET: [number, number, number] = [-0.8, 2.55, 0.72]
  const BURETTE_TARGET: [number, number, number] = [-0.8, 5.52, 0.72]

  // Hover/Tilt positions: placed to the right of the vessel, tilting leftwards over the opening
  const FLASK_POUR: [number, number, number] = [-0.18, 2.23, 0.72]
  const BURETTE_POUR: [number, number, number] = [-0.18, 5.20, 0.72]

  // Stream spout origin & stream landing inside the vessel
  const FLASK_STREAM_START: [number, number, number] = [-0.80, 2.58, 0.72]
  const FLASK_STREAM_END: [number, number, number] = [-0.80, 1.15, 0.72]

  const BURETTE_STREAM_START: [number, number, number] = [-0.80, 5.55, 0.72]
  const BURETTE_STREAM_END: [number, number, number] = [-0.80, 4.00, 0.72]

  const handlePourChemical = (chemicalId: string) => {
    const state = useLabStore.getState()

    // ── 1. Hard Water Sample ────────────────────────────────────────────────
    if (chemicalId === 'hardWater') {
      if (currentStep === 'PREPARE_SAMPLE') {
        const err = validateStep('PREPARE_SAMPLE', state)
        if (err) {
          showMistakeMessage(err)
          sendCorrection(err)
          return
        }

        startPour('hardWater')

        setTimeout(() => {
          addSampleToFlask()
          addNotebookEntry({
            step: 'PREPARE_SAMPLE',
            text: '✓ Transferred 25.0 mL of Hard Water sample into Conical Flask.',
            type: 'observation',
          })
          addAIMessage({
            text: '✓ 25 mL Hard Water transferred! Now drag the Ammonia Buffer (pH 10) bottle to the conical flask.',
            type: 'success',
          })
          advanceStep('ADD_BUFFER')
          sendGuidance('ADD_BUFFER')
        }, 1400)

        setTimeout(() => {
          endPour()
        }, 1800)
        return
      } else {
        const msg = 'Hard Water sample is already added or not required at this step.'
        showMistakeMessage(msg)
        sendCorrection(msg)
        return
      }
    }

    // ── 2. Ammonia Buffer ───────────────────────────────────────────────────
    if (chemicalId === 'buffer') {
      if (currentStep === 'ADD_BUFFER') {
        const err = validateStep('ADD_BUFFER', state)
        if (err) {
          showMistakeMessage(err)
          sendCorrection(err)
          return
        }

        startPour('buffer')

        setTimeout(() => {
          addBufferToFlask()
          addNotebookEntry({
            step: 'ADD_BUFFER',
            text: '✓ Added 2 mL Ammonia Buffer (pH 10) to maintain alkaline pH in flask.',
            type: 'observation',
          })
          addAIMessage({
            text: '✓ Buffer added! Now drag the Eriochrome Black T (EBT) Indicator bottle to add 2-3 drops into the flask.',
            type: 'success',
          })
          advanceStep('ADD_INDICATOR')
          sendGuidance('ADD_INDICATOR')
        }, 1400)

        setTimeout(() => {
          endPour()
        }, 1800)
        return
      } else {
        const msg = currentStep === 'SETUP_APPARATUS' || currentStep === 'PREPARE_SAMPLE'
          ? 'Transfer the hard water sample into the flask before adding buffer.'
          : 'Buffer is not required at this stage.'
        showMistakeMessage(msg)
        sendCorrection(msg)
        return
      }
    }

    // ── 3. EBT Indicator ────────────────────────────────────────────────────
    if (chemicalId === 'ebt') {
      if (currentStep === 'ADD_INDICATOR') {
        const err = validateStep('ADD_INDICATOR', state)
        if (err) {
          showMistakeMessage(err)
          sendCorrection(err)
          return
        }

        startPour('ebt')

        setTimeout(() => {
          addIndicatorToFlask()
          addNotebookEntry({
            step: 'ADD_INDICATOR',
            text: '✓ Added 2-3 drops of EBT Indicator. Solution turned Wine Red due to metal-indicator complex formation.',
            type: 'observation',
          })
          addAIMessage({
            text: '✓ Solution turned Wine Red! Now drag the standard EDTA Solution bottle to fill the burette.',
            type: 'success',
          })
          advanceStep('FILL_BURETTE')
          sendGuidance('FILL_BURETTE')
        }, 1400)

        setTimeout(() => {
          endPour()
        }, 1800)
        return
      } else {
        const msg = 'Add sample and buffer into the flask before adding EBT indicator.'
        showMistakeMessage(msg)
        sendCorrection(msg)
        return
      }
    }

    // ── 4. EDTA Solution ────────────────────────────────────────────────────
    if (chemicalId === 'edta') {
      if (currentStep === 'FILL_BURETTE') {
        const err = validateStep('FILL_BURETTE', state)
        if (err) {
          showMistakeMessage(err)
          sendCorrection(err)
          return
        }

        startPour('edta')

        setTimeout(() => {
          fillBurette()
          addNotebookEntry({
            step: 'FILL_BURETTE',
            text: '✓ Filled Burette with standard 0.01M EDTA solution up to the 0.00 mL mark.',
            type: 'observation',
          })
          addAIMessage({
            text: '✓ Burette filled with EDTA! Now open the stopcock to start titration. Click and hold the flask to swirl continuously.',
            type: 'success',
          })
          advanceStep('PERFORM_TITRATION')
          sendGuidance('PERFORM_TITRATION')
        }, 1400)

        setTimeout(() => {
          endPour()
        }, 1800)
        return
      } else {
        const msg = 'Prepare the flask with sample, buffer, and indicator before filling the burette with EDTA.'
        showMistakeMessage(msg)
        sendCorrection(msg)
        return
      }
    }
  }

  // Shelf base location
  const SHELF_X = 4.5

  const activeChemicalConfig = exp01.chemicals.find((c) => c.id === activePourChemical)
  const isFlaskTarget = activePourChemical !== 'edta'

  return (
    <group>
      {/* ── Active Pouring Liquid Stream ──────────────────────────────────── */}
      {isPouring && activeChemicalConfig && (
        <LiquidPourStream
          startPos={isFlaskTarget ? FLASK_STREAM_START : BURETTE_STREAM_START}
          endPos={isFlaskTarget ? FLASK_STREAM_END : BURETTE_STREAM_END}
          color={activeChemicalConfig.color}
        />
      )}

      {/* ── Chemical Bottles on right shelf ────────────────────────────────── */}
      {exp01.chemicals.map((chem, idx) => {
        const zPos = -1.2 + idx * 0.8
        const yPos = 1.55
        const isEdta = chem.id === 'edta'

        return (
          <ChemicalBottle
            key={chem.id}
            id={chem.id}
            name={chem.name}
            shortName={chem.shortName}
            color={chem.color}
            bottleColor={chem.bottleColor}
            shelfPosition={[SHELF_X, yPos, zPos]}
            targetPosition={isEdta ? BURETTE_TARGET : FLASK_TARGET}
            pourPosition={isEdta ? BURETTE_POUR : FLASK_POUR}
            targetLabel={isEdta ? 'Burette Top' : 'Conical Flask'}
            onPour={() => handlePourChemical(chem.id)}
            disabled={currentStep === 'IDLE' || isPouring}
          />
        )
      })}
    </group>
  )
}
