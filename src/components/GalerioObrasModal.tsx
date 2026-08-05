import { useState } from "react";
import { X, ExternalLink, Calendar, MapPin, Sparkles, Zap, Flame, Grid } from "lucide-react";

interface GalerioObrasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProyectoObra {
  id: string;
  title: string;
  category: "Off-Grid" | "On-Grid" | "Térmica";
  location: string;
  date: string;
  scale: string;
  panels: string;
  inverter: string;
  batteriesOrTubes: string;
  description: string;
  visualBg: string; // Gradient color representing the visual vibe
}

export default function GalerioObrasModal({ isOpen, onClose }: GalerioObrasModalProps) {
  const [selectedTechFilter, setSelectedTechFilter] = useState<"All" | "Off-Grid" | "On-Grid" | "Térmica">("All");

  if (!isOpen) return null;

  const proyectos: ProyectoObra[] = [
    {
      id: "obra-1",
      title: "Estancia Agropecuaria La Julia",
      category: "Off-Grid",
      location: "Federal, Entre Ríos",
      date: "Marzo 2026",
      scale: "Rural Industrial",
      panels: "24 x Paneles 550W (13.2 kWp)",
      inverter: "Dual Growatt SPF 5000ES (10kW)",
      batteriesOrTubes: "16 x Baterías AGM 12V 100Ah (48V 400Ah)",
      description: "Electrificación solar fotovoltaica integral aislada de red pública para silos de acopio, bombas de agua sumergibles trifásicas y puestos de personal.",
      visualBg: "from-amber-600/20 to-teal-900/40 border-amber-500/30"
    },
    {
      id: "obra-2",
      title: "Residencia Ecológica El Ceibo",
      category: "Off-Grid",
      location: "Gualeguaychú, Entre Ríos",
      date: "Enero 2026",
      scale: "Residencial Autónoma",
      panels: "12 x Paneles 550W (6.6 kWp)",
      inverter: "Growatt SPF 5000 ES (5kW)",
      batteriesOrTubes: "8 x Baterías AGM 12V 100Ah (48V 200Ah)",
      description: "Dimensionamiento y montaje llave en mano sobre techado de chapa sinusoidal. Sistema configurado con arranque automático de generador electrónico auxiliar.",
      visualBg: "from-blue-600/20 to-blue-900/40 border-blue-500/30"
    },
    {
      id: "obra-3",
      title: "Parque Industrial Victoria - Techint",
      category: "On-Grid",
      location: "Victoria, Entre Ríos",
      date: "Febrero 2026",
      scale: "Comercial / Corporativo",
      panels: "96 x Paneles 550W (52.8 kWp)",
      inverter: "Growatt MAC 50KTL3-X (50kW)",
      batteriesOrTubes: "Conexión a Red (Sistema Inyección Distribuida)",
      description: "Primera etapa de planta de autogeneración solar bajo régimen de ley de generación distribuida provincial para abatimiento de picos tarifarios industriales.",
      visualBg: "from-violet-600/20 to-blue-950/40 border-indigo-500/30"
    },
    {
      id: "obra-4",
      title: "Hotel Termas San José - Termotanque Solar",
      category: "Térmica",
      location: "San José, Entre Ríos",
      date: "Diciembre 2025",
      scale: "Turístico / Comercial",
      panels: "4 x Termotanques Atmosféricos Rederar 300L",
      inverter: "Controladores SR609 Integrados",
      batteriesOrTubes: "120 x Tubos de Vacío Borosilicato",
      description: "Generación de agua caliente sanitaria para batería de vestuarios y cocina principal. Mitigación del 80% del consumo de gas licuado de petróleo (GLP).",
      visualBg: "from-rose-600/20 to-orange-950/40 border-rose-500/30"
    },
    {
      id: "obra-5",
      title: "Barrio Cerrado El Remanso - Autoconsumo",
      category: "On-Grid",
      location: "Paraná, Entre Ríos",
      date: "Noviembre 2025",
      scale: "Residencial Urbano",
      panels: "8 x Paneles 550W (4.4 kWp)",
      inverter: "Growatt MIN 5000TL-X (5kW)",
      batteriesOrTubes: "Inyección Homologada por ENERSA",
      description: "Sistema solar conectado a red eléctrica domiciliaria que inyecta los excedentes generados para lograr facturación mensual con saldo a favor neto.",
      visualBg: "from-cyan-600/20 to-sky-950/40 border-cyan-500/30"
    },
    {
      id: "obra-6",
      title: "Complejo de Cabañas 'Río Paraná'",
      category: "Térmica",
      location: "Diamante, Entre Ríos",
      date: "Octubre 2025",
      scale: "Complejo Turístico",
      panels: "6 x Termotanques Rederar 150L",
      inverter: "Control Digital Solar Centralizado",
      batteriesOrTubes: "90 x Tubos de Vacío Evacuados",
      description: "Instalación individualizada de colectores solares térmicos para 6 bungalows familiares garantizando abastecimiento autónomo continuo en ecoturismo.",
      visualBg: "from-amber-600/20 to-rose-950/40 border-amber-500/30"
    }
  ];

  const filteredProyectos = selectedTechFilter === "All" 
    ? proyectos 
    : proyectos.filter(p => p.category === selectedTechFilter);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl bg-black border-2 border-yellow-500 shadow-2xl text-white flex flex-col max-h-[90vh] bg-black opacity-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/30 bg-black rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight text-white">
                Galería de Obras Destacadas
              </h2>
              <p className="text-xs text-yellow-400 font-medium">Instalaciones de primer nivel realizadas en todo el territorio nacional.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 rounded-lg bg-zinc-900 border border-yellow-500/30 text-yellow-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-black border-b border-zinc-800 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider mr-2">Filtrar por Tecnología:</span>
          
          <button
            onClick={() => setSelectedTechFilter("All")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition duration-200 cursor-pointer border ${
              selectedTechFilter === "All" 
                ? "bg-yellow-500 text-black font-black border-yellow-500" 
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border-zinc-700"
            }`}
          >
            Todos
          </button>
          
          <button
            onClick={() => setSelectedTechFilter("Off-Grid")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer border ${
              selectedTechFilter === "Off-Grid" 
                ? "bg-yellow-500 text-black font-black border-yellow-500" 
                : "bg-zinc-900 text-blue-400 hover:bg-zinc-800 border-blue-500/30"
            }`}
          >
            <Zap className="h-3 w-3" />
            Sistemas Off-Grid
          </button>

          <button
            onClick={() => setSelectedTechFilter("On-Grid")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer border ${
              selectedTechFilter === "On-Grid" 
                ? "bg-yellow-500 text-black font-black border-yellow-500" 
                : "bg-zinc-900 text-blue-400 hover:bg-zinc-800 border-blue-500/30"
            }`}
          >
            <Grid className="h-3 w-3" />
            Sistemas On-Grid
          </button>

          <button
            onClick={() => setSelectedTechFilter("Térmica")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer border ${
              selectedTechFilter === "Térmica" 
                ? "bg-yellow-500 text-black font-black border-yellow-500" 
                : "bg-zinc-900 text-rose-400 hover:bg-zinc-800 border-rose-500/30"
            }`}
          >
            <Flame className="h-3 w-3" />
            Solar Térmica
          </button>
        </div>

        {/* Content Obra List */}
        <div className="p-6 overflow-y-auto flex-1 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProyectos.map((obra) => (
              <div 
                key={obra.id}
                className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between hover:scale-[1.02] hover:border-yellow-500/50 hover:shadow-lg transition duration-300"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      obra.category === "Off-Grid" 
                        ? "bg-blue-950/60 text-blue-300 border border-blue-500/40" 
                        : obra.category === "On-Grid"
                        ? "bg-blue-950/60 text-blue-300 border border-blue-500/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                    }`}>
                      {obra.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold">{obra.scale}</span>
                  </div>

                  {/* Title / Info */}
                  <h3 className="text-base font-bold text-white mt-3 group-hover:text-yellow-400 transition">
                    {obra.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 mt-2 font-mono font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                    <span>{obra.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                    <span>{obra.date}</span>
                  </div>

                  {/* Technical Spec Summary Block inside Card */}
                  <div className="mt-4 p-3 bg-black rounded-lg border border-yellow-500/20 space-y-1.5 font-mono text-[11px] text-zinc-300">
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Módulos:</span>
                      <span className="text-zinc-100 font-bold text-right truncate max-w-[150px]">{obra.panels}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Control / Inversor:</span>
                      <span className="text-zinc-100 font-bold text-right truncate max-w-[150px]">{obra.inverter}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">{obra.category === "Térmica" ? "Colectores:" : "Baterías:"}</span>
                      <span className="text-yellow-400 font-bold text-right truncate max-w-[150px]">{obra.batteriesOrTubes}</span>
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 mt-4 leading-relaxed line-clamp-3">
                    {obra.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-end">
                  <span className="text-xs text-yellow-400 group-hover:translate-x-1 transition duration-200 flex items-center gap-1 cursor-pointer font-bold">
                    Ver ficha obra <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-black rounded-b-2xl">
          <p className="text-xs text-zinc-400 font-mono font-bold">REDERAR • Red Argentina de Energías Renovables</p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition cursor-pointer"
          >
            Cerrar Galería
          </button>
        </div>

      </div>
    </div>
  );
}
