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
  if (loading) return <div>Loading...</div>; // Add explicit loading state
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  // Initialize state with loading indicators
  const [postedJobs, setPostedJobs] = React.useState<Job[]>([]);
  const [allJobs, setAllJobs] = React.useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = React.useState(true);

  // Load all jobs when component mounts
  React.useEffect(() => {
    let isMounted = true;

    const loadAllJobs = async () => {
      try {
        const jobs = await jobsService.getAllJobs();
        if (isMounted) {
          setAllJobs(jobs);
          console.log('App - loaded all jobs:', jobs.length);
        }
      } catch (error) {
        console.error('Error loading all jobs:', error);
      } finally {
        if (isMounted) {
          setLoadingJobs(false);
        }
      }
    };

    loadAllJobs();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  // Load user-specific jobs when user changes
  React.useEffect(() => {
    if (!user?.id) {
      setPostedJobs([]);
      return;
    }

    let isMounted = true;

    const loadUserJobs = async () => {
      try {
        const userJobs = await jobsService.getUserJobs(user.id);
        if (isMounted) {
          setPostedJobs(userJobs);
          console.log(`App - loaded jobs for user ${user.id}:`, userJobs.length);
        }
      } catch (error) {
        console.error('Error loading user jobs:', error);
        if (isMounted) {
          setPostedJobs([]);
        }
      }
    };

    loadUserJobs();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
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
        console.log('App - refreshed all jobs:', allJobs.length);
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
            loading={loadingJobs}
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;