import type { ExperimentStep } from '../../store/labStore'

export interface StepConfig {
  id: ExperimentStep
  title: string
  instruction: string
  aiGuidance: string
  requiredAction: string
}

export interface ExperimentConfig {
  id: string
  title: string
  subtitle: string
  description: string
  objective: string
  principle: string
  steps: StepConfig[]
  chemicals: ChemicalConfig[]
  apparatus: ApparatusConfig[]
}

export interface ChemicalConfig {
  id: string
  name: string
  shortName: string
  color: string
  bottleColor: string
  position: [number, number, number]
}

export interface ApparatusConfig {
  id: string
  name: string
  shelfPosition: [number, number, number]
}

const exp01: ExperimentConfig = {
  id: 'exp01_edta',
  title: 'Estimation of Hardness of Water by EDTA Method',
  subtitle: 'Complexometric Titration',
  description:
    'Determine the total hardness of a water sample by titration with standard EDTA solution using Eriochrome Black T indicator at pH 10.',
  objective:
    'To estimate the total hardness of a given water sample using standard 0.01M EDTA solution.',
  principle:
    'EDTA forms stable 1:1 hexadentate complexes with Ca²⁺ and Mg²⁺ ions. In the presence of EBT indicator at pH 10 (buffered with NH₄Cl/NH₄OH), the initial solution is wine red. As EDTA is added, it displaces the indicator from the metal complex, turning the solution permanently sharp blue at the stoichiometric endpoint.',

  steps: [
    {
      id: 'WEAR_PPE',
      title: 'Step 1 — Wear Safety Gear',
      instruction:
        'Before handling any glassware or reagents, put on your personal protective equipment. Click the green marker at the PPE stand by the back windows to walk over, then click the brown apron and the gloves — or tick them off in the checklist below.',
      aiGuidance:
        'Safety first. Take the brown lab apron and a pair of gloves from the PPE stand at the back wall, in front of the windows, before you approach the bench.',
      requiredAction: 'wearAllPPE',
    },
    {
      id: 'SETUP_APPARATUS',
      title: 'Step 2 — Setup Apparatus',
      instruction:
        'Drag the Burette Stand to the workbench. Then drag the Burette onto the stand clamp. Finally, place the Conical Flask directly beneath the burette tip.',
      aiGuidance:
        'Let\'s set up your apparatus first. Drag the Burette Stand to the green target on the workbench, attach the Burette, and place the Conical Flask beneath it.',
      requiredAction: 'placeAllApparatus',
    },
    {
      id: 'PREPARE_SAMPLE',
      title: 'Step 3 — Transfer Hard Water Sample',
      instruction:
        'Drag the Hard Water bottle from the chemical shelf and drop it over the Conical Flask to pour 25 mL of water sample.',
      aiGuidance:
        'Drag the Hard Water bottle over the conical flask to transfer 25 mL of the water sample.',
      requiredAction: 'addSampleToFlask',
    },
    {
      id: 'ADD_BUFFER',
      title: 'Step 4 — Add Ammonia Buffer (pH 10)',
      instruction:
        'Drag the Ammonia Buffer (pH 10) bottle from the shelf and drop it over the Conical Flask to pour 2 mL of buffer.',
      aiGuidance:
        'Drag the Ammonia Buffer bottle over the flask. The buffer maintains pH 10, which is critical for the EBT indicator to function correctly.',
      requiredAction: 'addBufferToFlask',
    },
    {
      id: 'ADD_INDICATOR',
      title: 'Step 5 — Add EBT Indicator',
      instruction:
        'Drag the Eriochrome Black T (EBT) Indicator bottle and drop it over the flask to add 2–3 drops. Observe the wine red color change!',
      aiGuidance:
        'Drag the EBT Indicator bottle to the flask. Notice the liquid turning wine red as EBT binds with Ca²⁺ and Mg²⁺ hardness ions.',
      requiredAction: 'addIndicatorToFlask',
    },
    {
      id: 'FILL_BURETTE',
      title: 'Step 6 — Fill Burette with EDTA',
      instruction:
        'Drag the standard EDTA Solution bottle and drop it over the top of the Burette to fill it to the 0.00 mL mark.',
      aiGuidance:
        'Drag the standard 0.01M EDTA bottle to the top of the burette to fill it up to the zero mark.',
      requiredAction: 'fillBurette',
    },
    {
      id: 'PERFORM_TITRATION',
      title: 'Step 7 — Perform Titration',
      instruction:
        'Click "Open Stopcock" to start dispensing EDTA drops. Click and hold the flask to swirl continuously. Watch the color transition: Wine Red → Purple → Permanent Blue!',
      aiGuidance:
        'Open the stopcock to allow EDTA to drip into the flask. Swirl the flask to mix thoroughly. When the solution turns permanent pure blue, close the stopcock to record the endpoint.',
      requiredAction: 'reachEndpoint',
    },
  ],

  chemicals: [
    {
      id: 'hardWater',
      name: 'Hard Water Sample',
      shortName: 'Hard Water',
      color: '#c8e6f5',
      bottleColor: '#90caf9',
      position: [4.5, 1.55, -1.2],
    },
    {
      id: 'buffer',
      name: 'Ammonia Buffer (pH 10)',
      shortName: 'Buffer pH 10',
      color: '#bfdbfe',
      bottleColor: '#93c5fd',
      position: [4.5, 1.55, -0.4],
    },
    {
      id: 'ebt',
      name: 'Eriochrome Black T (EBT)',
      shortName: 'EBT Indicator',
      color: '#881337',
      bottleColor: '#f43f5e',
      position: [4.5, 1.55, 0.4],
    },
    {
      id: 'edta',
      name: 'Standard EDTA (0.01M)',
      shortName: '0.01M EDTA',
      color: '#bbf7d0',
      bottleColor: '#86efac',
      position: [4.5, 1.55, 1.2],
    },
  ],

  apparatus: [
    { id: 'buretteStand', name: 'Burette Stand', shelfPosition: [-4.5, 0.82, -1.2] },
    { id: 'burette', name: 'Burette (50 mL)', shelfPosition: [-4.5, 1.6, 0.0] },
    { id: 'conicalFlask', name: 'Conical Flask (250 mL)', shelfPosition: [-4.5, 0.82, 1.2] },
  ],
}

export default exp01
