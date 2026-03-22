import psycopg2

sql = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS skill_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schema_id TEXT NOT NULL,
    tree_id UUID REFERENCES skill_trees(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    zero_g_intuition TEXT NOT NULL,
    mastery_score INTEGER DEFAULT 0,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES skill_trees(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION match_nodes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  schema_id TEXT,
  title TEXT,
  content_markdown TEXT,
  zero_g_intuition TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    nodes.id,
    nodes.schema_id,
    nodes.title,
    nodes.content_markdown,
    nodes.zero_g_intuition,
    1 - (nodes.embedding <=> query_embedding) AS similarity
  FROM nodes
  WHERE 1 - (nodes.embedding <=> query_embedding) > match_threshold
  ORDER BY nodes.embedding <=> query_embedding
  LIMIT match_count;
$$;
"""

def go():
    try:
        print('Connecting to Database...')
        conn = psycopg2.connect(
            host='db.tqicrfhfbfuucrdrfefu.supabase.co',
            port=5432,
            user='postgres',
            password='Braedon0468!',
            dbname='postgres',
            connect_timeout=10
        )
        conn.autocommit = True
        cursor = conn.cursor()
        print('Executing SQL Schema Creation...')
        cursor.execute(sql)
        print('MIGRATION COMPLETELY SUCCESSFUL! All tables built!')
        cursor.close()
        conn.close()
    except Exception as e:
        print('FATAL ERROR:', str(e))

if __name__ == "__main__":
    go()
