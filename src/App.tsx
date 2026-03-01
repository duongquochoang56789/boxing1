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
import AdminBackup from "./pages/AdminBackup";
import Profile from "./pages/Profile";
import History from "./pages/History";
import ProjectPresentation from "./pages/ProjectPresentation";
import HeroOptions from "./pages/HeroOptions";
import HeroDemo1 from "./pages/HeroDemo1";
import HeroDemo2 from "./pages/HeroDemo2";
import HeroDemo3 from "./pages/HeroDemo3";
import HeroDemo4 from "./pages/HeroDemo4";
import HeroDemo5 from "./pages/HeroDemo5";
import AIAssistant from "./pages/AIAssistant";
import SlideBuilder from "./pages/SlideBuilder";
import SlideDashboard from "./pages/SlideDashboard";
import DeckEditor from "./pages/DeckEditor";
import DeckPresent from "./pages/DeckPresent";
import SharedDeck from "./pages/SharedDeck";
import BuilderLanding from "./pages/BuilderLanding";
import BrandGenerator from "./pages/BrandGenerator";
import ZaloButton from "@/components/ui/zalo-button";
import ProjectChatbot from "@/components/ui/ProjectChatbot";
import { useAnalytics } from "@/hooks/useAnalytics";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  useAnalytics();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/builder" element={<BuilderLanding />} />
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
        <Route path="/admin/backup" element={<ProtectedRoute requireAdmin><PageTransition><AdminBackup /></PageTransition></ProtectedRoute>} />
        <Route path="/project" element={<ProjectPresentation />} />
        <Route path="/hero-options" element={<PageTransition><HeroOptions /></PageTransition>} />
        <Route path="/hero-demo/1" element={<HeroDemo1 />} />
        <Route path="/hero-demo/2" element={<HeroDemo2 />} />
        <Route path="/hero-demo/3" element={<HeroDemo3 />} />
        <Route path="/hero-demo/4" element={<HeroDemo4 />} />
        <Route path="/hero-demo/5" element={<HeroDemo5 />} />
        <Route path="/slides" element={<ProtectedRoute><SlideDashboard /></ProtectedRoute>} />
        <Route path="/slides/new" element={<ProtectedRoute><SlideBuilder /></ProtectedRoute>} />
        <Route path="/slides/shared/:slug" element={<SharedDeck />} />
        <Route path="/slides/:deckId" element={<ProtectedRoute><DeckEditor /></ProtectedRoute>} />
        <Route path="/slides/:deckId/present" element={<ProtectedRoute><DeckPresent /></ProtectedRoute>} />
        <Route 
          path="/ai-assistant" 
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          } 
        />
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
          <ProjectChatbot />
          <ZaloButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
