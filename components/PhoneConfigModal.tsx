import { useState, useEffect, FormEvent } from "react";
import { X, Phone, CheckCircle, Smartphone } from "lucide-react";

interface PhoneConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onSave: (phone: string) => void;
}

export default function PhoneConfigModal({
  isOpen,
  onClose,
  phone,
  onSave,
}: PhoneConfigModalProps) {
  const [localPhone, setLocalPhone] = useState("");
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalPhone(phone);
      setError("");
      setSavedSuccess(false);
    }
  }, [isOpen, phone]);

  if (!isOpen) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = localPhone.replace(/[^\d]/g, ""); // Keep only digits

    if (!cleanPhone) {
      setError("Por favor, ingresa un número de teléfono válido.");
      return;
    }

    if (cleanPhone.length < 10) {
      setError("El número parece demasiado corto. Debe incluir código de país y código de área sin el signo '+'.");
      return;
    }

    onSave(cleanPhone);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-black border-2 border-[#25D366] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-white transform scale-100 transition-all duration-300 bg-black opacity-100">
        
        {/* Header */}
        <div className="bg-black border-b border-[#25D366]/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#25D366] animate-pulse" />
            <span className="font-sans font-black text-xs uppercase tracking-widest text-[#25D366]">
              Configuración de Celular
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-900/50 rounded-full transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Cerrar"
            id="btn_close_phone_config"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center border border-[#25D366]/30 mb-2">
              <Phone className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-sans font-black text-white tracking-tight uppercase">
              Tu WhatsApp Técnico
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
              Ingresa tu celular para que los presupuestos, pedidos de cotización y reportes queden vinculados a tu cuenta de WhatsApp para enviarlos directamente.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-amber-400 uppercase tracking-widest font-sans">
              Número de Celular (WhatsApp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-zinc-600 font-bold font-sans text-xs select-none">
                +
              </span>
              <input
                type="text"
                required
                value={localPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, ""); // Only digits
                  setLocalPhone(val);
                  if (error) setError("");
                }}
                placeholder="Ej: 5493434802264"
                className="w-full rounded-xl bg-black border border-zinc-800 focus:border-[#25D366] px-8 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:bg-zinc-950 transition font-mono font-bold tracking-widest"
                autoFocus
                id="input_modal_tecnico_whatsapp"
              />
            </div>
            <p className="text-[9px] text-zinc-500 leading-normal font-sans">
              ⚠️ Escribe el número <strong className="text-amber-500">sin el signo "+" ni espacios</strong>. Debe incluir código de país y de área. Ej. para Argentina: <strong className="font-mono text-emerald-400">5493434802264</strong>.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-[11px] text-red-400 font-bold font-sans text-center">
              ⚠️ {error}
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-[#25D366]/60 rounded-xl text-[11px] text-[#25D366] font-extrabold font-sans text-center flex items-center justify-center gap-1.5 animate-bounce">
              <CheckCircle className="w-4 h-4 text-[#25D366]" />
              ¡Número agendado con éxito!
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-[#25D366]/20 text-center"
            >
              Guardar Número
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
