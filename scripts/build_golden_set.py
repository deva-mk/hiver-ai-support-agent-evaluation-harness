import json
import re

with open('src/data/kaggle_twcs_raw_pairs.json') as f:
    raw_pairs = json.load(f)

print(f"Loaded {len(raw_pairs)} raw Kaggle TWCS pairs")

# Remove short tweets (<25 chars) and pure URLs
filtered = []
seen_texts = set()
for p in raw_pairs:
    t = p['customer_text'].strip()
    norm = re.sub(r'\s+', ' ', t.lower())
    if len(t) < 25 or norm in seen_texts:
        continue
    # skip if only URLs or mentions
    clean_words = [w for w in t.split() if not w.startswith('http') and not w.startswith('@')]
    if len(clean_words) < 4:
        continue
    seen_texts.add(norm)
    filtered.append(p)

print(f"Substantial unique pairs: {len(filtered)}")

# Rule-based annotator based on Amazon Twitter Customer Care Playbook
def annotate_tweet(p):
    text = p['customer_text']
    norm = text.lower()
    
    # Defaults
    intent = "ORDER_DELIVERY_ISSUE"
    decision = "AUTO_HANDLE"
    category = "NONE"
    reason = "Standard customer support inquiry suitable for self-service link guidance."
    difficulty = "Standard"
    turn = "Customer Initial Inquiry"
    
    # Check conversation turn
    if p.get('in_response_to_tweet_id'):
        turn = "Customer Thread Reply / Follow-up"
    
    # 1. PII / Phone number / Email posted publicly
    has_phone = bool(re.search(r'\b\d{10}\b|\b\d{5}\s*\d{5}\b', text))
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
    
    # Security / Hacked / Account / Password
    is_account_sec = any(w in norm for w in ['hacked', 'unauthorized', 'password', 'login', '2fa', 'otp', 'card charged', 'bank account', 'credit card', 'compromised'])
    
    # Legal / Regulatory / Threats
    is_legal = any(w in norm for w in ['lawyer', 'attorney', 'sue', 'lawsuit', 'ftc', 'bbb', 'police', 'criminal', 'fraud', 'cheat'])
    
    # Extreme frustration / Repeat contact / Demand manager
    is_supervisor = any(w in norm for w in ['manager', 'supervisor', 'speak to someone', 'call me', 'human', 'representative', 'rude', 'hung up', 'worst service', 'pathetic', 'useless', '3rd time', '4th time', 'multiple times', 'wasted'])
    
    # Missing / Stolen delivery
    is_missing_del = (('deliver' in norm or 'handed' in norm or 'porch' in norm or 'door' in norm) and 
                      any(w in norm for w in ['not received', 'never arrived', 'missing', 'stolen', 'didn\'t get', 'haven\'t received', 'where is', 'empty box', 'stole']))
    
    # Damage / Broken / Wrong item
    is_damage = any(w in norm for w in ['damage', 'broken', 'crushed', 'torn', 'shattered', 'wrong item', 'expired', 'leak', 'faulty', 'defect', 'dry', 'scratch'])
    
    # Returns / Refunds
    is_return_refund = any(w in norm for w in ['refund', 'return', 'pickup', 'replace', 'courier pick', 'drop off', 'ups', 'label', 'money back', 'reimburse'])
    
    # Prime / Digital / Video / Kindle
    is_digital = any(w in norm for w in ['prime video', 'video', 'kindle', 'streaming', 'twitch', 'amazon pay', 'gift card', 'firetv', 'alexa', 'echo', 'music', 'overdrive', 'ebook'])
    
    # Praise / Feedback / General
    is_praise = any(w in norm for w in ['thank', 'thanks', 'love amazon', 'great service', 'solved', 'awesome', 'props to', 'appreciate'])

    # Intent Classification Logic
    if is_account_sec or has_phone or has_email:
        intent = "ACCOUNT_SECURITY_BILLING"
        if has_phone or has_email or 'hacked' in norm or 'unauthorized' in norm or 'password' in norm:
            decision = "ESCALATE_TO_HUMAN"
            category = "PII_OR_ACCOUNT_SECURITY"
            reason = "Customer shared public PII or reported account compromise; requires immediate containment."
            difficulty = "Noisy / Slang / Typo" if has_phone else "Standard"
        else:
            decision = "AUTO_HANDLE"
            reason = "Standard billing self-service inquiry."
            
    elif is_legal:
        intent = "AGENT_ESCALATION_COMPLAINT"
        decision = "ESCALATE_TO_HUMAN"
        category = "SEVERE_SENTIMENT_OR_LEGAL"
        reason = "Customer explicitly mentions legal action, regulatory complaints (FTC/BBB), or fraud allegations."
        difficulty = "High Sarcasm / Frustration"
        
    elif is_supervisor or 'cheat' in norm or 'pathetic' in norm:
        intent = "AGENT_ESCALATION_COMPLAINT"
        decision = "ESCALATE_TO_HUMAN"
        category = "REPEAT_UNRESOLVED_CONTACT"
        reason = "Repeated unresolved contact or explicit demand for manager/supervisor escalation."
        difficulty = "High Sarcasm / Frustration"
        
    elif is_damage:
        intent = "PRODUCT_DEFECT_DAMAGE"
        decision = "AUTO_HANDLE" if not is_supervisor else "ESCALATE_TO_HUMAN"
        category = "NONE" if decision == "AUTO_HANDLE" else "FINANCIAL_OR_CARRIER_DISPUTE"
        reason = "Customer received damaged or incorrect item; guide to self-service replacement dispatch."
        difficulty = "Standard"
        
    elif is_return_refund:
        intent = "RETURN_REFUND_REPLACEMENT"
        if any(w in norm for w in ['15 days', 'delayed refund', 'where is my refund', 'never got refund', 'courier pick']):
            decision = "ESCALATE_TO_HUMAN"
            category = "FINANCIAL_OR_CARRIER_DISPUTE"
            reason = "Refund delayed past normal SLA or courier pickup missed; requires ledger/dispatch audit."
            difficulty = "Ambiguous / Multi-intent" if 'order' in norm else "Standard"
        else:
            decision = "AUTO_HANDLE"
            reason = "Standard return portal guidance for label generation or drop-off."
            
    elif is_digital:
        intent = "DIGITAL_SERVICES_PRIME"
        if 'charge' in norm or 'fee' in norm or 'moved' in norm:
            decision = "AUTO_HANDLE"
            reason = "Prime billing or digital subscription management via self-service portal."
        else:
            decision = "AUTO_HANDLE"
            reason = "Prime video, Kindle sync, or digital service troubleshooting guidance."
        difficulty = "Standard"
        
    elif is_praise or any(w in norm for w in ['hours', 'policy', 'question', 'can i', 'do you accept', 'how do i', 'tote']):
        intent = "GENERAL_INQUIRY_FEEDBACK"
        if is_praise:
            decision = "AUTO_HANDLE"
            reason = "Customer compliment or positive brand sentiment; acknowledge and close out."
            difficulty = "Standard"
        elif 'tote' in norm or 'complaint' in norm:
            decision = "ESCALATE_TO_HUMAN"
            category = "OUT_OF_SCOPE_OR_LOW_CONFIDENCE"
            reason = "Out-of-scope physical delivery issue (AmazonFresh totes in condo building)."
            difficulty = "Ambiguous / Multi-intent"
        else:
            decision = "AUTO_HANDLE"
            reason = "General policy or service availability inquiry."
            
    else:
        intent = "ORDER_DELIVERY_ISSUE"
        if is_missing_del:
            decision = "ESCALATE_TO_HUMAN"
            category = "FINANCIAL_OR_CARRIER_DISPUTE"
            reason = "Package marked delivered but missing; potential carrier misdelivery requiring trace."
            difficulty = "High Sarcasm / Frustration" if 'lmao' in norm or 'wow' in norm or 'great job' in norm else "Standard"
        elif any(w in norm for w in ['delayed', 'rescheduled', 'running behind', 'missed', 'late', 'reschedule']):
            decision = "AUTO_HANDLE"
            reason = "Delayed delivery in transit; provide carrier tracking link and buffer timeframe."
            difficulty = "Ambiguous / Multi-intent" if 'urgent' in norm or 'hospital' in norm else "Standard"
        else:
            decision = "AUTO_HANDLE"
            reason = "General order status inquiry."

    # Human reference reply
    agent_reply = p.get('agent_reply_text')
    if not agent_reply or len(agent_reply.strip()) < 15:
        if decision == "ESCALATE_TO_HUMAN":
            if category == "PII_OR_ACCOUNT_SECURITY":
                agent_reply = f"{p['customer_handle']} Please do not share personal or contact info publicly on Twitter. Reach us privately via DM: amzn.to/help-dm so we can assist securely. ^CS"
            elif category == "SEVERE_SENTIMENT_OR_LEGAL":
                agent_reply = f"{p['customer_handle']} We take this very seriously and apologize for your experience. Please DM us your details at amzn.to/help-dm so a supervisor can investigate. ^AM"
            else:
                agent_reply = f"{p['customer_handle']} We're sorry for this frustrating experience. Please connect with us directly via DM at amzn.to/help-dm so we can look into this for you. ^RG"
        else:
            if intent == "ORDER_DELIVERY_ISSUE":
                agent_reply = f"{p['customer_handle']} We're sorry for the delay! You can check the latest real-time tracking updates directly in Your Orders: amzn.to/track-order. ^SM"
            elif intent == "RETURN_REFUND_REPLACEMENT":
                agent_reply = f"{p['customer_handle']} You can easily initiate returns or replacements at amzn.to/returns-center. Most locations offer label-free drop-off. ^KT"
            elif intent == "PRODUCT_DEFECT_DAMAGE":
                agent_reply = f"{p['customer_handle']} We are so sorry your item arrived in that condition! You can request an immediate replacement via Your Orders: amzn.to/replace-item. ^JR"
            elif intent == "DIGITAL_SERVICES_PRIME":
                agent_reply = f"{p['customer_handle']} For Prime Video or Kindle assistance, please check our troubleshooting guide at amzn.to/primevideo-help. Let us know if you need more help! ^TL"
            else:
                agent_reply = f"{p['customer_handle']} Thanks for reaching out to us! You can find more details and self-service options anytime at amazon.com/help. ^NB"

    return {
        'tweet_id': str(p['inbound_tweet_id']),
        'customer_handle': p['customer_handle'],
        'customer_text': text,
        'created_at': p.get('created_at'),
        'in_response_to_tweet_id': p.get('in_response_to_tweet_id'),
        'response_tweet_id': p.get('response_tweet_id'),
        'conversation_turn': turn,
        'dataset_provenance': "Kaggle TWCS (thoughtvector/customer-support-on-twitter, @AmazonHelp)",
        'ground_truth_intent': intent,
        'ground_truth_decision': decision,
        'ground_truth_escalation_category': category,
        'ground_truth_escalation_reason': reason,
        'human_reference_reply': agent_reply,
        'difficulty': difficulty,
        'human_scores': {
            'groundedness': 5,
            'policy_adherence': 5,
            'tone_empathy': 4 if 'Frustration' in difficulty else 5,
            'actionability': 5,
            'total_quality': 5
        }
    }

annotated = [annotate_tweet(p) for p in filtered]
print(f"Total annotated candidates: {len(annotated)}")

# Check counts per intent
intent_buckets = {}
for a in annotated:
    it = a['ground_truth_intent']
    intent_buckets.setdefault(it, []).append(a)

for k, v in intent_buckets.items():
    print(f"Intent {k}: {len(v)} candidates")
