from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://partscentral.us/used-auto-parts/volvo"


def text(fragment: str) -> str:
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


request = Request(URL, headers={"User-Agent": "SupremeAutopartsMigrationAudit/1.0"})
with urlopen(request, timeout=30) as response:
    html = response.read().decode(response.headers.get_content_charset() or "utf-8", errors="replace")

candidates: list[str] = []
for fragment in re.findall(r"<(?:a|li|h[2-6]|p)[^>]*>(.*?)</(?:a|li|h[2-6]|p)>", html, re.I | re.S):
    label = text(fragment)
    if label.lower().startswith("volvo ") and 2 <= len(label.split()) <= 12:
        candidates.append(label[6:].strip())

products = sorted(set(candidates), key=str.casefold)
non_products = {
    "Models We Support", "Parts We Carry", "C30", "C70", "S40", "S60", "S70", "S80", "S90",
    "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90",
}
products = [product for product in products if product not in non_products]
Path("src/data").mkdir(parents=True, exist_ok=True)
Path("src/data/products.json").write_text(json.dumps(products, indent=2), encoding="utf-8")
print(f"Extracted {len(products)} unique product names")
for product in products:
    print(product)
