import { IntentType, RetrievedResolutionContext } from "../types.ts";

export interface BrandPolicyRule {
  rule_id: string;
  category: string;
  rule_text: string;
  escalation_trigger: boolean;
}

export const AMAZON_BRAND_POLICIES: BrandPolicyRule[] = [
  {
    rule_id: "POL-01-NO-PII",
    category: "Safety & Privacy",
    rule_text: "NEVER ask customers to share full order numbers, tracking numbers, physical addresses, credit card numbers, or passwords publicly on Twitter. Direct them to a verified private channel (e.g. DM link 'amzn.to/help-dm' or amazon.com/contact-us).",
    escalation_trigger: true
  },
  {
    rule_id: "POL-02-TRACKING-SELF-SERVICE",
    category: "Order Tracking",
    rule_text: "For standard delivery inquiries where no courier dispute or extreme delay is flagged, provide the direct self-service link to 'Your Orders' (amzn.to/track-order) and explain how to verify delivery photo/notes.",
    escalation_trigger: false
  },
  {
    rule_id: "POL-03-LOST-STOLEN-PACKAGES",
    category: "Lost Packages",
    rule_text: "If an item is marked 'Delivered' 36+ hours ago but not received, or customer suspects theft/tampering, this requires internal carrier log verification. Escalate to human specialist for carrier trace / replacement dispatch.",
    escalation_trigger: true
  },
  {
    rule_id: "POL-04-RETURNS-WINDOW",
    category: "Returns & Refunds",
    rule_text: "Amazon standard return window is 30 days from delivery. Guide customer to the Online Returns Center (amzn.to/returns-center) for instant QR code dropoff. If refund is delayed past 5-7 business days post-scan, escalate for manual ledger check.",
    escalation_trigger: false
  },
  {
    rule_id: "POL-05-ACCOUNT-SECURITY",
    category: "Security & Fraud",
    rule_text: "Any mention of unauthorized transactions, unexpected 2FA OTP codes, locked Amazon accounts, or suspected compromise is zero-tolerance. Immediately escalate to the Account Specialist Security desk.",
    escalation_trigger: true
  },
  {
    rule_id: "POL-06-AGENT-TONE",
    category: "Brand Persona",
    rule_text: "Tone must be concise, empathetic, and professional. Tweet length must not exceed 280 characters. Always sign off with representative initials (e.g., ^SM, ^KV, ^JR). Never blame the customer or make promises regarding financial compensation without account inspection.",
    escalation_trigger: false
  },
  {
    rule_id: "POL-07-PRIME-DIGITAL",
    category: "Prime & Digital",
    rule_text: "For Prime video streaming error codes (e.g. Error 7031) or Kindle sync issues, provide basic device restart/app cache troubleshooting. If account-level entitlement error persists, escalate to Digital Media support.",
    escalation_trigger: false
  }
];

export const HISTORICAL_KNOWLEDGE_BASE: RetrievedResolutionContext[] = [
  {
    id: "KB-ORD-01",
    title: "Order Delayed in Transit (Tracking Active)",
    matched_intent: IntentType.ORDER_DELIVERY_ISSUE,
    similarity_score: 0.94,
    historical_resolution: "Apologize for delay, confirm carrier tracking can be checked via Your Orders, and set expectations for carrier updates within 24 hours.",
    policy_guideline: "Direct to amzn.to/track-order without requesting order number publicly.",
    official_link: "https://amzn.to/track-order",
    sample_human_tweet: "Late orders usually arrive the next business day. If your order hasn't arrived by 8:00 PM tomorrow, please let us know: amzn.to/track-order. ^LR",
    source_tweet_id: "13926",
    source_conversation: "Customer @118925: 'Nothing on my order on your web site.' -> @AmazonHelp: 'Late order usually arrive the next business day. If your order hasn\\'t arrived by 8:00 PM tomorrow, please let us know. ^LR'"
  },
  {
    id: "KB-ORD-02",
    title: "Package Marked Delivered but Not Received",
    matched_intent: IntentType.ORDER_DELIVERY_ISSUE,
    similarity_score: 0.91,
    historical_resolution: "Advise customer to check safe places/neighbors and allow 36 hours. If still missing, escalate via direct message to open a carrier dispute.",
    policy_guideline: "Carrier delivery window allows 36 hours for premature scan. Escalate to human specialist if past 36 hours.",
    official_link: "https://amzn.to/help-dm",
    sample_human_tweet: "I'm sorry you didn't receive your order. Please check around your porch/neighbors. If still missing, please DM us at amzn.to/help-dm so we can investigate. ^SE",
    source_tweet_id: "17183",
    source_conversation: "Customer @119790: ''Hey @AmazonHelp i haven\\'t received my \"delivered\" order.' 'Did you check around your house' lmao' -> @AmazonHelp: 'I\\'m sorry you didn\\'t receive your order. Did our customer service agent provide a solution for you? ^SE'"
  },
  {
    id: "KB-RET-01",
    title: "How to Start a Return / Print Label",
    matched_intent: IntentType.RETURN_REFUND_REPLACEMENT,
    similarity_score: 0.95,
    historical_resolution: "Explain Online Return Center self-service with QR code drop-off at Kohl's/UPS without needing a box or printer.",
    policy_guideline: "Standard 30-day return window. No human escalation needed for standard label generation.",
    official_link: "https://amzn.to/returns-center",
    sample_human_tweet: "You can start your return quickly via our Online Returns Center: amzn.to/returns-center! Most returns offer box-free, label-free QR code drop-off at local partner locations. ^KV",
    source_tweet_id: "17656",
    source_conversation: "Customer @119904: 'I have bought a product and now it\\'s size is not matching I want to return it and also requested return process.' -> @AmazonHelp: 'You can easily initiate returns or replacements at amzn.to/returns-center. Most locations offer label-free drop-off. ^KT'"
  },
  {
    id: "KB-RET-02",
    title: "Refund Not Received After Return Scan",
    matched_intent: IntentType.RETURN_REFUND_REPLACEMENT,
    similarity_score: 0.89,
    historical_resolution: "Explain typical 3-5 business day processing window post return scan. If overdue (>7 business days), trigger human escalation for transaction review.",
    policy_guideline: "Delayed refund inquiry requires secure account lookup. Escalate if customer states scan was >7 days ago.",
    official_link: "https://amzn.to/help-dm",
    sample_human_tweet: "Refunds typically process within 3-5 business days once our facility receives the item. If it has been longer, please send us a direct message: amzn.to/help-dm with your details so we can check on this for you! ^MB",
    source_tweet_id: "38821",
    source_conversation: "Customer @120932: 'Hi, still awaiting the refund. It shows we will initiate the refund once we receive the item... Don\\'t know how did the seller didn\\'t receive it yet.' -> @AmazonHelp: 'Refunds typically process within 3-5 business days once our facility receives the item. Please reach us via DM: amzn.to/help-dm. ^MB'"
  },
  {
    id: "KB-ACC-01",
    title: "Unrecognized Prime Charge or Membership Renewal",
    matched_intent: IntentType.ACCOUNT_SECURITY_BILLING,
    similarity_score: 0.93,
    historical_resolution: "Guide user to 'Manage Your Prime Membership' to check charge breakdown or cancel and receive auto-prorated refund. Direct to secure sign-in.",
    policy_guideline: "Never ask for card digits. Escalate if customer suspects identity theft or fraudulent card usage.",
    official_link: "https://amzn.to/manage-prime",
    sample_human_tweet: "The $1 charge is a temporary authorization hold to confirm card validity, which drops off in 2-3 business days. You can view membership details at amzn.to/manage-prime. ^TN",
    source_tweet_id: "17686",
    source_conversation: "Customer @119908: 'hey I started a Amazon prime trial..i was charged $1..wats that about ?' -> @AmazonHelp: 'That is a temporary authorization hold to verify your card, which will drop off automatically. Check details: amzn.to/manage-prime. ^TN'"
  },
  {
    id: "KB-ACC-02",
    title: "Account Locked / 2-Factor Authentication Issue",
    matched_intent: IntentType.ACCOUNT_SECURITY_BILLING,
    similarity_score: 0.96,
    historical_resolution: "Account lockout / 2FA issues cannot be resolved over public social channels. Provide secure account recovery portal link or direct customer service callback.",
    policy_guideline: "Strict escalation trigger: direct to amazon.com/contact-us with zero public verification.",
    official_link: "https://amzn.to/account-recovery",
    sample_human_tweet: "For your account security, we cannot assist with login or verification issues over Twitter. Please reach our Account Specialists directly through our secure portal: amzn.to/account-recovery. ^AC",
    source_tweet_id: "17229",
    source_conversation: "Customer @119793: 'I am unable to drop you a mail through this link as there\\'s no email id associated with this account, it\\'s a mobile account. Facing trouble.' -> @AmazonHelp: 'For your security, we cannot assist with account verification over Twitter. Reach our Account Specialists securely at amzn.to/account-recovery. ^AC'"
  },
  {
    id: "KB-DMG-01",
    title: "Item Arrived Damaged or Box Crushed",
    matched_intent: IntentType.PRODUCT_DEFECT_DAMAGE,
    similarity_score: 0.92,
    historical_resolution: "Express sincere apology for damaged item condition. Direct to Your Orders for instant free replacement dispatch or refund selection.",
    policy_guideline: "Customers can order instant replacement before returning damaged goods via Returns Center.",
    official_link: "https://amzn.to/replace-item",
    sample_human_tweet: "We are so sorry to hear your item arrived in that condition! You can request an instant replacement or refund right away under Your Orders: amzn.to/replace-item. We want to make this right! ^JR",
    source_tweet_id: "17908",
    source_conversation: "Customer @119970: 'Two DOA orders. First hard drive came bouncing in a giant box, second one crushed in a padded envelope... sigh. Refund on way. @AmazonHelp' -> @AmazonHelp: 'We are so sorry your item arrived damaged! You can request an instant replacement under Your Orders: amzn.to/replace-item. ^JR'"
  },
  {
    id: "KB-DIG-01",
    title: "Prime Video Streaming Error / Playback Issue",
    matched_intent: IntentType.DIGITAL_SERVICES_PRIME,
    similarity_score: 0.90,
    historical_resolution: "Suggest restarting the Prime Video app, clearing cache, or checking HDMI/browser compatibility.",
    policy_guideline: "Offer standard troubleshooting first; escalate if billing or geo-restriction error.",
    official_link: "https://amzn.to/primevideo-help",
    sample_human_tweet: "Sorry for the buffering trouble! Please try restarting the Prime Video app or clearing your browser cache. For more troubleshooting steps, check: amzn.to/primevideo-help. Let us know if that helps! ^TJ",
    source_tweet_id: "17265",
    source_conversation: "Customer @119799: 'I have a samsung and roku tvs. On both models I have trouble watching. The roku the most. The samsung is better but I\\'ve experienced buffer' -> @AmazonHelp: 'Sorry for the buffering trouble! Please try restarting the Prime Video app or clearing your cache: amzn.to/primevideo-help. ^TJ'"
  },
  {
    id: "KB-ESC-01",
    title: "Severe Escalation / Repeat Contact / Demanding Supervisor",
    matched_intent: IntentType.AGENT_ESCALATION_COMPLAINT,
    similarity_score: 0.97,
    historical_resolution: "Acknowledge intense frustration without arguing. Immediately invite customer into direct message for priority tier-2 human supervisor review.",
    policy_guideline: "Mandatory human escalation. Do not attempt automated FAQ deflection.",
    official_link: "https://amzn.to/help-dm",
    sample_human_tweet: "We understand how frustrating this has been, and we're truly sorry for the experience. Please send us a direct message at amzn.to/help-dm so our leadership team can personally look into this for you. ^DL",
    source_tweet_id: "17234",
    source_conversation: "Customer @119794: 'Going to take this in the consumer court...total fraud from amazon @AmazonHelp i will sue you guys for this ...' -> @AmazonHelp: 'We understand your frustration. Please DM us your details at amzn.to/help-dm so our leadership team can investigate immediately. ^KA'"
  },
  {
    id: "KB-GEN-01",
    title: "General Inquiries / Stock / Compliments",
    matched_intent: IntentType.GENERAL_INQUIRY_FEEDBACK,
    similarity_score: 0.88,
    historical_resolution: "Provide friendly, polite response answering the inquiry or thanking the customer for positive feedback.",
    policy_guideline: "Auto-handle. Keep response cheerful and aligned with brand voice.",
    official_link: "https://amzn.to/help",
    sample_human_tweet: "Thanks so much for reaching out! We really appreciate the kind words and will be sure to share them with our team. Have a wonderful rest of your day! ^JH",
    source_tweet_id: "22576",
    source_conversation: "Customer @120932: '@AmazonHelp @115850 Thanks for the prompt response. Props to Bikram from Amazon. Reinstated my faith in @115850' -> @AmazonHelp: 'Thanks so much for reaching out! We really appreciate the kind words and will share them with Bikram! ^JH'"
  }
];

export function retrieveContextForTweet(text: string, intent?: IntentType): RetrievedResolutionContext[] {
  const normalized = text.toLowerCase();
  
  // Score contexts based on keyword matches and intent alignment
  const scored = HISTORICAL_KNOWLEDGE_BASE.map(ctx => {
    let score = 0.5;
    if (intent && ctx.matched_intent === intent) {
      score += 0.35;
    }

    if (normalized.includes("late") || normalized.includes("delay") || normalized.includes("where") || normalized.includes("track")) {
      if (ctx.id === "KB-ORD-01") score += 0.25;
    }
    if (normalized.includes("delivered") && (normalized.includes("not received") || normalized.includes("haven't received") || normalized.includes("didn't get") || normalized.includes("missing"))) {
      if (ctx.id === "KB-ORD-02") score += 0.35;
    }
    if (normalized.includes("return") || normalized.includes("label") || normalized.includes("drop off") || normalized.includes("kohl")) {
      if (ctx.id === "KB-RET-01") score += 0.3;
    }
    if (normalized.includes("refund") && (normalized.includes("haven't got") || normalized.includes("waiting") || normalized.includes("status"))) {
      if (ctx.id === "KB-RET-02") score += 0.3;
    }
    if (normalized.includes("charge") || normalized.includes("prime") || normalized.includes("renew") || normalized.includes("billed") || normalized.includes("unauthorized")) {
      if (ctx.id === "KB-ACC-01") score += 0.3;
    }
    if (normalized.includes("locked") || normalized.includes("password") || normalized.includes("otp") || normalized.includes("2fa") || normalized.includes("hacked")) {
      if (ctx.id === "KB-ACC-02") score += 0.35;
    }
    if (normalized.includes("damaged") || normalized.includes("broken") || normalized.includes("crushed") || normalized.includes("defective")) {
      if (ctx.id === "KB-DMG-01") score += 0.35;
    }
    if (normalized.includes("prime video") || normalized.includes("kindle") || normalized.includes("stream") || normalized.includes("error code")) {
      if (ctx.id === "KB-DIG-01") score += 0.3;
    }
    if (normalized.includes("supervisor") || normalized.includes("manager") || normalized.includes("worst") || normalized.includes("sue") || normalized.includes("ridiculous") || normalized.includes("3rd time") || normalized.includes("useless")) {
      if (ctx.id === "KB-ESC-01") score += 0.4;
    }

    return {
      ...ctx,
      similarity_score: Math.min(0.99, Math.max(0.60, Number(score.toFixed(2))))
    };
  });

  // Sort descending by similarity score
  return scored.sort((a, b) => b.similarity_score - a.similarity_score).slice(0, 3);
}
