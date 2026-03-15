from pydantic import BaseModel
from typing import List, Optional

class SwipeQuiz(BaseModel):
    statement: str
    is_true: bool

class ZeroGContent(BaseModel):
    analogy_expansion: str
    tether_action: str
    swipe_quiz: List[SwipeQuiz]

class TreeNode(BaseModel):
    node_id: str
    parent_id: Optional[str] = None
    topic_name: str
    related_node_ids: List[str] = []
    mastery_score: int = 0
    zero_g_content: ZeroGContent

class TreeData(BaseModel):
    document_title: str
    tree_nodes: List[TreeNode]
