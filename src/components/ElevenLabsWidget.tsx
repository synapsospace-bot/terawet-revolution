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
  const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
  if (widget) {
    widget.click();
    // In case there is an internal shadow root button
    const innerBtn = widget.shadowRoot?.querySelector("button");
    if (innerBtn) {
      innerBtn.click();
    }
  }
}
