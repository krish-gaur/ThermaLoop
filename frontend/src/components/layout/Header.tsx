import React from "react";
import { Play, RotateCcw, AlertCircle, Compass, SunMedium, Gauge } from "lucide-react";

interface HeaderProps {
  currentScenario: string;
  onSelectScenario: (scenarioId: string) => void;
  ambientTemp: number;
  wetBulbTemp: number;
  onQuickOptimize: () => void;
  isOptimizing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  ambientTemp,
  wetBulbTemp,
  onQuickOptimize,
  isOptimizing
}) => {
  const scenarios = [
    { id: "low_delta_t", label: "Low ΔT Event (Default)" },
    { id: "normal", label: "Normal Balanced" },
    { id: "high_load", label: "Summer Peak (42°C)" },
    { id: "excessive_pumping", label: "Excessive Pumping (98%)" },
    { id: "chiller_degradation", label: "Chiller 02 Scaling" },
  ];

  return (
    <header className="h-16 border-b border-[#222e2b] bg-[#141b1a]/95 backdrop-blur px-6 flex items-center justify-between z-10">
      {/* Breadcrumb & Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#f5f6f2]">Plant Cockpit</span>
          <span className="text-[#455551]">/</span>
          <span className="text-[#8ea09b]">Digital Twin Simulation</span>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded bg-[#182220] border border-[#222e2b] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#a3b3af]">
            <SunMedium className="w-3.5 h-3.5 text-[#d89a3d]" />
            <span>Outdoor:</span>
            <span className="font-mono text-[#f5f6f2] font-semibold">{ambientTemp}°C</span>
          </div>
          <span className="text-[#33423f]">|</span>
          <div className="flex items-center gap-1.5 text-[#a3b3af]">
            <Gauge className="w-3.5 h-3.5 text-[#3f8f6b]" />
            <span>Wet-Bulb:</span>
            <span className="font-mono text-[#f5f6f2] font-semibold">{wetBulbTemp}°C</span>
          </div>
          <span className="text-[#33423f]">|</span>
          <span className="font-mono text-[10px] text-[#3f8f6b] uppercase bg-[#3f8f6b]/10 px-1.5 py-0.5 rounded">
            ToD Normal Tariff
          </span>
        </div>
      </div>

      {/* Scenario Selector & Action Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#7d8f8a] uppercase tracking-wider font-mono hidden sm:inline">
            Scenario:
          </span>
          <select
            value={currentScenario}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="bg-[#1c2624] border border-[#2d3d39] text-[#f5f6f2] text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#3f8f6b] font-medium cursor-pointer"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#141b1a]">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onQuickOptimize}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-[#f5f6f2] text-xs font-semibold shadow transition-all disabled:opacity-60 cursor-pointer"
        >
          {isOptimizing ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Optimization</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
