from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChatRequest(BaseModel):
    step: str
    context: Optional[str] = ""
    experiment: Optional[str] = "EDTA Hardness Estimation"

class ChatResponse(BaseModel):
    message: str
    step: str
    type: str = "guidance"

class SessionCreate(BaseModel):
    experiment_id: str
    student_id: Optional[str] = "demo_student"

class SessionProgressUpdate(BaseModel):
    current_step: str
    notebook_entries: List[Dict[str, Any]] = []
    completed: bool = False

class SessionResponse(BaseModel):
    id: str
    experiment_id: str
    student_id: str
    current_step: str
    completed: bool
    created_at: datetime
    updated_at: datetime
