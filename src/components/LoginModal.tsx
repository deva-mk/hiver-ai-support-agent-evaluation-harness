import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Shield,
  Briefcase
} from "lucide-react";
import { useAuth, PRESET_USERS } from "../context/AuthContext.tsx";
import { UserRole } from "../types.ts";

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, currentUser, loginAsRole, loginWithCustomDetails } = useAuth();
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState<UserRole>(UserRole.TIER_1_AGENT);

  if (!isLoginModalOpen) return null;

  const roleList = [
    {
      role: UserRole.ML_ENGINEER,
      title: "ML & Evaluation Engineer",
      department: "AI Safety & Machine Learning Ops",
      desc: "Full administrative access: batch evaluations, prompt tuning, RAG configuration, and dataset exports.",
      badge: "FULL ADMIN",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      avatar: PRESET_USERS[UserRole.ML_ENGINEER].avatar
    },
    {
      role: UserRole.SUPERVISOR,
      title: "Tier-2 Escalation Supervisor",
      department: "Executive Escalations & Customer Care",
      desc: "Authorized to execute $5.00 automated concessions, approve/reject human escalations, and sync CRM tickets.",
      badge: "CONCESSION PERMITTED",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      avatar: PRESET_USERS[UserRole.SUPERVISOR].avatar
    },
    {
      role: UserRole.TIER_1_AGENT,
      title: "Tier-1 Support Specialist",
      department: "@AmazonHelp Social Media Operations",
      desc: "Frontline social responder: interactive sandbox, PII scrubber tests, approved tweet drafting. Monetary concessions blocked.",
      badge: "STANDARD AGENT",
      badgeColor: "bg-stone-800 text-stone-300 border-stone-700",
      avatar: PRESET_USERS[UserRole.TIER_1_AGENT].avatar
    },
    {
      role: UserRole.AUDITOR,
      title: "Compliance & Governance Auditor",
      department: "Independent Algorithmic Fairness Group",
      desc: "Read-only access to 6-page evaluation report, 12 non-obvious decisions, and raw golden dataset verification.",
      badge: "READ-ONLY",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      avatar: PRESET_USERS[UserRole.AUDITOR].avatar
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCustomDetails(
      customName.trim() || "Amazon Specialist",
      customEmail.trim() || "support@amazon.internal",
      customRole
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-750 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                Authentication & Role Rules
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  RBAC SEC-2024
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Log in as a team member to test permissions or switch active operational rules.
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 pt-3 text-xs">
          <button
            onClick={() => setActiveTab("preset")}
            className={`pb-3 px-4 font-semibold transition-all border-b-2 ${
              activeTab === "preset"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            Quick 1-Click Role Switch
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`pb-3 px-4 font-semibold transition-all border-b-2 ${
              activeTab === "custom"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            Custom Account Sign-In
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === "preset" ? (
            <div className="grid grid-cols-1 gap-3">
              {roleList.map((item) => {
                const isCurrent = currentUser.role === item.role;
                return (
                  <div
                    key={item.role}
                    onClick={() => loginAsRole(item.role)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? "bg-amber-950/25 border-amber-500/60 ring-1 ring-amber-500/30"
                        : "bg-stone-950 border-stone-800 hover:border-stone-700 hover:bg-stone-925"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={item.avatar}
                        alt={item.title}
                        className="w-11 h-11 rounded-full object-cover border border-stone-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 font-mono mt-0.5">{item.department}</p>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2">{item.desc}</p>
                      </div>
                    </div>

                    <div className="ml-4 shrink-0 flex items-center">
                      {isCurrent ? (
                        <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <button className="px-3 py-1.5 rounded-lg bg-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-all">
                          <span>Switch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Corporate Internal Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="s.connor@amazon-support.internal"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Assigned Operational Role & Rules</label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value as UserRole)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value={UserRole.TIER_1_AGENT}>Tier-1 Social Support Specialist</option>
                  <option value={UserRole.SUPERVISOR}>Tier-2 Escalation Supervisor</option>
                  <option value={UserRole.ML_ENGINEER}>ML & Evaluation Engineer (Admin)</option>
                  <option value={UserRole.AUDITOR}>Independent Compliance Auditor</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  Sign In with Custom Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
