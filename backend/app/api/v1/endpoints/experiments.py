from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

EXPERIMENTS_CATALOGUE = [
    {
        "id": "exp01_edta",
        "number": 1,
        "title": "Estimation of Hardness of Water by EDTA Method",
        "subtitle": "Complexometric Titration",
        "available": True,
        "duration": "45 min",
        "difficulty": "Intermediate",
    },
    {
        "id": "exp02_naoh",
        "number": 2,
        "title": "Preparation and Standardisation of NaOH Solution",
        "subtitle": "Acid-Base Titration",
        "available": False,
        "duration": "30 min",
        "difficulty": "Beginner",
    },
    {
        "id": "exp03_vinegar",
        "number": 3,
        "title": "Estimation of Acetic Acid in Commercial Vinegar",
        "subtitle": "Volumetric Analysis",
        "available": False,
        "duration": "40 min",
        "difficulty": "Beginner",
    },
    {
        "id": "exp04_cod",
        "number": 4,
        "title": "Determination of Chemical Oxygen Demand (COD)",
        "subtitle": "Redox Titration",
        "available": False,
        "duration": "60 min",
        "difficulty": "Advanced",
    },
    {
        "id": "exp05_iron",
        "number": 5,
        "title": "Spectrophotometric Determination of Iron",
        "subtitle": "Colorimetric Analysis",
        "available": False,
        "duration": "50 min",
        "difficulty": "Intermediate",
    },
    {
        "id": "exp06_dissolved_oxygen",
        "number": 6,
        "title": "Estimation of Dissolved Oxygen (Winkler Method)",
        "subtitle": "Iodometric Titration",
        "available": False,
        "duration": "50 min",
        "difficulty": "Advanced",
    },
    {
        "id": "exp07_amino_acids",
        "number": 7,
        "title": "pH Titration and pKa of Amino Acids",
        "subtitle": "Potentiometric Analysis",
        "available": False,
        "duration": "45 min",
        "difficulty": "Intermediate",
    },
    {
        "id": "exp08_conductometry",
        "number": 8,
        "title": "Conductometric Titration of Strong Acid vs Strong Base",
        "subtitle": "Electrochemistry",
        "available": False,
        "duration": "40 min",
        "difficulty": "Intermediate",
    },
]

@router.get("/", response_model=List[Dict[str, Any]])
async def list_experiments():
    return EXPERIMENTS_CATALOGUE

@router.get("/{experiment_id}")
async def get_experiment(experiment_id: str):
    for exp in EXPERIMENTS_CATALOGUE:
        if exp["id"] == experiment_id:
            return exp
    return {"error": "Experiment not found"}
