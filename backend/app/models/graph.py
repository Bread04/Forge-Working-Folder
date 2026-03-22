from pydantic import BaseModel, Field
from typing import List, Optional

class ChecklistItem(BaseModel):
    id: str = Field(description="Unique ID for this checklist item, e.g., 'concept_core_idea'")
    label: str = Field(description="Short label phrase, e.g., 'Rubber Duck Test' or 'Core Insight'")
    sub: str = Field(description="A specific, actionable question testing mastery of this node's concept.")

class DiscussionQuestion(BaseModel):
    id: str = Field(description="Unique ID for this discussion question")
    question: str = Field(description="An open-ended Socratic question tailored to this node's concepts.")
    answer: str = Field(description="A detailed, comprehensive solution or explanation for the question.")

class GraphNode(BaseModel):
    id: str = Field(description="Unique identifier for the node (e.g., node_slugified_title).")
    title: str = Field(description="Short, punchy title representing the concept.")
    content_markdown: str = Field(description="Detailed explanation of the concept formatted in Markdown, preserving necessary LaTeX formulas exactly as read.")
    zero_g_intuition: str = Field(description="A simplification of the complex concept using space, momentum, or physics analogies (max 40 words).")
    checklist: List[ChecklistItem] = Field(default=[], description="6 mastery checklist items tightly tailored to the node's specific notes.")
    discussion_questions: List[DiscussionQuestion] = Field(default=[], description="3-4 Socratic or familiarization questions with detailed answers tailored to the node's notes.")
    mastery_score: int = Field(default=0, description="Default starting mastery score (usually 0).")

class GraphEdge(BaseModel):
    source_id: str = Field(description="The ID of the parent or prerequisite node.")
    target_id: str = Field(description="The ID of the child or application node depending on the source.")
    relationship_type: str = Field(description="The nature of the connection (e.g., 'Prerequisite', 'Proof Step', 'Application', 'Cross-Pollination').")

class GraphExtractionResult(BaseModel):
    document_title: str = Field(description="Title of the extracted document or topic.")
    nodes: List[GraphNode] = Field(description="List of all extracted concepts as nodes.")
    edges: List[GraphEdge] = Field(description="List of all relationships between the extracted nodes.")
