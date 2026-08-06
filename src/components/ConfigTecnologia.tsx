import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CustomAppliance, 
  SolarSizingResult, 
  APPLIANCE_PRESETS,
  Domicilio
} from "../types";
import { getTranslation, getAppliancePresetName, translateApplianceName, getCountryLanguage } from "../translations";
import { getCountryGridVoltage } from "../utils";
import { 
  Zap, 
  Grid as GridIcon, 
  Flame, 
  Plus, 
  Trash2
} from "lucide-react";

interface ConfigTecnologiaProps {
  techType: "on-grid" | "off-grid" | "thermal" | null;
  setTechType: (type: "on-grid" | "off-grid" | "thermal" | null) => void;
  showIncompleteAlert: boolean;
  domicilio: Domicilio;
  appliances: CustomAppliance[];
  setAppliances: (apps: CustomAppliance[]) => void;
  autonomyDays: number;
  setAutonomyDays: (days: number) => void;
  batteryType: "gel" | "lithium";
  setBatteryType: (val: "gel" | "lithium") => void;
  batteryVoltage: 12 | 24 | 48;
  setBatteryVoltage: (val: 12 | 24 | 48) => void;
  solarCoverage: number;
  setSolarCoverage: (val: number) => void;
  thermalProfile: "familiar" | "intenso";
  setThermalProfile: (val: "familiar" | "intenso") => void;
  personasCount: number;
  setPersonasCount: (count: number) => void;
  waterHardness: "blanda" | "dura";
  setWaterHardness: (val: "blanda" | "dura") => void;
  hasMinors: boolean;
  setHasMinors: (val: boolean) => void;
  hasPressurizer: boolean;
  setHasPressurizer: (val: boolean) => void;
  sizing: SolarSizingResult;
  onOpenPresupuesto: () => void;
  anualConsumptionKwh: number | "";
  setAnualConsumptionKwh: (val: number | "") => void;
  gridPhaseType: "monofasica" | "trifasica";
  setGridPhaseType: (val: "monofasica" | "trifasica") => void;
  placeholderValue: number;
  setPlaceholderValue: (val: number) => void;
  isDimensioned: boolean;
  onSetDimensioned: (val: boolean) => void;
  onResetToPointZero: () => void;
}

export default function ConfigTecnologia({
  techType,
  setTechType,
  showIncompleteAlert,
  domicilio,
  appliances,
  setAppliances,
  autonomyDays,
  setAutonomyDays,
  batteryType,
  setBatteryType,
  batteryVoltage,
  setBatteryVoltage,
  solarCoverage,
  setSolarCoverage,
  thermalProfile,
  setThermalProfile,
  personasCount,
  setPersonasCount,
  waterHardness,
  setWaterHardness,
  hasMinors,
  setHasMinors,
  hasPressurizer,
  setHasPressurizer,
  sizing,
  onOpenPresupuesto,
  anualConsumptionKwh,
  setAnualConsumptionKwh,
  gridPhaseType,
  setGridPhaseType,
  placeholderValue,
  setPlaceholderValue,
  isDimensioned,
  onSetDimensioned,
  onResetToPointZero
}: ConfigTecnologiaProps) {

  const isApplicantDataComplete = 
    domicilio.nombre.trim() !== "" && 
    domicilio.apellido.trim() !== "" && 
    domicilio.domicilio.trim() !== "" && 
    domicilio.localidad.trim() !== "" && 
    domicilio.provincia.trim() !== "" &&
    (domicilio.pais?.trim() || "") !== "";

  const country = domicilio.pais;
  const lang = getCountryLanguage(domicilio.pais);

  const gridV = getCountryGridVoltage(domicilio.pais, domicilio.provincia);

  // Active typical preset highlight state ("familiar" | "pyme" | null)
  const [activeOnGridPreset, setActiveOnGridPreset] = useState<"familiar" | "pyme" | null>(null);
  const [touchedOnGrid, setTouchedOnGrid] = useState(false);
  const [touchedOffGrid, setTouchedOffGrid] = useState(false);
  const [touchedThermal, setTouchedThermal] = useState(false);

  // Clear preset highlight on techType change or reset
  useEffect(() => {
    setActiveOnGridPreset(null);
    setTouchedOnGrid(false);
    setTouchedOffGrid(false);
    setTouchedThermal(false);
  }, [techType]);

  // Local state for the CURRENT single load item the user is typing/editing (Off-Grid specific)
  const [selectedPresetId, setSelectedPresetId] = useState("preset_all");
  const [currentQty, setCurrentQty] = useState<number | "">("");
  const [currentConsumptionStr, setCurrentConsumptionStr] = useState(""); // Unit power in Watts (Watts/hora)
  const [currentHours, setCurrentHours] = useState<number | "">("");
  const [customApplianceName, setCustomApplianceName] = useState("");

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    
    const preset = APPLIANCE_PRESETS.find((p) => p.id === presetId);
    if (preset && preset.id !== "preset_all") {
      setCurrentQty(1);
      setCurrentConsumptionStr(preset.powerW.toString());
      setCurrentHours(preset.hoursPerDayDefault);
      setCustomApplianceName("");
    } else {
      setCurrentQty("");
      setCurrentConsumptionStr("");
      setCurrentHours("");
      setCustomApplianceName("");
    }
  };

  const handleAddManualLoad = () => {
    if (selectedPresetId === "preset_all" && !customApplianceName.trim()) {
      alert("⚠️ Por favor ingrese un nombre para el Equipo Personalizado antes de cargarlo.");
      return;
    }

    const cleanStr = (currentConsumptionStr || "").toString().replace(",", ".");
    const powerW = parseFloat(cleanStr) || 0;
    
    if (powerW <= 0) {
      alert(getTranslation("alert_power_greater_zero", domicilio.pais));
      return;
    }

    const qty = typeof currentQty === "number" ? currentQty : parseInt(currentQty) || 0;
    if (qty <= 0) {
      alert(getTranslation("alert_qty_greater_zero", domicilio.pais));
      return;
    }

    const hours = typeof currentHours === "number" ? currentHours : parseFloat(currentHours) || 0;
    if (hours <= 0 || hours > 24) {
      alert(getTranslation("alert_hours_valid", domicilio.pais));
      return;
    }

    const presetSelected = APPLIANCE_PRESETS.find((p) => p.id === selectedPresetId);
    let labelName = "Carga Consumo Manual";

    if (presetSelected && presetSelected.id !== "preset_all") {
      labelName = presetSelected.name;
    } else if (customApplianceName.trim().length > 0) {
      labelName = customApplianceName.trim();
    } else {
      labelName = "Equipo Personalizado";
    }

    // Daily consumption (Wh/día) is calculated as unit power * hours * quantity
    const calculatedWh = powerW * hours * qty;

    const newApp: CustomAppliance = {
      id: "app_" + Math.random().toString(36).substring(2, 9),
      name: labelName,
      cantidad: qty,
      consumptionWh: calculatedWh,
      hoursPerDay: hours
    };

    setAppliances([...appliances, newApp]);
    setSelectedPresetId("preset_all");
    setCustomApplianceName("");
    setCurrentQty("");
    setCurrentConsumptionStr("");
    setCurrentHours("");
  };

  const handleRemoveLoad = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col h-auto md:h-full bg-black border border-white rounded-2xl p-4 shadow-sm select-none text-white transition-all duration-300 min-h-0 md:overflow-y-auto pr-1">
      
      {/* Title with matching active white indicator digit */}
      <div className="border-b border-zinc-800 pb-3 mb-4 animate-fade-in">
        <h3 className="text-lg font-extrabold text-white font-sans tracking-tight mb-0.5 flex items-center gap-2">
          {getTranslation("title_tecnologia", domicilio.pais)}
        </h3>
        <p className="text-[10px] text-slate-300 font-bold leading-tight select-none">
          {getTranslation("tech_desc_instruction", domicilio.pais)}
        </p>
      </div>

      {/* Cartel en Rojo (Incomplete data validation alert) */}
      <AnimatePresence>
        {showIncompleteAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-[#2D0D0D] border-2 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-left space-y-3 animate-pulse">
              <div className="flex items-center gap-1.5 text-red-200 font-extrabold uppercase text-[10.5px] tracking-widest">
                <span className="text-red-400 text-sm">⚠️</span>
                <span className="text-white font-black">{getTranslation("atencion_datos_incompletos", domicilio.pais)}</span>
              </div>
              <p className="text-[12px] text-red-100 font-bold font-sans leading-relaxed">
                {getTranslation("para_dimensionar_debe_cargar", domicilio.pais)}
              </p>
              
              <div className="text-[10px] text-red-300 font-bold border-t border-red-800/60 pt-3 flex flex-wrap gap-x-2 gap-y-1.5 items-center">
                <span className="text-red-200 font-black uppercase tracking-wide">{getTranslation("falta_cargar", domicilio.pais)}</span>
                {!domicilio.nombre.trim() && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_nombre", domicilio.pais)}
                  </span>
                )}
                {(!domicilio.apellido || !domicilio.apellido.trim()) && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_apellido", domicilio.pais)}
                  </span>
                )}
                {!domicilio.domicilio.trim() && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_domicilio", domicilio.pais)}
                  </span>
                )}
                {!domicilio.localidad.trim() && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_localidad", domicilio.pais)}
                  </span>
                )}
                {(!domicilio.pais || !domicilio.pais.trim()) && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_pais", domicilio.pais)}
                  </span>
                )}
                {!domicilio.provincia.trim() && (
                  <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                    {getTranslation("label_provincia", domicilio.pais).split(" / ")[0]}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technology Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-3.5 font-sans text-xs">
        {/* On Grid Tab */}
        <button
          onClick={() => setTechType("on-grid")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
            techType === "on-grid"
              ? "bg-[#332205] border-amber-500 text-amber-100 font-black scale-[1.03] shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              : "bg-black border-zinc-800 text-zinc-400 hover:border-amber-700/50 hover:text-amber-500 font-bold"
          }`}
          id="tab_ongrid"
        >
          <GridIcon className={`h-4 w-4 shrink-0 transition-colors ${techType === "on-grid" ? "text-amber-400" : "text-zinc-500"}`} />
          <span className="text-[11px] tracking-wide">{getTranslation("tab_ongrid_short", domicilio.pais)}</span>
        </button>

        {/* Off Grid Tab */}
        <button
          onClick={() => setTechType("off-grid")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
            techType === "off-grid"
              ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-black border-zinc-800 text-zinc-400 hover:border-emerald-700/50 hover:text-emerald-500 font-bold"
          }`}
          id="tab_offgrid"
        >
          <Zap className={`h-4 w-4 shrink-0 transition-colors ${techType === "off-grid" ? "text-emerald-400" : "text-zinc-500"}`} />
          <span className="text-[11px] tracking-wide">{getTranslation("tab_offgrid_short", domicilio.pais)}</span>
        </button>

        {/* Térmica Tab */}
        <button
          onClick={() => setTechType("thermal")}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
            techType === "thermal"
              ? "bg-[#2d0a0a] border-rose-500 text-rose-100 font-black scale-[1.03] shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              : "bg-black border-zinc-800 text-zinc-400 hover:border-rose-700/50 hover:text-rose-500 font-bold"
          }`}
          id="tab_thermal"
        >
          <Flame className={`h-4 w-4 shrink-0 transition-colors ${techType === "thermal" ? "text-rose-400" : "text-zinc-500"}`} />
          <span className="text-[11px] tracking-wide">{getTranslation("tab_thermal_short", domicilio.pais)}</span>
        </button>
      </div>

      {/* Blocked state if technology is touched or alert is active, but applicant data is incomplete */}
      {!isApplicantDataComplete && (techType !== null || showIncompleteAlert) && (
        <div className="flex-1 rounded-2xl border-2 p-4 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px] animate-fade-in transition-all duration-300 border-red-600 bg-[#2D0D0D] text-white shadow-[0_0_25px_rgba(239,68,68,0.5)]">
          <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center animate-bounce bg-red-950 text-red-200">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest font-sans text-white">
              {getTranslation("dimensionamiento_bloqueado", domicilio.pais)}
            </p>
            <p className="text-[12px] text-red-200 leading-relaxed max-w-[260px] mt-2 font-bold font-sans">
              {getTranslation("para_dimensionar_debe_cargar", domicilio.pais)}
            </p>
          </div>
        </div>
      )}

      <div className={`flex-1 min-h-0 rounded-2xl border border-zinc-800 bg-black p-3 flex flex-col justify-between space-y-2.5 shadow-sm ${(techType === null || !isApplicantDataComplete) ? "hidden" : ""} md:overflow-y-auto pr-0.5`}>
        
        {/* Render Form based on Tech Type */}
        {techType === "on-grid" ? (
          /* ON-GRID SYSTEM DESIGN DESIGN ASSISTANT (Brand-new requested annual inputs) */
          <div className="space-y-3 animate-fade-in">
            <span className="font-extrabold text-yellow-500 text-[11px] uppercase tracking-wider font-sans block pb-1 border-b border-zinc-800">
              {getTranslation("asistente_carga_ongrid", country)}
            </span>

            {/* Ventana de Carga On-Grid */}
            <div 
              onClick={() => setTouchedOnGrid(true)}
              onFocusCapture={() => setTouchedOnGrid(true)}
              className={`border p-3 rounded-xl transition-all duration-300 space-y-3 ${
                touchedOnGrid || techType === "on-grid"
                  ? "border-emerald-500 bg-black shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "border-zinc-800 bg-zinc-950/20"
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest font-sans text-emerald-400">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse shrink-0 bg-emerald-500`} />
                  {getTranslation("ventana_carga_consumo_guia", country)}
                </span>
                <span className="text-[8.5px] px-1.5 py-0.5 rounded font-black bg-zinc-900 border border-zinc-800 text-emerald-400">ON-GRID</span>
              </div>

              {/* Input field for Annual energy consumption (kWh/year) */}
              <div className="space-y-1">
                <label htmlFor="input_on_grid_anual" className="block text-[10px] font-sans font-black uppercase tracking-widest text-slate-300">
                  {getTranslation("consumo_electrico_anual", country)}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="120000"
                    value={anualConsumptionKwh || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAnualConsumptionKwh(val === "" ? "" : Math.max(0, parseInt(val) || 0));
                      setActiveOnGridPreset(null); // Custom value overrides the quick presets
                      setTouchedOnGrid(true);
                    }}
                    className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-1.5 text-xs font-sans font-extrabold focus:outline-none focus:border-emerald-500 transition shadow-sm placeholder-slate-600 text-slate-100"
                    placeholder={`Ej: ${placeholderValue}`}
                    id="input_on_grid_anual"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 font-mono text-[10px] font-black text-slate-550">
                    {getTranslation("kwh_anio", country)}
                  </div>
                </div>
              </div>

              {/* Quick manual selection buttons for typical homes/commercials */}
              <div className="space-y-1">
                <span className="block text-[9px] uppercase font-sans font-black text-slate-400">{getTranslation("seleccion_rapida_consumo", country)}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnualConsumptionKwh("");
                      setPlaceholderValue(3600);
                      setActiveOnGridPreset("familiar");
                      setTouchedOnGrid(true);
                    }}
                    className={`relative text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center border-2 ${
                      activeOnGridPreset === "familiar"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "border-zinc-800 bg-black text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span>{getTranslation("preset_familiar_ongrid", country)}</span>
                    {activeOnGridPreset === "familiar" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnualConsumptionKwh("");
                      setPlaceholderValue(6000);
                      setActiveOnGridPreset("pyme");
                      setTouchedOnGrid(true);
                    }}
                    className={`relative text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center border-2 ${
                      activeOnGridPreset === "pyme"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "border-zinc-800 bg-black text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span>{getTranslation("preset_pyme_ongrid", country)}</span>
                    {activeOnGridPreset === "pyme" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Grid network Phase selector: Single-phase (monofásica) or Three-phase (trifásica) */}
              <div className="space-y-1.5 pt-0.5">
                <label className="block text-[9.5px] font-sans font-black text-slate-300 uppercase tracking-widest">
                  {getTranslation("tipo_conexion_red_fase", country)}
                </label>
                <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setGridPhaseType("monofasica");
                      setTouchedOnGrid(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      gridPhaseType === "monofasica"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                    id="btn_red_monofasica"
                  >
                    <span className="text-[10.5px]">{getTranslation("monofasica_v", country).replace("{v}", gridV.singlePhaseV.toString())}</span>
                    {gridPhaseType === "monofasica" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGridPhaseType("trifasica");
                      setTouchedOnGrid(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      gridPhaseType === "trifasica"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                    id="btn_red_trifasica"
                  >
                    <span className="text-[10.5px]">{getTranslation("trifasica_v", country).replace("{v}", gridV.threePhaseV.toString())}</span>
                    {gridPhaseType === "trifasica" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Solar Offset/coverage slider representation in green */}
            <div className="space-y-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center text-[10.5px] font-sans font-black text-slate-300">
                <span>{getTranslation("porcentaje_cobertura_solar", country)}</span>
                <span className="font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-[9.5px]">{getTranslation("ochenta_recomendado", country)}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={solarCoverage}
                  onChange={(e) => {
                    setSolarCoverage(parseInt(e.target.value));
                    setTouchedOnGrid(true);
                  }}
                  className="flex-1 accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  id="slider_offset"
                />
                <div className="bg-zinc-900 border border-zinc-700 text-center font-sans font-black rounded-lg px-2 py-0.5 text-[10px] text-white shadow-sm">
                  {solarCoverage}%
                </div>
              </div>
            </div>
            {/* Warning Box for Incomplete Data */}
            <AnimatePresence>
              {showIncompleteAlert && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  className="overflow-hidden text-left mb-3.5"
                >
                  <div className="p-4 rounded-xl bg-[#2D0D0D] border-2 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-left space-y-3 animate-pulse">
                    <div className="flex items-center gap-1.5 text-red-200 font-extrabold uppercase text-[10.5px] tracking-widest">
                      <span className="text-red-400 text-sm">⚠️</span>
                      <span className="text-white font-black">{getTranslation("atencion_datos_incompletos", country)}</span>
                    </div>
                    <p className="text-[12px] text-red-100 font-bold font-sans leading-relaxed">
                      {getTranslation("para_dimensionar_debe_cargar", country)}
                    </p>
                    <div className="text-[10px] text-red-300 font-bold border-t border-red-800/60 pt-3 flex flex-wrap gap-x-2.5 gap-y-1.5 items-center">
                      <span className="text-red-200 font-black uppercase tracking-wide">{getTranslation("falta_cargar", country)}</span>
                      {!domicilio.nombre.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_nombre", country).toUpperCase()}</span>}
                      {(!domicilio.apellido || !domicilio.apellido.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_apellido", country).toUpperCase()}</span>}
                      {!domicilio.domicilio.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_domicilio", country).toUpperCase()}</span>}
                      {!domicilio.localidad.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_localidad", country).toUpperCase()}</span>}
                      {(!domicilio.pais || !domicilio.pais.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_pais", country).toUpperCase()}</span>}
                      {!domicilio.provincia.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_provincia", country).split(" / ")[0].toUpperCase()}</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dimensioning calculation CTA Button */}
            <button
              onClick={() => onSetDimensioned(true)}
              className={`w-full flex items-center justify-center gap-1 py-2 px-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer ${
                isDimensioned 
                  ? "bg-emerald-600 text-white border-2 border-emerald-500/30" 
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-750 text-white font-black"
              }`}
              id="btn_dimensionar"
            >
              <span>{isDimensioned ? getTranslation("sistema_dimensionado_correctamente", country) : getTranslation("dimensionar_sistema_ongrid", country)}</span>
            </button>

          </div>
        ) : techType === "off-grid" ? (
          /* PHOTOVOLTAIC ASSISTANT (OFF-GRID ONLY) */
          <div className="space-y-3 animate-fade-in">
            
            <span className="font-extrabold text-yellow-500 text-[11px] uppercase tracking-wider font-sans block pb-1 border-b border-zinc-800">
              {getTranslation("asistente_consumos_offgrid", country)}
            </span>

            {/* Ventana de Carga Off-Grid (Marco de color verde con guía para el solicitante) */}
            <div 
              onClick={() => setTouchedOffGrid(true)}
              onFocusCapture={() => setTouchedOffGrid(true)}
              className={`border p-3 rounded-xl transition-all duration-300 space-y-3 ${
                touchedOffGrid || techType === "off-grid"
                  ? "border-emerald-500 bg-black shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "border-zinc-800 bg-zinc-950/20"
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest font-sans text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 bg-emerald-500" />
                  {getTranslation("ventana_carga_equipos_guia", country)}
                </span>
                <span className="text-[8.5px] px-1.5 py-0.5 rounded font-black bg-zinc-900 border border-zinc-800 text-emerald-400">OFF-GRID</span>
              </div>

              {/* Smart Pre-Loaded Appliances Dropdown */}
              <div className="space-y-1">
                <label htmlFor="select_preloaded_appliance" className="block text-[10px] font-sans font-black uppercase tracking-wider text-slate-300">
                  {getTranslation("listado_carga_preset", country)}
                </label>
                <div className="relative">
                  <select
                    value={selectedPresetId}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-black border border-emerald-800 px-3 py-1.5 text-xs font-sans font-bold focus:outline-none focus:border-emerald-500 cursor-pointer pr-10 shadow-sm text-slate-100"
                    style={{ colorScheme: 'dark', backgroundColor: '#000000', color: '#f8fafc' }}
                    id="select_preloaded_appliance"
                  >
                    {APPLIANCE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>
                        {getAppliancePresetName(preset.id, domicilio.pais)} {preset.powerW > 0 ? `(${preset.powerW}W)` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-emerald-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic name block when unlisted option is customized */}
              {selectedPresetId === "preset_all" && (
                <div className="space-y-1 animate-fade-in">
                  <label htmlFor="input_custom_appliance_name" className="block text-[10px] font-sans font-black uppercase tracking-widest text-slate-300">
                    {getTranslation("nombre_equipo_personalizado", country)}
                  </label>
                  <input
                    type="text"
                    value={customApplianceName}
                    onChange={(e) => setCustomApplianceName(e.target.value)}
                    placeholder="Ej: Sierra Sin Fin, Soldador, etc..."
                    className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-1.5 text-xs font-sans font-bold focus:outline-none focus:border-emerald-500 placeholder-slate-650 transition shadow-sm text-slate-100"
                    id="input_custom_appliance_name"
                  />
                </div>
              )}

              {/* Config Fields Header Grid */}
              <div className="grid grid-cols-3 gap-1.5 font-sans text-[9px] text-slate-400 text-center font-black uppercase tracking-wider">
                <span>{getTranslation("cantidad_equipos", country).split(" ")[0]}</span>
                <span>{getTranslation("potencia_unitaria", country).split(" ")[0]}</span>
                <span>{getTranslation("uso_estimado_horas", country).split(" ")[2] || "Horas/Día"}</span>
              </div>

              {/* Config Fields Input Values Row */}
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={currentQty}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setCurrentQty("");
                    } else {
                      setCurrentQty(Math.max(1, parseInt(val) || 1));
                    }
                  }}
                  placeholder="Ej: 2"
                  className="w-full text-center rounded-xl bg-black border border-emerald-800 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-sans font-black shadow-sm placeholder:text-slate-655 text-slate-100"
                  id="input_qty"
                />
                <input
                  type="number"
                  min="1"
                  value={currentConsumptionStr}
                  onChange={(e) => setCurrentConsumptionStr(e.target.value)}
                  placeholder="Ej: 150"
                  className="w-full text-center rounded-xl bg-black border border-emerald-800 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-sans font-black shadow-sm placeholder:text-slate-655 text-slate-100"
                  id="input_consumption"
                />
                <input
                  type="number"
                  min="0.1"
                  max="24"
                  step="0.5"
                  value={currentHours}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setCurrentHours("");
                    } else {
                      setCurrentHours(Math.max(0.1, parseFloat(val) || 0.1));
                    }
                  }}
                  placeholder="Ej: 5"
                  className="w-full text-center rounded-xl bg-black border border-emerald-800 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-sans font-black shadow-sm placeholder:text-slate-655 text-slate-100"
                  id="input_hours"
                />
              </div>

              {/* Calculated dynamic preview of this item */}
              <div className="text-[10px] text-center text-slate-300 font-bold bg-zinc-950 py-1 px-1.5 rounded border border-zinc-800 animate-fade-in">
                {getTranslation("calculo", country)}: {currentQty || 0} u. x {currentConsumptionStr || "0"} W x {currentHours || 0} hs = {" "}
                <span className="font-extrabold font-mono text-yellow-400">
                  {Math.round((parseFloat(currentConsumptionStr) || 0) * (Number(currentHours) || 0) * (Number(currentQty) || 0))} Wh/día
                </span>
              </div>

              {/* Manual entry triggers */}
              <div className="w-full font-sans">
                <button
                  type="button"
                  onClick={() => {
                    handleAddManualLoad();
                    setTouchedOffGrid(true);
                  }}
                  className="w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn_manual_toggle"
                >
                  <Plus className="h-4 w-4 text-white stroke-[3.5]" />
                  <span>{getTranslation("cargar_a_la_lista", country)}</span>
                </button>
              </div>
            </div>

            {/* Active Load Items Inventory List */}
            {appliances.length > 0 && (
              <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-2 max-h-[95px] overflow-y-auto space-y-1 scrollbar-thin">
                {appliances.map((app) => {
                  const calculatedWattsPerHour = Math.round(app.consumptionWh / (app.cantidad * app.hoursPerDay));
                  return (
                     <div key={app.id} className="flex items-center justify-between text-[10.5px] font-sans bg-black border border-zinc-800 px-2 py-1 rounded-lg">
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold truncate max-w-[155px] text-slate-255" title={translateApplianceName(app.name, domicilio.pais)}>{translateApplianceName(app.name, domicilio.pais)}</span>
                        <span className="text-[8.5px] font-mono text-slate-400">
                          {app.cantidad} u. x {calculatedWattsPerHour} W x {app.hoursPerDay} {lang === "en" ? "hrs/day" : lang === "pt" ? "hs/dia" : lang === "fr" ? "h/jour" : "hs/día"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black font-mono text-[10px] text-yellow-400">{app.consumptionWh} {lang === "en" ? "Wh/day" : lang === "pt" ? "Wh/dia" : lang === "fr" ? "Wh/jour" : "Wh/día"}</span>
                        <button
                          onClick={() => handleRemoveLoad(app.id)}
                          className="p-1 rounded-md bg-red-955/40 border border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-900/60 transition cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Days of Autonomía Slider */}
            <div className="space-y-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-300">
                <span>{getTranslation("dias_autonomia_requeridos", country)}</span>
                <span className="font-extrabold bg-zinc-900 border border-zinc-700 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] shadow-sm">{autonomyDays} {lang === "en" ? "days" : lang === "pt" ? "dias" : lang === "fr" ? "jours" : "días"}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={autonomyDays}
                  onChange={(e) => setAutonomyDays(parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  id="slider_autonomy"
                />
                <div className="border text-center font-sans font-black rounded-lg px-2 py-0.5 text-[10px] bg-zinc-900 border-zinc-700 text-white shadow-sm">
                  {autonomyDays}
                </div>
              </div>
            </div>

            {/* Battery Technology and Inverter Voltage Selections */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <div className="space-y-1">
                <label htmlFor="select_battery_type" className="block text-[10px] font-sans font-black uppercase tracking-wider text-slate-300">
                  ⚡ {getTranslation("tipo_acumuladores", country)}
                </label>
                <select
                  value={batteryType}
                  onChange={(e) => setBatteryType(e.target.value as "gel" | "lithium")}
                  className="w-full rounded-lg bg-black border border-emerald-800 px-2 py-1.5 text-xs font-sans font-bold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  style={{ colorScheme: 'dark', backgroundColor: '#000000', color: '#f8fafc' }}
                  id="select_battery_type"
                >
                  <option value="gel" className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("bateria_gel_full", country)}</option>
                  <option value="lithium" className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("bateria_litio_full", country)}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="select_battery_voltage" className="block text-[10px] font-sans font-black uppercase tracking-wider text-slate-300">
                  🔌 {getTranslation("tension_banco", country)}
                </label>
                <select
                  value={batteryVoltage}
                  onChange={(e) => setBatteryVoltage(Number(e.target.value) as 12 | 24 | 48)}
                  className="w-full rounded-lg bg-black border border-emerald-800 px-2 py-1.5 text-xs font-sans font-bold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  style={{ colorScheme: 'dark', backgroundColor: '#000000', color: '#f8fafc' }}
                  id="select_battery_voltage"
                >
                  <option value={12} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("tension_12v", country)}</option>
                  <option value={24} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("tension_24v", country)}</option>
                  <option value={48} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("tension_48v", country)}</option>
                </select>
              </div>
            </div>

            {/* Warning Box for Incomplete Data */}
            <AnimatePresence>
              {showIncompleteAlert && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  className="overflow-hidden text-left mb-3.5"
                >
                  <div className="p-4 rounded-xl bg-[#2D0D0D] border-2 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-left space-y-3 animate-pulse">
                    <div className="flex items-center gap-1.5 text-red-200 font-extrabold uppercase text-[10.5px] tracking-widest">
                      <span className="text-red-400 text-sm">⚠️</span>
                      <span className="text-white font-black">{getTranslation("atencion_datos_incompletos", country)}</span>
                    </div>
                    <p className="text-[12px] text-red-100 font-bold font-sans leading-relaxed">
                      {getTranslation("para_dimensionar_debe_cargar", country)}
                    </p>
                    <div className="text-[10px] text-red-300 font-bold border-t border-red-800/60 pt-3 flex flex-wrap gap-x-2.5 gap-y-1.5 items-center">
                      <span className="text-red-200 font-black uppercase tracking-wide">{getTranslation("falta_cargar", country)}</span>
                      {!domicilio.nombre.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_nombre", country).toUpperCase()}</span>}
                      {(!domicilio.apellido || !domicilio.apellido.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_apellido", country).toUpperCase()}</span>}
                      {!domicilio.domicilio.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_domicilio", country).toUpperCase()}</span>}
                      {!domicilio.localidad.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_localidad", country).toUpperCase()}</span>}
                      {(!domicilio.pais || !domicilio.pais.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_pais", country).toUpperCase()}</span>}
                      {!domicilio.provincia.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_provincia", country).split(" / ")[0].toUpperCase()}</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              onClick={() => onSetDimensioned(true)}
              className={`w-full flex items-center justify-center gap-1 py-2 px-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer ${
                isDimensioned 
                  ? "bg-emerald-600 text-white border-2 border-emerald-500/20" 
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-750 text-white font-black"
              }`}
              id="btn_dimensionar_offgrid"
            >
              <span>{isDimensioned ? getTranslation("sistema_dimensionado_correctamente", country) : getTranslation("dimensionar_sistema_offgrid", country)}</span>
            </button>

          </div>
        ) : (
          /* THERMAL WATER SYSTEM DESIGN ASSISTANT */
          <div className="space-y-3 animate-fade-in">
            <span className="font-extrabold text-yellow-500 text-[11px] uppercase tracking-wider block pb-1 border-b border-zinc-800">
              {getTranslation("asistente_dimensionamiento_termico", country)}
            </span>

            {/* Ventana de Carga Solar Térmica */}
            <div 
              onClick={() => setTouchedThermal(true)}
              onFocusCapture={() => setTouchedThermal(true)}
              className={`border p-3 rounded-xl transition-all duration-300 space-y-3 ${
                touchedThermal || techType === "thermal"
                  ? "border-emerald-500 bg-black shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "border-zinc-800 bg-zinc-950/20"
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest font-sans text-emerald-400">
                  <span className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-emerald-500" />
                  {getTranslation("ventana_carga_termica_guia", country)}
                </span>
                <span className="text-[8.5px] px-1.5 py-0.5 rounded font-black bg-zinc-900 border border-zinc-800 text-emerald-400">TÉRMICA</span>
              </div>

              {/* Household persons slider */}
              <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-300">
                  <span>{getTranslation("ocupantes_hogar", country)}</span>
                  <span className="font-extrabold bg-zinc-900 border border-zinc-700 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] shadow-sm">
                    {personasCount} {lang === "en" ? (personasCount === 1 ? "Person" : "People") : lang === "pt" ? (personasCount === 1 ? "Pessoa" : "Pessoas") : lang === "fr" ? (personasCount === 1 ? "Personne" : "Personnes") : (personasCount === 1 ? "Persona" : "Personas")}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={personasCount}
                    onChange={(e) => {
                      setPersonasCount(parseInt(e.target.value));
                      setTouchedThermal(true);
                    }}
                    className="flex-1 accent-emerald-500 bg-zinc-800 h-1.5 rounded cursor-pointer"
                    id="slider_personas"
                  />
                  <div className="border text-center font-sans font-black rounded-lg px-2 py-0.5 text-[10px] bg-zinc-900 border-zinc-700 text-white shadow-sm">
                    {personasCount}
                  </div>
                </div>

                {/* Profile selector dropdown */}
                <div className="space-y-1 pt-1.5">
                  <label htmlFor="select_thermal_profile" className="block text-[10px] font-sans font-black uppercase tracking-wider text-slate-400">
                    🛁 {getTranslation("perfil_consumo_ocupante", country)}
                  </label>
                  <select
                    value={thermalProfile}
                    onChange={(e) => {
                      setThermalProfile(e.target.value as "familiar" | "intenso");
                      setTouchedThermal(true);
                    }}
                    className="w-full rounded-lg bg-black border border-emerald-800 px-2 py-1.5 text-xs font-sans font-bold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    style={{ colorScheme: 'dark', backgroundColor: '#000000', color: '#f8fafc' }}
                    id="select_thermal_profile"
                  >
                    <option value="familiar" className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("perfil_familiar_50l", country)}</option>
                    <option value="intenso" className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>{getTranslation("perfil_intenso_80l", country)}</option>
                  </select>
                </div>

                {/* Dynamic Litres math preview */}
                <div className="text-[9px] text-center text-slate-300 font-bold bg-black py-1 px-1.5 rounded mt-1.5 border border-zinc-800">
                  {getTranslation("calculo", country)}: {personasCount} {lang === "en" ? "p." : "pers."} x {thermalProfile === "intenso" ? 80 : 50} L = <span className="font-black text-yellow-400 font-mono">{personasCount * (thermalProfile === "intenso" ? 80 : 50)} L/{lang === "en" ? "day" : lang === "pt" ? "dia" : lang === "fr" ? "jour" : "día"}</span> {getTranslation("de_acs", country)}.
                </div>
              </div>

              {/* Question 1: Water Quality */}
              <div className="space-y-1 pt-1 border-t border-zinc-800">
                <label className="block text-[9.5px] font-sans font-black text-slate-300 uppercase tracking-widest">
                  💧 {getTranslation("calidad_agua_entrada", country)}
                </label>
                <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setWaterHardness("blanda");
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      waterHardness === "blanda"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("agua_blanda", country)}</span>
                    {waterHardness === "blanda" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaterHardness("dura");
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      waterHardness === "dura"
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("agua_dura", country)}</span>
                    {waterHardness === "dura" && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Question 2: Has Minors */}
              <div className="space-y-1 pt-1 border-t border-zinc-800">
                <label className="block text-[9.5px] font-sans font-black text-slate-300 uppercase tracking-widest">
                  👶 {getTranslation("habitan_menores_edad", country)}
                </label>
                <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setHasMinors(true);
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      hasMinors
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("si_hay_menores", country)}</span>
                    {hasMinors && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasMinors(false);
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      !hasMinors
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("no_hay_menores", country)}</span>
                    {!hasMinors && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Question 3: Has Pressurizer Pump */}
              <div className="space-y-1 pt-1 border-t border-zinc-800">
                <label className="block text-[9.5px] font-sans font-black text-slate-300 uppercase tracking-widest">
                  🔌 {getTranslation("cuenta_bomba_presurizadora", country)}
                </label>
                <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setHasPressurizer(true);
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      hasPressurizer
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("si_tiene_bomba", country)}</span>
                    {hasPressurizer && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasPressurizer(false);
                      setTouchedThermal(true);
                    }}
                    className={`relative py-2 px-0.5 rounded-xl transition-all duration-200 border-2 font-black cursor-pointer text-center select-none ${
                      !hasPressurizer
                        ? "bg-[#062c1d] border-emerald-500 text-emerald-100 font-black scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black border-zinc-800 text-zinc-450 hover:border-emerald-700/55 hover:text-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px]">{getTranslation("no_tiene_bomba", country)}</span>
                    {!hasPressurizer && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Box for Incomplete Data */}
            <AnimatePresence>
              {showIncompleteAlert && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
                  className="overflow-hidden text-left mb-3.5"
                >
                  <div className="p-4 rounded-xl bg-[#2D0D0D] border-2 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-left space-y-3 animate-pulse">
                    <div className="flex items-center gap-1.5 text-red-200 font-extrabold uppercase text-[10.5px] tracking-widest">
                      <span className="text-red-400 text-sm">⚠️</span>
                      <span className="text-white font-black">{getTranslation("atencion_datos_incompletos", country)}</span>
                    </div>
                    <p className="text-[12px] text-red-100 font-bold font-sans leading-relaxed">
                      {getTranslation("para_dimensionar_debe_cargar", country)}
                    </p>
                    <div className="text-[10px] text-red-300 font-bold border-t border-red-800/60 pt-3 flex flex-wrap gap-x-2.5 gap-y-1.5 items-center">
                      <span className="text-red-200 font-black uppercase tracking-wide">{getTranslation("falta_cargar", country)}</span>
                      {!domicilio.nombre.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_nombre", country).toUpperCase()}</span>}
                      {(!domicilio.apellido || !domicilio.apellido.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_apellido", country).toUpperCase()}</span>}
                      {!domicilio.domicilio.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_domicilio", country).toUpperCase()}</span>}
                      {!domicilio.localidad.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_localidad", country).toUpperCase()}</span>}
                      {(!domicilio.pais || !domicilio.pais.trim()) && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_pais", country).toUpperCase()}</span>}
                      {!domicilio.provincia.trim() && <span className="bg-[#4C1212] border border-red-500 text-red-100 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">{getTranslation("label_provincia", country).split(" / ")[0].toUpperCase()}</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => onSetDimensioned(true)}
              className={`w-full flex items-center justify-center gap-1 py-2 px-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer ${
                isDimensioned 
                  ? "bg-emerald-600 text-white border-2 border-emerald-500/30" 
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-750 text-white font-black"
              }`}
              id="btn_dimensionar_thermal"
            >
              <span>{isDimensioned ? getTranslation("sistema_dimensionado_correctamente", country) : getTranslation("dimensionar_termotanque_solar", country)}</span>
            </button>
          </div>
        )}

        {/* SECTION: RESUMEN TÉCNICO CARD - Lower Box Container themed in coordinated active blue - HIDDEN ON SCREEN AS REQUESTED */}
        <div className="hidden bg-black rounded-xl border-2 border-blue-500/40 p-3 flex flex-col justify-between relative shadow-lg">
          
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
            <span className="text-[11px] font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-1 font-sans">
              <span>{techType === "thermal" ? "Resumen Técnico Térmico" : techType === "on-grid" ? "Retorno Financiero" : "Resumen Técnico Off-Grid"}</span>
              <span className="text-blue-400 font-bold text-xs">▼</span>
            </span>
            <span className="text-[9px] text-blue-400 bg-blue-950/25 border border-blue-500/40 px-2.5 py-0.5 rounded-full font-black font-mono tracking-widest">{(techType || "").toUpperCase()} SYS</span>
          </div>

          <p className="text-[10px] text-slate-350 font-bold leading-normal mt-2">
            {techType === "thermal" 
              ? "(Termotanque Solar REDERAR / Tubos de vacío atmosféricos)" 
              : techType === "on-grid"
              ? "(Inyección Eléctrica de Excedentes a Red Distribución)"
              : "(Inversor Off-Grid / Paneles 550W / Banco Baterías Serie/Paralelo)"
            }
          </p>

          {/* Graphics or layout representing calculated configuration elements */}
          {!isDimensioned ? (
            <div className="py-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-500/20 rounded-xl bg-black/40 mt-3 p-4">
              <span className="text-[10px] text-blue-350 font-extrabold uppercase tracking-widest animate-pulse">
                [ Esperando Dimensionamiento ]
              </span>
              <p className="text-[9px] text-slate-400 font-bold mt-1 select-none">
                Cargue los datos requeridos arriba y haga clic en "Dimensionar" para habilitar las especificaciones y el retorno financiero.
              </p>
            </div>
          ) : (
            <div className="py-2.5 flex items-center justify-around">
              
              {techType === "off-grid" ? (
                /* BATTERIES DIAGRAM WIDGET (Off Grid) */
                <div className="w-full flex flex-col items-stretch gap-3 pt-1">
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <div className="flex-1 flex flex-col bg-neutral-900 p-2 rounded-lg border border-blue-500/20">
                      <span className="text-blue-400 text-[9px] font-extrabold uppercase tracking-wider text-center">Serie/Serie</span>
                      <div className="grid grid-cols-4 gap-1 mt-2 font-mono">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center bg-black border border-blue-500/30 p-1 rounded relative shadow-md">
                            <div className="flex justify-between w-full px-0.5 text-[7px] leading-none text-blue-400/80 font-black">
                              <span className="text-red-500 font-black">+</span>
                              <span className="text-blue-500 font-black">-</span>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center my-0.5">
                              <svg className="w-2.5 h-2.5 text-blue-500 fill-blue-500" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-[6px] text-white font-extrabold tracking-tighter">12V 100A</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-12 w-[1px] bg-blue-500/25" />

                    <div className="flex-1 flex flex-col bg-neutral-900 p-2 rounded-lg border border-blue-500/20">
                      <span className="text-blue-400 text-[9px] font-extrabold uppercase tracking-wider text-center">Paralelo/Series</span>
                      <div className="grid grid-cols-4 gap-1 mt-2 font-mono">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center bg-black border border-blue-500/30 p-1 rounded relative shadow-md font-sans">
                            <div className="flex justify-between w-full px-0.5 text-[7px] leading-none text-blue-400/80 font-black">
                              <span className="text-red-500 font-black">+</span>
                              <span className="text-blue-500 font-black">-</span>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center my-0.5">
                              <svg className="w-2.5 h-2.5 text-blue-500 fill-blue-500" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-[6px] text-white font-extrabold tracking-tighter">12V 100A</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : techType === "on-grid" ? (
                /* TECHNICAL RETURN BLOCK (On Grid) - Removing volatile financial estimates */
                <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-sans pt-1 font-bold">
                  <div className="p-2 bg-neutral-900 rounded-lg border border-blue-500/20 shadow-md">
                    <p className="text-[9px] text-slate-300 font-bold uppercase">
                      {lang === "en" ? "TOTAL POWER" : lang === "pt" ? "POTÊNCIA" : lang === "fr" ? "PUISSANCE TOTAL" : "POTENCIA TOTAL"}
                    </p>
                    <p className="text-blue-400 font-extrabold mt-1 text-xs truncate">
                      {sizing.totalPvPowerW} Wp
                    </p>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded-lg border border-blue-500/20 shadow-md">
                    <p className="text-[9px] text-slate-300 font-bold uppercase">
                      {lang === "en" ? "MODULES" : lang === "pt" ? "PAINÉIS" : lang === "fr" ? "MODULES" : "MÓDULOS"}
                    </p>
                    <p className="text-blue-400 font-extrabold mt-1 text-xs">
                      {sizing.panelsCount} u.
                    </p>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded-lg border border-blue-500/20 shadow-md">
                    <p className="text-[9px] text-slate-300 font-bold uppercase">
                      {lang === "en" ? "CO2 OFFSET" : lang === "pt" ? "CO2 EVITADO" : lang === "fr" ? "CO2 ÉVITÉ" : "CO2 EVITADO"}
                    </p>
                    <p className="text-cyan-400 font-extrabold mt-1 text-xs">
                      {sizing.carbonOffsetTonsCo2Year} {lang === "en" ? "Tn/Year" : lang === "pt" ? "Tn/Ano" : lang === "fr" ? "Tn/An" : "Tn/Año"}
                    </p>
                  </div>
                </div>
              ) : (
                /* SOLAR THERMAL BLOCK (Térmica) */
                <div className="w-full space-y-2.5 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-sans font-bold">
                    <div className="p-2 bg-neutral-900 rounded-lg border border-blue-500/20 shadow-md">
                      <p className="text-[9px] text-slate-300 font-bold uppercase">
                        {lang === "en" ? "Accumulated Reserve" : lang === "pt" ? "Reserva Acumulada" : lang === "fr" ? "Réserve Cumulée" : "Reserva Acumulada"}
                      </p>
                      <p className="text-blue-500 font-black mt-1 text-sm">
                        {sizing.tankLiters} {lang === "en" ? "Liters DHW" : lang === "pt" ? "Litros AQS" : lang === "fr" ? "Litres ECS" : "Litros ACS"}
                      </p>
                    </div>
                    <div className="p-2 bg-neutral-900 rounded-lg border border-blue-500/20 shadow-md">
                      <p className="text-[9px] text-slate-300 font-bold uppercase">
                        {lang === "en" ? "Vacuum Collectors" : lang === "pt" ? "Coletores de Vácuo" : lang === "fr" ? "Capteurs à Vide" : "Colectores de Vacío"}
                      </p>
                      <p className="text-blue-400 font-black mt-1 text-sm">
                        {sizing.collectorTubesCount} {lang === "en" ? "Tubes" : lang === "pt" ? "Tubos" : lang === "fr" ? "Tubes" : "Tubos"}
                      </p>
                    </div>
                  </div>
                  {sizing.thermalExplanation && (
                    <div className="p-3 bg-neutral-900 border border-blue-500/25 rounded-lg text-left text-xs font-sans font-medium space-y-1 shadow-md">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">🛒 Configuración Sugerida:</p>
                      <p className="text-slate-100 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block shrink-0 animate-pulse" />
                        {sizing.thermalExplanation} ({sizing.tankLiters}L total)
                      </p>
                      {sizing.hasPressurizer && (
                        <p className="text-[10px] text-blue-300 font-bold flex items-center gap-1">
                          <span>•</span> Equipamiento recomendado: <span className="font-extrabold text-white bg-blue-500/20 px-1 py-0.5 rounded">HEAT PIPE</span> (Bomba de presión instalada)
                        </p>
                      )}
                      {!sizing.hasPressurizer && (
                        <p className="text-[10px] text-blue-350 font-bold flex items-center gap-1">
                          <span>•</span> Tipo recomendado: Atmosférico común no presurizable
                        </p>
                      )}
                      {sizing.waterHardness === "dura" && (
                        <p className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                          <span>•</span> Requiere: <span className="font-black underline text-amber-200">Filtro Ablandador ante sarro</span>
                        </p>
                      )}
                      {sizing.hasMinors && (
                        <p className="text-[10px] text-rose-350 font-bold flex items-center gap-1">
                          <span>•</span> Protección: <span className="font-black underline text-rose-200">Válvula termostática mezcladora</span>
                        </p>
                      )}
                      
                      {(sizing.hasMinors || sizing.waterHardness === "dura" || sizing.hasPressurizer) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[9.5px] leading-relaxed text-slate-350 space-y-2 bg-neutral-950 p-2.5 rounded-lg border border-slate-700/40">
                          <p className="text-[8.5px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded w-fit border border-amber-500/20 select-none">
                            📢 Criterio Técnico y de Seguridad REDERAR
                          </p>
                          {sizing.hasMinors && (
                            <p className="font-bold leading-normal text-slate-200">
                              <span className="text-rose-455 font-extrabold text-rose-300">✓ Válvula Mezcladora Termostática:</span> Recomendada de forma obligatoria en viviendas con menores o adultos mayores. Debido a la excelente captación de los tubos evacuados, el agua acumulada alcanza habitualmente los <strong className="text-rose-200">80°C a 95°C</strong>. La válvula termostática efectúa una mezcla dosificada de flujo caliente con agua de red directamente a la salida del tanque, garantizando un point constante de entrega seguro de <strong className="text-white">40°C</strong>. Esto mitiga al 100% el riesgo de escaldaduras graves, evita los choques térmicos perjudiciales en tuberías plásticas y incrementa la autonomía real de litros de agua caliente utilizable.
                            </p>
                          )}
                          {sizing.waterHardness === "dura" && (
                            <p className="font-bold leading-normal text-slate-200">
                              <span className="text-amber-455 font-extrabold text-amber-300">✓ Filtro Ablandador ante Sarro:</span> El exceso de minerales duros (calcio y magnesio) precipita con el calor y se incrusta en las paredes de los tubos de vacío y tanques. Este sarro genera una costra que actúa como barrera aislante bloqueando la transmisión del sol hacia el agua caliente (disminuyendo el rendimiento térmico hasta en un <strong className="text-white">40%</strong>) y obstruyendo conductos, lo que causa pérdidas y roturas por sobrepresión.
                            </p>
                          )}
                          {sizing.hasPressurizer && (
                            <p className="font-bold leading-normal text-slate-200">
                              <span className="text-blue-455 font-extrabold text-blue-300">✓ Tecnología Heat Pipe en Alta Presión:</span> Si el circuito tiene una bomba presurizadora activa, someter un tanque atmosférico convencional de gravedad a presiones estáticas dañará estructuralmente la calderería interna de forma inmediata. La variante Heat Pipe utiliza varillas de cobre selladas criogénicamente que transfieren calor en seco del sol al agua del tanque sin mezclar fluidos, soportando fluidamente presiones de hasta <strong className="text-white">6 bar</strong> y permitiendo un flujo de salida uniforme de excelente caudal.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {isDimensioned && (
            <div className="mt-3.5 p-3.5 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-[10px] text-amber-200 leading-relaxed font-sans font-medium shadow-[0_0_15px_rgba(245,158,11,0.05)] animate-fade-in">
              <strong className="text-amber-400 font-black block uppercase tracking-wider mb-0.5">⚠️ {getTranslation("aviso_sizing_inicial", country)}:</strong>
              {getTranslation("desc_aviso_sizing", country)}
            </div>
          )}

          {/* CONTACT BUTTON COORDINATED IN LUXURIOUS BLUE OUTLINE */}
          <button
            onClick={isDimensioned ? onOpenPresupuesto : undefined}
            disabled={!isDimensioned}
            className={`w-full py-2 px-3 mt-2.5 font-extrabold text-center text-[11px] rounded-xl shadow-md transition duration-200 uppercase tracking-wider ${
              isDimensioned 
                ? "bg-transparent hover:bg-blue-500/10 border-2 border-blue-400 text-blue-300 cursor-pointer" 
                : "bg-slate-800/40 border-2 border-slate-700/40 text-slate-500 cursor-not-allowed opacity-60"
            }`}
            id="btn_contacto_asesor"
          >
            {isDimensioned ? getTranslation("solicitar_presupuesto_asesor", country) : getTranslation("debe_dimensionar_solicitar", country)}
          </button>

        </div>

      </div>

    </div>
  );
}
