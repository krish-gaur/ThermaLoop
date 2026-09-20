from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from datetime import datetime, timezone
import uuid

from app.schemas.plant_dto import (
    TelemetryDTO, AnomalyDTO, OptimizationRequest,
    OptimizationResultDTO, AIChatRequest, AIChatResponse,
    ScenarioApplyRequest, ImpactOverviewDTO
)
from app.services.simulation_engine import simulation_engine, SCENARIO_CONFIGS
from app.services.anomaly_engine import anomaly_engine
from app.services.optimization_engine import optimization_engine
from app.services.impact_engine import impact_engine
from app.services.ai_agent import ai_agent

router = APIRouter()

# Keep in-memory cache for recent runs
_last_optimization_cache = None

@router.get("/plant/overview")
def get_plant_overview():
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    opt_result = optimization_engine.run_optimization(telemetry)
    global _last_optimization_cache
    _last_optimization_cache = opt_result

    return {
        "plant_id": "plant-cybercity-01",
        "plant_name": "CyberCity DLF Gateway Tower",
        "location": "Gurugram, National Capital Region (NCR), India",
        "system_status": "NEEDS ATTENTION" if telemetry["actual_delta_t"] < 3.5 else "OPTIMAL",
        "current_scenario": simulation_engine.get_current_scenario_meta(),
        "available_scenarios": [
            {"id": k, "name": v["name"], "description": v["description"]}
            for k, v in SCENARIO_CONFIGS.items()
        ],
        "metrics": {
            "cooling_load_tr": telemetry["cooling_load_tr"],
            "plant_power_kw": telemetry["total_plant_power_kw"],
            "plant_efficiency_kw_per_tr": telemetry["plant_efficiency_kw_per_tr"],
            "actual_delta_t": telemetry["actual_delta_t"],
            "expected_delta_t": telemetry["expected_delta_t"],
            "delta_t_status": "CRITICAL" if telemetry["actual_delta_t"] < 3.2 else "WARNING" if telemetry["actual_delta_t"] < 4.5 else "HEALTHY",
            "active_anomalies_count": len(anomalies),
            "estimated_savings_opportunity_inr_month": opt_result["monthly_cost_savings_inr"],
            "estimated_co2_reduction_tonnes_month": opt_result["monthly_co2_reduction_tonnes"],
            "modeled_power_reduction_pct": opt_result["percentage_reduction"]
        },
        "telemetry_snapshot": telemetry,
        "recent_anomalies": anomalies[:3]
    }

@router.get("/plant/telemetry")
def get_telemetry():
    return simulation_engine.compute_telemetry()

@router.get("/plant/equipment")
def get_equipment():
    telemetry = simulation_engine.compute_telemetry()
    return {
        "plant_id": "plant-cybercity-01",
        "chillers": telemetry["chiller_details"],
        "pumps": telemetry["pump_details"],
        "cooling_towers": telemetry["cooling_tower_details"],
        "ambient": {
            "ambient_temp": telemetry["ambient_temp"],
            "wet_bulb_temp": telemetry["wet_bulb_temp"],
            "relative_humidity": telemetry["relative_humidity"]
        }
    }

@router.get("/anomalies")
def get_anomalies():
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    return {
        "total_count": len(anomalies),
        "critical_count": sum(1 for a in anomalies if a["severity"] == "CRITICAL"),
        "warning_count": sum(1 for a in anomalies if a["severity"] == "WARNING"),
        "advisory_count": sum(1 for a in anomalies if a["severity"] == "ADVISORY"),
        "anomalies": anomalies
    }

@router.post("/anomalies/analyze")
def analyze_anomaly(payload: Dict[str, Any]):
    anomaly_id = payload.get("anomaly_id")
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    target = next((a for a in anomalies if a["id"] == anomaly_id), None)
    if not target and anomalies:
        target = anomalies[0]
    return {
        "anomaly": target,
        "telemetry_context": telemetry,
        "engineering_recommendation": "Perform dynamic setpoint optimization and verify differential pressure setpoint."
    }

@router.post("/optimization/run")
def run_optimization(request: OptimizationRequest = None):
    telemetry = simulation_engine.compute_telemetry()
    result = optimization_engine.run_optimization(telemetry)
    global _last_optimization_cache
    _last_optimization_cache = result
    return result

@router.get("/optimization/results")
def get_optimization_results():
    global _last_optimization_cache
    if _last_optimization_cache is None:
        telemetry = simulation_engine.compute_telemetry()
        _last_optimization_cache = optimization_engine.run_optimization(telemetry)
    return _last_optimization_cache

@router.post("/ai/chat")
async def chat_with_ai(payload: AIChatRequest):
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    global _last_optimization_cache
    if _last_optimization_cache is None:
        _last_optimization_cache = optimization_engine.run_optimization(telemetry)
    scenario_meta = simulation_engine.get_current_scenario_meta()

    response = await ai_agent.run(
        query=payload.query,
        telemetry=telemetry,
        anomalies=anomalies,
        opt_result=_last_optimization_cache,
        scenario_meta=scenario_meta
    )
    return response

@router.post("/scenarios/apply")
def apply_scenario(payload: ScenarioApplyRequest):
    success = simulation_engine.set_scenario(payload.scenario_id)
    if not success:
        raise HTTPException(status_code=400, detail=f"Invalid scenario: {payload.scenario_id}")
    
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    opt_result = optimization_engine.run_optimization(telemetry)
    global _last_optimization_cache
    _last_optimization_cache = opt_result

    return {
        "status": "APPLIED",
        "scenario": simulation_engine.get_current_scenario_meta(),
        "telemetry": telemetry,
        "anomalies_count": len(anomalies),
        "opt_result": opt_result
    }

@router.get("/impact")
def get_impact():
    telemetry = simulation_engine.compute_telemetry()
    global _last_optimization_cache
    if _last_optimization_cache is None:
        _last_optimization_cache = optimization_engine.run_optimization(telemetry)
    
    return impact_engine.calculate_impact(telemetry, _last_optimization_cache)

@router.post("/reports/generate")
def generate_report():
    telemetry = simulation_engine.compute_telemetry()
    anomalies = anomaly_engine.evaluate(telemetry)
    global _last_optimization_cache
    if _last_optimization_cache is None:
        _last_optimization_cache = optimization_engine.run_optimization(telemetry)
    impact = impact_engine.calculate_impact(telemetry, _last_optimization_cache)
    scenario_meta = simulation_engine.get_current_scenario_meta()

    report_id = f"REP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"

    return {
        "report_id": report_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "plant_meta": {
            "name": "CyberCity DLF Gateway Tower",
            "capacity": "1,000 TR Centrifugal Water-Cooled Plant",
            "location": "Gurugram, NCR, India",
            "operating_scenario": scenario_meta["name"]
        },
        "executive_summary": (
            f"This operational performance report evaluates the chilled-water central plant under active operating conditions. "
            f"The plant is currently utilizing {telemetry['cooling_load_tr']} TR of thermal capacity and consuming {telemetry['total_plant_power_kw']} kW. "
            f"ThermaLoop has diagnosed a low ΔT deviation of {telemetry['actual_delta_t']}°C vs 5.5°C design baseline. "
            f"Constrained supervisory setpoint optimization indicates a potential power reduction of {round(_last_optimization_cache['power_reduction_kw'], 1)} kW "
            f"({_last_optimization_cache['percentage_reduction']}%), translating to an estimated annual cost savings of "
            f"₹{impact['projected_annual_cost_savings_inr']:,.0f} and {impact['projected_annual_co2_avoided_tonnes']} tonnes of CO2 avoidance."
        ),
        "key_metrics": {
            "cooling_load_tr": telemetry["cooling_load_tr"],
            "plant_power_kw": telemetry["total_plant_power_kw"],
            "efficiency_kw_per_tr": telemetry["plant_efficiency_kw_per_tr"],
            "actual_delta_t": telemetry["actual_delta_t"],
            "expected_delta_t": telemetry["expected_delta_t"],
            "modeled_power_reduction_pct": _last_optimization_cache["percentage_reduction"]
        },
        "active_anomalies": anomalies,
        "optimization_recommendations": [
            {
                "parameter": "Chilled Water Supply Temperature",
                "current": f"{_last_optimization_cache['current_state']['chw_supply_temp']}°C",
                "recommended": f"{_last_optimization_cache['optimized_state']['chw_supply_temp']}°C",
                "benefit": "Reduces compressor lift, yielding ~2.4% compressor efficiency improvement"
            },
            {
                "parameter": "Secondary Distribution Pump Speed",
                "current": f"{_last_optimization_cache['current_state']['pump_speed_pct']}%",
                "recommended": f"{_last_optimization_cache['optimized_state']['pump_speed_pct']}%",
                "benefit": "Eliminates excessive bypass pumping via affinity law cubic reduction"
            },
            {
                "parameter": "Chiller Staging",
                "current": f"{_last_optimization_cache['current_state']['active_chillers']} Chillers Online",
                "recommended": f"{_last_optimization_cache['optimized_state']['active_chillers']} Chiller Online",
                "benefit": "Concentrates load to optimal 85-95% PLR sweet spot, eliminating auxiliary pump parasitic drag"
            }
        ],
        "projected_outcomes": {
            "annual_kwh_savings": impact["projected_annual_kwh_savings"],
            "annual_cost_savings_inr": impact["projected_annual_cost_savings_inr"],
            "annual_co2_avoidance_tonnes": impact["projected_annual_co2_avoided_tonnes"]
        }
    }
