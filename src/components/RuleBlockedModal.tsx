import React from "react";
import { X, ShieldAlert, AlertTriangle, ArrowRight, Lock, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { UserRole } from "../types.ts";

export const RuleBlockedModal: React.FC = () => {
  const { ruleBlockedModal, closeRuleBlockedModal, currentUser, loginAsRole } = useAuth();

  if (!ruleBlockedModal.isOpen || !ruleBlockedModal.rule) return null;

  const rule = ruleBlockedModal.rule;
  const targetRole = rule.allowed_roles[0] || UserRole.ML_ENGINEER;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-rose-600/50 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                RULE VIOLATION PREVENTED
              </span>
              <h3 className="text-base font-bold text-stone-100 mt-1">
                Action Blocked by Governance Policy
              </h3>
            </div>
          </div>
          <button
            onClick={closeRuleBlockedModal}
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rule explanation */}
        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-bold text-amber-400">{rule.rule_id}</span>
            <span className="text-stone-400 font-mono">{rule.category}</span>
          </div>
          <h4 className="font-bold text-stone-200">{rule.title}</h4>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            {rule.description}
          </p>
        </div>

        {/* Current Role Info */}
        <div className="text-xs text-stone-300">
          Your current role: <strong className="text-stone-100">{currentUser.role_display}</strong>.
          Authorized roles: <span className="text-amber-400 font-mono">{rule.allowed_roles.join(", ")}</span>.
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end space-x-2">
          <button
            onClick={closeRuleBlockedModal}
            className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              loginAsRole(targetRole);
              closeRuleBlockedModal();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <span>Switch to {targetRole}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
