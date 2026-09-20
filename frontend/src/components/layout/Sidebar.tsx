import React from "react";
import { 
  Activity, 
  Cpu, 
  GitBranch, 
  AlertTriangle, 
  Zap, 
  Bot, 
  TrendingDown, 
  FileText, 
  Settings,
  HelpCircle,
  ShieldCheck,
  Building2
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  anomaliesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, anomaliesCount }) => {
  const navItems = [
    { id: "overview", label: "Executive Overview", icon: Activity },
    { id: "digital-twin", label: "Digital Twin", icon: GitBranch, badge: "Live Flow" },
    { id: "delta-t", label: "ΔT Intelligence", icon: Cpu, badge: "Core" },
    { id: "anomalies", label: "Anomaly Center", icon: AlertTriangle, count: anomaliesCount },
    { id: "optimization", label: "Constrained Optimizer", icon: Zap },
    { id: "ai-operations", label: "ThermaLoop Copilot", icon: Bot },
    { id: "impact", label: "Impact & Verification", icon: TrendingDown },
    { id: "reports", label: "Operations Reports", icon: FileText },
    { id: "settings", label: "Plant Configuration", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141b1a] border-r border-[#222e2b] flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#222e2b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#3f8f6b] to-[#255f46] flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-base tracking-tighter">TL</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#f5f6f2] tracking-tight text-base">THERMALOOP</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#222e2b] text-[#3f8f6b] font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#7d8f8a] truncate">Commercial Cooling Intelligence</p>
            </div>
          </div>
        </div>

        {/* Facility Card */}
        <div className="mx-3 my-3 p-2.5 rounded bg-[#182220] border border-[#222e2b]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#c4d1cd]">
            <Building2 className="w-3.5 h-3.5 text-[#3f8f6b]" />
            <span className="truncate">CyberCity Tower 4</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#7d8f8a]">
            <span>1,000 TR Plant</span>
            <span className="text-[#3f8f6b] font-mono">Gurugram, IN</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#212f2c] text-[#f5f6f2] border-l-2 border-[#3f8f6b]"
                    : "text-[#8ea09b] hover:bg-[#1a2422] hover:text-[#e1ebe7]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#3f8f6b]" : "text-[#637571]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#c9574b]/20 text-[#e06b5f] border border-[#c9574b]/30">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-[#1d2725] text-[#7d8f8a]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#222e2b] bg-[#121817]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3f8f6b] animate-pulse" />
            <span className="text-[11px] font-medium text-[#c4d1cd]">Simulation Active</span>
          </div>
          <span className="text-[10px] font-mono text-[#637571]">BACnet/IP</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#7d8f8a]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#3f8f6b]" />
            Safety Interlocks
          </span>
          <span className="text-[#3f8f6b] font-mono">ARMED</span>
        </div>
      </div>
    </aside>
  );
};
