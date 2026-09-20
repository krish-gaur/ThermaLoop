from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class EquipmentDTO(BaseModel):
    id: str
    name: str
    type: str
    status: str
    capacity: float
    rated_power_kw: float
    vfd_equipped: bool
    current_speed_hz: float
    current_load_pct: float
    current_power_kw: float
    cop: float
    kw_per_tr: float

class TelemetryDTO(BaseModel):
    timestamp: datetime
    mode: str
    scenario_id: str
    cooling_load_tr: float
    chw_supply_temp: float
    chw_return_temp: float
    actual_delta_t: float
    expected_delta_t: float
    chw_flow_rate_gpm: float
    condenser_supply_temp: float
    condenser_return_temp: float
    wet_bulb_temp: float
    ambient_temp: float
    relative_humidity: float
    total_plant_power_kw: float
    chiller_power_kw: float
    pump_power_kw: float
    tower_power_kw: float
    plant_efficiency_kw_per_tr: float
    active_chillers: int
    pump_speed_pct: float

class AnomalyDTO(BaseModel):
    id: str
    severity: str
    category: str
    title: str
    equipment_id: Optional[str]
    observed_condition: str
    expected_condition: str
    estimated_impact: str
    probable_causes: List[str]
    recommended_action: str
    status: str
    detected_at: datetime

class OptimizationRequest(BaseModel):
    plant_id: str = "plant-cybercity-01"
    target_comfort_max_temp: float = 24.5
    allow_chiller_staging: bool = True
    clamp_min_delta_t: float = 4.8

class OptimizationResultDTO(BaseModel):
    id: str
    timestamp: datetime
    mode: str = "MODELED RESULT"
    cooling_load_tr: float
    current_state: Dict[str, Any]
    optimized_state: Dict[str, Any]
    power_reduction_kw: float
    percentage_reduction: float
    monthly_cost_savings_inr: float
    annual_cost_savings_inr: float
    monthly_co2_reduction_tonnes: float
    annual_co2_reduction_tonnes: float
    analysis_steps: List[str]
    engineering_rationale: str
    constraints_satisfied: bool

class AIChatRequest(BaseModel):
    query: str
    plant_id: str = "plant-cybercity-01"
    include_optimization: bool = True

class AIChatResponse(BaseModel):
    query: str
    response: str
    tools_invoked: List[str]
    plant_status_summary: Dict[str, Any]
    suggested_actions: List[str]

class ScenarioApplyRequest(BaseModel):
    scenario_id: str # normal, low_delta_t, high_load, excessive_pumping, chiller_degradation

class ImpactOverviewDTO(BaseModel):
    baseline_annual_kwh: float
    modeled_annual_kwh: float
    projected_annual_kwh_savings: float
    projected_annual_cost_savings_inr: float
    projected_annual_co2_avoided_tonnes: float
    monthly_trend: List[Dict[str, Any]]
    equipment_breakdown: List[Dict[str, Any]]
