import React, { useState } from "react";
import { Navbar, ActiveTab } from "./components/Navbar.tsx";
import { LiveAgentSandbox } from "./components/LiveAgentSandbox.tsx";
import { BenchmarkHarness } from "./components/BenchmarkHarness.tsx";
import { GoldenSetExplorer } from "./components/GoldenSetExplorer.tsx";
import { RoadmapAndExtensionsView } from "./components/RoadmapAndExtensionsView.tsx";
import { EvaluationReportView } from "./components/EvaluationReportView.tsx";
import { DecisionLogView } from "./components/DecisionLogView.tsx";
import { QuickstartView } from "./components/QuickstartView.tsx";
import { CustomCursor } from "./components/CustomCursor.tsx";
import { ScrollExperience, HeyneshTicker } from "./components/ScrollExperience.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LoginModal } from "./components/LoginModal.tsx";
import { RoleRulesModal } from "./components/RoleRulesModal.tsx";
import { RuleBlockedModal } from "./components/RuleBlockedModal.tsx";
import { Sparkles, ArrowRight, ShieldCheck, Database, BarChart3, CheckCircle2 } from "lucide-react";

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sandbox");
  const [prefilledTweet, setPrefilledTweet] = useState<string | null>(null);

  const handleLoadInSandbox = (tweet: string) => {
    setPrefilledTweet(tweet);
    setActiveTab("sandbox");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Heynesh-style Fluid Custom Cursor */}
      <CustomCursor />

      {/* Scroll-Driven Dynamic Indicators (Top Progress Bar & Back to Top) */}
      <ScrollExperience />

      {/* Sticky Elevation Navbar with Auth & Rule Matrix Controls */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Heynesh Interactive Marquee Ticker */}
      <HeyneshTicker />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "sandbox" && <LiveAgentSandbox key={prefilledTweet || "default"} />}
        {activeTab === "roadmap" && <RoadmapAndExtensionsView />}
        {activeTab === "benchmark" && <BenchmarkHarness />}
        {activeTab === "dataset" && <GoldenSetExplorer onLoadInSandbox={handleLoadInSandbox} />}
        {activeTab === "report" && <EvaluationReportView />}
        {activeTab === "decisions" && <DecisionLogView />}
        {activeTab === "quickstart" && <QuickstartView />}
      </main>

      {/* Global Security & Authentication Modals */}
      <LoginModal />
      <RoleRulesModal />
      <RuleBlockedModal />

      {/* Footer - Handcrafted Candidate Details */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-400">Candidate Submission: Deva (SDE Intern Assessment)</span>
            <span>&bull;</span>
            <span>Focus: @AmazonHelp</span>
            <span>&bull;</span>
            <span className="text-emerald-400/90 flex items-center space-x-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 inline" />
              <span>Verified Kaggle TWCS (524k)</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 font-medium">
            <button
              onClick={() => setActiveTab("roadmap")}
              data-cursor="VIEW"
              className="hover:text-amber-400 transition-colors underline"
            >
              Roadmap &amp; Extensions
            </button>
            <button
              onClick={() => setActiveTab("quickstart")}
              data-cursor="VIEW"
              className="hover:text-amber-400 transition-colors underline"
            >
              15-Min Quickstart
            </button>
            <button
              onClick={() => setActiveTab("report")}
              data-cursor="VIEW"
              className="hover:text-amber-400 transition-colors underline"
            >
              6-Page Report
            </button>
            <button
              onClick={() => setActiveTab("decisions")}
              data-cursor="VIEW"
              className="hover:text-amber-400 transition-colors underline"
            >
              12 Decisions
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
