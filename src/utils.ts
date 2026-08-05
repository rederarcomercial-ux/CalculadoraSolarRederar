import { CustomAppliance, SolarSizingResult } from "./types";

export function getCountryGridVoltage(countryName?: string, stateOrProvName?: string): {
  voltageType: "110V" | "220V";
  singlePhaseV: string;
  threePhaseV: string;
} {
  const name = (countryName || "Argentina").toLowerCase().trim();
  const prov = (stateOrProvName || "").toLowerCase().trim();

  if (name.includes("brasil") || name.includes("brazil")) {
    const is220VState = [
      "alagoas",
      "ceará",
      "ceara",
      "distrito federal",
      "goiás",
      "goias",
      "maranhão",
      "maranhao",
      "paraíba",
      "paraiba",
      "pernambuco",
      "piauí",
      "piaui",
      "rio grande do norte",
      "tocantins",
      "santa catarina"
    ].some(s => prov.includes(s));

    if (is220VState) {
      return {
        voltageType: "220V",
        singlePhaseV: "220V",
        threePhaseV: "380V",
      };
    } else {
      return {
        voltageType: "110V",
        singlePhaseV: "127V",
        threePhaseV: "220V",
      };
    }
  }

  if (
    name.includes("colombia") ||
    name.includes("méxico") ||
    name.includes("mexico") ||
    name.includes("estados unidos") ||
    name.includes("usa") ||
    name.includes("united states") ||
    name.includes("canada") ||
    name.includes("canadá") ||
    name.includes("ecuador") ||
    name.includes("panamá") ||
    name.includes("panama") ||
    name.includes("costa rica") ||
    name.includes("venezuela") ||
    name.includes("dominicana") ||
    name.includes("guatemala") ||
    name.includes("honduras") ||
    name.includes("el salvador") ||
    name.includes("nicaragua") ||
    name.includes("puerto rico") ||
    name.includes("cuba") ||
    name.includes("haití") ||
    name.includes("haiti") ||
    name.includes("jamaica") ||
    name.includes("bahamas") ||
    name.includes("barbados") ||
    name.includes("belice") ||
    name.includes("belize") ||
    name.includes("trinidad") ||
    name.includes("guyana") ||
    name.includes("aruba") ||
    name.includes("curazao") ||
    name.includes("curacao") ||
    name.includes("sint maarten") ||
    name.includes("san martín") ||
    name.includes("caimán") ||
    name.includes("cayman") ||
    name.includes("vírgenes") ||
    name.includes("virgin") ||
    name.includes("antigua") ||
    name.includes("dominica") ||
    name.includes("granada") ||
    name.includes("grenada") ||
    name.includes("cristóbal") ||
    name.includes("st. kitts") ||
    name.includes("santa lucía") ||
    name.includes("saint lucia") ||
    name.includes("san vicente") ||
    name.includes("st. vincent")
  ) {
    return {
      voltageType: "110V",
      singlePhaseV: "110V/127V",
      threePhaseV: "220V",
    };
  }

  if (
    name.includes("españa") ||
    name.includes("espana") ||
    name.includes("spain") ||
    name.includes("guayana francesa") ||
    name.includes("french guiana") ||
    name.includes("guadalupe") ||
    name.includes("guadeloupe") ||
    name.includes("martinica") ||
    name.includes("martinique")
  ) {
    return {
      voltageType: "220V",
      singlePhaseV: "230V",
      threePhaseV: "400V",
    };
  }

  return {
    voltageType: "220V",
    singlePhaseV: "220V",
    threePhaseV: "380V",
  };
}

export interface CountryFinancialConfig {
  currencySymbol: string;
  currencyCode: string;
  kwhTariffUsd: number;
  usdToLocalExchangeRate: number;
  estimatedInstallMultiplier: number;
}

export function getCountryFinancials(countryName: string = "Argentina"): CountryFinancialConfig {
  const name = (countryName || "Argentina").toLowerCase().trim();

  if (name.includes("brasil") || name.includes("brazil")) {
    return { currencySymbol: "R$", currencyCode: "BRL", kwhTariffUsd: 0.16, usdToLocalExchangeRate: 5.2, estimatedInstallMultiplier: 0.95 };
  }
  if (name.includes("chile")) {
    return { currencySymbol: "$", currencyCode: "CLP", kwhTariffUsd: 0.17, usdToLocalExchangeRate: 940, estimatedInstallMultiplier: 1.10 };
  }
  if (name.includes("colombia")) {
    return { currencySymbol: "$", currencyCode: "COP", kwhTariffUsd: 0.18, usdToLocalExchangeRate: 4000, estimatedInstallMultiplier: 0.85 };
  }
  if (name.includes("españa") || name.includes("espana") || name.includes("spain") || name.includes("guayana francesa") || name.includes("guadalupe") || name.includes("guadeloupe") || name.includes("martinica") || name.includes("martinique")) {
    return { currencySymbol: "€", currencyCode: "EUR", kwhTariffUsd: 0.24, usdToLocalExchangeRate: 0.92, estimatedInstallMultiplier: 1.25 };
  }
  if (name.includes("estados unidos") || name.includes("usa") || name.includes("united states") || name.includes("puerto rico") || name.includes("panamá") || name.includes("panama") || name.includes("ecuador") || name.includes("el salvador") || name.includes("caimán") || name.includes("cayman") || name.includes("vírgenes")) {
    return { currencySymbol: "$", currencyCode: "USD", kwhTariffUsd: 0.18, usdToLocalExchangeRate: 1.0, estimatedInstallMultiplier: 1.8 };
  }
  if (name.includes("canada") || name.includes("canadá")) {
    return { currencySymbol: "CA$", currencyCode: "CAD", kwhTariffUsd: 0.14, usdToLocalExchangeRate: 1.36, estimatedInstallMultiplier: 1.7 };
  }
  if (name.includes("méxico") || name.includes("mexico")) {
    return { currencySymbol: "$", currencyCode: "MXN", kwhTariffUsd: 0.13, usdToLocalExchangeRate: 18.0, estimatedInstallMultiplier: 0.9 };
  }
  if (name.includes("perú") || name.includes("peru")) {
    return { currencySymbol: "S/.", currencyCode: "PEN", kwhTariffUsd: 0.15, usdToLocalExchangeRate: 3.75, estimatedInstallMultiplier: 0.9 };
  }
  if (name.includes("uruguay")) {
    return { currencySymbol: "$U", currencyCode: "UYU", kwhTariffUsd: 0.22, usdToLocalExchangeRate: 40.0, estimatedInstallMultiplier: 1.2 };
  }
  if (name.includes("paraguay")) {
    return { currencySymbol: "₲", currencyCode: "PYG", kwhTariffUsd: 0.08, usdToLocalExchangeRate: 7500, estimatedInstallMultiplier: 0.8 };
  }
  if (name.includes("bolivia")) {
    return { currencySymbol: "Bs", currencyCode: "BOB", kwhTariffUsd: 0.09, usdToLocalExchangeRate: 6.9, estimatedInstallMultiplier: 0.85 };
  }
  if (name.includes("costa rica")) {
    return { currencySymbol: "₡", currencyCode: "CRC", kwhTariffUsd: 0.16, usdToLocalExchangeRate: 520, estimatedInstallMultiplier: 1.0 };
  }
  if (name.includes("guatemala")) {
    return { currencySymbol: "Q", currencyCode: "GTQ", kwhTariffUsd: 0.21, usdToLocalExchangeRate: 7.8, estimatedInstallMultiplier: 0.95 };
  }
  if (name.includes("dominicana")) {
    return { currencySymbol: "RD$", currencyCode: "DOP", kwhTariffUsd: 0.19, usdToLocalExchangeRate: 59.0, estimatedInstallMultiplier: 0.95 };
  }
  if (name.includes("honduras")) {
    return { currencySymbol: "L", currencyCode: "HNL", kwhTariffUsd: 0.20, usdToLocalExchangeRate: 24.8, estimatedInstallMultiplier: 0.9 };
  }
  if (name.includes("nicaragua")) {
    return { currencySymbol: "C$", currencyCode: "NIO", kwhTariffUsd: 0.22, usdToLocalExchangeRate: 36.6, estimatedInstallMultiplier: 0.9 };
  }
  if (name.includes("jamaica")) {
    return { currencySymbol: "J$", currencyCode: "JMD", kwhTariffUsd: 0.30, usdToLocalExchangeRate: 155, estimatedInstallMultiplier: 1.1 };
  }
  if (name.includes("trinidad")) {
    return { currencySymbol: "TT$", currencyCode: "TTD", kwhTariffUsd: 0.08, usdToLocalExchangeRate: 6.75, estimatedInstallMultiplier: 0.9 };
  }
  if (name.includes("bahamas")) {
    return { currencySymbol: "B$", currencyCode: "BSD", kwhTariffUsd: 0.32, usdToLocalExchangeRate: 1.0, estimatedInstallMultiplier: 1.5 };
  }
  if (name.includes("barbados")) {
    return { currencySymbol: "Bds$", currencyCode: "BBD", kwhTariffUsd: 0.28, usdToLocalExchangeRate: 2.0, estimatedInstallMultiplier: 1.3 };
  }

  // Default: Argentina
  return {
    currencySymbol: "$",
    currencyCode: "ARS",
    kwhTariffUsd: 0.11,
    usdToLocalExchangeRate: 1200,
    estimatedInstallMultiplier: 1.0,
  };
}

export function calculateSolarSizing(
  appliances: CustomAppliance[],
  autonomyDays: number,
  hsp: number,
  techType: "on-grid" | "off-grid" | "thermal" | null,
  personasCount: number = 4,
  anualConsumptionKwh: number = 3500,
  gridPhaseType: "monofasica" | "trifasica" = "monofasica",
  waterHardness: "blanda" | "dura" = "blanda",
  hasMinors: boolean = false,
  hasPressurizer: boolean = false,
  batteryType: "gel" | "lithium" = "gel",
  batteryVoltage: 12 | 24 | 48 = 48,
  solarCoverage: number = 80,
  thermalProfile: "familiar" | "intenso" = "familiar",
  countryName: string = "Argentina",
  stateOrProvName: string = ""
): SolarSizingResult {
  if (!techType) {
    return {
      totalWhPerDay: 0,
      panelsCount: 0,
      panelPowerW: 550,
      totalPvPowerW: 0,
      inverterPowerW: 0,
      inverterModel: "Debe seleccionar tecnología",
      batterySystemVoltage: 0,
      batteryType: "Sin selección",
      batteryCapacityAh: 0,
      batteriesTotalCount: 0,
      batteriesInSeries: 0,
      batteriesInParallel: 0,
      backupAutonomyDays: 0,
      estimatedAnualSavingsArs: 0,
      carbonOffsetTonsCo2Year: 0,
      paybackPeriodYears: 0,
      tankLiters: 0,
      collectorTubesCount: 0,
      auxiliaryHeaterPowerW: 0,
      thermalEquipments: [],
      thermalExplanation: "",
      waterHardness: "blanda",
      hasMinors: false,
      hasPressurizer: false
    };
  }

  const financials = getCountryFinancials(countryName);
  const gridV = getCountryGridVoltage(countryName, stateOrProvName);
  const is110V = gridV.voltageType === "110V";

  // Compute the raw Wh/day from appliances list
  let rawWhPerDay = 0;
  let optimizedWhPerDay = 0;
  let isThermostatOptimized = false;

  appliances.forEach((app) => {
    const rawVal = app.consumptionWh || (app.cantidad * 500 * app.hoursPerDay);
    rawWhPerDay += rawVal;

    const nameLower = app.name.toLowerCase();
    let multiplier = 1.0;

    // Detect refrigeration/freezers or climate units that automatically cycle on thermostats
    if (
      nameLower.includes("heladera") ||
      nameLower.includes("refrigerador") ||
      nameLower.includes("fridge") ||
      nameLower.includes("freezer") ||
      nameLower.includes("frezzer")
    ) {
      // Refrigerator/freezer thermostat duty cycle correction (runs ~45% of continuous rate)
      multiplier = 0.45;
      isThermostatOptimized = true;
    } else if (
      nameLower.includes("aire") ||
      nameLower.includes("split") ||
      nameLower.includes("ac") ||
      nameLower.includes("climatiz")
    ) {
      // Air conditioner splits reach target temp and cycle off (~60% duty cycle of input hrs)
      multiplier = 0.60;
      isThermostatOptimized = true;
    }

    optimizedWhPerDay += rawVal * multiplier;
  });

  const thermostatSavingsWh = Math.round(rawWhPerDay - optimizedWhPerDay);
  const panelPowerW = 550; // Standard 550W Panel
  const hspUsed = hsp;
  const winterHsp = Math.max(1.2, parseFloat((hsp * 0.65).toFixed(2)));

  if (techType === "off-grid") {
    // Sizing off-grid using the high-efficiency (thermostat-optimized) consumption
    // Strictly sized for the critical winter solar window (el más exigente día de invierno)
    const requiredPvPowerW = optimizedWhPerDay / (winterHsp * 0.75);
    let calculatedPanels = Math.ceil(requiredPvPowerW / panelPowerW);
    let panelsCountRaw = Math.max(2, calculatedPanels);

    let batterySystemVoltage = batteryVoltage;

    if (batterySystemVoltage === 24) {
      if (panelsCountRaw > 1 && panelsCountRaw % 2 !== 0) {
        panelsCountRaw += 1;
      }
    } else if (batterySystemVoltage === 12) {
      // 12V inverter: panels typically parallel
    } else {
      if (panelsCountRaw > 8) {
        let found = false;
        let testCount = panelsCountRaw;
        while (!found && testCount <= 32) {
          for (let s = 8; s >= 3; s--) {
            if (testCount % s === 0) {
              found = true;
              break;
            }
          }
          if (!found) testCount++;
        }
        panelsCountRaw = testCount;
      }
    }

    // Inverter sizing
    let inverterPowerW = 5000;
    let inverterModel = "Inversor Cargador Off-Grid 5kW";

    if (is110V) {
      if (panelsCountRaw * panelPowerW <= 1650) {
        inverterPowerW = 3000;
        inverterModel = "Inversor Cargador Off-Grid 3kW (Salida 120V CA)";
        batterySystemVoltage = 24;
      } else if (panelsCountRaw * panelPowerW <= 3300) {
        inverterPowerW = 3000;
        inverterModel = "Inversor Cargador Off-Grid 3kW (Salida 120V CA)";
        batterySystemVoltage = 48;
      } else if (panelsCountRaw * panelPowerW <= 6000) {
        inverterPowerW = 6000;
        inverterModel = "Inversor Cargador Off-Grid 6kW (Split-Phase 120V/240V)";
        batterySystemVoltage = 48;
      } else {
        inverterPowerW = 12000;
        inverterModel = "Inversores Off-Grid 12kW en Paralelo (Split-Phase 120V/240V)";
        batterySystemVoltage = 48;
      }
    } else {
      if (panelsCountRaw * panelPowerW <= 1650) {
        inverterPowerW = 3000;
        inverterModel = "Inversor Cargador Off-Grid 3kW"; // HVM for 220V systems
        batterySystemVoltage = 24;
      } else if (panelsCountRaw * panelPowerW > 6000) {
        inverterPowerW = 10000;
        inverterModel = "Inversores Off-Grid 10kW en Paralelo (Serie/Paralelo)";
        batterySystemVoltage = 48;
      }
    }

    // Dynamic panels configuration
    let panelsInSeries = 2;
    let panelsInParallel = 1;

    if (batterySystemVoltage === 24) {
      panelsInSeries = 2;
      panelsInParallel = Math.max(1, Math.ceil(panelsCountRaw / 2));
    } else if (batterySystemVoltage === 12) {
      panelsInSeries = 1;
      panelsInParallel = panelsCountRaw;
    } else {
      if (panelsCountRaw <= 8) {
        panelsInSeries = panelsCountRaw;
        panelsInParallel = 1;
      } else {
        let sSelected = 4;
        for (let s = 8; s >= 3; s--) {
          if (panelsCountRaw % s === 0) {
            sSelected = s;
            break;
          }
        }
        panelsInSeries = sSelected;
        panelsInParallel = panelsCountRaw / sSelected;
      }
    }

    const panelsCount = panelsInSeries * panelsInParallel;
    const totalPvPowerW = panelsCount * panelPowerW;

    let panelsLayout = "";
    let panelsWiringDetail = "";
    if (panelsInParallel === 1) {
      panelsLayout = `String Único de ${panelsInSeries} placas en Serie (1S)`;
      panelsWiringDetail = `Conectar los ${panelsInSeries} paneles en serie, vinculando el polo positivo (+) de un panel con el negativo (-) del siguiente. Esto suma los voltajes (~${(panelsInSeries * 41.5).toFixed(0)}V Vmp) en un único circuito de cables. Este sistema en Serie es el más eficiente porque minimiza la corriente del tramo, permitiendo usar cables más delgados (4mm² o 6mm²), reduce las pérdidas térmicas (I²R) por completo y eleva la tensión para encender el MPPT del inversor a máxima velocidad de carga.`;
    } else {
      panelsLayout = `Arreglo Mixto (${panelsInSeries}S ${panelsInParallel}P): ${panelsInParallel} hileras en paralelo de ${panelsInSeries} paneles en serie`;
      panelsWiringDetail = `Armar ${panelsInParallel} hileras (strings) independientes, conectando en cada una ${panelsInSeries} paneles en serie (positivo con negativo). Luego, unir los cables positivos de cada hilera entre sí, y los cables negativos entre sí, utilizando un par de conectores MC4 de derivación en paralelo (tipo Y) antes de ingresar al inversor. Esto mantiene la tensión óptima en ~${(panelsInSeries * 41.5).toFixed(0)}V Vmp de forma estable y suma las corrientes de carga de manera segura para el MPPT del inversor.`;
    }

    // Battery Bank sizing
    const WhPerBattery = 1200;
    const dod = batteryType === "lithium" ? 0.90 : 0.55;
    
    // For a professional off-grid system, we design the battery bank with load conservation.
    // On multiple autonomy days, users reduce non-essential consumption.
    // Therefore, we use an effective autonomy scaling factor to prevent oversized, expensive battery banks.
    const effectiveAutonomy = autonomyDays <= 1 
      ? autonomyDays 
      : 1.0 + (autonomyDays - 1) * 0.50;

    // To prevent oversized, expensive battery banks while maintaining robust backup,
    // we size the bank for 60% of the daily load (focusing on nighttime consumption and direct solar self-consumption during the day).
    const requiredBatteryEnergyWh = (((optimizedWhPerDay * 0.60) * effectiveAutonomy) / dod) * (batteryType === "lithium" ? 0.85 : 0.95);
    const idealBatteriesCount = Math.ceil(requiredBatteryEnergyWh / WhPerBattery);
    const batteriesInSeries = batterySystemVoltage / 12;
    const batteriesInParallel = Math.max(1, Math.ceil(idealBatteriesCount / batteriesInSeries));
    const batteriesTotalCount = batteriesInSeries * batteriesInParallel;

    let batteriesLayout = "";
    let batteriesWiringDetail = "";
    if (batteriesInSeries === 1) {
      if (batteriesInParallel === 1) {
        batteriesLayout = `Batería Única de 12V (1S 1P)`;
        batteriesWiringDetail = `Conexión directa del terminal positivo (+) y negativo (-) de la batería de 12V a las borneras del inversor.`;
      } else {
        batteriesLayout = `Banco en Paralelo (${batteriesInParallel}P): ${batteriesInParallel} unidades de 12V`;
        batteriesWiringDetail = `Conectar los terminales positivos de las ${batteriesInParallel} baterías entre sí, y los negativos entre sí en paralelo. Conectar la salida al inversor tomando el positivo de la primera batería y el negativo de la última para garantizar un flujo de corriente simétrico y evitar que la primera batería se desgaste más rápido.`;
      }
    } else {
      if (batteriesInParallel === 1) {
        batteriesLayout = `Banco en Serie Único (${batteriesInSeries}S 1P): ${batteriesInSeries} baterías de 12V`;
        batteriesWiringDetail = `Conectar las ${batteriesInSeries} baterías de 12V en serie (unir el positivo de la batería 1 con el negativo de la batería 2, y así sucesivamente) para alcanzar la tensión nominal del sistema de ${batterySystemVoltage}V de forma 100% limpia. Este sistema en Serie pura es el mejor porque no genera desequilibrios de resistencia interna comunes en los arreglos paralelos, garantizando una vida útil uniforme de todas las celdas.`;
      } else {
        batteriesLayout = `Arreglo Mixto (${batteriesInSeries}S ${batteriesInParallel}P): ${batteriesInParallel} ramas de ${batteriesInSeries} baterías en serie`;
        batteriesWiringDetail = `Formar ${batteriesInParallel} hileras separadas. En cada una, conectar ${batteriesInSeries} baterías de 12V en serie para sumar los ${batterySystemVoltage}V necesarios. Luego, conectar los terminales de salida de estas hileras en paralelo (positivo con positivo, negativo con negativo) para multiplicar la capacidad de almacenamiento. En este tipo de arreglos mixtos, se recomienda fuertemente el uso de puentes de cable de igual sección y longitud, y un balanceador activo de baterías de 24V/48V para prevenir derivas de tensión que dañen el banco.`;
      }
    }

    // Dynamic localized financials calculation for Off-Grid
    const panelsCost = panelsCount * 180;
    const inverterCost = inverterPowerW * 0.18;
    const batteryUnitCost = batteryType === "lithium" ? 450 : 220;
    const batteriesCost = batteriesTotalCount * batteryUnitCost;
    const bosCost = 900;
    const installBase = (panelsCount * 60) + (batteriesTotalCount * 30) + 600;
    const totalCostUsd = (panelsCost + inverterCost + batteriesCost + bosCost + installBase) * financials.estimatedInstallMultiplier;

    const annualOffGridGenKwh = (totalPvPowerW * hsp * 365 * 0.75) / 1000;
    const annualEnergyNeededKwh = (optimizedWhPerDay * 365) / 1000;
    const annualSavedKwh = Math.min(annualEnergyNeededKwh, annualOffGridGenKwh);

    const annualSavingsUsd = annualSavedKwh * financials.kwhTariffUsd;
    const estimatedAnualSavingsLocal = annualSavingsUsd * financials.usdToLocalExchangeRate;
    const estimatedCostLocal = totalCostUsd * financials.usdToLocalExchangeRate;

    const rawPayback = totalCostUsd / (annualSavingsUsd || 1);
    const paybackPeriodYears = parseFloat(Math.max(1.0, Math.min(rawPayback, 8.5)).toFixed(1));

    const carbonOffsetTonsCo2Year = parseFloat(((annualSavedKwh * 0.4) / 1000).toFixed(2));

    return {
      totalWhPerDay: Math.round(optimizedWhPerDay),
      panelsCount,
      panelPowerW,
      totalPvPowerW,
      inverterPowerW,
      inverterModel,
      
      // Battery parameters
      batterySystemVoltage,
      batteryType: batteryType === "lithium" ? "Litio LiFePO4 de Alta Eficiencia" : "Gel AGM de Ciclo Profundo",
      batteryCapacityAh: 100 * batteriesInParallel,
      batteriesTotalCount,
      batteriesInSeries,
      batteriesInParallel,
      backupAutonomyDays: autonomyDays,
      
      // Layout configurations
      panelsInSeries,
      panelsInParallel,
      panelsLayout,
      batteriesLayout,
      panelsWiringDetail,
      batteriesWiringDetail,
      originalWhPerDay: Math.round(rawWhPerDay),
      isThermostatOptimized,
      thermostatSavingsWh,

      // Localized Financials
      estimatedAnualSavingsArs: Math.round(estimatedAnualSavingsLocal),
      carbonOffsetTonsCo2Year,
      paybackPeriodYears,
      solarCoverage,

      totalCostUsd: Math.round(totalCostUsd),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      kwhTariffUsd: financials.kwhTariffUsd,
      estimatedAnualSavingsLocal: Math.round(estimatedAnualSavingsLocal),
      estimatedCostLocal: Math.round(estimatedCostLocal),
      currencySymbol: financials.currencySymbol,
      currencyCode: financials.currencyCode,

      // Thermal defaults unused
      tankLiters: 0,
      collectorTubesCount: 0,
      auxiliaryHeaterPowerW: 0,
      thermalEquipments: [],
      thermalExplanation: "",
      waterHardness: "blanda",
      hasMinors: false,
      hasPressurizer: false,
      thermalProfile,

      // HSP & Winter Solar Window
      winterHsp,
      hspUsed
    };
  } else if (techType === "on-grid") {
    const dailyTargetWh = (anualConsumptionKwh / 365) * 1000;
    const coverageFactor = solarCoverage / 100;
    const targetWhPerDay = dailyTargetWh * coverageFactor;

    // On-grid systems: sizing uses design HSP based on winter/reduced solar window to guarantee target coverage
    const designHsp = Math.max(1.5, parseFloat((hsp * 0.80).toFixed(2)));
    const requiredPvPowerW = targetWhPerDay / (designHsp * 0.82);
    let calculatedPanels = Math.ceil(requiredPvPowerW / panelPowerW);
    if (calculatedPanels > 1 && calculatedPanels % 2 !== 0) {
      calculatedPanels += 1;
    }
    const panelsCountRaw = Math.max(2, calculatedPanels);

    let panelsInSeries = panelsCountRaw;
    let panelsInParallel = 1;
    if (panelsCountRaw > 10) {
      if (panelsCountRaw % 2 === 0) {
        panelsInSeries = panelsCountRaw / 2;
        panelsInParallel = 2;
      }
    }
    const panelsCount = panelsInSeries * panelsInParallel;
    const totalPvPowerW = panelsCount * panelPowerW;

    const panelsLayout = panelsInParallel === 1
      ? `String Único Serie (${panelsInSeries} placas en Serie - 1S)`
      : `String Dual Mixto (${panelsInSeries}S 2P): 2 ramas paralelas autónomas de ${panelsInSeries} paneles cada una`;

    let inverterPowerW = 5000;
    let inverterModel = "";

    if (gridPhaseType === "trifasica") {
      if (is110V) {
        if (totalPvPowerW <= 6000) {
          inverterPowerW = 5000;
          inverterModel = "Inversor On-Grid 5kW (Inyección Trifásica 220V)";
        } else if (totalPvPowerW <= 11000) {
          inverterPowerW = 10000;
          inverterModel = "Inversor On-Grid 10kW (Inyección Trifásica 220V)";
        } else {
          inverterPowerW = 15000;
          inverterModel = "Inversor On-Grid 15kW (Inyección Trifásica 220V)";
        }
      } else {
        if (totalPvPowerW <= 6000) {
          inverterPowerW = 5000;
          inverterModel = "Inversor On-Grid 5kW (Inyección Trifásica)";
        } else if (totalPvPowerW <= 11000) {
          inverterPowerW = 10000;
          inverterModel = "Inversor On-Grid 10kW (Inyección Trifásica)";
        } else {
          inverterPowerW = 15000;
          inverterModel = "Inversor On-Grid 15kW (Inyección Trifásica)";
        }
      }
    } else {
      if (is110V) {
        if (totalPvPowerW <= 3500) {
          inverterPowerW = 3000;
          inverterModel = "Inversor On-Grid 3kW (Inyección Split-Phase 120V/240V)";
        } else if (totalPvPowerW <= 5500) {
          inverterPowerW = 5000;
          inverterModel = "Inversor On-Grid 5kW (Inyección Split-Phase 120V/240V)";
        } else {
          inverterPowerW = 8000;
          inverterModel = "Inversor On-Grid 8kW (Inyección Split-Phase 120V/240V)";
        }
      } else {
        if (totalPvPowerW <= 3500) {
          inverterPowerW = 3000;
          inverterModel = "Inversor On-Grid 3kW (Inyección Monofásica)";
        } else if (totalPvPowerW <= 5500) {
          inverterPowerW = 5000;
          inverterModel = "Inversor On-Grid 5kW (Inyección Monofásica)";
        } else {
          inverterPowerW = 8000;
          inverterModel = "Inversor On-Grid 8kW (Inyección Monofásica)";
        }
      }
    }

    // Localized Financials for On-Grid
    const annualSolarGenKwh = (totalPvPowerW * hsp * 365 * 0.82) / 1000;
    const annualSavingsUsd = Math.min(anualConsumptionKwh, annualSolarGenKwh) * financials.kwhTariffUsd;

    const panelsCost = panelsCount * 180;
    const inverterCost = inverterPowerW * 0.15;
    const bosCost = gridPhaseType === "trifasica" ? 1200 : 800;
    const installBase = (panelsCount * 50) + 500;
    const totalCostUsd = (panelsCost + inverterCost + bosCost + installBase) * financials.estimatedInstallMultiplier;

    const rawPayback = totalCostUsd / (annualSavingsUsd || 1);
    const paybackPeriodYears = parseFloat(Math.max(1.0, Math.min(rawPayback, 6.5)).toFixed(1));

    const estimatedAnualSavingsLocal = annualSavingsUsd * financials.usdToLocalExchangeRate;
    const estimatedCostLocal = totalCostUsd * financials.usdToLocalExchangeRate;

    const carbonOffsetTonsCo2Year = parseFloat(((annualSolarGenKwh * 0.4) / 1000).toFixed(2));

    return {
      totalWhPerDay: Math.round(dailyTargetWh),
      panelsCount,
      panelPowerW,
      totalPvPowerW,
      inverterPowerW,
      inverterModel,
      batterySystemVoltage: 0,
      batteryType: "Sin Baterías (Retornos de Energía)",
      batteryCapacityAh: 0,
      batteriesTotalCount: 0,
      batteriesInSeries: 0,
      batteriesInParallel: 0,
      backupAutonomyDays: 0,
      estimatedAnualSavingsArs: Math.round(estimatedAnualSavingsLocal),
      carbonOffsetTonsCo2Year,
      paybackPeriodYears,

      panelsInSeries,
      panelsInParallel,
      panelsLayout,
      batteriesLayout: "Sin Baterías",
      originalWhPerDay: Math.round(rawWhPerDay),
      isThermostatOptimized,
      thermostatSavingsWh,
      solarCoverage,

      totalCostUsd: Math.round(totalCostUsd),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      kwhTariffUsd: financials.kwhTariffUsd,
      estimatedAnualSavingsLocal: Math.round(estimatedAnualSavingsLocal),
      estimatedCostLocal: Math.round(estimatedCostLocal),
      currencySymbol: financials.currencySymbol,
      currencyCode: financials.currencyCode,

      tankLiters: 0,
      collectorTubesCount: 0,
      auxiliaryHeaterPowerW: 0,
      thermalEquipments: [],
      thermalExplanation: "",
      waterHardness: "blanda",
      hasMinors: false,
      hasPressurizer: false,
      thermalProfile,

      // HSP & Winter Solar Window
      winterHsp,
      hspUsed
    };
  } else {
    // Solar Thermal Sizing considering winter solar window (HSP)
    // Baseline standard HSP is 4.2 kWh/m²/day.
    // In locations with lower HSP (narrower winter solar window & lower solar irradiance),
    // thermal collector array capacity is oversized proportionally so hot water demand is guaranteed even in winter.
    const litersPerPerson = thermalProfile === "intenso" ? 80 : 50;
    const baseLiters = personasCount * litersPerPerson;

    // Compensating factor for lower winter HSP relative to baseline (4.2)
    const hspThermalFactor = hsp < 4.2 ? parseFloat((4.2 / Math.max(1.5, hsp)).toFixed(2)) : 1.0;
    const targetLiters = Math.round(baseLiters * hspThermalFactor);

    const thermalInfo = getThermalEquipments(targetLiters);
    
    const tankLiters = thermalInfo.totalLiters;
    const thermalEquipments = thermalInfo.equipments;
    let thermalExplanation = thermalInfo.explanation;
    if (hspThermalFactor > 1.0) {
      thermalExplanation += ` (Sobredimensionado x${hspThermalFactor.toFixed(2)} por menor ventana solar / HSP de invierno en la región: ${hsp} HSP)`;
    }

    const collectorTubesCount = tankLiters / 10;
    const auxiliaryHeaterPowerW = tankLiters >= 300 ? 2000 : 1500;

    // Localized Financials for Thermal - Optimized single-unit and modular pricing
    let heatersCost = 0;
    if (thermalEquipments && thermalEquipments.length > 0) {
      heatersCost = thermalEquipments.map(liters => {
        if (liters === 350) return 1100;
        if (liters === 300) return 950;
        if (liters === 250) return 800;
        if (liters === 200) return 650;
        return 500; // 150L
      }).reduce((a, b) => a + b, 0);
    } else {
      if (tankLiters === 350) heatersCost = 1100;
      else if (tankLiters === 300) heatersCost = 950;
      else if (tankLiters === 250) heatersCost = 800;
      else if (tankLiters === 200) heatersCost = 650;
      else heatersCost = 500; // 150L
    }

    const filterCost = waterHardness === "dura" ? 150 : 0;
    const pumpCost = hasPressurizer ? 200 : 0;
    const valveCost = hasMinors ? 80 : 0;
    const plumbingCost = 350;
    
    const totalCostUsd = (heatersCost + filterCost + pumpCost + valveCost + plumbingCost) * financials.estimatedInstallMultiplier;

    // Thermodynamic energy savings model for domestic hot water (heating water by 35°C from 15°C to 50°C, 85% annual solar fraction)
    // Energy (kWh) = Liters * 1 kg/L * 4.184 kJ/(kg*C) * 35 C / 3600 s/h = Liters * 0.04067 kWh
    const dailyLiters = personasCount * litersPerPerson;
    const annualEnergySavedKwh = dailyLiters * 0.04067 * 365 * 0.85;
    const annualSavingsUsd = annualEnergySavedKwh * financials.kwhTariffUsd;

    const rawPayback = totalCostUsd / (annualSavingsUsd || 1);
    const paybackPeriodYears = parseFloat(Math.max(0.5, Math.min(rawPayback, 4.5)).toFixed(1));

    const estimatedAnualSavingsLocal = annualSavingsUsd * financials.usdToLocalExchangeRate;
    const estimatedCostLocal = totalCostUsd * financials.usdToLocalExchangeRate;

    const carbonOffsetTonsCo2Year = parseFloat(((tankLiters * 0.9 * 365 * 0.18) / 1000).toFixed(2));

    return {
      totalWhPerDay: personasCount * 300,
      panelsCount: 0,
      panelPowerW: 0,
      totalPvPowerW: 0,
      inverterPowerW: 0,
      inverterModel: hasPressurizer 
        ? "Colector Heat Pipe REDERAR de Alta Presión" 
        : "Controlador Digital Inteligente SR609 / Atmosférico",
      batterySystemVoltage: 0,
      batteryType: "Térmico (Sin Baterías Eléctricas)",
      batteryCapacityAh: 0,
      batteriesTotalCount: 0,
      batteriesInSeries: 0,
      batteriesInParallel: 0,
      backupAutonomyDays: 0,
      estimatedAnualSavingsArs: Math.round(estimatedAnualSavingsLocal),
      carbonOffsetTonsCo2Year,
      paybackPeriodYears,

      // Thermal parameters
      tankLiters,
      collectorTubesCount,
      auxiliaryHeaterPowerW,
      thermalEquipments,
      thermalExplanation,
      waterHardness,
      hasMinors,
      hasPressurizer,
      solarCoverage,
      thermalProfile,

      totalCostUsd: Math.round(totalCostUsd),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      kwhTariffUsd: financials.kwhTariffUsd,
      estimatedAnualSavingsLocal: Math.round(estimatedAnualSavingsLocal),
      estimatedCostLocal: Math.round(estimatedCostLocal),
      currencySymbol: financials.currencySymbol,
      currencyCode: financials.currencyCode,

      // HSP & Winter Solar Window
      winterHsp,
      hspUsed
    };
  }
}

// Exact programmatic helper to calculate modular configurations of 150, 200, 250, 300, and 350 Liters
function getThermalEquipments(targetLiters: number): { equipments: number[]; explanation: string; totalLiters: number } {
  // Mapping of common volumes directly to equipment layouts for maximum realistic fidelity
  const mapping: Record<number, { equipments: number[]; explanation: string; totalLiters: number }> = {
    50: { equipments: [150], explanation: "1 de 150 Litros", totalLiters: 150 },
    100: { equipments: [150], explanation: "1 de 150 Litros", totalLiters: 150 },
    150: { equipments: [150], explanation: "1 de 150 Litros", totalLiters: 150 },
    200: { equipments: [200], explanation: "1 de 200 Litros", totalLiters: 200 },
    240: { equipments: [250], explanation: "1 de 250 Litros", totalLiters: 250 },
    250: { equipments: [250], explanation: "1 de 250 Litros", totalLiters: 250 },
    300: { equipments: [300], explanation: "1 de 300 Litros", totalLiters: 300 },
    320: { equipments: [350], explanation: "1 de 350 Litros", totalLiters: 350 },
    350: { equipments: [350], explanation: "1 de 350 Litros", totalLiters: 350 },
    400: { equipments: [200, 200], explanation: "2 de 200 Litros", totalLiters: 400 },
    450: { equipments: [250, 200], explanation: "1 de 250 Litros y 1 de 200 Litros", totalLiters: 450 },
    480: { equipments: [250, 250], explanation: "2 de 250 Litros", totalLiters: 500 },
    500: { equipments: [250, 250], explanation: "2 de 250 Litros", totalLiters: 500 },
    550: { equipments: [300, 250], explanation: "1 de 300 Litros y 1 de 250 Litros", totalLiters: 550 },
    560: { equipments: [300, 300], explanation: "2 de 300 Litros", totalLiters: 600 },
    600: { equipments: [300, 300], explanation: "2 de 300 Litros", totalLiters: 600 },
    640: { equipments: [350, 300], explanation: "1 de 350 Litros y 1 de 300 Litros", totalLiters: 650 },
    650: { equipments: [350, 300], explanation: "1 de 350 Litros y 1 de 300 Litros", totalLiters: 650 },
    700: { equipments: [350, 350], explanation: "2 de 350 Litros", totalLiters: 700 },
    725: { equipments: [250, 250, 250], explanation: "3 de 250 Litros", totalLiters: 750 },
    750: { equipments: [250, 250, 250], explanation: "3 de 250 Litros", totalLiters: 750 },
    800: { equipments: [250, 250, 250, 150], explanation: "3 de 250 Litros y 1 de 150 Litros", totalLiters: 900 }
  };

  // Find exact match or find closest higher match in mapping keys
  const keys = Object.keys(mapping).map(Number).sort((a, b) => a - b);
  const matchedKey = keys.find(k => k >= targetLiters) || keys[keys.length - 1];
  
  if (matchedKey && mapping[matchedKey]) {
    return mapping[matchedKey];
  }

  // Fallback programmatic reduction
  let remaining = targetLiters;
  const equipments: number[] = [];
  while (remaining >= 250) {
    equipments.push(250);
    remaining -= 250;
  }
  if (remaining > 200) {
    equipments.push(250);
  } else if (remaining > 150) {
    equipments.push(200);
  } else if (remaining > 0) {
    equipments.push(150);
  }

  const counts: Record<number, number> = {};
  for (const eq of equipments) {
    counts[eq] = (counts[eq] || 0) + 1;
  }
  const parts: string[] = [];
  for (const size of [150, 200, 250]) {
    if (counts[size]) {
      parts.push(`${counts[size]} ${counts[size] > 1 ? "equipos" : "equipo"} de ${size} Litros`);
    }
  }
  const explanation = parts.join(" y ") || "1 de 150 Litros";
  const totalLiters = equipments.reduce((a, b) => a + b, 0) || 150;

  return { equipments, explanation, totalLiters };
}
