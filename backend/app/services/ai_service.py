from ..core.config import settings
from ..schemas.ai import SymptomAnalysisResponse, ChatResponse

# Lazy-initialize client to avoid import-time proxy/env issues
_client = None

def get_client():
    global _client
    if _client is None:
        from openai import AsyncOpenAI
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


SYSTEM_PROMPT = """You are MediAI, an expert AI health assistant for an Indian medicine delivery platform.
You help users understand their symptoms, suggest medicines available in India, and provide health information.
Always recommend consulting a doctor for serious conditions. All medicine prices are in INR.
Keep responses concise and mobile-friendly."""


async def analyze_symptoms(symptoms: str, tags: list, age: int = None, gender: str = None) -> SymptomAnalysisResponse:
    context = f"Symptoms: {symptoms}"
    if tags: context += f"\nSelected tags: {', '.join(tags)}"
    if age: context += f"\nAge: {age}"
    if gender: context += f"\nGender: {gender}"

    response = await get_client().chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"""Analyze these symptoms and respond ONLY with valid JSON:
{context}

Format:
{{
  "severity": "mild|moderate|severe",
  "warning": "optional warning message",
  "conditions": [{{"name": "...", "confidence": 70}}],
  "medicines": [{{"name": "...", "dosage": "...", "requires_prescription": false}}]
}}"""},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    import json
    data = json.loads(response.choices[0].message.content)
    return SymptomAnalysisResponse(**data)


async def chat(messages: list) -> ChatResponse:
    formatted = [{"role": "system", "content": SYSTEM_PROMPT}]
    formatted += [{"role": m.role, "content": m.content} for m in messages]

    response = await get_client().chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=formatted,
        temperature=0.7,
        max_tokens=500,
    )

    return ChatResponse(message=response.choices[0].message.content)
