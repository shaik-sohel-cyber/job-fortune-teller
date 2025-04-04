
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import Interview from "@/pages/Interview";
import ResultsPage from "@/pages/ResultsPage";
import NotFound from "@/pages/NotFound";
import VerificationPage from "@/pages/VerificationPage";
import AssessmentPage from "@/pages/AssessmentPage";
import PackageSelection from "@/components/PackageSelection";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Import framer-motion for animations
import { LazyMotion, domAnimation } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={domAnimation}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                
                {/* Protected routes - features that require login */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/verification" element={<VerificationPage />} />
                  <Route path="/package-selection" element={<PackageSelection />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/interview" element={<Interview />} />
                  <Route path="/results" element={<ResultsPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LazyMotion>
  </QueryClientProvider>
);

export default App;
