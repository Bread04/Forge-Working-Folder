from supabase import create_client, Client
from app.core.config import settings
from app.models.graph import GraphExtractionResult

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def store_graph_in_db(document_title: str, graph: GraphExtractionResult, embeddings: list[list[float]]):
    try:
        # 1. Create Tree Record
        tree_res = supabase.table("skill_trees").insert({"title": document_title}).execute()
        if not tree_res.data:
            raise ValueError(f"Supabase: failed to create skill_tree. Response: {tree_res}")
        tree_id = tree_res.data[0]["id"]
        print(f"[DB] Created skill tree: {tree_id}")
        
        # 2. Insert Nodes with their embeddings
        nodes_data = []
        for i, node in enumerate(graph.nodes):
            nodes_data.append({
                "schema_id": node.id,
                "tree_id": tree_id,
                "title": node.title,
                "content_markdown": node.content_markdown,
                "zero_g_intuition": node.zero_g_intuition,
                "mastery_score": node.mastery_score,
                "embedding": embeddings[i]
            })
        
        if nodes_data:
            node_res = supabase.table("nodes").insert(nodes_data).execute()
            print(f"[DB] Inserted {len(nodes_data)} nodes. Response data count: {len(node_res.data) if node_res.data else 0}")
        
        # 3. Insert Edges
        if graph.edges:
            edges_data = [{
                "tree_id": tree_id,
                "source_id": edge.source_id,
                "target_id": edge.target_id,
                "relationship_type": edge.relationship_type
            } for edge in graph.edges]
            supabase.table("edges").insert(edges_data).execute()
            print(f"[DB] Inserted {len(edges_data)} edges.")
            
        return tree_id
    except Exception as e:
        print(f"[DB ERROR] store_graph_in_db failed: {e}")
        raise

def query_vector_search(query_embedding: list[float], top_k: int = 5):
    result = supabase.rpc("match_nodes", {
        "query_embedding": query_embedding,
        "match_threshold": 0.5,
        "match_count": top_k
    }).execute()
    return result.data
