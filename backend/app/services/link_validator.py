import httpx
import asyncio
import re

async def is_url_live(url: str, timeout: float = 5.0) -> bool:
    """ Checks if a URL is reachable. """
    try:
        async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
            try:
                response = await client.head(url, timeout=timeout)
                if response.status_code < 400:
                    return True
            except Exception:
                pass
            response = await client.get(url, timeout=timeout)
            return response.status_code < 400
    except Exception:
        return False

async def fix_hallucinated_links(markdown_text: str) -> str:
    """ Finds all markdown links and removes dead ones. """
    if not markdown_text:
        return ""
        
    link_pattern = re.compile(r'\[([^\]]+)\]\((https?://[^\s)]+)\)')
    lines = markdown_text.split('\n')
    
    all_urls = list(set([m[1] for m in link_pattern.findall(markdown_text)]))
    if not all_urls:
        return markdown_text

    results = await asyncio.gather(*[is_url_live(u) for u in all_urls])
    status_map = dict(zip(all_urls, results))
    
    fixed_lines = []
    for line in lines:
        curr_line = line
        for label, url in link_pattern.findall(curr_line):
            if not status_map.get(url, False):
                curr_line = curr_line.replace(f"[{label}]({url})", f"{label} (Broken Link Removed)")
        if curr_line or not line:
            fixed_lines.append(curr_line)
            
    return '\n'.join(fixed_lines)

async def sanitize_links_in_markdown(markdown_text: str) -> str:
    """ Interface compatibility. """
    return await fix_hallucinated_links(markdown_text)
