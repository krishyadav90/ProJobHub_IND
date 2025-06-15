
import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Phone, User, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, fullName } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [profileData, setProfileData] = React.useState({
    phone: "",
    profileImage: "",
    joinedDate: ""
  });
  
  const [tempData, setTempData] = React.useState(profileData);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("phone, profile_image, joined_date")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const profile = {
          phone: data.phone || "",
          profileImage: data.profile_image || "",
          joinedDate: data.joined_date ? new Date(data.joined_date).toLocaleDateString() : new Date().toLocaleDateString()
        };
        setProfileData(profile);
        setTempData(profile);
      } else {
        // No profile data exists, use defaults
        const defaultProfile = {
          phone: "",
          profileImage: "",
          joinedDate: new Date().toLocaleDateString()
        };
        setProfileData(defaultProfile);
        setTempData(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update profile data in Supabase
  const updateProfile = async (data: typeof profileData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: data.phone,
          profile_image: data.profileImage,
          joined_date: new Date().toISOString().split('T')[0] // Keep current date for joined_date
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile data",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile data",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load profile data when component mounts or user changes
  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Sync tempData with profileData when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setTempData(profileData);
    }
  }, [profileData, isEditing]);

  const handleSave = async () => {
    const success = await updateProfile(tempData);
    if (success) {
      setProfileData(tempData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing) {
          setTempData(prev => ({ ...prev, profileImage: imageUrl }));
        } else {
          // If not in editing mode, update directly
          const newData = { ...profileData, profileImage: imageUrl };
          setProfileData(newData);
          updateProfile(newData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto gradient-card rounded-2xl shadow-xl p-8 mt-8 relative z-10">
        <div className="flex items-center justify-center">
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto gradient-card rounded-2xl shadow-xl p-8 mt-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {user ? (
        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={isEditing ? tempData.profileImage : profileData.profileImage} 
                  alt="Profile" 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
              >
                <Image className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-gray-200">{fullName || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Email</label>
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-gray-200">{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                ) : (
                  <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-gray-200">{profileData.phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Member Since</label>
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-gray-200">{profileData.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Account ID</label>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <span className="text-gray-200 font-mono text-sm">{user.id}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-red-300">Not logged in.</div>
      )}
    </div>
  );
}
