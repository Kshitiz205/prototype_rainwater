export type Inputs = {
  name: string;
  location: string;
  dwellers: number;
  roofAreaM2: number;
  openSpaceM2: number;
  annualRainfallMM: number;
};

export type Results = {
  feasibility: "feasible" | "marginal" | "not_feasible";
  runoffAnnualM3: number;
  storageTargetM3: number;
  demandAnnualM3: number;
  groundwaterDepthM: [number, number];
  recommendation: {
    type: "recharge_pit" | "recharge_trench" | "recharge_well" | "storage_tank";
    details: string;
    dimensions: Record<string, number>;
    notes: string[];
  };
  costEstimateINR: number;
  savingsAnnualINR: number;
  paybackYears: number | null;
};

export function compute(inputs: Inputs): Results {
  const c_runoff = 0.85; // typical RCC roof
  const runoffAnnualM3 = (inputs.roofAreaM2 * inputs.annualRainfallMM * c_runoff) / 1000; // m3

  const perCapitaLPerDay = 135; // CPHEEO guideline
  const demandAnnualM3 = (inputs.dwellers * perCapitaLPerDay * 365) / 1000;

  const storageTargetM3 = Math.max(1, Math.min(runoffAnnualM3 * 0.6, demandAnnualM3 * 0.5));

  let feasibility: Results["feasibility"] = "feasible";
  if (inputs.annualRainfallMM < 350 && inputs.roofAreaM2 < 30) feasibility = "marginal";
  if (inputs.annualRainfallMM < 250 && inputs.roofAreaM2 < 25 && inputs.openSpaceM2 < 5)
    feasibility = "not_feasible";

  // Groundwater depth heuristic by rainfall zone
  const r = inputs.annualRainfallMM;
  const groundwaterDepthM: [number, number] = r < 600 ? [20, 40] : r < 1200 ? [10, 25] : [5, 15];

  // Recommend structure
  let recommendation: Results["recommendation"];
  const porosity = 0.4; // gravel backfill void ratio

  if (inputs.openSpaceM2 >= 25 && storageTargetM3 >= 12) {
    // Trench: V = L * B * D * porosity
    const D = 2; // m
    const B = 0.8; // m
    const L = Math.max(3, storageTargetM3 / (B * D * porosity));
    recommendation = {
      type: "recharge_trench",
      details: "Recharge trench with perforated pipe and gravel backfill connected to roof downpipes",
      dimensions: { length_m: round1(L), width_m: B, depth_m: D },
      notes: [
        "Provide silt trap and first-flush diverter",
        "Maintain 3 m distance from building foundation",
        "Line sides with geotextile to prevent clogging",
      ],
    };
  } else if (inputs.openSpaceM2 >= 10) {
    // Pit: V = pi * d^2/4 * D * porosity
    const D = 2; // m
    const Vsolid = storageTargetM3 / porosity;
    const d = Math.sqrt((4 * Vsolid) / (Math.PI * D));
    recommendation = {
      type: "recharge_pit",
      details: "Circular recharge pit with brick lining and pebbles",
      dimensions: { diameter_m: round1(d), depth_m: D },
      notes: [
        "Provide silt trap and mesh screen",
        "Keep minimum 1 m above water table",
      ],
    };
  } else if (inputs.openSpaceM2 < 5 && storageTargetM3 >= 5) {
    // Recharge well using bore with filter media
    const D = 20; // depth m
    const dia = 0.15; // m
    recommendation = {
      type: "recharge_well",
      details: "Recharge well (bore) with filter chamber; connect overflow to storm drain",
      dimensions: { depth_m: D, diameter_m: dia },
      notes: [
        "Site near existing soakaway",
        "Ensure hydrogeological suitability and permissions",
      ],
    };
  } else {
    // Storage tank
    const H = 2; // height m
    const A = Math.max(1.5, storageTargetM3 / H);
    recommendation = {
      type: "storage_tank",
      details: "Above/underground storage tank with filtration and pump",
      dimensions: { plan_area_m2: round1(A), height_m: H },
      notes: [
        "Use food-grade tank and cover",
        "Provide first-flush and filter maintenance",
      ],
    };
  }

  // Costs
  const unitCostByType: Record<Results["recommendation"]["type"], number> = {
    recharge_trench: 3500,
    recharge_pit: 4000,
    recharge_well: 6000,
    storage_tank: 7000,
  }; // INR per m3 of target storage/recharge volume
  const capex = storageTargetM3 * unitCostByType[recommendation.type];

  const waterValueINRperM3 = 100; // saved tanker/municipal augmentation value
  const savingsAnnualINR = Math.min(runoffAnnualM3, demandAnnualM3) * waterValueINRperM3;
  const paybackYears = savingsAnnualINR > 0 ? round1(capex / savingsAnnualINR) : null;

  return {
    feasibility,
    runoffAnnualM3: round2(runoffAnnualM3),
    storageTargetM3: round2(storageTargetM3),
    demandAnnualM3: round2(demandAnnualM3),
    groundwaterDepthM,
    recommendation,
    costEstimateINR: Math.round(capex),
    savingsAnnualINR: Math.round(savingsAnnualINR),
    paybackYears,
  };
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
