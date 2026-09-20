import math
from datetime import datetime, timezone
from typing import Dict, Any, List

SCENARIO_CONFIGS = {
    "normal": {
        "name": "Normal Operation",
        "description": "Plant operating within nominal ASHRAE/BEE design envelopes. Healthy ΔT and balanced pumping.",
        "cooling_load_tr": 680.0,
        "chw_supply_temp": 6.8,
        "actual_delta_t": 5.4,
        "expected_delta_t": 5.5,
        "active_chillers": 2,
        "pump_speed_pct": 74.0,
        "ambient_temp": 34.0,
        "wet_bulb_temp": 24.5,
        "relative_humidity": 52.0,
        "condenser_approach": 2.8,
        "chiller1_degraded": False,
        "chiller2_degraded": False,
    },
    "low_delta_t": {
        "name": "Low ΔT Event",
        "description": "Secondary AHU bypass valves passing cold water directly back to plant. Flow is high, ΔT collapses to 2.8°C, forcing Chiller 2 to run at poor part-load.",
        "cooling_load_tr": 510.0,
        "chw_supply_temp": 6.0,
        "actual_delta_t": 2.8,
        "expected_delta_t": 5.5,
        "active_chillers": 2,
        "pump_speed_pct": 94.0,
        "ambient_temp": 38.0,
        "wet_bulb_temp": 26.0,
        "relative_humidity": 45.0,
        "condenser_approach": 3.6,
        "chiller1_degraded": False,
        "chiller2_degraded": False,
    },
    "high_load": {
        "name": "High Cooling Load",
        "description": "Extreme summer peak afternoon condition (42°C ambient) with near 92% plant thermal utilization.",
        "cooling_load_tr": 920.0,
        "chw_supply_temp": 6.2,
        "actual_delta_t": 4.9,
        "expected_delta_t": 5.5,
        "active_chillers": 2,
        "pump_speed_pct": 96.0,
        "ambient_temp": 42.0,
        "wet_bulb_temp": 28.5,
        "relative_humidity": 48.0,
        "condenser_approach": 4.2,
        "chiller1_degraded": False,
        "chiller2_degraded": False,
    },
    "excessive_pumping": {
        "name": "Excessive Pumping",
        "description": "Primary/Secondary pumps locked at 50 Hz despite low partial building load. Pumping power accounts for over 28% of plant power.",
        "cooling_load_tr": 440.0,
        "chw_supply_temp": 6.4,
        "actual_delta_t": 3.2,
        "expected_delta_t": 5.5,
        "active_chillers": 1,
        "pump_speed_pct": 98.0,
        "ambient_temp": 32.0,
        "wet_bulb_temp": 23.0,
        "relative_humidity": 50.0,
        "condenser_approach": 3.0,
        "chiller1_degraded": False,
        "chiller2_degraded": False,
    },
    "chiller_degradation": {
        "name": "Chiller Degradation",
        "description": "Chiller 02 condenser tube scaling or refrigerant leakage resulting in elevated compressor lift and high kW/TR (0.92 kW/TR).",
        "cooling_load_tr": 650.0,
        "chw_supply_temp": 6.2,
        "actual_delta_t": 4.6,
        "expected_delta_t": 5.5,
        "active_chillers": 2,
        "pump_speed_pct": 82.0,
        "ambient_temp": 36.0,
        "wet_bulb_temp": 25.0,
        "relative_humidity": 46.0,
        "condenser_approach": 5.1,
        "chiller1_degraded": False,
        "chiller2_degraded": True,
    }
}

class ChillerSimulationEngine:
    """
    Deterministic thermodynamic simulation of a 1,000 TR commercial central chiller plant.
    Uses ASHRAE standard water heat-capacity constants and affinity laws:
    Q (TR) = GPM * delta_T / 24
    Pump power = P_rated * (speed / speed_rated)^3
    Chiller power based on Gordon-Ng thermodynamic lift and part-load ratio.
    """

    def __init__(self, current_scenario: str = "low_delta_t"):
        self.current_scenario_id = current_scenario if current_scenario in SCENARIO_CONFIGS else "low_delta_t"

    def set_scenario(self, scenario_id: str):
        if scenario_id in SCENARIO_CONFIGS:
            self.current_scenario_id = scenario_id
            return True
        return False

    def get_current_scenario_meta(self) -> Dict[str, Any]:
        cfg = SCENARIO_CONFIGS[self.current_scenario_id]
        return {
            "id": self.current_scenario_id,
            "name": cfg["name"],
            "description": cfg["description"]
        }

    def compute_telemetry(self) -> Dict[str, Any]:
        cfg = SCENARIO_CONFIGS[self.current_scenario_id]
        cooling_load_tr = cfg["cooling_load_tr"]
        chw_supply_temp = cfg["chw_supply_temp"]
        actual_delta_t = cfg["actual_delta_t"]
        expected_delta_t = cfg["expected_delta_t"]
        active_chillers = cfg["active_chillers"]
        pump_speed_pct = cfg["pump_speed_pct"]
        ambient_temp = cfg["ambient_temp"]
        wet_bulb_temp = cfg["wet_bulb_temp"]
        rel_hum = cfg["relative_humidity"]

        chw_return_temp = round(chw_supply_temp + actual_delta_t, 2)

        # Flow rate in GPM: GPM = (Cooling TR * 24) / delta_t
        flow_rate_gpm = round((cooling_load_tr * 24.0) / max(actual_delta_t, 1.0), 1)

        # Condenser loop calculation
        condenser_supply_temp = round(wet_bulb_temp + cfg["condenser_approach"], 1)
        # Heat rejection = Cooling TR * 1.25 (typical refrigeration factor)
        # Condenser water delta T approx 5.0 C
        condenser_delta_t = 5.0
        condenser_return_temp = round(condenser_supply_temp + condenser_delta_t, 1)

        # Chiller performance computation
        # Each chiller rated 500 TR
        load_per_chiller = cooling_load_tr / max(active_chillers, 1)
        plr = min(load_per_chiller / 500.0, 1.0) # Part load ratio

        # Base specific power Gordon-Ng curve representation (kW/TR)
        # Optimal PLR around 0.70-0.80 has 0.58 kW/TR. Lower PLR (<0.50) has 0.85+ kW/TR.
        chiller_kw_list = []
        cops = []
        kw_per_tr_list = []

        for i in range(1, 3):
            is_active = (i <= active_chillers)
            if not is_active:
                chiller_kw_list.append(0.0)
                cops.append(0.0)
                kw_per_tr_list.append(0.0)
                continue

            # Lift = T_cond_out - T_evap_in (approx Condenser supply vs CHW supply)
            lift = max(condenser_return_temp - chw_supply_temp, 15.0)
            lift_penalty = (lift - 22.0) * 0.012

            # Part-load curve
            if plr < 0.5:
                base_eff = 0.78 + (0.5 - plr) * 0.45
            else:
                base_eff = 0.56 + (plr - 0.75) ** 2 * 0.50

            eff = base_eff + lift_penalty
            if i == 2 and cfg["chiller2_degraded"]:
                eff += 0.22 # Significant fouling penalty

            eff = max(0.52, min(eff, 1.15))
            chiller_power = round(load_per_chiller * eff, 1)
            cop = round(3.5168 / eff, 2)

            chiller_kw_list.append(chiller_power)
            kw_per_tr_list.append(round(eff, 2))
            cops.append(cop)

        total_chiller_power = sum(chiller_kw_list)

        # Pump power via Affinity laws: P = P_rated * (speed_pct / 100)^3
        # 3 Primary pumps (22 kW each) + 3 Secondary pumps (37 kW each)
        # Operating fraction proportional to pump_speed_pct
        speed_ratio = pump_speed_pct / 100.0
        primary_pump_kw = (22.0 * active_chillers) * (0.5 + 0.5 * (speed_ratio ** 2))
        secondary_pump_kw = (37.0 * 2) * (speed_ratio ** 3)
        total_pump_power = round(primary_pump_kw + secondary_pump_kw, 1)

        # Cooling tower fan power (2 towers with VFD fans, rated 30 kW each)
        tower_fan_kw = round((30.0 * active_chillers) * ((ambient_temp - 25.0) / 20.0 + 0.3) * 0.8, 1)
        tower_fan_kw = max(18.0, min(tower_fan_kw, 55.0))

        total_plant_power = round(total_chiller_power + total_pump_power + tower_fan_kw, 1)
        overall_kw_per_tr = round(total_plant_power / max(cooling_load_tr, 1.0), 3)

        return {
            "timestamp": datetime.now(timezone.utc),
            "mode": "SIMULATED",
            "scenario_id": self.current_scenario_id,
            "cooling_load_tr": cooling_load_tr,
            "chw_supply_temp": chw_supply_temp,
            "chw_return_temp": chw_return_temp,
            "actual_delta_t": actual_delta_t,
            "expected_delta_t": expected_delta_t,
            "chw_flow_rate_gpm": flow_rate_gpm,
            "condenser_supply_temp": condenser_supply_temp,
            "condenser_return_temp": condenser_return_temp,
            "wet_bulb_temp": wet_bulb_temp,
            "ambient_temp": ambient_temp,
            "relative_humidity": rel_hum,
            "total_plant_power_kw": total_plant_power,
            "chiller_power_kw": round(total_chiller_power, 1),
            "pump_power_kw": total_pump_power,
            "tower_power_kw": tower_fan_kw,
            "plant_efficiency_kw_per_tr": overall_kw_per_tr,
            "active_chillers": active_chillers,
            "pump_speed_pct": pump_speed_pct,
            "chiller_details": [
                {
                    "id": "CH-01",
                    "name": "Chiller 01 (Water-Cooled Centrifugal)",
                    "status": "ONLINE" if active_chillers >= 1 else "STANDBY",
                    "load_pct": round(min(load_per_chiller / 500.0 * 100, 100.0), 1) if active_chillers >= 1 else 0.0,
                    "power_kw": chiller_kw_list[0],
                    "cop": cops[0],
                    "kw_per_tr": kw_per_tr_list[0]
                },
                {
                    "id": "CH-02",
                    "name": "Chiller 02 (Water-Cooled Centrifugal)",
                    "status": "ONLINE" if active_chillers >= 2 else "STANDBY",
                    "load_pct": round(min(load_per_chiller / 500.0 * 100, 100.0), 1) if active_chillers >= 2 else 0.0,
                    "power_kw": chiller_kw_list[1],
                    "cop": cops[1],
                    "kw_per_tr": kw_per_tr_list[1]
                }
            ],
            "pump_details": [
                {
                    "id": "PMP-PRI-01",
                    "name": "Primary CHW Pump 01",
                    "speed_hz": round(50.0 * (pump_speed_pct / 100.0), 1),
                    "power_kw": round(primary_pump_kw / max(active_chillers, 1), 1),
                    "status": "RUNNING"
                },
                {
                    "id": "PMP-SEC-01",
                    "name": "Secondary Distribution Pump 01",
                    "speed_hz": round(50.0 * (pump_speed_pct / 100.0), 1),
                    "power_kw": round(secondary_pump_kw / 2.0, 1),
                    "status": "RUNNING"
                }
            ],
            "cooling_tower_details": [
                {
                    "id": "CT-01",
                    "name": "Induced Draft Cooling Tower 01",
                    "approach_temp": round(cfg["condenser_approach"], 1),
                    "fan_speed_pct": 82.0,
                    "power_kw": round(tower_fan_kw / max(active_chillers, 1), 1),
                    "status": "RUNNING"
                }
            ]
        }

simulation_engine = ChillerSimulationEngine("low_delta_t")
