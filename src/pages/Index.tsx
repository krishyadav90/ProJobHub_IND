import * as React from "react";
import { JobPortalHeader } from "@/components/JobPortalHeader";
import { JobSidebar } from "@/components/JobSidebar";
import { JobFiltersBar, Filters } from "@/components/JobFiltersBar";
import { JobList } from "@/components/JobList";
import { JobModal } from "@/components/JobModal";
import { MovingBackground } from "@/components/MovingBackground";
import { Footer } from "@/components/Footer";
import { jobs as jobsData, Job } from "@/data/jobs";
import Messages from "./Messages";
import Hiring from "./Hiring";
import FAQ from "./FAQ";
import Profile from "./Profile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, Users, Briefcase, Plus } from "lucide-react";

const initialFilters: Filters = {
  role: "",
  workLocation: "",
  experience: "",
  period: "",
  minSalary: 0,
  maxSalary: 999999999, // Set to a high value to avoid filtering out jobs initially
  keyword: "",
};

interface IndexProps {
  postedJobs: Job[];
  setPostedJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  allJobs: Job[];
  loading: boolean;
  requireAuth?: boolean;
}

export default function Index({ postedJobs, setPostedJobs, allJobs, loading, requireAuth = true }: IndexProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState(initialFilters);
  const [sidebarFilters, setSidebarFilters] = React.useState<Record<string, boolean>>({});
  const [jobModal, setJobModal] = React.useState<Job | null>(null);
  const [location, setLocation] = React.useState("Mumbai, MH");
  const [currentView, setCurrentView] = React.useState("jobs");

  // Debug logging for jobs
  React.useEffect(() => {
    console.log("Index - Posted jobs received:", postedJobs.length);
    console.log("Index - All jobs:", allJobs.length);
    console.log("Index - Current view:", currentView);
  }, [postedJobs, allJobs, currentView]);

  // Merge posted jobs from Supabase with static jobs, ensuring Supabase jobs appear first
  const mergedJobs = React.useMemo(() => {
    console.log("Index - Starting merge process");
    console.log("Index - All Supabase jobs count:", allJobs.length);
    console.log("Index - Static jobs count:", jobsData.length);
    
    // Filter out static jobs that might have the same IDs as Supabase jobs
    const supabaseIds = new Set(allJobs.map(j => j.id));
    const staticJobsFiltered = jobsData.filter(j => !supabaseIds.has(j.id));
    
    // Merge with Supabase jobs first
    const merged = [...allJobs, ...staticJobsFiltered];
    
    console.log("Index - Final merged jobs count:", merged.length);
    console.log("Index - Merged jobs preview:", merged.slice(0, 3).map(j => ({ id: j.id, company: j.company, role: j.role })));
    
    return merged;
  }, [allJobs]);

  // Filter the merged jobs based on current filters
  const filteredJobs = React.useMemo(() => {
    if (loading) return []; // Avoid filtering during loading

    console.log("Index - Filtering jobs, total before filter:", mergedJobs.length);
    console.log("Index - Active filters:", JSON.stringify(filters, null, 2));
    console.log("Index - Active sidebar filters:", JSON.stringify(sidebarFilters, null, 2));
    
    const filtered = mergedJobs.filter(job => {
      // Role filter
      if (filters.role && filters.role.trim() !== "") {
        if (!job.role.toLowerCase().includes(filters.role.toLowerCase())) {
          console.log(`Job ${job.id} filtered out by role: ${job.role} doesn't match ${filters.role}`);
          return false;
        }
      }
      
      // Work location filter
      if (filters.workLocation && filters.workLocation.trim() !== "") {
        if (filters.workLocation === "Remote") {
          if (!job.tags?.some(tag => 
            tag.toLowerCase().includes("remote") || 
            tag.toLowerCase().includes("distant") ||
            tag.toLowerCase().includes("work from home")
          )) {
            console.log(`Job ${job.id} filtered out by remote location`);
            return false;
          }
        } else if (filters.workLocation === "Onsite") {
          if (!job.tags?.some(tag => 
            tag.toLowerCase().includes("onsite") ||
            tag.toLowerCase().includes("office") ||
            tag.toLowerCase().includes("on-site")
          )) {
            console.log(`Job ${job.id} filtered out by onsite location`);
            return false;
          }
        }
      }
      
      // Experience filter
      if (filters.experience && filters.experience.trim() !== "") {
        const experienceKeywords = {
          "Junior": ["junior", "entry", "fresher", "trainee"],
          "Middle": ["middle", "mid", "intermediate", "experienced"],
          "Senior": ["senior", "lead", "principal", "expert"]
        };
        
        const keywords = experienceKeywords[filters.experience as keyof typeof experienceKeywords] || [filters.experience.toLowerCase()];
        const hasExperienceMatch = keywords.some(keyword => 
          job.tags?.some(tag => tag.toLowerCase().includes(keyword)) ||
          job.role.toLowerCase().includes(keyword)
        );
        
        if (!hasExperienceMatch) {
          console.log(`Job ${job.id} filtered out by experience: ${filters.experience}`);
          return false;
        }
      }
      
      // Period filter
      if (filters.period && filters.period.trim() !== "") {
        const periodLower = filters.period.toLowerCase();
        const hasMatchingPeriod = job.tags?.some(tag => 
          tag.toLowerCase().includes(periodLower)
        ) || job.employmentType?.some(type => 
          type.toLowerCase().includes(periodLower)
        );
        
        if (!hasMatchingPeriod) {
          console.log(`Job ${job.id} filtered out by period: ${filters.period}`);
          return false;
        }
      }
      
      // Keyword filter
      if (filters.keyword && filters.keyword.trim() !== "") {
        const keyword = filters.keyword.toLowerCase();
        const matchesRole = job.role.toLowerCase().includes(keyword);
        const matchesCompany = job.company.toLowerCase().includes(keyword);
        const matchesTags = job.tags?.some(tag => tag.toLowerCase().includes(keyword));
        if (!matchesRole && !matchesCompany && !matchesTags) {
          console.log(`Job ${job.id} filtered out by keyword: ${keyword}`);
          return false;
        }
      }
      
      // Salary range filter
      if (job.salary < filters.minSalary || job.salary > filters.maxSalary) {
        console.log(`Job ${job.id} filtered out by salary: ₹${job.salary}/hr not in range ₹${filters.minSalary}/hr-₹${filters.maxSalary}/hr`);
        return false;
      }
      
      // Sidebar filters
      const checkedSidebarFilters = Object.entries(sidebarFilters).filter(([_, isChecked]) => isChecked);
      if (checkedSidebarFilters.length > 0) {
        const hasMatchingSidebarFilter = checkedSidebarFilters.some(([filterKey]) => {
          return job.tags?.some(tag => 
            tag.toLowerCase().includes(filterKey.toLowerCase())
          );
        });
        if (!hasMatchingSidebarFilter) {
          console.log(`Job ${job.id} filtered out by sidebar filters`);
          return false;
        }
      }
      
      return true;
    });
    
    console.log("Index - Jobs after filtering:", filtered.length);
    if (filtered.length === 0 && mergedJobs.length > 0) {
      console.log("Index - No jobs passed filters. Filters may be too restrictive or data may be incomplete.");
    }
    return filtered;
  }, [mergedJobs, filters, sidebarFilters, loading]);

  // Handle view changes that require authentication
  const handleViewChange = (view: string) => {
    if (!user && (view === "messages" || view === "hiring" || view === "profile")) {
      navigate("/auth");
      return;
    }
    setCurrentView(view);
  };

  // Authentication Required Component
  const AuthRequiredMessage = ({ feature }: { feature: string }) => (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <Lock className="text-blue-500" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        You need to sign in to access {feature}. Join our community to unlock all features!
      </p>
      <Button 
        onClick={() => navigate("/auth")}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105"
      >
        Sign In / Sign Up
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "messages":
        if (!user) return <AuthRequiredMessage feature="messaging" />;
        return (
          <div className="animate-fade-in">
            <Messages />
          </div>
        );
      case "hiring":
        if (!user) return <AuthRequiredMessage feature="job posting" />;
        return (
          <div className="animate-fade-in">
            <Hiring postedJobs={postedJobs} setPostedJobs={setPostedJobs} />
          </div>
        );
      case "faq":
        return (
          <div className="animate-fade-in">
            <FAQ />
          </div>
        );
      case "profile":
        if (!user) return <AuthRequiredMessage feature="your profile" />;
        return (
          <div className="animate-fade-in">
            <Profile />
          </div>
        );
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-[1600px] mx-auto animate-fade-in">
            {/* Mobile Sidebar - Hidden on desktop, shown as overlay on mobile */}
            <div className="lg:hidden">
              <div className="mb-4">
                <JobSidebar filters={sidebarFilters} setFilters={setSidebarFilters} />
              </div>
            </div>
            
            {/* Desktop Sidebar */}
            <div className="hidden lg:block transform transition-all duration-300 hover:scale-[1.02]">
              <JobSidebar filters={sidebarFilters} setFilters={setSidebarFilters} />
            </div>
            
            {/* Main content with enhanced spacing and animations */}
            <main className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg border border-white/20 transform transition-all duration-300 hover:shadow-xl hover:bg-white/95">
                <JobFiltersBar filters={filters} setFilters={setFilters} />
              </div>
              
              {/* Show loading state or jobs */}
              {loading ? (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-lg border border-white/20">
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Briefcase className="text-blue-500" size={window.innerWidth < 768 ? 20 : 24} />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">Loading Jobs...</h3>
                    <p className="text-sm lg:text-base text-gray-600">Please wait while we fetch the latest opportunities</p>
                  </div>
                </div>
              ) : filteredJobs.length === 0 && !user ? (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-lg border border-white/20">
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="text-blue-500" size={window.innerWidth < 768 ? 20 : 24} />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">Discover Amazing Job Opportunities</h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-6">Sign up to view personalized job recommendations and apply to positions</p>
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                      <Button 
                        onClick={() => navigate("/auth")}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-xl font-semibold"
                      >
                        <Users className="mr-2" size={16} />
                        Sign Up
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/auth")}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl font-semibold"
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg border border-white/20 transform transition-all duration-300 hover:shadow-xl hover:bg-white/95">
                  <JobList 
                    jobs={filteredJobs} 
                    sortKey="date" 
                    onDetails={job => setJobModal(job)} 
                  />
                </div>
              )}
            </main>
          </div>
        );
    }
  };

  return (
    <>
      <MovingBackground />
      <div className="min-h-screen w-full py-4 lg:py-6 px-3 md:px-6 flex flex-col relative z-10 overflow-hidden">
        {/* Modern header container with smooth animations */}
        <div className="w-full max-w-[1600px] mx-auto transform transition-all duration-300">
          <JobPortalHeader 
            location={location} 
            setLocation={setLocation}
            currentView={currentView}
            setCurrentView={handleViewChange}
          />
        </div>
        
        {/* Main content area with modern layout and smooth transitions */}
        <div className="flex-1 flex flex-col gap-4 lg:gap-6 mt-6 lg:mt-8 overflow-hidden">
          {renderContent()}
        </div>
        
        <JobModal 
          open={!!jobModal} 
          job={jobModal} 
          onClose={() => setJobModal(null)} 
        />
        
        <Footer />
      </div>
    </>
  );
}