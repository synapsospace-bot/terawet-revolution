import { useEffect } from "react";

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export function ElevenLabsWidget({ agentId = "agent_4401kpn73yzzfjjr8pg03cvr322w" }: ElevenLabsWidgetProps) {
  useEffect(() => {
    // Inject ElevenLabs ConvAI custom element if not present
    let widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (!widget) {
      widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", agentId);
      widget.setAttribute("data-theme", "dark");
      document.body.appendChild(widget);
    }

    // Load ElevenLabs ConvAI script
    if (!document.querySelector('script[src*="convai-widget-embed"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Hide default idle assistant popup ('Потрібна допомога?') and floating circular launcher button
    // so only the custom WovenGlassButton is visible and acts as the trigger.
    const hideDefaultAssistantPopup = () => {
      const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
      if (el && el.shadowRoot) {
        if (!el.shadowRoot.querySelector("#hide-assistant-popup-style")) {
          const style = document.createElement("style");
          style.id = "hide-assistant-popup-style";
          style.textContent = `
            /* Hide the default idle circular button and greeting assistant card */
            button.rounded-full,
            .rounded-bubble,
            div[class*="shadow-md"]:not([class*="sheet"]),
            div[class*="rounded-sheet"]:not([class*="sheet"]),
            div[class*="terms"] {
              display: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
              visibility: hidden !important;
            }
          `;
          el.shadowRoot.appendChild(style);
        }
      }
    };

    const interval = setInterval(hideDefaultAssistantPopup, 200);
    return () => clearInterval(interval);
  }, [agentId]);

  return null;
}

export function triggerElevenLabsCall() {
  const attempt = (retries = 8) => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (widget) {
      widget.dispatchEvent(new CustomEvent("elevenlabs-convai:call", { bubbles: true, composed: true }));
      if (widget.shadowRoot) {
        const btn = widget.shadowRoot.querySelector("button") as HTMLElement | null;
        if (btn) {
          btn.click();
        }
      }
    } else if (retries > 0) {
      setTimeout(() => attempt(retries - 1), 250);
    }
  };
  attempt();
}
