import json
from app.core.config import settings
import google.generativeai as genai
from app.models.tree import TreeData

genai.configure(api_key=settings.GEMINI_API_KEY)
# Using Gemini 2.0 Flash for speed and structured output competence
model = genai.GenerativeModel("gemini-2.0-flash") 

V2_MASTER_EXTRACTION_PROMPT = """
You are an expert Knowledge Architect. Your task is to extract a comprehensive, structured knowledge graph from the provided text in a single pass.

STRUCTURE RULES:
1. Extract 3-5 main parent nodes representing core themes.
2. Under each parent, extract 2-4 child nodes representing specific concepts.
3. Identify "Cross-Pollination" links: connections between related, non-linear concepts across different branches.

ZERO-G MECHANICS FOR EACH NODE:
- Analogy Expansion: A max 40-word explanation using space, momentum, or physics analogies to simplify the concept.
- Tether Action: A single sentence explaining the practical application of the concept.
- Swipe Quiz: 4 rapid-fire True/False statements about the concept.

OUTPUT FORMAT:
You MUST return a valid JSON object matching this schema exactly:
{{
  "document_title": "string",
  "tree_nodes": [
    {{
      "node_id": "unique_id (e.g., concept_name_slug)",
      "parent_id": "null_for_root_or_parent_node_id",
      "topic_name": "Short, Punchy Title",
      "related_node_ids": ["array_of_ids_for_cross_pollination"],
      "mastery_score": 0, 
      "zero_g_content": {{
        "analogy_expansion": "max 40 words space analogy",
        "tether_action": "1 sentence practical use",
        "swipe_quiz": [
          {{"statement": "T/F statement 1", "is_true": true}},
          {{"statement": "T/F statement 2", "is_true": false}},
          {{"statement": "T/F statement 3", "is_true": true}},
          {{"statement": "T/F statement 4", "is_true": false}}
        ]
      }}
    }}
  ]
}}

TEXT TO PROCESS:
{text}
"""

async def generate_v2_tree(text: str) -> TreeData:
    prompt = V2_MASTER_EXTRACTION_PROMPT.format(text=text[:12000]) # Increased context limit for 2.0 Flash
    
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    
    try:
        raw_text = response.text
        # Strip markdown code blocks if present
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        data = json.loads(raw_text.strip())
        
        # Ensure we pass the dictionary keys as kwargs to the Pydantic model
        return TreeData(
            document_title=data.get("document_title", "Untitled Document"),
            tree_nodes=data.get("tree_nodes", [])
        )
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error in V2 Gemini response: {e}")
        print(f"Raw Text: {response.text}")
        return TreeData(document_title="Error processing document", tree_nodes=[])
    except Exception as e:
        print(f"Error parsing V2 Gemini response: {e}")
        return TreeData(document_title="Error processing document", tree_nodes=[])

async def chat_with_scholar(message: str, history: list):
    chat = model.start_chat(history=history)
    response = chat.send_message(message)
    return response.text

async def generate_bridge_explanation(concept: str, transcript: str) -> str:
    prompt = f"""
    The student is struggling to understand the concept of '{concept}' from their notes. 
    Here is a transcript snippet from a helpful video:
    
    "{transcript}"
    
    Explain the concept using the video's logic and analogy, but keep it concise and consistent with the student's terminology.
    """
    response = model.generate_content(prompt)
    return response.text
