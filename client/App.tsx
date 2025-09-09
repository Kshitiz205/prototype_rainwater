import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import { I18nProvider, useI18n } from "./lib/i18n";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function Header() {
  const { t, locale, setLocale } = useI18n();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary/90 text-primary-foreground grid place-items-center font-black">🌧️</div>
          <span className="text-lg font-bold tracking-tight">{t("appName")}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/resources" className="text-sm font-medium hover:text-primary">{t("viewResources")}</Link>
          <select
            aria-label={t("language")}
            className="ml-2 rounded-md border bg-background px-2 py-1 text-sm"
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          <Button asChild className="ml-2 hidden sm:inline-flex">
            <a href="#calculator">{t("getStarted")}</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} AquaHarvest • Empowering sustainable water management</p>
        <p>
          Built with Fusion Starter
        </p>
      </div>
    </footer>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/resources" element={<Resources />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
