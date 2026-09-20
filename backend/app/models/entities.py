from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Plant(Base):
    __tablename__ = "plants"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    facility_type = Column(String, default="Commercial Tech Park")
    design_capacity_tr = Column(Float, default=1000.0)
    design_delta_t = Column(Float, default=5.5)
    design_chw_supply_temp = Column(Float, default=6.5)
    design_chw_return_temp = Column(Float, default=12.0)
    design_cop = Column(Float, default=5.8)
    design_kw_per_tr = Column(Float, default=0.60)
    created_at = Column(DateTime, default=utc_now)

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # CHILLER, PRIMARY_PUMP, SECONDARY_PUMP, COOLING_TOWER
    status = Column(String, default="ONLINE") # ONLINE, STANDBY, OFFLINE, MAINTENANCE
    capacity = Column(Float) # TR or GPM or kW
    rated_power_kw = Column(Float)
    vfd_equipped = Column(Boolean, default=True)
    current_speed_hz = Column(Float, default=50.0)
    current_load_pct = Column(Float, default=70.0)
    current_power_kw = Column(Float, default=150.0)
    cop = Column(Float, default=5.2)
    kw_per_tr = Column(Float, default=0.67)

class Telemetry(Base):
    __tablename__ = "telemetry"
    id = Column(Integer, primary_key=True, autoincrement=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    mode = Column(String, default="SIMULATED") # SIMULATED, OBSERVED, MODELED
    scenario_id = Column(String, default="low_delta_t")
    cooling_load_tr = Column(Float)
    chw_supply_temp = Column(Float)
    chw_return_temp = Column(Float)
    actual_delta_t = Column(Float)
    expected_delta_t = Column(Float)
    chw_flow_rate_gpm = Column(Float)
    condenser_supply_temp = Column(Float)
    condenser_return_temp = Column(Float)
    wet_bulb_temp = Column(Float)
    ambient_temp = Column(Float)
    relative_humidity = Column(Float)
    total_plant_power_kw = Column(Float)
    chiller_power_kw = Column(Float)
    pump_power_kw = Column(Float)
    tower_power_kw = Column(Float)
    plant_efficiency_kw_per_tr = Column(Float)
    active_chillers = Column(Integer)
    pump_speed_pct = Column(Float)

class Anomaly(Base):
    __tablename__ = "anomalies"
    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    severity = Column(String, nullable=False) # CRITICAL, WARNING, ADVISORY
    category = Column(String, nullable=False) # DELTA_T, CHILLER_STAGING, PUMP_SPEED, SENSOR
    title = Column(String, nullable=False)
    equipment_id = Column(String, nullable=True)
    observed_condition = Column(String, nullable=False)
    expected_condition = Column(String, nullable=False)
    estimated_impact = Column(String, nullable=False)
    probable_causes = Column(JSON, default=list)
    recommended_action = Column(String, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, MITIGATED, ACKNOWLEDGED
    detected_at = Column(DateTime, default=utc_now)

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"
    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    created_at = Column(DateTime, default=utc_now)
    status = Column(String, default="COMPLETED")
    input_load_tr = Column(Float)
    input_chw_supply = Column(Float)
    input_pump_speed_pct = Column(Float)
    input_active_chillers = Column(Integer)
    input_power_kw = Column(Float)
    opt_chw_supply = Column(Float)
    opt_pump_speed_pct = Column(Float)
    opt_active_chillers = Column(Integer)
    opt_power_kw = Column(Float)
    power_reduction_kw = Column(Float)
    percentage_reduction = Column(Float)
    monthly_cost_savings_inr = Column(Float)
    monthly_co2_reduction_tonnes = Column(Float)
    solver_iterations = Column(Integer, default=14)
    constraints_satisfied = Column(Boolean, default=True)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    user_query = Column(Text, nullable=False)
    agent_response = Column(Text, nullable=False)
    tools_invoked = Column(JSON, default=list)
    structured_context_snapshot = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)

class PlantReport(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    metrics_snapshot = Column(JSON, default=dict)
    recommendations = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)
