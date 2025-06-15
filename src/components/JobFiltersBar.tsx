
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Sparkles, Zap } from "lucide-react";
import * as React from "react";

export interface Filters {
  role: string;
  workLocation: string;
  experience: string;
  period: string;
  minSalary: number;
  maxSalary: number;
  keyword: string;
}

const roleOptions = ["Designer", "Developer", "Manager"];
const locationOptions = ["Remote", "Onsite", "Hybrid"];
const expOptions = ["Junior", "Middle", "Senior"];
const periodOptions = ["Full time", "Part time", "Project work", "Internship", "Volunteering"];

export function JobFiltersBar({
  filters,
  setFilters
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const minSlider = 0, maxSlider = 500000;
  
  return (
    <section className="w-full rounded-2xl px-6 py-4 flex flex-col gap-4 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/90 backdrop-blur-xl shadow-xl border border-white/30 relative z-10 transition-all duration-500 hover:shadow-2xl hover:from-white/98 hover:via-white/95 hover:to-blue-50/95 group overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse-glow opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-64 h-64 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse-glow animation-delay-2000 opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
      </div>

      {/* Compact Search Bar */}
      <div className="relative w-full">
        <div className="relative w-full max-w-xl mx-auto group/search">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-lg opacity-0 group-hover/search:opacity-100 transition-all duration-500 scale-105"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-full border border-transparent bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 p-0.5 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/search:border-blue-400/30">
            <div className="relative flex items-center bg-white rounded-full overflow-hidden">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-md group-hover/search:shadow-lg transition-all duration-300 group-hover/search:scale-105">
                <Search className="text-white transition-all duration-300 group-hover/search:rotate-12" size={16} />
              </div>
              <input
                type="text"
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-transparent focus:outline-none placeholder-gray-400 transition-all duration-300"
                placeholder="🚀 Discover your dream job..."
                value={filters.keyword}
                onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              />
              <div className="px-3">
                <Sparkles className="text-blue-400 animate-pulse" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filter Controls Grid */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
            <Filter className="text-white" size={12} />
          </div>
          <h3 className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Smart Filters
          </h3>
          <Zap className="text-yellow-500 animate-pulse" size={12} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-start">
          {/* Role Filter */}
          <div className="group/filter transform transition-all duration-300 hover:scale-105">
            <FuturisticDropdownSelect 
              label="Role" 
              options={roleOptions} 
              value={filters.role} 
              onChange={v => setFilters({ ...filters, role: v })}
              icon="💼"
            />
          </div>

          {/* Work Location Filter */}
          <div className="group/filter transform transition-all duration-300 hover:scale-105">
            <FuturisticDropdownSelect 
              label="Work Location" 
              options={locationOptions} 
              value={filters.workLocation} 
              onChange={v => setFilters({ ...filters, workLocation: v })}
              icon="🌍"
            />
          </div>

          {/* Experience Filter */}
          <div className="group/filter transform transition-all duration-300 hover:scale-105">
            <FuturisticDropdownSelect 
              label="Experience" 
              options={expOptions} 
              value={filters.experience} 
              onChange={v => setFilters({ ...filters, experience: v })}
              icon="⭐"
            />
          </div>

          {/* Period Filter */}
          <div className="group/filter transform transition-all duration-300 hover:scale-105">
            <FuturisticDropdownSelect 
              label="Period" 
              options={periodOptions} 
              value={filters.period} 
              onChange={v => setFilters({ ...filters, period: v })}
              icon="⏰"
            />
          </div>

          {/* Compact Salary Range */}
          <div className="sm:col-span-2 lg:col-span-1 group/filter transform transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-xl blur-md opacity-0 group-hover/filter:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-md hover:shadow-lg transition-all duration-500 group-hover/filter:bg-white/95">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">💰</span>
                  <span className="text-gray-700 text-xs font-bold">Salary Range</span>
                </div>
                <div className="space-y-2">
                  <Slider
                    min={minSlider}
                    max={maxSlider}
                    step={10000}
                    value={[filters.minSalary, filters.maxSalary]}
                    onValueChange={([min, max]) => setFilters({ ...filters, minSalary: min, maxSalary: max })}
                    className="w-full"
                  />
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500 mb-0.5">Min</div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-bold text-xs">
                        ₹{(filters.minSalary / 100000).toFixed(1)}L
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500 mb-0.5">Max</div>
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-xs">
                        ₹{(filters.maxSalary / 100000).toFixed(1)}L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FuturisticDropdownSelect({ 
  label, 
  options, 
  value, 
  onChange,
  icon
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (v: string) => void;
  icon: string;
}) {
  return (
    <div className="relative group/select">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-xl blur-md opacity-0 group-hover/select:opacity-100 transition-all duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-md hover:shadow-lg transition-all duration-500 group-hover/select:bg-white/95">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{icon}</span>
          <span className="text-gray-700 text-xs font-bold transition-colors duration-300 group-hover/select:text-gray-800">{label}</span>
        </div>
        <select
          className="w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-700 font-medium transition-all duration-300 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow-md appearance-none group-hover/select:scale-[1.01] text-xs"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 8px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '12px'
          }}
        >
          <option value="">Any</option>
          {options.map(o => <option value={o} key={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
