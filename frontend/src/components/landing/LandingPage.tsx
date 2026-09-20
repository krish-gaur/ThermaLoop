import React from "react";
import { 
  Building2, 
  Cpu, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Flame,
  Droplet
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#111615] text-[#f5f6f2] flex flex-col justify-between selection:bg-[#3f8f6b] selection:text-white">
      {/* Top Nav */}
      <header className="border-b border-[#222e2b] px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#3f8f6b] to-[#255f46] flex items-center justify-center shadow">
            <span className="font-bold text-white text-base">TL</span>
          </div>
          <span className="font-bold text-lg tracking-tight">THERMALOOP</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#202c29] text-[#3f8f6b] font-semibold ml-2">
            Enterprise
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onEnterApp}
            className="px-4 py-2 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-white text-xs font-semibold shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Launch Plant Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182320] border border-[#2a3c37] text-xs text-[#a3b3af] mb-6 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#3f8f6b] animate-pulse" />
          <span>Intelligent Chilled-Water Plant Supervisory Control</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f5f6f2] max-w-4xl leading-tight">
          Turn Cooling Waste Into <br />
          <span className="text-[#3f8f6b]">Measurable Energy Savings.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#8ea09b] max-w-2xl leading-relaxed">
          ThermaLoop combines digital-twin hydronics, Gordon-Ng chiller thermodynamic modeling, 
          and AI operational intelligence to identify Low ΔT syndrome and reduce commercial HVAC electricity by 20–30% with zero capital expenditure.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onEnterApp}
            className="px-6 py-3 rounded-lg bg-[#3f8f6b] hover:bg-[#34785a] text-white text-sm font-semibold shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <span>Explore Digital Twin & Demo</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#182220] border border-[#222e2b] text-xs text-[#a3b3af]">
            <ShieldCheck className="w-4 h-4 text-[#3f8f6b]" />
            <span>Non-invasive BACnet/IP software overlay</span>
          </div>
        </div>

        {/* The 5-Stage Story Strip */}
        <div className="mt-20 pt-10 border-t border-[#222e2b]">
          <span className="text-xs uppercase font-mono tracking-widest text-[#637571] block mb-6">
            The ThermaLoop Autonomous Architecture
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: "01", title: "DETECT", desc: "Real-time telemetry ingestion; flags Low ΔT collapses and flow bypassing." },
              { num: "02", title: "DIAGNOSE", desc: "Isolates probable root causes across AHU modulating valves and coils." },
              { num: "03", title: "OPTIMIZE", desc: "Constrained numerical solver re-tunes CHW supply temps, pump speeds & staging." },
              { num: "04", title: "EXPLAIN", desc: "ThermaLoop Copilot briefs facility managers and validates comfort bounds." },
              { num: "05", title: "QUANTIFY", desc: "Delivers audit-ready IPMVP Option B energy, cost, and carbon verification." },
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#141b1a] border border-[#222e2b]">
                <span className="text-xs font-mono font-bold text-[#3f8f6b]">{step.num}</span>
                <h4 className="text-sm font-semibold text-[#f5f6f2] mt-1">{step.title}</h4>
                <p className="text-xs text-[#7d8f8a] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222e2b] px-6 py-6 text-center text-xs text-[#637571]">
        ThermaLoop Intelligent Cooling Optimization Engine • Developed for Hackathon Submission
      </footer>
    </div>
  );
};
