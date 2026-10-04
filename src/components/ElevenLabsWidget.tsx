import { useEffect } from "react";

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export function ElevenLabsWidget({ agentId = "agent_4401kpn73yzzfjjr8pg03cvr322w" }: ElevenLabsWidgetProps) {
  useEffect(() => {
    // 1. Inject or update ElevenLabs ConvAI custom element
    let widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (!widget) {
      widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", agentId);
      widget.setAttribute("data-theme", "light");
      widget.setAttribute("placement", "bottom-left");
      widget.setAttribute("data-placement", "bottom-left");
      widget.setAttribute("always-expanded", "true");
      widget.setAttribute("data-open", "false");
      widget.style.setProperty("display", "none", "important");
      widget.style.setProperty("visibility", "hidden", "important");
      widget.style.setProperty("pointer-events", "none", "important");
      widget.style.setProperty("opacity", "0", "important");
      document.body.appendChild(widget);
    } else {
      widget.setAttribute("agent-id", agentId);
      widget.setAttribute("data-theme", "light");
      widget.setAttribute("placement", "bottom-left");
      widget.setAttribute("data-placement", "bottom-left");
      widget.setAttribute("always-expanded", "true");
    }

    // 2. Load ElevenLabs ConvAI script if not already present
    if (!document.querySelector('script[src*="convai-widget-embed"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // 3. Dynamic styling and controls inside Shadow DOM
    const updateShadowDOM = () => {
      const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
      if (!el) return;

      const isOpen = el.getAttribute("data-open") === "true";
      if (!isOpen) {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("pointer-events", "none", "important");
        el.style.setProperty("opacity", "0", "important");
      } else {
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("pointer-events", "none", "important"); // Host covers screen with pointer-events: none
        el.style.setProperty("opacity", "1", "important");
      }

      if (!el.shadowRoot) return;

      // Inject robust shadow DOM stylesheet
      if (!el.shadowRoot.querySelector("#clean-assistant-style")) {
        const style = document.createElement("style");
        style.id = "clean-assistant-style";
        style.textContent = `
          /* Hide idle popup cards, bubbles, and credit footers */
          [class*="rounded-compact-sheet"],
          [class*="rounded-bubble"],
          p[class*="whitespace-nowrap"],
          [class*="terms"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            max-width: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
          }

          /* Hide default floating trigger button since custom WovenGlassButton is used */
          button.rounded-full,
          button[aria-label="Open chat"] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
          }

          /* Active sheet styling: clean white card with emerald branding and crystal clear readability */
          .sheet {
            pointer-events: auto !important;
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            left: 24px !important;
            bottom: 84px !important;
            right: auto !important;
            width: 380px !important;
            max-width: calc(100vw - 32px) !important;
            height: min(520px, calc(100vh - 110px)) !important;
            max-height: calc(100vh - 110px) !important;
            z-index: 10001 !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.3) !important;
            border: 2px solid rgba(16, 185, 129, 0.5) !important;
            background: #ffffff !important;
            color: #0f172a !important;
            overflow: hidden !important;
          }

          /* Ensure all typography inside chat is crystal clear with strong contrast */
          .sheet p,
          .sheet span,
          .sheet div,
          .sheet [class*="markdown"],
          .sheet [class*="markdown"] * {
            color: #0f172a !important;
          }

          /* Header and scrollable area in crisp white */
          .sheet [class*="bg-base"] {
            background-color: #ffffff !important;
          }
          .sheet div[class*="overflow-y-auto"] {
            background-color: #ffffff !important;
          }

          /* Text input field styling */
          .sheet textarea {
            background-color: #f8fafc !important;
            color: #0f172a !important;
          }
          .sheet textarea::placeholder {
            color: #64748b !important;
          }

          :host([data-open="false"]) .sheet,
          :host(:not([data-open="true"])) .sheet {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          @media (max-width: 500px) {
            .sheet {
              left: 10px !important;
              bottom: 74px !important;
              width: calc(100vw - 20px) !important;
              max-width: calc(100vw - 20px) !important;
              height: min(480px, calc(100vh - 90px)) !important;
              max-height: calc(100vh - 90px) !important;
              border-radius: 20px !important;
            }
          }

          /* Prominent Close Button inside the active sheet */
          #custom-agent-close-btn {
            position: absolute !important;
            top: 14px !important;
            right: 14px !important;
            z-index: 2147483647 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            background: rgba(6, 22, 16, 0.95) !important;
            border: 1px solid rgba(16, 185, 129, 0.7) !important;
            color: #10b981 !important;
            font-family: inherit !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            letter-spacing: 0.1em !important;
            text-transform: uppercase !important;
            padding: 8px 16px !important;
            border-radius: 9999px !important;
            cursor: pointer !important;
            backdrop-filter: blur(12px) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
            transition: all 0.2s ease !important;
            pointer-events: auto !important;
          }
          #custom-agent-close-btn:hover {
            background: rgba(239, 68, 68, 0.35) !important;
            border-color: rgba(239, 68, 68, 0.9) !important;
            color: #ef4444 !important;
            transform: scale(1.05) !important;
          }
        `;
        el.shadowRoot.appendChild(style);
      }

      // Inject close button into .sheet if active
      const sheet = el.shadowRoot.querySelector(".sheet") as HTMLElement | null;
      if (sheet && !sheet.querySelector("#custom-agent-close-btn")) {
        const closeBtn = document.createElement("button");
        closeBtn.id = "custom-agent-close-btn";
        closeBtn.setAttribute("type", "button");
        closeBtn.setAttribute("aria-label", "Закрити AI-Агента");
        closeBtn.innerHTML = `✕ ЗАКРИТИ`;
        
        const handleBtnClose = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          closeElevenLabsCall();
        };
        closeBtn.onclick = handleBtnClose;
        closeBtn.addEventListener("click", handleBtnClose);
        closeBtn.addEventListener("pointerdown", handleBtnClose);
        sheet.appendChild(closeBtn);
      }
    };

    let observer: MutationObserver | null = null;
    const attachObserver = () => {
      const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
      if (el && el.shadowRoot && !observer) {
        updateShadowDOM();
        observer = new MutationObserver(() => updateShadowDOM());
        observer.observe(el.shadowRoot, { childList: true, subtree: true, attributes: true });
      }
    };

    const interval = setInterval(() => {
      updateShadowDOM();
      attachObserver();
    }, 150);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeElevenLabsCall();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown);
      if (observer) observer.disconnect();
    };
  }, [agentId]);

  return null;
}

export function triggerElevenLabsCall() {
  const attempt = (retries = 15) => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (widget) {
      widget.setAttribute("data-open", "true");
      widget.style.removeProperty("display");
      widget.style.removeProperty("visibility");
      widget.style.removeProperty("pointer-events");
      widget.style.removeProperty("opacity");
      widget.style.setProperty("display", "block", "important");
      widget.style.setProperty("visibility", "visible", "important");
      widget.style.setProperty("pointer-events", "none", "important"); // Host covers viewport with pointer-events: none, sheet has pointer-events: auto
      widget.style.setProperty("opacity", "1", "important");

      window.dispatchEvent(new CustomEvent("terawet:agent-opened"));
    } else if (retries > 0) {
      setTimeout(() => attempt(retries - 1), 150);
    }
  };
  attempt();
}

export function closeElevenLabsCall() {
  const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
  if (widget) {
    widget.setAttribute("data-open", "false");
    widget.style.setProperty("display", "none", "important");
    widget.style.setProperty("visibility", "hidden", "important");
    widget.style.setProperty("pointer-events", "none", "important");
    widget.style.setProperty("opacity", "0", "important");

    if (widget.shadowRoot) {
      const endButtons = widget.shadowRoot.querySelectorAll("button");
      endButtons.forEach((btn) => {
        const label = (btn.getAttribute("aria-label") || "").toLowerCase();
        if (label.includes("end") || label.includes("close") || label.includes("dismiss") || label.includes("згорнути")) {
          btn.click();
        }
      });
    }
  }
  window.dispatchEvent(new CustomEvent("terawet:agent-closed"));
}
