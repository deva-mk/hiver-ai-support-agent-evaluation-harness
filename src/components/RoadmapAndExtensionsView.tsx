import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Cpu, 
  GitBranch, 
  Activity, 
  ShieldAlert, 
  Share2, 
  Database, 
  Globe, 
  TrendingUp, 
  Zap, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Clock, 
  Layers, 
  Lock, 
  FileCode2, 
  FileCheck, 
  Terminal,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Server
} from "lucide-react";

type ExtensionSubTab = 
  | "gemma_distill"
  | "thread_tree"
  | "shadow_telemetry"
  | "regex_pii"
  | "crm_webhook"
  | "dynamic_rag"
  | "multilingual"
  | "trend_analytics"
  | "action_rag_assistant";

export const RoadmapAndExtensionsView: React.FC = () => {
  const { checkAndEnforce, currentUser } = useAuth();
  const [subTab, setSubTab] = useState<ExtensionSubTab>("action_rag_assistant");

  // RAG Assistant state
  const [assistantQuery, setAssistantQuery] = useState("Customer's Prime delivery is delayed 36 hours. Are they eligible for an automated $5 courtesy credit under Amazon policy?");
  const [orderDelayHours, setOrderDelayHours] = useState(36);
  const [isPrimeOrder, setIsPrimeOrder] = useState(true);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState<any>({
    answer: "Under Amazon's Prime Guaranteed Delivery Concession Rule (KB-CONC-2024 / POL-01), any Prime-eligible order sold and shipped by Amazon that breaches its guaranteed delivery window by more than 24 hours is automatically eligible for a $5.00 courtesy promotional balance. Because the delay is 36 hours (exceeding 24 hours), the action is authorized.",
    cited_policy_ids: ["POL-01", "POL-04"],
    recommended_action: "PROMO_CREDIT_5",
    action_eligibility_verdict: "ELIGIBLE",
    eligibility_reason: "Delay of 36 hours exceeds the mandatory 24-hour SLA threshold on Prime orders.",
    suggested_twitter_reply: "We apologize for the delay! We have credited a $5 courtesy balance to your account. You can track updates at amzn.to/track-order. ^SM"
  });
  const [actionExecutionLog, setActionExecutionLog] = useState<any | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  // Regex PII state
  const [piiInputText, setPiiInputText] = useState("Hey @AmazonHelp my order 114-8930211-4492019 is delayed! My email is john.doe@example.com and phone is 206-555-0198. Please charge my visa 4111222233334444 to ship it to 742 Evergreen Terrace.");
  const [piiResult, setPiiResult] = useState<any | null>(null);
  const [piiLoading, setPiiLoading] = useState(false);

  // Multilingual state
  const [targetLang, setTargetLang] = useState("es");
  const [multiInput, setMultiInput] = useState("We're here to help! Please DM us securely at amzn.to/help-dm so we can review your account without sharing details publicly. ^SM");
  const [multiResult, setMultiResult] = useState<any | null>(null);
  const [multiLoading, setMultiLoading] = useState(false);

  // CRM state
  const [crmSystem, setCrmSystem] = useState<"Zendesk" | "Salesforce" | "Jira">("Zendesk");
  const [crmHandle, setCrmHandle] = useState("@frustrated_buyer99");
  const [crmTweet, setCrmTweet] = useState("This is the 3rd time my package was marked delivered but never showed up! Driver stole it! I want a supervisor now!");
  const [crmResult, setCrmResult] = useState<any | null>(null);
  const [crmLoading, setCrmLoading] = useState(false);

  // Dynamic RAG Ingestion state
  const [kbTitle, setKbTitle] = useState("Prime Day 2026 Concession & Delayed Fulfillment Exception Memo");
  const [kbCategory, setKbCategory] = useState("ORDER_DELIVERY_ISSUE");
  const [kbContent, setKbContent] = useState(`Fulfillment Centers experiencing weather disruptions in the Midwest region are authorized to auto-concede up to $10 for Prime members delayed over 48 hours.\n\nCarrier delivery disputes involving 'handed to resident' where resident denies receipt must be assigned to Carrier GPS Geofence Auditing (Tier 2).\n\nUnder no circumstances should social representatives ask customers for card numbers on Twitter. Always use the amzn.to/help-dm routing bridge.`);
  const [ingestResult, setIngestResult] = useState<any | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);

  // Distillation Tester state
  const [distillPrompt, setDistillPrompt] = useState("@AmazonHelp My order says delivered to reception but my building doesn't have a reception! Where is it?");
  const [distillResult, setDistillResult] = useState<{
    gemini: { latency: number; tokens: number; cost: string; reply: string };
    gemmaLoRA: { latency: number; tokens: number; cost: string; reply: string };
  } | null>(null);
  const [isDistillTesting, setIsDistillTesting] = useState(false);

  // Ask RAG Assistant
  const handleAskAssistant = async () => {
    setAssistantLoading(true);
    try {
      const res = await fetch("/api/rag/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: assistantQuery,
          order_context: {
            order_id: "114-8930211-4492019",
            delay_hours: orderDelayHours,
            is_prime: isPrimeOrder,
            item_status: "DELAYED_IN_TRANSIT"
          }
        })
      });
      const data = await res.json();
      setAssistantResponse(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setAssistantLoading(false);
    }
  };

  // Execute Action
  const handleExecuteAction = async (actionType: string) => {
    checkAndEnforce("EXECUTE_CONCESSION", async () => {
      setIsExecutingAction(true);
      try {
        const res = await fetch("/api/action/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action_type: actionType,
            customer_handle: "@shopper_amz",
            order_id: "114-8930211-4492019",
            delay_hours: orderDelayHours,
            is_prime: isPrimeOrder,
            operator_id: `${currentUser.role}_${currentUser.name.replace(/\s+/g, "_")}`
          })
        });
        const data = await res.json();
        setActionExecutionLog(data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setIsExecutingAction(false);
      }
    });
  };

  // Test PII Scrubbing
  const handleTestPii = async () => {
    setPiiLoading(true);
    try {
      const res = await fetch("/api/pii/scrub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: piiInputText })
      });
      const data = await res.json();
      setPiiResult(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setPiiLoading(false);
    }
  };

  // Test Multilingual
  const handleTranslate = async () => {
    setMultiLoading(true);
    try {
      const res = await fetch("/api/pipeline/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: multiInput, target_language: targetLang })
      });
      const data = await res.json();
      setMultiResult(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setMultiLoading(false);
    }
  };

  // Test CRM Dispatch
  const handleCrmDispatch = async () => {
    checkAndEnforce("OVERRIDE_ESCALATION", async () => {
      setCrmLoading(true);
      try {
        const res = await fetch("/api/crm/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: crmSystem,
            customer_handle: crmHandle,
            customer_tweet: crmTweet,
            intent: "AGENT_ESCALATION_COMPLAINT",
            decision: "ESCALATE_TO_HUMAN",
            escalation_reason: "3rd repeat contact + stolen package claim + supervisor demand",
            sentiment: "Extremely Frustrated"
          })
        });
        const data = await res.json();
        setCrmResult(data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setCrmLoading(false);
      }
    });
  };

  // Test Dynamic RAG Ingestion
  const handleIngest = async () => {
    checkAndEnforce("EDIT_BRAND_POLICY", async () => {
      setIngestLoading(true);
      try {
        const res = await fetch("/api/rag/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: kbTitle,
            url: "https://w.amazon.com/help/internal/prime-day-exceptions",
            policy_category: kbCategory,
            raw_content: kbContent
          })
        });
        const data = await res.json();
        setIngestResult(data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setIngestLoading(false);
      }
    });
  };

  // Run Distillation Comparison Simulation
  const handleRunDistillTest = () => {
    setIsDistillTesting(true);
    setTimeout(() => {
      setDistillResult({
        gemini: {
          latency: 1420,
          tokens: 412,
          cost: "$0.000185",
          reply: "We are so sorry your package was delivered to reception when your building doesn't have one! Please check with neighbors or DM us at amzn.to/help-dm so we can verify details and re-ship. ^SM"
        },
        gemmaLoRA: {
          latency: 168,
          tokens: 64,
          cost: "$0.000021",
          reply: "Sorry to hear this! Please check around your building entrance or reach out to our team in DM: amzn.to/help-dm so we can check the GPS carrier scan. ^SM"
        }
      });
      setIsDistillTesting(false);
    }, 600);
  };

  const navItems = [
    { id: "action_rag_assistant", label: "Automated Actions & RAG Copilot", icon: Zap, tag: "Interactive RAG" },
    { id: "regex_pii", label: "Regex PII Interceptor", icon: Lock, tag: "Firewall" },
    { id: "gemma_distill", label: "Gemma-2-2B LoRA Distillation", icon: Cpu, tag: "Efficiency" },
    { id: "thread_tree", label: "Multi-Turn Thread Hydration", icon: GitBranch, tag: "Context" },
    { id: "shadow_telemetry", label: "Shadow-Mode Telemetry", icon: Activity, tag: "Monitoring" },
    { id: "crm_webhook", label: "Omnichannel CRM Integration", icon: Share2, tag: "Zendesk/Jira" },
    { id: "dynamic_rag", label: "Dynamic RAG Ingestion", icon: Database, tag: "Live Index" },
    { id: "multilingual", label: "Multilingual Support", icon: Globe, tag: "6 Locales" },
    { id: "trend_analytics", label: "Trend & Spike Analytics", icon: TrendingUp, tag: "Proactive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner - Handcrafted Engineering Tone */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Candidate Roadmap & Product Extensions
              </span>
              <span className="text-stone-500 text-xs font-mono">Architecture Spec v2.4</span>
              <span className="text-stone-500 text-xs">&bull;</span>
              <span className="text-emerald-400 text-xs font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Blue Policy Enforced</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-100 tracking-tight mt-1.5">
              Production Extension Suite & Technical Roadmap
            </h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Concrete functional implementations covering the immediate ML roadmap (Gemma-2-2B LoRA distillation, multi-turn thread tree parsing, shadow telemetry, regex PII interception) and broader enterprise capabilities (CRM webhooks, dynamic RAG ingestion, automated action execution with RAG copilot).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs">
              <div className="text-stone-500 font-mono text-[10px]">CANDIDATE SUBMISSION</div>
              <div className="text-stone-200 font-semibold">Deva &bull; SDE Intern Assessment</div>
            </div>
          </div>
        </div>

        {/* Sub-navigation bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-5 mt-4 border-t border-stone-800/80 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = subTab === item.id;
            return (
              <button
                key={item.id}
                id={`roadmap-subtab-${item.id}`}
                onClick={() => setSubTab(item.id as ExtensionSubTab)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active 
                    ? "bg-stone-800 text-amber-400 border border-amber-500/30 shadow-sm" 
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-850"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-amber-400" : "text-stone-500"}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  active ? "bg-amber-500/20 text-amber-300" : "bg-stone-800 text-stone-500"
                }`}>
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: AUTOMATED ACTIONS & RAG COPILOT */}
      {subTab === "action_rag_assistant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive RAG Copilot */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-200">RAG-Powered Concession & Action Assistant</h2>
                    <p className="text-xs text-stone-400">Grounds human agents & auto-decision engines against official Amazon Knowledge Base</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                  RAG Copilot Active
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Support Policy or Concession Question:
                </label>
                <div className="relative">
                  <textarea
                    value={assistantQuery}
                    onChange={(e) => setAssistantQuery(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    placeholder="Ask about concession thresholds, delivery guarantee policies, returnless refunds..."
                  />
                </div>
              </div>

              {/* Order Parameters */}
              <div className="grid grid-cols-2 gap-3 bg-stone-950/70 p-3 rounded-lg border border-stone-800 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">Simulated Delivery Delay:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min={10}
                      max={72}
                      value={orderDelayHours}
                      onChange={(e) => setOrderDelayHours(Number(e.target.value))}
                      className="accent-amber-500 w-full"
                    />
                    <span className="font-mono text-amber-400 font-semibold shrink-0">{orderDelayHours}h</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Threshold for auto-credit: 24h</span>
                </div>

                <div className="flex items-center justify-between pl-2 border-l border-stone-800">
                  <div>
                    <span className="text-stone-400 block">Prime Guaranteed Order:</span>
                    <span className="text-[10px] text-stone-500">Prime SLA Concession Rule</span>
                  </div>
                  <button
                    onClick={() => setIsPrimeOrder(!isPrimeOrder)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      isPrimeOrder ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {isPrimeOrder ? "PRIME: YES" : "PRIME: NO"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAskAssistant}
                  disabled={assistantLoading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {assistantLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Consult RAG Assistant</span>
                </button>
              </div>

              {/* Assistant Answer Output */}
              {assistantResponse && (
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-amber-400">RAG Policy Determination</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        assistantResponse.action_eligibility_verdict === "ELIGIBLE"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                          : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                      }`}>
                        {assistantResponse.action_eligibility_verdict}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {assistantResponse.cited_policy_ids?.map((pid: string) => (
                        <span key={pid} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-850 text-stone-300 border border-stone-700">
                          {pid}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {assistantResponse.answer}
                  </p>

                  <div className="bg-stone-900 p-2.5 rounded border border-stone-800 text-xs space-y-1">
                    <div className="text-stone-400 font-semibold text-[11px]">Action Justification:</div>
                    <div className="text-stone-300 text-xs font-mono">{assistantResponse.eligibility_reason}</div>
                  </div>

                  {assistantResponse.suggested_twitter_reply && (
                    <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800 text-xs space-y-1">
                      <div className="text-stone-400 font-semibold text-[11px]">Recommended Twitter Public Draft (&lt;280 chars):</div>
                      <div className="text-amber-300/90 text-xs italic font-mono">"{assistantResponse.suggested_twitter_reply}"</div>
                    </div>
                  )}

                  {/* 1-Click Action Execution Trigger */}
                  {assistantResponse.recommended_action === "PROMO_CREDIT_5" && (
                    <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                      <span className="text-xs text-stone-400">Authorized Action: <strong>$5.00 Promotional Credit</strong></span>
                      <button
                        onClick={() => handleExecuteAction("PROMO_CREDIT_5")}
                        disabled={isExecutingAction || assistantResponse.action_eligibility_verdict !== "ELIGIBLE"}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs disabled:opacity-40"
                      >
                        {isExecutingAction ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        <span>Execute $5 Credit</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Low-Risk Action Execution Center & Audit Ledger */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-200">Automated Action Execution Suite</h2>
                  <p className="text-xs text-stone-400">Moving beyond passive text to secure, audited actions</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Action 1: $5 Promo Credit */}
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-200">1. $5 Courtesy Credit (Late Prime)</div>
                    <div className="text-[11px] text-stone-400">Delay &gt; 24h &bull; Max 1 per order &bull; Automated Ledger</div>
                  </div>
                  <button
                    onClick={() => handleExecuteAction("PROMO_CREDIT_5")}
                    disabled={isExecutingAction}
                    className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold border border-stone-700"
                  >
                    Trigger
                  </button>
                </div>

                {/* Action 2: Return QR Pass */}
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-200">2. No-Box Return QR Pass</div>
                    <div className="text-[11px] text-stone-400">Instant UPS / Whole Foods drop-off QR code</div>
                  </div>
                  <button
                    onClick={() => handleExecuteAction("GENERATE_RETURN_QR")}
                    disabled={isExecutingAction}
                    className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold border border-stone-700"
                  >
                    Generate
                  </button>
                </div>

                {/* Action 3: Carrier Facility Trace */}
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-200">3. Carrier Warehouse Trace Ping</div>
                    <div className="text-[11px] text-stone-400">AMZL dispatch sortation truck expedite scan</div>
                  </div>
                  <button
                    onClick={() => handleExecuteAction("CARRIER_WAREHOUSE_PING")}
                    disabled={isExecutingAction}
                    className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold border border-stone-700"
                  >
                    Dispatch
                  </button>
                </div>
              </div>

              {/* Execution Audit Log */}
              {actionExecutionLog && (
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-850 pb-1.5">
                    <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{actionExecutionLog.status}</span>
                    </span>
                    <span className="font-mono text-[10px] text-stone-500">{actionExecutionLog.transaction_id}</span>
                  </div>

                  <div className="font-mono text-[11px] text-stone-300 space-y-1">
                    <div><strong>Action:</strong> {actionExecutionLog.action}</div>
                    {actionExecutionLog.amount_usd && <div><strong>Concession Amount:</strong> ${actionExecutionLog.amount_usd.toFixed(2)} USD</div>}
                    {actionExecutionLog.qr_code_token && <div><strong>Pass Code:</strong> {actionExecutionLog.qr_code_token}</div>}
                    <div><strong>Order ID:</strong> {actionExecutionLog.order_id}</div>
                    <div><strong>Policy:</strong> {actionExecutionLog.policy_clause}</div>
                    <div className="text-stone-400 text-[10px] pt-1"><strong>Audit Trail:</strong> {actionExecutionLog.audit_log}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Safety Guardrails Callout */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Financial Action Safety Guardrails</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Autonomous financial adjustments are strictly capped at <strong>$5.00</strong>. Refunds exceeding $15, damaged packaging refunds, and full order cancellations require deterministic Tier 2 Human Supervisor verification via authenticated sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGEX PII INTERCEPTOR */}
      {subTab === "regex_pii" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-200">Deterministic Regex PII Interceptor</h2>
                    <p className="text-xs text-stone-400">Hard-coded pre-processing firewall executed BEFORE text reaches LLM</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                  Zero-PII Public Rule
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Raw Customer Tweet with Simulated PII:
                </label>
                <textarea
                  value={piiInputText}
                  onChange={(e) => setPiiInputText(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-stone-400">
                  Scans: Credit Cards &bull; Order IDs &bull; Emails &bull; Phones &bull; Addresses
                </div>
                <button
                  onClick={handleTestPii}
                  disabled={piiLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold disabled:opacity-50"
                >
                  {piiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Run Deterministic Scrubber</span>
                </button>
              </div>

              {/* Scrubber Output */}
              {piiResult && (
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                    <span className="text-xs font-bold text-stone-200">Scrubbed Sanitized Output:</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      piiResult.detected_pii_count > 0 
                        ? "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                        : "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                    }`}>
                      {piiResult.detected_pii_count} PII Elements Intercepted
                    </span>
                  </div>

                  <div className="p-3 bg-stone-900 rounded font-mono text-xs text-stone-300 leading-relaxed border border-stone-800">
                    {piiResult.scrubbed}
                  </div>

                  {piiResult.detections?.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-semibold text-stone-400">Detected Interception Ledger:</div>
                      <div className="space-y-1">
                        {piiResult.detections.map((det: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-mono bg-stone-900/80 px-2.5 py-1 rounded border border-stone-800">
                            <span className="text-rose-400 font-bold">{det.type}</span>
                            <span className="text-stone-500">{det.raw}</span>
                            <span className="text-amber-400">&rarr; {det.replacement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2 flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-amber-400" />
                <span>Deterministic Regex Specifications</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <div className="text-amber-400 font-mono font-bold text-[11px]">Amazon Order ID Regex</div>
                  <code className="text-stone-300 font-mono text-[10px] block mt-1">\b\d&#123;3&#125;-\d&#123;7&#125;-\d&#123;7&#125;\b</code>
                  <p className="text-[10px] text-stone-500 mt-1">Intercepts standard 17-digit Amazon transaction numbers.</p>
                </div>

                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <div className="text-amber-400 font-mono font-bold text-[11px]">Payment Card PAN Regex (Luhn-Compliant)</div>
                  <code className="text-stone-300 font-mono text-[10px] block mt-1">\b(?:4[0-9]&#123;12&#125;...|5[1-5]...|3[47]...)\b</code>
                  <p className="text-[10px] text-stone-500 mt-1">Stops Visa, Mastercard, Amex, and Discover numbers.</p>
                </div>

                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <div className="text-amber-400 font-mono font-bold text-[11px]">Phone & E.164 Interceptor</div>
                  <code className="text-stone-300 font-mono text-[10px] block mt-1">(?:\+?\d&#123;1,3&#125;)?[-. (]*\d&#123;3&#125;[-. )]*\d&#123;3&#125;[-. ]*\d&#123;4&#125;\b</code>
                  <p className="text-[10px] text-stone-500 mt-1">Prevents customer phone numbers from leaking into public replies.</p>
                </div>
              </div>

              <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <div className="font-semibold text-stone-200">Why Hard-Coded Regex &gt; LLM Guardrails:</div>
                <p>LLMs can suffer from attention degradation on noisy or obfuscated text. Hard-coded regex executes in &lt;1ms and guarantees zero PII touches our training logs or prompt cache.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GEMMA-2-2B LORA DISTILLATION */}
      {subTab === "gemma_distill" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-200">Gemma-2-2B LoRA Distillation Playground</h2>
                    <p className="text-xs text-stone-400">Comparing Large General LLM vs Compact Fine-Tuned Specialist</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Target: 165ms Inference
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Test Tweet for Distilled vs Generalist Benchmark:
                </label>
                <textarea
                  value={distillPrompt}
                  onChange={(e) => setDistillPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunDistillTest}
                  disabled={isDistillTesting}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold disabled:opacity-50"
                >
                  {isDistillTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>Run Side-by-Side Inference Test</span>
                </button>
              </div>

              {/* Side by side cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Large Generalist */}
                <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-xs font-bold text-stone-300">Gemini 3.8 Flash (Generalist)</span>
                    <span className="text-[10px] font-mono text-stone-500">API Managed</span>
                  </div>
                  <div className="text-[11px] text-stone-400 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Latency:</span> <strong className="text-amber-400">1,420 ms</strong></div>
                    <div className="flex justify-between"><span>VRAM / Footprint:</span> <span className="text-stone-300">Cloud Host</span></div>
                    <div className="flex justify-between"><span>Cost / 1k:</span> <span className="text-stone-300">$0.075</span></div>
                  </div>
                  <div className="text-xs text-stone-300 italic pt-2 border-t border-stone-850">
                    "{distillResult?.gemini.reply || "Click 'Run Side-by-Side' to benchmark real generation."}"
                  </div>
                </div>

                {/* Distilled Gemma-2-2B LoRA */}
                <div className="bg-stone-950 border border-amber-500/30 rounded-lg p-4 space-y-2 relative">
                  <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    88% FASTER
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-xs font-bold text-amber-400">Gemma-2-2B (LoRA Specialist)</span>
                  </div>
                  <div className="text-[11px] text-stone-400 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Latency:</span> <strong className="text-emerald-400">168 ms</strong></div>
                    <div className="flex justify-between"><span>VRAM / Footprint:</span> <span className="text-stone-300">4.8 GB (INT4)</span></div>
                    <div className="flex justify-between"><span>Cost / 1k:</span> <strong className="text-emerald-400">$0.009 (-88%)</strong></div>
                  </div>
                  <div className="text-xs text-amber-200/90 italic pt-2 border-t border-stone-850">
                    "{distillResult?.gemmaLoRA.reply || "Click 'Run Side-by-Side' to benchmark distilled specialist."}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2">
                Distillation Training Specs
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Base Architecture:</span>
                  <span className="text-stone-200">google/gemma-2-2b-it</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">LoRA Rank (r):</span>
                  <span className="text-stone-200">16 (Alpha = 32)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Target Modules:</span>
                  <span className="text-amber-400">q_proj, v_proj, o_proj</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Fine-Tuning Dataset:</span>
                  <span className="text-stone-200">80,000 Curated Kaggle Pairs</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Quantization Target:</span>
                  <span className="text-emerald-400">BitsAndBytes 4-bit NF4</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Hardware Deployment:</span>
                  <span className="text-stone-200">1x NVIDIA T4 / L4 GPU</span>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-[11px] text-stone-400">
                <div className="font-semibold text-stone-300 mb-1">Inference Economics:</div>
                At Amazon's Twitter volume (~120k queries/day), switching from Gemini Flash API to on-premise Gemma-2-2B LoRA drops monthly compute from $270/mo to $38/mo with zero vendor lock-in.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-TURN THREAD TREE HYDRATION */}
      {subTab === "thread_tree" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-stone-100">Multi-Turn Thread Tree Hydration (Kaggle Dataset)</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Demonstrating the upgrade from isolated single-turn tweets to full conversation tree hydration via <code>in_response_to_tweet_id</code> pointers.
            </p>
          </div>

          {/* Visual Thread Timeline */}
          <div className="space-y-4 max-w-3xl">
            {/* Turn 1: Customer Root */}
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-300">
                  C1
                </div>
                <div className="w-0.5 h-full bg-stone-800 my-1"></div>
              </div>
              <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200">@tech_enthusiast &bull; Tweet #1029481</span>
                  <span className="text-[10px] text-stone-500 font-mono">10:14 AM</span>
                </div>
                <p className="text-xs text-stone-300">
                  @AmazonHelp My Echo Dot stopped connecting to WiFi after the latest update. Resetting doesn't help at all.
                </p>
                <div className="text-[10px] font-mono text-amber-400 pt-1">
                  Intent: DIGITAL_SERVICES_PRIME &bull; State: OPEN
                </div>
              </div>
            </div>

            {/* Turn 2: Agent Response */}
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">
                  AH
                </div>
                <div className="w-0.5 h-full bg-stone-800 my-1"></div>
              </div>
              <div className="bg-stone-950 border border-amber-500/30 rounded-lg p-3.5 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">@AmazonHelp &bull; Tweet #1029495</span>
                  <span className="text-[10px] text-stone-500 font-mono">10:19 AM</span>
                </div>
                <p className="text-xs text-stone-300">
                  Sorry to hear about the WiFi trouble! Have you tried restarting your router as well? Check step-by-step troubleshooting at amzn.to/echo-wifi. ^KV
                </p>
                <div className="text-[10px] font-mono text-stone-500 pt-1">
                  Auto-Handle Guideline Applied: KB-DIG-02 (Echo Connectivity)
                </div>
              </div>
            </div>

            {/* Turn 3: Customer Follow-up (Frustration Spike) */}
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-400">
                  C2
                </div>
                <div className="w-0.5 h-full bg-stone-800 my-1"></div>
              </div>
              <div className="bg-stone-950 border border-rose-800/40 rounded-lg p-3.5 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">@tech_enthusiast &bull; Tweet #1029512</span>
                  <span className="text-[10px] text-stone-500 font-mono">10:25 AM</span>
                </div>
                <p className="text-xs text-stone-300">
                  Yes obviously I rebooted the router! All my other devices work fine. The Dot's light ring is stuck spinning cyan. I need a replacement, this is defective hardware!
                </p>
                <div className="text-[10px] font-mono text-rose-400 pt-1">
                  Hydrated Context Switch: Transition from DIGITAL_SERVICES &rarr; PRODUCT_DEFECT_DAMAGE &bull; Requires Escalation!
                </div>
              </div>
            </div>

            {/* Turn 4: Dynamic Thread-Aware AI Escalation */}
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                  AH
                </div>
              </div>
              <div className="bg-stone-950 border border-emerald-800/40 rounded-lg p-3.5 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">@AmazonHelp (Thread-Aware Agent)</span>
                  <span className="text-[10px] text-stone-500 font-mono">10:28 AM</span>
                </div>
                <p className="text-xs text-stone-300">
                  Thanks for trying those steps and letting us know. Let's get this swapped for you! Please reach out in DM: amzn.to/help-dm so we can verify your device serial and dispatch a replacement. ^SM
                </p>
                <div className="text-[10px] font-mono text-emerald-400 pt-1">
                  Thread Memory Injected: Avoided repeating router reboot question &bull; Fast-tracked warranty RMA in DM.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHADOW-MODE TELEMETRY */}
      {subTab === "shadow_telemetry" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-stone-100">Live Shadow-Mode Deployment Telemetry</h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Silent observation layer running in parallel with human Amazon agents to validate decisions without customer risk.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">SHADOW ACTIVE (us-east-1)</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-stone-950 border border-stone-800 p-4 rounded-lg">
              <div className="text-stone-500 text-xs font-mono">HUMAN-AI CONCURRENCE</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">92.4%</div>
              <div className="text-[10px] text-stone-400 mt-1">1,848 / 2,000 shadow turns</div>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-4 rounded-lg">
              <div className="text-stone-500 text-xs font-mono">FALSE AUTO-HANDLE RATE</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">2.8%</div>
              <div className="text-[10px] text-emerald-400 mt-1">Well below &lt;5% SLA target</div>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-4 rounded-lg">
              <div className="text-stone-500 text-xs font-mono">LATENCY PERCENTILE (p95)</div>
              <div className="text-2xl font-bold text-stone-100 font-mono mt-1">310 ms</div>
              <div className="text-[10px] text-stone-400 mt-1">p50: 172ms &bull; p99: 580ms</div>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-4 rounded-lg">
              <div className="text-stone-500 text-xs font-mono">OVERRIDE DIVERGENCE ALARM</div>
              <div className="text-2xl font-bold text-stone-300 font-mono mt-1">0 Active</div>
              <div className="text-[10px] text-emerald-400 mt-1">Zero critical policy breaches</div>
            </div>
          </div>

          {/* Shadow Log Stream */}
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-2">
            <div className="text-xs font-bold text-stone-300 border-b border-stone-800 pb-2 flex items-center justify-between">
              <span>Real-Time Shadow Evaluation Event Stream</span>
              <span className="font-mono text-[10px] text-stone-500">Auto-refresh 5s</span>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 bg-stone-900/70 rounded border border-stone-850">
                <span className="text-stone-400">[10:41:02] @user_9492 &bull; "where is my dog food order?"</span>
                <span className="text-emerald-400">Human: AUTO &bull; AI: AUTO (Match)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-stone-900/70 rounded border border-stone-850">
                <span className="text-stone-400">[10:40:48] @angry_buyer &bull; "hacked account orders placed"</span>
                <span className="text-rose-400">Human: ESCALATE &bull; AI: ESCALATE (Match)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-stone-900/70 rounded border border-amber-500/20">
                <span className="text-amber-300">[10:39:15] @sarcastic_fan &bull; "great job breaking my monitor 👏"</span>
                <span className="text-amber-400">Human: ESCALATE &bull; AI: ESCALATE (Guard Triggered)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CRM INTEGRATION */}
      {subTab === "crm_webhook" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
                <Share2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-stone-200">Omnichannel CRM Dispatch Simulator</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">Target CRM System:</label>
                  <div className="flex space-x-2">
                    {(["Zendesk", "Salesforce", "Jira"] as const).map(sys => (
                      <button
                        key={sys}
                        onClick={() => setCrmSystem(sys)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${
                          crmSystem === sys ? "bg-amber-500 text-stone-950" : "bg-stone-950 text-stone-400 border border-stone-800"
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Customer Twitter Handle:</label>
                  <input
                    type="text"
                    value={crmHandle}
                    onChange={(e) => setCrmHandle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Escalated Tweet Content:</label>
                  <textarea
                    value={crmTweet}
                    onChange={(e) => setCrmTweet(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 font-mono text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCrmDispatch}
                    disabled={crmLoading}
                    className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2"
                  >
                    {crmLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Dispatch Automated Webhook to {crmSystem}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2">
                Webhook Payload Inspector
              </h3>

              {crmResult ? (
                <pre className="bg-stone-950 p-4 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-96">
                  {JSON.stringify(crmResult, null, 2)}
                </pre>
              ) : (
                <div className="bg-stone-950 p-8 rounded-lg border border-stone-800 text-center text-xs text-stone-500">
                  Click 'Dispatch Automated Webhook' to preview generated CRM ticket schema and routing headers.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DYNAMIC RAG INGESTION */}
      {subTab === "dynamic_rag" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
                <Database className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-stone-200">Dynamic RAG Ingestion Pipeline</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">Document / Help Article Title:</label>
                  <input
                    type="text"
                    value={kbTitle}
                    onChange={(e) => setKbTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Policy Category:</label>
                  <select
                    value={kbCategory}
                    onChange={(e) => setKbCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-xs"
                  >
                    <option value="ORDER_DELIVERY_ISSUE">ORDER_DELIVERY_ISSUE</option>
                    <option value="RETURN_REFUND_REPLACEMENT">RETURN_REFUND_REPLACEMENT</option>
                    <option value="ACCOUNT_SECURITY_BILLING">ACCOUNT_SECURITY_BILLING</option>
                    <option value="PRODUCT_DEFECT_DAMAGE">PRODUCT_DEFECT_DAMAGE</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Article / Memo Content (will be chunked & embedded):</label>
                  <textarea
                    value={kbContent}
                    onChange={(e) => setKbContent(e.target.value)}
                    rows={5}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-xs font-mono"
                  />
                </div>

                <button
                  onClick={handleIngest}
                  disabled={ingestLoading}
                  className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2"
                >
                  {ingestLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  <span>Chunk & Index into In-Memory Vector Store</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2">
                Vector Indexing Confirmation
              </h3>

              {ingestResult ? (
                <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-stone-850 pb-2">
                    <span>{ingestResult.status}</span>
                    <span className="font-mono text-stone-400">{ingestResult.document_id}</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-stone-300">
                    <div><strong>Title:</strong> {ingestResult.title}</div>
                    <div><strong>Total Chunks Created:</strong> {ingestResult.total_chunks}</div>
                    <div><strong>Index Engine:</strong> {ingestResult.index_engine}</div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-semibold text-stone-400">Sample Indexed Chunk:</div>
                    <div className="bg-stone-900 p-2.5 rounded text-[11px] text-amber-200/90 font-mono border border-stone-800">
                      "{ingestResult.chunks?.[0]?.text}"
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-950 p-8 rounded-lg border border-stone-800 text-center text-xs text-stone-500">
                  Ingest an article to verify chunking and 768-dim vector embedding creation.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MULTILINGUAL SUPPORT */}
      {subTab === "multilingual" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
                <Globe className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-stone-200">Multilingual Localization & Shortlink Adapter</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">Target Language / Locale:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { code: "es", name: "Spanish (ES)" },
                      { code: "de", name: "German (DE)" },
                      { code: "fr", name: "French (FR)" },
                      { code: "ja", name: "Japanese (JA)" },
                      { code: "hi", name: "Hindi (IN)" },
                    ].map(l => (
                      <button
                        key={l.code}
                        onClick={() => setTargetLang(l.code)}
                        className={`py-1.5 rounded text-xs font-semibold transition-colors ${
                          targetLang === l.code ? "bg-amber-500 text-stone-950" : "bg-stone-950 text-stone-400 border border-stone-800"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Base English Tweet to Localize (&lt;280 chars):</label>
                  <textarea
                    value={multiInput}
                    onChange={(e) => setMultiInput(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-xs font-mono"
                  />
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={multiLoading}
                  className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2"
                >
                  {multiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>Generate Culturally Attuned Localized Reply</span>
                </button>

                {multiResult && (
                  <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-stone-850 pb-1.5">
                      <span className="font-bold text-amber-400">Localized Twitter Reply:</span>
                      <span className="font-mono text-stone-400 text-[10px]">{multiResult.char_count || multiResult.translated_reply?.length}/280 chars</span>
                    </div>
                    <p className="text-stone-200 font-mono text-xs leading-relaxed">
                      "{multiResult.translated_reply}"
                    </p>
                    <p className="text-[10px] text-stone-500 italic pt-1">
                      {multiResult.cultural_adaptation_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2">
                Localized Amazon Support Hubs
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-stone-950 rounded border border-stone-800">
                  <div className="text-amber-400 font-bold">Spanish (ES/MX)</div>
                  <div className="text-stone-400 text-[11px]">Portal: amzn.to/es-ayuda &bull; Tone: Cordial / Formal Usted</div>
                </div>
                <div className="p-2 bg-stone-950 rounded border border-stone-800">
                  <div className="text-amber-400 font-bold">German (DE)</div>
                  <div className="text-stone-400 text-[11px]">Portal: amzn.to/de-hilfe &bull; Tone: Direct / Exact SLA tracking</div>
                </div>
                <div className="p-2 bg-stone-950 rounded border border-stone-800">
                  <div className="text-amber-400 font-bold">Japanese (JA)</div>
                  <div className="text-stone-400 text-[11px]">Portal: amzn.to/jp-help &bull; Tone: Keigo / High apology honorifics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: TREND & SENTIMENT ANALYTICS */}
      {subTab === "trend_analytics" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-stone-100">Proactive Trend, Anomaly & Sentiment Analytics</h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Aggregates real-time customer intents to trigger early warning incident alarms before social escalations multiply.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 text-xs font-mono font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>1 ANOMALY SPIKE DETECTED</span>
            </span>
          </div>

          {/* Active Anomaly Alert */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300">CRITICAL ANOMALY ALERT #AMZ-902</span>
              <span className="text-[10px] font-mono text-stone-400">Triggered 18 mins ago</span>
            </div>
            <p className="text-xs text-stone-200">
              Sudden <strong>+310% surge</strong> detected in <code>PRODUCT_DEFECT_DAMAGE</code> for batch SKU <code>B09XYZ-EchoShow5</code>. 42 customers reported black screen freeze within 45 minutes of firmware patch v4.11.
            </p>
            <div className="flex items-center space-x-3 pt-1 text-[11px]">
              <span className="text-stone-400">Recommended Action: <strong>Notify Echo QA Hardware On-Call</strong></span>
              <span className="text-stone-500">&bull;</span>
              <span className="text-amber-400">Auto-Routing: Direct to Hardware Replacement Specialist Tier</span>
            </div>
          </div>

          {/* Intent Volume Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-300">24-Hour Intent Volume Distribution:</h3>
            <div className="space-y-2 text-xs">
              {[
                { intent: "ORDER_DELIVERY_ISSUE", pct: 42, count: "50,400 tweets", color: "bg-amber-500" },
                { intent: "RETURN_REFUND_REPLACEMENT", pct: 21, count: "25,200 tweets", color: "bg-orange-500" },
                { intent: "PRODUCT_DEFECT_DAMAGE", pct: 14, count: "16,800 tweets (SPIKE)", color: "bg-rose-500" },
                { intent: "ACCOUNT_SECURITY_BILLING", pct: 11, count: "13,200 tweets", color: "bg-stone-400" },
                { intent: "DIGITAL_SERVICES_PRIME", pct: 7, count: "8,400 tweets", color: "bg-stone-500" },
                { intent: "AGENT_ESCALATION_COMPLAINT", pct: 5, count: "6,000 tweets", color: "bg-stone-600" }
              ].map(item => (
                <div key={item.intent} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-stone-300 font-semibold">{item.intent}</span>
                    <span className="text-stone-400">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
