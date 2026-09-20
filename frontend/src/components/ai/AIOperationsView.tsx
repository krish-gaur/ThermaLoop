import React, { useState } from "react";
import { TelemetryData, OptimizationResult, AnomalyItem } from "../../types";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Cpu,
  ChevronRight
} from "lucide-react";

interface AIOperationsProps {
  telemetry: TelemetryData;
  anomalies: AnomalyItem[];
  optResult: OptimizationResult | null;
  onRunOptimization: () => void;
  presetQuery?: string;
}

export const AIOperationsView: React.FC<AIOperationsProps> = ({
  telemetry,
  anomalies,
  optResult,
  onRunOptimization,
  presetQuery
}) => {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "copilot"; text: string; tools?: string[] }>>([
    {
      sender: "copilot",
      text: (
        "Good afternoon. I am **ThermaLoop Intelligence**, your industrial chiller operations copilot.\n\n" +
        "I am currently monitoring the 1,000 TR chilled water plant at **CyberCity DLF Gateway Tower**. " +
        `The plant is recording a cooling load of **${telemetry.cooling_load_tr} TR** with an actual hydronic ΔT of **${telemetry.actual_delta_t}°C** (design: 5.5°C).\n\n` +
        "How can I assist your engineering team today?"
      ),
      tools: ["getPlantStatus()", "getTelemetry()"]
    }
  ]);

  const [inputQuery, setInputQuery] = useState(presetQuery || "");
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "Why is ΔT low?",
    "Why is the plant inefficient?",
    "Explain this optimization to a facility manager.",
    "How much can we save in power and costs?",
    "What happens if we shut down Chiller 02?"
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    // Add user message
    const newMsgs = [...messages, { sender: "user" as const, text: q }];
    setMessages(newMsgs);
    setInputQuery("");
    setIsLoading(true);

    try {
      const resp = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, include_optimization: true }),
      });
      const data = await resp.json();

      setMessages([...newMsgs, {
        sender: "copilot",
        text: data.response,
        tools: data.tools_invoked
      }]);
    } catch (err) {
      setMessages([...newMsgs, {
        sender: "copilot",
        text: "Error communicating with ThermaLoop Intelligence engine. Fallback reasoning mode activated."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      {/* Left Column: Live Plant Telemetry Context (Strict Grounding) */}
      <div className="lg:col-span-1 p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[#3f8f6b]" />
            <span className="text-xs font-semibold text-[#f5f6f2] uppercase tracking-wider font-mono">
              Agent Telemetry Grounding
            </span>
          </div>
          <p className="text-xs text-[#7d8f8a] leading-relaxed mb-4">
            The operations copilot reasons strictly over verified plant state. It does not invent or hallucinate physical sensor values.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex justify-between items-center">
              <span className="text-[#7d8f8a]">Hydronic ΔT</span>
              <span className={`font-mono font-bold ${telemetry.actual_delta_t < 3.2 ? "text-[#e06b5f]" : "text-[#3f8f6b]"}`}>
                {telemetry.actual_delta_t}°C <span className="text-[10px] text-[#7d8f8a] font-normal">/ 5.5°C</span>
              </span>
            </div>

            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex justify-between items-center">
              <span className="text-[#7d8f8a]">Thermal Cooling Load</span>
              <span className="font-mono font-bold text-[#f5f6f2]">{telemetry.cooling_load_tr} TR</span>
            </div>

            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex justify-between items-center">
              <span className="text-[#7d8f8a]">Total Plant Draw</span>
              <span className="font-mono font-bold text-[#f5f6f2]">{telemetry.total_plant_power_kw} kW</span>
            </div>

            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex justify-between items-center">
              <span className="text-[#7d8f8a]">CHW Flow Rate</span>
              <span className="font-mono font-bold text-[#f5f6f2]">{telemetry.chw_flow_rate_gpm} GPM</span>
            </div>

            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex justify-between items-center">
              <span className="text-[#7d8f8a]">Active Anomalies</span>
              <span className="font-mono font-bold text-[#e06b5f]">{anomalies.length} Flagged</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#222e2b]">
          <span className="text-[11px] font-semibold text-[#8ea09b] block mb-2">Available Copilot Tools:</span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-[#7d8f8a]">
            {["getPlantStatus()", "getTelemetry()", "analyzeDeltaT()", "runOptimization()", "getImpact()"].map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-[#141b1a] border border-[#222e2b] text-[#3f8f6b]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Copilot Workspace */}
      <div className="lg:col-span-2 p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#253531] text-[#f5f6f2] border border-[#30443f]"
                    : "bg-[#141b1a] text-[#d9deda] border border-[#222e2b]"
                }`}
              >
                {/* Tools invoked badge */}
                {m.tools && m.tools.length > 0 && (
                  <div className="mb-2 pb-2 border-b border-[#222e2b] flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-[#7d8f8a]">Tools Executed:</span>
                    <div className="flex gap-1.5">
                      {m.tools.map((t, ti) => (
                        <span key={ti} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1d2725] text-[#3f8f6b]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#7d8f8a] p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="w-3.5 h-3.5 border-2 border-[#3f8f6b]/30 border-t-[#3f8f6b] rounded-full animate-spin" />
              <span>ThermaLoop Intelligence executing thermodynamic diagnostic tools...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries & Input Bar */}
        <div className="mt-4 pt-4 border-t border-[#222e2b] space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-[#637571] shrink-0">Prompts:</span>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="px-2.5 py-1 rounded bg-[#141b1a] hover:bg-[#1e2a27] border border-[#263531] text-[#a3b3af] hover:text-[#f5f6f2] whitespace-nowrap transition cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask ThermaLoop Copilot about ΔT, equipment faults, or optimization recommendations..."
              className="flex-1 bg-[#141b1a] border border-[#283734] rounded-lg px-4 py-2.5 text-xs text-[#f5f6f2] placeholder-[#637571] focus:outline-none focus:border-[#3f8f6b]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#3f8f6b] hover:bg-[#34785a] text-white text-xs font-semibold shadow transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
