import * as React from "react";
import { Job } from "@/data/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Users, Zap, Building2, Clock, ExternalLink, Globe, Trash2, TrendingUp, Upload, Image } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { jobsService } from "@/services/jobsService";
import { toast } from "sonner";

export interface HiringProps {
  postedJobs: Job[];
  setPostedJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export default function Hiring({ postedJobs, setPostedJobs }: HiringProps) {
  const { user } = useAuth();
  const [allUserJobs, setAllUserJobs] = React.useState<Job[]>([]);

  // Load all users' jobs for the recommended section (excluding current user's jobs)
  React.useEffect(() => {
    const loadAllUserJobs = async () => {
      try {
        const allJobs = await jobsService.getAllJobs();
        // Filter out current user's jobs
        const otherUsersJobs = allJobs.filter(job => {
          // Check if this job belongs to current user by comparing with postedJobs
          return !postedJobs.some(userJob => userJob.id === job.id);
        });
        setAllUserJobs(otherUsersJobs);
        console.log("Hiring - Loaded jobs from other users:", otherUsersJobs.length);
      } catch (error) {
        console.error("Error loading jobs from other users:", error);
      }
    };

    loadAllUserJobs();
  }, [postedJobs]);

  const initialForm = {
    company: "",
    role: "",
    location: "",
    salary: "",
    salaryUnit: "hr",
    tags: "",
    details: "",
    workLocation: "",
    experience: "",
    period: "",
    internship: "",
    employmentType: "",
    website: "",
    companyLogo: ""
  };
  
  const [form, setForm] = React.useState(initialForm);
  const [success, setSuccess] = React.useState("");
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setForm({ ...form, companyLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.company || !form.role || !form.salary || !user?.id) {
      setSuccess("Please fill all required fields (company, role, salary).");
      return;
    }

    setSubmitting(true);

    const tagArr = [
      form.workLocation, 
      form.experience, 
      form.period, 
      form.internship, 
      ...(form.tags.split(",").map(t => t.trim()).filter(Boolean))
    ].filter(Boolean);

    const empTypeArr = [
      form.employmentType, 
      form.internship, 
      form.period, 
      form.workLocation, 
      form.experience
    ].filter(Boolean);

    const newJob: Job = {
      id: "posted_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      company: form.company,
      companyLogo: form.companyLogo,
      role: form.role,
      tags: tagArr,
      salary: Number(form.salary),
      salaryUnit: form.salaryUnit,
      postedAt: new Date().toISOString().split("T")[0],
      location: form.location || "India",
      employmentType: empTypeArr,
      details: form.details,
      brand: "apple",
      color: "bg-blue-50",
      website: form.website
    };

    try {
      console.log("Hiring - Creating new job:", newJob);
      const createdJob = await jobsService.createJob(newJob, user.id);
      
      if (createdJob) {
        setPostedJobs(prevJobs => [createdJob, ...prevJobs]);
        setForm(initialForm);
        setLogoPreview(null);
        setSuccess("Job posted successfully!");
        toast.success("Job posted successfully!");
      } else {
        setSuccess("Failed to post job. Please try again.");
        toast.error("Failed to post job. Please try again.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setSuccess("Failed to post job. Please try again.");
      toast.error("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    if (!user?.id) return;

    try {
      const success = await jobsService.deleteJob(jobId, user.id);
      
      if (success) {
        setPostedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        setSuccess("Job posting removed successfully!");
        toast.success("Job posting removed successfully!");
      } else {
        setSuccess("Failed to remove job. Please try again.");
        toast.error("Failed to remove job. Please try again.");
      }
    } catch (error) {
      console.error("Error removing job:", error);
      setSuccess("Failed to remove job. Please try again.");
      toast.error("Failed to remove job. Please try again.");
    }
  };

  const handleVisitWebsite = (website: string) => {
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Future Hiring Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Post jobs and discover top talent in our next-generation recruitment platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Posting Form */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                Create Job Posting
              </CardTitle>
              <p className="text-gray-300">Fill out the details below to post your job opening</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Logo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Company Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-20 h-20 bg-white/10 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </label>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p>Upload company logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company *
                    </label>
                    <Input
                      placeholder="Company name"
                      value={form.company}
                      onChange={e => handleChange("company", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Role *
                    </label>
                    <Input
                      placeholder="Job title"
                      value={form.role}
                      onChange={e => handleChange("role", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <Input
                      placeholder="City, Country"
                      value={form.location}
                      onChange={e => handleChange("location", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Salary (₹) *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={form.salary}
                        onChange={e => handleChange("salary", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                        required
                        min="1"
                      />
                      <Select value={form.salaryUnit} onValueChange={value => handleChange("salaryUnit", value)}>
                        <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white h-11 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="hr">per hour</SelectItem>
                          <SelectItem value="mo">per month</SelectItem>
                          <SelectItem value="yr">per year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Company Website
                  </label>
                  <Input
                    placeholder="https://company.com or company.com"
                    value={form.website}
                    onChange={e => handleChange("website", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Work Location</label>
                    <Select value={form.workLocation} onValueChange={value => handleChange("workLocation", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 backdrop-blur-sm">
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Distant">Distant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Experience Level</label>
                    <Select value={form.experience} onValueChange={value => handleChange("experience", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 backdrop-blur-sm">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Junior level">Junior</SelectItem>
                        <SelectItem value="Middle level">Middle</SelectItem>
                        <SelectItem value="Senior level">Senior</SelectItem>
                        <SelectItem value="Mid level">Mid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Employment Type
                  </label>
                  <Select value={form.period} onValueChange={value => handleChange("period", value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 backdrop-blur-sm">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Full time">Full time</SelectItem>
                      <SelectItem value="Part time">Part time</SelectItem>
                      <SelectItem value="Project work">Project work</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Volunteering">Volunteering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Skills & Tags</label>
                  <Input
                    placeholder="React, JavaScript, Python (comma separated)"
                    value={form.tags}
                    onChange={e => handleChange("tags", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Job Description</label>
                  <Textarea
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={form.details}
                    onChange={e => handleChange("details", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px] backdrop-blur-sm resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                  disabled={!form.company || !form.role || !form.salary || submitting}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {submitting ? "Posting..." : "Post Job Opening"}
                </Button>
              </form>

              {success && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                  <p className="text-green-200 font-semibold text-center">{success}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Posted Jobs */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                Your Posted Jobs
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 ml-auto">
                  {postedJobs.length}
                </Badge>
              </CardTitle>
              <p className="text-gray-300">Track and manage your job postings</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                {postedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No jobs posted yet</h3>
                    <p className="text-sm text-gray-400">Create your first job posting to get started</p>
                  </div>
                ) : (
                  postedJobs.map((job) => (
                    <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {job.companyLogo && (
                            <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <h3 className="font-semibold text-white text-lg">{job.role}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                            Active
                          </Badge>
                          {job.website && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVisitWebsite(job.website)}
                              className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 hover:border-blue-300/50 transition-all duration-300"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Visit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveJob(job.id)}
                            className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 hover:border-red-300/50 transition-all duration-300"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₹{job.salary.toLocaleString("en-IN")} {job.salaryUnit}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-400/30 text-blue-200 bg-blue-500/10">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-400/30 text-gray-300">
                            +{job.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs from Other Users Section */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              Jobs from Other Users
              <Badge variant="secondary" className="bg-green-500/20 text-green-200 ml-auto">
                {allUserJobs.length}
              </Badge>
            </CardTitle>
            <p className="text-gray-300">Discover opportunities posted by other users in the community</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
              {allUserJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No community jobs yet</h3>
                  <p className="text-sm text-gray-400">Be among the first to post a job and build the community!</p>
                </div>
              ) : (
                allUserJobs.map((job) => (
                  <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {job.companyLogo && (
                          <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <h3 className="font-semibold text-white text-lg">{job.role}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                          Available
                        </Badge>
                        {job.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVisitWebsite(job.website)}
                            className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 hover:border-blue-300/50 transition-all duration-300"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Visit
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{job.salary.toLocaleString("en-IN")} {job.salaryUnit}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-blue-400/30 text-blue-200 bg-blue-500/10">
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-400/30 text-gray-300">
                          +{job.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    {job.details && (
                      <p className="text-gray-400 text-sm line-clamp-2">{job.details}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
