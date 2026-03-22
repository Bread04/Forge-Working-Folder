"""
Quick diagnostic: tests the full extraction pipeline on a small text snippet.
Run from the backend directory: python diag_extract.py
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.openai_schema_extract import extract_graph_with_openai

SAMPLE_TEXT = """
Newton's Laws of Motion

Newton's first law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion at the same speed and direction unless acted upon by a net external force.

Newton's second law: The acceleration of an object depends on the net force acting upon it and its mass. F = ma.

Newton's third law: For every action there is an equal and opposite reaction.

Applications: Rocket propulsion, vehicle dynamics, structural engineering.
"""

async def main():
    print("--- Running extraction diagnostic ---")
    chunks = [SAMPLE_TEXT]
    result = await extract_graph_with_openai(chunks)
    print(f"\nDocument Title: {result.document_title}")
    print(f"Nodes found: {len(result.nodes)}")
    for n in result.nodes:
        print(f"  - [{n.id}] {n.title}")
    print(f"Edges found: {len(result.edges)}")
    for e in result.edges:
        print(f"  - {e.source_id} -> {e.target_id} ({e.relationship_type})")

if __name__ == "__main__":
    asyncio.run(main())
