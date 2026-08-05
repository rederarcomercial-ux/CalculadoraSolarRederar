import { useState } from "react";
import { SolarSizingResult, Domicilio } from "../types";
import { ChevronRight, FileText, Image as ImageIcon, Grid, Activity, User, TrendingUp, Zap, Clock, BarChart3, CheckCircle2 } from "lucide-react";
import { getCountryGridVoltage } from "../utils";
import { getTranslation } from "../translations";

// Import generated architectural render assets
// @ts-expect-error - image import
import onGridImg from "../assets/images/solar_on_grid_system_1781483120141.jpg";
// @ts-expect-error - image import
import offGridImg from "../assets/images/solar_off_grid_system_1781483132398.jpg";
// @ts-expect-error - image import
import thermalImg from "../assets/images/solar_thermal_system_1781483144408.jpg";

interface VistaIngenieriaProps {
  techType: "on-grid" | "off-grid" | "thermal" | null;
  sizing: SolarSizingResult;
  personasCount: number;
  onOpenReporte: () => void;
  onOpenGalerioObra: () => void;
  onOpenPresupuesto: () => void;
  isDimensioned: boolean;
  domicilio: Domicilio;
  hsp: number;
  appliances: any[];
  autonomyDays: number;
  batteryType: string;
  batteryVoltage: number;
  solarCoverage: number;
  thermalProfile: string;
  waterHardness: string;
  hasMinors: boolean;
  hasPressurizer: boolean;
  anualConsumptionKwh: number | "";
  placeholderValue: number;
  gridPhaseType: string;
}

export default function VistaIngenieria({
  techType,
  sizing,
  personasCount,
  onOpenReporte,
  onOpenGalerioObra,
  onOpenPresupuesto,
  isDimensioned,
  domicilio,
  hsp,
  appliances,
  autonomyDays,
  batteryType,
  batteryVoltage,
  solarCoverage,
  thermalProfile,
  waterHardness,
  hasMinors,
  hasPressurizer,
  anualConsumptionKwh,
  placeholderValue,
  gridPhaseType
}: VistaIngenieriaProps) {
  const gridV = getCountryGridVoltage(domicilio.pais, domicilio.provincia);
  const [activeTab, setActiveTab] = useState<"blueprint" | "render3d">("render3d");
  const [esquemaMode, setEsquemaMode] = useState<"cad" | "ilustrativo">("cad");

  const isOffGrid = techType === "off-grid";
  const isOnGrid = techType === "on-grid";
  const isThermal = techType === "thermal";

  return (
    <div className="flex flex-col h-auto md:h-full bg-black border border-white rounded-2xl p-4 shadow-sm select-none text-white transition-all duration-300 min-h-0">
      {/* Panel Title */}
      <h3 className="text-base font-extrabold text-white font-sans tracking-tight mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2">
        {getTranslation("vista_ingenieria_title", domicilio.pais)}
      </h3>

      {/* Dynamic Schematic Canvas Frame containing both stacked views */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* TITULAR DEL INFORME / DATOS DEL SOLICITANTE */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-dashed border-zinc-800 pb-2 mb-0.5 justify-between">
            <span className="text-[10px] font-black tracking-wider text-yellow-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {getTranslation("titular_proyecto", domicilio.pais)}
            </span>
            <span className="text-[8px] font-bold text-yellow-500">{getTranslation("informacion_solicitante", domicilio.pais)}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px]">
            <div>
              <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("nombre_apellido", domicilio.pais)}</p>
              <p className="font-extrabold text-white capitalize mt-0.5">
                {domicilio.nombre || domicilio.apellido
                  ? `${domicilio.nombre || ""} ${domicilio.apellido || ""}`.trim()
                  : getTranslation("no_especificado", domicilio.pais)}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("provincia_region", domicilio.pais)}</p>
              <p className="font-extrabold text-white mt-0.5">
                {domicilio.provincia ? `${domicilio.provincia} (${domicilio.pais || "Argentina"})` : `Entre Ríos (${domicilio.pais || "Argentina"})`}
              </p>
            </div>
            <div className="col-span-2 border-t border-zinc-900/40 pt-1.5">
              <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("ubicacion_domicilio", domicilio.pais)}</p>
              <p className="font-bold text-slate-300 mt-0.5 leading-tight">
                {domicilio.domicilio || "Av. Ramírez 1520"}{domicilio.localidad ? `, ${domicilio.localidad}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* PARÁMETROS DE CARGAS Y CONSUMO (VENTANA DE CARGA EN VIVO) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2.5 shadow-sm select-none">
          <div className="flex items-center gap-1.5 border-b border-dashed border-zinc-800 pb-2 mb-0.5 justify-between">
            <span className="text-[10px] font-black tracking-wider text-yellow-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {getTranslation("parametros_carga_consumo", domicilio.pais)}
            </span>
            <span className="text-[8px] font-bold text-yellow-500">{getTranslation("ventana_carga", domicilio.pais)}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px]">
            <div>
              <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("titulo_tecnologia", domicilio.pais)}</p>
              <p className="font-extrabold text-white mt-0.5 capitalize">
                {techType === "on-grid" ? getTranslation("ongrid_inyeccion_red", domicilio.pais) : techType === "off-grid" ? getTranslation("offgrid_autonomo", domicilio.pais) : techType === "thermal" ? getTranslation("termica_agua_caliente", domicilio.pais) : getTranslation("ninguna_seleccionada", domicilio.pais)}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("hsp_promedio_region", domicilio.pais)}</p>
              <p className="font-extrabold text-yellow-500 mt-0.5 font-mono">
                {hsp.toFixed(2)} {getTranslation("hsp_unidad", domicilio.pais)}
              </p>
            </div>

            {techType === "on-grid" && (
              <>
                <div className="col-span-2 border-t border-zinc-900/40 pt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("consumo_electrico_anual", domicilio.pais)}</p>
                    <p className="font-extrabold text-emerald-400 mt-0.5 font-mono">
                      {anualConsumptionKwh || placeholderValue} {getTranslation("kwh_anio", domicilio.pais)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("fases_conexion_red", domicilio.pais)}</p>
                    <p className="font-extrabold text-white mt-0.5">
                      {gridPhaseType === "monofasica"
                        ? getTranslation("monofasica_v", domicilio.pais).replace("{v}", gridV.singlePhaseV.toString())
                        : getTranslation("trifasica_v", domicilio.pais).replace("{v}", gridV.threePhaseV.toString())}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-zinc-900/20 pt-1.5">
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("cobertura_solar_solicitada", domicilio.pais)}</p>
                    <p className="font-extrabold text-white mt-0.5">
                      {getTranslation("demanda_anual_desc", domicilio.pais).replace("{percent}", solarCoverage.toString())}
                    </p>
                  </div>
                </div>
              </>
            )}

            {techType === "off-grid" && (
              <>
                <div className="col-span-2 border-t border-zinc-900/40 pt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("equipos_cargados", domicilio.pais)}</p>
                    <p className="font-extrabold text-emerald-400 mt-0.5">
                      {getTranslation("dispositivos_cargados", domicilio.pais).replace("{count}", appliances.length.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("dias_autonomia_banco", domicilio.pais)}</p>
                    <p className="font-extrabold text-white mt-0.5">
                      {autonomyDays === 1
                        ? getTranslation("reserva_dia", domicilio.pais).replace("{count}", autonomyDays.toString())
                        : getTranslation("reserva_dias", domicilio.pais).replace("{count}", autonomyDays.toString())}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-zinc-900/20 pt-1.5 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("tipo_acumuladores", domicilio.pais)}</p>
                      <p className="font-extrabold text-white mt-0.5 uppercase">
                        {batteryType} Deep Cycle
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("voltaje_banco_disenado", domicilio.pais)}</p>
                      <p className="font-extrabold text-white mt-0.5 font-mono">
                        {getTranslation("voltaje_cc", domicilio.pais).replace("{v}", batteryVoltage.toString())}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {techType === "thermal" && (
              <>
                <div className="col-span-2 border-t border-zinc-900/40 pt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("ocupantes_habituales", domicilio.pais)}</p>
                    <p className="font-extrabold text-emerald-400 mt-0.5 font-mono">
                      {getTranslation("personas_count", domicilio.pais).replace("{count}", personasCount.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("perfil_consumo_sanitario", domicilio.pais)}</p>
                    <p className="font-extrabold text-white mt-0.5">
                      {thermalProfile === "intenso" ? getTranslation("perfil_intenso_view", domicilio.pais) : getTranslation("perfil_normal_view", domicilio.pais)}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-zinc-900/20 pt-1.5 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("calidad_agua_suministro", domicilio.pais)}</p>
                      <p className="font-extrabold text-white mt-0.5">
                        {waterHardness === "dura" ? getTranslation("agua_dura_view", domicilio.pais) : getTranslation("agua_blanda_view", domicilio.pais)}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("bomba_presurizadora_view", domicilio.pais)}</p>
                      <p className="font-extrabold text-white mt-0.5">
                        {hasPressurizer ? getTranslation("bomba_equipada", domicilio.pais) : getTranslation("bomba_gravedad", domicilio.pais)}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 border-t border-zinc-900/20 pt-1.5">
                    <p className="text-zinc-500 text-[8px] font-extrabold uppercase tracking-widest font-mono">{getTranslation("valvula_mezcladora", domicilio.pais)}</p>
                    <p className="font-extrabold text-white mt-0.5">
                      {hasMinors ? getTranslation("valvula_requerida", domicilio.pais) : getTranslation("valvula_sugerida", domicilio.pais)}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!techType && (
              <div className="col-span-2 border-t border-zinc-900/40 pt-1.5">
                <p className="text-zinc-500 text-[10px] font-bold text-center py-2 italic">
                  {getTranslation("seleccione_tecnologia_central", domicilio.pais)}
                </p>
              </div>
            )}
          </div>
        </div>

        {isDimensioned ? (
          <>
            {/* SECTION 1: VISTA 3D REALISTA */}
            <div className="bg-zinc-950/40 rounded-xl border border-zinc-800 p-3 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-dashed border-zinc-800 pb-2 mb-1 justify-between">
            <span className="text-[10px] font-black tracking-wider text-yellow-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {getTranslation("vista_3d_equipamiento", domicilio.pais)}
            </span>
            <span className="text-[8px] font-bold text-yellow-500">{getTranslation("tab_render3d", domicilio.pais).toUpperCase()}</span>
          </div>

          <div className="w-full h-[180px] sm:h-[220px] relative rounded-lg overflow-hidden border border-zinc-800 shadow-sm">
            <img
              src={isThermal ? thermalImg : isOffGrid ? offGridImg : onGridImg}
              alt={getTranslation("vista_3d_equipamiento", domicilio.pais)}
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Information moved below the image instead of overlays */}
          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col gap-1.5 select-none">
            <div className="text-[9.5px] font-black text-yellow-400 bg-zinc-900 px-2 py-0.5 rounded w-fit border border-zinc-800 shadow-xs">
              ⚡ {getTranslation("propuesto", domicilio.pais)}: <span className="text-white font-extrabold">{isThermal ? getTranslation("sistema_termico_acs", domicilio.pais) : getTranslation("sistema_fotovoltaico", domicilio.pais)}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal font-sans font-bold">
              {isThermal 
                ? getTranslation("desc_thermal_render_full", domicilio.pais)
                    .replace("{tankLiters}", sizing.tankLiters.toString())
                    .replace("{collectorTubesCount}", sizing.collectorTubesCount.toString())
                    .replace("{auxiliaryHeaterPowerW}", sizing.auxiliaryHeaterPowerW.toString())
                : isOffGrid
                  ? getTranslation("desc_offgrid_render_full", domicilio.pais)
                      .replace("{inverterKw}", (sizing.inverterPowerW / 1000).toFixed(1))
                      .replace("{panelsCount}", sizing.panelsCount.toString())
                      .replace("{panelPowerW}", sizing.panelPowerW.toString())
                      .replace("{totalPvKw}", (sizing.totalPvPowerW / 1000).toFixed(2))
                      .replace("{batteriesTotalCount}", sizing.batteriesTotalCount.toString())
                      .replace("{batteryCapacityAh}", (sizing.batteryCapacityAh || 200).toString())
                      .replace("{batterySystemVoltage}", sizing.batterySystemVoltage.toString())
                  : getTranslation("desc_ongrid_render_full", domicilio.pais)
                      .replace("{inverterKw}", (sizing.inverterPowerW / 1000).toFixed(1))
                      .replace("{panelsCount}", sizing.panelsCount.toString())
                      .replace("{panelPowerW}", sizing.panelPowerW.toString())
                      .replace("{totalPvKw}", (sizing.totalPvPowerW / 1000).toFixed(2))
              }
            </p>
          </div>
        </div>

        {/* SECTION 2: PLANO TÉCNICO / ESQUEMA UNIFILAR */}
        <div className="bg-zinc-950/40 rounded-xl border border-zinc-800 p-3 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-dashed border-zinc-800 pb-2 mb-1 justify-between flex-wrap">
            <span className="text-[10px] font-black tracking-wider text-yellow-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {getTranslation("plano_tecnico_esquema", domicilio.pais)}
            </span>
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setEsquemaMode("cad")}
                className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-colors cursor-pointer ${
                  esquemaMode === "cad"
                    ? "bg-yellow-500 text-black shadow-xs font-mono"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📐 {getTranslation("cad_unifilar_btn", domicilio.pais)}
              </button>
              <button
                type="button"
                onClick={() => setEsquemaMode("ilustrativo")}
                className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-colors cursor-pointer ${
                  esquemaMode === "ilustrativo"
                    ? "bg-yellow-500 text-black shadow-xs font-mono"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🎨 {getTranslation("cad_ilustrativo_btn", domicilio.pais)}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[220px] flex items-center justify-center py-2 relative">
            {/* Animated Glow Flow Lines Filter (SVG Definition) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="yellow-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ebd132" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>

            {esquemaMode === "cad" ? (
              /* CAD UNIFILAR TÉCNICO STANDARDIZED DIAGRAM */
              <div id="cad_sch_container" className="w-full flex flex-col justify-between p-3 bg-zinc-950 border border-yellow-500/40 rounded-xl shadow-xl relative overflow-hidden select-none">
                <div className="w-full flex items-center justify-center relative min-h-[380px]" id="svg_schema_cad">
                  <svg className="w-full h-auto max-w-[520px]" viewBox="0 0 540 600" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" strokeWidth="0.5" />
                      </pattern>
                    </defs>

                    {/* Engineering Background Grid */}
                    <rect width="540" height="600" fill="#09090b" rx="8" />
                    <rect width="540" height="600" fill="url(#gridPattern)" rx="8" />

                    {/* Header CAD Title Block */}
                    <rect x="15" y="15" width="510" height="32" fill="#18181b" stroke="#eab308" strokeWidth="1" rx="4" />
                    <text x="270" y="35" fill="#facc15" fontSize="11" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
                      {getTranslation("cad_title_prefix", domicilio.pais)} {isThermal ? getTranslation("cad_title_thermal", domicilio.pais) : isOffGrid ? getTranslation("cad_title_offgrid", domicilio.pais) : getTranslation("cad_title_ongrid", domicilio.pais)}
                    </text>

                    {!isThermal ? (
                      /* PHOTOVOLTAIC ON-GRID / OFF-GRID UNIFILAR SCHEMATIC */
                      <>
                        {/* 1. RED ELÉCTRICA DISTRIBUIDORA */}
                        <g transform="translate(0, 55)">
                          <text x="270" y="15" fill="#e4e4e7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {isOffGrid 
                              ? getTranslation("cad_grid_backup", domicilio.pais) 
                              : getTranslation("cad_grid_distributor", domicilio.pais).replace("{phase}", gridPhaseType === "trifasica" ? getTranslation("trifasica_v", domicilio.pais).replace("{v}", gridV.threePhaseV) : getTranslation("monofasica_v", domicilio.pais).replace("{v}", gridV.singlePhaseV))}
                          </text>
                          <line x1="80" y1="25" x2="460" y2="25" stroke="#facc15" strokeWidth="2.5" />
                          
                          {/* Transformer Symbol Coils */}
                          <circle cx="270" cy="35" r="10" fill="none" stroke="#facc15" strokeWidth="1.8" />
                          <circle cx="270" cy="48" r="10" fill="none" stroke="#facc15" strokeWidth="1.8" />
                          <line x1="270" y1="25" x2="270" y2="25" stroke="#facc15" strokeWidth="2" />
                          <line x1="270" y1="58" x2="270" y2="75" stroke="#e4e4e7" strokeWidth="1.8" />
                          {/* Phase hatch marks */}
                          <line x1="264" y1="68" x2="276" y2="62" stroke="#e4e4e7" strokeWidth="1.5" />
                          <line x1="264" y1="72" x2="276" y2="66" stroke="#e4e4e7" strokeWidth="1.5" />
                        </g>

                        {/* 2. INTERRUPTOR FRONTERA & MEDIDOR DE ABONADO */}
                        <g transform="translate(0, 130)">
                          {/* Interruptor Frontera */}
                          <rect x="200" y="0" width="140" height="30" fill="#18181b" stroke="#a1a1aa" strokeWidth="1.2" rx="3" />
                          <path d="M 245 15 L 260 15 M 260 15 L 275 8 M 275 15 L 295 15" stroke="#facc15" strokeWidth="1.8" fill="none" />
                          <text x="350" y="19" fill="#a1a1aa" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                            {getTranslation("cad_interruptor_frontera", domicilio.pais).replace("{amps}", gridPhaseType === "trifasica" ? "4x125A" : "2x63A")}
                          </text>

                          {/* Cable from Frontera to Meter */}
                          <line x1="270" y1="30" x2="270" y2="50" stroke="#e4e4e7" strokeWidth="1.8" />
                          <line x1="264" y1="42" x2="276" y2="36" stroke="#e4e4e7" strokeWidth="1.5" />

                          {/* Meter Enclosure / Contador Bidireccional */}
                          <rect x="180" y="50" width="180" height="70" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" rx="4" />
                          <text x="270" y="65" fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {isOffGrid ? getTranslation("cad_tablero_transferencia", domicilio.pais) : getTranslation("cad_medidor_abonado", domicilio.pais)}
                          </text>

                          {/* Meters (kWh Import / Export) */}
                          <rect x="195" y="73" width="70" height="36" fill="#09090b" stroke="#3f3f46" strokeWidth="1" rx="2" />
                          <text x="230" y="86" fill="#facc15" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">kW/h</text>
                          <path d="M 230 90 L 230 102 M 226 98 L 230 102 L 234 98" stroke="#38bdf8" strokeWidth="1.5" fill="none" />

                          <rect x="275" y="73" width="70" height="36" fill="#09090b" stroke="#3f3f46" strokeWidth="1" rx="2" />
                          <text x="310" y="86" fill="#facc15" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">kW/h</text>
                          <path d="M 310 102 L 310 90 M 306 94 L 310 90 L 314 94" stroke="#4ade80" strokeWidth="1.5" fill="none" />

                          <text x="370" y="88" fill="#a1a1aa" fontSize="8" fontStyle="italic" fontFamily="monospace">
                            {getTranslation("cad_contador_consumo", domicilio.pais)}
                          </text>
                          <text x="370" y="98" fill="#a1a1aa" fontSize="8" fontStyle="italic" fontFamily="monospace">
                            {isOffGrid ? getTranslation("cad_cargas_reserva", domicilio.pais) : getTranslation("cad_exportacion_abonado", domicilio.pais)}
                          </text>
                        </g>

                        {/* 3. INTERRUPTOR DE CORTE & PUESTA A TIERRA (PAT) */}
                        <g transform="translate(0, 250)">
                          <line x1="270" y1="0" x2="270" y2="25" stroke="#e4e4e7" strokeWidth="1.8" />
                          
                          {/* Switch Symbol */}
                          <circle cx="270" cy="25" r="2.5" fill="#facc15" />
                          <line x1="270" y1="25" x2="282" y2="12" stroke="#facc15" strokeWidth="2" />
                          <circle cx="270" cy="45" r="2.5" fill="#facc15" />
                          <line x1="270" y1="45" x2="270" y2="70" stroke="#e4e4e7" strokeWidth="1.8" />

                          <text x="290" y="38" fill="#e4e4e7" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                            {getTranslation("cad_interruptor_corte", domicilio.pais).replace("{amps}", gridPhaseType === "trifasica" ? "4x32A" : "2x20A")}
                          </text>

                          {/* Cable specification tag */}
                          <line x1="264" y1="58" x2="276" y2="52" stroke="#e4e4e7" strokeWidth="1.5" />
                          <text x="285" y="60" fill="#facc15" fontSize="8" fontWeight="bold" fontFamily="monospace">
                            {gridPhaseType === "trifasica" ? "4X16mm² + 1x16T 1kV" : "2X10mm² + 1x10T 1kV"}
                          </text>

                          {/* Puesta a Tierra (Ground connection) */}
                          <line x1="270" y1="35" x2="100" y2="35" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4,3" />
                          <line x1="100" y1="35" x2="100" y2="55" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4,3" />
                          {/* Ground symbol */}
                          <line x1="88" y1="55" x2="112" y2="55" stroke="#a1a1aa" strokeWidth="2" />
                          <line x1="92" y1="59" x2="108" y2="59" stroke="#a1a1aa" strokeWidth="1.8" />
                          <line x1="96" y1="63" x2="104" y2="63" stroke="#a1a1aa" strokeWidth="1.5" />
                          <text x="65" y="75" fill="#a1a1aa" fontSize="8" fontWeight="bold" fontFamily="monospace">
                            {getTranslation("cad_pat_ground", domicilio.pais)}
                          </text>
                        </g>

                        {/* 4. CAJA DE PROTECCIONES Y TABLERO DE INVERSOR */}
                        <g transform="translate(0, 320)">
                          <rect x="130" y="0" width="280" height="175" fill="#121215" stroke="#eab308" strokeWidth="1.5" strokeDasharray="6,4" rx="6" />
                          <text x="270" y="16" fill="#facc15" fontSize="8.5" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                            {getTranslation("cad_tablero_principal", domicilio.pais)}
                          </text>

                          {/* Interruptor Diferencial AC */}
                          <g transform="translate(200, 28)">
                            <rect x="0" y="0" width="140" height="24" fill="#18181b" stroke="#52525b" strokeWidth="1" rx="2" />
                            <path d="M 20 12 L 35 12 M 35 12 L 45 6 M 45 12 L 60 12" stroke="#facc15" strokeWidth="1.5" fill="none" />
                            <circle cx="80" cy="12" r="3" fill="#f43f5e" />
                            <text x="90" y="15" fill="#e4e4e7" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                              {gridPhaseType === "trifasica" ? "4X40A 0.03A" : "2X40A 0.03A"}
                            </text>
                          </g>

                          <line x1="270" y1="52" x2="270" y2="60" stroke="#e4e4e7" strokeWidth="1.5" />

                          {/* Llave Termomagnética AC */}
                          <g transform="translate(200, 60)">
                            <rect x="0" y="0" width="140" height="24" fill="#18181b" stroke="#52525b" strokeWidth="1" rx="2" />
                            <path d="M 20 12 L 35 12 M 35 12 L 45 6 M 45 12 L 60 12" stroke="#facc15" strokeWidth="1.5" fill="none" />
                            <text x="75" y="15" fill="#e4e4e7" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                              {gridPhaseType === "trifasica" ? "4P 32A" : "2P 25A"}
                            </text>
                          </g>

                          <line x1="270" y1="84" x2="270" y2="95" stroke="#e4e4e7" strokeWidth="1.5" />

                          {/* Inversor Symbol Box */}
                          <g transform="translate(190, 95)">
                            <rect x="0" y="0" width="160" height="42" fill="#18181b" stroke="#eab308" strokeWidth="1.5" rx="3" />
                            <line x1="0" y1="42" x2="160" y2="0" stroke="#3f3f46" strokeWidth="1" />
                            <text x="35" y="26" fill="#38bdf8" fontSize="12" fontWeight="black" fontFamily="monospace">=</text>
                            <text x="125" y="26" fill="#4ade80" fontSize="12" fontWeight="black" fontFamily="monospace">~</text>
                            <text x="80" y="20" fill="#ffffff" fontSize="9" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_inversor_label", domicilio.pais)}</text>
                            <text x="80" y="32" fill="#facc15" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {(sizing.inverterPowerW / 1000).toFixed(1)} kW {isOffGrid ? getTranslation("cad_offgrid_isla", domicilio.pais) : getTranslation("cad_ongrid_label", domicilio.pais)}
                            </text>
                          </g>

                          {/* DC Fuses and Wiring */}
                          <line x1="210" y1="137" x2="210" y2="160" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />
                          <line x1="330" y1="137" x2="330" y2="160" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />

                          <text x="200" y="152" fill="#a1a1aa" fontSize="7.5" fontWeight="bold" fontFamily="monospace">1X15A DC</text>
                          <text x="340" y="152" fill="#a1a1aa" fontSize="7.5" fontWeight="bold" fontFamily="monospace">1X15A DC</text>
                        </g>

                        {/* 5. CAMPO FOTOVOLTAICO & BATERÍAS */}
                        {(() => {
                          const string1PanelsCount = isOffGrid ? sizing.panelsCount : Math.ceil(sizing.panelsCount / 2);
                          const string2PanelsCount = isOffGrid ? 0 : Math.floor(sizing.panelsCount / 2);

                          const renderPanelRects = (count: number) => {
                            if (count <= 0) return null;
                            const maxDraw = Math.min(count, 5);
                            const gap = 4;
                            const pWidth = Math.min(32, Math.max(12, Math.floor((100 - (maxDraw - 1) * gap) / maxDraw)));
                            const totalW = maxDraw * pWidth + (maxDraw - 1) * gap;
                            const startX = 5 + (100 - totalW) / 2;
                            return Array.from({ length: maxDraw }).map((_, i) => (
                              <rect
                                key={i}
                                x={startX + i * (pWidth + gap)}
                                y={5}
                                width={pWidth}
                                height={38}
                                fill="#1e3a8a"
                                opacity="0.6"
                                stroke="#38bdf8"
                                strokeWidth="0.5"
                              />
                            ));
                          };

                          return (
                            <g transform="translate(0, 495)">
                              <line x1="210" y1="0" x2="210" y2="15" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />
                              <line x1="330" y1="0" x2="330" y2="15" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />
                              
                              <text x="270" y="10" fill="#facc15" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                2X4mm² + 1x4T DC Solar
                              </text>

                              {/* String 1 Box */}
                              <g transform="translate(130, 15)">
                                <rect x="0" y="0" width="110" height="48" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                                {renderPanelRects(string1PanelsCount)}
                                <text x="55" y="60" fill="#e4e4e7" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                  {string1PanelsCount} {string1PanelsCount === 1 ? getTranslation("cad_modulo_singular", domicilio.pais) : getTranslation("cad_modulo_plural", domicilio.pais)} {getTranslation("cad_de_w", domicilio.pais).replace("{power}", sizing.panelPowerW.toString())}
                                </text>
                              </g>

                              {/* String 2 Box or Battery Bank */}
                              <g transform="translate(300, 15)">
                                <rect x="0" y="0" width="110" height="48" fill="#09090b" stroke={isOffGrid ? "#f59e0b" : "#38bdf8"} strokeWidth="1.5" rx="3" />
                                {isOffGrid ? (
                                  <>
                                    <text x="55" y="20" fill="#facc15" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_rack_baterias", domicilio.pais)}</text>
                                    <text x="55" y="34" fill="#a1a1aa" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                      {sizing.batteriesTotalCount}x {sizing.batteryCapacityAh || 200}Ah {batteryType}
                                    </text>
                                  </>
                                ) : (
                                  renderPanelRects(string2PanelsCount)
                                )}
                                <text x="55" y="60" fill="#e4e4e7" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                  {isOffGrid 
                                    ? getTranslation("cad_banco_voltaje", domicilio.pais).replace("{v}", sizing.batterySystemVoltage.toString()) 
                                    : string2PanelsCount > 0 
                                      ? `${string2PanelsCount} ${string2PanelsCount === 1 ? getTranslation("cad_modulo_singular", domicilio.pais) : getTranslation("cad_modulo_plural", domicilio.pais)} ${getTranslation("cad_de_w", domicilio.pais).replace("{power}", sizing.panelPowerW.toString())}` 
                                      : getTranslation("cad_string_reserva", domicilio.pais)}
                                </text>
                              </g>

                              {/* Total Photovoltaic Capacity */}
                              <text x="270" y="92" fill="#facc15" fontSize="10" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                                {getTranslation("cad_campo_fotovoltaico", domicilio.pais).replace("{power}", sizing.totalPvPowerW.toLocaleString('es-AR'))}
                              </text>
                            </g>
                          );
                        })()}
                      </>
                    ) : (
                      /* THERMAL UNIFILAR CAD DIAGRAM */
                      sizing.thermalEquipments && sizing.thermalEquipments.length > 1 ? (
                        /* MULTI-EQUIPMENT PARALLEL THERMAL SCHEMATIC */
                        <g transform="translate(0, 30)">
                          <rect x="130" y="10" width="280" height="80" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                          <text x="270" y="32" fill="#60a5fa" fontSize="10.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_cold_water_feed", domicilio.pais)}</text>
                          <text x="270" y="48" fill="#e4e4e7" fontSize="8.5" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_valvulas_retencion", domicilio.pais)}</text>
                          <text x="270" y="66" fill="#38bdf8" fontSize="8.5" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">
                            {getTranslation("cad_bateria_paralelo", domicilio.pais).replace("{equipments}", sizing.thermalEquipments.map(e => `${e}L`).join(" + ")).replace("{total}", sizing.tankLiters.toString())}
                          </text>

                          {/* Cold Main Line down and split manifold */}
                          <line x1="270" y1="90" x2="270" y2="115" stroke="#3b82f6" strokeWidth="3" />
                          <line x1="135" y1="115" x2="405" y2="115" stroke="#3b82f6" strokeWidth="3" />
                          <text x="270" y="110" fill="#60a5fa" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{getTranslation("cad_colector_agua_fria", domicilio.pais)}</text>

                          <line x1="135" y1="115" x2="135" y2="140" stroke="#3b82f6" strokeWidth="2.5" />
                          <line x1="405" y1="115" x2="405" y2="140" stroke="#3b82f6" strokeWidth="2.5" />

                          {/* TANK 1 */}
                          <g transform="translate(25, 140)">
                            <rect x="0" y="0" width="220" height="195" fill="#121215" stroke="#f59e0b" strokeWidth="1.8" rx="6" />
                            <text x="110" y="25" fill="#facc15" fontSize="10" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_equipo_num", domicilio.pais).replace("{num}", "1").replace("{liters}", sizing.thermalEquipments[0].toString())}
                            </text>
                            <text x="110" y="44" fill="#e4e4e7" fontSize="8" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_tubos_borosilicato_num", domicilio.pais).replace("{count}", Math.round(sizing.thermalEquipments[0] / 10).toString())}
                            </text>

                            <rect x="15" y="58" width="190" height="36" fill="#18181b" stroke="#ef4444" strokeWidth="1" rx="4" />
                            <text x="105" y="80" fill="#f87171" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_resistencia_termostato_w", domicilio.pais).replace("{power}", sizing.thermalEquipments[0] >= 300 ? "2000" : "1500")}
                            </text>

                            <text x="110" y="118" fill="#a1a1aa" fontSize="8" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_anodo_magnesio", domicilio.pais)}
                            </text>
                            <text x="110" y="138" fill="#a1a1aa" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_valvula_seguridad", domicilio.pais)}
                            </text>
                            <text x="110" y="165" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_carga_purga", domicilio.pais)}
                            </text>
                          </g>

                          {/* TANK 2 */}
                          <g transform="translate(295, 140)">
                            <rect x="0" y="0" width="220" height="195" fill="#121215" stroke="#f59e0b" strokeWidth="1.8" rx="6" />
                            <text x="110" y="25" fill="#facc15" fontSize="10" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_equipo_num", domicilio.pais).replace("{num}", "2").replace("{liters}", (sizing.thermalEquipments[1] || sizing.thermalEquipments[0]).toString())}
                            </text>
                            <text x="110" y="44" fill="#e4e4e7" fontSize="8" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_tubos_borosilicato_num", domicilio.pais).replace("{count}", Math.round((sizing.thermalEquipments[1] || sizing.thermalEquipments[0]) / 10).toString())}
                            </text>

                            <rect x="15" y="58" width="190" height="36" fill="#18181b" stroke="#ef4444" strokeWidth="1" rx="4" />
                            <text x="105" y="80" fill="#f87171" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_resistencia_termostato_w", domicilio.pais).replace("{power}", (sizing.thermalEquipments[1] || sizing.thermalEquipments[0]) >= 300 ? "2000" : "1500")}
                            </text>

                            <text x="110" y="118" fill="#a1a1aa" fontSize="8" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_anodo_magnesio", domicilio.pais)}
                            </text>
                            <text x="110" y="138" fill="#a1a1aa" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_valvula_seguridad", domicilio.pais)}
                            </text>
                            <text x="110" y="165" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {getTranslation("cad_carga_purga", domicilio.pais)}
                            </text>
                          </g>

                          {/* Hot Outlets down into Hot Collector Manifold */}
                          <line x1="135" y1="335" x2="135" y2="365" stroke="#ef4444" strokeWidth="2.5" />
                          <line x1="405" y1="335" x2="405" y2="365" stroke="#ef4444" strokeWidth="2.5" />

                          <line x1="135" y1="365" x2="405" y2="365" stroke="#ef4444" strokeWidth="3" />
                          <text x="270" y="360" fill="#f87171" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{getTranslation("cad_colector_unificador", domicilio.pais)}</text>

                          {/* Center line to mixing valve */}
                          <line x1="270" y1="365" x2="270" y2="410" stroke="#ef4444" strokeWidth="3" />

                          {/* Mixing Valve */}
                          <rect x="150" y="410" width="240" height="45" fill="#18181b" stroke="#f59e0b" strokeWidth="1.2" rx="4" />
                          <text x="270" y="430" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_valvula_mezcladora_title", domicilio.pais)}</text>
                          <text x="270" y="444" fill="#a1a1aa" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_proteccion_quemaduras", domicilio.pais)}</text>

                          <line x1="270" y1="455" x2="270" y2="495" stroke="#ef4444" strokeWidth="3" />
                          <text x="270" y="515" fill="#4ade80" fontSize="10" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_consumo_sanitario_vivienda", domicilio.pais)}</text>
                        </g>
                      ) : (
                        /* SINGLE TANK CAD UNIFILAR DIAGRAM */
                        <g transform="translate(0, 50)">
                          <rect x="140" y="20" width="260" height="120" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                          <text x="270" y="45" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_cold_water_feed", domicilio.pais)}</text>
                          <text x="270" y="65" fill="#e4e4e7" fontSize="9" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_valvulas_retencion", domicilio.pais)}</text>

                          <line x1="270" y1="140" x2="270" y2="180" stroke="#3b82f6" strokeWidth="3" />
                          <text x="285" y="165" fill="#60a5fa" fontSize="8.5" fontFamily="monospace">{getTranslation("cad_entrada_agua_fria_label", domicilio.pais)}</text>

                          {/* Solar Thermal Tank Box */}
                          <rect x="100" y="180" width="340" height="180" fill="#121215" stroke="#f59e0b" strokeWidth="2" rx="8" />
                          <text x="270" y="210" fill="#facc15" fontSize="12" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">
                            {getTranslation("cad_termotanque_acumulador_litros", domicilio.pais).replace("{liters}", sizing.tankLiters.toString())}
                          </text>
                          <text x="270" y="235" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
                            {getTranslation("cad_tubos_colectores_vacio", domicilio.pais).replace("{count}", sizing.collectorTubesCount.toString())}
                          </text>

                          <rect x="140" y="250" width="260" height="40" fill="#18181b" stroke="#ef4444" strokeWidth="1" rx="4" />
                          <text x="270" y="274" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {getTranslation("cad_resistencia_apoyo_termostato", domicilio.pais).replace("{power}", sizing.auxiliaryHeaterPowerW.toString())}
                          </text>

                          <text x="270" y="325" fill="#a1a1aa" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                            {getTranslation("cad_anodo_magnesio_integrado", domicilio.pais)}
                          </text>

                          <line x1="270" y1="360" x2="270" y2="420" stroke="#ef4444" strokeWidth="3" />
                          <text x="285" y="395" fill="#f87171" fontSize="8.5" fontFamily="monospace">{getTranslation("cad_salida_agua_caliente", domicilio.pais)}</text>

                          {/* Mixing Valve */}
                          <rect x="180" y="420" width="180" height="45" fill="#18181b" stroke="#f59e0b" strokeWidth="1.2" rx="4" />
                          <text x="270" y="440" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_valvula_mezcladora_title", domicilio.pais)}</text>
                          <text x="270" y="454" fill="#a1a1aa" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_proteccion_quemaduras", domicilio.pais)}</text>

                          <line x1="270" y1="465" x2="270" y2="500" stroke="#ef4444" strokeWidth="3" />
                          <text x="270" y="520" fill="#4ade80" fontSize="10" fontWeight="extrabold" fontFamily="monospace" textAnchor="middle">{getTranslation("cad_consumo_sanitario_vivienda", domicilio.pais)}</text>
                        </g>
                      )
                    )}
                  </svg>
                </div>
                <div className="flex justify-between items-center bg-black border border-zinc-800 rounded p-1.5 px-2.5 text-[8.5px] text-yellow-400 mt-2 font-mono font-bold">
                  <span>{getTranslation("cad_footer_regulatory", domicilio.pais)}</span>
                  <span>{getTranslation("cad_footer_projection", domicilio.pais)}</span>
                </div>
              </div>
            ) : isThermal ? (
              /* THERMAL SCHEMATIC - HIGH FIDELITY EVACUATED TUBE SOLAR WATER HEATER SYSTEM */
              <div id="thermal_sch_container" className="w-full min-h-[260px] flex flex-col justify-between p-3.5 bg-black border border-zinc-800 shadow-md relative overflow-hidden select-none">
                
                {/* Embedded High Fidelity SVG representating Termotanque Solar de Tubos de Vacío */}
                <div className="w-full flex items-center justify-center relative min-h-[220px]" id="svg_schema_thermal">
                   <svg className="w-full h-full max-w-[500px]" viewBox="0 0 540 280" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      {/* Tank horizontal cylinder steel gradient */}
                      <linearGradient id="tankMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="30%" stopColor="#cbd5e1" />
                        <stop offset="70%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>
                      
                      {/* Evacuated tube inner thermal grade (colors represent heat change) */}
                      <linearGradient id="tubeThermal" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="60%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>

                      {/* Frame metallic gradient */}
                      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>

                      {/* Glowing solar effect */}
                      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="40%" stopColor="#ea580c" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Sun irradiation */}
                    <g transform="translate(55, 60)" id="sun_drawing">
                      <circle cx="0" cy="0" r="32" fill="url(#sunGlow)" className="animate-pulse" />
                      <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                      <line x1="0" y1="-20" x2="0" y2="-28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="0" y1="20" x2="28" y2="28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="-20" y1="0" x2="-28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="20" y1="0" x2="28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="-14" y1="-14" x2="-20" y2="-20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                      <line x1="14" y1="14" x2="20" y2="20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                      <line x1="14" y1="-14" x2="20" y2="-20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                      <line x1="-14" y1="14" x2="-20" y2="20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                    </g>

                    {/* Ground line */}
                    <line x1="20" y1="245" x2="520" y2="245" stroke="#475569" strokeWidth="2" strokeDasharray="5,4" />

                    {/* Support Structure (Soporte Metálico) */}
                    <line x1="180" y1="245" x2="380" y2="245" stroke="url(#frameGrad)" strokeWidth="4" strokeLinecap="round" />
                    <line x1="365" y1="245" x2="365" y2="105" stroke="url(#frameGrad)" strokeWidth="4" strokeLinecap="round" />
                    <line x1="185" y1="245" x2="365" y2="105" stroke="url(#frameGrad)" strokeWidth="4" strokeLinecap="round" />
                    <line x1="320" y1="245" x2="365" y2="185" stroke="url(#frameGrad)" strokeWidth="2.5" />

                    {/* Evacuated Glass Tubes Group */}
                    {/* Parallel sloped glass collector tubes */}
                    <g id="tubes_group">
                      <line x1="195" y1="230" x2="345" y2="114" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                      
                      {/* Render 9 parallel tubes */}
                      {Array.from({ length: 9 }).map((_, i) => {
                        const spacing = i * 14;
                        const xStart = 180 + spacing;
                        const yStart = 220 - (spacing * 0.76);
                        const xEnd = 235 + spacing;
                        const yEnd = 140 - (spacing * 0.76);
                        return (
                          <g key={i}>
                            {/* Outer glass sleeve */}
                            <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="#0284c7" strokeWidth="6.5" opacity="0.4" strokeLinecap="round" />
                            {/* Inner collector element showing thermal gradients */}
                            <line x1={xStart + 1} y1={yStart - 1} x2={xEnd - 1} y2={yEnd + 1} stroke="url(#tubeThermal)" strokeWidth="4" strokeLinecap="round" />
                            {/* Center copper heat pipe axis */}
                            <line x1={xStart + 2} y1={yStart - 1.5} x2={xEnd - 2} y2={yEnd + 1.5} stroke="#fdba74" strokeWidth="1" opacity="0.8" />
                          </g>
                        );
                      })}
                      
                      {/* Ascending hot water micro animations */}
                      <path d="M 225 180 L 240 162" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                      <path d="M 265 150 L 280 132" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                      <path d="M 310 115 L 325 97" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                    </g>

                    {/* Horizontal Thermotanque (Water Storage Tank) */}
                    <g id="thermal_tank" transform="translate(325, 50)">
                      {/* Outer isolation coating cylindrical tank */}
                      <rect x="0" y="0" width="125" height="68" rx="14" fill="url(#tankMetal)" stroke="#64748b" strokeWidth="2" />
                      {/* Tank ring locks */}
                      <rect x="18" y="-1" width="5" height="70" fill="#334155" opacity="0.4" />
                      <rect x="102" y="-1" width="5" height="70" fill="#334155" opacity="0.4" />

                      {/* Cutaway inside reservoir layer (showing fluids status) */}
                      <g opacity="0.9">
                        <rect x="8" y="8" width="109" height="52" rx="10" fill="#090d16" stroke="#ea580c" strokeWidth="0.8" strokeDasharray="3,2" />
                        {/* Layer stratification: blue below (cold) orange above (hot) */}
                        <rect x="11" y="32" width="103" height="25" rx="2" fill="#2563eb" opacity="0.45" />
                        <rect x="11" y="11" width="103" height="22" rx="2" fill="#ef4444" opacity="0.4" />
                        <path d="M 12 20 Q 40 16 65 20 T 115 20" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.4" />
                      </g>

                      {/* Electric Resistance Flange */}
                      <path d="M 10 34 L 32 34 Q 38 38 32 42 L 15 42" fill="none" stroke="#f43f5e" strokeWidth="2.2" className="animate-pulse" />
                      <circle cx="8" cy="38" r="2.5" fill="#f43f5e" />

                      {/* Magnesium rod */}
                      <line x1="8" y1="24" x2="70" y2="24" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                    </g>

                    {/* Atmospheric Air Vent / Jarro de Alivio */}
                    <g id="vent_pipe" transform="translate(385, 14)">
                      <line x1="0" y1="36" x2="0" y2="0" stroke="#eab308" strokeWidth="2.5" />
                      <line x1="0" y1="0" x2="8" y2="0" stroke="#eab308" strokeWidth="2.5" />
                      <path d="M 8 -4 Q 10 -11 6 -16" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.7" className="animate-pulse" />
                    </g>

                    {/* Plumbing hydraulic circuits (In / Out) */}
                    {/* Cold input pipe entering the rear lower level */}
                    <g id="cold_in">
                      <path d="M 465 215 L 465 102 L 434 102" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 465 180 L 465 140" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                      <text x="473" y="150" fill="#2563eb" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">{getTranslation("entrada_agua_fria", domicilio.pais)}</text>
                    </g>

                    {/* Hot output pipe supplying sanitary domestic water */}
                    <g id="hot_out">
                      <path d="M 334 92 L 305 92 L 305 235" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 305 130 L 305 170" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                      <text x="297" y="170" fill="#ef4444" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="end">{getTranslation("consumo_sanitario_acs", domicilio.pais)}</text>
                    </g>

                    {/* Schematic Tags & Labels */}
                    <g transform="translate(100, 110)">
                      <line x1="0" y1="0" x2="35" y2="18" stroke="#475569" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx="0" cy="0" r="1.5" fill="#d97706" />
                      <text x="-5" y="1" fill="#f8fafc" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="end">{getTranslation("tubos_vacio_borosilicato", domicilio.pais)}</text>
                      <text x="-5" y="10" fill="#94a3b8" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="end">{getTranslation("unidades_colectoras", domicilio.pais).replace("{count}", sizing.collectorTubesCount.toString())}</text>
                    </g>

                    <g transform="translate(460, 42)">
                      <line x1="-20" y1="20" x2="6" y2="0" stroke="#475569" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx="-20" cy="20" r="1.5" fill="#d97706" />
                      <text x="12" y="2" fill="#f8fafc" fontSize="9" fontWeight="black" fontFamily="sans-serif">{getTranslation("termotanque_acumulador", domicilio.pais)}</text>
                      <text x="12" y="11" fill="#94a3b8" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">{getTranslation("capacidad_reserva_l", domicilio.pais).replace("{liters}", sizing.tankLiters.toString())}</text>
                    </g>

                    <g transform="translate(315, 128)">
                      <line x1="20" y1="-30" x2="-5" y2="0" stroke="#475569" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx="20" cy="-30" r="1.5" fill="#d97706" />
                      <text x="-10" y="8" fill="#fb7185" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="end">{getTranslation("resistencia_apoyo_w", domicilio.pais).replace("{power}", sizing.auxiliaryHeaterPowerW.toString())}</text>
                    </g>
                  </svg>
                </div>

                {/* Additional engineering note details below */}
                <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded p-1.5 px-2.5 text-[8.5px] text-yellow-400 mt-2 font-sans font-black">
                  <span>{getTranslation("tanque_interno_acero", domicilio.pais)}</span>
                  <span>{getTranslation("eficiencia_termica_96", domicilio.pais)}</span>
                </div>
              </div>
            ) : isOffGrid ? (
              /* PHOTOVOLTAIC OFF-GRID SCHEMATIC (Paneles, Inverter, Baterias) */
              <div id="offgrid_sch_container" className="w-full min-h-[260px] flex flex-col justify-between p-3.5 bg-black border border-zinc-800 shadow-md relative overflow-hidden select-none">
                <div className="w-full flex items-center justify-center relative min-h-[220px]" id="svg_schema_offgrid">
                  <svg className="w-full h-full max-w-[500px]" viewBox="0 0 540 280" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="invMetalOff" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#cbd5e1" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                      <linearGradient id="panelGlassOff" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="60%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <radialGradient id="sunGlowOff" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="40%" stopColor="#ea580c" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Sun Irradiation */}
                    <g transform="translate(55, 60)" id="pv_sun_off">
                      <circle cx="0" cy="0" r="32" fill="url(#sunGlowOff)" className="animate-pulse" />
                      <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                      <line x1="0" y1="-20" x2="0" y2="-28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="0" y1="20" x2="28" y2="28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="-20" y1="0" x2="-28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="20" y1="0" x2="28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                    </g>

                    {/* Ground reference */}
                    <line x1="20" y1="245" x2="520" y2="245" stroke="#475569" strokeWidth="2" strokeDasharray="5,4" />

                    {/* Solar Panel Array Vector (Tilted layout) */}
                    <g id="pv_panels_offgrid" transform="translate(70, 110)">
                      <path d="M 0 110 L 40 40 L 70 110" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <line x1="15" y1="84" x2="55" y2="84" stroke="#475569" strokeWidth="2" />
                      <rect x="-10" y="20" width="105" height="65" rx="5" transform="rotate(-15, 42, 52)" fill="url(#panelGlassOff)" stroke="#38bdf8" strokeWidth="2" />
                      <g transform="rotate(-15, 42, 52)">
                        <line x1="25" y1="20" x2="25" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="60" y1="20" x2="60" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="80" y1="20" x2="80" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="36" x2="95" y2="36" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="52" x2="95" y2="52" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="68" x2="95" y2="68" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                      </g>
                    </g>

                    {/* DC wiring from Panels to Inverter */}
                    <path d="M 165 170 L 235 170" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,2" />
                    <circle cx="200" cy="170" r="3" fill="#f43f5e" className="animate-ping" />

                    {/* Off-Grid Inverter / Charger Box */}
                    <g id="pv_inverter_offgrid" transform="translate(235, 45)">
                      <rect x="0" y="0" width="100" height="110" rx="10" fill="url(#invMetalOff)" stroke="#64748b" strokeWidth="2.5" />
                      <text x="50" y="16" fill="#fbbf24" fontSize="8" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">MUST SOLAR</text>
                      <rect x="15" y="24" width="70" height="38" rx="4" fill="#020617" stroke="#e2e8f0" strokeWidth="0.6" />
                      <text x="50" y="40" fill="#38bdf8" fontSize="11" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                        {(sizing.inverterPowerW / 1000).toFixed(1)} kW
                      </text>
                      <text x="50" y="52" fill="#38bdf8" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle" opacity="0.8">
                        OFF-GRID ISLA
                      </text>
                      <circle cx="30" cy="78" r="2.5" fill="#10b981" className="animate-pulse" />
                      <circle cx="50" cy="78" r="2.5" fill="#f59e0b" className="animate-pulse" />
                      <circle cx="70" cy="78" r="2.5" fill="#3b82f6" />
                      <text x="30" y="88" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">INV</text>
                      <text x="50" y="88" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">CHG</text>
                      <text x="70" y="88" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BATT</text>
                    </g>

                    {/* DC Cables link Inverter to Batteries below */}
                    <path d="M 270 155 L 270 178" stroke="#ef4444" strokeWidth="3" fill="none" />
                    <path d="M 300 155 L 300 178" stroke="#3b82f6" strokeWidth="3" fill="none" />
                    <text x="258" y="171" fill="#b91c1c" fontSize="7" fontWeight="bold" fontFamily="monospace">+</text>
                    <text x="312" y="171" fill="#1d4ed8" fontSize="7" fontWeight="bold" fontFamily="monospace">-</text>
                    <g id="battery_bank" transform="translate(235, 178)">
                      <rect x="0" y="0" width="100" height="56" rx="6" fill="#090d16" stroke="#ca8a04" strokeWidth="1.2" />
                      <text x="50" y="14" fill="#f8fafc" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{getTranslation("banco_baterias_title", domicilio.pais)}</text>
                      <text x="50" y="26" fill="#b91c1c" fontSize="8" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                        {sizing.batteriesTotalCount}x {batteryType === "litio" ? getTranslation("bateria_litio_full", domicilio.pais) : getTranslation("bateria_gel_full", domicilio.pais)} ({sizing.batteryCapacityAh || 200}Ah)
                      </text>
                      <rect x="15" y="34" width="70" height="8" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
                      <rect x="16" y="35" width="56" height="6" rx="1.5" fill="#10b981" />
                      <text x="50" y="49" fill="#10b981" fontSize="6.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{getTranslation("estado_carga_80", domicilio.pais)}</text>
                    </g>
 
                    {/* AC Line feeding the home loads */}
                    <path d="M 335 100 L 415 100" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="375" cy="100" r="2.5" fill="#2563eb" className="animate-pulse" />
 
                    {/* Autonomous loads block */}
                    <g id="pv_home_offgrid" transform="translate(415, 75)">
                      <rect x="0" y="0" width="95" height="96" rx="6" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
                      
                      {/* High-quality House Vector Drawing */}
                      <g transform="translate(12, 8)">
                        {/* Roof */}
                        <polygon points="35,0 70,22 0,22" fill="#cbd5e1" stroke="#0284c7" strokeWidth="1.2" strokeLinejoin="round" />
                        {/* Chimney */}
                        <rect x="52" y="5" width="8" height="12" fill="#94a3b8" stroke="#0284c7" strokeWidth="0.8" />
                        <line x1="52" y1="5" x2="60" y2="5" stroke="#0284c7" strokeWidth="0.8" />
                        {/* House Body */}
                        <rect x="8" y="22" width="54" height="30" fill="#f1f5f9" stroke="#0284c7" strokeWidth="1.2" />
                        {/* Door */}
                        <rect x="30" y="36" width="12" height="16" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
                        <circle cx="39" cy="44" r="1" fill="#fbbf24" />
                        {/* Window */}
                        <rect x="14" y="27" width="10" height="9" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
                        <line x1="19" y1="27" x2="19" y2="36" stroke="#0284c7" strokeWidth="0.5" />
                        <line x1="14" y1="31.5" x2="24" y2="31.5" stroke="#0284c7" strokeWidth="0.5" />
                        {/* Window 2 */}
                        <rect x="46" y="27" width="10" height="9" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
                        <line x1="51" y1="27" x2="51" y2="36" stroke="#0284c7" strokeWidth="0.5" />
                        <line x1="46" y1="31.5" x2="56" y2="31.5" stroke="#0284c7" strokeWidth="0.5" />
                      </g>
                      
                      <text x="47.5" y="62" fill="#f8fafc" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{getTranslation("casa_vivienda_label", domicilio.pais)}</text>
                      
                      <rect x="10" y="68" width="75" height="22" rx="3" fill="#020617" stroke="#94a3b8" />
                      <text x="47.5" y="81" fill="#c2410c" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        {getTranslation("dias_reserva", domicilio.pais).replace("{count}", sizing.backupAutonomyDays.toString())}
                      </text>
                    </g>
 
                    {/* Labels and tags */}
                    <g transform="translate(5, 235)">
                      <text x="15" y="-32" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">{getTranslation("captacion_maxima", domicilio.pais)}</text>
                      <text x="15" y="-22" fill="#f8fafc" fontSize="9" fontWeight="black" fontFamily="sans-serif">{sizing.panelsCount} Módulos {sizing.panelPowerW}W</text>
                    </g>
                  </svg>
                </div>
                <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded p-1.5 px-2.5 text-[8.5px] text-yellow-400 mt-2">
                  <span>{getTranslation("almacenamiento_autonomo_total", domicilio.pais)}</span>
                  <span>{getTranslation("suministro_continuo_apagones", domicilio.pais)}</span>
                </div>
              </div>
            ) : (
              /* PHOTOVOLTAIC ON-GRID SCHEMATIC (Paneles e Inversor Sincronizado a Red) */
              <div id="ongrid_sch_container" className="w-full min-h-[260px] flex flex-col justify-between p-3.5 bg-black border border-zinc-800 shadow-md relative overflow-hidden select-none">
                <div className="w-full flex items-center justify-center relative min-h-[220px]" id="svg_schema_ongrid">
                  <svg className="w-full h-full max-w-[500px]" viewBox="0 0 540 280" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="invMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#cbd5e1" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                      <linearGradient id="panelGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="60%" stopColor="#172554" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="40%" stopColor="#ea580c" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Sun Irradiation */}
                    <g transform="translate(55, 60)" id="pv_sun">
                      <circle cx="0" cy="0" r="32" fill="url(#sunGlow)" className="animate-pulse" />
                      <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                      <line x1="0" y1="-20" x2="0" y2="-28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="0" y1="20" x2="28" y2="28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="-20" y1="0" x2="-28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="20" y1="0" x2="28" y2="0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                    </g>

                    {/* Ground reference */}
                    <line x1="20" y1="245" x2="520" y2="245" stroke="#475569" strokeWidth="2" strokeDasharray="5,4" />

                    {/* Solar Panel Array Vector (Tilted layout) */}
                    <g id="pv_panels_ongrid" transform="translate(70, 110)">
                      <path d="M 0 110 L 40 40 L 70 110" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <line x1="15" y1="84" x2="55" y2="84" stroke="#475569" strokeWidth="2" />
                      <rect x="-10" y="20" width="105" height="65" rx="5" transform="rotate(-15, 42, 52)" fill="url(#panelGlass)" stroke="#38bdf8" strokeWidth="2" />
                      <g transform="rotate(-15, 42, 52)">
                        <line x1="25" y1="20" x2="25" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="60" y1="20" x2="60" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="80" y1="20" x2="80" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="36" x2="95" y2="36" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="52" x2="95" y2="52" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                        <line x1="-10" y1="68" x2="95" y2="68" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                      </g>
                    </g>

                    {/* DC wiring from Panels to Inverter */}
                    <path d="M 165 170 L 235 170" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,2" />
                    <circle cx="200" cy="170" r="3" fill="#f43f5e" className="animate-ping" />

                    {/* On-Grid Inverter Box */}
                    <g id="pv_inverter_ongrid" transform="translate(235, 75)">
                      <rect x="0" y="0" width="95" height="115" rx="10" fill="url(#invMetal)" stroke="#64748b" strokeWidth="2.5" />
                      <text x="47.5" y="16" fill="#f59e0b" fontSize="8" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">GROWATT</text>
                      <rect x="12" y="24" width="71" height="42" rx="4" fill="#020617" stroke="#e2e8f0" strokeWidth="0.6" />
                      <text x="47.5" y="44" fill="#10b981" fontSize="11" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                        {(sizing.inverterPowerW / 1000).toFixed(1)} kW
                      </text>
                      <text x="47.5" y="56" fill="#10b981" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle" opacity="0.8">
                        ON-GRID ES
                      </text>
                      <circle cx="25" cy="85" r="3" fill="#10b981" className="animate-pulse" />
                      <circle cx="47.5" cy="85" r="3" fill="#10b981" />
                      <circle cx="70" cy="85" r="3" fill="#3b82f6" />
                      <text x="25" y="96" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">RUN</text>
                      <text x="47.5" y="96" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GRID</text>
                      <text x="70" y="96" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">COM</text>
                    </g>

                    {/* AC Distribution & Flows off Inverter to Priority Home Loads */}
                    <path d="M 330 115 L 415 115" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 330 150 L 415 150" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Household Loads Icon */}
                    <g id="pv_home_ongrid" transform="translate(415, 75)">
                      <rect x="0" y="0" width="90" height="58" rx="6" fill="#090d16" stroke="#3b82f6" strokeWidth="1.2" />
                      {/* Elegant house vector silhouette */}
                      <g transform="translate(10, 4)">
                        {/* Roof */}
                        <polygon points="35,0 70,16 0,16" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="1" strokeLinejoin="round" />
                        {/* House Body */}
                        <rect x="8" y="16" width="54" height="20" fill="#f1f5f9" stroke="#38bdf8" strokeWidth="1" />
                        {/* Door */}
                        <rect x="30" y="24" width="12" height="12" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="0.8" />
                        <circle cx="39" cy="30" r="0.6" fill="#fbbf24" />
                        {/* Window */}
                        <rect x="14" y="20" width="10" height="6" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="0.8" />
                        {/* Window 2 */}
                        <rect x="46" y="20" width="10" height="6" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="0.8" />
                      </g>
                      <text x="45" y="46" fill="#f8fafc" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{getTranslation("casa_vivienda_label", domicilio.pais)}</text>
                      <text x="45" y="53" fill="#38bdf8" fontSize="6" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">{getTranslation("ac_prioridad", domicilio.pais).replace("{voltage}", gridV.singlePhaseV.toString())}</text>
                    </g>
 
                    {/* Bidirectional Smart Meter and Network grid link */}
                    <g id="pv_grid_meter" transform="translate(415, 148)">
                      <rect x="0" y="0" width="90" height="64" rx="6" fill="#090d16" stroke="#ca8a04" strokeWidth="1.2" />
                      <text x="45" y="14" fill="#ca8a04" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{getTranslation("ongrid_inyeccion_red", domicilio.pais).toUpperCase()}</text>
                      <rect x="12" y="22" width="66" height="18" rx="3" fill="#020617" stroke="#334155" />
                      <text x="45" y="34" fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        - {(sizing.totalWhPerDay / 1000).toFixed(1)} kWh/d
                      </text>
                      <text x="45" y="52" fill="#94a3b8" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">Ley Nac. 27.424</text>
                      <path d="M 4 33 L 10 33 M 7 30 L 10 33 L 7 36" fill="none" stroke="#eab308" strokeWidth="1.2" />
                      <path d="M 86 33 L 80 33 M 83 30 L 80 33 L 83 36" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
                    </g>
 
                    {/* Tags and annotations */}
                    <g transform="translate(5, 235)">
                      <text x="15" y="-32" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">{getTranslation("paneles_solares", domicilio.pais)}</text>
                      <text x="15" y="-22" fill="#f8fafc" fontSize="9" fontWeight="black" fontFamily="sans-serif">{sizing.panelsCount} Módulos {sizing.panelPowerW}W</text>
                    </g>
                  </svg>
                </div>
                <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded p-1.5 px-2.5 text-[8.5px] text-yellow-400 mt-2 font-sans font-black">
                  <span>{getTranslation("generacion_estimada_dia", domicilio.pais).replace("{kwh}", (sizing.totalWhPerDay / 1000).toFixed(1))}</span>
                  <span>{getTranslation("balance_neto_certificado", domicilio.pais)}</span>
                </div>
              </div>
            )}
          </div>
 
          {/* Computed Specifications Summary Banner inside schematic wrapper */}
          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between shadow-xs">
            <div>
              <h4 className="text-[8px] font-black text-yellow-500 uppercase tracking-wider">
                {isThermal ? getTranslation("presupuesto_solar_recomendado", domicilio.pais) : getTranslation("computo_electrico_sistema", domicilio.pais)}
              </h4>
              <p className="text-xs font-black text-white mt-0.5">
                {isThermal ? getTranslation("termotanque_atmosferico_resistencia", domicilio.pais) : getTranslation("generacion_electrica_fotovoltaica", domicilio.pais)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-zinc-500 font-black">{getTranslation("eficiencia_global_estimada", domicilio.pais)}</p>
              <p className="text-[11px] font-black text-emerald-400">{isThermal ? getTranslation("maxima_vacio", domicilio.pais) : isOffGrid ? getTranslation("autonoma_agm", domicilio.pais) : getTranslation("homologada_neto", domicilio.pais)}</p>
            </div>
          </div>

          {/* Payback Timeline, Useful Lifespan & Degradation Table in VistaIngenieria */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
              <TrendingUp className="h-4 w-4 text-yellow-500 shrink-0" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">
                {getTranslation("seccion_recupero_vida_util_titulo", domicilio.pais)}
              </h3>
            </div>

            {/* Baseline Consumption & Solar Coverage */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                {getTranslation("consumo_referencia_solicitante", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                  <span className="text-zinc-400 text-[9px] block font-bold">{getTranslation("consumo_diario", domicilio.pais)}</span>
                  <strong className="text-white font-mono text-xs block mt-0.5">
                    {techType === "thermal" 
                      ? `${personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/día` 
                      : `${(sizing.totalWhPerDay / 1000).toFixed(2)} kWh/día`}
                  </strong>
                  <span className="text-[8.5px] text-zinc-500 font-mono">
                    ({((sizing.totalWhPerDay * 365) / 1000).toFixed(0)} kWh/año)
                  </span>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                  <span className="text-zinc-400 text-[9px] block font-bold">{getTranslation("ahorro_energetico_estimado", domicilio.pais)}</span>
                  <strong className="text-emerald-400 font-mono text-xs block mt-0.5">
                    {sizing.solarCoverage || 100}% de Ahorro
                  </strong>
                  <span className="text-[8.5px] text-emerald-300/80 font-mono">
                    (~{((sizing.totalWhPerDay * 365 * 0.9) / 1000).toFixed(0)} kWh/año)
                  </span>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                  <span className="text-zinc-400 text-[9px] block font-bold">{getTranslation("plazo_amortizacion_retorno", domicilio.pais)}</span>
                  <strong className="text-yellow-400 font-mono text-xs block mt-0.5">
                    Estimado 3 - 5 Años
                  </strong>
                  <span className="text-[8.5px] text-zinc-500 font-mono">Horizonte de Retorno</span>
                </div>
              </div>
            </div>

            {/* Capital Payback Timeline Cards */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                {getTranslation("linea_tiempo_amortizacion_titulo", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-zinc-900/80 border border-blue-500/30 rounded-lg p-2.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
                  <span className="text-[9px] font-mono font-black text-blue-400 uppercase block mb-0.5">
                    {getTranslation("etapa_1_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[10px] text-zinc-300 leading-snug font-medium">
                    {getTranslation("etapa_1_desc", domicilio.pais)}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-yellow-500/30 rounded-lg p-2.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-500" />
                  <span className="text-[9px] font-mono font-black text-yellow-400 uppercase block mb-0.5">
                    {getTranslation("etapa_2_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[10px] text-zinc-300 leading-snug font-medium">
                    {getTranslation("etapa_2_desc", domicilio.pais)}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-lg p-2.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  <span className="text-[9px] font-mono font-black text-emerald-400 uppercase block mb-0.5">
                    {techType === "thermal" ? getTranslation("etapa_3_titulo_termica", domicilio.pais) : getTranslation("etapa_3_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[10px] text-zinc-300 leading-snug font-medium">
                    {getTranslation("etapa_3_desc", domicilio.pais)}
                  </p>
                </div>
              </div>
            </div>

            {/* Useful Lifespan Cards */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                {getTranslation("vida_util_equipos_titulo", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[10.5px]">
                <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
                  <span className="text-[8.5px] font-mono text-zinc-400 uppercase font-bold block">
                    {techType === "thermal" ? "Colector / Tanque" : "Módulos Fotovoltaicos"}
                  </span>
                  <strong className="text-emerald-400 font-mono block mt-0.5">
                    {techType === "thermal" ? getTranslation("vida_util_termotanque", domicilio.pais) : getTranslation("vida_util_paneles", domicilio.pais)}
                  </strong>
                </div>
                {techType !== "thermal" && (
                  <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <span className="text-[8.5px] font-mono text-zinc-400 uppercase font-bold block">Inversor / Unidad Central</span>
                    <strong className="text-yellow-400 font-mono block mt-0.5">
                      {getTranslation("vida_util_inversor", domicilio.pais)}
                    </strong>
                  </div>
                )}
                {techType === "off-grid" && (
                  <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <span className="text-[8.5px] font-mono text-zinc-400 uppercase font-bold block">Banco de Baterías</span>
                    <strong className="text-blue-400 font-mono block mt-0.5">
                      {sizing.batteryType && sizing.batteryType.toLowerCase().includes("lit") 
                        ? getTranslation("vida_util_baterias_litio", domicilio.pais) 
                        : getTranslation("vida_util_baterias_gel", domicilio.pais)}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Degradation Table */}
            {techType !== "thermal" && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                  {getTranslation("cuadro_degradacion_titulo", domicilio.pais)}
                </h4>
                <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/90">
                  <table className="w-full text-left text-[10.5px]">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950 text-yellow-500 font-mono text-[9.5px] uppercase font-bold">
                        <th className="py-2 px-2.5">{getTranslation("ano_col", domicilio.pais)}</th>
                        <th className="py-2 px-2.5 text-center">{getTranslation("rendimiento_col", domicilio.pais)}</th>
                        <th className="py-2 px-2.5">{getTranslation("estado_col", domicilio.pais)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 font-medium">
                      <tr>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-white">Año 1</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-emerald-400">98.0%</td>
                        <td className="py-1.5 px-2.5">{getTranslation("ano_1_estado", domicilio.pais)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-white">Año 10</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-emerald-400">92.5%</td>
                        <td className="py-1.5 px-2.5">{getTranslation("ano_10_estado", domicilio.pais)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-white">Año 20</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-yellow-400">86.0%</td>
                        <td className="py-1.5 px-2.5">{getTranslation("ano_20_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="bg-yellow-950/20">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-yellow-300">Año 30</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-yellow-400">80.0%</td>
                        <td className="py-1.5 px-2.5 font-semibold text-yellow-200">{getTranslation("ano_30_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="bg-emerald-950/30">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-emerald-300">Año 40</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-emerald-400">74.0%</td>
                        <td className="py-1.5 px-2.5 font-bold text-emerald-300">{getTranslation("ano_40_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="bg-emerald-950/20">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-emerald-300">Año 50+</td>
                        <td className="py-1.5 px-2.5 text-center font-mono font-black text-emerald-400">68.0%</td>
                        <td className="py-1.5 px-2.5 font-bold text-emerald-300">{getTranslation("ano_50_estado", domicilio.pais)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[9.5px] text-yellow-300/90 font-medium italic bg-yellow-950/20 p-2 rounded border border-yellow-500/20">
                  💡 {getTranslation("cuadro_degradacion_nota", domicilio.pais)}
                </p>
              </div>
            )}
          </div>
        </div>


                {/* Action Button 1 Stacked At the Bottom of schematic/rendering list */}
        <div className="w-full">
          <button
            onClick={onOpenReporte}
            className="w-full flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-black rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-yellow-500 hover:border-yellow-500/50 transition duration-200 cursor-pointer shadow-xs uppercase tracking-widest"
            id="btn_download_report"
          >
            <FileText className="h-4 w-4 text-yellow-500 shrink-0" />
            <span>{getTranslation("descargar_reporte_pdf", domicilio.pais)}</span>
          </button>
        </div>
      </>
    ) : (
      <div className="bg-zinc-950 rounded-xl border border-dashed border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-dashed border-yellow-500/30 animate-pulse">
          <svg className="w-6 h-6 opacity-85" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-black text-yellow-500 uppercase tracking-widest font-sans">
            {getTranslation("esquemas_pendientes_titulo", domicilio.pais)}
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-[280px] mt-2 font-bold font-sans">
            {getTranslation("esquemas_pendientes_desc", domicilio.pais)}
          </p>
        </div>
      </div>
    )}

  </div>

  {/* Button 3: Solicitar Presupuesto Profesional (Stays at the very bottom outer area) */}
  <button
    onClick={onOpenPresupuesto}
    disabled={!isDimensioned}
    className={`w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-black rounded-xl border uppercase tracking-widest transition duration-200 cursor-pointer ${
      isDimensioned
        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md border-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]"
        : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
    }`}
    id="btn_solicitar_presupuesto_profesional"
  >
    <span>{getTranslation("solicitar_presupuesto_detallado", domicilio.pais)}</span>
    <ChevronRight className="h-5 w-5 shrink-0 stroke-[3.5]" />
  </button>

    </div>
  );
}
