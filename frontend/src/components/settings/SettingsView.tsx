import React, { useState } from "react";
import { Settings, ShieldCheck, Database, Sliders, CheckCircle2 } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [bacnetPort, setBacnetPort] = useState("47808");
  const [deviceInstance, setDeviceInstance] = useState("1001");
  const [minChwSupply, setMinChwSupply] = useState("6.2");
  const [maxChwSupply, setMaxChwSupply] = useState("9.5");
  const [minDeltaTClamp, setMinDeltaTClamp] = useState("4.8");
  const [tariffRate, setTariffRate] = useState("10.50");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#f5f6f2]">Plant & Safety Configuration</h2>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] font-bold">
            Deterministic Bounds
          </span>
        </div>
        <p className="text-xs text-[#7d8f8a] mt-0.5">
          Engineering guardrails, BACnet/IP gateway endpoints, and thermodynamic safety clamps
        </p>
      </div>

      <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8ea09b] font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3f8f6b]" />
          <span>Thermodynamic Safety Clamps</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[#7d8f8a] block mb-1">Minimum CHW Supply Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={minChwSupply}
              onChange={(e) => setMinChwSupply(e.target.value)}
              className="w-full bg-[#141b1a] border border-[#283734] rounded px-3 py-2 text-[#f5f6f2] font-mono focus:outline-none focus:border-[#3f8f6b]"
            />
            <span className="text-[10px] text-[#637571] mt-0.5 block">Evaporator freeze prevention</span>
          </div>

          <div>
            <label className="text-[#7d8f8a] block mb-1">Maximum CHW Supply Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={maxChwSupply}
              onChange={(e) => setMaxChwSupply(e.target.value)}
              className="w-full bg-[#141b1a] border border-[#283734] rounded px-3 py-2 text-[#f5f6f2] font-mono focus:outline-none focus:border-[#3f8f6b]"
            />
            <span className="text-[10px] text-[#637571] mt-0.5 block">Tenant humidity control ceiling</span>
          </div>

          <div>
            <label className="text-[#7d8f8a] block mb-1">Target Minimum ΔT Clamp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={minDeltaTClamp}
              onChange={(e) => setMinDeltaTClamp(e.target.value)}
              className="w-full bg-[#141b1a] border border-[#283734] rounded px-3 py-2 text-[#f5f6f2] font-mono focus:outline-none focus:border-[#3f8f6b]"
            />
            <span className="text-[10px] text-[#637571] mt-0.5 block">Hydronic optimization floor</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8ea09b] font-mono flex items-center gap-2">
          <Database className="w-4 h-4 text-[#3ca2d9]" />
          <span>BACnet / Modbus Integration Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[#7d8f8a] block mb-1">BACnet UDP Port</label>
            <input
              type="text"
              value={bacnetPort}
              onChange={(e) => setBacnetPort(e.target.value)}
              className="w-full bg-[#141b1a] border border-[#283734] rounded px-3 py-2 text-[#f5f6f2] font-mono focus:outline-none focus:border-[#3f8f6b]"
            />
          </div>

          <div>
            <label className="text-[#7d8f8a] block mb-1">BMS Device Instance ID</label>
            <input
              type="text"
              value={deviceInstance}
              onChange={(e) => setDeviceInstance(e.target.value)}
              className="w-full bg-[#141b1a] border border-[#283734] rounded px-3 py-2 text-[#f5f6f2] font-mono focus:outline-none focus:border-[#3f8f6b]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded bg-[#3f8f6b] hover:bg-[#34785a] text-white text-xs font-semibold shadow transition cursor-pointer flex items-center gap-2"
        >
          {saved && <CheckCircle2 className="w-4 h-4" />}
          <span>{saved ? "Configuration Saved & Armed" : "Save Plant Settings"}</span>
        </button>

        <span className="text-xs text-[#7d8f8a]">
          Safety interlocks hard-coded at BACnet level.
        </span>
      </div>
    </div>
  );
};
