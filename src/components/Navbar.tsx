import React, { useState, useEffect } from "react";
import { 
  Bot, 
  BarChart3, 
  Database, 
  FileText, 
  ListChecks, 
  Terminal, 
  ShieldCheck, 
  Sparkles,
  Zap,
  LogIn,
  LogOut,
  Shield,
  User,
  ChevronDown,
  Lock,
  MousePointer
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { UserRole } from "../types.ts";

export type ActiveTab = "sandbox" | "benchmark" | "dataset" | "roadmap" | "report" | "decisions" | "quickstart";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, isLoggedIn, logout, openLoginModal, openRulesMatrix, loginAsRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "sandbox", label: "Live Agent Sandbox", icon: Bot, badge: "Interactive" },
    { id: "roadmap", label: "Roadmap & Extensions", icon: Zap, badge: "RAG & LoRA" },
    { id: "benchmark", label: "Evaluation Harness", icon: BarChart3, badge: "Baselines" },
    { id: "dataset", label: "Golden 200 Dataset", icon: Database, badge: "Curated" },
    { id: "report", label: "Evaluation Report", icon: FileText, badge: "6-Page" },
    { id: "decisions", label: "Decision Log", icon: ListChecks, badge: "12 Decisions" },
    { id: "quickstart", label: "15-Min Quickstart", icon: Terminal, badge: "Reproduction" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-amber-500/20 bg-stone-950/90 backdrop-blur-xl shadow-xl shadow-black/60 py-1"
          : "border-b border-stone-800 bg-stone-950/95 backdrop-blur-md py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Bot className="w-5 h-5 text-stone-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-stone-100 tracking-tight">Hiver AI Support Agent</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  @AmazonHelp
                </span>
              </div>
              <p className="text-xs text-stone-400">Candidate Submission &bull; SDE Intern Assessment</p>
            </div>
          </div>

          {/* Model Status & Auth Controls */}
          <div className="flex items-center space-x-3 text-xs">
            {/* SLA Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SLA Target: False Auto-Handle &lt; 5%</span>
            </div>

            {/* Rules Matrix Button */}
            <button
              onClick={openRulesMatrix}
              data-cursor="RULES"
              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 font-mono text-[11px] flex items-center gap-1.5 transition-all"
              title="View Security and Operational Rules"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Role Rules Matrix</span>
            </button>

            {/* Auth / User Control Profile */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    data-cursor="USER"
                    className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-full bg-stone-900 border border-stone-850 hover:border-amber-500/50 transition-all group"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-stone-700 group-hover:border-amber-400"
                    />
                    <div className="text-left hidden md:block">
                      <span className="text-[11px] font-bold text-stone-200 group-hover:text-amber-300 block leading-none">
                        {currentUser.name.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-mono text-amber-400 leading-none">
                        {currentUser.badge}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300" />
                  </button>

                  {/* Quick Logout button */}
                  <button
                    onClick={logout}
                    data-cursor="LOGOUT"
                    title="Log Out (Switch to Guest)"
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 border border-stone-800 hover:border-rose-800/60 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  data-cursor="LOGIN"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In / Switch Role</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-stone-900 border border-stone-750 shadow-2xl p-3 space-y-2 z-[60] animate-fade-in"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="pb-2 border-b border-stone-800">
                    <p className="text-xs font-bold text-stone-200">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentUser.role_display}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-mono text-stone-500 px-1 pt-1 font-semibold">
                      Fast Switch Active Role:
                    </div>
                    <button
                      onClick={() => {
                        loginAsRole(UserRole.ML_ENGINEER);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === UserRole.ML_ENGINEER ? "bg-amber-500/20 text-amber-300 font-bold" : "text-stone-300 hover:bg-stone-800"
                      }`}
                    >
                      <span>ML &amp; Eval Engineer</span>
                      <span className="text-[10px] font-mono text-amber-400">Admin</span>
                    </button>
                    <button
                      onClick={() => {
                        loginAsRole(UserRole.SUPERVISOR);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === UserRole.SUPERVISOR ? "bg-amber-500/20 text-amber-300 font-bold" : "text-stone-300 hover:bg-stone-800"
                      }`}
                    >
                      <span>Tier-2 Supervisor</span>
                      <span className="text-[10px] font-mono text-emerald-400">Concession</span>
                    </button>
                    <button
                      onClick={() => {
                        loginAsRole(UserRole.TIER_1_AGENT);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === UserRole.TIER_1_AGENT ? "bg-amber-500/20 text-amber-300 font-bold" : "text-stone-300 hover:bg-stone-800"
                      }`}
                    >
                      <span>Tier-1 Support Agent</span>
                      <span className="text-[10px] font-mono text-stone-400">Standard</span>
                    </button>
                    <button
                      onClick={() => {
                        loginAsRole(UserRole.AUDITOR);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === UserRole.AUDITOR ? "bg-amber-500/20 text-amber-300 font-bold" : "text-stone-300 hover:bg-stone-800"
                      }`}
                    >
                      <span>Compliance Auditor</span>
                      <span className="text-[10px] font-mono text-purple-400">Read-Only</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        openLoginModal();
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Full Sign-In...
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                data-cursor={item.label.split(" ")[0].toUpperCase()}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-stone-800 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? "bg-amber-500/20 text-amber-300" : "bg-stone-850 text-stone-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
