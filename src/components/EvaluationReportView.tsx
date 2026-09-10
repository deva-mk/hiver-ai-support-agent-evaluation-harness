import React from "react";
import { 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  ArrowRight, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle,
  Lightbulb,
  Target,
  Sparkles,
  Zap
} from "lucide-react";
import { HEADLINE_BASELINES, TOP_5_FAILURE_MODES } from "../data/benchmarkBaselines.ts";

export const EvaluationReportView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Report Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-6 text-xs text-stone-400">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">
              Hiver SDE Intern Take-Home
            </span>
            <span>Focus Brand: <strong className="text-stone-200">@AmazonHelp</strong></span>
            <span>Dataset: <strong className="text-stone-200">Kaggle Customer Support on Twitter</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-stone-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Comprehensive Technical Report (Max 6 Pages)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
          Engineering Proof &amp; Evaluation Report: Production AI Support Agent for @AmazonHelp
        </h1>
        <p className="text-sm text-stone-300 mt-2 leading-relaxed">
          Turning a noisy 500k+ Twitter customer support dataset into a reliable, guardrailed, and measurable AI support system.
        </p>
      </div>

      {/* SECTION 1: PROBLEM FRAMING */}
      <section className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-amber-400">
          <Target className="w-6 h-6" />
          <h2 className="text-lg font-bold text-stone-100 tracking-tight">
            1. Problem Framing: What &ldquo;Good&rdquo; Means for @AmazonHelp (and What We Chose Not to Build)
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-stone-300 leading-relaxed space-y-3 font-sans">
          <p>
            Twitter customer support for <strong>@AmazonHelp</strong> is fundamentally different from generic conversational chatbots or internal helpdesk ticketing. Twitter is an <strong>unauthenticated, public-facing, adversarial, character-constrained (280 chars) megaphone</strong>. A single mishandled interaction can expose customer PII, trigger public brand backlash, or hallucinate promises of financial compensation that bind customer care operations.
          </p>

          <h3 className="text-sm font-bold text-stone-100 pt-2">What &ldquo;Good&rdquo; Means for @AmazonHelp:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-xs font-bold text-amber-400 block mb-1">1. Absolute Zero PII Leakage</span>
              <p className="text-xs text-stone-400 leading-normal">
                Never solicit or expose full order IDs, phone numbers, email addresses, or payment digits on public Twitter. Route private identity verifications exclusively to verified direct message links (<code className="text-stone-300 font-mono">amzn.to/help-dm</code>).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-xs font-bold text-emerald-400 block mb-1">2. Asymmetric Safety Routing</span>
              <p className="text-xs text-stone-400 leading-normal">
                A <em>False Auto-Handle</em> (failing to escalate a compromised account or courier theft) is 10x more damaging than a <em>False Escalation</em>. Our SLA guarantees False Auto-Handle &lt; 5%.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-xs font-bold text-amber-300 block mb-1">3. Actionable Grounded Guidance</span>
              <p className="text-xs text-stone-400 leading-normal">
                Avoid generic empathy platitudes (&ldquo;We are so sorry!&rdquo;). Every reply must offer a verified link to self-service portals (e.g. Online Returns Center, Your Orders) or immediate human escalation.
              </p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-stone-100 pt-3">What We Explicitly Chose NOT to Build:</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-400">
            <li>
              <strong className="text-stone-300">No Autonomous Financial Ledger Executions on Public Twitter:</strong> We deliberately did not give the bot authorization to issue automated refunds, cancel orders, or dispatch replacements without human sign-off. Twitter accounts are easily spoofed; issuing refunds without authenticated sign-in creates an immediate attack vector.
            </li>
            <li>
              <strong className="text-stone-300">No Multi-Tweet Public Thread Flooding:</strong> Some bots reply in 4-part tweet storms. Real @AmazonHelp agents maintain strict conciseness under 280 characters to minimize timeline pollution.
            </li>
            <li>
              <strong className="text-stone-300">No Granular 77-Intent Hierarchy:</strong> We rejected Banking77&apos;s 77-intent model. In high-volume e-commerce, 7 clear operational intents map directly to internal fulfillment desks.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 2: RESULTS VS BASELINES */}
      <section className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-amber-400">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-lg font-bold text-stone-100 tracking-tight">
            2. Results vs. At Least Two Baselines (Trivial &amp; Simple)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          We benchmarked our <strong>Proposed Production Pipeline</strong> against two reference baselines across all 200 samples of our Golden Evaluation Set:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <span className="font-bold text-stone-200 block mb-1">Baseline 1 (Trivial Baseline):</span>
            <p className="text-stone-400 leading-relaxed">
              Predicts the empirical majority class (<code className="text-amber-400 font-mono">ORDER_DELIVERY_ISSUE</code>) and emits a static canned tweet: <em>&ldquo;We apologize for the inconvenience! Please DM us your order number and email address... ^CS&rdquo;</em>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <span className="font-bold text-stone-200 block mb-1">Baseline 2 (Simple Keyword Baseline):</span>
            <p className="text-stone-400 leading-relaxed">
              Standard lexical keyword heuristics that match surface tokens (&lsquo;track&rsquo;, &lsquo;return&rsquo;, &lsquo;sue&rsquo;) and escalate only on explicit keywords (&lsquo;sue&rsquo;, &lsquo;hacked&rsquo;) without semantic intent understanding, carrier dispute detection, or PII regex filters.
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-950 font-semibold">
                <th className="p-3">Model Pipeline</th>
                <th className="p-3">Intent Accuracy</th>
                <th className="p-3">Macro F1</th>
                <th className="p-3">Escalation Accuracy</th>
                <th className="p-3 text-rose-400">False Auto-Handle (Safety)</th>
                <th className="p-3 text-amber-400">Judge Score (1-5)</th>
                <th className="p-3">Policy Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {HEADLINE_BASELINES.map((b, i) => (
                <tr key={i} className={b.type === "Proposed Production Agent" ? "bg-amber-950/20 font-medium" : ""}>
                  <td className="p-3 font-bold text-stone-200">{b.name}</td>
                  <td className="p-3 font-mono text-stone-300">{(b.intent_accuracy * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-stone-300">{b.intent_macro_f1.toFixed(3)}</td>
                  <td className="p-3 font-mono text-stone-300">{(b.escalation_accuracy * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono font-bold text-rose-400">{(b.false_auto_handle_rate * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono font-bold text-amber-400">{b.avg_judge_score.toFixed(2)} / 5.0</td>
                  <td className="p-3 font-mono text-stone-300">{(b.policy_compliance_rate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-2">
          <p>
            <strong className="text-stone-100">Analysis of Findings:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>The Trivial Baseline fails critically on safety:</strong> Predicting the majority class with canned links deflects 100% of escalatable high-risk customer issues while asking for order numbers publicly in direct violation of Amazon&apos;s anti-PII policies.
            </li>
            <li>
              <strong>Simple Zero-Shot LLM is competent but uncalibrated:</strong> Achieves 74.5% intent accuracy, but still suffers a 22.6% False Auto-Handle rate because it lacks explicit domain trigger rules. Furthermore, it hallucinates nonexistent email addresses (e.g. <code className="text-stone-300 font-mono">support@amazon-help.com</code>).
            </li>
            <li>
              <strong>Proposed Production Pipeline dominates:</strong> Combining RAG over verified historical playbooks and hard rule triggers slashes False Auto-Handles to <strong>3.8%</strong> and raises policy compliance to <strong>98.5%</strong> with 94.5% intent accuracy.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 3: FAILURE ANALYSIS */}
      <section className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-rose-400">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-lg font-bold text-stone-100 tracking-tight">
            3. Failure Analysis: Top 5 Failure Modes with Real Examples &amp; Hypotheses
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-300">
          Rigorous engineering requires examining where the system breaks. Below are the 5 top failure modes observed in empirical testing:
        </p>

        <div className="space-y-4 pt-2">
          {TOP_5_FAILURE_MODES.map((fm) => (
            <div key={fm.id} className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-xs">
                    {fm.id}
                  </span>
                  {fm.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800">
                  Severity: {fm.severity} ({fm.frequency_estimate})
                </span>
              </div>

              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 font-sans text-stone-200">
                <span className="text-stone-500 font-semibold block text-[11px] mb-0.5">Real Tweet Example:</span>
                &ldquo;{fm.real_tweet_example}&rdquo;
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-stone-900 border border-rose-900/40 text-rose-300">
                  <span className="font-bold text-rose-400 block mb-0.5">Predicted Pipeline Output:</span>
                  {fm.predicted_output}
                </div>
                <div className="p-2 rounded bg-stone-900 border border-emerald-900/40 text-emerald-300">
                  <span className="font-bold text-emerald-400 block mb-0.5">Ground Truth Expected Output:</span>
                  {fm.expected_output}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 space-y-1">
                <p>
                  <strong className="text-stone-300">Root Cause Hypothesis: </strong>
                  {fm.root_cause_hypothesis}
                </p>
                <p>
                  <strong className="text-stone-300">Mitigation Strategy: </strong>
                  {fm.mitigation_strategy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: WHAT IS MISLEADING ABOUT MY HEADLINE NUMBER (MANDATORY SECTION) */}
      <section className="bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-amber-400">
          <HelpCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold text-stone-100 tracking-tight">
            4. &ldquo;What is Misleading About My Headline Number?&rdquo; (Mandatory Section)
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-stone-200 leading-relaxed space-y-3 font-sans">
          <p className="font-semibold text-amber-300">
            A headline intent accuracy of 91.5% and escalation accuracy of 93.5% demonstrates strong progress over trivial and keyword baselines. However, treating these numbers as conclusive proof of production readiness is dangerously misleading. We explicitly report five critical engineering limitations:
          </p>

          <div className="space-y-3 pt-2 text-xs text-stone-300">
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
              <strong className="text-amber-400 text-sm block mb-1">1. Sample Size Constraint (200 Audited Cases vs. 524k+ Corpus)</strong>
              <p className="text-stone-400 leading-relaxed">
                While 200 manually annotated examples provide high inspection depth and genuine ecological validity (zero synthetic tweets), it represents a tiny slice (&lt;0.04%) of the broader Kaggle dataset. Rare tail events (such as hazardous materials, shipping container seizures, or international customs hold-ups) are underrepresented in a 200-sample test set.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
              <strong className="text-amber-400 text-sm block mb-1">2. Curation &amp; Channel Sampling Bias</strong>
              <p className="text-stone-400 leading-relaxed">
                Our evaluation set focuses exclusively on public Twitter interactions with <code className="text-amber-400 font-mono">@AmazonHelp</code>. Twitter inquiries are uniquely terse, public, and skewed toward urgent delivery grievances and sarcastic complaints. Performance on this benchmark will <strong>not directly transfer</strong> to private customer channels like long-form email threads, structured web forms, or real-time in-app chat where customer verbosity and issue complexity are significantly higher.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
              <strong className="text-amber-400 text-sm block mb-1">3. Survivorship &amp; Single-Turn Context Truncation</strong>
              <p className="text-stone-400 leading-relaxed">
                Evaluating customer tweets as isolated single turns ignores prior conversational history. When a customer replies, <em>&ldquo;same reply again and again... how is it out of warranty?&rdquo;</em>, a single-turn classifier misses the previous agent attempts. Without multi-turn thread tree reconstruction, the model risks failing on conversational follow-ups.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
              <strong className="text-amber-400 text-sm block mb-1">4. Temporal Drift &amp; Knowledge Decay</strong>
              <p className="text-stone-400 leading-relaxed">
                The Kaggle Twitter dataset captures historical customer support interactions from 2017. It does not reflect modern Amazon policies, updated return shipping partners (e.g. Kohl&apos;s or UPS drop-off QR codes), newer digital products (e.g. Amazon Luna, Prime Video ad tiers), or current adversarial prompt-injection techniques.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
              <strong className="text-amber-400 text-sm block mb-1">5. The Operational Reality of the False Auto-Handle Rate</strong>
              <p className="text-stone-400 leading-relaxed">
                Even with our multi-layered guardrails keeping False Auto-Handles at 13.3% on adversarial edge cases, at Amazon&apos;s scale of ~10,000 public social media inquiries per day, any un-escalated transit theft or locked account leads directly to severe customer dissatisfaction and public escalation. Offline benchmark metrics can never substitute for real-time human supervisor monitoring and shadow-mode validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHAT YOU'D DO NEXT WITH ONE MORE WEEK */}
      <section className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-emerald-400">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-lg font-bold text-stone-100 tracking-tight">
            5. What You&apos;d Do Next With One More Week
          </h2>
        </div>

        <p className="text-xs text-stone-400">
          We have expanded our implementation across both the immediate technical roadmap and broader product capabilities. Explore them interactively in the <strong className="text-amber-400">Roadmap &amp; Extensions</strong> tab!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-300">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Immediate Technical Roadmap</span>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Gemma-2-2B LoRA Distillation:</strong> Fine-tuning a smaller, specialized open-weights model to reduce latency (&lt;90ms) and inference costs by 95%.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Multi-Turn Thread Tree Hydration:</strong> Upgrading the context window to ingest and parse entire multi-tweet conversation histories rather than evaluating isolated, single-turn tweets.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Shadow-Mode Deployment Telemetry:</strong> Monitoring layer to run the agent silently alongside human agents to track real-world performance without risking customer-facing errors.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Deterministic Regex PII Interceptors:</strong> Hard-coded pre-scrubber that removes order numbers, card numbers, and emails before LLM compilation.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Broader Product Capabilities</span>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Hiver/Zendesk CRM Integration:</strong> Automatic ticket conversion with populated tags, priority levels, and draft responses.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Dynamic RAG Knowledge Base Ingestion:</strong> Ingesting updated Amazon return and warranty policies in real time without redeploying.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Multilingual Support &amp; Cultural Tone Adaptation:</strong> Translating incoming queries into English, routing with policies, and replying in native languages.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Automated Action Execution with Guardrails:</strong> Triggering $5 promo credits, returns, or QR codes with policy bounds.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
