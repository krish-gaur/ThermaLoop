import React from "react";
import { TelemetryData } from "../../types";
import { 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Flame,
  Droplets,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface DeltaTViewProps {
  telemetry: TelemetryData;
  onRunOptimization: () => void;
  onAskAI: (query: string) => void;
}

export const DeltaTIntelligenceView: React.FC<DeltaTViewProps> = ({
  telemetry,
  onRunOptimization,
  onAskAI
}) => {
  const actualDt = telemetry.actual_delta_t;
  const expectedDt = telemetry.expected_delta_t;
  const devPct = Number((((actualDt - expectedDt) / expectedDt) * 100).toFixed(1));
  const isSevere = actualDt < 3.2;

  return (
    <div className="space-y-6">
      {/* Module Headline */}
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#f5f6f2]">Hydronic ΔT Intelligence & Diagnostics</h2>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c9574b]/20 text-[#fca59b] font-bold">
            Core Wedge
          </span>
        </div>
        <p className="text-xs text-[#7d8f8a] mt-0.5 max-w-3xl leading-relaxed">
          Low ΔT indicates that chilled water is returning from building AHU coils barely warmed. This forces excessive pumping, 
          collapses plant coefficient of performance (COP), and triggers premature secondary chiller staging.
        </p>
      </div>

      {/* Delta-T Core Meter Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Actual vs Expected */}
        <div className={`p-4 rounded-lg border ${
          isSevere ? "bg-[#271b1a] border-[#662720]" : "bg-[#182220] border-[#222e2b]"
        }`}>
          <span className="text-xs font-medium text-[#7d8f8a]">Actual Measured ΔT</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold font-mono ${isSevere ? "text-[#e06b5f]" : "text-[#f5f6f2]"}`}>
              {actualDt}
            </span>
            <span className="text-sm font-mono text-[#7d8f8a]">°C</span>
          </div>
          <p className="mt-1 text-[11px] text-[#a3b3af]">
            Supply: <span className="font-mono text-[#f5f6f2]">{telemetry.chw_supply_temp}°C</span> → Return: <span className="font-mono text-[#f5f6f2]">{telemetry.chw_return_temp}°C</span>
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
          <span className="text-xs font-medium text-[#7d8f8a]">Design Baseline ΔT</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-[#f5f6f2]">{expectedDt}</span>
            <span className="text-sm font-mono text-[#7d8f8a]">°C</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7d8f8a]">
            ASHRAE 90.1 / BEE ECBC Specification
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${
          isSevere ? "bg-[#271b1a] border-[#662720]" : "bg-[#182220] border-[#222e2b]"
        }`}>
          <span className="text-xs font-medium text-[#7d8f8a]">Hydronic Deviation</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold font-mono ${isSevere ? "text-[#e06b5f]" : "text-[#3f8f6b]"}`}>
              {devPct}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#7d8f8a]">
            Status: <span className="font-bold uppercase text-[#e06b5f]">{isSevere ? "CRITICAL DEFICIT" : "NORMAL"}</span>
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
          <span className="text-xs font-medium text-[#7d8f8a]">Excess Flow Induced</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-[#d89a3d]">
              +{Math.round(((expectedDt / Math.max(actualDt, 1.0)) - 1.0) * 100)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#a3b3af]">
            Flow: <span className="font-mono text-[#f5f6f2]">{telemetry.chw_flow_rate_gpm} GPM</span> (Required: ~2,350 GPM)
          </p>
        </div>
      </div>

      {/* Deep-Dive Diagnostics: What ThermaLoop Found */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
            <h3 className="text-sm font-semibold text-[#f5f6f2] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3f8f6b]" />
              <span>What ThermaLoop Found: Thermodynamic Diagnosis</span>
            </h3>
            <p className="mt-2 text-xs text-[#c4d1cd] leading-relaxed">
              The chilled-water system is delivering an actual temperature drop of only <strong>{actualDt}°C</strong> across the 
              building envelope, compared with the modeled requirement of <strong>{expectedDt}°C</strong>. 
              Because the heat exchange rate is governed by <code className="px-1 py-0.5 rounded bg-[#121817] text-[#3ca2d9] font-mono">Q = 500 × GPM × ΔT</code>, 
              the secondary distribution pumps are forced to circulate nearly double the water volume to satisfy the same thermal cooling load ({telemetry.cooling_load_tr} TR).
            </p>

            <div className="mt-4 p-3.5 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-xs font-semibold text-[#f5f6f2]">The Cascading Multi-Chiller Penalty:</span>
              <p className="text-xs text-[#a3b3af] mt-1 leading-relaxed">
                The legacy building management system stages chillers based on primary header flow limits. Because flow spiked to 
                <strong> {telemetry.chw_flow_rate_gpm} GPM</strong>, the BMS falsely concluded that cooling demand exceeded Chiller 01's capacity 
                and started Chiller 02. Both 500 TR chillers are now operating at <strong>~51% load</strong>, in their worst part-load efficiency band, 
                consuming <strong>~130 kW of unneeded compressor and auxiliary pumping energy</strong>.
              </p>
            </div>
          </div>

          {/* Probable Causes Matrix */}
          <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
            <h3 className="text-sm font-semibold text-[#f5f6f2] mb-3">
              Probable Root Causes (Evaluated & Ranked)
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Modulating 3-Way Valve Bypass Leakage",
                  likelihood: "92% Probability",
                  desc: "Control valves at AHU-3 and AHU-5 fail to close completely during partial load, shunting supply water directly into the return header unheated.",
                  tag: "Hydraulic Bypass"
                },
                {
                  title: "Excessive Secondary Differential Pressure Setpoint",
                  likelihood: "84% Probability",
                  desc: "Riser differential pressure sensor set to 2.2 bar (over-tuned), forcing secondary pumps to 94% speed and over-saturating cooling coils.",
                  tag: "Pumping Setpoint"
                },
                {
                  title: "Air Handling Unit Coil Air-Side Fouling",
                  likelihood: "68% Probability",
                  desc: "Particulate dust accumulation on cooling fin surfaces reducing convective heat transfer coefficient.",
                  tag: "Fouling"
                }
              ].map((cause, idx) => (
                <div key={idx} className="p-3 rounded bg-[#141b1a] border border-[#222e2b] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#f5f6f2]">{cause.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#d89a3d]/20 text-[#e5aa4e]">
                        {cause.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#7d8f8a] mt-1">{cause.desc}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3f8f6b] shrink-0">{cause.likelihood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action & Copilot Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d89a3d]">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Remediations</span>
            </div>
            <p className="text-xs text-[#a3b3af] mt-2 leading-relaxed">
              ThermaLoop can dynamically mitigate low ΔT without physical retrofits by re-tuning hydronic setpoints:
            </p>

            <ul className="mt-3 space-y-2 text-xs text-[#c4d1cd]">
              <li className="flex items-start gap-2">
                <span className="text-[#3f8f6b] font-bold">1.</span>
                <span>Reset CHW supply temperature from 6.0°C to 6.8°C (widens log mean temperature difference).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3f8f6b] font-bold">2.</span>
                <span>Throttle secondary pump VFD from 94% to 76% speed, restoring coil residence time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3f8f6b] font-bold">3.</span>
                <span>Decant load and de-stage Chiller 02 into standby mode.</span>
              </li>
            </ul>

            <div className="mt-5 space-y-2">
              <button
                onClick={onRunOptimization}
                className="w-full py-2 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-[#f5f6f2] text-xs font-semibold shadow transition cursor-pointer"
              >
                Apply Modeled Setpoints
              </button>
              <button
                onClick={() => onAskAI("Why is ΔT low and what are the detailed thermodynamic causes?")}
                className="w-full py-2 rounded bg-[#1e2a27] hover:bg-[#283734] border border-[#30403c] text-xs font-semibold text-[#c4d1cd] transition cursor-pointer"
              >
                Ask Copilot to Explain
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#141b1a] border border-[#222e2b] text-xs text-[#7d8f8a]">
            <span className="font-semibold text-[#8ea09b]">Measurement & Verification Note:</span>
            <p className="mt-1 leading-relaxed">
              Data language: <strong>SIMULATED</strong> under active scenario. Real-world verification follows IPMVP Option B (continuous chilled water Btu meter and power sub-metering).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
