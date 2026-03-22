from fastapi import APIRouter, HTTPException
from app.services.vector import supabase

router = APIRouter()

@router.get("/")
async def get_trees():
    res = supabase.table("skill_trees").select("id, title, created_at").order("created_at", desc=True).execute()
    return {"trees": res.data}

@router.get("/{tree_id}")
async def get_tree(tree_id: str):
    # Fetch tree
    tree_res = supabase.table("skill_trees").select("*").eq("id", tree_id).execute()
    if not tree_res.data:
        raise HTTPException(status_code=404, detail="Tree not found")
    tree = tree_res.data[0]
    
    # Fetch nodes
    nodes_res = supabase.table("nodes").select("schema_id, title, content_markdown, zero_g_intuition, mastery_score").eq("tree_id", tree_id).execute()
    nodes_out = []
    for n in nodes_res.data:
        n['id'] = n.pop('schema_id')  # Remap to frontend expected id
        nodes_out.append(n)
        
    # Fetch edges
    edges_res = supabase.table("edges").select("source_id, target_id, relationship_type").eq("tree_id", tree_id).execute()
    
    return {
        "id": tree['id'],
        "title": tree['title'],
        "nodes": nodes_out,
        "edges": edges_res.data
    }
