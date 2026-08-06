import React, { useState } from "react";
import { Domicilio, COUNTRIES_DATA, SavedProject } from "../types";
import { getTranslation } from "../translations";
import { Sparkles, Lock, Trash2, Upload, FolderOpen, Save, CheckCircle2, Key } from "lucide-react";

interface DatosGestionProps {
  domicilio: Domicilio;
  setDomicilio: (d: Domicilio) => void;
  hsp: number;
  techType?: "on-grid" | "off-grid" | "thermal";
  installerPhone: string;
  setInstallerPhone: (phone: string) => void;
  isUnlocked: boolean;
  creditsAmount: number;
  whiteLabelEnabled: boolean;
  setWhiteLabelEnabled: (val: boolean) => void;
  whiteLabelCompanyName: string;
  setWhiteLabelCompanyName: (val: string) => void;
  whiteLabelEmail: string;
  setWhiteLabelEmail: (val: string) => void;
  whiteLabelWhatsApp: string;
  setWhiteLabelWhatsApp: (val: string) => void;
  whiteLabelLogo: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoClear: () => void;
  savedProjects: SavedProject[];
  onSaveProject: (name: string) => void;
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  activeTechType?: "on-grid" | "off-grid" | "thermal" | null;
  onOpenUnlockModal?: () => void;
}

export default function DatosGestion({
  domicilio,
  setDomicilio,
  hsp,
  techType = "off-grid",
  installerPhone,
  setInstallerPhone,
  isUnlocked,
  creditsAmount,
  whiteLabelEnabled,
  setWhiteLabelEnabled,
  whiteLabelCompanyName,
  setWhiteLabelCompanyName,
  whiteLabelEmail,
  setWhiteLabelEmail,
  whiteLabelWhatsApp,
  setWhiteLabelWhatsApp,
  whiteLabelLogo,
  onLogoUpload,
  onLogoClear,
  savedProjects,
  onSaveProject,
  onLoadProject,
  onDeleteProject,
  activeTechType = null,
  onOpenUnlockModal
}: DatosGestionProps) {

  const isPremiumActive = isUnlocked || creditsAmount > 0;
  const [justClearedWl, setJustClearedWl] = useState(false);

  const handleClearAllWhiteLabel = () => {
    setWhiteLabelCompanyName("");
    setWhiteLabelEmail("");
    setWhiteLabelWhatsApp("");
    setWhiteLabelEnabled(false);
    onLogoClear();
    try {
      localStorage.removeItem("rederar_wl_company_name");
      localStorage.removeItem("rederar_wl_email");
      localStorage.removeItem("rederar_wl_whatsapp");
      localStorage.removeItem("rederar_wl_enabled");
      localStorage.removeItem("rederar_wl_logo");
    } catch (e) {}
    setJustClearedWl(true);
    setTimeout(() => setJustClearedWl(false), 2500);
  };

  const handleInputChange = (field: keyof Domicilio, value: string) => {
    setDomicilio({
      ...domicilio,
      [field]: value
    });
  };

  const handleCountryChange = (countryName: string) => {
    setDomicilio({
      ...domicilio,
      pais: countryName,
      provincia: "" // Reset province/state when country changes
    });
  };

  // Filter provinces list based on selected country
  const activeCountryName = domicilio.pais || "Argentina";
  const activeCountry = COUNTRIES_DATA.find((c) => c.name === activeCountryName) || COUNTRIES_DATA[0];
  const provincias = activeCountry.provinces.map((p) => p.name);

  return (
    <div className="flex flex-col h-auto md:h-full bg-black border border-white rounded-2xl p-4 shadow-sm select-none text-white transition-all duration-300 md:overflow-y-auto min-h-0 pr-0.5">
      {/* Title */}
      <h3 className="text-base font-extrabold text-white font-sans tracking-tight mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2">
        {getTranslation("title_datos_gestion", domicilio.pais)}
      </h3>

      {/* Inputs Form */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
              {getTranslation("label_pais", domicilio.pais)}
            </label>
            <div className="relative">
              <select
                value={domicilio.pais || "Argentina"}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-extrabold cursor-pointer pr-10 shadow-sm"
                style={{ colorScheme: 'dark', backgroundColor: '#000000', color: '#f8fafc' }}
                id="select_pais"
              >
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.name} value={c.name} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>
                    {c.name}
                  </option>
                ))}
              </select>
              {/* Custom dropdown Select Arrow Chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
              {getTranslation("label_provincia", domicilio.pais)}
            </label>
            <div className="relative">
              <select
                value={domicilio.provincia || ""}
                onChange={(e) => handleInputChange("provincia", e.target.value)}
                className={`w-full appearance-none rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-extrabold cursor-pointer pr-10 shadow-sm ${domicilio.provincia ? 'text-slate-100' : 'text-slate-500'}`}
                style={{ colorScheme: 'dark', backgroundColor: '#000000', color: domicilio.provincia ? '#f8fafc' : '#64748b' }}
                id="select_provincia"
              >
                <option value="" disabled className="bg-black text-slate-500 font-bold font-sans" style={{ backgroundColor: '#09090b', color: '#64748b' }}>{getTranslation("select_provincia", domicilio.pais)}</option>
                {provincias.map((prov) => (
                  <option key={prov} value={prov} className="bg-zinc-950 text-slate-100 font-sans font-bold text-xs" style={{ backgroundColor: '#09090b', color: '#f8fafc' }}>
                    {prov}
                  </option>
                ))}
              </select>
              {/* Custom dropdown Select Arrow Chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
              {getTranslation("label_nombre", domicilio.pais)}
            </label>
            <input
              type="text"
              value={domicilio.nombre || ""}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder={getTranslation("placeholder_nombre", domicilio.pais)}
              className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-bold shadow-sm"
              id="input_solicitante_nombre"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
              {getTranslation("label_apellido", domicilio.pais)}
            </label>
            <input
              type="text"
              value={domicilio.apellido || ""}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              placeholder={getTranslation("placeholder_apellido", domicilio.pais)}
              className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-bold shadow-sm"
              id="input_solicitante_apellido"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
            {getTranslation("label_domicilio", domicilio.pais)}
          </label>
          <input
            type="text"
            value={domicilio.domicilio || ""}
            onChange={(e) => handleInputChange("domicilio", e.target.value)}
            placeholder={getTranslation("placeholder_domicilio", domicilio.pais)}
            className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-bold shadow-sm"
            id="input_domicilio"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-bold text-white uppercase tracking-wider mb-1 font-sans">
            {getTranslation("label_localidad", domicilio.pais)}
          </label>
          <input
            type="text"
            value={domicilio.localidad || ""}
            onChange={(e) => handleInputChange("localidad", e.target.value)}
            placeholder={getTranslation("placeholder_localidad", domicilio.pais)}
            className="w-full rounded-xl bg-black border border-emerald-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-zinc-950 transition font-sans font-bold shadow-sm"
            id="input_localidad"
          />
        </div>
      </div>

      {/* HSP Assigned Card - Beautiful bento-grid style box matching the reference image */}
      <div className="mt-3.5 p-2.5 bg-black border border-white rounded-xl flex items-center justify-center shadow-sm">
        <p className="text-xs font-black text-white text-center tracking-tight">
          {getTranslation("hsp_asignado", domicilio.pais)} <span className="bg-zinc-900 border border-zinc-700 text-yellow-400 font-extrabold text-sm px-2 py-0.5 rounded mx-1">{hsp.toFixed(1)}</span> {getTranslation("hsp_unidad", domicilio.pais)}
        </p>
      </div>

      {/* VALIDACIÓN DE DATOS DEL SOLICITANTE */}
      <div className="mt-3.5 p-3.5 bg-black border border-zinc-800 rounded-xl space-y-2.5 animate-fade-in">
        <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {getTranslation("titulo_validacion", domicilio.pais)}
        </h4>
        
        <p className="text-[9.5px] font-bold text-slate-400 mb-1">
          {getTranslation("obs_carga_datos", domicilio.pais)}
        </p>
        
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] font-sans font-bold">
          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              (domicilio.pais?.trim() || "")
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.pais?.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.pais?.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_pais", domicilio.pais)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              domicilio.provincia.trim() 
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.provincia.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.provincia.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_provincia", domicilio.pais).split(" / ")[0]}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              domicilio.nombre.trim() 
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.nombre.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.nombre.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_nombre", domicilio.pais)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              domicilio.apellido.trim() 
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.apellido.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.apellido.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_apellido", domicilio.pais)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              domicilio.domicilio.trim() 
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.domicilio.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.domicilio.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_domicilio", domicilio.pais)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
              domicilio.localidad.trim() 
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "bg-red-950/10 border-red-500/40 text-red-500/60"
            }`}>
              {domicilio.localidad.trim() ? "✓" : "○"}
            </span>
            <span className={`${domicilio.localidad.trim() ? "text-emerald-400" : "text-slate-500"}`}>{getTranslation("label_localidad", domicilio.pais)}</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1.1: MARCA BLANCA PREMIUM (COLLAPSIBLE) */}
      <div className="mt-3.5 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2.5 relative">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            {getTranslation("marca_blanca_premium", domicilio.pais)}
          </h4>
          {!isPremiumActive && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase tracking-wider flex items-center gap-0.5">
              <Lock className="w-2 h-2" /> {getTranslation("bloqueado", domicilio.pais)}
            </span>
          )}
        </div>

        <p className="text-[9.5px] font-bold text-slate-400">
          {getTranslation("marca_blanca_desc_premium", domicilio.pais)}
        </p>

        <div className="relative space-y-2.5">
          {/* Overlay to encourage activation if not premium */}
          {!isPremiumActive && (
            <div 
              onClick={onOpenUnlockModal}
              className="absolute bottom-1.5 right-1.5 bg-zinc-950 border border-yellow-500 rounded-lg z-20 flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-zinc-900 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.85)] max-w-[170px] select-none"
            >
              <Lock className="w-4 h-4 text-yellow-500 mb-0.5 animate-pulse" />
              <p className="text-[9px] font-black text-yellow-400 uppercase tracking-wider">{getTranslation("habilitar_marca_blanca", domicilio.pais)}</p>
              <p className="text-[7px] text-zinc-400 mt-0.5 leading-tight">{getTranslation("requiere_creditos_desc", domicilio.pais)}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chk_wl_enabled"
              checked={whiteLabelEnabled}
              onChange={(e) => setWhiteLabelEnabled(e.target.checked)}
              disabled={!isPremiumActive}
              className="rounded bg-black border-zinc-800 text-yellow-500 focus:ring-0 focus:ring-offset-0 cursor-pointer h-3.5 w-3.5 disabled:opacity-50"
            />
            <label htmlFor="chk_wl_enabled" className={`text-[10.5px] font-extrabold cursor-pointer select-none ${whiteLabelEnabled ? 'text-yellow-400' : 'text-zinc-400'}`}>
              {getTranslation("activar_reporte_marca_blanca", domicilio.pais)}
            </label>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                {getTranslation("nombre_empresa_profesional", domicilio.pais)}
              </label>
              <input
                type="text"
                value={whiteLabelCompanyName}
                onChange={(e) => {
                  setWhiteLabelCompanyName(e.target.value);
                  if (e.target.value && !whiteLabelEnabled) setWhiteLabelEnabled(true);
                }}
                placeholder={getTranslation("ej_solar_patagonia", domicilio.pais)}
                disabled={!isPremiumActive}
                className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-slate-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500 transition disabled:opacity-40 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                  {getTranslation("whatsapp_con_codigo", domicilio.pais)}
                </label>
                <input
                  type="text"
                  value={whiteLabelWhatsApp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, "");
                    setWhiteLabelWhatsApp(val);
                    if (val && !whiteLabelEnabled) setWhiteLabelEnabled(true);
                  }}
                  placeholder="Ej. 5493434802264"
                  disabled={!isPremiumActive}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-slate-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500 transition disabled:opacity-40 font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                  {getTranslation("email_contacto", domicilio.pais)}
                </label>
                <input
                  type="email"
                  value={whiteLabelEmail}
                  onChange={(e) => {
                    setWhiteLabelEmail(e.target.value);
                    if (e.target.value && !whiteLabelEnabled) setWhiteLabelEnabled(true);
                  }}
                  placeholder="ventas@empresa.com"
                  disabled={!isPremiumActive}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-slate-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500 transition disabled:opacity-40 font-bold"
                />
              </div>
            </div>

            {/* Custom Logo File Picker */}
            <div>
              <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                {getTranslation("logotipo_empresa_imagen", domicilio.pais)}
              </label>
              {whiteLabelLogo ? (
                <div className="flex items-center gap-2 p-2 bg-black border border-yellow-500/30 rounded-lg">
                  <div className="w-10 h-10 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img src={whiteLabelLogo} alt="Preview Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-emerald-400 font-extrabold truncate">✓ {getTranslation("logo_cargado", domicilio.pais)}</p>
                    <p className="text-[8px] text-zinc-500 font-mono">{getTranslation("persistido_dispositivo", domicilio.pais)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onLogoClear}
                    disabled={!isPremiumActive}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-zinc-900 rounded transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className={`border border-dashed border-zinc-800 bg-black/40 rounded-lg p-3 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/60 transition group ${!isPremiumActive && 'opacity-50 pointer-events-none'}`}>
                  <Upload className="w-4 h-4 text-zinc-500 group-hover:text-yellow-500 mb-1" />
                  <span className="text-[9.5px] text-zinc-400 font-bold">{getTranslation("subir_imagen_logo", domicilio.pais)}</span>
                  <span className="text-[7.5px] text-zinc-600">{getTranslation("recomendado_png_transparente", domicilio.pais)}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onLogoUpload}
                    disabled={!isPremiumActive}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isPremiumActive && (whiteLabelEnabled || whiteLabelCompanyName || whiteLabelEmail || whiteLabelWhatsApp || whiteLabelLogo) && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearAllWhiteLabel}
                  className="px-2.5 py-1.5 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-200 rounded-lg text-[9.5px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  {justClearedWl ? getTranslation("datos_marca_limpiados", domicilio.pais) : getTranslation("limpiar_datos_marca", domicilio.pais)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 1.2: HISTORIAL Y GUARDADO DE COTIZACIONES */}
      <div className="mt-3.5 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2.5 relative">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {getTranslation("historial_cotizaciones", domicilio.pais)}
          </h4>
          {!isPremiumActive && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase tracking-wider flex items-center gap-0.5">
              <Lock className="w-2 h-2" /> {getTranslation("bloqueado", domicilio.pais)}
            </span>
          )}
        </div>

        <p className="text-[9.5px] font-bold text-slate-400">
          {getTranslation("historial_desc_premium", domicilio.pais)}
        </p>

        <div className="relative space-y-2.5">
          {/* Overlay to encourage activation if not premium */}
          {!isPremiumActive && (
            <div 
              onClick={onOpenUnlockModal}
              className="absolute bottom-1.5 right-1.5 bg-zinc-950 border border-yellow-500 rounded-lg z-20 flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-zinc-900 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.85)] max-w-[170px] select-none"
            >
              <Lock className="w-4 h-4 text-yellow-500 mb-0.5 animate-pulse" />
              <p className="text-[9px] font-black text-yellow-400 uppercase tracking-wider">{getTranslation("habilitar_historial", domicilio.pais)}</p>
              <p className="text-[7px] text-zinc-400 mt-0.5 leading-tight">{getTranslation("requiere_creditos_desc", domicilio.pais)}</p>
            </div>
          )}

          {/* Save current project form */}
          <div className="p-2 bg-black border border-zinc-800 rounded-lg space-y-1.5">
            <span className="text-[8.5px] font-mono font-black text-cyan-400 uppercase tracking-wider block">{getTranslation("guardar_proyecto_actual", domicilio.pais)}</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                id="txt_new_project_name"
                placeholder={getTranslation("nombre_proyecto_ej", domicilio.pais)}
                disabled={!isPremiumActive || !activeTechType}
                className="flex-1 rounded-lg bg-black border border-zinc-800 px-2 py-1 text-xs text-slate-100 placeholder-zinc-700 focus:outline-none focus:border-cyan-500 disabled:opacity-50 font-bold"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const el = document.getElementById("txt_new_project_name") as HTMLInputElement;
                    if (el && el.value.trim()) {
                      onSaveProject(el.value);
                      el.value = "";
                    }
                  }
                }}
              />
              <button
                type="button"
                disabled={!isPremiumActive || !activeTechType}
                onClick={() => {
                  const el = document.getElementById("txt_new_project_name") as HTMLInputElement;
                  if (el && el.value.trim()) {
                    onSaveProject(el.value);
                    el.value = "";
                  } else {
                    // Try defaulting
                    const fullName = `${domicilio.nombre || ""} ${domicilio.apellido || ""}`.trim();
                    const defaultName = fullName ? `Cotización ${fullName}` : `Proyecto ${activeTechType?.toUpperCase()}`;
                    onSaveProject(defaultName);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs uppercase transition cursor-pointer flex items-center justify-center disabled:opacity-50 shrink-0"
                title="Guardar"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
            {!activeTechType && (
              <span className="text-[7.5px] text-zinc-500 block leading-tight">
                {getTranslation("guardar_requisito_desc", domicilio.pais)}
              </span>
            )}
          </div>

          {/* List of saved projects */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5">
            {savedProjects.length === 0 ? (
              <div className="text-center py-4 bg-black/30 border border-zinc-900 rounded-lg">
                <FolderOpen className="w-5 h-5 text-zinc-700 mx-auto mb-1" />
                <span className="text-[9px] text-zinc-600 font-bold">{getTranslation("no_proyectos_guardados", domicilio.pais)}</span>
              </div>
            ) : (
              savedProjects.map((p) => (
                <div key={p.id} className="p-2 bg-black border border-zinc-900 rounded-lg flex items-center justify-between gap-2 hover:border-zinc-800 transition text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-100 font-black truncate">{p.name}</span>
                      <span className={`text-[7px] px-1 rounded font-mono uppercase font-black shrink-0 ${
                        p.techType === "on-grid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : p.techType === "off-grid" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {p.techType}
                      </span>
                    </div>
                    <p className="text-[7.5px] text-zinc-500 font-mono mt-0.5">
                      {new Date(p.timestamp).toLocaleDateString(domicilio.pais === "Brasil" ? "pt-BR" : domicilio.pais === "United States" || domicilio.pais === "United Kingdom" ? "en-US" : "es-AR")} • {p.domicilio.localidad || getTranslation("sin_localidad", domicilio.pais)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onLoadProject(p)}
                      title={getTranslation("abrir_recalcular", domicilio.pais)}
                      className="p-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/20 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(p.id)}
                      title={getTranslation("eliminar", domicilio.pais)}
                      className="p-1 rounded bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN/CARTEL PUBLICITARIO PARA SOCIOS/TECNICOS */}
      {!isPremiumActive ? (
        <div className="mt-5 p-3.5 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 space-y-2 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-sans font-black text-[10px] uppercase tracking-widest animate-pulse">
            <span>{getTranslation("installer_promo_title", domicilio.pais)}</span>
          </div>
          <p className="text-[10px] text-zinc-300 leading-relaxed font-sans font-medium text-left">
            {getTranslation("installer_promo_desc", domicilio.pais)}
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onOpenUnlockModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-black font-black text-[11px] uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:bg-amber-300 active:scale-95 transition-all duration-300 w-full cursor-pointer"
              id="btn_request_personalization"
            >
              <Sparkles className="w-4 h-4 shrink-0 text-black" />
              <span>{getTranslation("installer_promo_btn", domicilio.pais)}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-medium font-sans">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>{getTranslation("licencia_activa", domicilio.pais).replace("{status}", isUnlocked ? getTranslation("ilimitada", domicilio.pais) : getTranslation("usos_count", domicilio.pais).replace("{count}", creditsAmount.toString()))}</span>
          </div>
          <button
            type="button"
            onClick={onOpenUnlockModal}
            className="text-[9.5px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-all cursor-pointer"
          >
            {getTranslation("administrar", domicilio.pais)}
          </button>
        </div>
      )}

    </div>
  );
}
