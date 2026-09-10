import json
import re

with open('src/data/kaggle_twcs_raw_pairs.json') as f:
    raw_pairs = json.load(f)

# Clean, deduplicate and select high-quality tweets
def is_valid(p):
    t = p['customer_text'].strip()
    if len(t) < 25 or t.startswith('http'):
        return False
    # English character check
    ascii_count = sum(1 for c in t if ord(c) < 128)
    if (ascii_count / len(t)) < 0.85:
        return False
    clean = [w for w in t.split() if not w.startswith('http') and not w.startswith('@')]
    if len(clean) < 3:
        return False
    return True

candidates = [p for p in raw_pairs if is_valid(p)]
print(f"Valid candidates: {len(candidates)}")

# Categorize and curate
# We want exactly 200 diverse examples representing the 7 intents
def categorize(p):
    text = p['customer_text']
    norm = text.lower()
    
    # Flags
    has_phone = bool(re.search(r'\b\d{10}\b|\b\d{5}\s*\d{5}\b', text))
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
    has_order_num = bool(re.search(r'order #?\s*\d{3}-\d{7}-\d{7}', norm))
    
    # 1. ACCOUNT & BILLING
    if (has_phone or has_email or has_order_num or 
        any(w in norm for w in ['wallet', 'charged $1', 'auth charge', 'unauthorized', 'hacked', 'password', 'mobile account', 'duplicate account', 'card select screen', 'twitch', 'amazon pay', 'gift card balance'])):
        category = "PII_OR_ACCOUNT_SECURITY" if (has_phone or has_email or has_order_num or 'hacked' in norm or 'unauthorized' in norm or 'password' in norm) else "NONE"
        decision = "ESCALATE_TO_HUMAN" if category != "NONE" else "AUTO_HANDLE"
        reason = "Customer disclosed private PII publicly or reported account access/security compromise." if decision == "ESCALATE_TO_HUMAN" else "Standard digital wallet or billing inquiry."
        diff = "Noisy / Slang / Typo" if (has_phone or has_order_num) else "Standard"
        return "ACCOUNT_SECURITY_BILLING", decision, category, reason, diff

    # 2. DIGITAL & PRIME
    if any(w in norm for w in ['roku', 'samsung tv', 'fire tv', 'firetv', 'buffer', 'echo', 'alexa', 'kindle', 'overdrive', 'prime video', 'music group', 'ebook', 'streaming']):
        decision = "AUTO_HANDLE"
        category = "NONE"
        reason = "Prime Video streaming or Kindle device troubleshooting suitable for self-service playbook."
        diff = "Standard"
        return "DIGITAL_SERVICES_PRIME", decision, category, reason, diff

    # 3. PRODUCT DEFECT & DAMAGE
    if any(w in norm for w in ['doa', 'crushed', 'broken', 'damaged', 'shattered', 'wrong item', 'what came out of the box', 'out of warranty', 'warranty', 'marcadores no sirve', 'meat could get sick', 'food has been vegan', 'dry', 'scratch', 'defect']):
        if 'out of warranty' in norm or 'dumpster' in norm:
            decision = "ESCALATE_TO_HUMAN"
            category = "FINANCIAL_OR_CARRIER_DISPUTE"
            reason = "Disputed product warranty denial requiring supervisor review with manufacturer."
            diff = "High Sarcasm / Frustration"
        else:
            decision = "AUTO_HANDLE"
            category = "NONE"
            reason = "Damaged or wrong item delivered; guide customer to instant replacement portal."
            diff = "Standard"
        return "PRODUCT_DEFECT_DAMAGE", decision, category, reason, diff

    # 4. RETURN & REFUND
    if any(w in norm for w in ['pick up', 'pickup', 'return', 'refund', 'courier pick', 'self return', 'shipping charges back', 'size is not matching', 'replace', 'replacement', 'prime membership amount', 'return my money']):
        if any(w in norm for w in ['5 times', 'cancelled', 'struggling', '15 days', 'where is my refund', 'delayed refund']):
            decision = "ESCALATE_TO_HUMAN"
            category = "REPEAT_UNRESOLVED_CONTACT"
            reason = "Customer reported multiple failed courier pickup attempts or prolonged delayed refund."
            diff = "High Sarcasm / Frustration"
        else:
            decision = "AUTO_HANDLE"
            category = "NONE"
            reason = "Standard return authorization and label-free drop-off self-service guidance."
            diff = "Standard"
        return "RETURN_REFUND_REPLACEMENT", decision, category, reason, diff

    # 5. AGENT ESCALATION & COMPLAINT
    if any(w in norm for w in ['consumer court', 'sue', 'pathetic', 'useless', 'cheating', 'thieves', 'steal', 'murder', 'bullsh', 'wasted', 'manager', 'supervisor', 'discrimination', 'harassed', 'fire your courier', 'awful', 'terrible', 'worst']):
        category = "SEVERE_SENTIMENT_OR_LEGAL" if any(w in norm for w in ['sue', 'court', 'murder', 'police', 'thieves', 'cheat']) else "REPEAT_UNRESOLVED_CONTACT"
        decision = "ESCALATE_TO_HUMAN"
        reason = "Severe customer sentiment, threats of legal/regulatory action, or repeated failed support touches."
        diff = "High Sarcasm / Frustration"
        return "AGENT_ESCALATION_COMPLAINT", decision, category, reason, diff

    # 6. GENERAL INQUIRY & FEEDBACK
    if any(w in norm for w in ['love amazon', 'thank you', 'thanks!', 'solved 2 problems', 'props to', 'tote', 'how we can all accommodate', 'gift cards i send', 'anyone out there', 'hours', 'policy']):
        if 'tote' in norm:
            decision = "ESCALATE_TO_HUMAN"
            category = "OUT_OF_SCOPE_OR_LOW_CONFIDENCE"
            reason = "Physical logistics condominium tote disposal dispute out-of-scope for standard agent bot."
            diff = "Ambiguous / Multi-intent"
        else:
            decision = "AUTO_HANDLE"
            category = "NONE"
            reason = "Customer feedback, compliment, or general service policy inquiry."
            diff = "Standard"
        return "GENERAL_INQUIRY_FEEDBACK", decision, category, reason, diff

    # 7. ORDER DELIVERY
    is_missing = any(w in norm for w in ['haven\'t received', 'not received', 'never arrived', 'missing', 'stolen', 'didn\'t receive', 'where is my order'])
    if is_missing or ('delivered' in norm and 'lmao' in norm):
        decision = "ESCALATE_TO_HUMAN"
        category = "FINANCIAL_OR_CARRIER_DISPUTE"
        reason = "Marked delivered but missing from porch/doorstep; requires carrier dispute trace."
        diff = "High Sarcasm / Frustration" if 'lmao' in norm else "Standard"
    elif any(w in norm for w in ['delayed', 'rescheduled', 'running behind', 'missed', 'late']):
        decision = "AUTO_HANDLE"
        category = "NONE"
        reason = "Delayed order in transit; carrier tracking active and available via self-service portal."
        diff = "Ambiguous / Multi-intent" if 'urgent' in norm or 'hospital' in norm else "Standard"
    else:
        decision = "AUTO_HANDLE"
        category = "NONE"
        reason = "Standard order status tracking inquiry."
        diff = "Standard"
        
    return "ORDER_DELIVERY_ISSUE", decision, category, reason, diff

# Process all candidates
processed = []
for p in candidates:
    intent, dec, cat, rsn, diff = categorize(p)
    processed.append({
        'raw': p,
        'intent': intent,
        'decision': dec,
        'category': cat,
        'reason': rsn,
        'difficulty': diff
    })

print(f"Total processed: {len(processed)}")
by_intent = {}
for pr in processed:
    by_intent.setdefault(pr['intent'], []).append(pr)

for k, v in by_intent.items():
    print(f"  {k}: {len(v)}")
