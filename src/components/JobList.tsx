
import * as React from "react";
import { Job } from "@/data/jobs";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Sparkles, Zap, Rocket } from "lucide-react";

export function JobList({
  jobs,
  sortKey,
  onDetails
}: {
  jobs: Job[];
  sortKey: string;
  onDetails: (job: Job) => void;
}) {
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc");

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortKey === "date") {
      const da = new Date(a.postedAt).getTime(), db = new Date(b.postedAt).getTime();
      return (sortOrder === "desc" ? db - da : da - db);
    }
    return 0;
  });

  return (
    <section className="flex-1 w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Compact Header */}
      <div className="relative z-10 bg-gradient-to-r from-white/95 via-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl p-4 mb-4 shadow-xl border border-white/30 group hover:shadow-2xl transition-all duration-500">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Compact animated icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-30 animate-pulse-glow"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
                <Rocket className="text-white" size={18} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recommended Jobs
                </h2>
                <Sparkles className="text-yellow-500 animate-pulse" size={16} />
              </div>
              <p className="text-gray-600 font-medium flex items-center gap-1.5 text-sm">
                <Zap className="text-blue-500" size={12} />
                AI-powered opportunities curated just for you
              </p>
            </div>
            
            {/* Compact jobs count badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-30 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110">
                {jobs.length}
              </div>
            </div>
          </div>
          
          {/* Compact sort controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Filter className="text-blue-500" size={14} />
              <span className="text-xs font-medium">Sort by:</span>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 text-blue-600 hover:text-blue-700 rounded-lg px-4 py-1.5 font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 group/sort text-xs"
              onClick={() => setSortOrder(o => o === "desc" ? "asc" : "desc")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/sort:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-1.5">
                Latest {sortOrder === "desc" ? "↓" : "↑"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Jobs grid with staggered animations */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedJobs.map((job, index) =>
          <div 
            key={job.id} 
            className="animate-fade-in stagger-item opacity-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <JobCard job={job} onDetails={onDetails} />
          </div>
        )}
      </div>
      
      {/* Enhanced empty state */}
      {jobs.length === 0 && (
        <div className="relative z-10 text-center py-16">
          <div className="relative mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            No jobs found
          </h3>
          <p className="text-gray-600 font-medium">
            Try adjusting your filters to discover more opportunities
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Sparkles className="text-yellow-500 animate-pulse" size={16} />
            <span className="text-sm text-gray-500">New jobs are added daily!</span>
          </div>
        </div>
      )}
    </section>
  );
}
