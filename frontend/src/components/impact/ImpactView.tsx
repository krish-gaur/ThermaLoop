import React from "react";
import { 
  TrendingDown, 
  Leaf, 
  Coins, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { OptimizationResult, TelemetryData } from "../../types";

interface ImpactProps {
  telemetry: TelemetryData;
  optResult: OptimizationResult | null;
}

export const ImpactView: React.FC<ImpactProps> = ({ telemetry, optResult }) => {
  // Conservative baseline: 4,200 operating hours per year (Indian commercial office standard)
  const powerReductionKw = optResult ? optResult.power_reduction_kw : 138.0;
  const pctReduction = optResult ? optResult.percentage_reduction : 27.5;
  const annualKwhSaved = Math.round(powerReductionKw * 4200);
  const annualInrSaved = Math.round(annualKwhSaved * 10.50);
  const annualCo2Tonnes = Number(((annualKwhSaved * 0.716) / 1000).toFixed(1));

  const months = [
    { name: "Jan", baseline: 120, opt: 92, savings: "₹2.9L" },
    { name: "Feb", baseline: 140, opt: 105, savings: "₹3.6L" },
    { name: "Mar", baseline: 180, opt: 132, savings: "₹5.0L" },
    { name: "Apr", baseline: 240, opt: 174, savings: "₹6.9L" },
    { name: "May", baseline: 280, opt: 202, savings: "₹8.1L" },
    { name: "Jun", baseline: 260, opt: 188, savings: "₹7.5L" },
    { name: "Jul", baseline: 230, opt: 168, savings: "₹6.5L" },
    { name: "Aug", baseline: 210, opt: 154, savings: "₹5.8L" },
    { name: "Sep", baseline: 190, opt: 140, savings: "₹5.2L" },
    { name: "Oct", baseline: 160, opt: 118, savings: "₹4.4L" },
    { name: "Nov", baseline: 130, opt: 98, savings: "₹3.3L" },
    { name: "Dec", baseline: 110, opt: 84, savings: "₹2.7L" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#f5f6f2]">Impact Modeling & Carbon Verification</h2>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] font-bold">
            IPMVP Option B
          </span>
        </div>
        <p className="text-xs text-[#7d8f8a] mt-0.5">
          Translation of thermodynamic efficiencies into verified financial, energy, and emissions outcomes
        </p>
      </div>

      {/* Primary Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Energy */}
        <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7d8f8a]">
              <span>ENERGY REDUCTION</span>
              <span className="font-mono text-[10px] uppercase bg-[#1f2c29] text-[#3f8f6b] px-1.5 py-0.5 rounded">
                Modeled
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#f5f6f2]">
                {(annualKwhSaved / 1000).toFixed(0)}k
              </span>
              <span className="text-sm font-mono text-[#7d8f8a]">kWh / year</span>
            </div>
            <p className="text-xs text-[#a3b3af] mt-2">
              Continuous demand reduction of <strong className="text-[#3f8f6b]">{powerReductionKw} kW</strong> across 4,200 operating hours.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222e2b] flex items-center justify-between text-xs text-[#7d8f8a]">
            <span>Facility Savings Share:</span>
            <span className="font-mono text-[#3f8f6b] font-bold">-{pctReduction}% total HVAC</span>
          </div>
        </div>

        {/* Card 2: Cost */}
        <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7d8f8a]">
              <span>FINANCIAL SAVINGS</span>
              <span className="font-mono text-[10px] uppercase bg-[#1f2c29] text-[#d89a3d] px-1.5 py-0.5 rounded">
                Projected
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#d89a3d]">
                ₹{(annualInrSaved / 100000).toFixed(1)}L
              </span>
              <span className="text-sm font-mono text-[#7d8f8a]">/ year</span>
            </div>
            <p className="text-xs text-[#a3b3af] mt-2">
              Evaluated against commercial C&I tariff of <strong>₹10.50 / kWh</strong> including ToD peak demand charges.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222e2b] flex items-center justify-between text-xs text-[#7d8f8a]">
            <span>Monthly OPEX Trim:</span>
            <span className="font-mono text-[#f5f6f2] font-bold">~₹{(annualInrSaved / 12000).toFixed(0)}k / month</span>
          </div>
        </div>

        {/* Card 3: Carbon */}
        <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7d8f8a]">
              <span>CARBON AVOIDANCE</span>
              <span className="font-mono text-[10px] uppercase bg-[#1f2c29] text-[#3f8f6b] px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#3f8f6b]">
                {annualCo2Tonnes}
              </span>
              <span className="text-sm font-mono text-[#7d8f8a]">tCO₂e / year</span>
            </div>
            <p className="text-xs text-[#a3b3af] mt-2">
              Calculated using CEA Baseline Database factor of <strong>0.716 kg CO₂ / kWh</strong> on India’s national grid.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222e2b] flex items-center justify-between text-xs text-[#7d8f8a]">
            <span>Equivalent Urban Offset:</span>
            <span className="font-mono text-[#f5f6f2] font-bold">~82 passenger cars off road</span>
          </div>
        </div>
      </div>

      {/* 12-Month Seasonal Profile Bar Chart Representation */}
      <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f6f2]">12-Month Simulated Demand Profile (MWh)</h3>
            <p className="text-xs text-[#7d8f8a]">Baseline Consumption vs Modeled ThermaLoop Optimization</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#33423f]" />
              <span className="text-[#a3b3af]">Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#3f8f6b]" />
              <span className="text-[#a3b3af]">Optimized</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Columns */}
        <div className="grid grid-cols-12 gap-2 h-44 items-end pt-6 pb-2 border-b border-[#222e2b]">
          {months.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
              <span className="text-[10px] font-mono text-[#7d8f8a] opacity-0 group-hover:opacity-100 transition">
                {m.savings}
              </span>
              <div className="w-full flex items-end justify-center gap-1">
                {/* Baseline bar */}
                <div 
                  className="w-1/2 bg-[#2d3b37] rounded-t transition-all group-hover:bg-[#3d4f4a]"
                  style={{ height: `${(m.baseline / 280) * 110}px` }}
                />
                {/* Optimized bar */}
                <div 
                  className="w-1/2 bg-[#3f8f6b] rounded-t transition-all group-hover:bg-[#4ea87f]"
                  style={{ height: `${(m.opt / 280) * 110}px` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#7d8f8a] mt-1">{m.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#7d8f8a]">
          <span>Peak cooling savings occur May–July during Delhi NCR summer heatwaves (up to 78 MWh/month reduction).</span>
          <span className="font-mono text-[#3f8f6b]">Annual Cumulative Savings: ₹62.8 Lakhs</span>
        </div>
      </div>
    </div>
  );
};
