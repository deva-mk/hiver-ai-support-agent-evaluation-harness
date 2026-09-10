import React from "react";
import { ListChecks, CheckCircle2, ArrowRight, ShieldCheck, Scale, GitCommit } from "lucide-react";
import { DECISION_LOG } from "../data/benchmarkBaselines.ts";

export const DecisionLogView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
              Engineering Decision Log (12 Non-Obvious Decisions)
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Architectural, statistical, and product trade-offs made while building the @AmazonHelp AI support agent.
            </p>
          </div>
        </div>

        <p className="text-xs text-stone-300 mt-3 pt-3 border-t border-stone-800 leading-relaxed">
          Standard boilerplate choices (e.g. &ldquo;used React and TypeScript&rdquo;) are omitted. Every item below documents a non-obvious fork in the road where reasonable engineers could disagree, detailing the alternatives considered, the chosen rationale, the accepted trade-off, and the measurable impact on evaluation metrics.
        </p>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-4">
        {DECISION_LOG.map((dec) => (
          <div
            key={dec.id}
            className="bg-stone-900 border border-stone-800 hover:border-stone-750 rounded-xl p-5 transition-all space-y-3 shadow-sm"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">
                  #{dec.id}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-stone-100">
                  {dec.decision}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-stone-950 text-amber-300 border border-stone-800 self-start sm:self-auto">
                Impact: {dec.impact_on_metrics}
              </span>
            </div>

            {/* Alternatives vs Rationale Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-stone-400 font-semibold block text-[11px]">
                  Alternatives Considered:
                </span>
                <p className="text-stone-300 leading-relaxed font-sans">{dec.alternatives_considered}</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-emerald-400 font-semibold block text-[11px]">
                  Chosen Rationale:
                </span>
                <p className="text-stone-300 leading-relaxed font-sans">{dec.chosen_rationale}</p>
              </div>
            </div>

            {/* Tradeoff Accepted */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs flex items-start gap-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-stone-300 leading-relaxed">
                <strong className="text-amber-300">Trade-off Accepted: </strong>
                {dec.tradeoff_accepted}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
