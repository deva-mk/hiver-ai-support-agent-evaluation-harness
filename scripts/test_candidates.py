import json
import re

with open('src/data/kaggle_twcs_raw_pairs.json') as f:
    raw_pairs = json.load(f)

# Filter for clean English customer tweets with decent length
def is_usable(p):
    t = p['customer_text'].strip()
    if len(t) < 22 or t.startswith('http'):
        return False
    # English character check
    ascii_count = sum(1 for c in t if ord(c) < 128)
    if (ascii_count / len(t)) < 0.85:
        return False
    clean = [w for w in t.split() if not w.startswith('http') and not w.startswith('@')]
    if len(clean) < 3:
        return False
    # Must have non-trivial reply
    r = p.get('amazon_reply', '').strip()
    if len(r) < 15:
        return False
    return True

usable = [p for p in raw_pairs if is_usable(p)]
print(f"Total usable candidates: {len(usable)}")
