import asyncio
import base64
from app.services.chunking import parse_pdf
from app.services.openai_schema_extract import extract_graph_with_openai
from app.services.openai_client import generate_embeddings
from app.services.vector import store_graph_in_db

B64_PDF = b'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkvRjIgNSAwIFIKICAgID4+CiAgPj4KICAvQ29udGVudHMgNiAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTEKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9IZWx2ZXRpY2EtdW5kZXJsaW5lCj4+CmVuZG9iagoKNiAwIG9iago8PAogIC9MZW5ndGggNzMKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoyNyAxNDUgVGQKKE1hdHJpY2VzIGFyZSBsaW5lYXIgdHJhbnNmb3JtYXRpb25zKSBUagoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDE2NyAwMDAwMCBuIAowMDAwMDAwMjg4IDAwMDAwIG4gCjAwMDAwMDAzNzcgMDAwMDAgbiAKMDAwMDAwMDQ3MSAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNwogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1OTUKJSVFT0YK'

async def main():
    print("1. Writing dummy PDF...")
    with open("test.pdf", "wb") as f:
        f.write(base64.b64decode(B64_PDF))
        
    print("2. Parsing PDF using unstructured...")
    text = parse_pdf("test.pdf")
    print(f"Parsed text length: {len(text)}")
    
    print("3. Calling OpenAI Extraction...")
    extracted_data = await extract_graph_with_openai(text)
    print(f"Successfully extracted {len(extracted_data.nodes)} nodes.")
    
    print("4. Generating Embeddings...")
    texts_to_embed = [f"Title: {n.title}\\n{n.content_markdown}" for n in extracted_data.nodes]
    embeddings = await generate_embeddings(texts_to_embed)
    print(f"Generated {len(embeddings)} embeddings.")
    
    print("5. Storing in Supabase DB...")
    tree_id = store_graph_in_db(extracted_data.document_title, extracted_data, embeddings)
    print(f"STORED! Tree ID: {tree_id}")

if __name__ == "__main__":
    asyncio.run(main())
