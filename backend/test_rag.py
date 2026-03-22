import asyncio
import httpx
import sys

async def test_rag_chat(query: str):
    async with httpx.AsyncClient() as client:
        print(f"\\n--- Querying Scholar AI ---")
        print(f"User: {query}\\n")
        
        try:
            response = await client.post(
                "http://localhost:8000/api/chat", 
                json={
                    "message": query,
                    "history": []
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                print("Scholar AI RAG Agent:\\n")
                print(response.json().get("response"))
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                
        except Exception as e:
            print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_query = "What happens if I try to use a concept that is not in my mapped tree memory?"
    if len(sys.argv) > 1:
        test_query = sys.argv[1]
    
    asyncio.run(test_rag_chat(test_query))
