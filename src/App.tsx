import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RouteScroll from "@/components/RouteScroll";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import AdminApp from "@/admin/AdminApp";

const queryClient = new QueryClient();

/**
 * The local content editor is development-only, and is kept out of production in
 * two independent ways:
 *
 *   1. this route is behind import.meta.env.DEV, which Vite replaces with the
 *      literal false in a production build, and
 *   2. vite.config.ts aliases "@/admin/AdminApp" to a stub for production, so
 *      the real editor and its network calls never enter the bundle at all.
 *
 * The dev server endpoints it talks to are also registered only in serve mode.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteScroll />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          {import.meta.env.DEV && <Route path="/admin/*" element={<AdminApp />} />}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
