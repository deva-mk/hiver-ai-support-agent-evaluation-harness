export enum IntentType {
  ORDER_DELIVERY_ISSUE = "ORDER_DELIVERY_ISSUE",
  RETURN_REFUND_REPLACEMENT = "RETURN_REFUND_REPLACEMENT",
  ACCOUNT_SECURITY_BILLING = "ACCOUNT_SECURITY_BILLING",
  PRODUCT_DEFECT_DAMAGE = "PRODUCT_DEFECT_DAMAGE",
  DIGITAL_SERVICES_PRIME = "DIGITAL_SERVICES_PRIME",
  AGENT_ESCALATION_COMPLAINT = "AGENT_ESCALATION_COMPLAINT",
  GENERAL_INQUIRY_FEEDBACK = "GENERAL_INQUIRY_FEEDBACK"
}

export enum DecisionType {
  AUTO_HANDLE = "AUTO_HANDLE",
  ESCALATE_TO_HUMAN = "ESCALATE_TO_HUMAN"
}

export enum EscalationCategory {
  PII_OR_ACCOUNT_SECURITY = "PII_OR_ACCOUNT_SECURITY",
  SEVERE_SENTIMENT_OR_LEGAL = "SEVERE_SENTIMENT_OR_LEGAL",
  FINANCIAL_OR_CARRIER_DISPUTE = "FINANCIAL_OR_CARRIER_DISPUTE",
  REPEAT_UNRESOLVED_CONTACT = "REPEAT_UNRESOLVED_CONTACT",
  OUT_OF_SCOPE_OR_LOW_CONFIDENCE = "OUT_OF_SCOPE_OR_LOW_CONFIDENCE",
  NONE = "NONE"
}

export type DifficultyLevel = 
  | "Standard"
  | "Ambiguous / Multi-intent"
  | "Noisy / Slang / Typo"
  | "High Sarcasm / Frustration";

export interface HumanScores {
  groundedness: number; // 1-5
  policy_adherence: number; // 1-5
  tone_empathy: number; // 1-5
  actionability: number; // 1-5
  total_quality: number; // 1-5
}

export interface GoldenExample {
  id: string;
  tweet_id: string;
  customer_handle: string;
  customer_text: string;
  created_at?: string;
  in_response_to_tweet_id?: string | number | null;
  response_tweet_id?: string | null;
  conversation_turn?: string;
  dataset_provenance?: string;
  ground_truth_intent: IntentType;
  ground_truth_decision: DecisionType;
  ground_truth_escalation_category: EscalationCategory;
  ground_truth_escalation_reason: string;
  human_reference_reply: string;
  difficulty: DifficultyLevel;
  annotator_notes?: string;
  human_scores: HumanScores;
}

export interface RetrievedResolutionContext {
  id: string;
  title: string;
  matched_intent: IntentType;
  similarity_score: number;
  historical_resolution: string;
  policy_guideline: string;
  official_link: string;
  sample_human_tweet: string;
  source_tweet_id?: string;
  source_conversation?: string;
}

export interface JudgeEvaluation {
  groundedness: number; // 1-5
  policy_compliance: number; // 1-5
  tone_and_empathy: number; // 1-5
  actionability: number; // 1-5
  overall_score: number; // 1-5
  critique: string;
  passed: boolean;
}

export interface PipelineResult {
  intent: IntentType;
  intent_confidence: number;
  intent_rationale: string;
  secondary_intents: IntentType[];
  decision: DecisionType;
  escalation_category: EscalationCategory;
  escalation_reason: string;
  retrieved_contexts: RetrievedResolutionContext[];
  draft_reply: string;
  agent_signoff: string;
  latency_ms: number;
  judge_evaluation?: JudgeEvaluation;
}

export interface FailureModeAnalysis {
  id: number;
  name: string;
  frequency_estimate: string;
  severity: "High" | "Medium" | "Critical";
  real_tweet_example: string;
  predicted_output: string;
  expected_output: string;
  root_cause_hypothesis: string;
  mitigation_strategy: string;
}

export interface DecisionLogEntry {
  id: number;
  decision: string;
  alternatives_considered: string;
  chosen_rationale: string;
  tradeoff_accepted: string;
  impact_on_metrics: string;
}

export interface ModelHeadlineMetrics {
  name: string;
  type: "Trivial Baseline" | "Simple Keyword Baseline" | "Simple LLM Baseline" | "Proposed Production Agent";
  intent_accuracy: number;
  intent_macro_f1: number;
  escalation_accuracy: number;
  false_auto_handle_rate: number; // Critical safety metric
  false_escalation_rate: number; // Cost efficiency metric
  avg_judge_score: number; // Out of 5.0
  policy_compliance_rate: number; // %
  avg_latency_ms: number;
}

export enum UserRole {
  TIER_1_AGENT = "TIER_1_AGENT",
  SUPERVISOR = "SUPERVISOR",
  ML_ENGINEER = "ML_ENGINEER",
  AUDITOR = "AUDITOR",
  GUEST = "GUEST"
}

export type PermissionAction =
  | "TEST_SANDBOX"
  | "EXECUTE_CONCESSION"
  | "RUN_BATCH_BENCHMARK"
  | "EXPORT_DATASET"
  | "OVERRIDE_ESCALATION"
  | "EDIT_BRAND_POLICY"
  | "VIEW_INTERNAL_DECISIONS";

export interface RoleRuleDefinition {
  rule_id: string;
  title: string;
  category: "FINANCIAL_COMPLIANCE" | "SECURITY_PII" | "EVALUATION_INTEGRITY" | "OPERATIONAL_SLA";
  description: string;
  allowed_roles: UserRole[];
  enforcement_action: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  role_display: string;
  department: string;
  avatar: string;
  badge: string;
  session_started_at: string;
}
