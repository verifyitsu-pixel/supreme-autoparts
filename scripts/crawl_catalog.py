from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from collections import deque
from html import unescape
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

BASE = "https://partscentral.us"
START = ["/", "/auto-parts", "/engine", "/transmission"]
MAX_PAGES = 2500


def clean_url(href: str, current: str) -> str | None:
    absolute = urljoin(current, unescape(href)).split("#", 1)[0]
    parsed = urlparse(absolute)
    if parsed.netloc not in {"partscentral.us", "www.partscentral.us"}:
        return None
    if parsed.path.startswith(("/_next/", "/api/")):
        return None
    return f"{BASE}{parsed.path.rstrip('/') or '/'}"


def main() -> int:
    queue = deque(urljoin(BASE, path) for path in START)
    seen: set[str] = set()
    pages: list[dict[str, object]] = []

    while queue and len(seen) < MAX_PAGES:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        try:
            request = Request(url, headers={"User-Agent": "SupremeAutopartsMigrationAudit/1.0"})
            with urlopen(request, timeout=30) as response:
                html = response.read().decode(response.headers.get_content_charset() or "utf-8", errors="replace")
        except Exception as exc:
            pages.append({"url": url, "error": str(exc)})
            continue
        title_match = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        title = unescape(re.sub(r"<[^>]+>", "", title_match.group(1))).strip() if title_match else ""
        links = set()
        for href in re.findall(r"href=[\"']([^\"']+)", html, re.I):
            normalized = clean_url(href, url)
            if normalized:
                links.add(normalized)
                if normalized not in seen:
                    queue.append(normalized)
        pages.append({"url": url, "title": title, "links": sorted(links)})

    catalog = {
        "source": BASE,
        "page_count": len(pages),
        "pages": pages,
        "product_like_urls": sorted(
            url for url in seen if any(token in url for token in ("/used-auto-parts/", "/engine/", "/transmission/", "/auto-parts/"))
        ),
    }
    if len(sys.argv) > 1:
        Path(sys.argv[1]).write_text(json.dumps(catalog, indent=2), encoding="utf-8")
        print(f"Crawled {len(pages)} pages; found {len(catalog['product_like_urls'])} product-like URLs")
    else:
        json.dump(catalog, sys.stdout, indent=2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
