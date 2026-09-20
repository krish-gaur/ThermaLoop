import React, { useState } from "react";
import { TelemetryData } from "../../types";
import { 
  Wind, 
  Droplet, 
  Layers, 
  Activity, 
  Maximize2, 
  Play, 
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface DigitalTwinProps {
  telemetry: TelemetryData;
  isOptimizedMode: boolean;
  setIsOptimizedMode: (val: boolean) => void;
}

export const DigitalTwinView: React.FC<DigitalTwinProps> = ({
  telemetry,
  isOptimizedMode,
  setIsOptimizedMode
}) => {
  const [selectedNode, setSelectedNode] = useState<string>("chiller-01");

  // Determine loop parameters based on optimized toggle
  const currentChwSupply = isOptimizedMode ? 6.8 : telemetry.chw_supply_temp;
  const currentDeltaT = isOptimizedMode ? 5.2 : telemetry.actual_delta_t;
  const currentChwReturn = Number((currentChwSupply + currentDeltaT).toFixed(1));
  const currentPumpSpeed = isOptimizedMode ? 76 : telemetry.pump_speed_pct;
  const activeChillers = isOptimizedMode ? 1 : telemetry.active_chillers;
  const isSevereDeltaT = !isOptimizedMode && telemetry.actual_delta_t < 3.2;

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#182220] border border-[#222e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#f5f6f2]">Hydronic Loop Digital Twin</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3f8f6b]/20 text-[#3f8f6b] font-bold">
              Physics-Calibrated
            </span>
          </div>
          <p className="text-xs text-[#7d8f8a] mt-0.5">
            Real-time thermodynamic simulation of condenser, primary evaporator, and secondary distribution loops
          </p>
        </div>

        {/* Mode Toggle: Current Baseline vs Modeled Optimized State */}
        <div className="flex items-center gap-2 p-1 rounded bg-[#121817] border border-[#222e2b]">
          <button
            onClick={() => setIsOptimizedMode(false)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
              !isOptimizedMode 
                ? "bg-[#253330] text-[#f5f6f2] shadow" 
                : "text-[#7d8f8a] hover:text-[#c4d1cd]"
            }`}
          >
            Current State {!isSevereDeltaT ? "(Nominal)" : "(Low ΔT Fault)"}
          </button>
          <button
            onClick={() => setIsOptimizedMode(true)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isOptimizedMode 
                ? "bg-[#3f8f6b] text-[#f5f6f2] shadow" 
                : "text-[#7d8f8a] hover:text-[#c4d1cd]"
            }`}
          >
            <span>Optimized Digital State</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </button>
        </div>
      </div>

      {/* Main Schematic Diagram Canvas / SVG */}
      <div className="relative rounded-lg bg-[#141b1a] border border-[#222e2b] p-6 overflow-hidden">
        {/* Animated Fluid Schematic Canvas */}
        <div className="w-full h-96 relative flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 900 380" fill="none">
            {/* Piping definitions */}
            <defs>
              <linearGradient id="chwSupplyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e6b9c" />
                <stop offset="100%" stopColor="#3ca2d9" />
              </linearGradient>
              <linearGradient id="chwReturnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b87a28" />
                <stop offset="100%" stopColor="#d89a3d" />
              </linearGradient>
              <linearGradient id="cwLoopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2c7857" />
                <stop offset="100%" stopColor="#48b887" />
              </linearGradient>
            </defs>

            {/* PIPELINE PATHS */}
            {/* 1. Condenser Loop (Tower to Chillers) */}
            <path
              d="M 120 110 L 220 110 L 220 190"
              stroke="#2c7857"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-flow-blue"
            />
            <path
              d="M 220 220 L 120 220 L 120 130"
              stroke="#48b887"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-flow-blue"
            />

            {/* 2. Chilled Water Supply Line (Chillers -> Primary Pumps -> Secondary Pumps -> Building) */}
            <path
              d="M 330 200 L 410 200 L 410 260 L 520 260 L 520 200 L 680 200"
              stroke="#3ca2d9"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-flow-blue"
            />

            {/* 3. Chilled Water Return Line (Building -> Bypass -> Chillers) */}
            <path
              d="M 680 140 L 520 140 L 410 140 L 330 140"
              stroke={isSevereDeltaT ? "#5aaad4" : "#d89a3d"} // In low delta T, return water is cold (blueish) instead of warm (amber)
              strokeWidth="5"
              strokeLinecap="round"
              className={isSevereDeltaT ? "animate-flow-blue" : "animate-flow-amber"}
            />

            {/* 4. Bypass Valve Leakage Line (Active in Low Delta-T) */}
            <path
              d="M 590 200 L 590 140"
              stroke={isSevereDeltaT ? "#c9574b" : "#33423f"}
              strokeWidth={isSevereDeltaT ? "3" : "1.5"}
              strokeDasharray={isSevereDeltaT ? "4 4" : "2 2"}
              className={isSevereDeltaT ? "animate-pulse" : ""}
            />

            {/* NODE 1: COOLING TOWER */}
            <g 
              transform="translate(50, 60)" 
              className="cursor-pointer"
              onClick={() => setSelectedNode("cooling-tower")}
            >
              <rect 
                width="130" 
                height="120" 
                rx="6" 
                fill="#182220" 
                stroke={selectedNode === "cooling-tower" ? "#3f8f6b" : "#283734"} 
                strokeWidth="2"
              />
              <text x="65" y="28" fill="#f5f6f2" fontSize="11" fontWeight="bold" textAnchor="middle">
                COOLING TOWER 01
              </text>
              <text x="65" y="48" fill="#7d8f8a" fontSize="9" textAnchor="middle">Induced Draft VFD</text>
              <text x="65" y="74" fill="#a3b3af" fontSize="10" textAnchor="middle">
                Approach: <tspan fill="#f5f6f2" fontWeight="bold">2.8°C</tspan>
              </text>
              <text x="65" y="92" fill="#a3b3af" fontSize="10" textAnchor="middle">
                Supply: <tspan fill="#48b887" fontWeight="bold">{telemetry.condenser_supply_temp}°C</tspan>
              </text>
            </g>

            {/* NODE 2: CHILLER 01 */}
            <g 
              transform="translate(220, 100)" 
              className="cursor-pointer"
              onClick={() => setSelectedNode("chiller-01")}
            >
              <rect 
                width="140" 
                height="80" 
                rx="6" 
                fill="#182220" 
                stroke={selectedNode === "chiller-01" ? "#3f8f6b" : "#283734"} 
                strokeWidth="2"
              />
              <circle cx="20" cy="22" r="4" fill="#3f8f6b" />
              <text x="32" y="25" fill="#f5f6f2" fontSize="11" fontWeight="bold">CHILLER 01</text>
              <text x="20" y="46" fill="#7d8f8a" fontSize="10">500 TR Centrifugal</text>
              <text x="20" y="65" fill="#a3b3af" fontSize="10">
                Load: <tspan fill="#f5f6f2" fontWeight="bold">{isOptimizedMode ? "86.5%" : "51.0%"}</tspan> | COP: <tspan fill="#3f8f6b" fontWeight="bold">{isOptimizedMode ? "6.1" : "5.1"}</tspan>
              </text>
            </g>

            {/* NODE 3: CHILLER 02 */}
            <g 
              transform="translate(220, 200)" 
              className="cursor-pointer"
              onClick={() => setSelectedNode("chiller-02")}
            >
              <rect 
                width="140" 
                height="80" 
                rx="6" 
                fill={activeChillers === 1 ? "#121817" : "#182220"} 
                stroke={selectedNode === "chiller-02" ? "#3f8f6b" : "#283734"} 
                strokeWidth="2"
              />
              <circle cx="20" cy="22" r="4" fill={activeChillers === 1 ? "#637571" : "#3f8f6b"} />
              <text x="32" y="25" fill={activeChillers === 1 ? "#7d8f8a" : "#f5f6f2"} fontSize="11" fontWeight="bold">
                CHILLER 02
              </text>
              <text x="20" y="46" fill="#7d8f8a" fontSize="10">
                {activeChillers === 1 ? "STANDBY (De-staged)" : "500 TR Centrifugal"}
              </text>
              <text x="20" y="65" fill="#a3b3af" fontSize="10">
                {activeChillers === 1 ? "Power: 0 kW" : `Load: 49.0% | COP: 4.8`}
              </text>
            </g>

            {/* NODE 4: SECONDARY PUMPS */}
            <g 
              transform="translate(440, 170)" 
              className="cursor-pointer"
              onClick={() => setSelectedNode("pumps")}
            >
              <rect 
                width="120" 
                height="90" 
                rx="6" 
                fill="#182220" 
                stroke={selectedNode === "pumps" ? "#3f8f6b" : "#283734"} 
                strokeWidth="2"
              />
              <text x="60" y="25" fill="#f5f6f2" fontSize="11" fontWeight="bold" textAnchor="middle">
                CHW PUMPS
              </text>
              <text x="60" y="45" fill="#7d8f8a" fontSize="9" textAnchor="middle">Primary + Secondary VFD</text>
              <text x="60" y="66" fill="#a3b3af" fontSize="10" textAnchor="middle">
                Speed: <tspan fill={currentPumpSpeed > 90 ? "#e06b5f" : "#3f8f6b"} fontWeight="bold">{currentPumpSpeed}%</tspan>
              </text>
            </g>

            {/* NODE 5: BUILDING AHUs */}
            <g 
              transform="translate(680, 110)" 
              className="cursor-pointer"
              onClick={() => setSelectedNode("building")}
            >
              <rect 
                width="150" 
                height="150" 
                rx="6" 
                fill="#182220" 
                stroke={selectedNode === "building" ? "#3f8f6b" : "#283734"} 
                strokeWidth="2"
              />
              <text x="75" y="30" fill="#f5f6f2" fontSize="12" fontWeight="bold" textAnchor="middle">
                BUILDING AHUs
              </text>
              <text x="75" y="50" fill="#7d8f8a" fontSize="9" textAnchor="middle">CyberCity Tower 4 (12 Floors)</text>
              <line x1="15" y1="65" x2="135" y2="65" stroke="#283734" />
              <text x="75" y="85" fill="#a3b3af" fontSize="10" textAnchor="middle">
                Load: <tspan fill="#f5f6f2" fontWeight="bold">{telemetry.cooling_load_tr} TR</tspan>
              </text>
              <text x="75" y="105" fill="#3ca2d9" fontSize="10" textAnchor="middle">
                Supply: <tspan fontWeight="bold">{currentChwSupply}°C</tspan>
              </text>
              <text x="75" y="125" fill={isSevereDeltaT ? "#5aaad4" : "#d89a3d"} fontSize="10" textAnchor="middle">
                Return: <tspan fontWeight="bold">{currentChwReturn}°C</tspan>
              </text>
              <text x="75" y="142" fill={isSevereDeltaT ? "#e06b5f" : "#3f8f6b"} fontSize="9" fontWeight="bold" textAnchor="middle">
                ΔT: {currentDeltaT}°C {isSevereDeltaT ? "(LOW ΔT)" : "(HEALTHY)"}
              </text>
            </g>

            {/* Bypass Valve Annotation */}
            {isSevereDeltaT && (
              <g transform="translate(565, 125)">
                <rect width="60" height="22" rx="3" fill="#c9574b" opacity="0.9" />
                <text x="30" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  BYPASS LEAK
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-[#222e2b] flex flex-wrap items-center justify-between text-xs text-[#7d8f8a] gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#3ca2d9] rounded" />
              <span>CHW Supply (Chilled)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#d89a3d] rounded" />
              <span>CHW Return (Warm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#2c7857] rounded" />
              <span>Condenser Water</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#c9574b] rounded" />
              <span>Bypass Flow (Inefficiency)</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-[#a3b3af]">
            Flow Rate: <span className="text-[#f5f6f2] font-bold">{isOptimizedMode ? "2,350" : telemetry.chw_flow_rate_gpm} GPM</span>
          </div>
        </div>
      </div>

      {/* Node Detail Inspector */}
      <div className="p-5 rounded-lg bg-[#182220] border border-[#222e2b]">
        <h3 className="text-sm font-semibold text-[#f5f6f2] mb-3">
          Equipment Telemetry Inspector: <span className="text-[#3f8f6b] uppercase">{selectedNode}</span>
        </h3>
        
        {selectedNode === "chiller-01" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Compressor Status</span>
              <p className="mt-1 font-mono font-bold text-[#3f8f6b]">RUNNING (Modulating)</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Part-Load Ratio (PLR)</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{isOptimizedMode ? "86.5%" : "51.0%"}</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Operating Specific Power</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{isOptimizedMode ? "0.58 kW/TR" : "0.72 kW/TR"}</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Evaporator Refrigerant Sat.</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">4.6°C (Safe limit: &gt;3.0°C)</p>
            </div>
          </div>
        )}

        {selectedNode === "chiller-02" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Staging Status</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">
                {activeChillers === 1 ? "STANDBY (Decanted)" : "ONLINE (Low Efficiency)"}
              </p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Compressor kW</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">{activeChillers === 1 ? "0 kW" : "162 kW"}</p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Optimization Action</span>
              <p className="mt-1 text-[#d89a3d] font-semibold">
                {activeChillers === 1 ? "De-staged: Saved ~160 kW" : "Recommended to sequence off"}
              </p>
            </div>
            <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b]">
              <span className="text-[#7d8f8a]">Condenser Approach</span>
              <p className="mt-1 font-mono font-bold text-[#f5f6f2]">3.6°C</p>
            </div>
          </div>
        )}

        {selectedNode !== "chiller-01" && selectedNode !== "chiller-02" && (
          <div className="p-3 rounded bg-[#141b1a] border border-[#222e2b] text-xs text-[#a3b3af]">
            Component operating within physics constraints. Select Chiller 01 or Chiller 02 to inspect thermodynamic lift, PLR, and Gordon-Ng specific power metrics.
          </div>
        )}
      </div>
    </div>
  );
};
