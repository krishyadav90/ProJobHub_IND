
import { brandIcon, Job } from "@/data/jobs";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { useRef } from "react";

export function JobCard({
  job,
  onDetails
}: { job: Job, onDetails: (job: Job) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleVisitWebsite = (e: React.MouseEvent, website: string) => {
    e.stopPropagation();
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    // Smooth scroll to center the card
    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      
      // Small delay for better UX
      setTimeout(() => {
        onDetails(job);
      }, 200);
    } else {
      onDetails(job);
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    >
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-8 h-8 rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {brandIcon[job.brand] || job.company.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight">{job.company}</h3>
            <p className="text-gray-500 text-xs">{formatDate(job.postedAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors w-6 h-6"
          >
            <Bookmark size={14} />
          </Button>
          {job.website && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleVisitWebsite(e, job.website)}
              className="text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors w-6 h-6"
            >
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* Job title */}
      <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {job.role}
      </h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {job.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            +{job.tags.length - 3}
          </span>
        )}
      </div>

      {/* Job details */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-gray-600">
          <DollarSign size={12} className="text-green-500" />
          <span className="font-semibold text-green-600 text-sm">₹{job.salary.toLocaleString("en-IN")}</span>
          <span className="text-xs">/{job.salaryUnit}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-600">
          <MapPin size={12} className="text-blue-500" />
          <span className="text-xs">{job.location}</span>
        </div>
      </div>

      {/* Action button */}
      <Button 
        onClick={handleDetailsClick}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Details
      </Button>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
