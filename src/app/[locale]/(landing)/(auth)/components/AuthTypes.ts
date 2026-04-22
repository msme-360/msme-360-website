export type LoginStep = "email" | "password" | "activate" | "unknown";

export interface LoginFields {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export type RegisterStep = 0 | 1 | 2 | 3 | 4;

export interface RegisterValues {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  designation: string;
  bio?: string;
  linkedin_url?: string;
}
