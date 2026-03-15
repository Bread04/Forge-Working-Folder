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
{
  "document_title": "string",
  "tree_nodes": [
    {
      "node_id": "unique_id (e.g., concept_name_slug)",
      "parent_id": "null_for_root_or_parent_node_id",
      "topic_name": "Short, Punchy Title",
      "related_node_ids": ["array_of_ids_for_cross_pollination"],
      "mastery_score": 0, 
      "zero_g_content": {
        "analogy_expansion": "max 40 words space analogy",
        "tether_action": "1 sentence practical use",
        "swipe_quiz": [
          {"statement": "T/F statement 1", "is_true": true},
          {"statement": "T/F statement 2", "is_true": false},
          {"statement": "T/F statement 3", "is_true": true},
          {"statement": "T/F statement 4", "is_true": false}
        ]
      }
    }
  ]
}

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
        data = json.loads(response.text)
        return TreeData(**data)
    except Exception as e:
        print(f"Error parsing V2 Gemini response: {e}")
        # Return a minimal valid structure on failure
        return TreeData(document_title="Error processing document", tree_nodes=[])

async def chat_with_scholar(message: str, history: list):
    chat = model.start_chat(history=history)
    response = chat.send_message(message)
    return response.text
