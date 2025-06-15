import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Building, ExternalLink, X, Bookmark } from "lucide-react";
import { Job } from "@/data/jobs";

interface JobModalProps {
  open: boolean;
  job: Job | null;
  onClose: () => void;
}

export function JobModal({ open, job, onClose }: JobModalProps) {
  if (!job) return null;

  const handleVisitWebsite = (website: string) => {
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default behavior
    onClose(); // Trigger close
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-[90vw] max-h-[80vh] bg-white border border-gray-100 shadow-xl rounded-2xl p-0 overflow-hidden fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] sm:max-w-lg">
        <DialogHeader className="p-4 pb-0 relative">
          <DialogTitle className="sr-only">Job Details</DialogTitle>
          <DialogClose 
            onClick={handleClose}
            onMouseDown={handleClose}
            onTouchStart={handleClose}
            className="absolute right-4 top-4 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 w-8 h-8 flex items-center justify-center z-20 cursor-pointer"
            aria-label="Close job details modal"
          >
            <X className="h-4 w-4 text-gray-600" />
          </DialogClose>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-60px)] px-5 pb-5">
          <div className="space-y-4">
            {/* Header section */}
            <div className="flex items-start justify-between pr-12">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {job.companyLogo ? (
                    <img 
                      src={job.companyLogo} 
                      alt={`${job.company} logo`} 
                      className="w-10 h-10 rounded-md object-cover shadow-sm transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 mb-0.5 tracking-tight">{job.role}</h1>
                  <p className="text-sm font-medium text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-400">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-xs px-2.5 py-1"
                  aria-label="Save job"
                >
                  <Bookmark size={12} className="mr-1" />
                  Save
                </Button>
                {job.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisitWebsite(job.website)}
                    className="text-gray-600 border-gray-200 hover:text-green-600 hover:bg-green-50 hover:border-green-300 transition-colors duration-200 text-xs px-2.5 py-1"
                    aria-label="Visit company website"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Visit
                  </Button>
                )}
              </div>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <DollarSign size={14} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="font-semibold text-green-700 text-sm">₹{job.salary.toLocaleString("en-IN")}/{job.salaryUnit}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <MapPin size={14} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-blue-700 text-sm">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <Building size={14} className="text-indigo-600" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-semibold text-indigo-700 text-sm">{job.company}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map(tag => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors duration-200 text-xs font-medium cursor-default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            {job.employmentType && job.employmentType.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Employment Type</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.employmentType.map(type => (
                    <Badge 
                      key={type}
                      variant="outline"
                      className="px-2 py-0.5 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-xs font-medium"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Job Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Job Description</h3>
              <div className="prose prose-sm prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {job.details || `We are looking for a talented ${job.role} to join our team at ${job.company}. This is an exciting opportunity to work with cutting-edge technologies and contribute to meaningful projects.`}
                </p>
              </div>
            </div>

            {/* Apply button */}
            <div className="pt-3 border-t border-gray-100">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                size="default"
                aria-label="Apply for this job"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}