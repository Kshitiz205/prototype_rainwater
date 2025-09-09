import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Locale = "en" | "hi";

type Dict = Record<string, string>;

type I18nContextType = {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const dictionaries: Record<Locale, Dict> = {
  en: {
    appName: "AquaHarvest",
    tagline: "On-spot assessment for rooftop rainwater harvesting & recharge",
    getStarted: "Calculate",
    basicDetails: "Basic Details",
    name: "Name",
    location: "Location",
    dwellers: "Number of dwellers",
    roofArea: "Roof area (m²)",
    openSpace: "Available open space (m²)",
    rainfall: "Annual rainfall (mm)",
    optional: "optional",
    results: "Results",
    feasibility: "Feasibility Check",
    feasible: "Feasible",
    marginal: "Marginal",
    notFeasible: "Not feasible",
    recommendations: "Recommendations",
    aquiferInfo: "Aquifer & Groundwater Depth (indicative)",
    localRainfall: "Local Rainfall",
    runoffCapacity: "Runoff Capacity",
    structureDesign: "Recommended Structure Dimensions",
    costBenefit: "Cost–Benefit",
    map: "Map",
    charts: "Charts",
    language: "Language",
    rainfallAuto: "Auto by location (editable)",
    reset: "Reset",
    save: "Save",
    monthlyRain: "Estimated Monthly Rainfall",
    demandVsSupply: "Demand vs Capturable Runoff",
    annualCapture: "Annual capturable runoff",
    perCapita: "Per capita daily demand (L)",
    estGroundwater: "Estimated groundwater depth",
    roiYears: "Estimated payback (years)",
    currencyINR: "INR",
    viewResources: "Resources",
  },
  hi: {
    appName: "जलसंचय",
    tagline: "छत वर्षा जल संचयन व रिचार्ज के लिए त्वरित आकलन",
    getStarted: "गणना करें",
    basicDetails: "मूल विवरण",
    name: "नाम",
    location: "स्थान",
    dwellers: "रहने वाले लोगों की संख्या",
    roofArea: "छत क्षेत्र (मी²)",
    openSpace: "उपलब्ध खुला स्थान (मी²)",
    rainfall: "वार्षिक वर्षा (मिमी)",
    optional: "वैकल्पिक",
    results: "परिणाम",
    feasibility: "व्यवहार्यता",
    feasible: "उपयुक्त",
    marginal: "सीमांत",
    notFeasible: "उपयुक्त नहीं",
    recommendations: "सिफारिशें",
    aquiferInfo: "भू-जलभृत व भूजल गहराई (संकेतात्मक)",
    localRainfall: "स्थानीय वर्षा",
    runoffCapacity: "रनऑफ क्षमता",
    structureDesign: "सुझाए गए ढांचे के आयाम",
    costBenefit: "लागत–लाभ",
    map: "मानचित्र",
    charts: "चार्ट",
    language: "भाषा",
    rainfallAuto: "स्थान के अनुसार स्वतः (बदला जा सकता है)",
    reset: "रीसेट",
    save: "सेव",
    monthlyRain: "अनुमानित मासिक वर्षा",
    demandVsSupply: "मांग बनाम प्राप्त रनऑफ",
    annualCapture: "वार्षिक प्राप्त रनऑफ",
    perCapita: "प्रति व्यक्ति दैनिक मांग (ली.)",
    estGroundwater: "अनुमानित भूजल गहराई",
    roiYears: "पेबैक (वर्ष)",
    currencyINR: "₹",
    viewResources: "संसाधन",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
