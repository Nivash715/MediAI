from pydantic import BaseModel
from typing import List, Optional


class SymptomAnalysisRequest(BaseModel):
    symptoms: str
    tags:     List[str] = []
    age:      Optional[int]
    gender:   Optional[str]


class ConditionResult(BaseModel):
    name:       str
    confidence: int


class MedicineResult(BaseModel):
    name:                  str
    dosage:                Optional[str]
    requires_prescription: bool = False


class SymptomAnalysisResponse(BaseModel):
    severity:   str   # mild, moderate, severe
    warning:    Optional[str]
    conditions: List[ConditionResult]
    medicines:  List[MedicineResult]


class ChatMessage(BaseModel):
    role:    str  # user | assistant
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    message: str
