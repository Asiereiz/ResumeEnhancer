import os
import json
from dotenv import load_dotenv
from groq import Groq
from textstat import flesch_reading_ease, flesch_kincaid_grade

load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "llama3-70b-8192")

if not GROQ_KEY:
    raise RuntimeError("GROQ_API_KEY no configurada en .env")

client = Groq(api_key=GROQ_KEY)

# Function calling schema compatible con Llama 3
resume_function = {
    "name": "process_resume",
    "description": "Produce an enhanced resume text, bullets, and ATS keywords.",
    "parameters": {
        "type": "object",
        "properties": {
            "enhanced_text": {"type": "string"},
            "bullet_points": {"type": "array", "items": {"type": "string"}},
            "ats_keywords": {"type": "array", "items": {"type": "string"}},
            "ats_score": {"type": "integer", "description": "Score from 0 to 100"},
            "strengths": {"type": "array", "items": {"type": "string"}},
            "suggestions": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["enhanced_text", "bullet_points", "ats_keywords", "ats_score", "strengths", "suggestions"],
    },
}


def call_llm_and_parse(text: str):
    """
    Llama al modelo Groq Llama 3 con function-calling forzado.
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a highly skilled resume editor.",
                },
                {
                    "role": "user",
                    "content": (
                        "Improve this resume professionally. "
                        "Write in a clear, direct style to maximize Flesch Reading Ease. "
                        "Avoid complex jargon and long sentences. "
                        "Return ONLY using the function `process_resume` "
                        "with enhanced_text, bullet_points, ats_keywords, ats_score (0-100), strengths, and suggestions.\n\n"
                        f"{text}"
                    ),
                },
            ],
            functions=[resume_function],
            function_call={"name": "process_resume"},
            temperature=0.2,
            max_tokens=1500,
        )

        msg = response.choices[0].message
        print(f"DEBUG: Raw LLM content: {msg.content}")
        print(f"DEBUG: Raw LLM function call: {msg.function_call}")

        # Llama 3 devuelve argumentos como string JSON
        if msg.function_call and msg.function_call.arguments:
            return json.loads(msg.function_call.arguments)

        # fallback (poco probable)
        if msg.content:
            return json.loads(msg.content)

        raise RuntimeError("Llama 3 no devolvió function_call adecuada.")

    except Exception as e:
        print(f"DEBUG: Exception in call_llm_and_parse: {e}")
        return {"error": f"Error con Groq: {str(e)}"}


def enhance(text: str):
    parsed = call_llm_and_parse(text)

    if "error" in parsed:
        return {"success": False, "error": parsed["error"]}

    enhanced = parsed.get("enhanced_text", "")
    bullet_points = parsed.get("bullet_points", [])
    ats_keywords = parsed.get("ats_keywords", [])

    try:
        flesch = flesch_reading_ease(enhanced)
        kincaid = flesch_kincaid_grade(enhanced)
    except:
        flesch, kincaid = None, None

    return {
        "success": True,
        "enhanced_text": enhanced,
        "bullet_points": bullet_points,
        "ats_keywords": ats_keywords,
        "ats_score": parsed.get("ats_score", 0),
        "strengths": parsed.get("strengths", []),
        "suggestions": parsed.get("suggestions", []),
        "readability_flesch": flesch,
        "readability_kincaid": kincaid,
    }
