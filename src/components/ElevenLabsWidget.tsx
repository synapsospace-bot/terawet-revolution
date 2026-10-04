import { useEffect } from "react";

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export function ElevenLabsWidget({ agentId = "agent_4401kpn73yzzfjjr8pg03cvr322w" }: ElevenLabsWidgetProps) {
  useEffect(() => {
    // Inject ElevenLabs ConvAI custom element if not present
    if (!document.querySelector("elevenlabs-convai")) {
      const widget = document.createElement("elevenlabs-convai");
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
  }, [agentId]);

  return null;
}

export function triggerElevenLabsCall() {
  const attempt = (retries = 8) => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
    if (widget) {
      widget.click();
      const innerBtn = widget.shadowRoot?.querySelector("button");
      if (innerBtn) {
        innerBtn.click();
      }
    } else if (retries > 0) {
      setTimeout(() => attempt(retries - 1), 250);
    }
  };
  attempt();
}
