import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { findRainfall, monthlyFromAnnual } from "@/lib/rainfall";
import { compute, type Inputs } from "@/lib/calculations";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Index() {
  const { t } = useI18n();
  const [form, setForm] = useState<Inputs>({
    name: "",
    location: "Mumbai",
    dwellers: 4,
    roofAreaM2: 100,
    openSpaceM2: 20,
    annualRainfallMM: findRainfall("Mumbai").annual_mm,
  });

  const rf = useMemo(() => findRainfall(form.location), [form.location]);
  const monthly = useMemo(() => monthlyFromAnnual(form.annualRainfallMM, rf.monthly_share), [form.annualRainfallMM, rf.monthly_share]);
  const results = useMemo(() => compute(form), [form]);

  const monthlyData = monthly.map((mm, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], mm }));

  const feasibilityLabel = results.feasibility === "feasible" ? t("feasible") : results.feasibility === "marginal" ? t("marginal") : t("notFeasible");
  const feasibilityColor = results.feasibility === "feasible" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : results.feasibility === "marginal" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";

  function onChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <main className="">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                <span>RTRWH • AR • GIS</span>
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl">
                {t("tagline")}
              </h1>
              <p className="mt-3 text-muted-foreground max-w-prose">
                Enter your building details to instantly estimate runoff, structure sizing, costs, and GIS-informed recommendations for sustainable groundwater management.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#calculator"><Button size="lg">{t("getStarted")}</Button></a>
                <a href="#results"><Button variant="outline" size="lg">{t("results")}</Button></a>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label={t("annualCapture")} value={`${results.runoffAnnualM3} m³`} />
                  <Stat label="Storage" value={`${results.storageTargetM3} m³`} />
                  <Stat label={t("roiYears")} value={results.paybackYears ?? "–"} />
                </div>
                <div className="mt-6">
                  <ChartContainer config={{ mm: { label: t("localRainfall"), color: "hsl(var(--primary))" } }}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="mm" fill="var(--color-mm)" radius={4} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator & Results */}
      <section id="calculator" className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t("basicDetails")}</CardTitle>
              <CardDescription>{t("rainfallAuto")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Aditi" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">{t("location")}</Label>
                <Input id="location" value={form.location} onChange={(e) => {
                  onChange("location", e.target.value);
                  const auto = findRainfall(e.target.value);
                  onChange("annualRainfallMM", auto.annual_mm);
                }} placeholder="City, State" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dwellers">{t("dwellers")}</Label>
                <Input id="dwellers" type="number" min={1} value={form.dwellers} onChange={(e) => onChange("dwellers", Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roof">{t("roofArea")}</Label>
                <Input id="roof" type="number" min={1} value={form.roofAreaM2} onChange={(e) => onChange("roofAreaM2", Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="open">{t("openSpace")}</Label>
                <Input id="open" type="number" min={0} value={form.openSpaceM2} onChange={(e) => onChange("openSpaceM2", Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rain">{t("rainfall")} <span className="text-xs text-muted-foreground">({t("rainfallAuto")})</span></Label>
                <Input id="rain" type="number" min={100} value={form.annualRainfallMM} onChange={(e) => onChange("annualRainfallMM", Number(e.target.value))} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setForm({ name: "", location: "Mumbai", dwellers: 4, roofAreaM2: 100, openSpaceM2: 20, annualRainfallMM: findRainfall("Mumbai").annual_mm })}>{t("reset")}</Button>
                <Button type="button" onClick={() => window.location.hash = "results"}>{t("getStarted")}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div id="results" className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t("results")}</CardTitle>
                <CardDescription>
                  {t("localRainfall")}: {form.annualRainfallMM} mm • {t("annualCapture")}: {results.runoffAnnualM3} m³
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className={`rounded-lg border p-4 ${feasibilityColor}`}>
                  <div className="text-xs uppercase tracking-wide">{t("feasibility")}</div>
                  <div className="mt-1 text-2xl font-bold">{feasibilityLabel}</div>
                </div>
                <KPI label="Runoff (m³/yr)" value={results.runoffAnnualM3} />
                <KPI label="Target storage (m³)" value={results.storageTargetM3} />
              </CardContent>
            </Card>

            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="w-full justify-start overflow-auto">
                <TabsTrigger value="recommendations">{t("recommendations")}</TabsTrigger>
                <TabsTrigger value="aquifer">{t("aquiferInfo")}</TabsTrigger>
                <TabsTrigger value="charts">{t("charts")}</TabsTrigger>
                <TabsTrigger value="map">{t("map")}</TabsTrigger>
                <TabsTrigger value="cost">{t("costBenefit")}</TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>{results.recommendation.type.replace("_", " ").toUpperCase()}</CardTitle>
                    <CardDescription>{results.recommendation.details}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    {Object.entries(results.recommendation.dimensions).map(([k, v]) => (
                      <div key={k} className="rounded-md border p-3 text-sm">
                        <div className="text-muted-foreground">{k.replaceAll("_", " ")}</div>
                        <div className="text-lg font-semibold">{v} m</div>
                      </div>
                    ))}
                    <div className="md:col-span-3">
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {results.recommendation.notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="aquifer">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("aquiferInfo")}</CardTitle>
                    <CardDescription>
                      {t("estGroundwater")}: {results.groundwaterDepthM[0]}–{results.groundwaterDepthM[1]} m (indicative)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Estimates are based on rainfall zone heuristics. For authoritative data, consult CGWB or local groundwater departments.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="charts">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("monthlyRain")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{ mm: { label: t("localRainfall"), color: "hsl(var(--primary))" } }}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid vertical={false} strokeDasharray="4 4" />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} />
                          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                          <Bar dataKey="mm" fill="var(--color-mm)" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("demandVsSupply")}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground">Demand (m³/yr)</div>
                        <div className="text-2xl font-bold">{results.demandAnnualM3}</div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground">Capturable (m³/yr)</div>
                        <div className="text-2xl font-bold">{results.runoffAnnualM3}</div>
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        Assumes per capita demand of 135 L/day.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("map")}</CardTitle>
                    <CardDescription>
                      Location map for {form.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                      <iframe
                        title="map"
                        className="h-full w-full"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(form.location)}&output=embed`}
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Map is for reference only; GIS-grade analysis can be integrated with government datasets.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cost">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("costBenefit")}</CardTitle>
                    <CardDescription>
                      CAPEX ≈ {results.costEstimateINR.toLocaleString()} {t("currencyINR")} • Annual savings ≈ {results.savingsAnnualINR.toLocaleString()} {t("currencyINR")} • {t("roiYears")}: {results.paybackYears ?? "–"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Costs are indicative and vary by city and contractor. Savings assume ₹100/m³ value of water.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
}

function KPI({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{typeof value === "number" ? value : value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4 bg-background">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
