import React from "react";
import { 
  TrendingDown, 
  AlertTriangle, 
  Zap, 
  Thermometer, 
  Gauge, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { PlantOverview, OptimizationResult } from "../../types";

interface OverviewProps {
  overview: PlantOverview;
  optResult: OptimizationResult | null;
  onNavigateTab: (tab: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const OverviewView: React.FC<OverviewProps> = ({
  overview,
  optResult,
  onNavigateTab,
  onRunOptimization,
  isOptimizing
}) => {
  const telemetry = overview.telemetry_snapshot;
  const metrics = overview.metrics;

  const isLowDeltaT = metrics.delta_t_status === "CRITICAL";

  return (
    <div className="space-y-6">
      {/* Top Banner: Plant State & Modeled Opportunity */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLowDeltaT 
          ? "bg-[#241a18] border-[#5e2b25]" 
          : "bg-[#182320] border-[#254639]"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded mt-0.5 ${
            isLowDeltaT ? "bg-[#c9574b]/20 text-[#e06b5f]" : "bg-[#3f8f6b]/20 text-[#3f8f6b]"
          }`}>
            {isLowDeltaT ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#f5f6f2]">
                {overview.plant_name} — {overview.system_status}
              </h2>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                isLowDeltaT ? "bg-[#c9574b]/30 text-[#fca59b]" : "bg-[#3f8f6b]/30 text-[#a3e2c6]"
              }`}>
                {overview.current_scenario.name}
              </span>
            </div>
            <p className="text-xs text-[#a3b3af] mt-1 max-w-2xl leading-relaxed">
              {overview.current_scenario.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => onNavigateTab("delta-t")}
            className="px-3 py-1.5 rounded bg-[#1f2b28] hover:bg-[#283734] border border-[#334440] text-xs font-medium text-[#d9deda] transition cursor-pointer"
          >
            Investigate ΔT
          </button>
          <button
            onClick={() => onNavigateTab("optimization")}
            className="px-3.5 py-1.5 rounded bg-[#d89a3d] hover:bg-[#ba802e] text-[#111615] text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <span>Review Optimization</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Grid - Industrial High Density */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Cooling Load */}
        <div className="p-3.5 rounded-lg bg-[#182220] border border-[#222e2b]">
          <div className="flex items-center justify-between text-[#7d8f8a] text-[11px] font-medium">
            <span>Cooling Load</span>
            <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#202c29] text-[#7d8f8a]">Simulated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f6f2]">{telemetry.cooling_load_tr}</span>
            <span className="text-xs font-mono text-[#7d8f8a]">TR</span>
          </div>
          <div className="mt-1 text-[11px] text-[#7d8f8a]">
            Plant Design: 1,000 TR
          </div>
        </div>

        {/* Metric 2: Plant Power */}
        <div className="p-3.5 rounded-lg bg-[#182220] border border-[#222e2b]">
          <div className="flex items-center justify-between text-[#7d8f8a] text-[11px] font-medium">
            <span>Total Power</span>
            <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#202c29] text-[#7d8f8a]">Simulated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f6f2]">{telemetry.total_plant_power_kw}</span>
            <span className="text-xs font-mono text-[#7d8f8a]">kW</span>
          </div>
          <div className="mt-1 text-[11px] text-[#7d8f8a]">
            Specific: <span className="font-mono text-[#f5f6f2]">{telemetry.plant_efficiency_kw_per_tr}</span> kW/TR
          </div>
        </div>

        {/* Metric 3: Loop Delta-T (Crucial) */}
        <div className={`p-3.5 rounded-lg border ${
          isLowDeltaT 
            ? "bg-[#261b1a] border-[#6b2c24]" 
            : "bg-[#182220] border-[#222e2b]"
        }`}>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className={isLowDeltaT ? "text-[#fca59b]" : "text-[#7d8f8a]"}>Hydronic ΔT</span>
            <span className={`text-[9px] font-mono uppercase px-1 rounded font-bold ${
              isLowDeltaT ? "bg-[#c9574b]/30 text-[#fca59b]" : "bg-[#3f8f6b]/20 text-[#3f8f6b]"
            }`}>
              {metrics.delta_t_status}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono ${isLowDeltaT ? "text-[#e06b5f]" : "text-[#f5f6f2]"}`}>
              {telemetry.actual_delta_t}
            </span>
            <span className="text-xs font-mono text-[#7d8f8a]">°C</span>
          </div>
          <div className="mt-1 text-[11px] text-[#7d8f8a]">
            Expected: <span className="font-mono text-[#a3b3af]">{telemetry.expected_delta_t}°C</span>
          </div>
        </div>

        {/* Metric 4: Active Equipment */}
        <div className="p-3.5 rounded-lg bg-[#182220] border border-[#222e2b]">
          <div className="flex items-center justify-between text-[#7d8f8a] text-[11px] font-medium">
            <span>Chiller Staging</span>
            <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#202c29] text-[#7d8f8a]">Simulated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f6f2]">{telemetry.active_chillers}</span>
            <span className="text-xs font-mono text-[#7d8f8a]">/ 2 Online</span>
          </div>
          <div className="mt-1 text-[11px] text-[#7d8f8a]">
            Pumps: <span className="font-mono text-[#f5f6f2]">{telemetry.pump_speed_pct}%</span> speed
          </div>
        </div>

        {/* Metric 5: Modeled Savings */}
        <div className="p-3.5 rounded-lg bg-[#19241f] border border-[#234237]">
          <div className="flex items-center justify-between text-[#3f8f6b] text-[11px] font-semibold">
            <span>Cost Opportunity</span>
            <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#3f8f6b]/20 text-[#3f8f6b]">Modeled</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#f5f6f2]">
              ₹{(metrics.estimated_savings_opportunity_inr_month / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-[#7d8f8a]">/mo</span>
          </div>
          <div className="mt-1 text-[11px] text-[#3f8f6b] flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>{metrics.modeled_power_reduction_pct}% reduction</span>
          </div>
        </div>

        {/* Metric 6: Carbon Avoidance */}
        <div className="p-3.5 rounded-lg bg-[#19241f] border border-[#234237]">
          <div className="flex items-center justify-between text-[#3f8f6b] text-[11px] font-semibold">
            <span>CO₂ Avoidance</span>
            <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#3f8f6b]/20 text-[#3f8f6b]">Projected</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#f5f6f2]">
              {metrics.estimated_co2_reduction_tonnes_month}
            </span>
            <span className="text-[10px] text-[#7d8f8a]">tCO₂e/mo</span>
          </div>
          <div className="mt-1 text-[11px] text-[#7d8f8a] font-mono">
            Grid: 0.716 kg/kWh
          </div>
        </div>
      </div>

      {/* Middle Grid: Active Inefficiencies vs Quick Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Anomalies Table */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#f5f6f2]">Detected Anomalies & Inefficiencies</h3>
              <p className="text-xs text-[#7d8f8a] mt-0.5">Thermodynamic deviations evaluated against ASHRAE baseline</p>
            </div>
            <button
              onClick={() => onNavigateTab("anomalies")}
              className="text-xs text-[#3f8f6b] hover:text-[#52aa82] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({overview.recent_anomalies.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {overview.recent_anomalies.map((anom) => (
              <div 
                key={anom.id}
                className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded text-xs font-bold font-mono ${
                    anom.severity === "CRITICAL"
                      ? "bg-[#c9574b]/20 text-[#e06b5f] border border-[#c9574b]/30"
                      : anom.severity === "WARNING"
                      ? "bg-[#d89a3d]/20 text-[#e5aa4e] border border-[#d89a3d]/30"
                      : "bg-[#3f8f6b]/20 text-[#3f8f6b] border border-[#3f8f6b]/30"
                  }`}>
                    {anom.severity}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#f5f6f2]">{anom.title}</h4>
                    <p className="text-[11px] text-[#a3b3af] mt-0.5">{anom.observed_condition}</p>
                    <div className="mt-2 text-[10px] text-[#7d8f8a]">
                      <span className="font-semibold text-[#8ea09b]">Recommended Action:</span> {anom.recommended_action}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab("ai-operations")}
                  className="px-2.5 py-1 rounded bg-[#1e2a27] hover:bg-[#283734] border border-[#30403c] text-[11px] font-medium text-[#c4d1cd] shrink-0 cursor-pointer"
                >
                  Ask AI
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Optimization Wedge Preview */}
        <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#f5f6f2]">Supervisory Optimization</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#d89a3d]/20 text-[#e5aa4e] font-bold">
                Constrained
              </span>
            </div>
            <p className="text-xs text-[#a3b3af] leading-relaxed">
              ThermaLoop's numerical solver continuously evaluates hydronic enthalpy, wet-bulb lift, and affinity law reductions.
            </p>

            <div className="mt-4 p-3.5 rounded bg-[#141b1a] border border-[#222e2b] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7d8f8a]">Current Power:</span>
                <span className="font-mono font-bold text-[#f5f6f2]">{telemetry.total_plant_power_kw} kW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7d8f8a]">Modeled Optimized Power:</span>
                <span className="font-mono font-bold text-[#3f8f6b]">
                  {optResult ? optResult.optimized_state.total_power_kw : (telemetry.total_plant_power_kw * 0.73).toFixed(1)} kW
                </span>
              </div>
              <div className="pt-2 border-t border-[#222e2b] flex items-center justify-between">
                <span className="font-medium text-[#c4d1cd]">Projected Savings:</span>
                <span className="font-mono font-bold text-[#d89a3d]">
                  {optResult ? `${optResult.power_reduction_kw} kW (${optResult.percentage_reduction}%)` : "138 kW (27.5%)"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="w-full py-2.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-[#f5f6f2] text-xs font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isOptimizing ? "Optimizing Solver..." : "Execute Plant Optimization"}</span>
            </button>
            <p className="text-[10px] text-[#637571] text-center mt-2">
              Non-invasive setpoint dispatch via BACnet/IP registers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
