import React, { useEffect, useState, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHoveringInput, setIsHoveringInput] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Positions for smooth trailing
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device has fine pointer (mouse/trackpad, not purely touch)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) {
      setEnabled(false);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Inspect target element for cursor hover states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "button, a, input, textarea, select, [role='button'], [data-cursor], .interactive-target"
      );

      if (interactive) {
        const isTextInput =
          interactive.tagName === "INPUT" ||
          interactive.tagName === "TEXTAREA" ||
          interactive.getAttribute("contenteditable") === "true";

        setIsHoveringInput(isTextInput);
        setIsHoveringInteractive(!isTextInput);

        // Check for specific data-cursor text
        const customText = interactive.getAttribute("data-cursor");
        if (customText) {
          setCursorText(customText);
        } else if (interactive.tagName === "BUTTON" || interactive.closest("button")) {
          setCursorText(null);
        } else {
          setCursorText(null);
        }
      } else {
        setIsHoveringInteractive(false);
        setIsHoveringInput(false);
        setCursorText(null);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Animation loop for fluid inertia (Lerp)
    const render = () => {
      // Dot follows immediately with tight lerp
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.75;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.75;

      // Ring follows with liquid ease (heynesh-style spring)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Outer Fluid Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center will-change-transform"
        style={{
          width: isHoveringInput ? "0px" : isHoveringInteractive ? "64px" : "40px",
          height: isHoveringInput ? "0px" : isHoveringInteractive ? "64px" : "40px",
          marginLeft: isHoveringInteractive ? "-32px" : "-20px",
          marginTop: isHoveringInteractive ? "-32px" : "-20px",
          transition: "width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), margin 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
          opacity: isHoveringInput ? 0 : 1
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-200 border ${
            isClicking
              ? "scale-75 border-amber-400 bg-amber-500/30"
              : isHoveringInteractive
              ? "border-amber-400 bg-amber-500/15 backdrop-blur-xs scale-100 shadow-lg shadow-amber-500/20"
              : "border-stone-400/50 bg-stone-500/5 scale-90"
          }`}
        >
          {cursorText && (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono font-extrabold tracking-widest text-amber-300 uppercase select-none animate-fade-in">
              {cursorText}
            </div>
          )}
        </div>
      </div>

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-500/60 will-change-transform transition-transform duration-75"
        style={{
          transform: `scale(${isHoveringInteractive ? (cursorText ? 0 : 1.4) : isHoveringInput ? 0.7 : 1})`,
          opacity: cursorText ? 0 : 1
        }}
      />
    </div>
  );
};
