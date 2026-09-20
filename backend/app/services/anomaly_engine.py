from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid

class AnomalyEngine:
    """
    Evaluates instantaneous telemetry against thermodynamic baselines.
    Flags Low Delta-T, excessive pumping, uncoordinated staging, and chiller fouling.
    """

    def evaluate(self, telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        anomalies = []
        actual_delta_t = telemetry["actual_delta_t"]
        expected_delta_t = telemetry["expected_delta_t"]
        pump_speed_pct = telemetry["pump_speed_pct"]
        cooling_load_tr = telemetry["cooling_load_tr"]
        active_chillers = telemetry["active_chillers"]
        plant_efficiency = telemetry["plant_efficiency_kw_per_tr"]

        # 1. Delta-T Evaluation
        delta_t_dev_pct = ((actual_delta_t - expected_delta_t) / expected_delta_t) * 100.0
        if actual_delta_t < 3.2:
            anomalies.append({
                "id": f"anom-{uuid.uuid4().hex[:6]}",
                "severity": "CRITICAL",
                "category": "DELTA_T",
                "title": "Severe Low ΔT Syndrome Detected",
                "equipment_id": "CHW-LOOP-SEC",
                "observed_condition": f"Measured loop ΔT is {actual_delta_t}°C vs design {expected_delta_t}°C ({round(delta_t_dev_pct, 1)}% deviation)",
                "expected_condition": f"Minimum operating ΔT ≥ 5.2°C at current {cooling_load_tr} TR thermal load",
                "estimated_impact": "Excessive bypass flow forces premature chiller staging and increases secondary pumping power by up to 55%",
                "probable_causes": [
                    "Secondary AHU 3-way control valves remaining partially open in bypass mode",
                    "Hydraulic imbalance across distant terminal cooling coils",
                    "Coil surface fouling causing poor convective thermal transfer",
                    "Differential pressure setpoint tuned excessively high at riser headers"
                ],
                "recommended_action": "Modulate secondary pump VFD speed down, inspect bypass valve positions at AHU-3 & AHU-5, and reset CHW supply temperature",
                "status": "ACTIVE",
                "detected_at": datetime.now(timezone.utc).isoformat()
            })
        elif actual_delta_t < 4.5:
            anomalies.append({
                "id": f"anom-{uuid.uuid4().hex[:6]}",
                "severity": "WARNING",
                "category": "DELTA_T",
                "title": "Sub-Optimal Return Temperature Differential",
                "equipment_id": "CHW-LOOP-SEC",
                "observed_condition": f"Return ΔT is {actual_delta_t}°C, below target 5.5°C",
                "expected_condition": "5.0°C – 5.8°C nominal differential",
                "estimated_impact": "Elevated hydronic pumping energy and slight chiller part-load lift penalty",
                "probable_causes": [
                    "Minor bypass leakage across modulating valves",
                    "Over-pumping during shoulder weather periods"
                ],
                "recommended_action": "Trim secondary pump VFD frequency by 4-6 Hz and verify flow balance",
                "status": "ACTIVE",
                "detected_at": datetime.now(timezone.utc).isoformat()
            })

        # 2. Chiller Staging Evaluation
        if active_chillers == 2 and cooling_load_tr <= 490.0:
            anomalies.append({
                "id": f"anom-{uuid.uuid4().hex[:6]}",
                "severity": "WARNING",
                "category": "CHILLER_STAGING",
                "title": "Premature Multi-Chiller Staging",
                "equipment_id": "CH-02",
                "observed_condition": f"2 chillers active for {cooling_load_tr} TR (average 49% part-load per machine)",
                "expected_condition": "Single 500 TR chiller operating at optimal 85-95% part-load ratio",
                "estimated_impact": "Running twin chillers at low load incurs ~0.15 kW/TR efficiency penalty plus auxiliary primary pump parasitic load (~22 kW)",
                "probable_causes": [
                    "Low ΔT syndrome artificially inflating primary loop flow requirement",
                    "BMS rule-based staging trigger based on flow rate rather than thermal enthalpy load"
                ],
                "recommended_action": "Decant thermal load onto Chiller 01 and sequence Chiller 02 into standby mode",
                "status": "ACTIVE",
                "detected_at": datetime.now(timezone.utc).isoformat()
            })

        # 3. Pumping Speed Evaluation
        if pump_speed_pct > 88.0 and cooling_load_tr < 700.0:
            anomalies.append({
                "id": f"anom-{uuid.uuid4().hex[:6]}",
                "severity": "ADVISORY",
                "category": "PUMP_SPEED",
                "title": "Secondary Pumping Above Modeled Requirement",
                "equipment_id": "PMP-SEC-01",
                "observed_condition": f"Pumps operating at {pump_speed_pct}% speed (47+ Hz) for {cooling_load_tr} TR load",
                "expected_condition": "Modeled hydraulic speed requirement: 72% - 78%",
                "estimated_impact": f"Affinity law power waste: Pumping consumes ~{round(telemetry['pump_power_kw'], 1)} kW",
                "probable_causes": [
                    "Static differential pressure setpoint locked at remote sensor",
                    "Manual override left active by night shift technician"
                ],
                "recommended_action": "Engage dynamic differential pressure reset based on most demanding AHU valve position",
                "status": "ACTIVE",
                "detected_at": datetime.now(timezone.utc).isoformat()
            })

        # 4. Chiller 02 Degradation check
        chiller_details = telemetry.get("chiller_details", [])
        if len(chiller_details) > 1 and chiller_details[1].get("kw_per_tr", 0) > 0.88:
            anomalies.append({
                "id": f"anom-{uuid.uuid4().hex[:6]}",
                "severity": "WARNING",
                "category": "CHILLER_DEGRADATION",
                "title": "Chiller 02 Operating Above Expected Specific Power Curve",
                "equipment_id": "CH-02",
                "observed_condition": f"Chiller 02 specific consumption is {chiller_details[1]['kw_per_tr']} kW/TR",
                "expected_condition": "Benchmark specific consumption ≤ 0.68 kW/TR",
                "estimated_impact": "Wasting ~32 kW continuous compressor work while active",
                "probable_causes": [
                    "Condenser tube biofouling or sediment scaling",
                    "Refrigerant undercharge or non-condensable gas accumulation",
                    "High condenser water approach temperature from cooling tower"
                ],
                "recommended_action": "Schedule condenser tube brush cleaning and check refrigerant subcooling/superheat temperatures",
                "status": "ACTIVE",
                "detected_at": datetime.now(timezone.utc).isoformat()
            })

        return anomalies

anomaly_engine = AnomalyEngine()
