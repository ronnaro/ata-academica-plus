
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import SemesterPage from "./pages/SemesterPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfessorsPage from "./pages/ProfessorsPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import CertificatesPage from "./pages/CertificatesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/professors" element={
                <RequireAuth requireCoordinator={true}>
                  <ProfessorsPage />
                </RequireAuth>
              } />
              <Route path="/meetings/:id" element={
                <RequireAuth>
                  <MeetingDetailPage />
                </RequireAuth>
              } />
              <Route path="/certificates" element={
                <RequireAuth>
                  <CertificatesPage />
                </RequireAuth>
              } />
              <Route path="/settings" element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              } />
              <Route path="/semesters" element={
                <RequireAuth requireCoordinator={true}>
                  <SemesterPage />
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
