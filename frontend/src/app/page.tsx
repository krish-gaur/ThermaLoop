"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { OverviewView } from "../components/dashboard/OverviewView";
import { DigitalTwinView } from "../components/digital-twin/DigitalTwinView";
import { DeltaTIntelligenceView } from "../components/delta-t/DeltaTView";
import { AnomaliesView } from "../components/anomalies/AnomaliesView";
import { OptimizationView } from "../components/optimization/OptimizationView";
import { AIOperationsView } from "../components/ai/AIOperationsView";
import { ImpactView } from "../components/impact/ImpactView";
import { ReportsView } from "../components/reports/ReportsView";
import { SettingsView } from "../components/settings/SettingsView";
import { LandingPage } from "../components/landing/LandingPage";
import { PlantOverview, OptimizationResult, AnomalyItem } from "../types";

export default function Home() {
  const [inApp, setInApp] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [overview, setOverview] = useState<PlantOverview | null>(null);
  const [optResult, setOptResult] = useState<OptimizationResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string>("low_delta_t");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isOptimizedTwinMode, setIsOptimizedTwinMode] = useState<boolean>(false);
  const [presetAIQuery, setPresetAIQuery] = useState<string>("");

  // Fetch initial data
  const fetchData = async (scenarioToApply?: string) => {
    try {
      if (scenarioToApply) {
        await fetch("/api/v1/scenarios/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario_id: scenarioToApply }),
        });
      }

      const [resOverview, resOpt, resAnom] = await Promise.all([
        fetch("/api/v1/plant/overview"),
        fetch("/api/v1/optimization/results"),
        fetch("/api/v1/anomalies")
      ]);

      const [dataOverview, dataOpt, dataAnom] = await Promise.all([
        resOverview.json(),
        resOpt.json(),
        resAnom.json()
      ]);

      setOverview(dataOverview);
      setOptResult(dataOpt);
      setAnomalies(dataAnom.anomalies || []);
      setCurrentScenario(dataOverview.current_scenario.id);
    } catch (err) {
      console.error("Failed to fetch plant telemetry", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectScenario = async (scenarioId: string) => {
    setCurrentScenario(scenarioId);
    setIsOptimizedTwinMode(false);
    await fetchData(scenarioId);
  };

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const resp = await fetch("/api/v1/optimization/run", { method: "POST" });
      const data = await resp.json();
      setOptResult(data);
      setIsOptimizedTwinMode(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAskAIWithPrompt = (query: string) => {
    setPresetAIQuery(query);
    setCurrentTab("ai-operations");
  };

  if (!inApp) {
    return <LandingPage onEnterApp={() => setInApp(true)} />;
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-[#111615] flex items-center justify-center text-[#f5f6f2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3f8f6b]/30 border-t-[#3f8f6b] rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#8ea09b]">Ingesting Chiller Plant Digital Telemetry...</span>
        </div>
      </div>
    );
  }

  const telemetry = overview.telemetry_snapshot;

  return (
    <div className="flex h-screen bg-[#111615] text-[#f5f6f2] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        anomaliesCount={anomalies.length}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          ambientTemp={telemetry.ambient_temp}
          wetBulbTemp={telemetry.wet_bulb_temp}
          onQuickOptimize={handleRunOptimization}
          isOptimizing={isOptimizing}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-[#111615]">
          {currentTab === "overview" && (
            <OverviewView
              overview={overview}
              optResult={optResult}
              onNavigateTab={setCurrentTab}
              onRunOptimization={handleRunOptimization}
              isOptimizing={isOptimizing}
            />
          )}

          {currentTab === "digital-twin" && (
            <DigitalTwinView
              telemetry={telemetry}
              isOptimizedMode={isOptimizedTwinMode}
              setIsOptimizedMode={setIsOptimizedTwinMode}
            />
          )}

          {currentTab === "delta-t" && (
            <DeltaTIntelligenceView
              telemetry={telemetry}
              onRunOptimization={handleRunOptimization}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === "anomalies" && (
            <AnomaliesView
              anomalies={anomalies}
              onAskAI={handleAskAIWithPrompt}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "optimization" && (
            <OptimizationView
              optResult={optResult}
              onRunOptimization={handleRunOptimization}
              isOptimizing={isOptimizing}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "ai-operations" && (
            <AIOperationsView
              telemetry={telemetry}
              anomalies={anomalies}
              optResult={optResult}
              onRunOptimization={handleRunOptimization}
              presetQuery={presetAIQuery}
            />
          )}

          {currentTab === "impact" && (
            <ImpactView telemetry={telemetry} optResult={optResult} />
          )}

          {currentTab === "reports" && (
            <ReportsView overview={overview} optResult={optResult} />
          )}

          {currentTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
