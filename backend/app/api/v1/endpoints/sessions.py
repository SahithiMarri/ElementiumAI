from fastapi import APIRouter
from app.models.schemas import SessionCreate, SessionProgressUpdate, SessionResponse
from app.db.session import get_database
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for demo mode fallback if MongoDB is not connected
IN_MEMORY_SESSIONS = {}

@router.post("/", response_model=SessionResponse)
async def create_session(payload: SessionCreate):
    session_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    session_data = {
        "id": session_id,
        "experiment_id": payload.experiment_id,
        "student_id": payload.student_id or "demo_student",
        "current_step": "IDLE",
        "completed": False,
        "notebook_entries": [],
        "created_at": now,
        "updated_at": now,
    }
    
    db = get_database()
    if db is not None:
        try:
            await db["sessions"].insert_one(session_data)
        except Exception:
            IN_MEMORY_SESSIONS[session_id] = session_data
    else:
        IN_MEMORY_SESSIONS[session_id] = session_data
        
    return SessionResponse(**session_data)

@router.put("/{session_id}/progress")
async def update_progress(session_id: str, payload: SessionProgressUpdate):
    now = datetime.utcnow()
    update_data = {
        "current_step": payload.current_step,
        "notebook_entries": payload.notebook_entries,
        "completed": payload.completed,
        "updated_at": now,
    }
    
    db = get_database()
    if db is not None:
        try:
            await db["sessions"].update_one({"id": session_id}, {"$set": update_data})
        except Exception:
            if session_id in IN_MEMORY_SESSIONS:
                IN_MEMORY_SESSIONS[session_id].update(update_data)
    else:
        if session_id in IN_MEMORY_SESSIONS:
            IN_MEMORY_SESSIONS[session_id].update(update_data)
            
    return {"status": "success", "session_id": session_id}
