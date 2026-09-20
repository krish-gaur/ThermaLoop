from typing import Dict, Any, List

class ImpactEngine:
    """
    Translates plant telemetry and optimization findings into financial,
    energy, and carbon outcomes under conservative assumptions.
    """

    def calculate_impact(self, current_telemetry: Dict[str, Any], opt_result: Dict[str, Any]) -> Dict[str, Any]:
        power_reduction_kw = opt_result["power_reduction_kw"]
        current_power_kw = current_telemetry["total_plant_power_kw"]

        # Baseline: 4,200 operating hours per year (typical Indian Tier-1 commercial facility)
        baseline_annual_kwh = round(current_power_kw * 4200.0, 0)
        modeled_annual_kwh = round((current_power_kw - power_reduction_kw) * 4200.0, 0)
        annual_kwh_savings = baseline_annual_kwh - modeled_annual_kwh

        # Commercial tariff: ₹10.50 / kWh
        annual_cost_savings = round(annual_kwh_savings * 10.50, 0)
        monthly_cost_savings = round(annual_cost_savings / 12.0, 0)

        # Carbon factor: 0.716 kg CO2 / kWh (CEA India Baseline Database)
        annual_co2_tonnes = round((annual_kwh_savings * 0.716) / 1000.0, 1)
        monthly_co2_tonnes = round(annual_co2_tonnes / 12.0, 2)

        # 12-month projected profile (accounting for Indian weather seasons)
        # Hot summer months (Apr-Jul), Monsoon (Aug-Sep), Mild winter (Nov-Feb)
        seasonal_multipliers = [
            ("Jan", 0.65), ("Feb", 0.75), ("Mar", 0.95), ("Apr", 1.25),
            ("May", 1.40), ("Jun", 1.35), ("Jul", 1.20), ("Aug", 1.10),
            ("Sep", 1.05), ("Oct", 0.90), ("Nov", 0.75), ("Dec", 0.65)
        ]

        monthly_trend = []
        base_monthly_kwh = baseline_annual_kwh / 12.0
        for month, mult in seasonal_multipliers:
            m_base = round(base_monthly_kwh * mult, 0)
            m_opt = round(m_base * (1.0 - (opt_result["percentage_reduction"] / 100.0)), 0)
            m_saved = m_base - m_opt
            monthly_trend.append({
                "month": month,
                "baseline_kwh": m_base,
                "optimized_kwh": m_opt,
                "savings_inr": round(m_saved * 10.50, 0),
                "co2_tonnes": round((m_saved * 0.716) / 1000.0, 2)
            })

        equipment_breakdown = [
            {
                "equipment": "Chillers (Centrifugal)",
                "baseline_share_pct": 68.0,
                "optimized_share_pct": 62.0,
                "modeled_reduction_pct": 21.0,
                "primary_lever": "CHW supply temp reset (6.0°C → 6.8°C) & single-chiller staging"
            },
            {
                "equipment": "CHW Pumps (Primary + Secondary)",
                "baseline_share_pct": 22.0,
                "optimized_share_pct": 14.0,
                "modeled_reduction_pct": 48.5,
                "primary_lever": "Secondary VFD modulation (94% → 76% speed via affinity cube law)"
            },
            {
                "equipment": "Cooling Towers (Fans)",
                "baseline_share_pct": 10.0,
                "optimized_share_pct": 8.0,
                "modeled_reduction_pct": 15.0,
                "primary_lever": "Approach temperature optimization against ambient wet-bulb"
            }
        ]

        return {
            "baseline_annual_kwh": baseline_annual_kwh,
            "modeled_annual_kwh": modeled_annual_kwh,
            "projected_annual_kwh_savings": annual_kwh_savings,
            "projected_annual_cost_savings_inr": annual_cost_savings,
            "projected_monthly_cost_savings_inr": monthly_cost_savings,
            "projected_annual_co2_avoided_tonnes": annual_co2_tonnes,
            "projected_monthly_co2_avoided_tonnes": monthly_co2_tonnes,
            "tariff_rate_inr_per_kwh": 10.50,
            "grid_emission_factor_kg_per_kwh": 0.716,
            "operating_hours_annual": 4200,
            "monthly_trend": monthly_trend,
            "equipment_breakdown": equipment_breakdown
        }

impact_engine = ImpactEngine()
