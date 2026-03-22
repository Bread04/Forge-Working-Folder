import json
import uuid
import asyncio
from app.services.openai_client import client
from app.models.graph import GraphExtractionResult, GraphNode, GraphEdge
from app.services.link_validator import fix_hallucinated_links

EXTRACTION_PROMPT = """
You are an expert Knowledge Graph Architect and Research Professor. Your task is to transform the provided study notes into a rich, interactive Skill Tree.

CRITICAL: Return ONLY a JSON object matching this EXACT schema. Do NOT use any other key names.

REQUIRED JSON SCHEMA:
{{
  "document_title": "string — a concise title for the document/topic",
  "nodes": [
    {{
      "id": "string — short unique slug like 'node_newtons_first_law'",
      "title": "string — short concept name",
      "content_markdown": "string — FULL rich markdown content (see format below)",
      "zero_g_intuition": "string — one punchy sentence (max 25 words) explaining WHY this concept exists",
      "checklist": [
        {{
          "id": "string — unique ID like 'concept_core'",
          "label": "string — short label like 'Rubber Duck Test'",
          "sub": "string — actionable question testing mastery tailored to notes"
        }}
      ],
      "discussion_questions": [
        {{
          "id": "string — unique ID",
          "question": "string — open-ended Socratic question tailored to notes",
          "answer": "string — detailed solution/explanation"
        }}
      ]
    }}
  ],
  "edges": [
    {{
      "source_id": "string — id of the parent/prerequisite node",
      "target_id": "string — id of the child/dependent node",
      "relationship_type": "string — e.g. Prerequisite, Application, Proof Step, Cross-Pollination"
    }}
  ]
}}

NODE CONTENT FORMAT (for content_markdown):
Each node's content_markdown MUST follow this structure:

## 🌌 Zero-G Hook
> One sentence explaining why this concept exists in the universe.

## 📖 Key Definitions
List ALL key terms, notation, and vocabulary introduced by this concept. Format as a definition list:
**Term**: definition — be precise and thorough. Cover every named symbol, variable, or concept used.

## 📊 Core Mechanics
Provide an exhaustive explanation. Do NOT limit the word count. Ensure absolutely ALL relevant details, nuances, and content from the source notes are comprehensively covered here. Use tables if helpful:
| Component | Symbol | Meaning |
|-----------|--------|---------|
| ... | ... | ... |

## 🔬 Technical Derivation
Step-by-step mathematical or code logic explanation. Maximize code blocks (`python`, `javascript`, etc) and standalone mathematical equations (`$$`). MINIMIZE plain English sentences. If the source notes contain NO code implementation, you MUST synthesize and write a relevant, accurate code-based implementation to fulfill this requirement. Never use inline $...$ for important formulas.

## 💡 Worked Examples
Extract and provide ALL examples that were explicitly present in the source notes for this concept. Do not summarize them away. If notes provide multiple examples, list them all clearly.

## 🎥 Smart Bridge
Provide a YouTube SEARCH link (not a direct video URL) so the student can find quality explanations:
Format: [Search: <topic name> explained](https://www.youtube.com/results?search_query=<url+encoded+topic+name>)
Example: [Search: stack data structure explained](https://www.youtube.com/results?search_query=stack+data+structure+explained)
Do NOT invent or guess specific video IDs — always use the search URL format.

## 📝 Exam-Style Practice
2-3 exam-style problems with solutions.

## 🔗 Further Reading
3-5 real hyperlinks to resources.

STRUCTURE RULES:
1. Extract 10 to 20 nodes to ensure extremely granular coverage. Break down EVERY single distinct operation, property, definition, and concept into its own individual node. Do NOT bundle operations or concepts together. For example, 'Push Operation', 'Pop Operation', 'Peek Operation' must ALL be separate nodes, instead of bundling them under 'Stack Operations'. Generating fewer than 10 nodes is completely unacceptable.
2. Create edges to show how concepts relate.
3. Use ONLY the keys shown above. Do NOT rename them.
4. The "Intelligent Fool" rule: start simple, end with high-fidelity complexity.

TEXT TO PROCESS:
{text}
"""

async def extract_graph_with_openai(text_chunks: list[str]) -> GraphExtractionResult:
    """Single-stage extraction: architect + researcher in one prompt."""
    full_text = "\n\n".join(text_chunks)
    
    prompt = EXTRACTION_PROMPT.format(text=full_text[:15000])
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a Knowledge Graph Architect. Return ONLY valid JSON matching the exact schema provided."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    structure_data = json.loads(response.choices[0].message.content)
    nodes_data = structure_data.get("nodes", [])
    
    if not nodes_data:
        print(f"[WARN] No nodes returned. Raw keys: {list(structure_data.keys())}")
    
    # Validate and fix all links in parallel across all nodes
    raw_markdowns = [str(n_data.get("content_markdown", "")) for n_data in nodes_data]
    validated_markdowns = await asyncio.gather(*[fix_hallucinated_links(md) for md in raw_markdowns])
    
    nodes = []
    for i, n_data in enumerate(nodes_data):
        node = GraphNode(
            id=str(n_data.get("id", str(uuid.uuid4())[:8])),
            title=str(n_data.get("title", "Unknown")),
            content_markdown=validated_markdowns[i],
            zero_g_intuition=str(n_data.get("zero_g_intuition", "")),
            checklist=n_data.get("checklist", []),
            discussion_questions=n_data.get("discussion_questions", []),
            mastery_score=0
        )
        nodes.append(node)
        
    edges = []
    for e_data in structure_data.get("edges", []):
        edge = GraphEdge(
            source_id=str(e_data.get("source_id", "")),
            target_id=str(e_data.get("target_id", "")),
            relationship_type=str(e_data.get("relationship_type", "Related To"))
        )
        edges.append(edge)
        
    return GraphExtractionResult(
        document_title=structure_data.get("document_title", "Extracted Knowledge"),
        nodes=nodes,
        edges=edges
    )
