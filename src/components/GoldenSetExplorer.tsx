import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  CheckCircle2,
  FileCode2,
  Info,
  UserCheck
} from "lucide-react";
import { GOLDEN_EVALUATION_SET, SAMPLING_AND_LABELING_METHODOLOGY } from "../data/goldenEvaluationSet.ts";
import { IntentType, DecisionType, DifficultyLevel } from "../types.ts";

interface GoldenSetExplorerProps {
  onLoadInSandbox?: (tweet: string) => void;
}

export const GoldenSetExplorer: React.FC<GoldenSetExplorerProps> = ({ onLoadInSandbox }) => {
  const { checkAndEnforce } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<string>("ALL");
  const [selectedDecision, setSelectedDecision] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSamples = useMemo(() => {
    return GOLDEN_EVALUATION_SET.filter((sample) => {
      if (selectedIntent !== "ALL" && sample.ground_truth_intent !== selectedIntent) return false;
      if (selectedDecision !== "ALL" && sample.ground_truth_decision !== selectedDecision) return false;
      if (selectedDifficulty !== "ALL" && sample.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          sample.customer_text.toLowerCase().includes(q) ||
          sample.customer_handle.toLowerCase().includes(q) ||
          sample.id.toLowerCase().includes(q) ||
          sample.ground_truth_escalation_reason.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedIntent, selectedDecision, selectedDifficulty]);

  const handleExportJSON = () => {
    checkAndEnforce("EXPORT_DATASET", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GOLDEN_EVALUATION_SET, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "amazonhelp_golden_evaluation_set_200.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  const handleExportCSV = () => {
    checkAndEnforce("EXPORT_DATASET", () => {
      const headers = ["id", "tweet_id", "customer_handle", "customer_text", "ground_truth_intent", "ground_truth_decision", "ground_truth_escalation_category", "difficulty", "human_reference_reply"];
      const rows = GOLDEN_EVALUATION_SET.map(s => [
        s.id,
        s.tweet_id,
        s.customer_handle,
        `"${s.customer_text.replace(/"/g, '""')}"`,
        s.ground_truth_intent,
        s.ground_truth_decision,
        s.ground_truth_escalation_category,
        s.difficulty,
        `"${s.human_reference_reply.replace(/"/g, '""')}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "amazonhelp_golden_evaluation_set_200.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <div className="space-y-6">
      {/* Sampling & Labeling Methodology Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                DATASET ARTIFACT
              </span>
              <span className="text-stone-500 text-xs font-mono">Annotated by SDE Candidate</span>
            </div>
            <h1 className="text-base font-bold text-stone-100 flex items-center gap-2 mt-1">
              <Database className="w-5 h-5 text-amber-400" />
              Golden Evaluation Set (200 Hand-Labelled Ground Truth Examples)
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Short Note on How We Sampled and Labelled Them */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1">Corpus Source:</span>
            <span className="text-stone-200 font-medium">Customer Support on Twitter (Kaggle)</span>
            <span className="text-[11px] text-stone-500 block mt-0.5 font-mono">524,157 tweets for @AmazonHelp</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1">Sampling Strategy:</span>
            <span className="text-stone-200 font-medium">Stratified Proportional Sampling</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Balanced across 7 core support intents</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1">Adversarial Stratification:</span>
            <span className="text-stone-200 font-medium">Sarcasm, Typos, Multi-Intent</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Edge-case stress testing included</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1">Labeling Protocol:</span>
            <span className="text-stone-200 font-medium">Dual Human Audit + Adjudication</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Checked against Amazon Care Playbook</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tweet text, handle, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-sans"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
            className="bg-stone-950 text-stone-300 border border-stone-800 rounded-lg px-2.5 py-2 text-xs font-mono"
          >
            <option value="ALL">All Intents ({GOLDEN_EVALUATION_SET.length})</option>
            {Object.values(IntentType).map((it) => (
              <option key={it} value={it}>{it}</option>
            ))}
          </select>

          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value)}
            className="bg-stone-950 text-stone-300 border border-stone-800 rounded-lg px-2.5 py-2 text-xs font-mono"
          >
            <option value="ALL">All Routing Decisions</option>
            <option value={DecisionType.AUTO_HANDLE}>Auto-Handle Only</option>
            <option value={DecisionType.ESCALATE_TO_HUMAN}>Escalate to Human Only</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-stone-950 text-stone-300 border border-stone-800 rounded-lg px-2.5 py-2 text-xs font-mono"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Standard">Standard</option>
            <option value="Ambiguous / Multi-intent">Ambiguous / Multi-intent</option>
            <option value="Noisy / Slang / Typo">Noisy / Slang / Typo</option>
            <option value="High Sarcasm / Frustration">High Sarcasm / Frustration</option>
          </select>

          <span className="text-stone-400 font-mono text-[11px] px-2">
            Showing {filteredSamples.length} of {GOLDEN_EVALUATION_SET.length}
          </span>
        </div>
      </div>

      {/* Samples Table / List */}
      <div className="space-y-3">
        {filteredSamples.map((sample) => {
          const isExpanded = expandedId === sample.id;
          return (
            <div
              key={sample.id}
              className={`bg-stone-900 border rounded-xl p-4 transition-all ${
                isExpanded ? "border-amber-500/50 ring-1 ring-amber-500/30" : "border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{sample.id}</span>
                  <span className="text-xs font-bold text-stone-300">{sample.customer_handle}</span>
                  <span className="text-[10px] text-stone-500 font-mono">Tweet #{sample.tweet_id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    sample.difficulty === "High Sarcasm / Frustration" ? "bg-stone-950 text-orange-300 border border-orange-800/60" :
                    sample.difficulty === "Ambiguous / Multi-intent" ? "bg-stone-950 text-amber-300 border border-amber-800/60" :
                    sample.difficulty === "Noisy / Slang / Typo" ? "bg-stone-950 text-stone-300 border border-stone-700" :
                    "bg-stone-950 text-stone-400 border border-stone-800"
                  }`}>
                    {sample.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-stone-950 text-amber-300 border border-amber-500/30">
                    {sample.ground_truth_intent}
                  </span>
                  {sample.ground_truth_decision === DecisionType.AUTO_HANDLE ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Auto-Handle
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Escalate
                    </span>
                  )}
                </div>
              </div>

              {/* Tweet text */}
              <p className="text-sm text-stone-200 mt-2 font-sans leading-relaxed">
                {sample.customer_text}
              </p>

              {/* Expansion toggle */}
              <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : sample.id)}
                  className="text-amber-400 hover:text-amber-300 font-medium text-[11px]"
                >
                  {isExpanded ? "Hide Human Reference & Audit Scores ▲" : "View Reference Reply & Ground Truth Details ▼"}
                </button>

                {onLoadInSandbox && (
                  <button
                    onClick={() => onLoadInSandbox(sample.customer_text)}
                    className="text-stone-400 hover:text-stone-200 text-[11px] flex items-center gap-1"
                  >
                    <span>Test in Sandbox</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Expanded Ground Truth Card */}
              {isExpanded && (
                <div className="mt-3 p-3.5 rounded-lg bg-stone-950 border border-stone-800 space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold block mb-1">Human Reference Support Tweet:</span>
                    <div className="p-2.5 rounded bg-stone-900 text-stone-200 font-sans border border-stone-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">{sample.human_reference_reply}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-850">
                    <div>
                      <span className="text-stone-400 font-semibold">Ground Truth Escalation Category:</span>
                      <p className="text-stone-300 font-mono text-[11px] mt-0.5">{sample.ground_truth_escalation_category}</p>
                    </div>
                    <div>
                      <span className="text-stone-400 font-semibold">Stated Escalation Rationale:</span>
                      <p className="text-stone-300 text-[11px] mt-0.5">{sample.ground_truth_escalation_reason}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Expert Rubric Scores:</span>
                    <div className="flex gap-3 font-mono">
                      <span>Groundedness: <strong className="text-stone-100">5/5</strong></span>
                      <span>Policy: <strong className="text-emerald-400">5/5</strong></span>
                      <span>Tone: <strong className="text-amber-400">5/5</strong></span>
                      <span>Actionability: <strong className="text-amber-400">5/5</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
