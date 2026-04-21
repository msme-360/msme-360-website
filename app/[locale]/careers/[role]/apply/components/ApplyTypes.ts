export interface LinkEntry {
  label: string;
  url: string;
}

export interface CareerRole {
  slug: string;
  title: string;
  description: string;
  // Add other properties as needed from lib/roles
}

export interface ApplicationFormState {
  loading: boolean;
  success: boolean;
  error: string | null;
  links: LinkEntry[];
  availabilityDate: Date | undefined;
}
