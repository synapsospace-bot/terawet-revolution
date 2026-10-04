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
        `;
        el.shadowRoot.appendChild(style);
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
          if (!label.includes("Dismiss") && !label.includes("Close")) {
            btn.click();
          }
        });
      }
    } else if (retries > 0) {
      setTimeout(() => attempt(retries - 1), 250);
    }
  };
  attempt();
}
