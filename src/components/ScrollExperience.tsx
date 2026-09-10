import React, { useState, useEffect } from "react";
import { ArrowUp, Sparkles, ShieldCheck, Flame, Compass } from "lucide-react";

export const ScrollExperience: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }

      setShowBackToTop(currentScroll > 320);

      if (currentScroll > lastScrollY && currentScroll > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Precision Scroll Progress Bar (Heynesh Style) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-stone-900/60 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(245,158,11,0.65)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Scroll HUD & Back to Top (Bottom Right) */}
      <div
        className={`fixed bottom-6 right-6 z-40 flex items-center space-x-2 transition-all duration-300 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Scroll Depth Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 backdrop-blur-md text-[11px] font-mono text-stone-300 shadow-xl shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Scroll: <strong className="text-amber-400">{Math.round(scrollProgress)}%</strong></span>
        </div>

        {/* Smooth Scroll To Top Button with Circular Ring */}
        <button
          onClick={scrollToTop}
          data-cursor="TOP"
          aria-label="Scroll to top"
          className="group relative w-10 h-10 rounded-full bg-stone-900/95 border border-stone-700/80 hover:border-amber-400 text-stone-300 hover:text-amber-300 flex items-center justify-center transition-all duration-200 shadow-xl shadow-black/50 hover:scale-105 active:scale-95"
        >
          {/* Radial progress outline */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
            <path
              className="text-stone-800"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-amber-500 transition-all duration-75"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </>
  );
};

// Heynesh-style Interactive Marquee Ticker
export const HeyneshTicker: React.FC = () => {
  const tickerItems = [
    "@AmazonHelp Production Agent",
    "SLA False Auto-Handle < 5%",
    "Zero PII Leakage Policy",
    "Stratified 200 Golden Samples",
    "Deterministic Regex Scrubber",
    "LLM-as-Judge Alignment (R=0.82)",
    "Gemma-2-2B LoRA Distillation (<90ms)",
    "Dual-Human Audited Ground Truth",
    "Hiver & Zendesk Integration"
  ];

  return (
    <div className="w-full bg-stone-950/80 border-y border-stone-800/80 py-2.5 overflow-hidden backdrop-blur-md select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-xs font-mono text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <span className="tracking-wide text-stone-300 font-medium hover:text-amber-300 transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
