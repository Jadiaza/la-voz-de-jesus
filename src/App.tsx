import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSplash } from "@/components/lvdj/AppSplash";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RadioPlayerProvider } from "@/context/RadioPlayerContext";
import Index from "./pages/Index.tsx";
import Contacto from "./pages/Contacto.tsx";
import LecturasDelDia from "./pages/LecturasDelDia.tsx";
import Programacion from "./pages/Programacion.tsx";
import Radio from "./pages/Radio.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1_350);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showSplash && <AppSplash />}
        <Toaster />
        <Sonner />
        <RadioPlayerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/lecturas-del-dia" element={<LecturasDelDia />} />
              <Route path="/programacion" element={<Programacion />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RadioPlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
