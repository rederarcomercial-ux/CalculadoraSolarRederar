import { useState } from "react";
import { Domicilio, SolarSizingResult, CustomAppliance } from "../types";
import { Printer, X, Download, ShieldCheck, Sun, Info, Loader2, TrendingUp, Zap, Clock, BarChart3, CheckCircle2 } from "lucide-react";
import RederarLogo from "./RederarLogo";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getCountryGridVoltage } from "../utils";
import { getTranslation, getCountryLanguage } from "../translations";

interface ReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  domicilio: Domicilio;
  hsp: number;
  techType: "on-grid" | "off-grid" | "thermal";
  sizing: SolarSizingResult;
  appliances: CustomAppliance[];
  personasCount: number;
  installerPhone: string;
  gridPhaseType?: "monofasica" | "trifasica";
  whiteLabelEnabled?: boolean;
  whiteLabelCompanyName?: string;
  whiteLabelWhatsApp?: string;
  whiteLabelEmail?: string;
  whiteLabelLogo?: string;
}

export default function ReporteModal({
  isOpen,
  onClose,
  domicilio,
  hsp,
  techType,
  sizing,
  appliances,
  personasCount,
  installerPhone,
  gridPhaseType = "monofasica",
  whiteLabelEnabled = false,
  whiteLabelCompanyName = "",
  whiteLabelWhatsApp = "",
  whiteLabelEmail = "",
  whiteLabelLogo = ""
}: ReporteModalProps) {
  if (!isOpen) return null;

  const lang = getCountryLanguage(domicilio.pais);
  const isEn = lang === "en";
  const isPt = lang === "pt";
  const isEs = lang === "es";
  const isFr = lang === "fr";

  const gridV = getCountryGridVoltage(domicilio.pais, domicilio.provincia);
  const isOffGrid = techType === "off-grid";
  const isThermal = techType === "thermal";
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Determinar la orientación según el hemisferio del país seleccionado
  const countryLower = (domicilio.pais || "").toLowerCase();
  const isNorthernHemisphere = countryLower.includes("españa") || countryLower.includes("estados unidos") || countryLower.includes("usa") || countryLower.includes("méxico") || countryLower.includes("mexico") || countryLower.includes("colombia");
  const orientationText = isNorthernHemisphere 
    ? (isEn ? "South" : isPt ? "Sul" : isFr ? "Sud" : "Sur") 
    : (isEn ? "North" : isPt ? "Norte" : isFr ? "Nord" : "Norte");

  const handlePrint = () => {
    const element = document.getElementById("print-section");
    if (!element) return;

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print(); // Fallback
      return;
    }

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Reporte de Ingeniería Solar - REDERAR</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm !important;
            }
            @media print, screen {
              html, body {
                background-color: #000000 !important;
                color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
              }
              /* Absolute safety bypass for visibility rules copied from parent */
              body, body *, #print-section, #print-section * {
                visibility: visible !important;
                opacity: 1 !important;
              }
              .printable-area {
                background-color: #000000 !important;
                color: #ffffff !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
            }
          </style>
        </head>
        <body class="bg-black text-white">
          <div id="print-section" class="p-6 md:p-8 bg-black text-white printable-area">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);
    
    // Copy all style sheets and style elements from parent document to ensure tailwind works
    Array.from(document.querySelectorAll("style, link[rel='stylesheet']")).forEach((node) => {
      doc.head.appendChild(node.cloneNode(true));
    });

    doc.close();

    // Give it a moment to load and render the styles, then print
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1500);
    }, 1200);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("print-section");
    if (!element) return;

    setIsGeneratingPdf(true);
    
    // Save original styles to restore them perfectly afterward
    const originalStyle = element.getAttribute("style") || "";
    const originalHeight = element.style.height;
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;
    const originalScrollTop = element.scrollTop;

    try {
      const noPrintElements = element.querySelectorAll(".no-print");
      noPrintElements.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });

      // Reset scroll position to top to avoid shifted or cut off captures
      element.scrollTop = 0;

      // Temporarily expand the element to full content size with visible overflow
      element.style.height = "auto";
      element.style.maxHeight = "none";
      element.style.overflow = "visible";

      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp, professional-looking print text
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#000000",
        scrollY: 0,
        scrollX: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("print-section");
          if (clonedElement) {
            clonedElement.style.letterSpacing = "normal";
            clonedElement.style.wordSpacing = "normal";
            const allEls = clonedElement.querySelectorAll("*");
            allEls.forEach((node) => {
              const htmlEl = node as HTMLElement;
              if (htmlEl.style) {
                htmlEl.style.letterSpacing = "normal";
                htmlEl.style.wordSpacing = "normal";
              }
            });
          }
        }
      });

      noPrintElements.forEach((el) => {
        (el as HTMLElement).style.display = "";
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Render first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      // Render subsequent pages dynamically based on full content height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`Reporte_Sizing_${whiteLabelEnabled && whiteLabelCompanyName ? whiteLabelCompanyName.replace(/\s+/g, "_") : "Rederar"}_${domicilio.apellido || "Cliente"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Safely restore original styles
      element.setAttribute("style", originalStyle);
      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;
      element.scrollTop = originalScrollTop;
      setIsGeneratingPdf(false);
    }
  };

  const locale = isEn
    ? "en-US"
    : isPt
    ? "pt-BR"
    : isFr
    ? "fr-FR"
    : "es-AR";

  const formattedDate = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Calculate required surface area for panels
  // 550W panel is roughly 2.2m x 1.1m ≈ 2.42 m²
  const surfaceAreaSqm = techType !== "thermal" 
    ? (sizing.panelsCount * 2.42).toFixed(1)
    : "3.2";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-black border-2 border-yellow-500 shadow-2xl text-white flex flex-col max-h-[90vh] bg-black opacity-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/30 bg-black rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-sans tracking-tight">
              {getTranslation("reporte_ingenieria_solar", domicilio.pais)} - <span className="text-amber-400">{whiteLabelEnabled && whiteLabelCompanyName ? whiteLabelCompanyName : "REDERAR"}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 rounded-lg bg-slate-800 border border-amber-500/20 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer font-bold"
            id="btn_close_reporte"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Printable Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans printable-area bg-black text-white" id="print-section">
          
          <style>{`
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            #print-section, #print-section * {
              letter-spacing: normal !important;
              word-spacing: normal !important;
              font-feature-settings: normal !important;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: #000000 !important;
                color: #ffffff !important;
              }
              body * {
                visibility: hidden;
              }
              #print-section, #print-section * {
                visibility: visible;
                letter-spacing: normal !important;
                word-spacing: normal !important;
              }
              #print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                color: #ffffff !important;
                background: #000000 !important;
              }
              .no-print {
                display: none !important;
              }
              .text-slate-100, .text-slate-300, .text-slate-400 {
                color: #f1f5f9 !important;
              }
              .bg-slate-900, .bg-slate-950, .bg-slate-800 {
                background: #000000 !important;
                border-color: #f59e0b !important;
              }
            }
          `}</style>

          {/* Letterhead */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-dashed border-amber-500/30 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-[154px] h-[112px] md:w-[198px] md:h-[144px] flex items-center justify-center bg-black p-2 rounded-lg border border-zinc-800">
                {whiteLabelEnabled && whiteLabelLogo ? (
                  <img src={whiteLabelLogo} alt="Logo Corporativo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <RederarLogo className="w-full h-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-extrabold text-2xl font-sans tracking-tight uppercase">
                    {whiteLabelEnabled && whiteLabelCompanyName ? whiteLabelCompanyName : "REDERAR"}
                  </span>
                  <span className="text-amber-400 text-xs py-1 px-2 rounded bg-black border border-amber-500/30 font-mono no-print font-bold">
                    {whiteLabelEnabled ? "Premium WL" : "Sizing v5.2"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 max-w-sm font-sans font-semibold">
                  {whiteLabelEnabled 
                    ? (isEn
                        ? `Custom Solar Engineering Report generated by ${whiteLabelCompanyName || "your trusted installer"}.`
                        : isPt
                        ? `Relatório de Engenharia Solar personalizado gerado por ${whiteLabelCompanyName || "seu instalador de confiança"}.`
                        : isFr
                        ? `Rapport d'Ingénierie Solaire personnalisé généré par ${whiteLabelCompanyName || "votre installateur de confiance"}.`
                        : `Reporte de Ingeniería Solar personalizado generado por ${whiteLabelCompanyName || "su instalador de confianza"}.`)
                    : (isEn
                        ? "Argentine Renewable Energy Network. Solar PV and thermal generation solutions nationwide."
                        : isPt
                        ? "Rede Argentina de Energias Renováveis. Soluções de geração solar fotovoltaica e térmica em todo o país."
                        : isFr
                        ? "Réseau Énergies Renouvelables. Solutions de production photovoltaïque et thermique solaire dans tout le pays."
                        : "Red Argentina de Energías Renovables. Soluciones de generación fotovoltaica y térmica solar en todo el país.")}
                </p>
                {whiteLabelEnabled && (whiteLabelEmail || whiteLabelWhatsApp) && (
                  <div className="text-[10px] text-zinc-400 mt-1.5 font-mono space-y-0.5">
                    {whiteLabelEmail && <p>📧 Email: {whiteLabelEmail}</p>}
                    {whiteLabelWhatsApp && <p>💬 WhatsApp: +{whiteLabelWhatsApp}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right font-mono text-xs text-slate-400 font-bold">
              <p>{getTranslation("fecha_emision", domicilio.pais)} {formattedDate}</p>
              <p>{getTranslation("validez_calculo_30_dias", domicilio.pais)}</p>
              <p>{getTranslation("id_consulta", domicilio.pais)} {whiteLabelEnabled ? "WL" : "RED"}-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Client & Location info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-5 rounded-xl border border-amber-500/30 mb-6 text-slate-100">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2">{getTranslation("datos_solicitante", domicilio.pais)}</h3>
              <p className="text-base font-bold text-white">
                {`${domicilio.nombre || ""} ${domicilio.apellido || ""}`.trim()}
              </p>
              <p className="text-sm text-slate-300 mt-1 font-semibold">{domicilio.domicilio}</p>
              <p className="text-sm text-slate-300 font-semibold">{domicilio.localidad}, {domicilio.provincia} ({domicilio.pais || "Argentina"})</p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2">{getTranslation("parametros_geoclimaticos", domicilio.pais)}</h3>
              <div className="space-y-1 text-sm text-slate-300 font-semibold">
                <p className="flex justify-between">
                  <span>{getTranslation("hsp_promedio_anual", domicilio.pais)}</span> 
                  <span className="font-bold text-white">{hsp} kWh/m²/día</span>
                </p>
                <p className="flex justify-between">
                  <span>{getTranslation("hsp_invierno_seguro", domicilio.pais)}</span> 
                  <span className="font-bold text-emerald-400">{(hsp * 0.65).toFixed(2)} kWh/m²/día</span>
                </p>
                <p className="flex justify-between">
                  <span>{getTranslation("criterio_diseno", domicilio.pais)}</span> 
                  <span className="font-bold text-amber-400">{getTranslation("solsticio_invierno_predefinido", domicilio.pais)}</span>
                </p>
                <p className="flex justify-between">
                  <span>{getTranslation("area_instalacion_minima", domicilio.pais)}</span> 
                  <span className="font-bold text-white">{surfaceAreaSqm} m²</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sizing & Winter Criterion Disclaimer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-950/30 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed font-sans font-medium">
                <strong className="text-amber-400 font-black uppercase tracking-wider block mb-1">{getTranslation("aviso_sizing_inicial", domicilio.pais)}</strong>
                {getTranslation("desc_aviso_sizing", domicilio.pais)}
              </p>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-500/25 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200 leading-relaxed font-sans font-medium">
                <strong className="text-emerald-400 font-black uppercase tracking-wider block mb-1">{getTranslation("criterio_invierno_predefinido_titulo", domicilio.pais)}</strong>
                {getTranslation("criterio_invierno_desc", domicilio.pais)}
              </p>
            </div>
          </div>

          {/* Technical Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              {getTranslation("especificacion_ingenieria_recomendada", domicilio.pais)} {
                techType === "off-grid" 
                  ? getTranslation("offgrid_autonomo", domicilio.pais) 
                  : techType === "on-grid" 
                  ? getTranslation("ongrid_inyeccion_red", domicilio.pais) 
                  : getTranslation("termica_agua_caliente", domicilio.pais)
              }
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/20">
                <p className="text-xs text-slate-400 font-mono font-bold">{getTranslation("energia_diaria_upper", domicilio.pais)}</p>
                <p className="text-xl font-bold text-white mt-1 font-mono">
                  {techType === "thermal" 
                    ? `${sizing.tankLiters} ${isEn ? "Liters" : isFr ? "Litres" : "Litros"}` 
                    : `${(sizing.totalWhPerDay / 1000).toFixed(2)} kWh`}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">{getTranslation("consumo_diseno", domicilio.pais)}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/20">
                <p className="text-xs text-slate-400 font-mono font-bold">{getTranslation("modulos_fv_colector", domicilio.pais)}</p>
                <p className="text-xl font-bold text-blue-400 mt-1 font-mono">
                  {techType === "thermal" 
                    ? `${sizing.collectorTubesCount} ${isEn ? "Tubes" : isFr ? "Tubes" : "Tubos"}` 
                    : `${sizing.panelsCount} x 550W`}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                  {techType === "thermal" 
                    ? getTranslation("vacio_atmosferico", domicilio.pais) 
                    : `${(sizing.totalPvPowerW / 1000).toFixed(2)} kWp ${isEn ? "Generation" : isPt ? "Geração" : isFr ? "Génération" : "Generación"}`}
                </p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/20">
                <p className="text-xs text-slate-400 font-mono font-bold">{getTranslation("equipo_central_upper", domicilio.pais)}</p>
                <p className="text-xl font-bold text-white mt-1 font-mono">
                  {techType === "thermal" 
                    ? `${isEn ? "Reserve" : isFr ? "Réserve" : "Reserva"} ${sizing.tankLiters}L` 
                    : `${(sizing.inverterPowerW / 1000).toFixed(1)} kW`}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 truncate font-bold">{sizing.inverterModel}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/20">
                <p className="text-xs text-slate-400 font-mono font-bold">{getTranslation("almacenamiento_aux_upper", domicilio.pais)}</p>
                <p className="text-xl font-bold text-amber-400 mt-1 font-mono">
                  {techType === "off-grid" 
                    ? `${sizing.batteriesTotalCount} Bat. (${sizing.batterySystemVoltage}V)`
                    : techType === "on-grid" 
                    ? (isEn ? "Public Grid" : isPt ? "Rede Pública" : isFr ? "Réseau Public" : "Red Pública")
                    : `${sizing.auxiliaryHeaterPowerW}W Elec.`
                  }
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                  {techType === "off-grid" 
                    ? `${sizing.batteriesInSeries}S / ${sizing.batteriesInParallel}P AGM` 
                    : (isEn 
                        ? "No storage" 
                        : isPt 
                        ? "Sem acumulação" 
                        : isFr
                        ? "Sans accumulation"
                        : "Sin acumulación")}
                </p>
              </div>
            </div>
          </div>

          {/* Composición y Alcance del Suministro */}
          <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/20 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-bold">{getTranslation("composicion_equipamiento_sistema", domicilio.pais)}</h4>
            <div className="grid grid-cols-1 gap-4 text-xs font-sans">
              {techType === "on-grid" && (
                <div className="p-4 rounded-lg bg-slate-950 border border-amber-500/30 shadow-sm">
                  <p className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {getTranslation("ongrid_inyeccion_red", domicilio.pais).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">
                    {isEn
                      ? "Direct injection or self-consumption system without batteries."
                      : isPt
                      ? "Sistema de injeção ou autoconsumo direto sem baterias."
                      : isFr
                      ? "Système d'injection directe ou d'autoconsommation sans batteries."
                      : "Sistema de inyección o autoconsumo directo sin baterías."}
                  </p>
                  <div className="mt-3 space-y-1.5 font-mono text-slate-200 border-t border-amber-500/15 pt-2.5">
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("paneles_solares", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.panelsCount} x {sizing.panelPowerW || 550}W ({sizing.totalPvPowerW}Wp)
                      </span>
                    </p>
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("inversor", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.inverterModel}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {techType === "off-grid" && (
                <div className="p-4 rounded-lg bg-slate-950 border border-amber-500/30 shadow-sm">
                  <p className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {getTranslation("offgrid_autonomo", domicilio.pais).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">
                    {isEn
                      ? "Autonomous generation, control, and storage."
                      : isPt
                      ? "Geração, controle e armazenamento autônomo."
                      : isFr
                      ? "Production, contrôle et stockage autonomes."
                      : "Generación, control y almacenamiento autónomo."}
                  </p>
                  <div className="mt-3 space-y-1.5 font-mono text-slate-200 border-t border-amber-500/15 pt-2.5">
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("paneles_solares", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.panelsCount} x {sizing.panelPowerW || 550}W ({sizing.totalPvPowerW}Wp)
                      </span>
                    </p>
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("inversor", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.inverterModel}
                      </span>
                    </p>
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("banco_baterias", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.batteriesTotalCount} x {sizing.batteryType?.toLowerCase().includes("litio") || sizing.batteryType?.toLowerCase().includes("lithium") ? "Litio LiFePO4" : "Gel AGM"} 12V 100Ah (Sist. {sizing.batterySystemVoltage}V - {sizing.batteriesLayout})
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {techType === "thermal" && (
                <div className="p-4 rounded-lg bg-slate-950 border border-amber-500/30 shadow-sm">
                  <p className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    {getTranslation("termica_agua_caliente", domicilio.pais).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">
                    {isEn
                      ? "Direct thermosyphon heating of domestic hot water."
                      : isPt
                      ? "Aquecimento direto termossifônico de água sanitária."
                      : isFr
                      ? "Chauffage thermosiphon direct de l'eau chaude sanitaire."
                      : "Calentamiento directo termosifónico de agua sanitaria."}
                  </p>
                  <div className="mt-3 space-y-1.5 font-mono text-slate-200 border-t border-amber-500/15 pt-2.5">
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("colector_termico", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {sizing.tankLiters} L / {sizing.collectorTubesCount} {isEn ? "tubes" : isFr ? "tubes" : "tubos"} ({sizing.waterHardness === "dura" ? (isEn ? "Stainless Steel Heat Pipe" : isPt ? "Inox Heat Pipe" : isFr ? "Heat Pipe Inox (Eau Dure)" : "Inox Heat Pipe para agua dura") : (isEn ? "Atmospheric Glass Tubes" : isPt ? "Tubos de Vácuo Atmosférico" : isFr ? "Tubes sous Vide Atmosphériques" : "Tubos de Vacío Atmosféricos")})
                      </span>
                    </p>
                    <p className="text-blue-300 font-extrabold flex flex-wrap items-baseline gap-1.5">
                      <span>• {getTranslation("accesorios", domicilio.pais)}</span>
                      <span className="text-white font-sans font-black">
                        {isEn ? "Thermostatic mixing valve + Magnesium anode + Auxiliary heater" : isPt ? "Válvula misturadora termostática + Ânodo de magnésio + Resistência elétrica" : isFr ? "Mitigeur thermostatique + Anode en magnésium + Résistance" : "Válvula mezcladora termostática + Ánodo de Magnesio + Resistencia"} {sizing.auxiliaryHeaterPowerW}W
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Sizing Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/20">
              <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 mb-3 font-bold">{getTranslation("detalle_cargas_suministradas", domicilio.pais)}</h4>
              {techType === "thermal" ? (
                <div className="space-y-2 text-sm text-slate-200 font-medium">
                  <p className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{getTranslation("ocupantes_habituales", domicilio.pais)}:</span>
                    <span className="text-white font-bold font-mono">{personasCount} {isEn ? "People" : isPt ? "Pessoas" : isFr ? "Personnes" : "Personas"}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{getTranslation("perfil_consumo_agua_caliente", domicilio.pais)}:</span>
                    <span className="text-white font-bold font-mono">
                      {sizing.thermalProfile === "intenso" 
                        ? getTranslation("perfil_intenso_view", domicilio.pais) 
                        : getTranslation("perfil_normal_view", domicilio.pais)}
                    </span>
                  </p>
                  <p className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{isEn ? "Est. Hot Water Consumption:" : isPt ? "Consumo Est. Água Quente:" : isFr ? "Consommation Est. Eau Chaude:" : "Consumo Est. Agua Caliente:"}</span>
                    <span className="text-white font-bold font-mono">{personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/{isEn ? "day" : isFr ? "jour" : "dia"}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-800 pb-1 gap-4">
                    <span>{isEn ? "Suggested Configuration:" : isFr ? "Configuration Suggérée:" : "Configuración Sugerida:"}</span>
                    <span className="text-blue-300 font-extrabold font-mono text-xs text-right max-w-[200px]">{sizing.thermalExplanation}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{getTranslation("bomba_presurizadora_view", domicilio.pais)}:</span>
                    <span className={`font-mono text-xs font-bold ${sizing.hasPressurizer ? "text-blue-300" : "text-blue-400"}`}>
                      {sizing.hasPressurizer 
                        ? getTranslation("bomba_equipada", domicilio.pais) 
                        : getTranslation("bomba_gravedad", domicilio.pais)}
                    </span>
                  </p>
                  {sizing.waterHardness === "dura" && (
                    <p className="flex justify-between border-b border-yellow-900/40 pb-1 text-xs text-amber-400 font-bold">
                      <span>{getTranslation("filtro_ablandador_sarro_req", domicilio.pais).split(":")[0]}:</span>
                      <span>{getTranslation("si", domicilio.pais)} ({isEn ? "Anti-scale filter" : isPt ? "Filtro anti-calcário" : isFr ? "Filtre anti-calcaire" : "Filtro anti-sarro"})</span>
                    </p>
                  )}
                  {sizing.hasMinors && (
                    <p className="flex justify-between border-b border-rose-950/40 pb-1 text-xs text-rose-400 font-bold">
                      <span>{getTranslation("valvula_termostatica_mezcla_req", domicilio.pais).split(":")[0]}:</span>
                      <span>{getTranslation("si", domicilio.pais)} ({isEn ? "Child safety" : isPt ? "Segurança crianças" : isFr ? "Sécurité enfants" : "Seguridad niños"})</span>
                    </p>
                  )}
                  <p className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{isEn ? "Saved Gas/Elec Contribution:" : isPt ? "Contribuição de Gás/Elec Economizada:" : isFr ? "Contribution Gaz/Élec Économisée:" : "Aporte de Gas/Elec Ahorrado:"}</span>
                    <span className="text-blue-300 font-bold font-mono">~75% {isEn ? "Annual" : isFr ? "Annuel" : "Anual"}</span>
                  </p>
                </div>
              ) : techType === "on-grid" ? (
                <div className="space-y-3 text-xs text-slate-200 font-bold">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <p className="flex justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-slate-400">{isEn ? "Supplied Annual Consumption:" : isPt ? "Consumo Anual Suministrado:" : isFr ? "Consommation Annuelle Fournie:" : "Consumo Anual Suministrado:"}</span>
                      <span className="text-blue-300 font-bold font-mono">{(sizing.totalWhPerDay * 365 / 1000).toLocaleString('es-AR')} kWh/{isEn ? "yr" : isFr ? "an" : "año"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-slate-400">{getTranslation("cobertura_solar_solicitada", domicilio.pais)}:</span>
                      <span className="text-amber-400 font-extrabold font-mono">{sizing.solarCoverage}%</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-slate-400">{isEn ? "Distributed Grid Type:" : isFr ? "Type de Réseau Distribué:" : "Tipo de Red Distribuida:"}</span>
                      <span className="text-white font-bold font-mono capitalize">{sizing.inverterModel.includes("Trifásica") ? getTranslation("trifasica_v", domicilio.pais).replace("{v}", gridV.threePhaseV) : getTranslation("monofasica_v", domicilio.pais).replace("{v}", gridV.singlePhaseV)}</span>
                    </p>
                    <p className="flex justify-between pb-0.5">
                      <span className="text-slate-400">{isEn ? "Phase Synchronization:" : isFr ? "Synchronisation de Phase:" : "Sincronización de Fase:"}</span>
                      <span className="text-blue-300 font-mono">{isEn ? "Direct Injection (Grid-Tie)" : isFr ? "Injection Directe (Grid-Tie)" : "Inyección Directa (Grid-Tie)"}</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal bg-blue-950/20 p-2 rounded-lg border border-blue-900/30">
                    {isEn
                      ? "ℹ️ On-Grid systems inject excess generated power into the public grid under Distributed Generation laws, reducing the final bill."
                      : isPt
                      ? "ℹ️ Os sistemas On-Grid injetam o excedente gerado na rede pública sob as leis de Geração Distribuída, reduzindo a fatura final."
                      : isFr
                      ? "ℹ️ Les systèmes On-Grid injectent le surplus produit dans le réseau public, réduisant ainsi la facture finale."
                      : "ℹ️ Los sistemas On-Grid inyectan el excedente generado a la red pública bajo la ley de Generación Distribuida, reduciendo la factura final."}
                  </p>
                </div>
              ) : (
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono font-bold pb-1">
                        <th className="py-1">{getTranslation("dispositivo", domicilio.pais)}</th>
                        <th className="text-center py-1">{getTranslation("cant_col", domicilio.pais)}</th>
                        <th className="text-right py-1">{getTranslation("consumo_diario", domicilio.pais)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-200 font-mono font-bold animate-fade-in">
                      {appliances.map((app) => (
                        <tr key={app.id}>
                          <td className="py-1.5 truncate max-w-[140px]">{app.name}</td>
                          <td className="text-center py-1.5">{app.cantidad}</td>
                          <td className="text-right py-1.5 text-blue-300">{app.consumptionWh} Wh</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 mb-3 font-bold">
                  {isEn 
                    ? "Feasibility & Payback" 
                    : isPt 
                    ? "Viabilidade & Amortização" 
                    : isFr
                    ? "Faisabilité & Amortissement"
                    : "Viabilidad y Retorno"}
                </h4>
                
                {(() => {
                  let infoText = "";
                  let detailText = "";
                  
                  if (isEn) {
                    infoText = "The actual payback period of your investment depends directly on current local electricity and gas utility rates (bottled or grid gas, as applicable) in your specific province, city, and utility distributor, alongside fixed charges, taxes, and solar incentives.";
                    if (techType === "on-grid") {
                      detailText = "On-Grid solar integration directly replaces utility electricity purchases during solar hours. Under local Distributed Generation laws, any clean surplus generated is exported back to the grid, converting your roof into a source of billing credits.";
                    } else if (techType === "off-grid") {
                      detailText = "Off-Grid standalone systems deliver 100% energy independence. They eliminate variable power bills, safeguard against utility rate hikes, and bypass the extremely high cost of physical grid expansion or local blackouts.";
                    } else {
                      detailText = "Solar Thermal systems replace expensive gas (bottled or mains) or direct electric heating. Because hot water represents one of the highest energy loads in any home, water preheating delivers massive immediate energy offsets.";
                    }
                  } else if (isPt) {
                    infoText = "O período exato de retorno do investimento depende diretamente das tarifas e custos de eletricidade e gás (engarrafado ou encanado, conforme aplicável) vigentes em seu estado, município e distribuidora de energia, além de encargos fixos, impostos locais e incentivos solares.";
                    if (techType === "on-grid") {
                      detailText = "A integração solar On-Grid substitui diretamente as compras de eletricidade da concessionária durante o dia. Sob as leis de Geração Distribuída, qualquer excedente gerado é injetado na rede, acumulando créditos em sua fatura.";
                    } else if (techType === "off-grid") {
                      detailText = "Os sistemas autônomos Off-Grid proporcionam 100% de independência energética. Eliminam faturas variáveis de energia, protegem contra reajustes tarifários e evitam os altos custos de extensão de rede ou quedas de energia.";
                    } else {
                      detailText = "Os sistemas solares térmicos substituem o uso de gás caro (de botijão ou encanado) ou aquecedores elétricos diretos. O aquecimento de água representa um dos maiores consumos de energia de qualquer lar.";
                    }
                  } else if (isFr) {
                    infoText = "La période exacte d'amortissement de votre investissement dépend directement des tarifs locaux d'électricité et de gaz (en bouteille ou de réseau) en vigueur dans votre région, ainsi que des taxes et incitations solaires.";
                    if (techType === "on-grid") {
                      detailText = "L'intégration solaire On-Grid remplace directement les achats d'électricité. Tout surplus propre produit est réinjecté dans le réseau pour générer des crédits de facturation.";
                    } else if (techType === "off-grid") {
                      detailText = "Les systèmes autonomes Off-Grid offrent une indépendance énergétique à 100%. Ils éliminent la facture variable et protègent contre les pannes et hausses de tarifs.";
                    } else {
                      detailText = "Les systèmes solaires thermiques remplacent le gaz ou l'électricité coûteux pour l'eau chaude, représentant l'une des plus fortes consommations du foyer.";
                    }
                  } else {
                    infoText = "El período de amortización real de su inversión dependerá de manera directa de los costos y tarifas vigentes en su zona geográfica, tanto para el suministro eléctrico como de gas envasado o de red (según corresponda). Asimismo, influyen los cargos fijos de su distribuidora local, impuestos y posibles incentivos a las energías renovables.";
                    if (techType === "on-grid") {
                      detailText = "La inyección solar On-Grid desplaza de manera directa la compra de energía eléctrica convencional a la distribuidora. Adicionalmente, bajo los esquemas de Generación Distribuída, los remanentes inyectados a la red se computan como créditos a su favor.";
                    } else if (techType === "off-grid") {
                      detailText = "Los sistemas aislados Off-Grid eliminan el 100% del consumo variable de la factura eléctrica tradicional. Al contar con almacenamiento autónomo en baterías, lo protegen de manera absoluta de aumentos tarifarios y de costosos cortes de suministro.";
                    } else {
                      detailText = "El termotanque solar sustituye de forma directa y con máxima eficiencia termodinámica el uso de gas envasado, de red o electricidad para calentar agua sanitaria (ACS), el cual representa uno de los consumos más elevados de cualquier vivienda.";
                    }
                  }

                  return (
                    <div className="flex flex-col gap-3.5">
                      {/* Professional Context Box */}
                      <div className="bg-slate-950/45 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 animate-fade-in text-slate-300">
                        <span className="text-[9.5px] font-mono font-black text-amber-500 uppercase tracking-wider block">
                          💡 {isEn ? "ROI LOCAL VARIABLES" : isPt ? "VARIÁVEIS DE RETORNO LOCAL" : isFr ? "VARIABLES DE RENTABILITÉ LOCALE" : "VARIABLES DE RETORNO LOCAL"}
                        </span>
                        <p className="text-[10.5px] leading-relaxed font-medium">
                          {infoText}
                        </p>
                      </div>

                      {/* Technical Detail paragraph */}
                      <div className="bg-slate-950/20 border border-slate-850 rounded-lg p-3 text-[10.5px] text-slate-300 leading-relaxed font-sans">
                        <strong className="text-blue-300 block mb-1">
                          🛠️ {isEn ? "How this system saves money:" : isPt ? "Como este sistema gera economia:" : isFr ? "Comment ce système génère des économies :" : "Cómo genera ahorro este sistema:"}
                        </strong>
                        {detailText}
                      </div>

                      {/* Environmental CO2 Reduction Metric */}
                      <div className="flex justify-between items-center py-2 px-3 bg-blue-950/20 border border-blue-950/40 rounded-lg text-xs font-semibold">
                        <span className="text-slate-300">
                          {isEn ? "Annual CO₂ Reduction:" : isPt ? "Redução Anual de CO₂:" : isFr ? "Réduction Annuelle de CO₂ :" : "Reducción de CO₂ Anual:"}
                        </span>
                        <span className="text-blue-300 font-bold font-mono text-xs">
                          {sizing.carbonOffsetTonsCo2Year || "1.82"} {getTranslation("toneladas", domicilio.pais)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* SECTION: Payback Timeline, Lifespan & Panel Degradation Table */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 mb-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="h-5 w-5 text-amber-400 shrink-0" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {getTranslation("seccion_recupero_vida_util_titulo", domicilio.pais)}
              </h3>
            </div>

            {/* 1. Baseline Consumption & Energy Savings Summary */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                {getTranslation("consumo_referencia_solicitante", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 font-sans">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">{getTranslation("consumo_diario", domicilio.pais)}</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">
                    {techType === "thermal" 
                      ? `${personasCount * (sizing.thermalProfile === "intenso" ? 80 : 50)} L/día` 
                      : `${(sizing.totalWhPerDay / 1000).toFixed(2)} kWh/día`}
                  </strong>
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    ({((sizing.totalWhPerDay * 365) / 1000).toFixed(0)} kWh/año {isEn ? "baseline" : "base"})
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">{getTranslation("ahorro_energetico_estimado", domicilio.pais)}</span>
                  <strong className="text-emerald-400 text-sm font-mono block mt-0.5">
                    {sizing.solarCoverage || 100}% {isEn ? "Solar Coverage" : "de Ahorro"}
                  </strong>
                  <span className="text-[9.5px] text-emerald-300 font-mono">
                    (~{((sizing.totalWhPerDay * 365 * 0.9) / 1000).toFixed(0)} kWh/año {isEn ? "generated" : "autogenerados"})
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-semibold">{getTranslation("plazo_amortizacion_retorno", domicilio.pais)}</span>
                  <strong className="text-amber-400 text-sm font-mono block mt-0.5">
                    {isEn ? "Estimated 3 - 5 Years" : isPt ? "Estimado 3 - 5 Anos" : isFr ? "Estimé 3 - 5 Ans" : "Estimado 3 - 5 Años"}
                  </strong>
                  <span className="text-[9.5px] text-slate-400 font-mono">{isEn ? "Payback Horizon" : "Horizonte de Retorno"}</span>
                </div>
              </div>
            </div>

            {/* 2. Capital Payback Timeline (Sin Montos Moneda) */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                {getTranslation("linea_tiempo_amortizacion_titulo", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                  <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-wider block mb-1">
                    {getTranslation("etapa_1_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                    {getTranslation("etapa_1_desc", domicilio.pais)}
                  </p>
                </div>
                {/* Step 2 */}
                <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                  <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider block mb-1">
                    {getTranslation("etapa_2_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                    {getTranslation("etapa_2_desc", domicilio.pais)}
                  </p>
                </div>
                {/* Step 3 */}
                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                  <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider block mb-1">
                    {techType === "thermal" ? getTranslation("etapa_3_titulo_termica", domicilio.pais) : getTranslation("etapa_3_titulo", domicilio.pais)}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                    {getTranslation("etapa_3_desc", domicilio.pais)}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Estimated Useful Lifespan by Component */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                {getTranslation("vida_util_equipos_titulo", domicilio.pais)}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    {techType === "thermal" ? (isEn ? "Collector / Tank" : "Colector / Tanque") : (isEn ? "Photovoltaic Panels" : "Módulos Fotovoltaicos")}
                  </span>
                  <strong className="text-emerald-400 font-mono text-xs mt-1">
                    {techType === "thermal" ? getTranslation("vida_util_termotanque", domicilio.pais) : getTranslation("vida_util_paneles", domicilio.pais)}
                  </strong>
                </div>
                {techType !== "thermal" && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {isEn ? "Inverter / Central Unit" : "Inversor / Unidad Central"}
                    </span>
                    <strong className="text-amber-400 font-mono text-xs mt-1">
                      {getTranslation("vida_util_inversor", domicilio.pais)}
                    </strong>
                  </div>
                )}
                {techType === "off-grid" && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {isEn ? "Energy Storage (Batteries)" : "Banco de Baterías"}
                    </span>
                    <strong className="text-blue-400 font-mono text-xs mt-1">
                      {sizing.batteryType && sizing.batteryType.toLowerCase().includes("lit") 
                        ? getTranslation("vida_util_baterias_litio", domicilio.pais) 
                        : getTranslation("vida_util_baterias_gel", domicilio.pais)}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Photovoltaic Panel Performance Degradation Table (Years 1 to 50+) */}
            {techType !== "thermal" && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-amber-400 shrink-0" />
                  {getTranslation("cuadro_degradacion_titulo", domicilio.pais)}
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-amber-400 font-mono text-[10.5px] uppercase font-bold">
                        <th className="py-2.5 px-3">{getTranslation("ano_col", domicilio.pais)}</th>
                        <th className="py-2.5 px-3 text-center">{getTranslation("rendimiento_col", domicilio.pais)}</th>
                        <th className="py-2.5 px-3">{getTranslation("estado_col", domicilio.pais)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-medium text-[11px]">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-mono font-bold text-white">{isEn ? "Year 1" : "Año 1"}</td>
                        <td className="py-2 px-3 text-center font-mono font-extrabold text-emerald-400">98.0%</td>
                        <td className="py-2 px-3">{getTranslation("ano_1_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-mono font-bold text-white">{isEn ? "Year 10" : "Año 10"}</td>
                        <td className="py-2 px-3 text-center font-mono font-extrabold text-emerald-400">92.5%</td>
                        <td className="py-2 px-3">{getTranslation("ano_10_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-mono font-bold text-white">{isEn ? "Year 20" : "Año 20"}</td>
                        <td className="py-2 px-3 text-center font-mono font-extrabold text-amber-400">86.0%</td>
                        <td className="py-2 px-3">{getTranslation("ano_20_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40 bg-amber-950/20">
                        <td className="py-2 px-3 font-mono font-bold text-amber-300">{isEn ? "Year 30" : "Año 30"}</td>
                        <td className="py-2 px-3 text-center font-mono font-black text-amber-400">80.0%</td>
                        <td className="py-2 px-3 font-semibold text-amber-200">{getTranslation("ano_30_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40 bg-emerald-950/30">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-300">{isEn ? "Year 40" : "Año 40"}</td>
                        <td className="py-2 px-3 text-center font-mono font-black text-emerald-400">74.0%</td>
                        <td className="py-2 px-3 font-bold text-emerald-300">{getTranslation("ano_40_estado", domicilio.pais)}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40 bg-emerald-950/20">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-300">{isEn ? "Year 50+" : "Año 50+"}</td>
                        <td className="py-2 px-3 text-center font-mono font-black text-emerald-400">68.0%</td>
                        <td className="py-2 px-3 font-bold text-emerald-300">{getTranslation("ano_50_estado", domicilio.pais)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-amber-300/90 font-medium italic bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
                  💡 {getTranslation("cuadro_degradacion_nota", domicilio.pais)}
                </p>
              </div>
            )}
          </div>

          {/* CAD Technical Single-Line Diagram Section */}
          <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/30 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-bold flex items-center justify-between">
              <span>📐 {getTranslation("cad_technical_singleline", domicilio.pais)}</span>
              <span className="text-[9px] text-slate-400 font-mono font-normal">NORMA IEC / IEEE</span>
            </h4>
            
            <div className="w-full flex items-center justify-center p-2 bg-black border border-slate-800 rounded-lg overflow-hidden select-none">
              <svg className="w-full h-auto max-w-[520px]" viewBox="0 0 540 600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPatternReport" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Engineering Background Grid */}
                <rect width="540" height="600" fill="#09090b" rx="8" />
                <rect width="540" height="600" fill="url(#gridPatternReport)" rx="8" />

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
                                  {sizing.batteriesTotalCount}x {sizing.batteryCapacityAh || 200}Ah {sizing.batteryType || "GEL"}
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
          </div>

          {/* Engineering Schematics Wiring Instruction */}
          <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/20 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 font-bold">{getTranslation("instrucciones_montaje_cableado", domicilio.pais)}</h4>
            <div className="text-xs space-y-2 text-slate-200 leading-relaxed font-mono font-bold">
              {techType === "off-grid" ? (
                <>
                  <p className="border-b border-slate-800 pb-2">
                    • <span className="text-white font-bold">{getTranslation("arreglo_paneles_super_eficiente", domicilio.pais)}</span> <span className="text-amber-400 font-bold">{sizing.panelsLayout}</span>.
                    <br />
                    <span className="text-slate-300 font-sans mt-1 block">{sizing.panelsWiringDetail}</span>
                  </p>
                  <p className="border-b border-slate-800 pb-2">
                    • <span className="text-white font-bold font-sans">{getTranslation("banco_de_baterias", domicilio.pais)}</span> <span className="text-amber-400 font-bold">{sizing.batteriesLayout}</span> ({sizing.batteriesTotalCount}x {sizing.batteryType} con voltaje total de {sizing.batterySystemVoltage}V).
                    <br />
                    <span className="text-slate-300 font-sans mt-1 block">{sizing.batteriesWiringDetail}</span>
                  </p>
                  {sizing.isThermostatOptimized && (
                    <div className="bg-blue-950/20 border border-blue-500/20 p-2.5 rounded-lg text-[11px] text-blue-200 font-medium space-y-1 my-2">
                      <p className="font-bold flex items-center gap-1.5 text-blue-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
                        {isEn 
                          ? "📢 OFF-GRID ENERGY OPTIMIZATION ACTIVATED:" 
                          : isPt 
                          ? "📢 OTIMIZAÇÃO ENERGÉTICA OFF-GRID ATIVADA:" 
                          : isFr
                          ? "📢 OPTIMISATION ÉNERGÉTIQUE OFF-GRID ACTIVÉE:"
                          : "📢 OPTIMIZACIÓN ENERGÉTICA OFF-GRID ACTIVADA:"}
                      </p>
                      <p className="leading-snug">
                        {isEn
                          ? `System sized smaller by intelligently calculating periodic cycling loads of refrigerators, freezers, and air conditioners, saving ${sizing.thermostatSavingsWh} Wh/day over gross demand (${sizing.originalWhPerDay} Wh/day). This reduces panels and batteries needed, maximizing investment return.`
                          : isPt
                          ? `Sistema dimensionado menor calculando de forma inteligente as cargas de ciclagem periódica de geladeiras, freezers e ar condicionados, economizando ${sizing.thermostatSavingsWh} Wh/dia em relação à demanda bruta total (${sizing.originalWhPerDay} Wh/dia). Isso reduz o número de painéis e baterias necessárias, maximizando a eficiência do investimento.`
                          : isFr
                          ? `Système dimensionné plus efficacement en calculant intelligemment les cycles des réfrigérateurs et climatiseurs, économisant ${sizing.thermostatSavingsWh} Wh/jour par rapport à la demande brute (${sizing.originalWhPerDay} Wh/jour).`
                          : `Se redujo el tamaño del sistema calculando de forma inteligente la carga periódica de ciclado de termostatos para heladeras, freezers y aires acondicionados, logrando un ahorro de ${sizing.thermostatSavingsWh} Wh/día frente a la demanda continua bruta (${sizing.originalWhPerDay} Wh/día). Esto reduce la cantidad de paneles y baterías necesarias, maximizando la eficiencia de su inversión.`}
                      </p>
                    </div>
                  )}
                </>
              ) : techType === "on-grid" ? (
                <>
                  <p className="border-b border-slate-800 pb-1.5">
                    • <span className="text-white font-bold mr-1.5">{getTranslation("medidor_bidireccional_req", domicilio.pais)}</span>
                    <span>{
                    isEn
                      ? "Requires the installation of a certified smart utility meter under Net Metering regulations to register injection excess to the grid."
                      : isPt
                      ? "Requer-se a instalação de um medidor inteligente homologado sob os regulamentos de compensação de energia para registrar a injeção de excedentes."
                      : isFr
                      ? "Nécessite l'installation d'un compteur intelligent certifié sous la réglementation de comptage net."
                      : "Se requiere la instalación de un medidor inteligente Homologado bajo la Ley Nacional de Generación Distribuida N° 27.424 para registrar la inyección de excedentes a la red pública."
                  }</span></p>
                  <p className="border-b border-slate-800 pb-1.5">
                    • <span className="text-white font-bold mr-1.5">{getTranslation("inyeccion_limitada_req", domicilio.pais)}</span>
                    <span>{
                    isEn
                      ? `The ${sizing.inverterModel} smart inverter features secondary zero-export injection if the local utility hasn't completed net metering approvals.`
                      : isPt
                      ? `O inversor inteligente ${sizing.inverterModel} conta com sistema de injeção zero secundário caso a distribuidora local ainda não tenha finalizado a homologação.`
                      : isFr
                      ? `L'onduleur intelligent ${sizing.inverterModel} intègre une fonction d'injection zéro secondaire.`
                      : `El inversor inteligente ${sizing.inverterModel} cuenta con sistema de inyección cero de forma secundaria si la compañía distribuidora local no finaliza la habilitación bidireccional.`
                  }</span></p>
                </>
              ) : (
                <>
                  <p className="border-b border-slate-800 pb-1.5">
                    • <span className="text-white font-bold mr-1.5">{getTranslation("esquema_instalacion_req", domicilio.pais)} ({sizing.thermalExplanation}):</span>
                    <span>{
                    isEn
                      ? "Assemble connected units according to reverse-return balanced hydraulic layout to ensure stable temperatures across all storage tanks."
                      : isPt
                      ? "Instalar as unidades conectadas de acordo com o plano hidráulico de fluxo compensado para assegurar temperaturas estáveis em todos os acumuladores."
                      : isFr
                      ? "Assembler les unités selon un schéma hydraulique équilibré à retour inversé."
                      : "Armar las unidades conectadas según plano hidráulico de flujo compensado para asegurar temperaturas estables en todos los acumuladores."
                  }</span></p>
                  <p className="border-b border-slate-800 pb-1.5">
                    • <span className="text-white font-bold font-sans mr-1.5">{getTranslation("estructura_y_colectores_req", domicilio.pais)}</span>
                    <span>{
                    isEn
                      ? `Install on flat surface without constant shadows. The ${sizing.collectorTubesCount} borosilicate evacuated tube collectors must face straight ${orientationText} with a tilt of 40° to 45°.`
                      : isPt
                      ? `Instalar em superfície plana sem sombras constantes. Os coletores de ${sizing.collectorTubesCount} tubos de vácuo de borossilicato devem ser orientados para o ${orientationText} franco com inclinação de 40° a 45°.`
                      : isFr
                      ? `Installer sur une surface plane sans ombres. Les capteurs de ${sizing.collectorTubesCount} tubes sous vide doivent être orientés plein ${orientationText} avec une inclinaison de 40° à 45°.`
                      : `Instalar en superficie plana sin sombras constantes. Los colectores de ${sizing.collectorTubesCount} tubos de vacío de borosilicato deben orientarse al ${orientationText} franco con inclinación de 40° a 45°.`
                  }</span></p>
                  <p className="border-b border-slate-800 pb-1.5">
                    • <span className="text-white font-bold mr-1.5">{getTranslation("tecnologia_de_colector_req", domicilio.pais)}</span>
                    <span>{
                    sizing.hasPressurizer 
                      ? (isEn
                          ? "Due to booster pump pressure, storage tanks must feature dry-bulb HEAT PIPE technology capable of withstanding constant hydraulic push."
                          : isPt
                          ? "Devido à pressão da bomba, serão instalados tanques acumuladores com tecnologia HEAT PIPE de bulbos secos capazes de resistir à pressão hidráulica constante."
                          : isFr
                          ? "En raison de la pression, les réservoirs disposeront de la technologie HEAT PIPE."
                          : "Al contar con bomba de presión, se instalarán acumuladores con tecnología HEAT PIPE de bulbos secos capaces de resistir el empuje hidráulico constante.")
                      : (isEn
                          ? "Conventional atmospheric gravity-fed model, with a free aerial vent pipe to prevent internal pressure on the backup reservoir tank."
                          : isPt
                          ? "Modelo atmosférico de preenchimento convencional por gravidade, com tubo de ventilação livre para evitar pressões internas."
                          : isFr
                          ? "Modèle atmosphérique à écoulement par gravité."
                          : "Modelo atmosférico de llenado por gravedad convencional, con caño de venteo aéreo libre para evitar presiones internas sobre el tanque de reserva.")
                  }</span></p>
                    {sizing.waterHardness === "dura" && (
                      <p className="border-b border-slate-800 pb-1.5">• <span className="text-amber-400 font-bold mr-1.5">{getTranslation("filtro_ablandador_sarro_req", domicilio.pais)}</span> <span>{
                        isEn
                          ? "Supply reports hard water. Inlet must be equipped with a cation-resin water softener filter to prevent harmful mineral scaling."
                          : isPt
                          ? "O abastecimento reporta água dura. Exige-se equipar a entrada com um filtro descalcificador de resinas catiônicas para prevenir saturação mineral."
                          : isFr
                          ? "L'eau étant dure, un filtre adoucisseur à résine est requis à l'entrée."
                          : "El suministro reporta agua dura. Se exige equipar la entrada con un filtro ablandador de resinas catiónicas para prevenir saturaciones minerales nocivas."
                      }</span></p>
                    )}
                    {sizing.hasMinors && (
                      <p className="border-b border-slate-800 pb-1.5">• <span className="text-rose-400 font-bold mr-1.5">{getTranslation("valvula_termostatica_mezcla_req", domicilio.pais)}</span> <span>{
                        isEn
                          ? "Since minors live in the house, a three-way thermostatic mixing valve must be coupled to the sanitary outlet pre-adjusted to a safe maximum of 42°C."
                          : isPt
                          ? "Sendo que moram menores na casa, é obrigatório instalar uma válvula misturadora termostática na saída de água pré-ajustada para um máximo seguro de 42°C."
                          : isFr
                          ? "En présence de mineurs, un mitigeur thermostatique réglé à 42°C max est obligatoire."
                          : "Al habitar menores de edad, es obligatorio acoplar una válvula termostática de tres vías a la salida sanitaria pre-ajustada a un máximo seguro de 42°C."
                      }</span></p>
                    )}
                </>
              )}
              <div className="text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-t border-amber-500/20 pt-3 mt-4 text-center">
                {whiteLabelEnabled ? (
                  <>
                    <span className="text-amber-400 font-extrabold">{whiteLabelCompanyName || getTranslation("header_title", domicilio.pais)}</span>
                    {whiteLabelEmail && (
                      <>
                        <span className="hidden sm:inline text-slate-500">•</span>
                        <span className="text-amber-400 font-bold">{whiteLabelEmail}</span>
                      </>
                    )}
                    {whiteLabelWhatsApp && (
                      <>
                        <span className="hidden sm:inline text-slate-500">•</span>
                        <span>WhatsApp: +{whiteLabelWhatsApp}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-amber-400 font-extrabold">{getTranslation("header_title", domicilio.pais)}</span>
                    <span className="hidden sm:inline text-amber-400 font-bold">•</span>
                    <span className="text-amber-400 font-bold">www.rederar.com.ar</span>
                    <span className="hidden sm:inline text-slate-500">•</span>
                    <span>Paraná, Entre Ríos, Argentina</span>
                  </>
                )}
              </div>
              
              {/* Dynamic Technician Contact details inside report */}
              {whiteLabelEnabled ? (
                whiteLabelWhatsApp ? (
                  <div className="mt-4 border-t border-zinc-800/60 pt-3 text-center text-xs font-mono">
                    <span className="text-[#25D366] font-extrabold uppercase tracking-wide">{getTranslation("contacto_tecnico_autorizado", domicilio.pais)} </span>
                    <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">WhatsApp +{whiteLabelWhatsApp}</span>
                  </div>
                ) : (
                  <div className="mt-4 border-t border-zinc-800/40 pt-3 text-center text-xs font-mono text-zinc-500">
                    <span>{getTranslation("contacto_tecnico_no_configurado", domicilio.pais)}</span>
                  </div>
                )
              ) : installerPhone ? (
                <div className="mt-4 border-t border-zinc-800/60 pt-3 text-center text-xs font-mono">
                  <span className="text-[#25D366] font-extrabold uppercase tracking-wide">{getTranslation("contacto_tecnico_autorizado", domicilio.pais)} </span>
                  <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">WhatsApp +{installerPhone}</span>
                </div>
              ) : (
                <div className="mt-4 border-t border-zinc-800/40 pt-3 text-center text-xs font-mono text-zinc-500">
                  <span>{getTranslation("contacto_tecnico_no_configurado", domicilio.pais)}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Buttons - PDF Download trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 px-6 py-4 border-t border-amber-500/20 bg-slate-900 rounded-b-2xl no-print w-full">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-bold rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            {getTranslation("cerrar_preview", domicilio.pais)}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-black rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            id="btn_descargar_pdf_dispositivo"
          >
            {isGeneratingPdf ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : (
              <Download className="h-4 w-4 text-white stroke-[3.5]" />
            )}
            <span>{isGeneratingPdf ? getTranslation("generando_pdf", domicilio.pais) : getTranslation("descargar_reporte_pdf_btn", domicilio.pais)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
