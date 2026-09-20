import React from "react";
import { AnomalyItem } from "../../types";
import { AlertTriangle, ShieldAlert, AlertCircle, Info, ChevronRight, CheckCircle2 } from "lucide-react";

interface AnomaliesProps {
  anomalies: AnomalyItem[];
  onAskAI: (query: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AnomaliesView: React.FC<AnomaliesProps> = ({ anomalies, onAskAI, onNavigateTab }) => {
  const criticalCount = anomalies.filter(a => a.severity === "CRITICAL").length;
  const warningCount = anomalies.filter(a => a.severity === "WARNING").length;
  const advisoryCount = anomalies.filter(a => a.severity === "ADVISORY").length;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#f5f6f2]">Operational Anomaly Center</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c9574b]/20 text-[#fca59b] font-bold">
              Automated Diagnostics
            </span>
          </div>
          <p className="text-xs text-[#7d8f8a] mt-0.5">
            Continuous physics-informed telemetry scanning against thermodynamic baselines
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#c9574b]/20 text-[#e06b5f] border border-[#c9574b]/30">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded bg-[#d89a3d]/20 text-[#e5aa4e] border border-[#d89a3d]/30">
            {warningCount} Warning
          </span>
          <span className="px-2.5 py-1 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] border border-[#3f8f6b]/30">
            {advisoryCount} Advisory
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {anomalies.map((anom) => (
          <div 
            key={anom.id}
            className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222e2b] pb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  anom.severity === "CRITICAL"
                    ? "bg-[#c9574b]/20 text-[#e06b5f] border border-[#c9574b]/30"
                    : anom.severity === "WARNING"
                    ? "bg-[#d89a3d]/20 text-[#e5aa4e] border border-[#d89a3d]/30"
                    : "bg-[#3f8f6b]/20 text-[#3f8f6b] border border-[#3f8f6b]/30"
                }`}>
                  {anom.severity}
                </span>
                <h3 className="text-sm font-semibold text-[#f5f6f2]">{anom.title}</h3>
                {anom.equipment_id && (
                  <span className="text-xs font-mono text-[#7d8f8a] bg-[#141b1a] px-2 py-0.5 rounded border border-[#222e2b]">
                    {anom.equipment_id}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-[#637571]">
                Detected: {new Date(anom.detected_at).toLocaleTimeString()} (Active)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] space-y-1">
                <span className="text-[#7d8f8a] font-medium">Observed Condition vs Benchmark:</span>
                <p className="text-[#c4d1cd] font-mono">{anom.observed_condition}</p>
                <p className="text-[#7d8f8a] text-[11px]">Benchmark: {anom.expected_condition}</p>
              </div>

              <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] space-y-1">
                <span className="text-[#d89a3d] font-medium">Estimated Financial & Operational Impact:</span>
                <p className="text-[#c4d1cd]">{anom.estimated_impact}</p>
              </div>
            </div>

            {anom.probable_causes && anom.probable_causes.length > 0 && (
              <div className="text-xs">
                <span className="text-[#8ea09b] font-medium">Evaluated Probable Causes:</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {anom.probable_causes.map((cause, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded bg-[#141b1a] border border-[#263531] text-[11px] text-[#a3b3af]"
                    >
                      • {cause}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#222e2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="text-[#3f8f6b]">
                <span className="font-semibold text-[#8ea09b]">Recommended Action:</span> {anom.recommended_action}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAskAI(`Investigate anomaly: ${anom.title}. Observed condition: ${anom.observed_condition}`)}
                  className="px-3 py-1.5 rounded bg-[#1e2a27] hover:bg-[#283734] border border-[#30403c] text-[#f5f6f2] font-medium transition cursor-pointer"
                >
                  Ask Copilot
                </button>
                <button
                  onClick={() => onNavigateTab("optimization")}
                  className="px-3 py-1.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-[#f5f6f2] font-semibold transition cursor-pointer"
                >
                  Optimize
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
