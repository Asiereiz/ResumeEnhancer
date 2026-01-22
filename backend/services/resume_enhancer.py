import os
import json
from dotenv import load_dotenv
from textstat import flesch_reading_ease, flesch_kincaid_grade
from openai import OpenAI

load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

client = OpenAI(api_key=OPENAI_KEY)

SYSTEM_PROMPT = """
You enhance resumes. Return JSON:

{
 "enhanced_text": "...",
 "bullet_points": [...],
 "ats_keywords": [...]
}
"""

def call_llm_and_parse(text):
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]
    )

    raw = resp.choices[0].message.content
    return json.loads(raw)


def enhance(text):
    parsed = call_llm_and_parse(text)

    enhanced = parsed["enhanced_text"]
    bullet_points = parsed["bullet_points"]
    ats_keywords = parsed["ats_keywords"]

    try:
        flesch = flesch_reading_ease(enhanced)
        kincaid = flesch_kincaid_grade(enhanced)
    except:
        flesch, kincaid = None, None

    return {
        "enhanced_text": enhanced,
        "bullet_points": bullet_points,
        "ats_keywords": ats_keywords,
        "readability_flesch": flesch,
        "readability_kincaid": kincaid
    }
