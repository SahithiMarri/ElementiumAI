import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ChemicalBottle } from './ChemicalBottle'
import { useLabStore } from '../../../store/labStore'
import { useAIAssistant } from '../../../hooks/useAIAssistant'
import { validateStep } from '../../../engine/mistakeDetector/rules'
import exp01 from '../../../experiments/exp01_edta/config'

// Animated liquid stream pouring from bottle to receiving vessel
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

  const dx = endPos[0] - startPos[0]
  const dy = endPos[1] - startPos[1]
  const dz = endPos[2] - startPos[2]
  const height = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const midX = (startPos[0] + endPos[0]) / 2
  const midY = (startPos[1] + endPos[1]) / 2
  const midZ = (startPos[2] + endPos[2]) / 2

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Subtle stream thickness pulse
    const s = 1 + Math.sin(t * 20) * 0.15
    meshRef.current.scale.set(s, 1, s)
  })

  return (
    <group position={[midX, midY, midZ]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.025, 0.04, height, 8]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.88}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
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

  // Target positions: Flask opening vs Burette opening
  const FLASK_TARGET: [number, number, number] = [-0.8, 1.45, 0.72]
  const BURETTE_TARGET: [number, number, number] = [-0.8, 5.5, 0.72]

  // Pour positions (where bottle tilts over the opening)
  const FLASK_POUR: [number, number, number] = [-0.48, 1.85, 0.72]
  const BURETTE_POUR: [number, number, number] = [-0.48, 5.75, 0.72]

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
          startPos={isFlaskTarget ? FLASK_POUR : BURETTE_POUR}
          endPos={isFlaskTarget ? [-0.8, 1.15, 0.72] : [-0.8, 4.8, 0.72]}
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
