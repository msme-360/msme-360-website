/**
 * MSME 360 - SUPABASE DATABASE TYPES
 * =================================
 * This file contains the TypeScript definitions for the MSME 360 database schema.
 * Matches Phoenix V5.5 schema definitions perfectly.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company_name: string | null
          email: string | null
          role: string
          department: string
          career_level: string
          designation: string
          manager_id: string | null
          phone: string | null
          bio: string | null
          linkedin_url: string | null
          avatar_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company_name?: string | null
          email?: string | null
          role?: string
          department?: string
          career_level?: string
          designation?: string
          manager_id?: string | null
          phone?: string | null
          bio?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company_name?: string | null
          email?: string | null
          role?: string
          department?: string
          career_level?: string
          designation?: string
          manager_id?: string | null
          phone?: string | null
          bio?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      intern_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: string
          experience_level: string | null
          university: string | null
          degree: string | null
          graduation_year: string | null
          availability_date: string | null
          links: Json
          commitment_confirmed: boolean
          expectations_confirmed: boolean
          attendance_confirmed: boolean
          status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired'
          applied_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          role: string
          experience_level?: string | null
          university?: string | null
          degree?: string | null
          graduation_year?: string | null
          availability_date?: string | null
          links?: Json
          commitment_confirmed?: boolean
          expectations_confirmed?: boolean
          attendance_confirmed?: boolean
          status?: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired'
          applied_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: string
          experience_level?: string | null
          university?: string | null
          degree?: string | null
          graduation_year?: string | null
          availability_date?: string | null
          links?: Json
          commitment_confirmed?: boolean
          expectations_confirmed?: boolean
          attendance_confirmed?: boolean
          status?: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired'
          applied_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      intern_onboarding_checklists: {
        Row: {
          id: string
          user_id: string
          task_name: string
          is_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_name: string
          is_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_name?: string
          is_completed?: boolean
          created_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          user_id: string
          reviewer_id: string | null
          productivity_score: number
          quality_score: number
          leadership_score: number
          period_start: string
          period_end: string
          comments: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reviewer_id?: string | null
          productivity_score?: number
          quality_score?: number
          leadership_score?: number
          period_start: string
          period_end: string
          comments?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reviewer_id?: string | null
          productivity_score?: number
          quality_score?: number
          leadership_score?: number
          period_start?: string
          period_end?: string
          comments?: string | null
          created_at?: string
        }
      }
      promotion_pipeline: {
        Row: {
          id: string
          user_id: string
          current_level: string
          target_level: string
          status: string
          nominated_by: string | null
          justification: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_level: string
          target_level: string
          status?: string
          nominated_by?: string | null
          justification?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_level?: string
          target_level?: string
          status?: string
          nominated_by?: string | null
          justification?: string | null
          updated_at?: string
        }
      }
      gtm_campaigns: {
        Row: {
          id: string
          user_id: string | null
          title: string
          status: string
          roadmap_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          status?: string
          roadmap_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          status?: string
          roadmap_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      compliance_tasks: {
        Row: {
          id: string
          user_id: string
          task_name: string
          due_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_name: string
          due_date: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_name?: string
          due_date?: string
          status?: string
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          category: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          category: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          category?: string
          status?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          full_name: string
          role_key: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          role_key: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          role_key?: string
          status?: string
          created_at?: string
        }
      }
      nic_codes: {
        Row: {
          id: string
          code: string
          category: string
          description: string
          subtext: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          category: string
          description: string
          subtext?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          category?: string
          description?: string
          subtext?: string | null
          created_at?: string
        }
      }
      attendance_logs: {
        Row: {
          id: string
          user_id: string
          check_in: string
          check_out: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          check_in?: string
          check_out?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          check_in?: string
          check_out?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          assigned_to: string
          assigned_by: string
          status: 'pending' | 'in_progress' | 'completed' | 'blocked'
          priority: 'Low' | 'Medium' | 'High' | 'Urgent'
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          assigned_to: string
          assigned_by: string
          status?: 'pending' | 'in_progress' | 'completed' | 'blocked'
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          assigned_to?: string
          assigned_by?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'blocked'
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
          due_date?: string | null
          created_at?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          comment?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      board_resolutions: {
        Row: {
          id: string
          title: string
          author_id: string | null
          level: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author_id?: string | null
          level?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author_id?: string | null
          level?: string
          status?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          author_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: string
          author_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: string
          author_id?: string | null
          created_at?: string
        }
      }
      system_logs: {
        Row: {
          id: string
          action: string
          target: string | null
          status: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          target?: string | null
          status?: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          action?: string
          target?: string | null
          status?: string
          user_id?: string | null
          created_at?: string
        }
      }
      platform_metrics: {
        Row: {
          id: string
          category: string
          label: string
          value: string
          change: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          label: string
          value: string
          change?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          label?: string
          value?: string
          change?: string | null
          status?: string
          created_at?: string
        }
      }
      service_health: {
        Row: {
          id: string
          name: string
          status: string
          load_percentage: number
          uptime_percentage: number
          last_ping: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          load_percentage?: number
          uptime_percentage?: number
          last_ping?: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          load_percentage?: number
          uptime_percentage?: number
          last_ping?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_role_level: {
        Args: {
          role_id: string
        }
        Returns: number
      }
      get_user_role_level: {
        Args: {
          user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
