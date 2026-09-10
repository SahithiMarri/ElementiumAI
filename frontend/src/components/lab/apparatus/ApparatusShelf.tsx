import { useEffect } from 'react'
import { DraggableApparatus } from './DraggableApparatus'
import { BuretteStand, Pipette, WashBottle, Burette, ConicalFlask } from './Apparatus'
import { useLabStore } from '../../../store/labStore'
import { useAIAssistant } from '../../../hooks/useAIAssistant'

// Workbench exact snap positions
const SNAP_ZONES = {
  buretteStand: [
    { id: 'standZone', position: [-0.8, 0.82, 0.6] as [number, number, number], radius: 2.5 },
  ],
  burette: [
    { id: 'buretteZone', position: [-0.8, 3.52, 0.72] as [number, number, number], radius: 2.5 },
  ],
  conicalFlask: [
    { id: 'flaskZone', position: [-0.8, 0.82, 0.72] as [number, number, number], radius: 2.5 },
  ],
}

export default function ApparatusShelf() {
  const {
    currentStep,
    apparatus,
    advanceStep,
    addNotebookEntry,
    addAIMessage,
  } = useLabStore()
  const { sendGuidance } = useAIAssistant()

  // Detect when all 3 apparatus are placed to complete Step 1 & advance immediately to Step 2
  useEffect(() => {
    if (
      currentStep === 'SETUP_APPARATUS' &&
      apparatus.buretteStand.placed &&
      apparatus.burette.placed &&
      apparatus.conicalFlask.placed
    ) {
      addNotebookEntry({
        step: 'SETUP_APPARATUS',
        text: '✓ Apparatus setup verified: Burette Stand positioned on workbench, Burette securely affixed to clamp, and Conical Flask placed directly beneath burette tip.',
        type: 'success',
      })
      addAIMessage({
        text: '🎉 Apparatus setup complete! Now proceed to Step 2: click the Hard Water bottle on the chemical shelf to transfer 25 mL into the conical flask.',
        type: 'success',
      })
      advanceStep('PREPARE_SAMPLE')
      sendGuidance('PREPARE_SAMPLE')
    }
  }, [apparatus, currentStep])

  const handleSnap = (id: string) => (_snapId: string, _pos: [number, number, number]) => {
    if (id === 'buretteStand') {
      addNotebookEntry({
        step: 'SETUP_APPARATUS',
        text: '✓ Burette Stand positioned on workbench.',
        type: 'observation',
      })
    } else if (id === 'burette') {
      addNotebookEntry({
        step: 'SETUP_APPARATUS',
        text: '✓ Burette affixed securely onto Burette Stand clamp.',
        type: 'observation',
      })
    } else if (id === 'conicalFlask') {
      addNotebookEntry({
        step: 'SETUP_APPARATUS',
        text: '✓ Conical Flask placed below burette tip.',
        type: 'observation',
      })
    }
  }

  // Left Shelf location
  const SHELF_X = -4.5

  return (
    <group>
      {/* ── 1. Burette Stand on Shelf ────────────────────────────────────────── */}
      {!apparatus.buretteStand.placed && (
        <DraggableApparatus
          id="buretteStand"
          name="Burette Stand"
          initialPosition={[SHELF_X, 0.82, -1.2]}
          snapZones={SNAP_ZONES.buretteStand}
          onSnap={handleSnap('buretteStand')}
          disabled={currentStep === 'IDLE'}
          shelfHint="Click or Drag to Workbench"
        >
          <BuretteStand position={[0, 0, 0]} />
        </DraggableApparatus>
      )}

      {/* ── 2. Burette on Shelf ──────────────────────────────────────────────── */}
      {!apparatus.burette.placed && (
        <DraggableApparatus
          id="burette"
          name="Burette (50 mL)"
          initialPosition={[SHELF_X, 2.2, 0.0]}
          snapZones={SNAP_ZONES.burette}
          onSnap={handleSnap('burette')}
          disabled={currentStep === 'IDLE' || !apparatus.buretteStand.placed}
          shelfHint={
            apparatus.buretteStand.placed
              ? 'Click or Drag to Affix onto Stand'
              : 'Place Burette Stand First'
          }
        >
          <Burette position={[0, 0, 0]} />
        </DraggableApparatus>
      )}

      {/* ── 3. Conical Flask on Shelf ────────────────────────────────────────── */}
      {!apparatus.conicalFlask.placed && (
        <DraggableApparatus
          id="conicalFlask"
          name="Conical Flask (250 mL)"
          initialPosition={[SHELF_X, 0.82, 1.2]}
          snapZones={SNAP_ZONES.conicalFlask}
          onSnap={handleSnap('conicalFlask')}
          disabled={currentStep === 'IDLE'}
          shelfHint="Click or Drag below Burette"
        >
          <ConicalFlask position={[0, 0, 0]} />
        </DraggableApparatus>
      )}

      {/* ── 4. Pipette on Shelf ──────────────────────────────────────────────── */}
      <group position={[SHELF_X, 1.6, 2.0]}>
        <Pipette position={[0, 0, 0]} />
      </group>

      {/* ── 5. Wash Bottle on Shelf ──────────────────────────────────────────── */}
      <group position={[SHELF_X, 0.82, 2.5]}>
        <WashBottle position={[0, 0, 0]} />
      </group>
    </group>
  )
}
