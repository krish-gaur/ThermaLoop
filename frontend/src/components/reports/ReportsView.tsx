import React, { useState } from "react";
import { FileText, Download, CheckCircle2, Building, ShieldCheck, Printer } from "lucide-react";
import { PlantOverview, OptimizationResult } from "../../types";

interface ReportsProps {
  overview: PlantOverview;
  optResult: OptimizationResult | null;
}

export const ReportsView: React.FC<ReportsProps> = ({ overview, optResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/v1/reports/generate", { method: "POST" });
      const data = await resp.json();
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#f5f6f2]">Plant Operations Performance Reports</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] font-bold">
              Audit-Ready
            </span>
          </div>
          <p className="text-xs text-[#7d8f8a] mt-0.5">
            Generates standardized executive briefs and engineering audit logs conforming to IPMVP Option B
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-white text-xs font-semibold flex items-center gap-2 shadow transition cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Compiling Audit...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Plant Performance Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Document Sheet (Enterprise Formatted) */}
      <div className="p-8 rounded-lg bg-[#141b1a] border border-[#222e2b] max-w-4xl mx-auto shadow-xl space-y-6 text-[#d9deda]">
        {/* Document Header */}
        <div className="border-b border-[#222e2b] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-[#f5f6f2]">THERMALOOP</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#202c29] text-[#3f8f6b] font-mono">
                ENGINEERING REPORT
              </span>
            </div>
            <h1 className="text-base font-semibold text-[#f5f6f2] mt-1">
              Chilled Water Central Plant Thermodynamic Diagnostic & Optimization Summary
            </h1>
            <p className="text-xs text-[#7d8f8a]">
              Facility: {overview.plant_name} | Location: {overview.location}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-[#7d8f8a]">
            <div>Report ID: <span className="text-[#f5f6f2] font-semibold">{reportData ? reportData.report_id : "REP-2026-TL-0941"}</span></div>
            <div>Generated: {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
            <div className="text-[#3f8f6b]">Standard: ASHRAE 90.1 / ECBC</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8ea09b] font-mono">
            1. Executive Summary & Diagnostic
          </h3>
          <p className="text-xs text-[#c4d1cd] leading-relaxed bg-[#182220] p-4 rounded border border-[#222e2b]">
            {reportData ? reportData.executive_summary : (
              `An operational assessment was executed across the 1,000 TR water-cooled centrifugal plant. ` +
              `Under simulated operating conditions, the facility exhibits a severe Low ΔT deficiency of ${overview.telemetry_snapshot.actual_delta_t}°C ` +
              `(design requirement: 5.5°C). This hydraulic bypass anomaly has driven unnecessary multi-chiller staging and elevated secondary ` +
              `pumping speed to 94%. Constrained thermodynamic optimization confirms a modeled demand reduction of ` +
              `${optResult ? optResult.power_reduction_kw : 138} kW (${optResult ? optResult.percentage_reduction : 27.5}%), ` +
              `projecting ₹${optResult ? (optResult.annual_cost_savings_inr / 100000).toFixed(1) : "54.2"} Lakhs in annualized operational savings.`
            )}
          </p>
        </div>

        {/* Operating Point Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8ea09b] font-mono">
            2. Operating Parameter Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#222e2b]">
              <thead className="bg-[#182220] text-[#7d8f8a] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Observed Baseline</th>
                  <th className="p-2.5">ThermaLoop Modeled</th>
                  <th className="p-2.5">Delta / Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222e2b]">
                <tr>
                  <td className="p-2.5 font-medium text-[#f5f6f2]">CHW Supply Temp</td>
                  <td className="p-2.5 font-mono text-[#a3b3af]">6.0°C</td>
                  <td className="p-2.5 font-mono text-[#3f8f6b] font-semibold">6.8°C</td>
                  <td className="p-2.5 text-[#c4d1cd]">+0.8°C reset (2.4% compressor power drop)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#f5f6f2]">Secondary Pump Speed</td>
                  <td className="p-2.5 font-mono text-[#e06b5f]">94.0% (47 Hz)</td>
                  <td className="p-2.5 font-mono text-[#3f8f6b] font-semibold">76.0% (38 Hz)</td>
                  <td className="p-2.5 text-[#c4d1cd]">-18% speed (-48.5% pump affinity power)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#f5f6f2]">Chiller Staging</td>
                  <td className="p-2.5 font-mono text-[#e06b5f]">2 Chillers (51% PLR)</td>
                  <td className="p-2.5 font-mono text-[#3f8f6b] font-semibold">1 Chiller (86% PLR)</td>
                  <td className="p-2.5 text-[#c4d1cd]">Optimal isentropic COP band, 0 kW standby</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-[#f5f6f2]">Loop Differential (ΔT)</td>
                  <td className="p-2.5 font-mono text-[#e06b5f]">2.8°C (Critical)</td>
                  <td className="p-2.5 font-mono text-[#3f8f6b] font-semibold">5.2°C (Healthy)</td>
                  <td className="p-2.5 text-[#c4d1cd]">Remediates coil residence time</td>
                </tr>
                <tr className="bg-[#182420]">
                  <td className="p-2.5 font-bold text-[#f5f6f2]">Total Plant Draw</td>
                  <td className="p-2.5 font-mono font-bold text-[#f5f6f2]">489.1 kW</td>
                  <td className="p-2.5 font-mono font-bold text-[#3f8f6b]">351.0 kW</td>
                  <td className="p-2.5 font-bold font-mono text-[#3f8f6b]">-138.1 kW (-28.2%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification & Sign-Off Block */}
        <div className="pt-4 border-t border-[#222e2b] flex items-center justify-between text-xs text-[#7d8f8a]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3f8f6b]" />
            <span>Safety Limits: Clamped within ASHRAE 55 indoor thermal comfort</span>
          </div>
          <div className="font-mono text-[11px]">
            ThermaLoop Autonomous Dispatch Engine
          </div>
        </div>
      </div>
    </div>
  );
};
