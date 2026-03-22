"""
Raw Stage 1 diagnostic - shows exactly what JSON the AI returns
Run from backend dir: python diag_raw.py
"""
import asyncio, sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.openai_client import client

PROMPT = """
You are an expert Knowledge Architect. Your task is to identify the core structural skeleton of a skill tree from the provided text.

STRUCTURE RULES:
1. Extract 3-5 main parent nodes representing core themes.
2. Under each parent, extract 2-4 child nodes representing specific concepts.

TEXT TO PROCESS:
Newton's Laws of Motion. Newton's first law: An object at rest stays at rest. F=ma is Newton's second law.
"""

async def main():
    response = await client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are a Knowledge Architect. Return ONLY JSON."},
            {"role": "user", "content": PROMPT}
        ],
        response_format={"type": "json_object"}
    )
    raw = response.choices[0].message.content
    print("=== RAW JSON FROM AI ===")
    print(raw)
    print("=== PARSED KEYS ===")
    data = json.loads(raw)
    print(list(data.keys()))

if __name__ == "__main__":
    asyncio.run(main())
