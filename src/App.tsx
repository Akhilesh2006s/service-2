
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Organizations from "./pages/Organizations";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import { useEffect, useState, createContext } from "react";
import { seedMockProjects } from "@/data/mockData";

const queryClient = new QueryClient();

export const DataModeContext = createContext({ mode: "live", setMode: (m: string) => {} });

const App = () => {
  useEffect(() => {
    seedMockProjects();
  }, []);

  const [dataMode, setDataMode] = useState("live");

  return (
    <DataModeContext.Provider value={{ mode: dataMode, setMode: setDataMode }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Header with toggle */}
            <div className="w-full flex justify-end items-center px-6 py-2 bg-black/70 border-b border-yellow-500/20">
              <span className="text-yellow-400 mr-2 font-semibold">Data Mode:</span>
              <button
                onClick={() => setDataMode(dataMode === "live" ? "fake" : "live")}
                className={`px-3 py-1 rounded font-bold border ${dataMode === "live" ? "bg-yellow-500 text-black" : "bg-gray-700 text-yellow-400"}`}
              >
                {dataMode === "live" ? "Live Data" : "Fake Data"}
              </button>
            </div>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/employees" element={<Employees />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </DataModeContext.Provider>
  );
};

export default App;
