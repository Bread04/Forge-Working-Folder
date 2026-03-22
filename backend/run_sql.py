import psycopg2
import os
from dotenv import load_dotenv

def run_migration():
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in .env")
        return

    try:
        # Load the SQL file from the brain directory
        sql_path = r"C:\Users\Admin\.gemini\antigravity\brain\8a909208-0e31-4824-81b0-f26fdf603eb5\supabase_migration.sql"
        with open(sql_path, 'r') as f:
            sql = f.read()
        
        print("Connecting to Supabase...")
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("Executing migration...")
        cursor.execute(sql)
        print("Migration successful! Tables created.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_migration()
