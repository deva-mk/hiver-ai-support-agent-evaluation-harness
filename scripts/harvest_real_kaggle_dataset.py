import urllib.request
import json
import time
import re

# Fetch rows from Hugging Face datasets-server for SunidhiSriram/twcs
def fetch_rows(offset, length=100):
    url = f'https://datasets-server.huggingface.co/rows?dataset=SunidhiSriram%2Ftwcs&config=default&split=train&offset={offset}&length={length}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return [r['row'] for r in data.get('rows', [])]
    except Exception as e:
        print(f"Error fetching offset {offset}: {e}")
        return []

def is_english(text):
    # Quick filter: ASCII / Latin letters should dominate
    if not text:
        return False
    ascii_chars = sum(1 for c in text if ord(c) < 128)
    return (ascii_chars / len(text)) > 0.85

# Collect candidate rows
all_rows = []
offsets = [
    10000, 10100, 10200, 10300, 10400,
    13000, 13100, 13200, 13300, 13400, 13500, 13600, 13700, 13800, 13900,
    15000, 15100, 15200, 15300, 15400, 15500, 15600, 15700, 15800, 15900,
    20000, 20100, 20200, 20300, 20400, 20500, 20600, 20700, 20800, 20900,
    21000, 21100, 21200, 21300, 21400, 21500, 21600, 21700, 21800, 21900
]

print(f"Scanning {len(offsets)} chunks...")
for i, off in enumerate(offsets):
    rows = fetch_rows(off, 100)
    all_rows.extend(rows)
    if (i + 1) % 5 == 0:
        print(f"Fetched {i+1}/{len(offsets)} chunks, total rows: {len(all_rows)}")
    time.sleep(0.1)

print(f"Total rows retrieved: {len(all_rows)}")

# Map by tweet_id
tweet_by_id = {r['tweet_id']: r for r in all_rows}

# Find all inbound customer tweets directed at @AmazonHelp
inbound_tweets = []
for r in all_rows:
    text = str(r.get('text', ''))
    if r.get('inbound') is True and '@AmazonHelp' in text and is_english(text):
        inbound_tweets.append(r)

print(f"Found {len(inbound_tweets)} English inbound customer tweets to @AmazonHelp")

# Match with Amazon responses
pairs = []
for t in inbound_tweets:
    tid = t['tweet_id']
    resp_ids_str = str(t.get('response_tweet_id') or '')
    resp_ids = [int(x.strip()) for x in resp_ids_str.split(',') if x.strip().isdigit()]
    
    agent_reply = None
    agent_reply_id = None
    for rid in resp_ids:
        if rid in tweet_by_id and tweet_by_id[rid].get('author_id') == 'AmazonHelp':
            agent_reply = tweet_by_id[rid]['text']
            agent_reply_id = rid
            break
            
    # Also check if any tweet has in_response_to_tweet_id == tid
    if not agent_reply:
        for r in all_rows:
            if r.get('author_id') == 'AmazonHelp' and r.get('in_response_to_tweet_id') == tid:
                agent_reply = r['text']
                agent_reply_id = r['tweet_id']
                break
                
    pairs.append({
        'inbound_tweet_id': tid,
        'customer_handle': f"@{t['author_id']}",
        'customer_text': t['text'],
        'created_at': t.get('created_at'),
        'in_response_to_tweet_id': t.get('in_response_to_tweet_id'),
        'response_tweet_id': t.get('response_tweet_id'),
        'agent_reply_id': agent_reply_id,
        'agent_reply_text': agent_reply
    })

print(f"Extracted {len(pairs)} customer tweets, with {sum(1 for p in pairs if p['agent_reply_text'])} paired with direct Amazon replies.")

# Save raw pairs for verification and auditability
with open('src/data/kaggle_twcs_raw_pairs.json', 'w') as f:
    json.dump(pairs, f, indent=2)

print("Saved raw pairs to src/data/kaggle_twcs_raw_pairs.json")
