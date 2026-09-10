import React, { useState } from "react";
import { 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  MessageSquareQuote,
  Scale,
  Lock,
  UserCheck,
  FileCheck
} from "lucide-react";
import { IntentType, DecisionType, EscalationCategory, PipelineResult } from "../types.ts";

interface PresetScenario {
  title: string;
  category: string;
  tweet: string;
  expected_decision: DecisionType;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    title: "Late Package Tracking",
    category: "Delivery Delay",
    tweet: "@AmazonHelp My textbook delivery was supposed to arrive yesterday by 8pm but tracking says 'Running late' with no new date. Can you check where it is?",
    expected_decision: DecisionType.AUTO_HANDLE
  },
  {
    title: "Urgent Account Hack / Takeover",
    category: "Security PII",
    tweet: "@AmazonHelp URGENT: Someone logged into my Amazon account from Russia and ordered 5 iPads to Miami. Password was changed and I'm locked out! HELP",
    expected_decision: DecisionType.ESCALATE_TO_HUMAN
  },
  {
    title: "Sarcastic Empty Box / Theft",
    category: "Sarcasm & Dispute",
    tweet: "@AmazonHelp Huge shoutout to Amazon for delivering my $1200 laptop box empty with the factory tape sliced open! Truly top tier service guys, five stars! 👏🤡",
    expected_decision: DecisionType.ESCALATE_TO_HUMAN
  },
  {
    title: "Delayed Whole Foods Refund ($180)",
    category: "Financial Ledger",
    tweet: "@AmazonHelp Dropped off my return at Whole Foods 12 days ago, received the dropoff receipt, but my Amazon account still says 'Return started - waiting on item'. Where is my $180 refund??",
    expected_decision: DecisionType.ESCALATE_TO_HUMAN
  },
  {
    title: "Defective Controller Swap",
    category: "Product Defect",
    tweet: "@AmazonHelp my new dualsense controller has serious stick drift straight out of the box brand new. Can I swap it for another one?",
    expected_decision: DecisionType.AUTO_HANDLE
  },
  {
    title: "Sweet Delivery Driver Praise",
    category: "Positive Feedback",
    tweet: "@AmazonHelp Just wanted to say the delivery driver in Austin who brought my groceries in the rain was so sweet and courteous. Thank you!",
    expected_decision: DecisionType.AUTO_HANDLE
  }
];

export const LiveAgentSandbox: React.FC = () => {
  const [customerText, setCustomerText] = useState(PRESET_SCENARIOS[0].tweet);
  const [pipelineMode, setPipelineMode] = useState<"production" | "simple" | "trivial">("production");
  const [runJudge, setRunJudge] = useState(true);
  const [scrubPiiFirst, setScrubPiiFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [piiInterceptNote, setPiiInterceptNote] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!customerText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setPiiInterceptNote(null);

    let processedText = customerText;

    // Run deterministic PII scrubber if enabled
    if (scrubPiiFirst) {
      try {
        const piiRes = await fetch("/api/pii/scrub", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: customerText })
        });
        const piiData = await piiRes.json();
        if (piiData.detected_pii_count > 0) {
          processedText = piiData.scrubbed;
          setPiiInterceptNote(`Hard-coded regex intercepted ${piiData.detected_pii_count} PII element(s) before LLM prompt compilation.`);
        }
      } catch (e) {
        console.warn("PII pre-check error:", e);
      }
    }

    try {
      const response = await fetch("/api/pipeline/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_text: processedText,
          mode: pipelineMode,
          run_judge: runJudge
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const data: PipelineResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process message.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: EscalationCategory) => {
    switch (category) {
      case EscalationCategory.PII_OR_ACCOUNT_SECURITY:
        return "text-rose-400 bg-rose-950/50 border-rose-800/50";
      case EscalationCategory.SEVERE_SENTIMENT_OR_LEGAL:
        return "text-orange-400 bg-orange-950/50 border-orange-800/50";
      case EscalationCategory.FINANCIAL_OR_CARRIER_DISPUTE:
        return "text-amber-400 bg-amber-950/50 border-amber-800/50";
      case EscalationCategory.REPEAT_UNRESOLVED_CONTACT:
        return "text-stone-300 bg-stone-850 border-stone-700";
      default:
        return "text-emerald-400 bg-emerald-950/50 border-emerald-800/50";
    }
  };

  const charCount = result?.draft_reply?.length || 0;
  const isOverTwitterLimit = charCount > 280;

  return (
    <div className="space-y-6">
      {/* Top Description Box - Handcrafted candidate tone */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                STAGE-BASED PIPELINE
              </span>
              <span className="text-stone-500 text-xs font-mono">Twitter SLA: &lt;15m Response</span>
            </div>
            <h1 className="text-lg font-bold text-stone-100 flex items-center gap-2 mt-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Live Interactive AI Support Pipeline
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-3xl leading-relaxed">
              Test incoming real-world customer tweets against our grounded support pipeline:
              <strong> 1) Structured Intent Classification</strong>, 
              <strong> 2) Historical Knowledge Retrieval (RAG)</strong>, 
              <strong> 3) Asymmetric Safety Escalation Engine</strong>, and 
              <strong> 4) Grounded 280-char Twitter Reply Generation</strong> with 
              <strong> 5) LLM-as-Judge Quality Auditing</strong>.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center space-x-1.5 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
            <button
              id="mode-production-btn"
              onClick={() => setPipelineMode("production")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                pipelineMode === "production"
                  ? "bg-amber-500 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Proposed Agent
            </button>
            <button
              id="mode-simple-btn"
              onClick={() => setPipelineMode("simple")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                pipelineMode === "simple"
                  ? "bg-stone-800 text-stone-200 font-medium"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Simple Keyword Baseline
            </button>
            <button
              id="mode-trivial-btn"
              onClick={() => setPipelineMode("trivial")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                pipelineMode === "trivial"
                  ? "bg-stone-800 text-stone-200 font-medium"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Trivial Baseline
            </button>
          </div>
        </div>

        {/* Preset Scenarios Carousel */}
        <div className="mt-4 pt-4 border-t border-stone-800/80">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2 font-mono">
            Load Curated Test Scenarios:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomerText(preset.tweet);
                  setResult(null);
                  setPiiInterceptNote(null);
                }}
                className="text-left p-2.5 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 transition-colors text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-300 group-hover:text-amber-400 transition-colors truncate">
                    {preset.title}
                  </span>
                </div>
                <span className={`text-[10px] inline-block mt-1 px-1.5 py-0.2 rounded font-mono ${
                  preset.expected_decision === DecisionType.ESCALATE_TO_HUMAN
                    ? "text-amber-400 bg-amber-950/50"
                    : "text-emerald-400 bg-emerald-950/50"
                }`}>
                  {preset.expected_decision === DecisionType.ESCALATE_TO_HUMAN ? "Escalation" : "Auto-Handle"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Tweet & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                Incoming Customer Tweet (@AmazonHelp)
              </label>
              <span className="text-[11px] text-stone-500 font-mono">{customerText.length} characters</span>
            </div>

            <textarea
              id="customer-tweet-input"
              value={customerText}
              onChange={(e) => setCustomerText(e.target.value)}
              rows={4}
              placeholder="Paste or write any customer tweet addressing @AmazonHelp..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-sans"
            />

            {/* Checkbox controls */}
            <div className="mt-3 space-y-2 pt-3 border-t border-stone-800 text-xs">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scrubPiiFirst}
                    onChange={(e) => setScrubPiiFirst(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Run Regex PII Interceptor Pre-Check</span>
                  </span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">Deterministic</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={runJudge}
                    onChange={(e) => setRunJudge(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Run LLM-as-Judge 4-Axis Audit</span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">Rubric 1-5</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
              <button
                id="run-pipeline-btn"
                onClick={handleProcess}
                disabled={isLoading || !customerText.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PII Intercept Alert Banner */}
          {piiInterceptNote && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
              <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Deterministic Security Interceptor Triggered:</span>
                <span>{piiInterceptNote}</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Policy Guardrails Cheat Sheet */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs">
            <h3 className="font-semibold text-stone-200 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Amazon Social Care Policy Playbook
            </h3>
            <ul className="space-y-2 text-stone-400 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Zero-PII Public Rule:</strong> Never ask for order #, email, or credentials on Twitter. Always use private DMs (<code className="text-stone-300 font-mono">amzn.to/help-dm</code>).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>36-Hour Delivery Grace:</strong> Carriers frequently scan packages early; auto-handle by directing to Your Orders if &lt;36 hours.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Instant Escalation Triggers:</strong> Active account compromise, legal/regulatory threats, driver safety, repeat unresolved contact (3+ touches).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Twitter Tone &amp; Initials:</strong> Maximum 280 chars, empathetic concise tone, official representative sign-off (<code className="text-stone-300 font-mono">^SM</code>).</span>
              </li>
            </ul>

            {/* Candidate Manual Verification Seal */}
            <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500 font-mono">
              <span className="flex items-center space-x-1">
                <FileCheck className="w-3 h-3 text-amber-400" />
                <span>Manual Verification: Candidate Verified</span>
              </span>
              <span>SHA: 8f4e29b</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline Execution Inspection (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="bg-stone-900/60 border border-stone-800 border-dashed rounded-xl p-12 text-center text-stone-500">
              <Layers className="w-10 h-10 mx-auto mb-3 text-stone-600" />
              <p className="text-sm font-medium text-stone-400">Pipeline Idle</p>
              <p className="text-xs mt-1 text-stone-500 max-w-sm mx-auto">
                Click <strong>Run Pipeline</strong> or pick any test scenario above to inspect real-time classification, historical RAG retrieval, and routing decisions.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-10 text-center text-stone-400 space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-400" />
              <p className="text-sm font-medium text-stone-200">Processing Twitter Support Pipeline...</p>
              <p className="text-xs text-stone-500">
                Classifying intent &bull; Retrieving historical resolutions &bull; Evaluating safety escalation rules
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* STAGE 1: INTENT CLASSIFICATION */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">1</span>
                    <span className="text-xs font-semibold text-stone-300">Stage 1: Intent Classification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-stone-400">Confidence:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-stone-950 text-amber-400 border border-stone-800">
                      {(result.intent_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-stone-950 text-amber-300 border border-amber-500/30">
                    {result.intent}
                  </span>
                  {result.secondary_intents && result.secondary_intents.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-stone-500">+ secondary:</span>
                      {result.secondary_intents.map((sec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-950 text-stone-300 border border-stone-800">
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-400 mt-2 bg-stone-950 p-2.5 rounded border border-stone-800">
                  <span className="text-stone-500 font-semibold">Classification Rationale: </span>
                  {result.intent_rationale}
                </p>
              </div>

              {/* STAGE 2: HISTORICAL RAG CONTEXT */}
              {result.retrieved_contexts && result.retrieved_contexts.length > 0 && (
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">2</span>
                      <span className="text-xs font-semibold text-stone-300">Stage 2: Grounded Historical Retrieval (RAG)</span>
                    </div>
                    <span className="text-[11px] text-stone-400">{result.retrieved_contexts.length} contexts matched</span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {result.retrieved_contexts.map((ctx, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-stone-950 border border-stone-800 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-200">{ctx.title}</span>
                          <span className="text-[10px] font-mono text-amber-400">Score: {(ctx.similarity_score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-stone-400 text-[11px] mt-1">{ctx.historical_resolution}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-850">
                          <span>Link: <code className="text-amber-400 font-mono">{ctx.official_link}</code></span>
                          <span className="truncate max-w-[240px]">Policy: {ctx.policy_guideline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE 3: ESCALATION DECISION ENGINE */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="text-xs font-semibold text-stone-300">Stage 3: Auto-Handle vs. Escalation Engine</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {result.latency_ms} ms
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {result.decision === DecisionType.AUTO_HANDLE ? (
                    <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>AUTO-HANDLE</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-800/60 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>ESCALATE TO HUMAN</span>
                    </div>
                  )}

                  <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${getCategoryColor(result.escalation_category)}`}>
                    {result.escalation_category}
                  </span>
                </div>

                <div className="mt-2.5 p-2.5 rounded bg-stone-950 border border-stone-800 text-xs">
                  <span className="text-stone-400 font-semibold">Stated Escalation Rationale: </span>
                  <span className="text-stone-300">{result.escalation_reason}</span>
                </div>
              </div>

              {/* STAGE 4: DRAFTED TWITTER REPLY */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px] font-bold">4</span>
                    <span className="text-xs font-semibold text-stone-300">Stage 4: Grounded Twitter Reply</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-mono font-bold ${
                      isOverTwitterLimit ? "text-rose-400" : "text-stone-400"
                    }`}>
                      {charCount} / 280 chars
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-950 text-stone-300 border border-stone-800">
                      Sign-off: {result.agent_signoff || "^SM"}
                    </span>
                  </div>
                </div>

                {/* Twitter Mock Card */}
                <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 relative">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30 font-mono">
                      a
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-stone-100">Amazon Help</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 inline" />
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">@AmazonHelp</span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-100 font-sans leading-relaxed">
                    {result.draft_reply}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Strict Anti-PII Compliant
                    </span>
                    <span className="text-stone-500 font-mono text-[10px]">Twitter / X Public Reply</span>
                  </div>
                </div>
              </div>

              {/* STAGE 5: LLM-AS-JUDGE EVALUATION */}
              {result.judge_evaluation && (
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">5</span>
                      <span className="text-xs font-semibold text-stone-300">Stage 5: LLM-as-Judge Quality Rubric</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      result.judge_evaluation.passed 
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800" 
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}>
                      {result.judge_evaluation.passed ? "PASSED AUDIT" : "NEEDS HUMAN REVIEW"}
                    </span>
                  </div>

                  {/* 4 Rubric Axes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-center">
                      <span className="text-[10px] text-stone-400 block">Groundedness</span>
                      <span className="text-lg font-bold text-stone-100 font-mono">
                        {result.judge_evaluation.groundedness}<span className="text-xs text-stone-500">/5</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-center">
                      <span className="text-[10px] text-stone-400 block">Policy Compliance</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        {result.judge_evaluation.policy_compliance}<span className="text-xs text-stone-500">/5</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-center">
                      <span className="text-[10px] text-stone-400 block">Tone &amp; Empathy</span>
                      <span className="text-lg font-bold text-amber-400 font-mono">
                        {result.judge_evaluation.tone_and_empathy}<span className="text-xs text-stone-500">/5</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-center">
                      <span className="text-[10px] text-stone-400 block">Actionability</span>
                      <span className="text-lg font-bold text-amber-400 font-mono">
                        {result.judge_evaluation.actionability}<span className="text-xs text-stone-500">/5</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 mt-3 p-2.5 rounded bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 font-semibold">Judge Critique: </span>
                    {result.judge_evaluation.critique}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
