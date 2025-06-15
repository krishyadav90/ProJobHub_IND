
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Modal content
const learnMoreText = (
  <div>
    <div className="font-semibold mb-2">Projobhub is India's most trusted job portal for professionals and freshers.</div>
    <div>
      Connect with top companies, filter jobs easily, and track applications seamlessly. Start your dream career journey with us today!
    </div>
  </div>
);

const workingSchedules = [
  "Full time", "Part time", "Internship", "Project work", "Volunteering"
];
const employmentTypes = [
  "Full day", "Flexible schedule", "Shift work", "Distant work", "Shift method"
];

export function JobSidebar({ filters, setFilters }: { filters: Record<string, boolean>; setFilters: (f: Record<string, boolean>) => void; }) {
  const [learnMoreOpen, setLearnMoreOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [workingScheduleOpen, setWorkingScheduleOpen] = React.useState(true);
  const [employmentTypeOpen, setEmploymentTypeOpen] = React.useState(true);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const LearnMoreContent = () => (
    <>
      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        About Projobhub
      </div>
      <div className="text-gray-700 leading-relaxed text-sm mb-6">
        {learnMoreText}
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105" 
        onClick={() => setLearnMoreOpen(false)}
      >
        Close
      </Button>
    </>
  );
  
  return (
    <>
      <aside className="w-full max-w-[320px] px-4 pt-6 pb-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 flex flex-col gap-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-glow opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow animation-delay-2000 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
        </div>

        {/* Compact Promo Section */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-gray-900 to-black rounded-2xl p-4 md:p-6 text-white flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] shadow-xl border border-gray-800 overflow-hidden group/promo hover:shadow-2xl transition-all duration-500">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 opacity-0 group-hover/promo:opacity-100 transition-opacity duration-700"></div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-pink-500/50 opacity-0 group-hover/promo:opacity-100 blur-xl transition-opacity duration-700"></div>
          
          <div className="relative z-10 text-center">
            <div className="text-base md:text-lg font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-relaxed">
              Get your best profession<br />with projobhub
            </div>
            <Button
              variant="secondary"
              className="mt-2 px-4 md:px-6 py-2 bg-white text-zinc-900 font-bold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative overflow-hidden group/btn text-xs md:text-sm"
              onClick={() => setLearnMoreOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Learn more</span>
            </Button>
          </div>
        </div>

        {/* Compact Filters Section */}
        <div className="relative z-10">
          <div className="text-lg md:text-xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Filters
          </div>
          
          {/* Working Schedule Dropdown */}
          <div className="mb-6">
            <Collapsible open={workingScheduleOpen} onOpenChange={setWorkingScheduleOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200 group/trigger">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Working schedule</div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 group-hover/trigger:text-blue-500 ${workingScheduleOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2 animate-in slide-in-from-top-1 duration-200">
                {workingSchedules.map(opt => (
                  <label className="flex items-center gap-3 group/checkbox cursor-pointer p-1.5 rounded-lg hover:bg-blue-50/50 transition-all duration-200" key={opt}>
                    <Checkbox
                      checked={filters[opt] || false}
                      onCheckedChange={(checked) => setFilters({ ...filters, [opt]: !!checked })}
                      className="w-4 h-4 rounded-md border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-transparent transition-all duration-300 group-hover/checkbox:border-blue-400"
                    />
                    <span className="text-gray-700 font-medium group-hover/checkbox:text-gray-900 transition-colors duration-200 text-xs md:text-sm">{opt}</span>
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Employment Type Dropdown */}
          <div>
            <Collapsible open={employmentTypeOpen} onOpenChange={setEmploymentTypeOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200 group/trigger">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Employment type</div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 group-hover/trigger:text-blue-500 ${employmentTypeOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2 animate-in slide-in-from-top-1 duration-200">
                {employmentTypes.map(opt => (
                  <label className="flex items-center gap-3 group/checkbox cursor-pointer p-1.5 rounded-lg hover:bg-blue-50/50 transition-all duration-200" key={opt}>
                    <Checkbox
                      checked={filters[opt] || false}
                      onCheckedChange={(checked) => setFilters({ ...filters, [opt]: !!checked })}
                      className="w-4 h-4 rounded-md border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-transparent transition-all duration-300 group-hover/checkbox:border-blue-400"
                    />
                    <span className="text-gray-700 font-medium group-hover/checkbox:text-gray-900 transition-colors duration-200 text-xs md:text-sm">{opt}</span>
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </aside>

      {/* Mobile Sheet for Learn More */}
      {isMobile ? (
        <Sheet open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
          <SheetContent side="bottom" className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-t-2xl">
            <SheetHeader className="mb-4">
              <LearnMoreContent />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop Dialog positioned near button */
        <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl fixed left-4 top-1/2 -translate-y-1/2 translate-x-0 z-50">
            <DialogHeader>
              <LearnMoreContent />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
