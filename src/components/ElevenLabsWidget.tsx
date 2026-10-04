import { useEffect } from "react";

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export function ElevenLabsWidget({ agentId = "agent_4401kpn73yzzfjjr8pg03cvr322w" }: ElevenLabsWidgetProps) {
  useEffect(() => {
    // 1. Inject ElevenLabs ConvAI custom element if not present
    let widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (!widget) {
      widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", agentId);
      widget.setAttribute("data-theme", "dark");
      document.body.appendChild(widget);
    }

    // 2. Load ElevenLabs ConvAI script
    if (!document.querySelector('script[src*="convai-widget-embed"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // 3. Bulletproof hiding of idle assistant greeting card ('Потрібна допомога?'),
    // circular launcher buttons, and 'Powered by ElevenAgents' banners.
    const hideIdleWidgets = () => {
      const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
      if (!el || !el.shadowRoot) return;

      // Inject robust shadow DOM stylesheet
      if (!el.shadowRoot.querySelector("#clean-assistant-style")) {
        const style = document.createElement("style");
        style.id = "clean-assistant-style";
        style.textContent = `
          /* Completely hide any idle launcher card, bubble, circular button, or credit footer */
          [class*="rounded-sheet"],
          [class*="rounded-compact-sheet"],
          [class*="rounded-bubble"],
          button.rounded-full,
          button[aria-label="Open chat"],
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
            position: absolute !important;
            bottom: -9999px !important;
            left: -9999px !important;
          }

          /* Ensure the expanded call sheet is visible and positioned when triggered */
          .sheet {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            z-index: 10000 !important;
          }

          /* Prominent Close Button inside the active sheet */
          #custom-agent-close-btn {
            position: absolute !important;
            top: 14px !important;
            right: 14px !important;
            z-index: 99999 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            background: rgba(6, 22, 16, 0.92) !important;
            border: 1px solid rgba(16, 185, 129, 0.6) !important;
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
          }
          #custom-agent-close-btn:hover {
            background: rgba(239, 68, 68, 0.3) !important;
            border-color: rgba(239, 68, 68, 0.8) !important;
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
        closeBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeElevenLabsCall();
        };
        sheet.appendChild(closeBtn);
      }

      // Direct element hiding fallback for any dynamically rendered nodes
      const elementsToHide = el.shadowRoot.querySelectorAll(
        '[class*="rounded-sheet"], [class*="rounded-compact-sheet"], [class*="rounded-bubble"], button.rounded-full, p[class*="whitespace-nowrap"]'
      );
      elementsToHide.forEach((node) => {
        const htmlNode = node as HTMLElement;
        if (!htmlNode.classList.contains("sheet") && !htmlNode.closest(".sheet")) {
          htmlNode.style.setProperty("display", "none", "important");
          htmlNode.style.setProperty("opacity", "0", "important");
          htmlNode.style.setProperty("visibility", "hidden", "important");
          htmlNode.style.setProperty("pointer-events", "none", "important");
          htmlNode.style.setProperty("position", "absolute", "important");
          htmlNode.style.setProperty("bottom", "-9999px", "important");
        }
      });
    };

    let observer: MutationObserver | null = null;
    const attachObserver = () => {
      const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
      if (el && el.shadowRoot && !observer) {
        hideIdleWidgets();
        observer = new MutationObserver(() => hideIdleWidgets());
        observer.observe(el.shadowRoot, { childList: true, subtree: true, attributes: true });
      }
    };

    const interval = setInterval(() => {
      hideIdleWidgets();
      attachObserver();
    }, 150);

    return () => {
      clearInterval(interval);
      if (observer) observer.disconnect();
    };
  }, [agentId]);

  return null;
}

export function triggerElevenLabsCall() {
  const attempt = (retries = 8) => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (widget) {
      document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", { detail: { action: "expand" } }));
      widget.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", { detail: { action: "expand" } }));
      widget.dispatchEvent(new CustomEvent("elevenlabs-convai:call", { bubbles: true, composed: true }));

      if (widget.shadowRoot) {
        const buttons = widget.shadowRoot.querySelectorAll("button");
        buttons.forEach((btn) => {
          const label = btn.getAttribute("aria-label") || "";
          if (!label.includes("Dismiss") && !label.includes("Close") && !label.includes("Закрити")) {
            btn.click();
          }
        });
      }
      window.dispatchEvent(new CustomEvent("terawet:agent-opened"));
    } else if (retries > 0) {
      setTimeout(() => attempt(retries - 1), 250);
    }
  };
  attempt();
}

export function closeElevenLabsCall() {
  document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", { detail: { action: "collapse" } }));
  const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
  if (widget) {
    widget.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", { detail: { action: "collapse" } }));
    if (widget.shadowRoot) {
      const endButtons = widget.shadowRoot.querySelectorAll(
        'button[aria-label*="end" i], button[aria-label*="End" i], button[aria-label*="Close" i], button[aria-label*="Dismiss" i]'
      );
      endButtons.forEach((btn) => (btn as HTMLElement).click());
    }
  }
  window.dispatchEvent(new CustomEvent("terawet:agent-closed"));
}
