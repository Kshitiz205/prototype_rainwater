export type RainfallRecord = {
  place: string;
  annual_mm: number;
  monthly_share: number[]; // 12 values summing to 1
};

// Simplified dataset for India (can be extended). Fallback used if no match.
export const RAINFALL_DB: RainfallRecord[] = [
  { place: "Mumbai", annual_mm: 2200, monthly_share: [0.01,0.01,0.01,0.03,0.12,0.25,0.28,0.22,0.05,0.01,0.00,0.01] },
  { place: "Delhi", annual_mm: 800, monthly_share: [0.02,0.02,0.02,0.03,0.08,0.22,0.32,0.18,0.07,0.03,0.01,0.00] },
  { place: "Bengaluru", annual_mm: 970, monthly_share: [0.02,0.02,0.02,0.05,0.10,0.16,0.20,0.16,0.12,0.08,0.05,0.02] },
  { place: "Chennai", annual_mm: 1400, monthly_share: [0.02,0.02,0.02,0.03,0.06,0.09,0.10,0.12,0.14,0.16,0.15,0.09] },
  { place: "Kolkata", annual_mm: 1600, monthly_share: [0.02,0.02,0.03,0.04,0.10,0.21,0.23,0.19,0.09,0.04,0.02,0.01] },
  { place: "Hyderabad", annual_mm: 780, monthly_share: [0.02,0.02,0.02,0.03,0.06,0.15,0.23,0.22,0.14,0.07,0.03,0.01] },
  { place: "Pune", annual_mm: 700, monthly_share: [0.02,0.02,0.02,0.04,0.12,0.24,0.25,0.18,0.07,0.02,0.01,0.01] },
  { place: "Jaipur", annual_mm: 650, monthly_share: [0.01,0.01,0.01,0.03,0.09,0.23,0.32,0.20,0.07,0.02,0.01,0.00] },
  { place: "Ahmedabad", annual_mm: 800, monthly_share: [0.01,0.01,0.01,0.03,0.10,0.24,0.30,0.20,0.07,0.02,0.01,0.00] },
  { place: "Lucknow", annual_mm: 1000, monthly_share: [0.02,0.02,0.02,0.03,0.08,0.20,0.27,0.22,0.09,0.04,0.01,0.00] },
];

export function findRainfall(placeInput: string): RainfallRecord {
  const p = placeInput.trim().toLowerCase();
  const exact = RAINFALL_DB.find(r => r.place.toLowerCase() === p);
  if (exact) return exact;
  const partial = RAINFALL_DB.find(r => p.includes(r.place.toLowerCase()) || r.place.toLowerCase().includes(p));
  if (partial) return partial;
  return { place: placeInput || "Your Area", annual_mm: 900, monthly_share: [0.02,0.02,0.03,0.05,0.10,0.18,0.22,0.18,0.10,0.06,0.03,0.01] };
}

export function monthlyFromAnnual(annual_mm: number, share: number[]) {
  return share.map(s => Math.round(annual_mm * s));
}
