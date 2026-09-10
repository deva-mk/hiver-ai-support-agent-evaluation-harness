import React from "react";
import { X, ShieldCheck, Lock, CheckCircle2, XCircle, AlertTriangle, Scale, BookOpen } from "lucide-react";
import { useAuth, ROLE_RULES } from "../context/AuthContext.tsx";
import { UserRole } from "../types.ts";

export const RoleRulesModal: React.FC = () => {
  const { isRulesMatrixOpen, closeRulesMatrix, currentUser, loginAsRole } = useAuth();

  if (!isRulesMatrixOpen) return null;

  const roles = [
    { key: UserRole.TIER_1_AGENT, name: "Tier-1 Agent", badge: "Agent" },
    { key: UserRole.SUPERVISOR, name: "Supervisor", badge: "Tier-2" },
    { key: UserRole.ML_ENGINEER, name: "ML Engineer", badge: "Admin" },
    { key: UserRole.AUDITOR, name: "Auditor", badge: "Review" }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                Operational Rules & Security Matrix
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  ACTIVE GOVERNANCE
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Current Role: <strong className="text-amber-400 font-mono">{currentUser.role_display}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={closeRulesMatrix}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-stone-300 leading-relaxed">
            <strong className="text-amber-300 block mb-1">Corporate Rule Enforcement Overview:</strong>
            These operational rules govern all customer interactions, monetary concessions, and benchmark evaluations. Attempting an action outside your role privileges will trigger an automatic compliance block.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-stone-800 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800">
                  <th className="p-3 font-mono">Rule Code &amp; Governance Clause</th>
                  <th className="p-3">Category</th>
                  {roles.map((r) => (
                    <th key={r.key} className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        currentUser.role === r.key
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-stone-900 text-stone-300"
                      }`}>
                        {r.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 font-sans">
                {ROLE_RULES.map((rule) => (
                  <tr key={rule.rule_id} className="hover:bg-stone-850/50 transition-colors">
                    <td className="p-3">
                      <div className="font-mono text-amber-400 font-bold text-[11px]">{rule.rule_id}</div>
                      <div className="font-semibold text-stone-200 mt-0.5">{rule.title}</div>
                      <div className="text-[11px] text-stone-400 mt-1 leading-snug">{rule.description}</div>
                    </td>
                    <td className="p-3 align-top">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-950 text-stone-400 border border-stone-800 whitespace-nowrap">
                        {rule.category}
                      </span>
                    </td>
                    {roles.map((r) => {
                      const isAllowed = rule.allowed_roles.includes(r.key);
                      return (
                        <td key={r.key} className="p-3 text-center align-top">
                          {isAllowed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold font-mono text-[11px]">
                              <CheckCircle2 className="w-4 h-4" /> Allowed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold font-mono text-[11px]">
                              <XCircle className="w-4 h-4" /> Blocked
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs">
          <span className="text-stone-400">Need elevated privileges for testing? Switch role anytime.</span>
          <button
            onClick={() => {
              closeRulesMatrix();
              loginAsRole(UserRole.ML_ENGINEER);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md"
          >
            Switch to ML Engineer (Full Admin)
          </button>
        </div>
      </div>
    </div>
  );
};
