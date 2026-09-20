export interface TelemetryData {
  timestamp: string;
  mode: "SIMULATED" | "OBSERVED" | "MODELED";
  scenario_id: string;
  cooling_load_tr: number;
  chw_supply_temp: number;
  chw_return_temp: number;
  actual_delta_t: number;
  expected_delta_t: number;
  chw_flow_rate_gpm: number;
  condenser_supply_temp: number;
  condenser_return_temp: number;
  wet_bulb_temp: number;
  ambient_temp: number;
  relative_humidity: number;
  total_plant_power_kw: number;
  chiller_power_kw: number;
  pump_power_kw: number;
  tower_power_kw: number;
  plant_efficiency_kw_per_tr: number;
  active_chillers: number;
  pump_speed_pct: number;
  chiller_details: {
    id: string;
    name: string;
    status: string;
    load_pct: number;
    power_kw: number;
    cop: number;
    kw_per_tr: number;
  }[];
  pump_details: {
    id: string;
    name: string;
    speed_hz: number;
    power_kw: number;
    status: string;
  }[];
  cooling_tower_details: {
    id: string;
    name: string;
    approach_temp: number;
    fan_speed_pct: number;
    power_kw: number;
    status: string;
  }[];
}

export interface AnomalyItem {
  id: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  category: string;
  title: string;
  equipment_id?: string;
  observed_condition: string;
  expected_condition: string;
  estimated_impact: string;
  probable_causes: string[];
  recommended_action: string;
  status: string;
  detected_at: string;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  mode: string;
  cooling_load_tr: number;
  current_state: {
    chw_supply_temp: number;
    chw_return_temp: number;
    delta_t: number;
    pump_speed_pct: number;
    active_chillers: number;
    flow_rate_gpm: number;
    total_power_kw: number;
    chiller_power_kw: number;
    pump_power_kw: number;
    tower_power_kw: number;
    efficiency_kw_per_tr: number;
  };
  optimized_state: {
    chw_supply_temp: number;
    chw_return_temp: number;
    delta_t: number;
    pump_speed_pct: number;
    active_chillers: number;
    flow_rate_gpm: number;
    total_power_kw: number;
    chiller_power_kw: number;
    pump_power_kw: number;
    tower_power_kw: number;
    efficiency_kw_per_tr: number;
  };
  power_reduction_kw: number;
  percentage_reduction: number;
  monthly_cost_savings_inr: number;
  annual_cost_savings_inr: number;
  monthly_co2_reduction_tonnes: number;
  annual_co2_reduction_tonnes: number;
  analysis_steps: string[];
  engineering_rationale: string;
  constraints_satisfied: boolean;
}

export interface PlantOverview {
  plant_id: string;
  plant_name: string;
  location: string;
  system_status: "OPTIMAL" | "NEEDS ATTENTION" | "ALERT";
  current_scenario: {
    id: string;
    name: string;
    description: string;
  };
  available_scenarios: {
    id: string;
    name: string;
    description: string;
  }[];
  metrics: {
    cooling_load_tr: number;
    plant_power_kw: number;
    plant_efficiency_kw_per_tr: number;
    actual_delta_t: number;
    expected_delta_t: number;
    delta_t_status: "CRITICAL" | "WARNING" | "HEALTHY";
    active_anomalies_count: number;
    estimated_savings_opportunity_inr_month: number;
    estimated_co2_reduction_tonnes_month: number;
    modeled_power_reduction_pct: number;
  };
  telemetry_snapshot: TelemetryData;
  recent_anomalies: AnomalyItem[];
}
