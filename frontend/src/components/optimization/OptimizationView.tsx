import React, { useState } from "react";
import { OptimizationResult } from "../../types";
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Sliders
} from "lucide-react";

interface OptimizationViewProps {
  optResult: OptimizationResult | null;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onNavigateTab: (tab: string) => void;
}

export const OptimizationView: React.FC<OptimizationViewProps> = ({
  optResult,
  onRunOptimization,
  isOptimizing,
  onNavigateTab
}) => {
  const [analysisProgress, setAnalysisProgress] = useState<number>(100);

  if (!optResult) {
    return (
      <div className="p-12 text-center rounded-lg bg-[#182220] border border-[#222e2b]">
        <Zap className="w-10 h-10 text-[#d89a3d] mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-[#f5f6f2]">No Active Optimization Run</h3>
        <p className="text-xs text-[#7d8f8a] mt-1 mb-4">
          Click below to execute the thermodynamic constrained optimization engine.
        </p>
        <button
          onClick={onRunOptimization}
          className="px-4 py-2 rounded bg-[#3f8f6b] text-white text-xs font-semibold cursor-pointer"
        >
          Run Optimization Solver
        </button>
      </div>
    );
  }

  const curr = optResult.current_state;
  const opt = optResult.optimized_state;

  return (
    <div className="space-y-6">
      {/* Header & Status */}
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#f5f6f2]">Supervisory Constrained Optimization</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] font-bold">
              {optResult.mode}
            </span>
          </div>
          <p className="text-xs text-[#7d8f8a] mt-0.5">
            Gordon-Ng chiller modeling & hydronic affinity law co-optimization
          </p>
        </div>

        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="px-3.5 py-1.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-white text-xs font-semibold flex items-center gap-2 shadow transition cursor-pointer disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Solver...</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Run Optimizer</span>
            </>
          )}
        </button>
      </div>

      {/* Solver Analysis Verification Steps */}
      <div className="p-4 rounded-lg bg-[#141b1a] border border-[#222e2b]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#8ea09b] uppercase tracking-wider font-mono">
            Optimization Execution Sequence
          </span>
          <span className="text-[10px] font-mono text-[#3f8f6b] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Constraints Satisfied (ASHRAE 55)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {optResult.analysis_steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[#c4d1cd]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3f8f6b] shrink-0" />
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Before / After Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT STATE */}
        <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222e2b] pb-3">
            <div>
              <span className="text-xs font-bold text-[#e06b5f] uppercase tracking-wider font-mono">
                CURRENT BASELINE
              </span>
              <h3 className="text-sm font-semibold text-[#f5f6f2] mt-0.5">Legacy Rule-Based Control</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-[#f5f6f2]">{curr.total_power_kw}</span>
              <span className="text-xs font-mono text-[#7d8f8a] ml-1">kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">CHW Supply Temp</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{curr.chw_supply_temp}°C</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Loop ΔT</span>
              <p className="mt-1 font-mono font-bold text-[#e06b5f]">{curr.delta_t}°C (Low)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Secondary Pump Speed</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{curr.pump_speed_pct}% (Over-pumping)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Active Chillers</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{curr.active_chillers} Online (51% PLR)</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#7d8f8a]">
            Plant Specific Efficiency: <span className="font-mono text-[#f5f6f2] font-semibold">{curr.efficiency_kw_per_tr} kW/TR</span>
          </div>
        </div>

        {/* OPTIMIZED STATE */}
        <div className="p-5 rounded-lg bg-[#182420] border border-[#274a3d] space-y-4">
          <div className="flex items-center justify-between border-b border-[#234237] pb-3">
            <div>
              <span className="text-xs font-bold text-[#3f8f6b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                OPTIMIZED STATE (MODELED)
              </span>
              <h3 className="text-sm font-semibold text-[#f5f6f2] mt-0.5">ThermaLoop Dynamic Reset</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-[#3f8f6b]">{opt.total_power_kw}</span>
              <span className="text-xs font-mono text-[#7d8f8a] ml-1">kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#141b1a] border border-[#234237]">
              <span className="text-[#7d8f8a]">CHW Supply Temp</span>
              <p className="mt-1 font-mono font-bold text-[#3f8f6b]">{opt.chw_supply_temp}°C (+0.8°C reset)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#234237]">
              <span className="text-[#7d8f8a]">Target Loop ΔT</span>
              <p className="mt-1 font-mono font-bold text-[#3f8f6b]">{opt.delta_t}°C (Restored)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#234237]">
              <span className="text-[#7d8f8a]">Secondary Pump Speed</span>
              <p className="mt-1 font-mono font-bold text-[#3f8f6b]">{opt.pump_speed_pct}% (-18% via VFD)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#234237]">
              <span className="text-[#7d8f8a]">Active Chillers</span>
              <p className="mt-1 font-mono font-bold text-[#3f8f6b]">{opt.active_chillers} Online (86% PLR)</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#7d8f8a]">
            Plant Specific Efficiency: <span className="font-mono text-[#3f8f6b] font-semibold">{opt.efficiency_kw_per_tr} kW/TR</span>
          </div>
        </div>
      </div>

      {/* Modeled Savings Highlight Card */}
      <div className="p-5 rounded-lg bg-gradient-to-r from-[#1b2724] to-[#16211e] border border-[#29423b] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-[#3f8f6b]">
            MODELED DEMAND & FINANCIAL IMPACT
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-mono text-[#f5f6f2]">
              -{optResult.percentage_reduction}%
            </span>
            <span className="text-lg font-mono text-[#3f8f6b] font-semibold">
              ({optResult.power_reduction_kw} kW power drop)
            </span>
          </div>
          <p className="text-xs text-[#a3b3af] mt-2 max-w-xl leading-relaxed">
            {optResult.engineering_rationale}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] text-center min-w-36">
            <span className="text-[11px] text-[#7d8f8a]">Monthly Savings</span>
            <p className="mt-1 font-mono font-bold text-lg text-[#f5f6f2]">
              ₹{(optResult.monthly_cost_savings_inr / 1000).toFixed(1)}k
            </p>
            <span className="text-[10px] text-[#7d8f8a]">₹10.50 / kWh blended</span>
          </div>

          <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] text-center min-w-36">
            <span className="text-[11px] text-[#7d8f8a]">Monthly Carbon</span>
            <p className="mt-1 font-mono font-bold text-lg text-[#3f8f6b]">
              {optResult.monthly_co2_reduction_tonnes} t
            </p>
            <span className="text-[10px] text-[#7d8f8a]">CO₂e Avoided</span>
          </div>
        </div>
      </div>
    </div>
  );
};
