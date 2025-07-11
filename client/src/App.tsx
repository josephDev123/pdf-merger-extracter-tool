import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import "./App.css";
import { ThemeContextProvider } from "./context/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </BrowserRouter>
          </ThemeContextProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
