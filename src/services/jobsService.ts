
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/data/jobs";

export interface SupabaseJob {
  id: string;
  user_id: string;
  company: string;
  company_logo?: string;
  role: string;
  tags: string[];
  salary: number;
  salary_unit: string;
  posted_at: string;
  location: string;
  employment_type: string[];
  details?: string;
  brand: string;
  color: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// Convert Supabase job to frontend Job format
const convertSupabaseJob = (supabaseJob: SupabaseJob): Job => ({
  id: supabaseJob.id,
  company: supabaseJob.company,
  companyLogo: supabaseJob.company_logo,
  role: supabaseJob.role,
  tags: supabaseJob.tags,
  salary: supabaseJob.salary,
  salaryUnit: supabaseJob.salary_unit,
  postedAt: supabaseJob.posted_at,
  location: supabaseJob.location,
  employmentType: supabaseJob.employment_type,
  details: supabaseJob.details || "",
  brand: supabaseJob.brand as "amazon"|"google"|"twitter"|"airbnb"|"dribbble"|"apple",
  color: supabaseJob.color,
  website: supabaseJob.website
});

// Convert frontend Job to Supabase format
const convertToSupabaseJob = (job: Job, userId: string): Omit<SupabaseJob, 'created_at' | 'updated_at'> => ({
  id: job.id,
  user_id: userId,
  company: job.company,
  company_logo: job.companyLogo,
  role: job.role,
  tags: job.tags,
  salary: job.salary,
  salary_unit: job.salaryUnit,
  posted_at: job.postedAt,
  location: job.location,
  employment_type: job.employmentType,
  details: job.details,
  brand: job.brand,
  color: job.color,
  website: job.website
});

export const jobsService = {
  // Get all jobs (public read)
  async getAllJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }

      return data ? data.map(convertSupabaseJob) : [];
    } catch (error) {
      console.error('Error in getAllJobs:', error);
      return [];
    }
  },

  // Get jobs posted by a specific user
  async getUserJobs(userId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user jobs:', error);
        return [];
      }

      return data ? data.map(convertSupabaseJob) : [];
    } catch (error) {
      console.error('Error in getUserJobs:', error);
      return [];
    }
  },

  // Create a new job
  async createJob(job: Job, userId: string): Promise<Job | null> {
    try {
      const supabaseJob = convertToSupabaseJob(job, userId);
      const { data, error } = await supabase
        .from('jobs')
        .insert([supabaseJob])
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        return null;
      }

      return data ? convertSupabaseJob(data) : null;
    } catch (error) {
      console.error('Error in createJob:', error);
      return null;
    }
  },

  // Update a job
  async updateJob(jobId: string, updates: Partial<Job>, userId: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        return null;
      }

      return data ? convertSupabaseJob(data) : null;
    } catch (error) {
      console.error('Error in updateJob:', error);
      return null;
    }
  },

  // Delete a job
  async deleteJob(jobId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting job:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteJob:', error);
      return false;
    }
  }
};
