
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Job } from "@/data/jobs";
import { jobsService } from "@/services/jobsService";
import * as React from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  // Initialize posted jobs from Supabase
  const [postedJobs, setPostedJobs] = React.useState<Job[]>([]);
  const [allJobs, setAllJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load all jobs when component mounts
  React.useEffect(() => {
    const loadAllJobs = async () => {
      try {
        const jobs = await jobsService.getAllJobs();
        setAllJobs(jobs);
        console.log('App - loaded all jobs:', jobs.length);
      } catch (error) {
        console.error('Error loading all jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllJobs();
  }, []);

  // Load user-specific jobs when user changes
  React.useEffect(() => {
    const loadUserJobs = async () => {
      if (!user?.id) {
        setPostedJobs([]);
        return;
      }

      try {
        const userJobs = await jobsService.getUserJobs(user.id);
        setPostedJobs(userJobs);
        console.log(`App - loaded jobs for user ${user.id}:`, userJobs.length);
      } catch (error) {
        console.error('Error loading user jobs:', error);
        setPostedJobs([]);
      }
    };

    if (user?.id) {
      loadUserJobs();
    }
  }, [user?.id]);

  // Enhanced setPostedJobs that updates both local state and Supabase
  const updatePostedJobs = React.useCallback(async (newJobs: Job[] | ((prev: Job[]) => Job[])) => {
    if (!user?.id) return;
    
    setPostedJobs(prev => {
      const updated = typeof newJobs === 'function' ? newJobs(prev) : newJobs;
      console.log(`App - jobs updated for user ${user.id}:`, updated.length);
      
      // Refresh all jobs to show the latest data
      jobsService.getAllJobs().then(allJobs => {
        setAllJobs(allJobs);
      });
      
      return updated;
    });
  }, [user?.id]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <Index 
            postedJobs={postedJobs} 
            setPostedJobs={updatePostedJobs}
            allJobs={allJobs}
            loading={loading}
            requireAuth={false}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
