
export interface Job {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  tags: string[];
  salary: number;
  salaryUnit: string;
  postedAt: string;
  location: string;
  employmentType: string[];
  details: string;
  brand: "amazon"|"google"|"twitter"|"airbnb"|"dribbble"|"apple";
  color: string;
  website?: string;
}

// Empty jobs array - all pre-existing jobs removed
export const jobs: Job[] = [];

export const brandIcon: Record<string, string> = {
  amazon: "a",
  google: "G",
  twitter: "T",
  airbnb: "A",
  dribbble: "D",
  apple: ""
};
