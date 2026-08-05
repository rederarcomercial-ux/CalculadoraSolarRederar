import { X } from "lucide-react";
import { getCountryLanguage } from "../translations";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName?: string;
}

export default function TermsModal({ isOpen, onClose, countryName }: TermsModalProps) {
  if (!isOpen) return null;

  const lang = getCountryLanguage(countryName);

  const texts = {
    es: {
      title: "Términos, Condiciones y Consentimiento de Uso",
      subtitle: "REDERAR SOLAR • SISTEMA DE DIMENSIONAMIENTO INICIAL FOTOVOLTAICO Y TÉRMICO",
      s1_title: "1. Ámbito, Carácter Estimativo y No Vinculante",
      s1_p1: "El software provisto por REDERAR es una plataforma de ingeniería informática que actúa única y exclusivamente como un Sistema de Dimensionamiento Inicial para tecnologías solares fotovoltaicas (sistemas On-Grid y Off-Grid) y térmicas (colectores para agua caliente sanitaria). Los informes y diagramas representan proyecciones matemáticas estimativas basadas en bases de datos de radiación estándar.",
      s1_p2: "Bajo ninguna circunstancia sustituyen la obligatoriedad de contratar una visita técnica personalizada presencial y la firma de un instalador solar matriculado en el lugar real de la obra.",
      s2_title: "2. Consumo de Créditos y Licencias",
      s2_p1: "El acceso a las funcionalidades del dimensionador, su motor matemático y la generación de documentación técnica (PDFs y esquemas unifilares) se gestiona exclusivamente mediante créditos o licencias de uso.",
      s2_li1: "Cada simulación o dimensionamiento ejecutado descuenta 1 Crédito del balance del dispositivo.",
      s2_li2: "La visualización e impresión del reporte técnico final consume la unidad asignada.",
      s2_li3: "La recarga de créditos se realiza bajo estrictas medidas de validación por dispositivo (Hardware ID).",
      s3_title: "3. Vigencia y Expiración de Créditos",
      s3_p1: "Los créditos adquiridos están sujetos a un plazo de vigencia temporal estricto. Al expirar el plazo, el sistema dará de baja cualquier saldo remanente no utilizado sin reembolso:",
      s3_pack1: "Paquete Básico (3 Créditos): 15 días de vigencia",
      s3_pack2: "Paquete Junior (10 Créditos): 30 días de vigencia",
      s3_pack3: "Paquete Profesional (20 Créditos): 60 días de vigencia",
      s3_pack4: "Paquete Corporativo (100 Créditos): 90 días de vigencia",
      s4_title: "4. Seguridad y Bloqueo de Hardware",
      s4_p1: "Para prevenir ataques sobre códigos de activación, el sistema implementa una escala exponencial de bloqueo local de tiempo ante intentos fallidos:",
      s4_li1: "2.º intento fallido: Bloqueo por 15 minutos.",
      s4_li2: "3.er intento fallido: Bloqueo por 4 horas.",
      s4_li3: "4.º intento fallido en adelante: Bloqueo absoluto por 72 horas.",
      s5_title: "5. Propiedad Intelectual",
      s5_p1: "Todos los derechos de propiedad intelectual, algoritmos, metodologías e isologotipos pertenecen a REDERAR (© 2026). Licencia revocable y no transferible.",
      s6_title: "6. Exclusión de Responsabilidad",
      s6_p1: "REDERAR no se responsabiliza por la producción real de kWh, litros de agua ni por fallas de instalación presencial desprovistas de protecciones eléctricas adecuadas.",
      clause_title: "⚖️ CLÁUSULA DE ACEPTACIÓN INCONDICIONAL",
      clause_text: "AL ADQUIRIR CRÉDITOS O USAR ESTA PLATAFORMA, EL USUARIO ACEPTA EN SU TOTALIDAD ESTOS TÉRMINOS Y RENUNCIA CUALQUIER ACCIÓN LEGAL O RECLAMO CONTRA REDERAR O SUS CREADORES.",
      btn_accept: "Entendido, Acepto Incondicionalmente"
    },
    en: {
      title: "Terms, Conditions and Usage Consent",
      subtitle: "REDERAR SOLAR • PHOTOVOLTAIC & THERMAL INITIAL SIZING ENGINE",
      s1_title: "1. Scope, Estimative & Non-Binding Character",
      s1_p1: "The software provided by REDERAR is an engineering computing platform acting solely as an Initial Sizing System for solar PV (On-Grid/Off-Grid) and thermal systems. Reports and single-line diagrams represent estimated mathematical projections based on standard radiation databases.",
      s1_p2: "Under no circumstances do they replace an in-person technical visit and sign-off by a certified solar installer at the project site.",
      s2_title: "2. Credit Consumption and Licenses",
      s2_p1: "Access to sizing features, mathematical engines, and technical documentation (PDFs and single-line diagrams) is managed via single-use credits or commercial licenses.",
      s2_li1: "Each sizing simulation run deducts 1 Credit from the device balance.",
      s2_li2: "Viewing and printing the final PDF engineering report consumes the assigned unit.",
      s2_li3: "Credit recharges are validated under strict Hardware ID device checks.",
      s3_title: "3. Credit Validity & Expiration",
      s3_p1: "Acquired credits have strict expiration periods. Once expired, unused credits are automatically cancelled without refund:",
      s3_pack1: "Basic Pack (3 Credits): 15 days validity",
      s3_pack2: "Junior Pack (10 Credits): 30 days validity",
      s3_pack3: "Pro Pack (20 Credits): 60 days validity",
      s3_pack4: "Corporate Pack (100 Credits): 90 days validity",
      s4_title: "4. Hardware Security & Exponential Lockout",
      s4_p1: "To prevent brute-force attacks on activation keys, the system enforces an exponential local device time lockout upon failed attempts:",
      s4_li1: "2nd failed attempt: 15-minute lockout.",
      s4_li2: "3rd failed attempt: 4-hour lockout.",
      s4_li3: "4th+ failed attempt: 72-hour absolute lockout per attempt.",
      s5_title: "5. Intellectual Property",
      s5_p1: "All intellectual property rights, algorithms, databases, and visual assets belong strictly to REDERAR (© 2026). Granted license is personal, revocable, and non-transferable.",
      s6_title: "6. Limitation of Liability",
      s6_p1: "REDERAR is not liable for actual kWh/thermal output or installation defects missing proper electrical protections.",
      clause_title: "⚖️ UNCONDITIONAL ACCEPTANCE CLAUSE",
      clause_text: "BY PURCHASING CREDITS OR USING THIS PLATFORM, THE USER FULLY ACCEPTS THESE TERMS AND WAIVES ANY LEGAL CLAIMS AGAINST REDERAR OR ITS DEVELOPERS.",
      btn_accept: "I Understand & Accept Unconditionally"
    },
    pt: {
      title: "Termos, Condições e Consentimento de Uso",
      subtitle: "REDERAR SOLAR • SISTEMA DE DIMENSIONAMENTO INICIAL FOTOVOLTAICO E TÉRMICO",
      s1_title: "1. Âmbito, Caráter Estimativo e Não Vinculativo",
      s1_p1: "O software fornecido pela REDERAR é uma plataforma de engenharia computacional que atua exclusivamente como um Sistema de Dimensionamento Inicial para tecnologias solares fotovoltaicas (On-Grid e Off-Grid) e térmicas. Os relatórios representam projeções matemáticas estimativas baseadas em radiação solar padrão.",
      s1_p2: "Em nenhuma circunstância substituem a visita técnica presencial por um instalador solar credenciado no local da obra.",
      s2_title: "2. Consumo de Créditos e Licenças",
      s2_p1: "O acesso aos cálculos, motor matemático e geração de relatórios técnicos (PDF e diagramas) é gerido exclusivamente via saldo de créditos.",
      s2_li1: "Cada simulação executada desconta 1 Crédito do saldo do dispositivo.",
      s2_li2: "A geração e download do relatório técnico em PDF consomem a unidade atribuída.",
      s2_li3: "A recarga de créditos é efetuada sob estrita verificação de ID do dispositivo (Hardware ID).",
      s3_title: "3. Validade e Expiração de Créditos",
      s3_p1: "Os créditos adquiridos possuem prazos de validade estritos. Ao expirar o prazo, os créditos não utilizados são cancelados sem reembolso:",
      s3_pack1: "Pacote Básico (3 Créditos): 15 dias de validade",
      s3_pack2: "Pacote Junior (10 Créditos): 30 dias de validade",
      s3_pack3: "Pacote Profissional (20 Créditos): 60 dias de validade",
      s3_pack4: "Pacote Corporativo (100 Créditos): 90 dias de validade",
      s4_title: "4. Segurança de Hardware e Bloqueio Exponencial",
      s4_p1: "Para impedir ataques a códigos de ativação, o sistema aplica bloqueios temporais no dispositivo diante de tentativas incorretas:",
      s4_li1: "2.ª tentativa falhada: Bloqueio de 15 minutos.",
      s4_li2: "3.ª tentativa falhada: Bloqueio de 4 horas.",
      s4_li3: "4.ª tentativa falhada em diante: Bloqueio total de 72 horas.",
      s5_title: "5. Propriedade Intelectual",
      s5_p1: "Todos os direitos de propriedade intelectual, algoritmos e marcas pertencem à REDERAR (© 2026). Licença pessoal e intransferível.",
      s6_title: "6. Exclusão de Responsabilidade",
      s6_p1: "A REDERAR não se responsabiliza pela geração real de kWh, litros de água quente ou por falhas na instalação elétrica presencial.",
      clause_title: "⚖️ CLÁUSULA DE ACEITAÇÃO INCONDICIONAL",
      clause_text: "AO ADQUIRIR CRÉDITOS OU UTILIZAR ESTA PLATAFORMA, O UTILIZADOR ACEITA PLENAMENTE ESTES TERMOS E RENUNCIA A QUALQUER AÇÃO LEGAL CONTRA A REDERAR OU SEUS CRIADORES.",
      btn_accept: "Entendido, Aceito Incondicionalmente"
    },
    fr: {
      title: "Conditions Générales et Consentement d'Utilisation",
      subtitle: "REDERAR SOLAR • MOTEUR DE DIMENSIONNEMENT INITIAL PHOTOVOLTAÏQUE ET THERMIQUE",
      s1_title: "1. Portée, Caractère Estimatif et Non Contraignant",
      s1_p1: "Le logiciel fourni par REDERAR est une plateforme d'ingénierie agissant uniquement comme Système de Dimensionnement Initial pour systèmes solaires PV et thermiques. Les rapports et schémas représentent des projections mathématiques estimatives basées sur des bases de données solaires standards.",
      s1_p2: "Ils ne remplacent en aucun cas une visite technique sur le terrain effectuée par un installateur agréé.",
      s2_title: "2. Consommation de Crédits et Licences",
      s2_p1: "L'accès aux fonctionnalités de calcul et à la génération de documents techniques (PDF et schémas unifilaires) est géré via des crédits à usage unique.",
      s2_li1: "Chaque simulation exécutée déduit 1 Crédit del solde de l'appareil.",
      s2_li2: "L'affichage et le téléchargement du rapport PDF consomment l'unité attribuée.",
      s2_li3: "La recharge de crédits est validée sous contrôle strict de l'identifiant matériel (Hardware ID).",
      s3_title: "3. Validité et Expiration des Crédits",
      s3_p1: "Les crédits achetés ont des durées de validité strictes. À l'expiration du délai, les crédits non utilisés sont annulés sans remboursement:",
      s3_pack1: "Pack Basique (3 Crédits): 15 jours de validité",
      s3_pack2: "Pack Junior (10 Crédits): 30 jours de validité",
      s3_pack3: "Pack Professionnel (20 Crédits): 60 jours de validité",
      s3_pack4: "Pack Entreprise (100 Crédits): 90 jours de validité",
      s4_title: "4. Sécurité Matérielle et Verrouillage Exponentiel",
      s4_p1: "Afin de protéger le système contre les attaques par force brute, un verrouillage temporaire local s'active après échecs de saisie:",
      s4_li1: "2ème tentative échouée: Verrouillage de 15 minutes.",
      s4_li2: "3ème tentative échouée: Verrouillage de 4 heures.",
      s4_li3: "4ème tentative et plus: Verrouillage absolu de 72 heures.",
      s5_title: "5. Propriété Intellectuelle",
      s5_p1: "Tous les droits de propriété intellectuelle, algorithmes et marques appartiennent exclusivement à REDERAR (© 2026). Licence personnelle et non transférable.",
      s6_title: "6. Exclusions de Responsabilité",
      s6_p1: "REDERAR n'est pas responsable de la production réelle en kWh, d'eau chaude ou des défauts d'installation sans protections électriques appropriées.",
      clause_title: "⚖️ CLAUSE D'ACCEPTATION SANS RÉSERVE",
      clause_text: "EN ACHETANT DES CRÉDITS OU EN UTILISANT CETTE PLATEFORME, L'UTILISATEUR ACCEPTE PLEINEMENT CES CONDITIONS ET RENONCE À TOUTE ACTION EN JUSTICE CONTRE REDERAR OU SES DÉVELOPPEURS.",
      btn_accept: "Compris, J'accepte Sans Réserve"
    }
  };

  const t = texts[lang] || texts.es;

  return (
    <div id="terms-modal-overlay" className="fixed inset-0 z-[10000] overflow-y-auto bg-black/95 backdrop-blur-md p-4 md:p-6 flex justify-center items-center">
      <div id="terms-modal-container" className="bg-black border border-yellow-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-white my-auto relative animate-fade-in max-h-[85vh] overflow-hidden opacity-100">
        
        {/* Modal Header */}
        <div id="terms-modal-header" className="flex items-center justify-between border-b border-zinc-900 pb-3 bg-black">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-lg">📄</span>
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase text-yellow-400 font-sans">
                {t.title}
              </h3>
              <p className="text-[9px] text-zinc-500 font-bold font-mono uppercase">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            id="close-terms-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div id="terms-modal-content-body" className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-zinc-300 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-zinc-800 bg-black">
          
          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">1.</span> {t.s1_title}
            </h4>
            <p className="text-[10.5px]">{t.s1_p1}</p>
            <p className="text-[10.5px] text-zinc-400">{t.s1_p2}</p>
          </div>

          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">2.</span> {t.s2_title}
            </h4>
            <p className="text-[10.5px]">{t.s2_p1}</p>
            <ul className="list-disc pl-4 space-y-1 text-[10.5px] text-zinc-300">
              <li>{t.s2_li1}</li>
              <li>{t.s2_li2}</li>
              <li>{t.s2_li3}</li>
            </ul>
          </div>

          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">3.</span> {t.s3_title}
            </h4>
            <p className="text-[10.5px]">{t.s3_p1}</p>
            <div className="bg-black/40 border border-zinc-900 rounded-lg p-2.5 space-y-1 font-mono text-[10px] my-2">
              <div className="flex justify-between text-yellow-500 font-bold">
                <span>• {t.s3_pack1}</span>
              </div>
              <div className="flex justify-between text-yellow-500 font-bold">
                <span>• {t.s3_pack2}</span>
              </div>
              <div className="flex justify-between text-yellow-500 font-bold">
                <span>• {t.s3_pack3}</span>
              </div>
              <div className="flex justify-between text-yellow-500 font-bold">
                <span>• {t.s3_pack4}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">4.</span> {t.s4_title}
            </h4>
            <p className="text-[10.5px]">{t.s4_p1}</p>
            <ul className="list-disc pl-4 space-y-1 text-[10.5px] text-zinc-400">
              <li>{t.s4_li1}</li>
              <li>{t.s4_li2}</li>
              <li>{t.s4_li3}</li>
            </ul>
          </div>

          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">5.</span> {t.s5_title}
            </h4>
            <p className="text-[10.5px] text-zinc-300">{t.s5_p1}</p>
          </div>

          <div className="space-y-1.5 border-b border-zinc-900/50 pb-3">
            <h4 className="font-bold text-zinc-100 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              <span className="text-yellow-500">6.</span> {t.s6_title}
            </h4>
            <p className="text-[10.5px] text-zinc-400">{t.s6_p1}</p>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-yellow-400 text-[11px] uppercase tracking-wide font-sans flex items-center gap-1.5">
              {t.clause_title}
            </h4>
            <p className="text-[10.5px] text-zinc-200 bg-yellow-950/20 border border-yellow-500/20 p-3 rounded-lg font-medium leading-relaxed">
              {t.clause_text}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div id="terms-modal-footer" className="border-t border-zinc-900 pt-3 flex justify-end bg-black">
          <button
            id="accept-terms-btn"
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98"
          >
            {t.btn_accept}
          </button>
        </div>

      </div>
    </div>
  );
}
