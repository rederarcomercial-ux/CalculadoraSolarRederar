import { useState } from "react";
import { X, Book, Sun, Cpu, Layout, UserCheck, Wrench, Sparkles, CheckCircle2, Coins } from "lucide-react";
import { getCountryLanguage } from "../translations";

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName?: string;
}

type TabType = "general" | "ongrid" | "offgrid" | "thermal" | "creditos" | "marca_blanca";

export default function ManualModal({ isOpen, onClose, countryName }: ManualModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [expandedSection, setExpandedSection] = useState<string | null>("pasos");

  if (!isOpen) return null;

  const lang = getCountryLanguage(countryName);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const texts = {
    es: {
      header_title: "MANUAL DE USO E INSTRUCTIVO OPERATIVO PARA USUARIO",
      header_sub: "REDERAR Sizing Engine • Guía de Operación",
      btn_close: "Cerrar",
      tab1: "1. Guía General & Datos",
      tab2: "2. On-Grid (Conectado)",
      tab3: "3. Off-Grid (Aislado)",
      tab4: "4. Térmico (ACS)",
      tab5: "5. Créditos & Pagos",
      tab6: "6. Marca Blanca (WL)",
      
      gen_title: "Manual de Funcionamiento e Ingreso de Datos",
      gen_desc: "Esta herramienta profesional permite dimensionar de forma precisa y científicamente comprobada los requerimientos de sistemas fotovoltaicos y térmicos para viviendas, industrias y establecimientos agrícolas.",
      gen_workflow: "1. Flujo de Trabajo Recomendado (Paso a Paso)",
      gen_step1_title: "Carga de Datos de Gestión (Columna 1 - Izquierda):",
      gen_step1_desc: "Ingrese Nombre, Apellido, Domicilio, Localidad, Provincia/Estado y País del solicitante. ¡Crucial! La selección de País, Provincia, Ciudad y domicilio asigna automáticamente las Horas de Sol Pico (HSP) históricas ajustadas para la peor ventana invernal.",
      gen_step2_title: "Selección de Tecnología (Columna 2 - Centro):",
      gen_step2_desc: "Elija entre On-Grid, Off-Grid o Térmico. Verá los parámetros y controles específicos para cada tecnología.",
      gen_step3_title: "Ejecutar Dimensionamiento:",
      gen_step3_desc: "Una vez ajustados los consumos o el inventario, presione el botón \"DIMENSIONAR SISTEMA\". El sistema procesará el cálculo en milisegundos y desplegará la columna de resultados de ingeniería.",
      gen_step4_title: "Generación de Reporte de Ingeniería Técnica (Columna 3 - Derecha):",
      gen_step4_desc: "Obtendrá el esquema técnico unifilar con flujos dinámicos animables y la opción de descargar el Reporte de Ingeniería PDF (estrictamente técnico). Si el solicitante requiere un presupuesto o cotización comercial, puede solicitarlo directamente vía WhatsApp.",

      ongrid_title: "Carga y Operación: Sistema On-Grid (Conectado a Red)",
      ongrid_desc: "Indicado para viviendas y pymes en zonas urbanas con servicio eléctrico comercial constante. Su objetivo es neutralizar la factura de luz inyectando energía fotovoltaica propia.",
      ongrid_steps_title: "Pasos para Realizar la Carga de Datos:",
      ongrid_step1_title: "1. Consumo Promedio (kWh/año):",
      ongrid_step1_desc: "Tome la factura del proveedor eléctrico e ingrese los kWh consumidos durante todo el año (sume los consumos mensuales o bimestrales). Si no los conoce, use el promedio estimado de 3.605 kWh/año.",
      ongrid_step2_title: "2. Cobertura Solar Deseada (% Slider):",
      ongrid_step2_desc: "Desplace la barra para definir qué porcentaje de la factura desea anular (se sugiere entre 70% y 90% para un retorno de inversión óptimo).",
      ongrid_step3_title: "3. Tipo de Red (Monofásica vs. Trifásica):",
      ongrid_step3_desc: "Seleccione el tipo de instalación eléctrica existente. El software elegirá automáticamente un Inversor On-Grid monofásico o trifásico con tensión regulada.",
      ongrid_step4_title: "4. Resultados de Inyección y Amortización:",
      ongrid_step4_desc: "El motor entregará la Potencia Fotovoltaica Pico (kWp), número de paneles, generación anual estimada en kWh, ahorro económico y tiempo de amortización (Payback en años).",

      offgrid_title: "Carga y Operación: Sistema Off-Grid (Aislado con Baterías)",
      offgrid_desc: "Diseñado para zonas rurales, campos o casillas sin acceso a la red eléctrica. Funciona de manera 100% independiente almacenando energía en baterías.",
      offgrid_steps_title: "Pasos para Dimensionar un Sistema Aislado:",
      offgrid_step1_title: "1. Inventario de Electrodomésticos y Cargas:",
      offgrid_step1_desc: "Seleccione de la lista o agregue cargas personalizadas (luces, heladera, bomba de agua, TV, etc.), especificando la cantidad, potencia en Watts (W) y horas de uso diario.",
      offgrid_step2_title: "2. Días de Autonomía (Reserva sin Sol):",
      offgrid_step2_desc: "Ajuste el selector de 1 a 3 días. Esto define cuántos días consecutivos de nubosidad/lluvia continuará alimentando la casa el banco de baterías.",
      offgrid_step3_title: "3. Tecnología de Baterías:",
      offgrid_step3_desc: "Litio LiFePO4: Permite descargas de hasta 80% (DOD) y dura más de 10 años. Gel / AGM: Económica, con descarga aconsejada del 50% (DOD).",
      offgrid_step4_title: "4. Voltaje de Baterías (12V / 24V / 48V):",
      offgrid_step4_desc: "El sistema recomienda 48V para reducir corrientes elevadas y permitir el uso de cables estándar de menor sección sin sobrecalentamientos.",
      offgrid_opt_title: "Optimizador de Ciclado de Termostatos REDERAR:",
      offgrid_opt_desc: "Al seleccionar heladeras o freezers, el software calcula automáticamente los ciclos reales de parada del compresor (duty cycle), reduciendo el sobrecosto de cálculo en más de un 30% sin arriesgar la cadena de frío.",

      thermal_title: "Carga y Operación: Termotanques Solares (Térmico ACS)",
      thermal_desc: "Equipos de acumulación y calentamiento solar directo para agua sanitaria en viviendas, hoteles y vestuarios.",
      thermal_steps_title: "Pasos para el Dimensionamiento Térmico:",
      thermal_step1_title: "1. Cantidad de Personas y Perfil:",
      thermal_step1_desc: "Indique cuántas personas habitan en la vivienda. Seleccione perfil Familiar (50L/persona) o perfil Intenso (80L/persona) para duchas prolongadas.",
      thermal_step2_title: "2. Calidad del Agua (Dura vs. Blanda):",
      thermal_step2_desc: "Si el agua contiene mucho sarro o mineralización (\"Agua Dura\"), el sistema recomendará de manera mandatoria un equipo Heat Pipe Presurizado.",
      thermal_step3_title: "3. Presurizadoras y Seguridad:",
      thermal_step3_desc: "Indique si existe bomba presurizadora y si habitan menores de edad. En caso afirmativo, el informe exigirá la inclusión de una Válvula Mezcladora Termostática Anti-Quemaduras.",
      thermal_step4_title: "4. Montajes Especiales en Paralelo:",
      thermal_step4_desc: "Para consumos superiores a 300 Litros, el motor especifica la interconexión hidráulica en paralelo de múltiples unidades mediante retorno invertido Tichelmann.",

      cred_title: "Adquisición de Créditos y Canales de Pago",
      cred_desc: "Cada usuario cuenta con 3 dimensionamientos de prueba gratuitos por tecnología. Al agotarlos, podrá adquirir paquetes de créditos comerciales prepagos.",
      cred_methods_title: "Medios de Pago Soportados:",
      cred_m1_title: "🇦🇷 Argentina (Pesos / Tarjetas / Transferencia):",
      cred_m1_desc: "Generación automática de link de pago con Tarjeta de Crédito, Débito, Dinero en Cuenta o Transferencia 3.0.",
      cred_m2_title: "🌐 Internacional (Tarjetas / PayPal):",
      cred_m2_desc: "Integración directa para clientes del exterior. Permite pagar con Tarjetas Internacionales Visa, Mastercard, American Express o PayPal.",
      cred_m3_title: "🪙 Criptomonedas / Dólares Digitales (USDT / USDC On-Chain):",
      cred_m3_desc: "Transferencias en USDT/USDC en redes Polygon o Binance Smart Chain (BSC). Ingrese su TxHash y el sistema validará la transacción en la blockchain en 2 segundos.",

      wl_title: "Módulo Marca Blanca (White Label) para Instaladores",
      wl_desc: "Permite a empresas de energía solar e instaladores independientes presentar propuestas técnico-comerciales con su propia identidad visual y sus datos de contacto.",
      wl_step1_title: "1. Activación y Carga de Isologotipo:",
      wl_step1_desc: "En la columna izquierda (Datos de Gestión), active la casilla \"Activar Marca Blanca (WL)\" y presione el botón de subir imagen para cargar su archivo PNG o JPG.",
      wl_step2_title: "2. Datos Corporativos de Contacto:",
      wl_step2_desc: "Complete Nombre Comercial, Email y número de WhatsApp con código de país (ej: 54911...).",
      wl_step3_title: "3. Aplicación Automática en Documentos PDF:",
      wl_step3_desc: "Todos los reportes de ingeniería técnica y esquemas unifilares impresos reemplazarán automáticamente la marca REDERAR por su logo y datos de contacto.",
      wl_step4_title: "4. Botón \"Limpiar Datos de Marca\":",
      wl_step4_desc: "Si requiere desvincular sus datos o restaurar la configuración inicial, presione el botón \"Limpiar Datos de Marca\" para resetear el almacenamiento local.",

      footer: "Manual Operativo de Usuario • REDERAR Sizing Engine",
      btn_understand: "Entendido"
    },
    fr: {
      header_title: "MANUEL D'UTILISATION ET INSTRUCTIONS OPÉRATIONNELLES",
      header_sub: "REDERAR Sizing Engine • Guide d'Opération",
      btn_close: "Fermer",
      tab1: "1. Guide Général & Données",
      tab2: "2. On-Grid (Connecté)",
      tab3: "3. Off-Grid (Autonome)",
      tab4: "4. Solaire Thermique (ECS)",
      tab5: "5. Crédits & Paiements",
      tab6: "6. Marque Blanche (WL)",

      gen_title: "Manuel de Fonctionnement et Saisie des Données",
      gen_desc: "Cet outil professionnel permet de dimensionner avec précision et scientifiquement les besoins en systèmes photovoltaïques et thermiques pour habitations, industries et exploitations agricoles.",
      gen_workflow: "1. Flux de Travail Recommandé (Étape par Étape)",
      gen_step1_title: "Saisie des Données du Demandeur (Colonne 1 - Gauche):",
      gen_step1_desc: "Saisissez Prénom, Nom, Adresse, Ville, Département/Province et Pays du demandeur. Crucial! La sélection du Pays et de la Région attribue automatiquement les Heures de Soleil Crête (HSP) historiques ajustées pour la pire période hivernale.",
      gen_step2_title: "Sélection de la Technologie (Colonne 2 - Centre):",
      gen_step2_desc: "Choisissez entre On-Grid, Off-Grid ou Thermique. Vous verrez les paramètres et contrôles spécifiques pour chaque technologie.",
      gen_step3_title: "Exécuter le Dimensionnement:",
      gen_step3_desc: "Une fois les consommations ou l'inventaire ajustés, appuyez sur le bouton \"DIMENSIONNER LE SYSTÈME\". Le système exécutera le calcul en quelques millisecondes et affichera la colonne des résultats d'ingénierie.",
      gen_step4_title: "Génération du Rapport d'Ingénierie (Colonne 3 - Droite):",
      gen_step4_desc: "Vous obtiendrez le schéma unifilaire technique avec flux dynamiques animés et la possibilité de télécharger le Rapport PDF d'Ingénierie. Pour une cotation commerciale, le demandeur peut la solliciter directement via WhatsApp.",

      ongrid_title: "Saisie et Fonctionnement: Système On-Grid (Connecté au Réseau)",
      ongrid_desc: "Indiqué pour les habitations et PME en zones urbaines avec réseau électrique. Son objectif est d'annuler la facture d'électricité en injectant de l'énergie photovoltaïque.",
      ongrid_steps_title: "Étapes pour la Saisie des Données:",
      ongrid_step1_title: "1. Consommation Annuelle Moyenne (kWh/an):",
      ongrid_step1_desc: "Prenez la facture d'électricité et saisissez les kWh consommés pendant l'année. Si vous ne les connaissez pas, utilisez la moyenne estimée de 3 605 kWh/an.",
      ongrid_step2_title: "2. Couverture Solaire Recherchée (% Slider):",
      ongrid_step2_desc: "Déplacez le curseur pour définir quel pourcentage de la facture vous souhaitez annuler (70% à 90% recommandé pour un retour sur investissement optimal).",
      ongrid_step3_title: "3. Type de Réseau (Monophasé vs Triphasé):",
      ongrid_step3_desc: "Sélectionnez le type d'installation électrique existante. Le logiciel choisira automatiquement un onduleur On-Grid monophasé ou triphasé adapté.",
      ongrid_step4_title: "4. Résultats d'Injection et Amortissement:",
      ongrid_step4_desc: "Le moteur fournira la puissance photovoltaïque crête (kWp), le nombre de panneaux, la génération annuelle estimée (kWh), l'économie et le temps d'amortissement.",

      offgrid_title: "Saisie et Fonctionnement: Système Off-Grid (Autonome avec Batteries)",
      offgrid_desc: "Conçu pour les zones rurales ou isolées sans accès au réseau électrique. Fonctionne à 100% de manière indépendante en stockant l'énergie dans des batteries.",
      offgrid_steps_title: "Étapes pour Dimensionner un Système Autonome:",
      offgrid_step1_title: "1. Inventaire des Équipements et Charges:",
      offgrid_step1_desc: "Sélectionnez dans la liste ou ajoutez des équipements personnalisés (éclairage, réfrigérateur, pompe, TV), en précisant la puissance (W) et les heures d'utilisation par jour.",
      offgrid_step2_title: "2. Jours d'Autonomie (Réserve sans Soleil):",
      offgrid_step2_desc: "Ajustez de 1 à 3 jours. Cela définit combien de jours consécutifs de mauvais temps le parc de batteries alimentera l'habitation.",
      offgrid_step3_title: "3. Technologie des Batteries:",
      offgrid_step3_desc: "Lithium LiFePO4: Décharge jusqu'à 80% (DOD) et durée de vie > 10 ans. Gel / AGM: Économique, décharge conseillée à 50% (DOD).",
      offgrid_step4_title: "4. Tension du Parc (12V / 24V / 48V):",
      offgrid_step4_desc: "Le système recommande 48V pour réduire les courants élevés et utiliser des câbles standards sans surchauffe.",
      offgrid_opt_title: "Optimiseurs de Cyclage de Thermostats REDERAR:",
      offgrid_opt_desc: "Lors de la sélection de réfrigérateurs ou congélateurs, le logiciel calcule automatiquement les cycles réels d'arrêt du compresseur, réduisant le surcoût de calcul de plus de 30%.",

      thermal_title: "Saisie et Fonctionnement: Chauffe-eau Solaire (Thermique ECS)",
      thermal_desc: "Équipements de stockage et de chauffage solaire direct pour l'eau chaude sanitaire dans les logements, hôtels et vestiaires.",
      thermal_steps_title: "Étapes pour le Dimensionnement Thermique:",
      thermal_step1_title: "1. Nombre d'Occupants et Profil:",
      thermal_step1_desc: "Indiquez le nombre d'habitants. Sélectionnez profil Familial (50L/personne) ou Intense (80L/personne) pour les douches prolongées.",
      thermal_step2_title: "2. Qualité de l'Eau (Dure vs Douce):",
      thermal_step2_desc: "Si l'eau contient du calcaire ou est très minéralisée (\"Eau Dure\"), le système recommandera obligatoirement un équipement Heat Pipe Pressurisé.",
      thermal_step3_title: "3. Surpresseur et Sécurité:",
      thermal_step3_desc: "Indiquez s'il existe une pompe de surpression et si des enfants sont présents. Le cas échéant, une vanne mélangeuse thermostatique anti-brûlure sera exigée.",
      thermal_step4_title: "4. Montage en Parallèle:",
      thermal_step4_desc: "Pour des consommations > 300L, le moteur spécifie la connexion hydraulique en parallèle de plusieurs unités par boucle de retour inversé Tichelmann.",

      cred_title: "Acquisition de Crédits et Modes de Paiement",
      cred_desc: "Chaque utilisateur dispose de 3 dimensionnements d'essai gratuits par technologie. Une fois épuisés, il est possible d'acheter des packs de crédits.",
      cred_methods_title: "Moyens de Paiement Pris en Charge:",
      cred_m1_title: "🇦🇷 Argentine (Pesos / Cartes / Virement):",
      cred_m1_desc: "Génération automatique de lien de paiement par Carte de Crédit, Débit ou Virement.",
      cred_m2_title: "🌐 International (Cartes / PayPal):",
      cred_m2_desc: "Intégration directe pour les clients internationaux. Paiement sécurisé par carte bancaire internationale Visa, Mastercard ou PayPal.",
      cred_m3_title: "🪙 Cryptomonnaies (USDT / USDC On-Chain):",
      cred_m3_desc: "Transferts USDT/USDC sur réseau Polygon ou Binance Smart Chain (BSC). Entrez votre TxHash et le système valide la transaction sur la blockchain en 2 secondes.",

      wl_title: "Module Marque Blanche (White Label) pour Installateurs",
      wl_desc: "Permet aux entreprises solaires et installateurs indépendants de présenter des propositions technico-commerciales avec leur propre identité visuelle et leurs coordonnées.",
      wl_step1_title: "1. Activation et Logo:",
      wl_step1_desc: "Dans la colonne de gauche (Données du Demandeur), cochez \"Activer Marque Blanche (WL)\" et téléchargez votre fichier logo PNG ou JPG.",
      wl_step2_title: "2. Coordonnées de l'Entreprise:",
      wl_step2_desc: "Remplissez le nom commercial, l'email et le numéro WhatsApp avec l'indicatif du pays.",
      wl_step3_title: "3. Application Automatique dans les PDF:",
      wl_step3_desc: "Tous les rapports d'ingénierie et schémas unifilaires imprimés remplaceront automatiquement la marque REDERAR par votre logo et vos coordonnées.",
      wl_step4_title: "4. Bouton \"Réinitialiser les Données\":",
      wl_step4_desc: "Pour restaurer la configuration initiale, appuyez sur le bouton de réinitialisation de la marque.",

      footer: "Manuel d'Utilisation • REDERAR Sizing Engine",
      btn_understand: "Compris"
    },
    en: {
      header_title: "USER OPERATING & INSTRUCTION MANUAL",
      header_sub: "REDERAR Sizing Engine • Operating Guide",
      btn_close: "Close",
      tab1: "1. General Guide & Data",
      tab2: "2. On-Grid (Grid-Tied)",
      tab3: "3. Off-Grid (Stand-Alone)",
      tab4: "4. Solar Thermal (SWH)",
      tab5: "5. Credits & Payments",
      tab6: "6. White Label (WL)",

      gen_title: "Operation Manual & Data Entry",
      gen_desc: "This professional tool accurately and scientifically sizes requirements for solar PV and thermal systems for residential, industrial, and agricultural sites.",
      gen_workflow: "1. Recommended Workflow (Step-by-Step)",
      gen_step1_title: "Applicant Data Entry (Column 1 - Left):",
      gen_step1_desc: "Enter First Name, Last Name, Address, City, State/Province, and Country. Crucial! Selecting the Country and State automatically sets historical Peak Sun Hours (PSH) adjusted for worst winter conditions.",
      gen_step2_title: "Technology Selection (Column 2 - Center):",
      gen_step2_desc: "Choose between On-Grid, Off-Grid, or Solar Thermal. You will see specific parameters and controls for each technology.",
      gen_step3_title: "Execute System Sizing:",
      gen_step3_desc: "Once consumption or appliances are configured, click \"SIZE SYSTEM\". The system executes the calculation in milliseconds and displays engineering results.",
      gen_step4_title: "Engineering Report Generation (Column 3 - Right):",
      gen_step4_desc: "Generates animated single-line electrical diagrams and downloadable PDF Engineering Reports. Commercial quotes can be requested directly via WhatsApp.",

      ongrid_title: "Operation & Entry: On-Grid System (Grid-Tied)",
      ongrid_desc: "Designed for homes and businesses connected to the utility grid. Goal: offset electric bills by injecting solar energy.",
      ongrid_steps_title: "Steps for Data Entry:",
      ongrid_step1_title: "1. Average Annual Consumption (kWh/yr):",
      ongrid_step1_desc: "Check utility bills and enter total annual kWh consumption. If unknown, use estimated average 3,605 kWh/yr.",
      ongrid_step2_title: "2. Desired Solar Coverage (% Slider):",
      ongrid_step2_desc: "Set the percentage of electric bill you wish to offset (70%-90% recommended for optimal ROI).",
      ongrid_step3_title: "3. Grid Phase Type (Single-Phase vs Three-Phase):",
      ongrid_step3_desc: "Select existing grid configuration. The system automatically selects a single-phase or three-phase On-Grid inverter.",
      ongrid_step4_title: "4. Injection & Payback Results:",
      ongrid_step4_desc: "Calculates PV Peak Power (kWp), panel count, estimated annual generation (kWh), monetary savings, and Payback period.",

      offgrid_title: "Operation & Entry: Off-Grid System (Stand-Alone with Batteries)",
      offgrid_desc: "Designed for rural or off-grid locations. Operates 100% independently by storing energy in battery banks.",
      offgrid_steps_title: "Steps to Size a Stand-Alone System:",
      offgrid_step1_title: "1. Appliance & Load Inventory:",
      offgrid_step1_desc: "Select or add custom loads (lights, fridge, water pump, TV, etc.) specifying power (Watts) and daily operating hours.",
      offgrid_step2_title: "2. Autonomy Days (Reserve without Sun):",
      offgrid_step2_desc: "Select 1 to 3 days of autonomy. Defines how many consecutive cloudy days the battery bank feeds the home.",
      offgrid_step3_title: "3. Battery Technology:",
      offgrid_step3_desc: "Lithium LiFePO4: Up to 80% DOD, 10+ year lifespan. Gel / AGM: Cost-effective, 50% recommended DOD.",
      offgrid_step4_title: "4. Battery Bank Voltage (12V / 24V / 48V):",
      offgrid_step4_desc: "The system recommends 48V to reduce heavy currents and allow standard thinner wire gauges without overheating.",
      offgrid_opt_title: "REDERAR Thermostat Duty Cycle Optimizer:",
      offgrid_opt_desc: "For refrigerators and freezers, the software automatically calculates real compressor duty cycles, reducing calculation overcost by over 30%.",

      thermal_title: "Operation & Entry: Solar Water Heaters (Thermal SWH)",
      thermal_desc: "Direct solar water heating systems for domestic hot water in homes, hotels, and sports centers.",
      thermal_steps_title: "Steps for Solar Thermal Sizing:",
      thermal_step1_title: "1. Number of Occupants & Consumption Profile:",
      thermal_step1_desc: "Select number of residents and choose Standard Family (50L/person) or High (80L/person) profile.",
      thermal_step2_title: "2. Water Hardness (Hard vs Soft):",
      thermal_step2_desc: "If water contains scale or minerals (\"Hard Water\"), the system mandatorily specifies a Pressurized Heat Pipe collector.",
      thermal_step3_title: "3. Pressurizer Pumps & Anti-Scald Safety:",
      thermal_step3_desc: "Specify if a pressurizer pump or children are present. An anti-scald thermostatic mixing valve is mandated if required.",
      thermal_step4_title: "4. Parallel Manifold Configuration:",
      thermal_step4_desc: "For loads > 300L, the engine specifies hydraulic parallel connections using Tichelmann reverse return loops.",

      cred_title: "Credit Acquisition & Payment Channels",
      cred_desc: "Each user receives 3 free trial sizings per technology. Once used, prepaid credit packs are available.",
      cred_methods_title: "Supported Payment Methods:",
      cred_m1_title: "🇦🇷 Argentina (Pesos / Cards / Wire Transfer):",
      cred_m1_desc: "Automatic payment link generation via Credit, Debit Card or Bank Transfer.",
      cred_m2_title: "🌐 International (Credit Cards / PayPal):",
      cred_m2_desc: "Direct integration for international clients. Pay securely via Visa, Mastercard, AMEX, or PayPal.",
      cred_m3_title: "🪙 Cryptocurrency (USDT / USDC On-Chain):",
      cred_m3_desc: "USDT/USDC transfers on Polygon or BSC. Enter TxHash for instant 2-second blockchain verification.",

      wl_title: "White Label Module for Installers",
      wl_desc: "Allows solar companies and installers to deliver technical proposals featuring their own logo and contact information.",
      wl_step1_title: "1. Activation & Logo Upload:",
      wl_step1_desc: "In Column 1 (Applicant Data), check \"Enable White Label (WL)\" and upload your PNG/JPG logo.",
      wl_step2_title: "2. Corporate Contact Details:",
      wl_step2_desc: "Fill in Company Name, Email, and WhatsApp number with country code.",
      wl_step3_title: "3. Automatic PDF Branding:",
      wl_step3_desc: "All printed technical reports and single-line diagrams automatically replace REDERAR branding with your company logo.",
      wl_step4_title: "4. Reset Brand Data Button:",
      wl_step4_desc: "Use the Reset Brand Data button to restore default settings whenever needed.",

      footer: "User Operating Manual • REDERAR Sizing Engine",
      btn_understand: "Understood"
    },
    pt: {
      header_title: "MANUAL DE USO E INSTRUÇÕES OPERACIONAIS",
      header_sub: "REDERAR Sizing Engine • Guia de Operação",
      btn_close: "Fechar",
      tab1: "1. Guia Geral & Dados",
      tab2: "2. On-Grid (Conectado)",
      tab3: "3. Off-Grid (Isolado)",
      tab4: "4. Térmico (AQS)",
      tab5: "5. Créditos & Pagamentos",
      tab6: "6. Marca Branca (WL)",

      gen_title: "Manual de Funcionamento e Entrada de Dados",
      gen_desc: "Esta ferramenta profissional permite dimensionar de forma precisa e comprovada os requisitos de sistemas fotovoltaicos e térmicos.",
      gen_workflow: "1. Fluxo de Trabalho Recomendado (Passo a Passo)",
      gen_step1_title: "Entrada de Dados do Solicitante (Coluna 1 - Esquerda):",
      gen_step1_desc: "Insira Nome, Sobrenome, Endereço, Cidade, Estado e País. Crucial! A seleção de País e Estado atribui automaticamente as Horas de Sol Pico (HSP) históricas ajustadas.",
      gen_step2_title: "Seleção de Tecnologia (Coluna 2 - Centro):",
      gen_step2_desc: "Escolha entre On-Grid, Off-Grid ou Térmico. Você verá parâmetros e controles específicos para cada tecnologia.",
      gen_step3_title: "Executar Dimensionamento:",
      gen_step3_desc: "Após ajustar os consumos ou cargas, clique em \"DIMENSIONAR SISTEMA\". O cálculo é processado em milissegundos.",
      gen_step4_title: "Geração de Relatório de Engenharia (Coluna 3 - Direita):",
      gen_step4_desc: "Gera o diagrama unifilar com fluxos dinâmicos e opção de baixar o Relatório em PDF. Cotações comerciais podem ser solicitadas via WhatsApp.",

      ongrid_title: "Entrada e Operação: Sistema On-Grid (Conectado à Rede)",
      ongrid_desc: "Indicado para residências e empresas urbanas. Objetivo: neutralizar a conta de luz injetando energia fotovoltaica.",
      ongrid_steps_title: "Passos para Entrada de Dados:",
      ongrid_step1_title: "1. Consumo Médio Anual (kWh/ano):",
      ongrid_step1_desc: "Insira os kWh consumidos durante o ano conforme a conta de luz. Se não souber, use a média de 3.605 kWh/ano.",
      ongrid_step2_title: "2. Cobertura Solar Desejada (% Slider):",
      ongrid_step2_desc: "Defina a porcentagem da conta que deseja anular (70% a 90% recomendado).",
      ongrid_step3_title: "3. Tipo de Rede (Monofásica vs Trifásica):",
      ongrid_step3_desc: "Selecione a instalação existente. O software escolherá automaticamente um Inversor On-Grid adequado.",
      ongrid_step4_title: "4. Resultados de Injeção e Retorno:",
      ongrid_step4_desc: "Calcula a Potência Fotovoltaica Pico (kWp), quantidade de painéis, geração anual (kWh), economia e tempo de amortização.",

      offgrid_title: "Entrada e Operação: Sistema Off-Grid (Isolado com Baterias)",
      offgrid_desc: "Projetado para zonas rurais ou isoladas sem acesso à rede elétrica. Funciona de forma 100% independente armazenando energia em baterias.",
      offgrid_steps_title: "Passos para Dimensionar Sistema Isolado:",
      offgrid_step1_title: "1. Inventário de Cargas e Eletrodomésticos:",
      offgrid_step1_desc: "Selecione ou adicione cargas (lâmpadas, geladeira, bomba, TV), especificando a potência (W) e horas de uso diário.",
      offgrid_step2_title: "2. Dias de Autonomia (Reserva sem Sol):",
      offgrid_step2_desc: "Ajuste de 1 a 3 dias de autonomia sem sol alimentando a residência.",
      offgrid_step3_title: "3. Tecnologia de Baterias:",
      offgrid_step3_desc: "Lítio LiFePO4: Até 80% DOD, vida útil > 10 anos. Gel / AGM: Econômica, descarga recomendada de 50% DOD.",
      offgrid_step4_title: "4. Tensão do Banco (12V / 24V / 48V):",
      offgrid_step4_desc: "Recomenda-se 48V para reduzir correntes altas e permitir cabos padrão de menor seção.",
      offgrid_opt_title: "Otimizador de Ciclo de Termostatos REDERAR:",
      offgrid_opt_desc: "Para geladeiras e freezers, o software calcula os ciclos reais do compressor, reduzindo o custo de cálculo em mais de 30%.",

      thermal_title: "Entrada e Operação: Aquecedores Solares de Água (Térmico AQS)",
      thermal_desc: "Sistemas de aquecimento solar direto para água quente sanitária em residências, hotéis e vestiários.",
      thermal_steps_title: "Passos para Dimensionamento Térmico:",
      thermal_step1_title: "1. Quantidade de Pessoas e Perfil:",
      thermal_step1_desc: "Indique o número de habitantes. Escolha perfil Familiar (50L/pessoa) ou Intenso (80L/pessoa).",
      thermal_step2_title: "2. Qualidade da Água (Dura vs Aparentemente Branda):",
      thermal_step2_desc: "Se a água contiver calcário ou minerais (\"Água Dura\"), o sistema exigirá obrigatoriamente um coletor Heat Pipe Pressurizado.",
      thermal_step3_title: "3. Pressurizadores e Segurança:",
      thermal_step3_desc: "Indique se há bomba pressurizadora e crianças. Nesses casos, uma Válvula Misturadora Termostática é exigida.",
      thermal_step4_title: "4. Montagem em Paralelo:",
      thermal_step4_desc: "Para consumos > 300L, o sistema especifica a conexão hidráulica em paralelo de múltiplas unidades por retorno invertido Tichelmann.",

      cred_title: "Aquisição de Créditos e Canais de Pagamento",
      cred_desc: "Cada usuário tem 3 dimensionamentos de teste gratuitos por tecnologia. Ao esgotá-los, poderá adquirir pacotes pré-pagos.",
      cred_methods_title: "Meios de Pagamento Suportados:",
      cred_m1_title: "🇦🇷 Argentina (Pesos / Cartões / Transferência):",
      cred_m1_desc: "Geração automática de link de pagamento via Cartão de Crédito, Débito ou Transferência.",
      cred_m2_title: "🌐 Internacional (Cartões / PayPal):",
      cred_m2_desc: "Integração direta para clientes do exterior. Pagamento seguro com cartões Visa, Mastercard ou PayPal.",
      cred_m3_title: "🪙 Criptomoedas (USDT / USDC On-Chain):",
      cred_m3_desc: "Transferências em USDT/USDC na rede Polygon ou BSC. Insira seu TxHash para validação em 2 segundos.",

      wl_title: "Módulo Marca Branca (White Label) para Instaladores",
      wl_desc: "Permite a empresas de energia solar e instaladores independentes apresentar propostas técnico-comerciais com sua própria identidade visual.",
      wl_step1_title: "1. Ativação e Envio de Logo:",
      wl_step1_desc: "Na coluna esquerda, marque \"Ativar Marca Branca (WL)\" e envie seu arquivo de imagem PNG ou JPG.",
      wl_step2_title: "2. Dados Corporativos de Contato:",
      wl_step2_desc: "Preencha Nome Comercial, Email e WhatsApp com código do país.",
      wl_step3_title: "3. Aplicação Automática em PDF:",
      wl_step3_desc: "Todos os relatórios e diagramas impressos substituirão automaticamente a marca REDERAR pelo seu logotipo.",
      wl_step4_title: "4. Botão \"Limpar Dados de Marca\":",
      wl_step4_desc: "Pressione o botão para restaurar as configurações originais quando necessário.",

      footer: "Manual Operacional do Usuário • REDERAR Sizing Engine",
      btn_understand: "Entendido"
    }
  };

  const t = texts[lang] || texts["es"];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto font-sans text-left animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl bg-black border border-yellow-500/40 shadow-2xl text-white flex flex-col my-6 h-[92vh] md:h-[85vh] opacity-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
              <Book className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider">
                {t.header_title}
              </h2>
              <p className="text-[10px] text-yellow-500 font-extrabold uppercase tracking-widest font-mono">
                {t.header_sub}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 px-3 rounded-lg bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer font-bold text-xs flex items-center gap-1"
          >
            <span>{t.btn_close}</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Outer container for tabs & content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0 bg-black">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-zinc-800 p-3 gap-2 md:gap-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 bg-zinc-950 select-none scrollbar-none">
            
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "general"
                  ? "bg-yellow-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <Layout className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab1}</span>
            </button>

            <button
              onClick={() => setActiveTab("ongrid")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "ongrid"
                  ? "bg-amber-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab2}</span>
            </button>

            <button
              onClick={() => setActiveTab("offgrid")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "offgrid"
                  ? "bg-orange-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab3}</span>
            </button>

            <button
              onClick={() => setActiveTab("thermal")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "thermal"
                  ? "bg-red-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <Sun className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab4}</span>
            </button>

            <button
              onClick={() => setActiveTab("creditos")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "creditos"
                  ? "bg-emerald-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab5}</span>
            </button>

            <button
              onClick={() => setActiveTab("marca_blanca")}
              className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === "marca_blanca"
                  ? "bg-purple-500 text-black shadow-lg"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/50"
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.tab6}</span>
            </button>
            
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-zinc-300 scroll-smooth">
            
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-yellow-400 uppercase tracking-tight">{t.gen_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t.gen_desc}
                  </p>
                </div>

                {/* Paso a paso de Operación */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("pasos")}
                    className="w-full p-4 flex justify-between items-center bg-zinc-900 hover:bg-zinc-850 transition cursor-pointer"
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      {t.gen_workflow}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{expandedSection === "pasos" ? "▼" : "▲"}</span>
                  </button>

                  {expandedSection === "pasos" && (
                    <div className="p-4 space-y-3.5 border-t border-zinc-800 text-xs font-medium leading-relaxed">
                      <div className="flex gap-3">
                        <span className="w-5 h-5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</span>
                        <div>
                          <strong className="text-white">{t.gen_step1_title}</strong>
                          <p className="text-zinc-400 text-[11px] mt-0.5">{t.gen_step1_desc}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="w-5 h-5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</span>
                        <div>
                          <strong className="text-white">{t.gen_step2_title}</strong>
                          <p className="text-zinc-400 text-[11px] mt-0.5">{t.gen_step2_desc}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="w-5 h-5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</span>
                        <div>
                          <strong className="text-white">{t.gen_step3_title}</strong>
                          <p className="text-zinc-400 text-[11px] mt-0.5">{t.gen_step3_desc}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="w-5 h-5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0">4</span>
                        <div>
                          <strong className="text-white">{t.gen_step4_title}</strong>
                          <p className="text-zinc-400 text-[11px] mt-0.5">{t.gen_step4_desc}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ON-GRID TAB */}
            {activeTab === "ongrid" && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-amber-400 uppercase tracking-tight">{t.ongrid_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t.ongrid_desc}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 space-y-3 text-xs leading-relaxed">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">{t.ongrid_steps_title}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 font-medium">
                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-amber-400 block mb-1">{t.ongrid_step1_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.ongrid_step1_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-amber-400 block mb-1">{t.ongrid_step2_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.ongrid_step2_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-amber-400 block mb-1">{t.ongrid_step3_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.ongrid_step3_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-amber-400 block mb-1">{t.ongrid_step4_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.ongrid_step4_desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OFF-GRID TAB */}
            {activeTab === "offgrid" && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-orange-400 uppercase tracking-tight">{t.offgrid_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t.offgrid_desc}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 space-y-3 text-xs leading-relaxed">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">{t.offgrid_steps_title}</h4>

                  <div className="space-y-3 font-medium">
                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-orange-400 block mb-1">{t.offgrid_step1_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.offgrid_step1_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-orange-400 block mb-1">{t.offgrid_step2_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.offgrid_step2_desc}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                        <strong className="text-orange-400 block mb-1">{t.offgrid_step3_title}</strong>
                        <span className="text-[11px] text-zinc-400">{t.offgrid_step3_desc}</span>
                      </div>

                      <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                        <strong className="text-orange-400 block mb-1">{t.offgrid_step4_title}</strong>
                        <span className="text-[11px] text-zinc-400">{t.offgrid_step4_desc}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1">
                      <strong className="text-emerald-400 block text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        {t.offgrid_opt_title}
                      </strong>
                      <p className="text-[11px] text-zinc-300">{t.offgrid_opt_desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THERMAL TAB */}
            {activeTab === "thermal" && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-red-400 uppercase tracking-tight">{t.thermal_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{t.thermal_desc}</p>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 space-y-3 text-xs leading-relaxed">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">{t.thermal_steps_title}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 font-medium">
                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-red-400 block mb-1">{t.thermal_step1_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.thermal_step1_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-red-400 block mb-1">{t.thermal_step2_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.thermal_step2_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-red-400 block mb-1">{t.thermal_step3_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.thermal_step3_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-red-400 block mb-1">{t.thermal_step4_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.thermal_step4_desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CREDITOS TAB */}
            {activeTab === "creditos" && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-emerald-400 uppercase tracking-tight">{t.cred_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{t.cred_desc}</p>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 space-y-4 text-xs leading-relaxed">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-mono text-center">
                    <div className="p-2.5 bg-black border border-zinc-800 rounded-xl">
                      <span className="text-yellow-400 font-bold block">3 Pack (3C)</span>
                      <span className="text-white font-extrabold">$30 USD</span>
                      <span className="text-[8.5px] text-zinc-500 block">15 days</span>
                    </div>
                    <div className="p-2.5 bg-black border border-amber-500/40 rounded-xl bg-amber-500/5">
                      <span className="text-amber-400 font-bold block">10 Pack (10C)</span>
                      <span className="text-white font-extrabold">$50 USD</span>
                      <span className="text-[8.5px] text-zinc-400 block">30 days</span>
                    </div>
                    <div className="p-2.5 bg-black border border-zinc-800 rounded-xl">
                      <span className="text-yellow-400 font-bold block">20 Pack (20C)</span>
                      <span className="text-white font-extrabold">$75 USD</span>
                      <span className="text-[8.5px] text-zinc-500 block">60 days</span>
                    </div>
                    <div className="p-2.5 bg-black border border-emerald-500/40 rounded-xl bg-emerald-500/5">
                      <span className="text-emerald-400 font-bold block">100 Pack (100C)</span>
                      <span className="text-white font-extrabold">$100 USD</span>
                      <span className="text-[8.5px] text-zinc-400 block">90 days</span>
                    </div>
                  </div>

                  <div className="space-y-3 font-medium">
                    <h4 className="text-xs font-black uppercase text-white tracking-wider border-b border-zinc-800 pb-1">
                      {t.cred_methods_title}
                    </h4>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-emerald-400 block mb-1">{t.cred_m1_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.cred_m1_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-emerald-400 block mb-1">{t.cred_m2_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.cred_m2_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-emerald-400 block mb-1">{t.cred_m3_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.cred_m3_desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MARCA BLANCA TAB */}
            {activeTab === "marca_blanca" && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-black text-purple-400 uppercase tracking-tight">{t.wl_title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{t.wl_desc}</p>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 space-y-4 text-xs leading-relaxed">
                  <div className="space-y-3 font-medium">
                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-purple-400 block mb-1">{t.wl_step1_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.wl_step1_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-purple-400 block mb-1">{t.wl_step2_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.wl_step2_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-purple-400 block mb-1">{t.wl_step3_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.wl_step3_desc}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg">
                      <strong className="text-purple-400 block mb-1">{t.wl_step4_title}</strong>
                      <span className="text-[11px] text-zinc-400">{t.wl_step4_desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900 rounded-b-2xl shrink-0 text-xs text-zinc-400 font-bold">
          <span>{t.footer}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-black rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black shadow-md transition transform active:scale-95 cursor-pointer uppercase tracking-wider font-sans"
          >
            {t.btn_understand}
          </button>
        </div>

      </div>
    </div>
  );
}

