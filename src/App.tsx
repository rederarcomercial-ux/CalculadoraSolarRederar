import React, { useState, useEffect } from "react";
import { Domicilio, CustomAppliance, COUNTRIES_DATA, SavedProject } from "./types";
import { calculateSolarSizing } from "./utils";
import { getTranslation, getCountryLanguage } from "./translations";
import DatosGestion from "./components/DatosGestion";
import ConfigTecnologia from "./components/ConfigTecnologia";
import VistaIngenieria from "./components/VistaIngenieria";
import ReporteModal from "./components/ReporteModal";
import GalerioObrasModal from "./components/GalerioObrasModal";
import PresupuestoModal from "./components/PresupuestoModal";
import RederarLogo from "./components/RederarLogo";
import PhoneConfigModal from "./components/PhoneConfigModal";
import ManualModal from "./components/ManualModal";
import TermsModal from "./components/TermsModal";
import { PhoneCall, X, Sun, Key, Copy, Check, Lock, RefreshCw, CreditCard, Coins, Search, Zap, Globe, Book, ShieldCheck } from "lucide-react";

export default function App() {
  // Custom states for sharing and logo zoom modal view as requested
  const [showLogoZoomModal, setShowLogoZoomModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);

  // 0. Technician's WhatsApp Number State matching user requirement (persisted offline, default to REDERAR public WhatsApp)
  const [installerPhone, setInstallerPhone] = useState<string>("5493434802264");

  const handleInstallerPhoneChange = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, ""); // Keep only digits
    setInstallerPhone(cleanPhone);
    try {
      localStorage.setItem("rederar_installer_whatsapp", cleanPhone);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Client Domicilio info state (Empty initially as requested by user, with placeholders in UI)
  const [domicilio, setDomicilio] = useState<Domicilio>({
    nombre: "",
    apellido: "",
    domicilio: "",
    localidad: "",
    provincia: "",
    pais: "Argentina"
  });

  // Keep the last dimensioned applicant data to display in reports, quotes, and calculations
  const [lastDimensionedDomicilio, setLastDimensionedDomicilio] = useState<Domicilio | null>(null);

  // 2. Active technology selection (Starts as null so only applicant inputs are initially enabled)
  const [techType, setTechType] = useState<"on-grid" | "off-grid" | "thermal" | null>(null);

  // Active validation alert if they select technology without filling applicant details
  const [showIncompleteAlert, setShowIncompleteAlert] = useState<boolean>(false);

  // Check if applicant data is complete
  const isApplicantDataComplete = 
    domicilio.nombre.trim() !== "" && 
    domicilio.apellido.trim() !== "" && 
    domicilio.domicilio.trim() !== "" && 
    domicilio.localidad.trim() !== "" && 
    domicilio.provincia.trim() !== "" &&
    (domicilio.pais?.trim() || "") !== "";

  const isFormAndTechSubmited = (isApplicantDataComplete || !!lastDimensionedDomicilio) && techType !== null;

  // 3. Autonomy Days slider state (Default is 2 days)
  const [autonomyDays, setAutonomyDays] = useState<number>(2);

  // New States requested for advanced technology parameters
  const [batteryType, setBatteryType] = useState<"gel" | "lithium">("gel");
  const [batteryVoltage, setBatteryVoltage] = useState<12 | 24 | 48>(48);
  const [solarCoverage, setSolarCoverage] = useState<number>(80);
  const [thermalProfile, setThermalProfile] = useState<"familiar" | "intenso">("familiar");

  // 4. Persons slider for Solar Thermal sizing (Default is 4 people)
  const [personasCount, setPersonasCount] = useState<number>(4);

  // Thermal specific questions states
  const [waterHardness, setWaterHardness] = useState<"blanda" | "dura">("blanda");
  const [hasMinors, setHasMinors] = useState<boolean>(false);
  const [hasPressurizer, setHasPressurizer] = useState<boolean>(false);

  // On-Grid Specific State (Starts empty, with a light example placeholder)
  const [anualConsumptionKwh, setAnualConsumptionKwh] = useState<number | "">("");
  const [placeholderValue, setPlaceholderValue] = useState<number>(3605);
  const [gridPhaseType, setGridPhaseType] = useState<"monofasica" | "trifasica">("monofasica");

  // 5. Custom load array list for autonomous (starts empty, customized by applicant)
  const [appliances, setAppliances] = useState<CustomAppliance[]>([]);

  // 9. Dimensioned status per technology (Starts false until the CTA button is clicked)
  const [dimensioned, setDimensioned] = useState<{
    "on-grid": boolean;
    "off-grid": boolean;
    "thermal": boolean;
  }>({
    "on-grid": false,
    "off-grid": false,
    "thermal": false
  });

  // Reset dimensioned states back to false whenever the user changes key calculations inputs
  useEffect(() => {
    setDimensioned((prev) => ({ ...prev, "on-grid": false }));
  }, [anualConsumptionKwh, solarCoverage]);

  useEffect(() => {
    setDimensioned((prev) => ({ ...prev, "off-grid": false }));
  }, [appliances, autonomyDays, batteryType, batteryVoltage]);

  useEffect(() => {
    setDimensioned((prev) => ({ ...prev, "thermal": false }));
  }, [personasCount, waterHardness, hasMinors, hasPressurizer, thermalProfile]);

  // Clear alert if they completely filled the form
  useEffect(() => {
    if (isApplicantDataComplete) {
      setShowIncompleteAlert(false);
    }
  }, [isApplicantDataComplete]);

  const handleResetToPointZero = () => {
    setDomicilio({
      nombre: "",
      apellido: "",
      domicilio: "",
      localidad: "",
      provincia: "",
      pais: "Argentina"
    });
    setLastDimensionedDomicilio(null);
    setTechType(null);
    setAnualConsumptionKwh("");
    setPlaceholderValue(3605);
    setGridPhaseType("monofasica");
    setAppliances([]);
    setAutonomyDays(2);
    setBatteryType("gel");
    setBatteryVoltage(48);
    setSolarCoverage(80);
    setThermalProfile("familiar");
    setPersonasCount(4);
    setWaterHardness("blanda");
    setHasMinors(false);
    setHasPressurizer(false);
    setDimensioned({
      "on-grid": false,
      "off-grid": false,
      "thermal": false
    });
    setShowIncompleteAlert(false);

    // Reset Premium White Label states
    setWhiteLabelEnabled(false);
    setWhiteLabelCompanyName("");
    setWhiteLabelEmail("");
    setWhiteLabelWhatsApp("");
    setWhiteLabelLogo("");
    try {
      localStorage.removeItem("rederar_wl_logo");
    } catch (e) {}
  };

  // Trial limits and unlock mechanism
  const [dimensionCounts, setDimensionCounts] = useState<{ "on-grid": number; "off-grid": number; "thermal": number }>(() => {
    try {
      const saved = localStorage.getItem("rederar_dimension_counts");
      return saved ? JSON.parse(saved) : { "on-grid": 0, "off-grid": 0, "thermal": 0 };
    } catch {
      return { "on-grid": 0, "off-grid": 0, "thermal": 0 };
    }
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("rederar_unlocked") === "true";
    } catch {
      return false;
    }
  });

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [pendingTechType, setPendingTechType] = useState<"on-grid" | "off-grid" | "thermal" | null>(null);
  const [unlockCodeInput, setUnlockCodeInput] = useState("");
  const [unlockError, setUnlockError] = useState("");

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("rederar_failed_attempts");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem("rederar_lockout_until");
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const [lockoutSecLeft, setLockoutSecLeft] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_failed_attempts", failedAttempts.toString());
    } catch (e) {
      console.error(e);
    }
  }, [failedAttempts]);

  useEffect(() => {
    try {
      if (lockoutUntil) {
        localStorage.setItem("rederar_lockout_until", lockoutUntil.toString());
      } else {
        localStorage.removeItem("rederar_lockout_until");
      }
    } catch (e) {
      console.error(e);
    }
  }, [lockoutUntil]);

  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutSecLeft(0);
      return;
    }
    const updateTime = () => {
      const diff = lockoutUntil - Date.now();
      if (diff <= 0) {
        setLockoutUntil(null);
        setLockoutSecLeft(0);
      } else {
        setLockoutSecLeft(Math.ceil(diff / 1000));
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [lockoutUntil]);

  const formatLockoutTime = (seconds: number) => {
    if (seconds <= 0) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(" ");
  };

  // Credits and offline activation tracking
  const [credits, setCredits] = useState<{ amount: number; expiresAt: number | null }>(() => {
    try {
      const saved = localStorage.getItem("rederar_credits");
      return saved ? JSON.parse(saved) : { amount: 0, expiresAt: null };
    } catch {
      return { amount: 0, expiresAt: null };
    }
  });

  const [usedCodes, setUsedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("rederar_used_codes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPack, setAdminPack] = useState<string>("10C");
  const [adminGeneratedCode, setAdminGeneratedCode] = useState<string>("");
  const [adminCopied, setAdminCopied] = useState<boolean>(false);

  // States for checkout & manual/automatic payments
  const [activeUnlockTab, setActiveUnlockTab] = useState<"activate" | "buy">("activate");
  const [checkoutPack, setCheckoutPack] = useState<"3C" | "10C" | "20C" | "100C">("10C");
  const [checkoutRegion, setCheckoutRegion] = useState<"argentina" | "exterior">("argentina");
  const [checkoutMethod, setCheckoutMethod] = useState<"argentina" | "freemius" | "internacional" | "cripto" | null>("argentina");
  const isArgentina = (domicilio.pais || "Argentina").toLowerCase().trim() === "argentina";

  useEffect(() => {
    if (!isArgentina) {
      setCheckoutRegion("exterior");
      setCheckoutMethod("internacional");
    } else {
      setCheckoutRegion("argentina");
      setCheckoutMethod("argentina");
    }
  }, [domicilio.pais, isArgentina]);

  // Cryptocurrency payment states
  const [cryptoSubTab, setCryptoSubTab] = useState<"direct" | "blockchain">("direct");
  const [cryptoChain, setCryptoChain] = useState<"polygon" | "bsc">("polygon");
  const [cryptoTxHashInput, setCryptoTxHashInput] = useState<string>("");
  const [isVerifyingCrypto, setIsVerifyingCrypto] = useState<boolean>(false);
  const [cryptoVerificationError, setCryptoVerificationError] = useState<string | null>(null);
  const [showInlineTxHashGuide, setShowInlineTxHashGuide] = useState<boolean>(false);
  const [copiedWalletAddress, setCopiedWalletAddress] = useState<boolean>(false);
  const [cryptoDirectTag, setCryptoDirectTag] = useState<string>("");
  const [cryptoDirectApp, setCryptoDirectApp] = useState<"lemon" | "belo">("lemon");
  const [isVerifyingDirectTag, setIsVerifyingDirectTag] = useState<boolean>(false);
  const [cryptoDirectError, setCryptoDirectError] = useState<string | null>(null);
  const [dolarRate, setDolarRate] = useState<number>(1450);
  const [transactionId, setTransactionId] = useState<string>("");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [generatedCheckoutCode, setGeneratedCheckoutCode] = useState<string>("");
  const [copiedCheckoutCode, setCopiedCheckoutCode] = useState<boolean>(false);

  // Mercado Pago automatic payment states
  const [isRedirectingMp, setIsRedirectingMp] = useState<boolean>(false);
  const [mpRedirectError, setMpRedirectError] = useState<string | null>(null);
  const [mpPaymentUrl, setMpPaymentUrl] = useState<string | null>(null);
  const [mpVerifying, setMpVerifying] = useState<boolean>(false);
  const [mpVerifyingError, setMpVerifyingError] = useState<string | null>(null);

  // PayPal / Takenos automatic payment states (International)
  const [isRedirectingPaypal, setIsRedirectingPaypal] = useState<boolean>(false);
  const [paypalRedirectError, setPaypalRedirectError] = useState<string | null>(null);
  const [paypalPaymentUrl, setPaypalPaymentUrl] = useState<string | null>(null);
  const [paypalVerifying, setPaypalVerifying] = useState<boolean>(false);
  const [paypalVerifyingError, setPaypalVerifyingError] = useState<string | null>(null);

  // Takenos automatic payment states (International Cards)
  const [isRedirectingTakenos, setIsRedirectingTakenos] = useState<boolean>(false);
  const [takenosRedirectError, setTakenosRedirectError] = useState<string | null>(null);
  const [takenosPaymentUrl, setTakenosPaymentUrl] = useState<string | null>(null);
  const [takenosVerifying, setTakenosVerifying] = useState<boolean>(false);
  const [takenosVerifyingError, setTakenosVerifyingError] = useState<string | null>(null);

  // Freemius automatic payment states (Merchant of Record / Licencias & Suscripciones)
  const [isRedirectingFreemius, setIsRedirectingFreemius] = useState<boolean>(false);
  const [freemiusRedirectError, setFreemiusRedirectError] = useState<string | null>(null);
  const [freemiusPaymentUrl, setFreemiusPaymentUrl] = useState<string | null>(null);
  const [freemiusVerifying, setFreemiusVerifying] = useState<boolean>(false);
  const [freemiusVerifyingError, setFreemiusVerifyingError] = useState<string | null>(null);
  const [freemiusSubTab, setFreemiusSubTab] = useState<"card" | "paypal" | "crypto">("card");
  const [fmCardHolder, setFmCardHolder] = useState<string>("");
  const [fmCardNumber, setFmCardNumber] = useState<string>("");
  const [fmCardExpiry, setFmCardExpiry] = useState<string>("");
  const [fmCardCvc, setFmCardCvc] = useState<string>("");
  const [fmPaypalEmail, setFmPaypalEmail] = useState<string>("");

  // --- CALCULADORA DE COMISIONES E IMPUESTOS ARGENTINA ---
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcSelectedTab, setCalcSelectedTab] = useState<"airtm_usdt" | "takenos">("airtm_usdt");
  const [calcMonotributoCat, setCalcMonotributoCat] = useState<string>("B");
  const [showInvoicingGuide, setShowInvoicingGuide] = useState<boolean>(false);

  // --- PREMIUM WHITE LABEL STATES ---
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("rederar_wl_enabled") === "true";
    } catch {
      return false;
    }
  });
  const [whiteLabelCompanyName, setWhiteLabelCompanyName] = useState<string>(() => {
    try {
      return localStorage.getItem("rederar_wl_company_name") || "";
    } catch {
      return "";
    }
  });
  const [whiteLabelEmail, setWhiteLabelEmail] = useState<string>(() => {
    try {
      return localStorage.getItem("rederar_wl_email") || "";
    } catch {
      return "";
    }
  });
  const [whiteLabelWhatsApp, setWhiteLabelWhatsApp] = useState<string>(() => {
    try {
      return localStorage.getItem("rederar_wl_whatsapp") || "";
    } catch {
      return "";
    }
  });
  const [whiteLabelLogo, setWhiteLabelLogo] = useState<string>(() => {
    try {
      return localStorage.getItem("rederar_wl_logo") || "";
    } catch {
      return "";
    }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Automatically enable Marca Blanca when uploading a logo
    setWhiteLabelEnabled(true);
    try {
      localStorage.setItem("rederar_wl_enabled", "true");
    } catch (e) {}

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 500;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";
            const optimizedBase64 = isJpeg
              ? canvas.toDataURL("image/jpeg", 0.85)
              : canvas.toDataURL("image/png");

            setWhiteLabelLogo(optimizedBase64);
            localStorage.setItem("rederar_wl_logo", optimizedBase64);
          } else {
            const rawBase64 = event.target?.result as string;
            setWhiteLabelLogo(rawBase64);
            localStorage.setItem("rederar_wl_logo", rawBase64);
          }
        } catch (err) {
          const rawBase64 = event.target?.result as string;
          setWhiteLabelLogo(rawBase64);
          try {
            localStorage.setItem("rederar_wl_logo", rawBase64);
          } catch (e) {}
        }
      };
      img.onerror = () => {
        const rawBase64 = event.target?.result as string;
        if (rawBase64) {
          setWhiteLabelLogo(rawBase64);
          try {
            localStorage.setItem("rederar_wl_logo", rawBase64);
          } catch (e) {}
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogoClear = () => {
    setWhiteLabelLogo("");
    try {
      localStorage.removeItem("rederar_wl_logo");
    } catch (err) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem("rederar_wl_enabled", whiteLabelEnabled ? "true" : "false");
    } catch (e) {}
  }, [whiteLabelEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_wl_company_name", whiteLabelCompanyName);
    } catch (e) {}
  }, [whiteLabelCompanyName]);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_wl_email", whiteLabelEmail);
    } catch (e) {}
  }, [whiteLabelEmail]);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_wl_whatsapp", whiteLabelWhatsApp);
    } catch (e) {}
  }, [whiteLabelWhatsApp]);

  // --- MERCADO PAGO AUTOMATIC PAYMENT REDIRECT CHECKER ---
  useEffect(() => {
    const checkMpRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const mpSuccess = params.get("mp_success");
      const preferenceId = params.get("preference_id");
      const pack = params.get("pack");

      if (mpSuccess === "true" && preferenceId && pack) {
        // Double-check if we have already verified this preference to prevent duplicates/loops
        let processedPrefs: string[] = [];
        try {
          const saved = localStorage.getItem("rederar_processed_mp_preferences");
          processedPrefs = saved ? JSON.parse(saved) : [];
        } catch (e) {}

        if (processedPrefs.includes(preferenceId)) {
          // Already processed, clean URL and exit
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        // Open unlock modal and start verification process automatically
        setShowUnlockModal(true);
        setMpVerifying(true);
        setMpVerifyingError(null);

        try {
          const response = await fetch("/api/mp/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ preference_id: preferenceId, pack })
          });

          const data = await response.json();

          if (response.ok && data.status === "approved" && data.code) {
            // Apply credits
            const allowedPacks: { [key: string]: number } = {
              "3C": 3,
              "10C": 10,
              "20C": 20,
              "100C": 100
            };
            const creditsToAdd = allowedPacks[pack];
            if (creditsToAdd) {
              const durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
              const expiryDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

              setCredits((prevCredits) => {
                const newCredits = {
                  amount: prevCredits.amount + creditsToAdd,
                  expiresAt: expiryDate
                };
                localStorage.setItem("rederar_credits", JSON.stringify(newCredits));
                return newCredits;
              });

              setUsedCodes((prevUsed) => {
                const updatedUsed = [...prevUsed, data.code];
                localStorage.setItem("rederar_used_codes", JSON.stringify(updatedUsed));
                return updatedUsed;
              });

              // Also show code as processed
              processedPrefs.push(preferenceId);
              localStorage.setItem("rederar_processed_mp_preferences", JSON.stringify(processedPrefs));

              // Instantly close checkout modal and return user to system
              setShowUnlockModal(false);
              if (pendingTechType) {
                setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
                setPendingTechType(null);
              }

              alert(`⚡ ¡Pago en Pesos acreditado automáticamente! Se han sumado ${creditsToAdd} dimensionamientos con vigencia de ${durationDays} días.`);
            }

            // Clean the URL parameters so they don't trigger again on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setMpVerifyingError(data.error || "No se pudo verificar el estado de la transacción.");
          }
        } catch (error: any) {
          console.error("Error verifying payment:", error);
          setMpVerifyingError("Ocurrió un error al contactar al servidor para validar el pago.");
        } finally {
          setMpVerifying(false);
        }
      }
    };

    checkMpRedirect();
  }, []);

  // --- PAYPAL AUTOMATIC PAYMENT REDIRECT CHECKER ---
  useEffect(() => {
    const checkPaypalRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const paypalSuccess = params.get("paypal_success");
      const sessionId = params.get("session_id");
      const pack = params.get("pack");

      if (paypalSuccess === "true" && sessionId && pack) {
        // Double-check if we have already verified this session to prevent duplicates/loops
        let processedSessions: string[] = [];
        try {
          const saved = localStorage.getItem("rederar_processed_paypal_sessions");
          processedSessions = saved ? JSON.parse(saved) : [];
        } catch (e) {}

        if (processedSessions.includes(sessionId)) {
          // Already processed, clean URL and exit
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        // Open unlock modal and start verification process automatically
        setShowUnlockModal(true);
        setPaypalVerifying(true);
        setPaypalVerifyingError(null);

        try {
          const response = await fetch("/api/paypal/verify-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ session_id: sessionId, pack })
          });

          const data = await response.json();

          if (response.ok && data.status === "approved" && data.code) {
            // Apply credits
            const allowedPacks: { [key: string]: number } = {
              "3C": 3,
              "10C": 10,
              "20C": 20,
              "100C": 100
            };
            const creditsToAdd = allowedPacks[pack];
            if (creditsToAdd) {
              const durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
              const expiryDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

              setCredits((prevCredits) => {
                const newCredits = {
                  amount: prevCredits.amount + creditsToAdd,
                  expiresAt: expiryDate
                };
                localStorage.setItem("rederar_credits", JSON.stringify(newCredits));
                return newCredits;
              });

              setUsedCodes((prevUsed) => {
                const updatedUsed = [...prevUsed, data.code];
                localStorage.setItem("rederar_used_codes", JSON.stringify(updatedUsed));
                return updatedUsed;
              });

              // Also show code as processed
              processedSessions.push(sessionId);
              localStorage.setItem("rederar_processed_paypal_sessions", JSON.stringify(processedSessions));

              // Instantly close checkout modal and return user to system
              setShowUnlockModal(false);
              if (pendingTechType) {
                setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
                setPendingTechType(null);
              }

              alert(`⚡ ¡Pago vía PayPal acreditado automáticamente! Se han sumado ${creditsToAdd} dimensionamientos con vigencia de ${durationDays} días.`);
            }

            // Clean the URL parameters so they don't trigger again on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setPaypalVerifyingError(data.error || "No se pudo verificar el estado de la transacción de PayPal.");
          }
        } catch (error: any) {
          console.error("Error verifying PayPal payment:", error);
          setPaypalVerifyingError("Ocurrió un error al contactar al servidor para validar el pago.");
        } finally {
          setPaypalVerifying(false);
        }
      }
    };

    checkPaypalRedirect();
  }, []);

  // --- TAKENOS AUTOMATIC PAYMENT REDIRECT CHECKER ---
  useEffect(() => {
    const checkTakenosRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const takenosSuccess = params.get("takenos_success");
      const sessionId = params.get("session_id");
      const pack = params.get("pack");

      if (takenosSuccess === "true" && sessionId && pack) {
        let processedSessions: string[] = [];
        try {
          const saved = localStorage.getItem("rederar_processed_takenos_sessions");
          processedSessions = saved ? JSON.parse(saved) : [];
        } catch (e) {}

        if (processedSessions.includes(sessionId)) {
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        setShowUnlockModal(true);
        setTakenosVerifying(true);
        setTakenosVerifyingError(null);

        try {
          const response = await fetch("/api/takenos/verify-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ session_id: sessionId, pack })
          });

          const data = await response.json();

          if (response.ok && data.status === "approved" && data.code) {
            const allowedPacks: { [key: string]: number } = {
              "3C": 3,
              "10C": 10,
              "20C": 20,
              "100C": 100
            };
            const creditsToAdd = allowedPacks[pack];
            if (creditsToAdd) {
              const durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
              const expiryDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

              setCredits((prevCredits) => {
                const newCredits = {
                  amount: prevCredits.amount + creditsToAdd,
                  expiresAt: expiryDate
                };
                localStorage.setItem("rederar_credits", JSON.stringify(newCredits));
                return newCredits;
              });

              setUsedCodes((prevUsed) => {
                const updatedUsed = [...prevUsed, data.code];
                localStorage.setItem("rederar_used_codes", JSON.stringify(updatedUsed));
                return updatedUsed;
              });

              processedSessions.push(sessionId);
              localStorage.setItem("rederar_processed_takenos_sessions", JSON.stringify(processedSessions));

              // Instantly close checkout modal and return user to system
              setShowUnlockModal(false);
              if (pendingTechType) {
                setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
                setPendingTechType(null);
              }

              alert(`⚡ ¡Pago Internacional acreditado automáticamente! Se han sumado ${creditsToAdd} dimensionamientos con vigencia de ${durationDays} días.`);
            }

            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setTakenosVerifyingError(data.error || "No se pudo verificar el estado de la transacción de Takenos.");
          }
        } catch (error: any) {
          console.error("Error verifying Takenos payment:", error);
          setTakenosVerifyingError("Ocurrió un error al contactar al servidor para validar el pago.");
        } finally {
          setTakenosVerifying(false);
        }
      }
    };

    checkTakenosRedirect();
  }, []);

  // --- FREEMIUS AUTOMATIC PAYMENT REDIRECT CHECKER ---
  useEffect(() => {
    const checkFreemiusRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const freemiusSuccess = params.get("freemius_success");
      const sessionId = params.get("session_id");
      const pack = params.get("pack");

      if (freemiusSuccess === "true" && sessionId && pack) {
        let processedSessions: string[] = [];
        try {
          const saved = localStorage.getItem("rederar_processed_freemius_sessions");
          processedSessions = saved ? JSON.parse(saved) : [];
        } catch (e) {}

        if (processedSessions.includes(sessionId)) {
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        setShowUnlockModal(true);
        setFreemiusVerifying(true);
        setFreemiusVerifyingError(null);

        try {
          const response = await fetch("/api/freemius/verify-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ session_id: sessionId, pack })
          });

          const data = await response.json();

          if (response.ok && data.status === "approved" && data.code) {
            const allowedPacks: { [key: string]: number } = {
              "3C": 3,
              "10C": 10,
              "20C": 20,
              "100C": 100
            };
            const creditsToAdd = allowedPacks[pack];
            if (creditsToAdd) {
              const durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
              const expiryDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

              setCredits((prevCredits) => {
                const newCredits = {
                  amount: prevCredits.amount + creditsToAdd,
                  expiresAt: expiryDate
                };
                localStorage.setItem("rederar_credits", JSON.stringify(newCredits));
                return newCredits;
              });

              setUsedCodes((prevUsed) => {
                const updatedUsed = [...prevUsed, data.code];
                localStorage.setItem("rederar_used_codes", JSON.stringify(updatedUsed));
                return updatedUsed;
              });

              processedSessions.push(sessionId);
              localStorage.setItem("rederar_processed_freemius_sessions", JSON.stringify(processedSessions));

              // Instantly close checkout modal and return user to system
              setShowUnlockModal(false);
              if (pendingTechType) {
                setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
                setPendingTechType(null);
              }

              alert(`⚡ ¡Pago vía Freemius acreditado automáticamente! Se han sumado ${creditsToAdd} dimensionamientos con licencia activa por ${durationDays} días.`);
            }

            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setFreemiusVerifyingError(data.error || "No se pudo verificar el estado de la transacción de Freemius.");
          }
        } catch (error: any) {
          console.error("Error verifying Freemius payment:", error);
          setFreemiusVerifyingError("Ocurrió un error al contactar al servidor para validar la licencia de Freemius.");
        } finally {
          setFreemiusVerifying(false);
        }
      }
    };

    checkFreemiusRedirect();
  }, []);


  // --- FETCH CURRENT DOLAR BLUE RATE FROM SERVER ---
  useEffect(() => {
    const fetchDolarRate = async () => {
      try {
        const response = await fetch("/api/dolar-rate");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.rate === "number" && data.rate > 0) {
            setDolarRate(data.rate);
            console.log(`[Dólar] Cotización del servidor: $${data.rate} ARS`);
          }
        }
      } catch (error) {
        console.error("Error fetching dollar rate:", error);
      }
    };

    fetchDolarRate();
  }, []);


  // --- SAVED PROJECTS (HISTORIAL) STATES ---
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem("rederar_saved_projects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveProject = (projectName: string) => {
    if (!projectName.trim()) {
      alert("Por favor ingrese un nombre para guardar la cotización.");
      return;
    }
    const currentDomicilio = lastDimensionedDomicilio || domicilio;
    const newProject: SavedProject = {
      id: "PRJ-" + Date.now(),
      name: projectName,
      timestamp: Date.now(),
      domicilio: { ...currentDomicilio },
      techType: techType!,
      hsp,
      appliances: [...appliances],
      personasCount,
      autonomyDays,
      batteryType,
      batteryVoltage,
      solarCoverage,
      thermalProfile,
      waterHardness,
      hasMinors,
      hasPressurizer,
      anualConsumptionKwh,
      gridPhaseType
    };

    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    try {
      localStorage.setItem("rederar_saved_projects", JSON.stringify(updated));
      alert(`💾 ¡Cotización "${projectName}" guardada con éxito en su historial local!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadProject = (project: SavedProject) => {
    setDomicilio({ ...project.domicilio });
    setLastDimensionedDomicilio({ ...project.domicilio });
    setTechType(project.techType);
    setAppliances([...project.appliances]);
    setPersonasCount(project.personasCount);
    setAutonomyDays(project.autonomyDays);
    setBatteryType(project.batteryType);
    setBatteryVoltage(project.batteryVoltage);
    setSolarCoverage(project.solarCoverage);
    setThermalProfile(project.thermalProfile);
    setWaterHardness(project.waterHardness);
    setHasMinors(project.hasMinors);
    setHasPressurizer(project.hasPressurizer);
    setAnualConsumptionKwh(project.anualConsumptionKwh);
    setGridPhaseType(project.gridPhaseType);
    setDimensioned({
      "on-grid": project.techType === "on-grid",
      "off-grid": project.techType === "off-grid",
      "thermal": project.techType === "thermal"
    });
    alert(`📂 Cotización "${project.name}" cargada y recalculada con éxito.`);
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    try {
      localStorage.setItem("rederar_saved_projects", JSON.stringify(updated));
    } catch (err) {}
  };

  // Helper offline cryptographic checksum generator
  const generateCodeHash = (pack: string, serial: string): string => {
    const salt = "GUSTAVO_SOLAR_2026_REDERAR_SUPER_SECURE_SALT";
    const input = `${pack}-${serial}-${salt}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const positiveHash = Math.abs(hash);
    const hex = positiveHash.toString(16).toUpperCase();
    return hex.substring(0, 4).padStart(4, "X");
  };

  const generateRandomSerial = (length: number = 6): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateAdminCode = () => {
    const serial = generateRandomSerial(6);
    const hash = generateCodeHash(adminPack, serial);
    const code = `RED-${adminPack}-${serial}-${hash}`;
    setAdminGeneratedCode(code);
    setAdminCopied(false);
  };

  const handleCopyAdminCode = () => {
    if (!adminGeneratedCode) return;
    navigator.clipboard.writeText(adminGeneratedCode);
    setAdminCopied(true);
    setTimeout(() => setAdminCopied(false), 2000);
  };

  const handleMercadoPagoCheckout = async () => {
    setIsRedirectingMp(true);
    setMpRedirectError(null);
    setMpPaymentUrl(null);

    // Synchronously open blank target window on user gesture to prevent browser popup blockers
    const paymentWindow = window.open("about:blank", "_blank");
    if (paymentWindow) {
      paymentWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Procesando Pago...</title></head>
          <body style="background:#09090b; color:#38bdf8; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="text-align:center; padding:20px;">
              <h2 style="margin-bottom:8px; font-size:18px;">Conectando con la plataforma de pago segura...</h2>
              <p style="color:#a1a1aa; font-size:13px;">Por favor aguarde un instante...</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const currentAppUrl = window.location.origin;

      const response = await fetch("/api/mp/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pack: checkoutPack,
          appUrl: currentAppUrl
        })
      });

      const data = await response.json();

      if (data.init_point) {
        setMpPaymentUrl(data.init_point);
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.location.href = data.init_point;
        } else {
          window.open(data.init_point, "_blank");
        }
        setIsRedirectingMp(false);
      } else {
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
        setMpRedirectError(data.error || "No se pudo generar el enlace de pago. Intente nuevamente.");
        setIsRedirectingMp(false);
      }
    } catch (err: any) {
      console.error("Error creating preference:", err);
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
      setMpRedirectError("Error al conectar con el servidor de pagos. Intente de nuevo más tarde.");
      setIsRedirectingMp(false);
    }
  };

  const handlePaypalCheckout = async () => {
    setIsRedirectingPaypal(true);
    setPaypalRedirectError(null);
    setPaypalPaymentUrl(null);

    const paymentWindow = window.open("about:blank", "_blank");
    if (paymentWindow) {
      paymentWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Procesando Pago PayPal...</title></head>
          <body style="background:#09090b; color:#60a5fa; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="text-align:center; padding:20px;">
              <h2 style="margin-bottom:8px; font-size:18px;">Conectando con PayPal...</h2>
              <p style="color:#a1a1aa; font-size:13px;">Por favor aguarde un instante...</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const currentAppUrl = window.location.origin;

      const response = await fetch("/api/paypal/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pack: checkoutPack,
          appUrl: currentAppUrl
        })
      });

      const data = await response.json();

      if (data.init_point) {
        setPaypalPaymentUrl(data.init_point);
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.location.href = data.init_point;
        } else {
          window.open(data.init_point, "_blank");
        }
        setIsRedirectingPaypal(false);
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        setPaypalRedirectError(data.error || "No se pudo generar el enlace de pago de PayPal. Intente nuevamente.");
        setIsRedirectingPaypal(false);
      }
    } catch (err: any) {
      console.error("Error creating PayPal session:", err);
      if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
      setPaypalRedirectError("Error al conectar con el servidor de pagos internacional. Intente de nuevo más tarde.");
      setIsRedirectingPaypal(false);
    }
  };

  const handleTakenosCheckout = async () => {
    setIsRedirectingTakenos(true);
    setTakenosRedirectError(null);
    setTakenosPaymentUrl(null);

    const paymentWindow = window.open("about:blank", "_blank");

    try {
      const currentAppUrl = window.location.origin;

      const response = await fetch("/api/takenos/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pack: checkoutPack,
          appUrl: currentAppUrl
        })
      });

      const data = await response.json();

      if (data.init_point) {
        setTakenosPaymentUrl(data.init_point);
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.location.href = data.init_point;
        } else {
          window.open(data.init_point, "_blank");
        }
        setIsRedirectingTakenos(false);
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        setTakenosRedirectError(data.error || "No se pudo generar el enlace de pago. Intente nuevamente.");
        setIsRedirectingTakenos(false);
      }
    } catch (err: any) {
      console.error("Error creating session:", err);
      if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
      setTakenosRedirectError("Error al conectar con el servidor de pagos.");
      setIsRedirectingTakenos(false);
    }
  };

  const handleFreemiusCheckout = async () => {
    setIsRedirectingFreemius(true);
    setFreemiusRedirectError(null);
    setFreemiusPaymentUrl(null);

    const paymentWindow = window.open("about:blank", "_blank");
    if (paymentWindow) {
      paymentWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Procesando Pago Internacional...</title></head>
          <body style="background:#09090b; color:#34d399; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="text-align:center; padding:20px;">
              <h2 style="margin-bottom:8px; font-size:18px;">Conectando con la pasarela internacional (USD)...</h2>
              <p style="color:#a1a1aa; font-size:13px;">Por favor aguarde un instante...</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const currentAppUrl = window.location.origin;

      const response = await fetch("/api/freemius/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pack: checkoutPack,
          appUrl: currentAppUrl
        })
      });

      const data = await response.json();

      if (data.init_point) {
        setFreemiusPaymentUrl(data.init_point);
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.location.href = data.init_point;
        } else {
          window.open(data.init_point, "_blank");
        }
        setIsRedirectingFreemius(false);
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        setFreemiusRedirectError(data.error || "No se pudo generar el enlace de pago internacional. Intente nuevamente.");
        setIsRedirectingFreemius(false);
      }
    } catch (err: any) {
      console.error("Error creating Freemius session:", err);
      if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
      setFreemiusRedirectError("Error al conectar con el servidor de pagos internacional.");
      setIsRedirectingFreemius(false);
    }
  };

  const handleSubmitManualPayment = () => {
    if (checkoutMethod === "argentina" && !transactionId.trim()) {
      alert("Por favor, ingrese el ID de la transacción o número de comprobante para poder verificarla.");
      return;
    }
    setIsVerifyingPayment(true);
    setTimeout(() => {
      const serial = generateRandomSerial(6);
      const hash = generateCodeHash(checkoutPack, serial);
      const code = `RED-${checkoutPack}-${serial}-${hash}`;
      setGeneratedCheckoutCode(code);
      setIsVerifyingPayment(false);
      handleApplyGeneratedCode(code);
    }, 2000);
  };

  const handleVerifyCryptoPayment = async () => {
    if (!cryptoTxHashInput.trim()) {
      setCryptoVerificationError("Por favor, ingrese el Hash de Transacción (TxHash) de su envío para poder verificarlo en la blockchain.");
      return;
    }

    setIsVerifyingCrypto(true);
    setCryptoVerificationError(null);

    try {
      const response = await fetch("/api/crypto/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          txHash: cryptoTxHashInput.trim(),
          chain: cryptoChain,
          pack: checkoutPack
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "approved" && data.code) {
        setGeneratedCheckoutCode(data.code);
        handleApplyGeneratedCode(data.code);
      } else {
        setCryptoVerificationError(data.error || "No se pudo verificar el pago cripto.");
      }
    } catch (error: any) {
      console.error("Error verifying crypto payment:", error);
      setCryptoVerificationError("Error al contactar con el servidor de validación de blockchain.");
    } finally {
      setIsVerifyingCrypto(false);
    }
  };

  const handleVerifyDirectTagPayment = async () => {
    if (!cryptoDirectTag.trim()) {
      alert("Por favor, ingrese su Lemon Tag o Belo Username con el que realizó el pago.");
      return;
    }

    setIsVerifyingDirectTag(true);
    setCryptoDirectError(null);

    try {
      const response = await fetch("/api/crypto/verify-tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tag: cryptoDirectTag.trim(),
          walletApp: cryptoDirectApp,
          pack: checkoutPack
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "approved" && data.code) {
        setGeneratedCheckoutCode(data.code);
        handleApplyGeneratedCode(data.code);
      } else {
        setCryptoDirectError(data.error || "No se pudo acreditar el pago con el Tag proporcionado.");
      }
    } catch (error: any) {
      console.error("Error verifying direct tag:", error);
      setCryptoDirectError("Ocurrió un error al contactar al servidor para verificar la transferencia.");
    } finally {
      setIsVerifyingDirectTag(false);
    }
  };

  const handleApplyGeneratedCode = (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    const parts = cleanCode.split("-");
    if (parts.length === 4 && parts[0] === "RED") {
      const pack = parts[1];
      const serial = parts[2];
      const providedHash = parts[3];

      const allowedPacks: { [key: string]: number } = {
        "3C": 3,
        "10C": 10,
        "20C": 20,
        "100C": 100
      };

      const creditsToAdd = allowedPacks[pack];
      if (creditsToAdd) {
        // Save code as used
        const updatedUsed = [...usedCodes, cleanCode];
        setUsedCodes(updatedUsed);
        localStorage.setItem("rederar_used_codes", JSON.stringify(updatedUsed));

        // Determine duration based on pack: 3C = 30 days, 10C = 90 days, 20C = 180 days, 100C = 365 days.
        const durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
        const expiryDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

        // Update credits
        const newCredits = {
          amount: credits.amount + creditsToAdd,
          expiresAt: expiryDate
        };
        setCredits(newCredits);
        localStorage.setItem("rederar_credits", JSON.stringify(newCredits));

        // Clear locks and count
        setShowUnlockModal(false);
        setPendingTechType(null);
        setUnlockCodeInput("");
        setUnlockError("");
        
        // Reset checkout state
        setGeneratedCheckoutCode("");
        setCheckoutMethod(null);
        setTransactionId("");
        
        // Notify
        alert(`⚡ ¡Código activado automáticamente! Se han sumado ${creditsToAdd} dimensionamientos con vigencia de ${durationDays} días.`);
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("rederar_credits", JSON.stringify(credits));
    } catch (e) {
      console.error(e);
    }
  }, [credits]);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_used_codes", JSON.stringify(usedCodes));
    } catch (e) {
      console.error(e);
    }
  }, [usedCodes]);

  useEffect(() => {
    try {
      localStorage.setItem("rederar_dimension_counts", JSON.stringify(dimensionCounts));
    } catch (e) {
      console.error(e);
    }
  }, [dimensionCounts]);

  const handleUnlockSubmit = () => {
    const cleanCode = unlockCodeInput.trim().toUpperCase();
    
    if (!cleanCode) {
      setUnlockError("Por favor ingrese un código.");
      return;
    }

    const isCurrentlyLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

    // List of bypass/master/admin codes
    const isMasterCode = cleanCode === "DESBLOQUEO2026REDERAR" || 
                         cleanCode === "VEKO2026TAVO" || 
                         cleanCode === "RESETPRUEBA" ||
                         cleanCode === "REDERARADMIN2026" ||
                         cleanCode === "ADMIN2026";

    if (isCurrentlyLockedOut && !isMasterCode) {
      setUnlockError(`El ingreso de códigos se encuentra bloqueado por seguridad. Tiempo restante: ${formatLockoutTime(lockoutSecLeft)}.`);
      return;
    }

    // If it's the master administrative override code
    if (cleanCode === "DESBLOQUEO2026REDERAR") {
      setFailedAttempts(0);
      setLockoutUntil(null);
      setUnlockCodeInput("");
      setUnlockError("");
      alert("✅ Bloqueo de dispositivo restablecido con éxito por el administrador.");
      return;
    }

    // Admin code validation - Grant 100 credits directly
    if (cleanCode === "REDERARADMIN2026" || cleanCode === "ADMIN2026") {
      const expiryDate = Date.now() + 365 * 24 * 60 * 60 * 1000;
      const newCredits = {
        amount: credits.amount + 100,
        expiresAt: expiryDate
      };
      setCredits(newCredits);
      localStorage.setItem("rederar_credits", JSON.stringify(newCredits));
      setUnlockCodeInput("");
      setUnlockError("");
      setShowUnlockModal(false);
      alert("⚡ ¡Código de Administración validado! Se han acreditado +100 dimensionamientos.");
      return;
    }

    if (cleanCode === "VEKO2026TAVO") {
      setFailedAttempts(0);
      setLockoutUntil(null);
      setIsUnlocked(true);
      try {
        localStorage.setItem("rederar_unlocked", "true");
      } catch (err) {}
      setShowUnlockModal(false);
      setPendingTechType(null);
      setUnlockCodeInput("");
      setUnlockError("");
      
      // Instantly trigger dimensioned state for the pending type
      if (pendingTechType) {
        setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
        const updatedDomicilio = {
          nombre: domicilio.nombre.trim(),
          apellido: domicilio.apellido.trim(),
          domicilio: domicilio.domicilio.trim(),
          localidad: domicilio.localidad.trim(),
          provincia: domicilio.provincia.trim(),
          pais: domicilio.pais || "Argentina"
        };
        setLastDimensionedDomicilio(updatedDomicilio);
        setDomicilio({
          nombre: "",
          apellido: "",
          domicilio: "",
          localidad: "",
          provincia: "",
          pais: "Argentina"
        });
      }
      alert("✅ ¡Sistema activado con éxito! Se ha habilitado la versión ilimitada.");
      return;
    }
    
    if (cleanCode === "RESETPRUEBA") {
      setFailedAttempts(0);
      setLockoutUntil(null);
      // Secret reset code
      const resetCounts = { "on-grid": 0, "off-grid": 0, "thermal": 0 };
      setDimensionCounts(resetCounts);
      setCredits({ amount: 0, expiresAt: null });
      setUsedCodes([]);
      setIsUnlocked(false);
      try {
        localStorage.setItem("rederar_dimension_counts", JSON.stringify(resetCounts));
        localStorage.removeItem("rederar_credits");
        localStorage.removeItem("rederar_used_codes");
        localStorage.removeItem("rederar_unlocked");
      } catch (err) {}
      setUnlockCodeInput("");
      setUnlockError("");
      setShowUnlockModal(false);
      setPendingTechType(null);
      alert("🔄 Se han restablecido todos los contadores de dimensionamiento de prueba a 0 y borrado créditos.");
      return;
    }

    // Check if it matches the credit package format: RED-[PACK]-[SERIAL]-[HASH]
    const parts = cleanCode.split("-");
    let isCreditPackValid = false;
    let extraCredits = 0;
    let durationDays = 30;
    let newExpiry = 0;

    if (parts.length === 4 && parts[0] === "RED") {
      const pack = parts[1]; // "3C", "10C", "20C", "100C"
      const serial = parts[2]; // 6-character alphanumeric
      const providedHash = parts[3];

      const allowedPacks: { [key: string]: number } = {
        "3C": 3,
        "10C": 10,
        "20C": 20,
        "100C": 100
      };

      if (allowedPacks[pack] && serial.length === 6) {
        const expectedHash = generateCodeHash(pack, serial);
        if (providedHash === expectedHash && !usedCodes.includes(cleanCode)) {
          isCreditPackValid = true;
          extraCredits = allowedPacks[pack];
          durationDays = pack === "3C" ? 15 : pack === "10C" ? 30 : pack === "20C" ? 60 : pack === "100C" ? 90 : 30;
          const expiryDuration = durationDays * 24 * 60 * 60 * 1000;
          newExpiry = Date.now() + expiryDuration;
        }
      }
    }

    if (isCreditPackValid) {
      // Valid credit pack! Reset failed attempts
      setFailedAttempts(0);
      setLockoutUntil(null);

      const newCredits = {
        amount: credits.amount + extraCredits,
        expiresAt: newExpiry
      };
      
      setCredits(newCredits);
      setUsedCodes((prev) => [...prev, cleanCode]);

      setShowUnlockModal(false);
      setUnlockCodeInput("");
      setUnlockError("");
      
      // Instantly trigger dimensioned state for the pending type
      if (pendingTechType) {
        setDimensioned((prev) => ({ ...prev, [pendingTechType]: true }));
        const updatedDomicilio = {
          nombre: domicilio.nombre.trim(),
          apellido: domicilio.apellido.trim(),
          domicilio: domicilio.domicilio.trim(),
          localidad: domicilio.localidad.trim(),
          provincia: domicilio.provincia.trim(),
          pais: domicilio.pais || "Argentina"
        };
        setLastDimensionedDomicilio(updatedDomicilio);
        setDomicilio({
          nombre: "",
          apellido: "",
          domicilio: "",
          localidad: "",
          provincia: "",
          pais: "Argentina"
        });
      }
      setPendingTechType(null);

      alert(`✅ ¡Paquete de créditos cargado con éxito!\nSe sumaron ${extraCredits} dimensionamientos. Vence el ${new Date(newExpiry).toLocaleDateString("es-AR")} (Vigencia: ${durationDays} días).`);
      return;
    }

    // If it gets here, the attempt is incorrect and has failed
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    let lockoutMinutes = 0;
    let lockoutErrorMsg = "";

    if (nextAttempts === 1) {
      lockoutErrorMsg = "Código inválido (1.er intento fallido). ADVERTENCIA: Para evitar fraudes, el sistema aplicará bloqueos progresivos automáticos de hardware si ingresa más códigos incorrectos: 15 minutos en el 2.º intento fallido, 4 horas en el 3.º, y 72 horas a partir del 4.º intento en adelante.";
    } else if (nextAttempts === 2) {
      lockoutMinutes = 15;
      lockoutErrorMsg = "Su dispositivo ha sido bloqueado temporalmente por 15 minutos debido al ingreso de código incorrecto (2.º intento fallido). De acuerdo con los Términos y Condiciones, el próximo intento incorrecto resultará en un bloqueo de 4 horas.";
    } else if (nextAttempts === 3) {
      lockoutMinutes = 4 * 60; // 4 hours
      lockoutErrorMsg = "Su dispositivo ha sido bloqueado temporalmente por 4 horas debido al ingreso de código incorrecto (3.er intento fallido). El próximo intento incorrecto resultará en un bloqueo de 72 horas.";
    } else {
      lockoutMinutes = 72 * 60; // 72 hours
      lockoutErrorMsg = "Su dispositivo ha sido bloqueado temporalmente por 72 horas por motivos de seguridad (4.º intento fallido o posterior). Deberá aguardar a que expire el plazo de bloqueo automático.";
    }

    if (lockoutMinutes > 0) {
      const until = Date.now() + lockoutMinutes * 60 * 1000;
      setLockoutUntil(until);
    }

    setUnlockError(lockoutErrorMsg);
  };

  const handleTechTypeChange = (type: "on-grid" | "off-grid" | "thermal" | null) => {
    setTechType(type);
    if (type !== null && !isApplicantDataComplete) {
      setShowIncompleteAlert(true);
    }
  };

  // 6. Modal Open/Close states
  const [isReporteOpen, setIsReporteOpen] = useState(false);
  const [isGalerioObraOpen, setIsGalerioObraOpen] = useState(false);
  const [isPresupuestoOpen, setIsPresupuestoOpen] = useState(false);

  // 7. Dynamic HSP derived state
  const [hsp, setHsp] = useState<number>(4.2); // Default is Entre Rios

  // Dynamic evaluation of HSP based on active country and province/state selection
  useEffect(() => {
    const countryName = lastDimensionedDomicilio?.pais || domicilio.pais || "Argentina";
    const provName = lastDimensionedDomicilio?.provincia || domicilio.provincia;
    
    const countryData = COUNTRIES_DATA.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    
    if (countryData) {
      const selectedProv = countryData.provinces.find(
        (p) => p.name.toLowerCase() === provName.toLowerCase()
      );
      if (selectedProv) {
        setHsp(selectedProv.hsp);
        return;
      }
    }
    
    // Fallback search across all countries if country selection is not fully set or matches
    for (const c of COUNTRIES_DATA) {
      const selectedProv = c.provinces.find(
        (p) => p.name.toLowerCase() === provName.toLowerCase()
      );
      if (selectedProv) {
        setHsp(selectedProv.hsp);
        return;
      }
    }
    
    setHsp(4.2); // Default fallback
  }, [domicilio.provincia, domicilio.pais, lastDimensionedDomicilio]);

  // 8. Run calculations dynamically through our utility engine
  const sizing = calculateSolarSizing(
    appliances,
    autonomyDays,
    hsp,
    techType,
    personasCount,
    anualConsumptionKwh || placeholderValue,
    gridPhaseType,
    waterHardness,
    hasMinors,
    hasPressurizer,
    batteryType,
    batteryVoltage,
    solarCoverage,
    thermalProfile,
    domicilio.pais || "Argentina",
    domicilio.provincia || ""
  );

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col font-sans selection:bg-amber-500/30 selection:text-white overflow-hidden">
      
      {/* WRAPPER TO HIDE MAIN APP CONTENTS WHEN UNLOCK MODAL IS ACTIVE TO PREVENT BLEEDING OR OVERLAPPING */}
      <div className={`h-full w-full flex flex-col overflow-hidden ${showUnlockModal ? "hidden" : ""}`}>
        {/* HEADER SECTION - Completely Centered Style with larger logo */}
      <header className="bg-black border-b-2 border-amber-500 px-3 sm:px-6 py-2 flex flex-row items-center justify-center shrink-0 z-40 shadow-sm w-full relative min-h-[85px]">
        
        {/* Logo and Title Group Centered */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 max-w-4xl w-full pr-28 sm:pr-36 pl-2 sm:pl-0">
          
          {/* Logo - left side of header title */}
          <button
            onClick={() => setShowLogoZoomModal(true)}
            className="shrink-0 flex items-center justify-center w-[75px] sm:w-[95px] h-[55px] sm:h-[65px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none relative group"
            title={getTranslation("tocar_ampliar_logo", domicilio.pais)}
            id="btn_header_logo_zoom"
          >
            <RederarLogo className="w-full h-full" />
            <div className="absolute inset-0 bg-amber-500/5 rounded-2xl transition-colors" />
          </button>
 
          {/* Center Column: Titles and Badge */}
          <div className="flex flex-col items-center text-center">
            <span className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-yellow-400 font-sans leading-tight">
              {getTranslation("header_title", domicilio.pais)}
            </span>
            
            <div className="mt-0.5 font-black text-[#25D366] text-[9px] sm:text-xs uppercase tracking-widest leading-tight">
              {getTranslation("header_subtitle", domicilio.pais)}
            </div>

            <p className="text-[8px] sm:text-[10px] text-amber-500 uppercase tracking-widest font-mono font-black mt-0.5 leading-tight">
              {getTranslation("header_tagline", domicilio.pais)}
            </p>

            {/* Dynamic Subscription / Trial Status Badge */}
            <div className="mt-1 flex items-center justify-center">
              {isUnlocked ? (
                <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-black border border-emerald-400 text-[8px] sm:text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider animate-pulse flex items-center gap-1 sm:gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {getTranslation("trial_badge_premium", domicilio.pais)}
                </span>
              ) : credits.amount > 0 ? (
                <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-black border border-white text-[8px] sm:text-[10px] font-mono font-black text-white uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {getTranslation("trial_badge_credits", domicilio.pais)
                    .replace("{amount}", credits.amount.toString())
                    .replace("{days}", "60")}
                </span>
              ) : (
                <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-black border border-amber-400 text-[8px] sm:text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {getTranslation("trial_badge_free", domicilio.pais)
                    .replace("{ongrid}", (3 - dimensionCounts["on-grid"]).toString())
                    .replace("{offgrid}", (3 - dimensionCounts["off-grid"]).toString())
                    .replace("{thermal}", (3 - dimensionCounts["thermal"]).toString())}
                </span>
              )}
            </div>
          </div>
 
        </div>

        {/* Manual de Uso Button - 40% smaller compact format with scale transform */}
        <button
          type="button"
          onClick={() => setShowManualModal(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 scale-[0.60] origin-right px-2 py-0.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer z-50 shrink-0 border border-yellow-400 whitespace-nowrap leading-none"
          id="btn_open_manual_modal"
          title={getTranslation("btn_manual_uso", domicilio.pais)}
        >
          <Book className="w-3 h-3 shrink-0" />
          <span>{getTranslation("btn_manual_uso", domicilio.pais)}</span>
        </button>
      </header>

      {/* CORE BODY GRID CONTENT - Dynamic columns depending on unlocking of dimensioning */}
      <main className={`flex-1 p-4 w-full grid gap-4 items-stretch overflow-y-auto max-w-none transition-all duration-300 ${
        isFormAndTechSubmited ? "grid-cols-3" : "grid-cols-2"
      }`}>
        
        {/* Column 1: Datos de Gestión (Form and validation checks) */}
        <section className="h-auto md:h-full min-h-0">
          <DatosGestion
            domicilio={domicilio}
            setDomicilio={setDomicilio}
            hsp={hsp}
            techType={techType}
            installerPhone={installerPhone}
            setInstallerPhone={handleInstallerPhoneChange}
            isUnlocked={isUnlocked}
            creditsAmount={credits.amount}
            whiteLabelEnabled={whiteLabelEnabled}
            setWhiteLabelEnabled={setWhiteLabelEnabled}
            whiteLabelCompanyName={whiteLabelCompanyName}
            setWhiteLabelCompanyName={setWhiteLabelCompanyName}
            whiteLabelEmail={whiteLabelEmail}
            setWhiteLabelEmail={setWhiteLabelEmail}
            whiteLabelWhatsApp={whiteLabelWhatsApp}
            setWhiteLabelWhatsApp={setWhiteLabelWhatsApp}
            whiteLabelLogo={whiteLabelLogo}
            onLogoUpload={handleLogoUpload}
            onLogoClear={handleLogoClear}
            savedProjects={savedProjects}
            onSaveProject={handleSaveProject}
            onLoadProject={handleLoadProject}
            onDeleteProject={handleDeleteProject}
            activeTechType={techType}
            onOpenUnlockModal={() => {
              setPendingTechType(techType || "off-grid");
              setUnlockCodeInput("");
              setUnlockError("");
              setShowUnlockModal(true);
            }}
          />
        </section>

        {/* Column 2: Configuración y Tipo de Tecnología (Tab switching and sizing metrics) */}
        <section className="h-auto md:h-full min-h-0">
          <ConfigTecnologia
            techType={techType}
            setTechType={handleTechTypeChange}
            showIncompleteAlert={showIncompleteAlert}
            domicilio={domicilio}
            appliances={appliances}
            setAppliances={setAppliances}
            autonomyDays={autonomyDays}
            setAutonomyDays={setAutonomyDays}
            batteryType={batteryType}
            setBatteryType={setBatteryType}
            batteryVoltage={batteryVoltage}
            setBatteryVoltage={setBatteryVoltage}
            solarCoverage={solarCoverage}
            setSolarCoverage={setSolarCoverage}
            thermalProfile={thermalProfile}
            setThermalProfile={setThermalProfile}
            personasCount={personasCount}
            setPersonasCount={setPersonasCount}
            waterHardness={waterHardness}
            setWaterHardness={setWaterHardness}
            hasMinors={hasMinors}
            setHasMinors={setHasMinors}
            hasPressurizer={hasPressurizer}
            setHasPressurizer={setHasPressurizer}
            sizing={sizing}
            onOpenPresupuesto={() => setIsPresupuestoOpen(true)}
            anualConsumptionKwh={anualConsumptionKwh}
            setAnualConsumptionKwh={setAnualConsumptionKwh}
            gridPhaseType={gridPhaseType}
            setGridPhaseType={setGridPhaseType}
            placeholderValue={placeholderValue}
            setPlaceholderValue={setPlaceholderValue}
            isDimensioned={techType ? dimensioned[techType] : false}
            onSetDimensioned={(val) => {
              if (techType) {
                if (val) {
                  if (!isApplicantDataComplete) {
                    setShowIncompleteAlert(true);
                    return;
                  }

                  // Check trial limits & credits
                  if (!isUnlocked) {
                    // 1. Check if they have credits
                    if (credits.amount > 0) {
                      // Check expiration
                      if (credits.expiresAt && Date.now() > credits.expiresAt) {
                        const clearedCredits = { amount: 0, expiresAt: null };
                        setCredits(clearedCredits);
                        setPendingTechType(techType);
                        setUnlockCodeInput("");
                        setUnlockError("Su paquete de créditos ha expirado (plazo de vigencia transcurrido).");
                        setShowUnlockModal(true);
                        return;
                      } else {
                        // Consume 1 credit
                        const newAmount = credits.amount - 1;
                        const newCredits = {
                          ...credits,
                          amount: newAmount,
                          expiresAt: newAmount === 0 ? null : credits.expiresAt
                        };
                        setCredits(newCredits);
                        alert(`⚡ Crédito consumido para este dimensionamiento.\nCréditos restantes: ${newAmount}`);
                      }
                    } else {
                      // 2. Check standard trial limit of 3 uses
                      const currentCount = dimensionCounts[techType];
                      if (currentCount >= 3) {
                        setPendingTechType(techType);
                        setUnlockCodeInput("");
                        setUnlockError("");
                        setShowUnlockModal(true);
                        return;
                      } else {
                        setDimensionCounts((prev) => ({ ...prev, [techType]: prev[techType] + 1 }));
                      }
                    }
                  }

                  const updatedDomicilio = {
                    nombre: domicilio.nombre.trim(),
                    apellido: domicilio.apellido.trim(),
                    domicilio: domicilio.domicilio.trim(),
                    localidad: domicilio.localidad.trim(),
                    provincia: domicilio.provincia.trim(),
                    pais: domicilio.pais || "Argentina"
                  };
                  setDomicilio({
                    nombre: "",
                    apellido: "",
                    domicilio: "",
                    localidad: "",
                    provincia: "",
                    pais: "Argentina"
                  });
                  setShowIncompleteAlert(false);
                  setDimensioned((prev) => ({ ...prev, [techType]: true }));
                  setLastDimensionedDomicilio(updatedDomicilio);
                } else {
                  setDimensioned((prev) => ({ ...prev, [techType]: false }));
                }
              }
            }}
            onResetToPointZero={handleResetToPointZero}
          />
        </section>

        {/* Column 3: Vista Previa de Ingeniería (Vector schematic active wires and action buttons) */}
        {isFormAndTechSubmited && (
          <section className="h-auto md:h-full min-h-0 animate-fade-in">
            <VistaIngenieria
              techType={techType}
              sizing={sizing}
              personasCount={personasCount}
              onOpenReporte={() => setIsReporteOpen(true)}
              onOpenGalerioObra={() => setIsGalerioObraOpen(true)}
              onOpenPresupuesto={() => setIsPresupuestoOpen(true)}
              isDimensioned={techType ? dimensioned[techType] : false}
              domicilio={lastDimensionedDomicilio || domicilio}
              hsp={hsp}
              appliances={appliances}
              autonomyDays={autonomyDays}
              batteryType={batteryType}
              batteryVoltage={batteryVoltage}
              solarCoverage={solarCoverage}
              thermalProfile={thermalProfile}
              waterHardness={waterHardness}
              hasMinors={hasMinors}
              hasPressurizer={hasPressurizer}
              anualConsumptionKwh={anualConsumptionKwh}
              placeholderValue={placeholderValue}
              gridPhaseType={gridPhaseType}
            />
          </section>
        )}

      </main>

      {/* FOOTER GENERAL DE INFORMACIÓN - Pinned Bottom always visible on-screen */}
      <footer className="bg-black py-3 px-4 border-t-2 border-amber-500 text-center font-sans text-[10.5px] text-yellow-500 space-y-0.5 shrink-0 z-40 shadow-sm">
        <p className="text-yellow-500 font-extrabold">{getTranslation("footer_copy", domicilio.pais).replace("2026", new Date().getFullYear().toString())}</p>
        <p className="text-yellow-500 text-[10px] font-bold">{getTranslation("footer_desc", domicilio.pais)}</p>
        <p className="text-yellow-500 text-[9px] font-black tracking-wide">{getTranslation("footer_author", domicilio.pais)}</p>
      </footer>

      {/* MODALS RENDERING PORTALS */}
      {techType && (
        <ReporteModal
          isOpen={isReporteOpen}
          onClose={() => setIsReporteOpen(false)}
          domicilio={lastDimensionedDomicilio || domicilio}
          hsp={hsp}
          techType={techType}
          sizing={sizing}
          appliances={appliances}
          personasCount={personasCount}
          installerPhone={installerPhone}
          gridPhaseType={gridPhaseType}
          whiteLabelEnabled={whiteLabelEnabled}
          whiteLabelCompanyName={whiteLabelCompanyName}
          whiteLabelWhatsApp={whiteLabelWhatsApp}
          whiteLabelEmail={whiteLabelEmail}
          whiteLabelLogo={whiteLabelLogo}
        />
      )}

      <GalerioObrasModal
        isOpen={isGalerioObraOpen}
        onClose={() => setIsGalerioObraOpen(false)}
      />

      {techType && (
        <PresupuestoModal
          isOpen={isPresupuestoOpen}
          onClose={() => setIsPresupuestoOpen(false)}
          domicilio={lastDimensionedDomicilio || domicilio}
          hsp={hsp}
          techType={techType}
          sizing={sizing}
          appliances={appliances}
          personasCount={personasCount}
          installerPhone={installerPhone}
          onPhoneChange={handleInstallerPhoneChange}
          whiteLabelEnabled={whiteLabelEnabled}
          whiteLabelCompanyName={whiteLabelCompanyName}
          whiteLabelWhatsApp={whiteLabelWhatsApp}
          whiteLabelEmail={whiteLabelEmail}
        />
      )}

      {/* GORGEOUS LOGO ZOOM AND SHOWCASE DETAILS MODAL */}
      {showLogoZoomModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in text-center">
          <div className="bg-black border-2 border-amber-500 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white opacity-100">
            
            {/* Modal Header */}
            <div className="bg-black border-b border-amber-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <span className="font-sans font-black text-xs uppercase tracking-wider text-amber-400">{getTranslation("logo_zoom_title", domicilio.pais)}</span>
              </div>
              <button 
                onClick={() => setShowLogoZoomModal(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-zinc-400 hover:text-white"
                title={getTranslation("logo_zoom_close", domicilio.pais)}
                id="btn_close_logo_zoom"
              >
                <X className="w-5 h-5 font-bold" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center justify-center space-y-6 text-center bg-black">
              
              <div className="bg-black border border-amber-500/20 p-6 rounded-2xl w-[275px] h-[200px] flex items-center justify-center shadow-inner">
                <RederarLogo className="w-full h-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-sans font-black text-amber-400 tracking-tight">{getTranslation("logo_zoom_brand", domicilio.pais)}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-md font-sans">
                  {getTranslation("logo_zoom_desc", domicilio.pais)}
                </p>
              </div>

              {/* Action Buttons in Modal */}
              <div className="w-full">
                <button
                  onClick={() => setShowLogoZoomModal(false)}
                  className="w-full py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{getTranslation("logo_zoom_btn", domicilio.pais)}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      </div>

      {/* 14. MODAL PARA DESBLOQUEAR SISTEMA (Trial limit check / Code Activation / Buy Credits) */}
      {showUnlockModal && (() => {
        const techLabel = pendingTechType === "on-grid" 
          ? getTranslation("tab_ongrid", domicilio.pais) 
          : pendingTechType === "off-grid" 
          ? getTranslation("tab_offgrid", domicilio.pais) 
          : getTranslation("tab_thermal", domicilio.pais);

        const packUsdPrices: { [key: string]: number } = {
          "3C": 30,
          "10C": 50,
          "20C": 75,
          "100C": 100
        };
        const currentPackUsd = packUsdPrices[checkoutPack] || 50;
        const currentPackArs = Math.round(currentPackUsd * (dolarRate || 1450));

        return (
          <div className="fixed inset-0 z-[10000] overflow-y-auto bg-black/95 backdrop-blur-md p-4 md:p-6 flex justify-center items-center">
            <div className="bg-black border-2 border-yellow-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-white my-auto relative z-10 opacity-100">
              
              <div className="flex flex-col gap-4 text-left font-sans">
                {(() => {
                  const lang = getCountryLanguage(domicilio.pais);
                  const t = {
                    es: {
                      title: "Carga de Créditos y Licencias",
                      subtitle: "REDERAR SOLAR • SISTEMA DE DIMENSIONAMIENTO",
                      credits_avail: "Balance de Créditos:",
                      expires: "Vencimiento:",
                      no_exp: "Sin vencimiento activo",
                      unlimited: "LICENCIA UNLIMITED PERMANENTE ACTIVA",
                      unlimited_desc: "Su sistema cuenta con acceso total e ilimitado a todos los módulos de dimensionamiento, reportes PDF y presupuestos de Marca Blanca.",
                      tab_buy: "💳 Adquirir Créditos",
                      tab_code: "🔑 Activar Código / Clave",
                      pack_title: "1. Seleccione el paquete de créditos a cargar:",
                      pay_title: "2. Seleccione el medio de pago:",
                      p_3c: "3 Créditos • 15 días de vigencia",
                      p_10c: "10 Créditos • 30 días de vigencia",
                      p_20c: "20 Créditos • 60 días de vigencia",
                      p_100c: "100 Créditos • 90 días de vigencia",
                      pay_mp: "Tarjeta Crédito / Débito / Transferencia (Argentina)",
                      pay_card: "Tarjeta Crédito / Débito (Internacional)",
                      pay_paypal: "PayPal (USD Internacional)",
                      pay_crypto: "Criptomonedas (USDT / Lemon)",
                      code_label: "Ingrese su código de activación o clave de recarga:",
                      code_placeholder: "EJEMPLO: RED-10C-XXXXXX-XXXX",
                      btn_activate: "Validar y Cargar Créditos",
                      lock_warning: "⚠️ Bloqueo de tiempo exponencial por intentos fallidos activo.",
                      terms_link: "Ver Términos, Condiciones y Políticas de Créditos",
                      close: "Cerrar"
                    },
                    en: {
                      title: "Credit Top-Up & Licensing",
                      subtitle: "REDERAR SOLAR • SIZING SYSTEM",
                      credits_avail: "Credit Balance:",
                      expires: "Expiration:",
                      no_exp: "No active expiration date",
                      unlimited: "PERMANENT UNLIMITED LICENSE ACTIVE",
                      unlimited_desc: "Your system has full unlimited access to all sizing modules, PDF engineering reports, and White Label quotes.",
                      tab_buy: "💳 Purchase Credits",
                      tab_code: "🔑 Activate Code / Key",
                      pack_title: "1. Select credit pack to top-up:",
                      pay_title: "2. Select payment method:",
                      p_3c: "3 Credits • 15-day validity",
                      p_10c: "10 Credits • 30-day validity",
                      p_20c: "20 Credits • 60-day validity",
                      p_100c: "100 Credits • 90-day validity",
                      pay_mp: "Credit / Debit Card & Transfer (Argentina)",
                      pay_card: "Credit / Debit Card (International)",
                      pay_paypal: "PayPal (USD International)",
                      pay_crypto: "Cryptocurrency (USDT / Lemon)",
                      code_label: "Enter your activation code or top-up key:",
                      code_placeholder: "EXAMPLE: RED-10C-XXXXXX-XXXX",
                      btn_activate: "Validate & Add Credits",
                      lock_warning: "⚠️ Exponential lockout active due to failed attempts.",
                      terms_link: "View Terms, Conditions & Credit Policies",
                      close: "Close"
                    },
                    pt: {
                      title: "Recarga de Créditos e Licenciamento",
                      subtitle: "REDERAR SOLAR • SISTEMA DE DIMENSIONAMENTO",
                      credits_avail: "Saldo de Créditos:",
                      expires: "Validade:",
                      no_exp: "Sem expiração ativa",
                      unlimited: "LICENÇA UNLIMITED PERMANENTE ATIVA",
                      unlimited_desc: "Seu sistema possui acesso total e ilimitado a todos os módulos de dimensionamento, relatórios PDF e orçamentos Marca Branca.",
                      tab_buy: "💳 Comprar Créditos",
                      tab_code: "🔑 Ativar Código / Chave",
                      pack_title: "1. Selecione o pacote de créditos para carregar:",
                      pay_title: "2. Selecione a forma de pagamento:",
                      p_3c: "3 Créditos • 15 dias de validade",
                      p_10c: "10 Créditos • 30 dias de validade",
                      p_20c: "20 Créditos • 60 dias de validade",
                      p_100c: "100 Créditos • 90 dias de validade",
                      pay_mp: "Cartão de Crédito / Débito e Transferência (Argentina)",
                      pay_card: "Cartão de Crédito / Débito (Internacional)",
                      pay_paypal: "PayPal (USD Internacional)",
                      pay_crypto: "Criptomoedas (USDT / Lemon)",
                      code_label: "Insira seu código de ativação ou chave de recarga:",
                      code_placeholder: "EXEMPLO: RED-10C-XXXXXX-XXXX",
                      btn_activate: "Validar e Adicionar Créditos",
                      lock_warning: "⚠️ Bloqueio temporário ativo devido a tentativas incorretas.",
                      terms_link: "Ver Termos, Condições e Políticas de Créditos",
                      close: "Fechar"
                    },
                    fr: {
                      title: "Recharge de Crédits & Licence",
                      subtitle: "REDERAR SOLAR • SYSTÈME DE DIMENSIONNEMENT",
                      credits_avail: "Solde de Crédits:",
                      expires: "Expiration:",
                      no_exp: "Pas d'expiration active",
                      unlimited: "LICENCE PERMANENTE ILLIMITÉE ACTIVE",
                      unlimited_desc: "Votre système dispose d'un accès illimité à tous les modules de dimensionnement, rapports PDF et devis Marque Blanche.",
                      tab_buy: "💳 Acheter des Crédits",
                      tab_code: "🔑 Activer Code / Clé",
                      pack_title: "1. Sélectionnez le pack de crédits à charger:",
                      pay_title: "2. Sélectionnez el medio de pago:",
                      p_3c: "3 Crédits • Validité de 15 jours",
                      p_10c: "10 Crédits • Validité de 30 jours",
                      p_20c: "20 Crédits • Validité de 60 jours",
                      p_100c: "100 Crédits • Validité de 90 jours",
                      pay_mp: "Carte de Crédit / Débit & Virement (Argentine)",
                      pay_card: "Carte de Crédit / Débit (International)",
                      pay_paypal: "PayPal (USD International)",
                      pay_crypto: "Cryptomonnaie (USDT / Lemon)",
                      code_label: "Entrez votre code d'activation ou clé de recharge:",
                      code_placeholder: "EXEMPLE: RED-10C-XXXXXX-XXXX",
                      btn_activate: "Valider et Ajouter les Crédits",
                      lock_warning: "⚠️ Verrouillage temporaire actif dû aux tentatives échouées.",
                      terms_link: "Voir les Conditions Générales et Politiques de Crédits",
                      close: "Fermer"
                    }
                  }[lang];

                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/30">
                            <Coins className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black tracking-wider uppercase text-yellow-400">
                              {t.title}
                            </h3>
                            <p className="text-[9px] text-zinc-500 font-bold font-mono uppercase">
                              {t.subtitle}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowUnlockModal(false)}
                          className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Balance Banner */}
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">{t.credits_avail}</span>
                          <span className="text-lg font-black font-mono text-yellow-400">
                            {isUnlocked ? "∞ UNLIMITED" : `${credits.amount} ${credits.amount === 1 ? "Crédito" : "Créditos"}`}
                          </span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">{t.expires}</span>
                          <span className="text-xs font-bold text-zinc-300 font-mono">
                            {isUnlocked 
                              ? "N/A" 
                              : credits.expiresAt 
                              ? new Date(credits.expiresAt).toLocaleDateString() 
                              : t.no_exp}
                          </span>
                        </div>
                      </div>

                      {isUnlocked && (
                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl space-y-1">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t.unlimited}
                          </span>
                          <p className="text-[10.5px] text-zinc-300 leading-relaxed font-sans">
                            {t.unlimited_desc}
                          </p>
                        </div>
                      )}

                      {/* Navigation Tabs */}
                      <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setActiveUnlockTab("buy")}
                          className={`py-2 text-xs font-extrabold uppercase rounded-lg transition-all cursor-pointer ${activeUnlockTab === "buy" ? "bg-yellow-500 text-black shadow-md" : "text-zinc-400 hover:text-white"}`}
                        >
                          {t.tab_buy}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveUnlockTab("activate")}
                          className={`py-2 text-xs font-extrabold uppercase rounded-lg transition-all cursor-pointer ${activeUnlockTab === "activate" ? "bg-yellow-500 text-black shadow-md" : "text-zinc-400 hover:text-white"}`}
                        >
                          {t.tab_code}
                        </button>
                      </div>

                      {/* TAB 1: BUY PACKS & PAYMENT METHODS */}
                      {activeUnlockTab === "buy" && (
                        <div className="space-y-4">
                          {/* 1. Credit Packs Selector */}
                          <div className="space-y-2">
                            <label className="text-[10px] text-yellow-400 font-mono uppercase font-black block">
                              {t.pack_title}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "3C", label: t.p_3c, priceUsd: 30 },
                                { id: "10C", label: t.p_10c, priceUsd: 50 },
                                { id: "20C", label: t.p_20c, priceUsd: 75 },
                                { id: "100C", label: t.p_100c, priceUsd: 100 }
                              ].map((pack) => {
                                const packArs = Math.round(pack.priceUsd * (dolarRate || 1450));
                                return (
                                  <button
                                    key={pack.id}
                                    type="button"
                                    onClick={() => setCheckoutPack(pack.id as any)}
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${checkoutPack === pack.id ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 font-bold" : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"}`}
                                  >
                                    <span className="text-xs font-extrabold block">{pack.label}</span>
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      ${pack.priceUsd} USD <span className="text-zinc-500">(~${packArs.toLocaleString('es-AR')} ARS)</span>
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Payment Channel Selection */}
                          <div className="space-y-2 pt-2 border-t border-zinc-900">
                            <label className="text-[10px] text-yellow-400 font-mono uppercase font-black block">
                              {t.pay_title}
                            </label>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Mercado Pago */}
                              <button
                                type="button"
                                onClick={() => setCheckoutMethod("argentina")}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${checkoutMethod === "argentina" ? "border-sky-500 bg-sky-500/10 text-sky-400 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"}`}
                              >
                                <span className="text-base">🇦🇷</span>
                                <div>
                                  <span className="text-[11px] font-extrabold block leading-tight">{t.pay_mp}</span>
                                  <span className="text-[9px] text-zinc-500 font-mono">Pesos ARS</span>
                                </div>
                              </button>

                              {/* Credit / Debit Card */}
                              <button
                                type="button"
                                onClick={() => setCheckoutMethod("internacional")}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${checkoutMethod === "internacional" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"}`}
                              >
                                <span className="text-base">💳</span>
                                <div>
                                  <span className="text-[11px] font-extrabold block leading-tight">{t.pay_card}</span>
                                  <span className="text-[9px] text-zinc-500 font-mono">USD Global</span>
                                </div>
                              </button>

                              {/* PayPal */}
                              <button
                                type="button"
                                onClick={() => setCheckoutMethod("paypal")}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${checkoutMethod === "paypal" ? "border-blue-500 bg-blue-500/10 text-blue-400 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"}`}
                              >
                                <span className="text-base">🅿️</span>
                                <div>
                                  <span className="text-[11px] font-extrabold block leading-tight">{t.pay_paypal}</span>
                                  <span className="text-[9px] text-zinc-500 font-mono">USD / PayPal</span>
                                </div>
                              </button>

                              {/* Crypto */}
                              <button
                                type="button"
                                onClick={() => setCheckoutMethod("cripto")}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${checkoutMethod === "cripto" ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"}`}
                              >
                                <span className="text-base">🪙</span>
                                <div>
                                  <span className="text-[11px] font-extrabold block leading-tight">{t.pay_crypto}</span>
                                  <span className="text-[9px] text-zinc-500 font-mono">USDT / Lemon</span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* 3. Action Box for Selected Payment Method */}
                          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-3">
                            
                            {/* Mercado Pago Box */}
                            {checkoutMethod === "argentina" && (
                              <div className="space-y-3 text-center">
                                <div className="text-center space-y-1">
                                  <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">TOTAL A PAGAR EN PESOS (ARS):</span>
                                  <span className="text-2xl font-black text-sky-400 font-mono">${currentPackArs.toLocaleString('es-AR')} ARS</span>
                                  <span className="text-[9.5px] text-zinc-500 block font-mono">Tipo de Cambio Dólar Blue en tiempo real: ${dolarRate} ARS/USD</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleMercadoPagoCheckout}
                                  disabled={isRedirectingMp}
                                  className="w-full py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98"
                                >
                                  {isRedirectingMp ? "Generando Enlace de Pago..." : "PAGAR CON TARJETA O TRANSFERENCIA (ARS)"}
                                </button>
                                {mpPaymentUrl && (
                                  <a
                                    href={mpPaymentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-sky-400 underline hover:text-sky-300 block mt-1 font-mono"
                                  >
                                    🔗 Abrir ventana de pago en nueva pestaña
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Credit/Debit Card Box */}
                            {checkoutMethod === "internacional" && (
                              <div className="space-y-3 text-center">
                                <div className="text-center space-y-1">
                                  <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">TOTAL A PAGAR EN DÓLARES (USD):</span>
                                  <span className="text-2xl font-black text-emerald-400 font-mono">${currentPackUsd}.00 USD</span>
                                  <span className="text-[9.5px] text-zinc-400 block font-mono">Cobro Internacional por Tarjeta Crédito / Débito</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleFreemiusCheckout}
                                  disabled={isRedirectingFreemius}
                                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98"
                                >
                                  {isRedirectingFreemius ? "Conectando Pasarela Internacional..." : "PAGAR CON TARJETA INTERNACIONAL (USD)"}
                                </button>
                                {freemiusPaymentUrl && (
                                  <a
                                    href={freemiusPaymentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-400 underline hover:text-emerald-300 block mt-1 font-mono"
                                  >
                                    🔗 Abrir pasarela de pago en nueva pestaña
                                  </a>
                                )}
                              </div>
                            )}

                            {/* PayPal Box */}
                            {checkoutMethod === "paypal" && (
                              <div className="space-y-3 text-center">
                                <div className="text-center space-y-1">
                                  <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">TOTAL A PAGAR EN PAYPAL (USD):</span>
                                  <span className="text-2xl font-black text-blue-400 font-mono">${currentPackUsd}.00 USD</span>
                                  <span className="text-[9.5px] text-zinc-400 block font-mono">Checkout Internacional PayPal</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={handlePaypalCheckout}
                                  disabled={isRedirectingPaypal}
                                  className="w-full py-3.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98"
                                >
                                  {isRedirectingPaypal ? "Generando Sesión PayPal..." : "PAGAR CON PAYPAL CHECKOUT (USD)"}
                                </button>
                                {paypalPaymentUrl && (
                                  <a
                                    href={paypalPaymentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-blue-400 underline hover:text-blue-300 block mt-1 font-mono"
                                  >
                                    🔗 Abrir enlace directo de PayPal
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Crypto Box */}
                            {checkoutMethod === "cripto" && (
                              <div className="space-y-3">
                                {/* Crypto Subtabs */}
                                <div className="grid grid-cols-2 gap-1 bg-black p-1 rounded-lg border border-zinc-800">
                                  <button
                                    type="button"
                                    onClick={() => setCryptoSubTab("direct")}
                                    className={`py-1.5 text-[10px] font-extrabold uppercase rounded transition-all ${cryptoSubTab === "direct" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
                                  >
                                    🟢 Lemon Tag
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCryptoSubTab("blockchain")}
                                    className={`py-1.5 text-[10px] font-extrabold uppercase rounded transition-all ${cryptoSubTab === "blockchain" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
                                  >
                                    ⛓️ On-Chain TxHash
                                  </button>
                                </div>

                                {cryptoSubTab === "direct" && (
                                  <div className="space-y-2.5 text-left text-xs">
                                    <div className="p-2.5 bg-black/60 border border-zinc-800 rounded-lg space-y-1">
                                      <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">1. Transfiera <strong className="text-amber-400">${currentPackUsd} USDT/USDC</strong> a:</span>
                                      <div className="flex items-center justify-between bg-zinc-900 px-2.5 py-1.5 rounded font-mono text-xs text-amber-400 font-bold border border-zinc-850">
                                        <span>Lemon Tag: $rederar</span>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">2. Ingrese su usuario con el que envió:</label>
                                      <input
                                        type="text"
                                        placeholder="Ej: $juanperez"
                                        value={cryptoDirectTag}
                                        onChange={(e) => setCryptoDirectTag(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                                      />
                                    </div>

                                    {cryptoDirectError && (
                                      <p className="text-[10px] text-red-400 font-mono">{cryptoDirectError}</p>
                                    )}

                                    <button
                                      type="button"
                                      onClick={handleVerifyDirectTagPayment}
                                      disabled={isVerifyingDirectTag}
                                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                                    >
                                      {isVerifyingDirectTag ? "Verificando Acreditación..." : "VERIFICAR Y CARGAR CRÉDITOS"}
                                    </button>
                                  </div>
                                )}

                                {cryptoSubTab === "blockchain" && (
                                  <div className="space-y-3 text-left text-xs">
                                    <div className="p-2.5 bg-black/60 border border-zinc-800 rounded-lg space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">1. Dirección de Depósito (Polygon / BSC):</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("0x98f6C0A09bE3971C56027a0ED6A0B84D190aE832");
                                            setCopiedWalletAddress(true);
                                            setTimeout(() => setCopiedWalletAddress(false), 2000);
                                          }}
                                          className="text-[9.5px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer"
                                        >
                                          {copiedWalletAddress ? "✓ Copiado" : "📋 Copiar Dirección"}
                                        </button>
                                      </div>
                                      <div className="bg-zinc-900 px-2.5 py-2 rounded font-mono text-[10.5px] text-amber-400 font-bold border border-zinc-850 break-all select-all">
                                        0x98f6C0A09bE3971C56027a0ED6A0B84D190aE832
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">2. Ingrese el TxHash de la transacción:</label>
                                      <input
                                        type="text"
                                        placeholder="Ej. 0x3a2b1c4d5e6f..."
                                        value={cryptoTxHashInput}
                                        onChange={(e) => setCryptoTxHashInput(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                                      />
                                    </div>

                                    {/* INSTRUCTIVO DESPLEGABLE: ¿CÓMO UBICAR TU TXHASH? */}
                                    <div className="p-3 bg-zinc-900/90 border border-amber-500/40 rounded-xl space-y-2">
                                      <div className="flex items-center justify-between text-amber-400 font-bold font-mono text-[11px] uppercase">
                                        <span className="flex items-center gap-1.5">
                                          <span>💡 INSTRUCTIVO: ¿CÓMO UBICAR TU TXHASH?</span>
                                        </span>
                                        <button 
                                          type="button" 
                                          onClick={() => setShowInlineTxHashGuide(!showInlineTxHashGuide)}
                                          className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded font-mono cursor-pointer transition-all"
                                        >
                                          {showInlineTxHashGuide ? "▲ Ocultar" : "▼ Desplegar guía"}
                                        </button>
                                      </div>

                                      <div className="text-zinc-300 space-y-2 font-sans text-[11px] leading-relaxed">
                                        <p className="text-zinc-300">
                                          El <strong>TxHash</strong> es el identificador / ID de Transacción / Hash alfanumérico único de comprobación de tu envío en la blockchain.
                                        </p>

                                        {showInlineTxHashGuide && (
                                          <div className="bg-black/70 p-3 rounded-lg border border-zinc-800 space-y-2 animate-fadeIn">
                                            <p className="font-bold text-amber-300 text-[10.5px] uppercase font-mono">
                                              Pasos para cualquier billetera o exchange (Lemon, Binance, Belo, Trust Wallet, MetaMask, etc.):
                                            </p>
                                            <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 text-[10.5px] font-sans">
                                              <li>Ir al <strong>Historial de Movimientos / Envíos</strong> de tu app de criptomonedas.</li>
                                              <li>Seleccionar el envío de <strong>USDT / USDC</strong> realizado a la dirección de depósito.</li>
                                              <li>Copiar el código alfanumérico largo de <strong>64 caracteres</strong> que comienza con <code className="text-amber-400 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">0x...</code></li>
                                              <li>Pegarlo en el campo <strong>"2. Ingrese el TxHash de la transacción"</strong> y presionar <strong>VERIFICAR HASH ON-CHAIN</strong>.</li>
                                            </ol>
                                          </div>
                                        )}
                                      </div>

                                      <div className="text-[10px] text-zinc-400 font-mono pt-1.5 border-t border-zinc-800 flex items-center gap-1">
                                        <span className="text-amber-400 font-bold">⚡ Aviso de redes soportadas:</span>
                                        <span>Polygon (MATIC) o Binance Smart Chain (BSC - BEP20).</span>
                                      </div>
                                    </div>

                                    {cryptoVerificationError && (
                                      <p className="text-[10px] text-red-400 font-mono">{cryptoVerificationError}</p>
                                    )}

                                    <button
                                      type="button"
                                      onClick={handleVerifyCryptoPayment}
                                      disabled={isVerifyingCrypto}
                                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98"
                                    >
                                      {isVerifyingCrypto ? "Validando en Blockchain..." : "VERIFICAR HASH ON-CHAIN"}
                                    </button>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      {/* TAB 2: ACTIVATION CODE INPUT */}
                      {activeUnlockTab === "activate" && (
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-mono font-black text-yellow-500 block">
                            {t.code_label}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t.code_placeholder}
                              value={unlockCodeInput}
                              onChange={(e) => {
                                setUnlockCodeInput(e.target.value);
                                setUnlockError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleUnlockSubmit();
                                }
                              }}
                              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-3 text-xs font-black font-mono tracking-widest text-center text-yellow-400 focus:outline-none focus:border-yellow-500 transition-all uppercase"
                            />
                          </div>

                          {unlockError && (
                            <div className="bg-red-950/30 border border-red-500/30 p-2.5 rounded-xl text-center">
                              <p className="text-[10.5px] text-red-400 font-bold font-mono">
                                ⚠️ {unlockError}
                              </p>
                            </div>
                          )}

                          {lockoutUntil && Date.now() < lockoutUntil && (
                            <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl text-center">
                              <p className="text-[10px] text-amber-400 font-mono font-bold">
                                {t.lock_warning} ({formatLockoutTime(lockoutSecLeft)})
                              </p>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleUnlockSubmit}
                            className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-98"
                          >
                            {t.btn_activate}
                          </button>
                        </div>
                      )}

                      {/* Footer Terms */}
                      <div className="border-t border-zinc-900 pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[9.5px] text-zinc-500 hover:text-amber-400 underline font-sans font-semibold transition-colors cursor-pointer"
                        >
                          {t.terms_link}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        countryName={domicilio.pais}
      />



      {/* Manual de Uso Modal for Clients */}
      <ManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        countryName={domicilio.pais}
      />

    </div>
  );
}
