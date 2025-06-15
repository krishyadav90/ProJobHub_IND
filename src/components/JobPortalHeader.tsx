
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { MapPin, Search, MessageCircle, Briefcase, HelpCircle, Home, LogOut, Menu, ChevronDown, Navigation, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface JobPortalHeaderProps {
  location: string;
  setLocation: (location: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function JobPortalHeader({ location, setLocation, currentView, setCurrentView }: JobPortalHeaderProps) {
  const { user, fullName, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState("");

  // Fetch profile image from Supabase
  const fetchProfileImage = React.useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_image")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile image:", error);
        return;
      }

      setProfileImage(data?.profile_image || "");
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  }, [user]);

  // Fetch profile image when component mounts or user changes
  React.useEffect(() => {
    if (user) {
      fetchProfileImage();
    } else {
      setProfileImage("");
    }
  }, [user, fetchProfileImage]);

  // Listen for profile updates - check every few seconds when on profile page
  React.useEffect(() => {
    if (currentView === "profile" && user) {
      const interval = setInterval(() => {
        fetchProfileImage();
      }, 2000); // Check every 2 seconds when on profile page

      return () => clearInterval(interval);
    }
  }, [currentView, user, fetchProfileImage]);

  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use a reverse geocoding API to get the location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const locationName = `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryCode || ''}`;
            setLocation(locationName);
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
    }
  };

  const popularLocations = [
    "Mumbai, MH",
    "Delhi, DL",
    "Bangalore, KA",
    "Hyderabad, TG",
    "Chennai, TN",
    "Pune, MH",
    "Kolkata, WB",
    "Ahmedabad, GJ"
  ];

  const navItems = [
    { id: "jobs", label: "Find Jobs", icon: Home },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "hiring", label: "Hiring", icon: Briefcase },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <header className="relative">
      {/* Futuristic background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl md:rounded-3xl animate-pulse"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 p-[1px]">
        <div className="h-full w-full rounded-2xl md:rounded-3xl bg-slate-900/90 backdrop-blur-xl"></div>
      </div>

      <div className="relative p-3 md:p-6">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo and Brand - Mobile Optimized */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 md:w-14 md:h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl">
                <Search className="w-4 h-4 md:w-7 md:h-7 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl md:rounded-2xl blur opacity-50 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ProJobHub
              </h1>
              <p className="text-xs md:text-sm text-cyan-300/80 font-medium">Future of Work</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-2 px-3 xl:px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/25 border border-cyan-500/30"
                      : "text-gray-300 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/20"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-sm"></div>
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-300' : ''}`} />
                  <span className="hidden xl:inline relative z-10 font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-cyan-300 hover:bg-white/5 p-2 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Right Side - Location, Profile & Logout */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Enhanced Location Dropdown - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-gray-200 hover:bg-slate-800/70 hover:border-cyan-400/50 transition-all duration-300 rounded-xl group"
                  >
                    <MapPin className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                    <span className="text-sm max-w-24 xl:max-w-32 truncate">{location}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-cyan-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 text-gray-200"
                >
                  <DropdownMenuItem 
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center gap-2 hover:bg-slate-700/70 hover:text-cyan-300 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    {isLoadingLocation ? "Getting location..." : "Use Current Location"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-600/50" />
                  <div className="px-2 py-1">
                    <Input
                      type="text"
                      placeholder="Search location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-700/50 border-slate-600/50 text-gray-200 placeholder:text-gray-400 focus:border-cyan-400/50 text-sm"
                    />
                  </div>
                  <DropdownMenuSeparator className="bg-slate-600/50" />
                  {popularLocations.map((loc) => (
                    <DropdownMenuItem 
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className="flex items-center gap-2 hover:bg-slate-700/70 hover:text-cyan-300 cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      {loc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Profile Section - Enhanced Mobile - Only show if user is logged in */}
            {user && (
              <div className="flex items-center gap-1 md:gap-3">
                {/* Profile Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("profile")}
                  className={`flex items-center gap-1 md:gap-3 px-2 md:px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentView === "profile" 
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/25" 
                      : "hover:bg-white/5 border border-transparent hover:border-purple-500/20"
                  }`}
                >
                  <Avatar className="w-6 h-6 md:w-8 md:h-8 ring-2 ring-cyan-400/50">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs md:text-sm font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-200 truncate max-w-20 xl:max-w-none">
                      {fullName || "User"}
                    </span>
                  </div>
                </Button>

                {/* Logout Button - Enhanced Mobile - Only show if user is logged in */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-200 transition-all duration-300 rounded-xl group"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline font-medium text-xs md:text-sm">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-600/30">
            <div className="flex flex-col gap-3">
              {/* Enhanced Mobile Location Dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-600/50 text-gray-200 hover:bg-slate-800/70 hover:border-cyan-400/50 transition-all duration-300 rounded-xl group justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                        <span className="text-sm truncate">{location}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 text-gray-200"
                  >
                    <DropdownMenuItem 
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700/70 hover:text-cyan-300 cursor-pointer"
                    >
                      <Navigation className="w-5 h-5" />
                      {isLoadingLocation ? "Getting location..." : "Use Current Location"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-600/50" />
                    <div className="p-3">
                      <Input
                        type="text"
                        placeholder="Search location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-700/50 border-slate-600/50 text-gray-200 placeholder:text-gray-400 focus:border-cyan-400/50"
                      />
                    </div>
                    <DropdownMenuSeparator className="bg-slate-600/50" />
                    {popularLocations.map((loc) => (
                      <DropdownMenuItem 
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-700/70 hover:text-cyan-300 cursor-pointer"
                      >
                        <Globe className="w-5 h-5" />
                        {loc}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 justify-start ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/25 border border-cyan-500/30"
                        : "text-gray-300 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/20"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
