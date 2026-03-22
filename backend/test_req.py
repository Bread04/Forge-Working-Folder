import base64
import asyncio
import httpx

B64_PDF = b'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkvRjIgNSAwIFIKICAgID4+CiAgPj4KICAvQ29udGVudHMgNiAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTEKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9IZWx2ZXRpY2EtdW5kZXJsaW5lCj4+CmVuZG9iagoKNiAwIG9iago8PAogIC9MZW5ndGggNzMKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoyNyAxNDUgVGQKKE1hdHJpY2VzIGFyZSBsaW5lYXIgdHJhbnNmb3JtYXRpb25zKSBUagoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDE2NyAwMDAwMCBuIAowMDAwMDAwMjg4IDAwMDAwIG4gCjAwMDAwMDAzNzcgMDAwMDAgbiAKMDAwMDAwMDQ3MSAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNwogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1OTUKJSVFT0YK'

async def test_api():
    with open("test.pdf", "wb") as f:
        f.write(base64.b64decode(B64_PDF))
        
    async with httpx.AsyncClient() as client:
        print("Sending request to /api/extract-graph...")
        with open("test.pdf", "rb") as f:
            files = {"file": ("test.pdf", f, "application/pdf")}
            response = await client.post("http://localhost:8000/api/extract-graph", files=files, timeout=45.0)
            print("Status:", response.status_code)
            try:
                print("JSON:", response.json())
            except Exception:
                print("Text:", response.text)

if __name__ == "__main__":
    asyncio.run(test_api())
