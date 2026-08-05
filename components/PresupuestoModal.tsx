import { useState, useEffect } from "react";
import { Domicilio, SolarSizingResult, CustomAppliance } from "../types";
import { X, Send, Sparkles, AlertCircle, Phone } from "lucide-react";
import { getCountryGridVoltage } from "../utils";
import { getTranslation, getCountryLanguage } from "../translations";

interface PresupuestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  domicilio: Domicilio;
  hsp: number;
  techType: "on-grid" | "off-grid" | "thermal";
  sizing: SolarSizingResult;
  appliances: CustomAppliance[];
  personasCount: number;
  installerPhone: string;
  onPhoneChange: (phone: string) => void;
  whiteLabelEnabled?: boolean;
  whiteLabelCompanyName?: string;
  whiteLabelWhatsApp?: string;
  whiteLabelEmail?: string;
}

export default function PresupuestoModal({
  isOpen,
  onClose,
  domicilio,
  hsp,
  techType,
  sizing,
  appliances,
  personasCount,
  installerPhone,
  onPhoneChange,
  whiteLabelEnabled = false,
  whiteLabelCompanyName = "",
  whiteLabelWhatsApp = "",
  whiteLabelEmail = ""
}: PresupuestoModalProps) {
  const gridV = getCountryGridVoltage(domicilio.pais, domicilio.provincia);
  const [nombre, setNombre] = useState("");
  const [domicilioStr, setDomicilioStr] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [pais, setPais] = useState("Argentina");
  
  const [additionalComments, setAdditionalComments] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (val: string) => {
    setPhoneError("");
    const cleanPhone = val.replace(/[^\d]/g, ""); // Keep only digits
    onPhoneChange(cleanPhone);
  };

  // Update starting values based on current inputs
  useEffect(() => {
    const fullName = `${domicilio.nombre || ""} ${domicilio.apellido || ""}`.trim();
    setNombre(fullName);
    setDomicilioStr(domicilio.domicilio || "");
    setLocalidad(domicilio.localidad || "");
    setProvincia(domicilio.provincia || "");
    setPais(domicilio.pais || "Argentina");
  }, [domicilio]);

  // Construct message text to send to WhatsApp advisor
  useEffect(() => {
    const lang = getCountryLanguage(pais);
    let techLabel = "";
    if (lang === "pt") {
      techLabel = techType === "off-grid" 
        ? "SISTEMA FOTOVOLTAICO OFF-GRID (AUTÔNOMO)" 
        : techType === "on-grid" 
          ? "SISTEMA SOLAR ON-GRID (CONECTADO À REDE)" 
          : "AQUECEDOR SOLAR DE ÁGUA (SISTEMA TÉRMICO DE ÁGUA)";
    } else if (lang === "en") {
      techLabel = techType === "off-grid" 
        ? "OFF-GRID SOLAR PHOTOVOLTAIC SYSTEM (AUTONOMOUS)" 
        : techType === "on-grid" 
          ? "ON-GRID SOLAR SYSTEM (GRID-TIED)" 
          : "SOLAR WATER HEATER (THERMAL WATER SYSTEM)";
    } else {
      techLabel = techType === "off-grid" 
        ? "SISTEMA FOTOVOLTAICO OFF-GRID (AUTÓNOMO)" 
        : techType === "on-grid" 
          ? "SISTEMA SOLAR ON-GRID (CONECTADO A RED)" 
          : "TERMOTANQUE SOLAR (SISTEMA TÉRMICO DE AGUA)";
    }
    
    let technicalDetails = "";
    if (lang === "pt") {
      if (techType === "off-grid") {
        technicalDetails = `
- Consumo Diário Estimado (Otimizado): ${sizing.totalWhPerDay} Wh/dia ${sizing.isThermostatOptimized ? `(Economia de Ciclagem: ${sizing.thermostatSavingsWh} Wh/dia de bruto ${sizing.originalWhPerDay} Wh/dia)` : ""}
- Horas de Sol Pico (HSP): ${hsp}
- Dias de Autonomia Requeridos: ${sizing.backupAutonomyDays} dias
- Módulos Solares Computados: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Configuração de Painéis: ${sizing.panelsLayout}
- Inversor Recomendado: ${sizing.inverterModel} (${sizing.inverterPowerW}W)
- Banco de Baterias: ${sizing.batteriesTotalCount} x ${sizing.batteryType.toLowerCase().includes("litio") || sizing.batteryType.toLowerCase().includes("lithium") ? "Lítio LiFePO4" : "Gel AGM"} 12V 100Ah (Equiv.) (${sizing.batterySystemVoltage}V)
- Configuração de Baterias: ${sizing.batteriesLayout}
`;
      } else if (techType === "on-grid") {
        technicalDetails = `
- Consumo Anual Computado: ${(sizing.totalWhPerDay * 365 / 1000).toLocaleString('pt-BR')} kWh/ano
- Cobertura Solar Desejada: ${sizing.solarCoverage}%
- Tipo de Rede de Injeção: Rede ${sizing.inverterModel.includes("Trifásica") || sizing.inverterModel.includes("Trifásico") ? `Trifásica (${gridV.threePhaseV})` : `Monofásica (${gridV.singlePhaseV})`}
- Horas de Sol Pico (HSP): ${hsp}
- Módulos Solares Computados: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Configuração de Painéis: ${sizing.panelsLayout}
- Inversor Selecionado: ${sizing.inverterModel}
- Redução de CO2 Estimada: ${sizing.carbonOffsetTonsCo2Year} Tn CO2/ano
- Retorno de Investimento: Conforme tarifas de energia/gás locais
`;
      } else {
        technicalDetails = `
- Habitantes da Residência: ${personasCount} pessoas (Perfil: ${sizing.thermalProfile === "intenso" ? "Intenso / Comercial" : "Normal / Familiar"}, Demanda: ${personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/dia)
- Configuração Sugerida: ${sizing.thermalExplanation} (Capacidade total: ${sizing.tankLiters} Litros)
- Quantidade Coletor Tubos: ${sizing.collectorTubesCount} tubos de vácuo de borossilicato
- Tipo de Sistema Recomendado: ${sizing.hasPressurizer ? "SISTEMA PRESSURIZADO (Boiler HEAT PIPE de alta pressão)" : "SISTEMA ATMOSFÉRICO (Gravidade convencional)"}
- Qualidade da Água de Entrada: ${sizing.waterHardness === "dura" ? "ÁGUA DURA (Filtro ablandador recomendado contra incrustações de calcário)" : "Água normal / mole"}
- Presença de Menores de Idade: ${sizing.hasMinors ? "SIM (Recomenda-se válvula misturadora termostática para segurança infantil)" : "Não"}
- Aquecedor Elétrico de Apoio: ${sizing.auxiliaryHeaterPowerW}W
`;
      }
    } else if (lang === "en") {
      if (techType === "off-grid") {
        technicalDetails = `
- Estimated Daily Consumption (Optimized): ${sizing.totalWhPerDay} Wh/day ${sizing.isThermostatOptimized ? `(Cycling Savings: ${sizing.thermostatSavingsWh} Wh/day of gross ${sizing.originalWhPerDay} Wh/day)` : ""}
- Peak Sun Hours (PSH): ${hsp}
- Required Autonomy Days: ${sizing.backupAutonomyDays} days
- Computed Solar Modules: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Panel Layout: ${sizing.panelsLayout}
- Recommended Inverter: ${sizing.inverterModel} (${sizing.inverterPowerW}W)
- Battery Bank: ${sizing.batteriesTotalCount} x ${sizing.batteryType.toLowerCase().includes("litio") || sizing.batteryType.toLowerCase().includes("lithium") ? "Lithium LiFePO4" : "Gel AGM"} 12V 100Ah (Equiv.) (${sizing.batterySystemVoltage}V)
- Battery Configuration: ${sizing.batteriesLayout}
`;
      } else if (techType === "on-grid") {
        technicalDetails = `
- Computed Annual Consumption: ${(sizing.totalWhPerDay * 365 / 1000).toLocaleString('en-US')} kWh/year
- Target Solar Coverage: ${sizing.solarCoverage}%
- Grid Connection Type: ${sizing.inverterModel.toLowerCase().includes("three-phase") || sizing.inverterModel.includes("Trifásica") ? `Three-Phase Grid (${gridV.threePhaseV})` : `Single-Phase Grid (${gridV.singlePhaseV})`}
- Peak Sun Hours (PSH): ${hsp}
- Computed Solar Modules: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Panel Layout: ${sizing.panelsLayout}
- Selected Inverter: ${sizing.inverterModel}
- Estimated CO2 Offset: ${sizing.carbonOffsetTonsCo2Year} Tons CO2/year
- Payback Period: Dependent on local utility/gas rates
`;
      } else {
        technicalDetails = `
- Household Members: ${personasCount} people (Profile: ${sizing.thermalProfile === "intenso" ? "Intense / Commercial" : "Normal / Family"}, Demand: ${personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/day)
- Suggested Configuration: ${sizing.thermalExplanation} (Total Capacity: ${sizing.tankLiters} Liters)
- Collector Vacuum Tubes Qty: ${sizing.collectorTubesCount} borosilicate evacuated tubes
- Recommended System Type: ${sizing.hasPressurizer ? "PRESSURIZED SYSTEM (High-pressure HEAT PIPE collector)" : "ATMOSPHERIC SYSTEM (Gravity feed)"}
- Inlet Water Quality: ${sizing.waterHardness === "dura" ? "HARD WATER (Water softener filter recommended to prevent mineral scaling)" : "Normal / soft water"}
- Presence of Minors: ${sizing.hasMinors ? "YES (Thermostatic mixing valve advised for child safety)" : "No"}
- Auxiliary Backup Heater: ${sizing.auxiliaryHeaterPowerW}W
`;
      }
    } else {
      if (techType === "off-grid") {
        technicalDetails = `
- Consumo Diario Estimado (Optimizado): ${sizing.totalWhPerDay} Wh/día ${sizing.isThermostatOptimized ? `(Ahorro de Ciclado: ${sizing.thermostatSavingsWh} Wh/día de bruto ${sizing.originalWhPerDay} Wh/día)` : ""}
- Horas de Sol Pico (HSP): ${hsp}
- Días Autonomía Requerido: ${sizing.backupAutonomyDays} días
- Módulos Solares Computados: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Configuración de Paneles: ${sizing.panelsLayout}
- Inversor Recomendado: ${sizing.inverterModel} (${sizing.inverterPowerW}W)
- Banco de Baterías: ${sizing.batteriesTotalCount} x ${sizing.batteryType.toLowerCase().includes("litio") || sizing.batteryType.toLowerCase().includes("lithium") ? "Litio LiFePO4" : "Gel AGM"} 12V 100Ah (Equiv.) (${sizing.batterySystemVoltage}V)
- Configuración de Baterías: ${sizing.batteriesLayout}
`;
      } else if (techType === "on-grid") {
        technicalDetails = `
- Consumo Anual Computado: ${(sizing.totalWhPerDay * 365 / 1000).toLocaleString('es-AR')} kWh/año
- Cobertura Solar Solicitada: ${sizing.solarCoverage}%
- Tipo de Red de Inyección: Red ${sizing.inverterModel.includes("Trifásica") ? `Trifásica (${gridV.threePhaseV})` : `Monofásica (${gridV.singlePhaseV})`}
- Horas de Sol Pico (HSP): ${hsp}
- Módulos Solares Computados: ${sizing.panelsCount} x ${sizing.panelPowerW}W (${sizing.totalPvPowerW}Wp)
- Configuración de Paneles: ${sizing.panelsLayout}
- Inversor Seleccionado: ${sizing.inverterModel}
- Ahorro de CO2 Estimado: ${sizing.carbonOffsetTonsCo2Year} Tn CO2/año
- Retorno de Inversión: Sujeto a tarifas locales de electricidad/gas
`;
      } else {
        technicalDetails = `
- Habitantes del Hogar: ${personasCount} personas (Perfil: ${sizing.thermalProfile === "intenso" ? "Intenso / Comercial" : "Normal / Familiar"}, Demanda: ${personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/día)
- Configuración Sugerida: ${sizing.thermalExplanation} (Capacidad total: ${sizing.tankLiters} Litros)
- Cantidad Colector Tubos: ${sizing.collectorTubesCount} tubos de vacío de borosilicato
- Tipo de Sistema Recomendado: ${sizing.hasPressurizer ? "SISTEMA PRESURIZADO (Termotanque HEAT PIPE de alta presión)" : "SISTEMA ATMOSFÉRICO (Gravedad convencional)"}
- Calidad de Agua en Entrada: ${sizing.waterHardness === "dura" ? "AGUA DURA (Se recomienda equipo ablandador contra incrustaciones de sarro)" : "Agua normal / blanda"}
- Presencia de Menores de Edad: ${sizing.hasMinors ? "SÍ (Se aconseja válvula de mezcla termostática por seguridad infantil)" : "No"}
- Calefactor Eléctrico de Respaldo: ${sizing.auxiliaryHeaterPowerW}W
`;
      }
    }

    const brandName = whiteLabelEnabled && whiteLabelCompanyName ? whiteLabelCompanyName.toUpperCase() : "REDERAR";
    let compiledMessage = "";

    if (lang === "pt") {
      compiledMessage = `*SOLICITAÇÃO DE ORÇAMENTO - ${brandName}*
Olá, entro em contato pelo configurador solar interativo. Desejo cotizar com um consultor técnico o seguinte dimensionamento profissional:

*Aviso:* Este dimensionamento inicial é baseado nas informações fornecidas pelo solicitante.

*1. DADOS DO REQUERENTE:*
• Nome: ${nombre}
• Endereço: ${domicilioStr}
• Cidade/Direção: ${localidad}
• Estado/Província: ${provincia}
• País: ${pais}

*2. ESPECIFICAÇÕES RECOMENDADAS:*
• Tecnologia: _${techLabel}_
${technicalDetails}
${additionalComments ? `*3. REQUISITOS ADICIONAIS E COMENTÁRIOS:* \n"${additionalComments}"` : ""}

Aguardo seu retorno para coordenar a viabilidade e o orçamento formal da obra. Muito obrigado!`;
    } else if (lang === "en") {
      compiledMessage = `*QUOTE REQUEST - ${brandName}*
Hello, I am contacting you from the interactive solar configurator. I would like to request a formal quote from a technical advisor for the following professional sizing:

*Notice:* This initial sizing is based on information provided by the applicant.

*1. APPLICANT DETAILS:*
• Name: ${nombre}
• Address: ${domicilioStr}
• City/Address: ${localidad}
• State/Province: ${provincia}
• Country: ${pais}

*2. RECOMMENDED SPECIFICATIONS:*
• Technology: _${techLabel}_
${technicalDetails}
${additionalComments ? `*3. ADDITIONAL REQUIREMENTS AND COMMENTS:* \n"${additionalComments}"` : ""}

I look forward to your response to coordinate feasibility and the formal project quote. Thank you very much!`;
    } else {
      compiledMessage = `*SOLICITUD DE PRESUPUESTO - ${brandName}*
Hola, me comunico desde el configurador solar interactivo. Deseo cotizar con un asesor técnico el siguiente dimensionamiento profesional:

*Aclaración:* Este dimensionamiento inicial surge de la información suministrada por el solicitante.

*1. DATOS DEL SOLICITANTE:*
• Nombre: ${nombre}
• Domicilio: ${domicilioStr}
• Localidad/Dirección: ${localidad}
• Provincia/Estado: ${provincia}
• País: ${pais}

*2. ESPECIFICACIONES RECOMENDADAS:*
• Tecnología: _${techLabel}_
${technicalDetails}
${additionalComments ? `*3. REQUERIMIENTOS ADICIONALES Y COMENTARIOS:* \n"${additionalComments}"` : ""}

Espero su respuesta para coordinar la factibilidad y cotización formal de obra. ¡Muchas gracias!`;
    }

    const encodedText = encodeURIComponent(compiledMessage);
    const activePhone = whiteLabelEnabled && whiteLabelWhatsApp ? whiteLabelWhatsApp : installerPhone;
    const cleanPhone = activePhone.replace(/[+\s\-()]/g, "").trim();
    setWhatsappLink(`https://wa.me/${cleanPhone}?text=${encodedText}`);
  }, [nombre, domicilioStr, localidad, provincia, pais, techType, sizing, hsp, personasCount, additionalComments, installerPhone, whiteLabelEnabled, whiteLabelCompanyName, whiteLabelWhatsApp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto font-sans animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-black border-2 border-yellow-500/40 shadow-2xl text-white flex flex-col my-8 bg-black opacity-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-white animate-pulse" />
            <div>
              <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider">
                {getTranslation("coordinador_presupuestos", pais)} {whiteLabelEnabled && whiteLabelCompanyName ? whiteLabelCompanyName : "REDERAR"}
              </h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{getTranslation("canal_directo_ingenieria", pais)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer font-bold text-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-black">
          
          <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed font-semibold">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <p>
              {getTranslation("presupuesto_intro_desc", pais)}
            </p>
          </div>

          {/* Configuración del Número de WhatsApp del Instalador */}
          {whiteLabelEnabled && whiteLabelWhatsApp ? (
            <div className="p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-xl space-y-2 animate-fade-in font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🔒</span>
                <label className="block text-[10px] font-black text-yellow-400 uppercase tracking-widest font-mono">
                  Contacto Técnico de Marca Blanca
                </label>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal font-semibold">
                Las consultas y solicitudes de presupuestos se enviarán directamente al contacto técnico de <strong className="text-white font-bold">{whiteLabelCompanyName || "su distribuidor"}</strong>:
              </p>
              <div className="w-full rounded-xl bg-zinc-950 border border-zinc-850 p-2.5 text-xs text-yellow-400 font-mono font-bold tracking-widest flex items-center justify-between">
                <span>WhatsApp +{whiteLabelWhatsApp}</span>
                <span className="text-[9px] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full text-yellow-500 font-black uppercase tracking-wide">Activo</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">📞</span>
                <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  {getTranslation("numero_whatsapp_receptor", pais)}
                </label>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal font-medium">
                {getTranslation("numero_whatsapp_instruccion", pais)}
              </p>
              <input
                type="text"
                value={installerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Ej: 5493434802264"
                className="w-full rounded-xl bg-zinc-950 border border-emerald-500/40 p-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition font-mono font-bold tracking-widest placeholder-zinc-700"
                id="modal_input_installer_whatsapp"
              />
              {phoneError && (
                <p className="text-[10px] text-rose-500 font-extrabold font-mono mt-0.5">
                  ⚠️ {phoneError}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
                {getTranslation("nombre_completo_solicitante", pais)}
              </label>
              <input
                type="text"
                value={nombre || ""}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-sans font-bold placeholder-zinc-650"
                id="modal_input_nombre"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
                {getTranslation("domicilio_instalacion", pais)}
              </label>
              <input
                type="text"
                value={domicilioStr || ""}
                onChange={(e) => setDomicilioStr(e.target.value)}
                placeholder="Ej: Av. Ramírez 1520"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-sans font-bold placeholder-zinc-650"
                id="modal_input_domicilio"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
                {getTranslation("localidad_ciudad", pais)}
              </label>
              <input
                type="text"
                value={localidad || ""}
                onChange={(e) => setLocalidad(e.target.value)}
                placeholder="Ej: Paraná"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-sans font-bold placeholder-zinc-650"
                id="modal_input_localidad"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
                {getTranslation("provincia_estado", pais)}
              </label>
              <input
                type="text"
                value={provincia || ""}
                onChange={(e) => setProvincia(e.target.value)}
                placeholder="Ej: Entre Ríos"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-sans font-bold placeholder-zinc-650"
                id="modal_input_provincia"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
                {getTranslation("pais_label", pais)}
              </label>
              <input
                type="text"
                value={pais || ""}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Ej: Argentina"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-sans font-bold placeholder-zinc-650"
                id="modal_input_pais"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5">
              {getTranslation("requerimientos_adicionales_label", pais)}
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder={getTranslation("requerimientos_adicionales_placeholder", pais)}
              className="w-full h-20 rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-bold"
              id="modal_input_comments"
            />
          </div>

          {/* Sizing Parameters Card */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h4 className="text-[10px] font-sans font-black uppercase text-white tracking-widest border-b border-zinc-900 pb-1.5">{getTranslation("copia_computo_sistema", pais)}</h4>
            <div className="text-xs font-mono text-zinc-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-bold">
              <p>📍 {getTranslation("emplazamiento", pais)} <span className="text-white font-sans font-bold">{localidad}, {provincia} ({pais})</span></p>
              <p>🔆 {getTranslation("solucion", pais)} <span className="text-white font-sans font-black uppercase tracking-wider">{techType === "on-grid" ? getTranslation("ongrid_inyeccion_red", pais) : techType === "off-grid" ? getTranslation("offgrid_autonomo", pais) : getTranslation("termica_agua_caliente", pais)}</span></p>
              
              {techType !== "thermal" ? (
                <>
                  <p>📈 {getTranslation("paneles_solares_presupuesto", pais)} <span className="text-white font-bold font-sans">{sizing.panelsCount} x {sizing.panelPowerW || 550}W ({sizing.totalPvPowerW}Wp)</span></p>
                  <p className="col-span-1 sm:col-span-2 text-[11px]">🔌 {getTranslation("arreglo_presupuesto", pais)} <span className="text-zinc-200 font-sans font-bold">{sizing.panelsLayout}</span></p>
                  <p>⚡ {getTranslation("inversor_presupuesto", pais)} <span className="text-white font-sans font-bold">{sizing.inverterModel}</span></p>
                  {techType === "off-grid" && (
                    <>
                      <p>🔋 {getTranslation("baterias_presupuesto", pais)} <span className="text-white font-sans font-bold">{sizing.batteriesTotalCount}x (Sist. {sizing.batterySystemVoltage}V)</span></p>
                      <p className="col-span-1 sm:col-span-2 text-[11px]">📦 {getTranslation("banco_presupuesto", pais)} <span className="text-zinc-200 font-sans font-bold">{sizing.batteriesLayout}</span></p>
                       {sizing.isThermostatOptimized && (
                        <p className="col-span-1 sm:col-span-2 text-emerald-400 font-sans font-bold text-[10.5px] bg-emerald-950/20 p-2 rounded border border-emerald-500/20 mt-1 leading-snug">
                          🌿 {whiteLabelEnabled && whiteLabelCompanyName ? `Optimizador Inteligente ${whiteLabelCompanyName}` : getTranslation("optimizador_inteligente_rederar", pais)}: -{sizing.thermostatSavingsWh} Wh/day de carga reducidos por ciclado de termostatos.
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <p>💧 {getTranslation("tanque_acumulacion", pais)} <span className="text-white font-sans font-bold">{sizing.tankLiters} L total</span></p>
                  <p>🧪 {getTranslation("tubos_vacio_presupuesto", pais)} <span className="text-white font-sans font-bold">{sizing.collectorTubesCount} Tubos Colectores</span></p>
                  <p className="col-span-1 sm:col-span-2">📦 {getTranslation("configuracion_sugerida_presupuesto", pais)} <span className="text-white font-sans font-bold">{sizing.thermalExplanation}</span></p>
                  <p className="col-span-1 sm:col-span-2">👁️ {getTranslation("tipo_sistema_presupuesto", pais)} <span className="text-white font-sans font-bold">{sizing.hasPressurizer ? (getCountryLanguage(pais) === "en" ? "Pressurized (High Pressure HEAT PIPE)" : getCountryLanguage(pais) === "pt" ? "Pressurizado (HEAT PIPE de Alta Pressão)" : "Presurizado (HEAT PIPE de Alta Presión)") : (getCountryLanguage(pais) === "en" ? "Atmospheric (Gravity)" : getCountryLanguage(pais) === "pt" ? "Atmosférico (Gravidade)" : "Atmosférico (Gravedad)")}</span></p>
                  {sizing.waterHardness === "dura" && <p className="col-span-1 sm:col-span-2">⚠️ {getTranslation("requiere_ablandador_presupuesto", pais)} <span className="text-rose-400 font-sans font-bold">{getCountryLanguage(pais) === "en" ? "Water Softener filter against scale" : getCountryLanguage(pais) === "pt" ? "Filtro Descalcificador contra calcário" : "Filtro Ablandador contra sarro"}</span></p>}
                  {sizing.hasMinors && <p className="col-span-1 sm:col-span-2">🛡️ {getTranslation("seguridad_valvula_presupuesto", pais)} <span className="text-rose-400 font-sans font-bold">{getCountryLanguage(pais) === "en" ? "Thermostatic Mixing Valve" : getCountryLanguage(pais) === "pt" ? "Válvula Misturadora Termostática" : "Válvula Mezcladora Termostática"}</span></p>}
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-[10px] text-amber-200 leading-relaxed font-sans font-medium shadow-[0_0_15px_rgba(245,158,11,0.05)] animate-fade-in">
            <strong className="text-amber-400 font-black block uppercase tracking-wider mb-0.5">⚠️ {getTranslation("aviso_sizing_inicial", pais)}:</strong>
            {getTranslation("desc_aviso_sizing", pais)}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <AlertCircle className="h-3.5 w-3.5 text-white shrink-0" />
            <span>{getTranslation("presione_envio_whatsapp_nota", pais)}</span>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-black rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-black rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white transition cursor-pointer uppercase tracking-wider"
          >
            {getTranslation("cancelar_btn", pais)}
          </button>
          
          <button
            onClick={(e) => {
              const activePhone = whiteLabelEnabled && whiteLabelWhatsApp ? whiteLabelWhatsApp : installerPhone;
              const cleanPhone = activePhone.replace(/[+\s\-()]/g, "").trim();
              if (!cleanPhone) {
                setPhoneError(getTranslation("numero_whatsapp_requerido", pais));
                const element = document.getElementById("modal_input_installer_whatsapp");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  element.focus();
                }
                return;
              }
              if (cleanPhone.length < 9) {
                setPhoneError(getTranslation("numero_whatsapp_invalido", pais));
                const element = document.getElementById("modal_input_installer_whatsapp");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  element.focus();
                }
                return;
              }
              
              window.open(whatsappLink, "_blank");
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl bg-white hover:bg-zinc-100 text-black shadow-md transition transform active:scale-[0.98] cursor-pointer uppercase tracking-wider font-sans"
            id="btn_modal_enviar_whatsapp"
          >
            <Send className="h-3.5 w-3.5 text-black stroke-[3.5]" />
            <span>{getTranslation("enviar_consulta_whatsapp_btn", pais)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
