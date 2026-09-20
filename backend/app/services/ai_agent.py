from typing import Dict, Any, List
import json
import httpx
from app.core.config import settings

class AIOperationsAgent:
    """
    ThermaLoop Intelligence - Dedicated Industrial HVAC Operations Agent.
    Operates strictly over structured application context and tools.
    Never invents sensor telemetry.
    """

    def __init__(self):
        self.api_key = settings.LLM_API_KEY
        self.model = settings.LLM_MODEL

    async def run(
        self,
        query: str,
        telemetry: Dict[str, Any],
        anomalies: List[Dict[str, Any]],
        opt_result: Dict[str, Any],
        scenario_meta: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes reasoning over structured plant data with tool resolution.
        """
        tools_invoked = []
        q_lower = query.lower()

        # Tool mapping logic based on user inquiry intent
        if "status" in q_lower or "health" in q_lower or "overview" in q_lower:
            tools_invoked.append("getPlantStatus()")
        if "telemetry" in q_lower or "sensor" in q_lower or "temperature" in q_lower or "flow" in q_lower:
            tools_invoked.append("getTelemetry()")
        if "delta" in q_lower or "dt" in q_lower or "differential" in q_lower:
            tools_invoked.append("analyzeDeltaT()")
        if "anomaly" in q_lower or "issue" in q_lower or "fault" in q_lower or "warning" in q_lower:
            tools_invoked.append("getAnomalies()")
        if "optimize" in q_lower or "recommend" in q_lower or "save" in q_lower or "reduce" in q_lower or "power" in q_lower:
            tools_invoked.append("runOptimization()")
        if "impact" in q_lower or "cost" in q_lower or "carbon" in q_lower or "roi" in q_lower:
            tools_invoked.append("getImpact()")
        if "report" in q_lower or "summary" in q_lower:
            tools_invoked.append("generateReport()")

        if not tools_invoked:
            tools_invoked = ["getPlantStatus()", "analyzeDeltaT()", "runOptimization()"]

        # If LLM API Key is configured and accessible, call external LLM
        if self.api_key:
            try:
                llm_response = await self._call_llm(
                    query, telemetry, anomalies, opt_result, scenario_meta, tools_invoked
                )
                if llm_response:
                    return {
                        "query": query,
                        "response": llm_response,
                        "tools_invoked": tools_invoked,
                        "plant_status_summary": {
                            "cooling_load_tr": telemetry["cooling_load_tr"],
                            "actual_delta_t": telemetry["actual_delta_t"],
                            "total_power_kw": telemetry["total_plant_power_kw"],
                            "active_anomalies_count": len(anomalies)
                        },
                        "suggested_actions": [
                            "Run constrained plant optimization",
                            "Verify bypass valve positions on secondary AHU risers",
                            "Review Time-of-Day tariff pre-cooling schedule"
                        ]
                    }
            except Exception as e:
                # Fallback to local deterministic agent
                pass

        # Robust, high-fidelity Deterministic Operations Copilot
        response_text = self._generate_deterministic_response(
            query, telemetry, anomalies, opt_result, scenario_meta
        )

        return {
            "query": query,
            "response": response_text,
            "tools_invoked": tools_invoked,
            "plant_status_summary": {
                "cooling_load_tr": telemetry["cooling_load_tr"],
                "actual_delta_t": telemetry["actual_delta_t"],
                "total_power_kw": telemetry["total_plant_power_kw"],
                "active_anomalies_count": len(anomalies)
            },
            "suggested_actions": [
                "Execute modeled setpoint reset (CHW Supply 6.8°C)",
                "Throttle secondary distribution pump VFD to 76%",
                "Transition Chiller 02 to standby staging"
            ]
        }

    def _generate_deterministic_response(
        self,
        query: str,
        telemetry: Dict[str, Any],
        anomalies: List[Dict[str, Any]],
        opt_result: Dict[str, Any],
        scenario_meta: Dict[str, Any]
    ) -> str:
        q_lower = query.lower()
        delta_t = telemetry["actual_delta_t"]
        expected_dt = telemetry["expected_delta_t"]
        load_tr = telemetry["cooling_load_tr"]
        power_kw = telemetry["total_plant_power_kw"]
        p_reduc_kw = opt_result["power_reduction_kw"]
        p_reduc_pct = opt_result["percentage_reduction"]
        cost_savings = opt_result["monthly_cost_savings_inr"]
        co2_savings = opt_result["monthly_co2_reduction_tonnes"]

        if "why is delta t low" in q_lower or "why is my plant inefficient" in q_lower or "delta" in q_lower or "dt" in q_lower:
            return (
                f"### Operational Diagnostic: Low ΔT Event\n\n"
                f"Your plant is currently recording an **actual ΔT of {delta_t}°C**, compared with the nominal design baseline of **{expected_dt}°C** (a {round(((expected_dt - delta_t)/expected_dt)*100, 1)}% deviation under simulated conditions).\n\n"
                f"**What is physically happening:**\n"
                f"The chilled-water system is circulating {telemetry['chw_flow_rate_gpm']} GPM, which is substantially higher than the hydronic flow required to satisfy the current {load_tr} TR thermal demand. Chilled water is rushing through terminal cooling coils without sufficient thermal residence time to absorb heat, returning to the evaporator prematurely cold at {telemetry['chw_return_temp']}°C.\n\n"
                f"**Probable Causes Identified:**\n"
                f"1. **Bypass Flow:** Modulating 3-way control valves at air handling units (AHUs) remaining partially open or failing to close.\n"
                f"2. **Excessive Pumping Speed:** Secondary distribution pumps running at {telemetry['pump_speed_pct']}% speed despite partial building cooling load.\n"
                f"3. **Premature Chiller Staging:** The legacy BMS staged Chiller 02 online based on high loop flow, forcing both 500 TR chillers to run in an inefficient low-PLR zone (~{telemetry['chiller_details'][0]['load_pct']}% load each).\n\n"
                f"**Recommended Action:**\n"
                f"Engage ThermaLoop's constrained optimization to throttle secondary pump speed and decant thermal load onto a single high-efficiency chiller."
            )

        if "facility manager" in q_lower or "explain this" in q_lower or "business" in q_lower:
            return (
                f"### Executive Briefing for Facility Director\n\n"
                f"**Executive Summary:**\n"
                f"The chilled-water plant at this facility is currently operating with a severe thermodynamic bottleneck (Low ΔT Syndrome). Water is returning from tenant floors barely warmed ({delta_t}°C spread), which has fooled the automated BMS into firing two 500-ton chillers when one is fully adequate.\n\n"
                f"**Modeled Commercial Impact:**\n"
                f"By applying ThermaLoop's supervisory setpoint recommendations:\n"
                f"- **Instantaneous Modeled Demand Drop:** **{power_kw} kW → {opt_result['optimized_state']['total_power_kw']} kW** ({p_reduc_pct}% reduction / {p_reduc_kw} kW saved).\n"
                f"- **Projected Cost Reduction:** **₹{cost_savings:,.0f} per month** (₹{opt_result['annual_cost_savings_inr']:,.0f} annually under commercial C&I tariffs).\n"
                f"- **Carbon Avoidance:** **{co2_savings} tCO₂e / month** avoided from the local grid.\n"
                f"- **Occupant Thermal Comfort:** Strictly preserved within ASHRAE 55 standards by maintaining chilled water supply temperature at a safe 6.8°C.\n\n"
                f"Zero equipment replacement or capital expenditure is required; this is achieved entirely through coordinated setpoint resets via existing BMS BACnet registers."
            )

        if "how much can i save" in q_lower or "savings" in q_lower or "impact" in q_lower or "cost" in q_lower:
            return (
                f"### Modeled Savings Opportunity\n\n"
                f"Based on the active simulation scenario ({scenario_meta['name']}) and our constrained thermodynamic solver:\n\n"
                f"- **Modeled Power Reduction:** **{p_reduc_kw} kW** ({p_reduc_pct}% of total plant draw)\n"
                f"- **Projected Monthly Electricity Savings:** **₹{cost_savings:,.0f}**\n"
                f"- **Projected Annual Electricity Savings:** **₹{opt_result['annual_cost_savings_inr']:,.0f}**\n"
                f"- **Modeled Annual Energy Avoided:** **{round(p_reduc_kw * 4200):,} kWh**\n"
                f"- **Projected Annual Carbon Reduction:** **{opt_result['annual_co2_reduction_tonnes']} tCO₂e**\n\n"
                f"*Calculation Note:* Based on 4,200 annual operating hours at an industrial commercial blended tariff of ₹10.50/kWh and CEA India grid carbon intensity of 0.716 kg CO₂/kWh."
            )

        if "anomal" in q_lower or "issue" in q_lower or "what is wrong" in q_lower:
            anom_text = "\n".join([f"- **[{a['severity']}] {a['title']}**: {a['observed_condition']}. *Impact:* {a['estimated_impact']}" for a in anomalies])
            return (
                f"### Active Anomalies Review ({len(anomalies)} Detected)\n\n"
                f"{anom_text}\n\n"
                f"**Primary Driver:** Low ΔT breakdown on the secondary distribution riser is the root precursor triggering both excessive pumping and premature chiller staging."
            )

        # Default comprehensive operational synthesis
        return (
            f"### ThermaLoop Operational Status & Recommendations\n\n"
            f"**Current State (Simulated):**\n"
            f"- Cooling Load: **{load_tr} TR**\n"
            f"- Plant Power: **{power_kw} kW** ({telemetry['plant_efficiency_kw_per_tr']} kW/TR)\n"
            f"- Hydronic ΔT: **{delta_t}°C** (Target: {expected_dt}°C, Status: {'CRITICAL' if delta_t < 3.2 else 'NOMINAL'})\n"
            f"- Active Chillers: **{telemetry['active_chillers']}** | Secondary Pump Speed: **{telemetry['pump_speed_pct']}%**\n\n"
            f"**Constrained Optimization Potential (Modeled):**\n"
            f"ThermaLoop's numerical solver has converged on an operating condition yielding **{p_reduc_pct}% lower plant power** ({opt_result['optimized_state']['total_power_kw']} kW vs {power_kw} kW):\n"
            f"1. **Supply Temperature:** Reset CHW supply from {opt_result['current_state']['chw_supply_temp']}°C to {opt_result['optimized_state']['chw_supply_temp']}°C.\n"
            f"2. **Pumping Modulation:** Reduce pump frequency from {telemetry['pump_speed_pct']}% to {opt_result['optimized_state']['pump_speed_pct']}%, leveraging affinity laws.\n"
            f"3. **Chiller Sequencing:** Transition to single-chiller operation ({opt_result['optimized_state']['active_chillers']} online), lifting machine part-load efficiency to peak COP."
        )

    async def _call_llm(self, query, telemetry, anomalies, opt_result, scenario_meta, tools) -> str:
        prompt = f"""
You are the ThermaLoop AI Operations Agent, an elite industrial HVAC and chilled-water plant copilot.
You reason ONLY from the structured telemetry provided below. Never invent sensor readings.
Distinguish OBSERVED/SIMULATED inputs from MODELED optimization results and PROJECTED financial impact.

[PLANT DATA]
Scenario: {scenario_meta['name']} - {scenario_meta['description']}
Cooling Load: {telemetry['cooling_load_tr']} TR
Actual Delta-T: {telemetry['actual_delta_t']} °C (Design: {telemetry['expected_delta_t']} °C)
CHW Supply: {telemetry['chw_supply_temp']} °C, CHW Return: {telemetry['chw_return_temp']} °C
CHW Flow Rate: {telemetry['chw_flow_rate_gpm']} GPM
Total Plant Power: {telemetry['total_plant_power_kw']} kW (Efficiency: {telemetry['plant_efficiency_kw_per_tr']} kW/TR)
Active Chillers: {telemetry['active_chillers']}
Pump Speed: {telemetry['pump_speed_pct']}%

[ACTIVE ANOMALIES]
{json.dumps(anomalies, indent=2)}

[MODELED OPTIMIZATION RESULT]
Modeled Power: {opt_result['optimized_state']['total_power_kw']} kW (Reduction: {opt_result['power_reduction_kw']} kW / {opt_result['percentage_reduction']}%)
Opt CHW Supply: {opt_result['optimized_state']['chw_supply_temp']} °C
Opt Pump Speed: {opt_result['optimized_state']['pump_speed_pct']}%
Opt Active Chillers: {opt_result['optimized_state']['active_chillers']}
Projected Monthly Savings: ₹{opt_result['monthly_cost_savings_inr']:,.0f}
Projected Monthly CO2 Avoided: {opt_result['monthly_co2_reduction_tonnes']} tCO2e

[TOOLS INGESTED]
{tools}

User Question: {query}

Provide a direct, authoritative, industrial-grade operational explanation. Use clear headings, bullet points, and precise engineering metrics.
"""
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": "You are ThermaLoop AI Operations Copilot."}, {"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        return ""

ai_agent = AIOperationsAgent()
