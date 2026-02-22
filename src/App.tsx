import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import BookPT from "./pages/BookPT";
import NotFound from "./pages/NotFound";
import AdminContent from "./pages/AdminContent";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import History from "./pages/History";
import ProjectPresentation from "./pages/ProjectPresentation";
import ZaloButton from "@/components/ui/zalo-button";
import { useAnalytics } from "@/hooks/useAnalytics";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  useAnalytics();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute>
              <PageTransition><Schedule /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book-pt" 
          element={
            <ProtectedRoute>
              <PageTransition><BookPT /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>}
        />
        <Route 
          path="/history" 
          element={<ProtectedRoute><PageTransition><History /></PageTransition></ProtectedRoute>}
        />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/admin/content" element={<PageTransition><AdminContent /></PageTransition>} />
        <Route path="/project" element={<ProjectPresentation />} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <ZaloButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
