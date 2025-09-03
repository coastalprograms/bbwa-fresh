export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_generations: {
        Row: {
          created_at: string
          duration_ms: number | null
          id: number
          output_len: number | null
          project_id: string | null
          prompt_len: number
          provider: string
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          id?: number
          output_len?: number | null
          project_id?: string | null
          prompt_len: number
          provider: string
          status?: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          id?: number
          output_len?: number | null
          project_id?: string | null
          prompt_len?: number
          provider?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      certification_audits: {
        Row: {
          certification_id: string
          created_at: string
          detail: Json | null
          event: string
          id: number
        }
        Insert: {
          certification_id: string
          created_at?: string
          detail?: Json | null
          event: string
          id?: number
        }
        Update: {
          certification_id?: string
          created_at?: string
          detail?: Json | null
          event?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "certification_audits_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          card_number: string | null
          created_at: string
          expiry_date: string | null
          file_url: string | null
          id: string
          name_on_card: string | null
          number: string | null
          processed_at: string | null
          processing_error: string | null
          status: string | null
          type: string
          white_card_path: string | null
          worker_id: string
        }
        Insert: {
          card_number?: string | null
          created_at?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          name_on_card?: string | null
          number?: string | null
          processed_at?: string | null
          processing_error?: string | null
          status?: string | null
          type: string
          white_card_path?: string | null
          worker_id: string
        }
        Update: {
          card_number?: string | null
          created_at?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          name_on_card?: string | null
          number?: string | null
          processed_at?: string | null
          processing_error?: string | null
          status?: string | null
          type?: string
          white_card_path?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_cert_summary"
            referencedColumns: ["worker_id"]
          },
          {
            foreignKeyName: "certifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_alerts: {
        Row: {
          created_at: string | null
          email_error: string | null
          id: string
          job_site_id: string | null
          reason: string
          sent_email: boolean
          sent_sms: boolean
          site_name: string | null
          sms_error: string | null
          worker_email: string | null
          worker_id: string
          worker_name: string | null
        }
        Insert: {
          created_at?: string | null
          email_error?: string | null
          id?: string
          job_site_id?: string | null
          reason: string
          sent_email?: boolean
          sent_sms?: boolean
          site_name?: string | null
          sms_error?: string | null
          worker_email?: string | null
          worker_id: string
          worker_name?: string | null
        }
        Update: {
          created_at?: string | null
          email_error?: string | null
          id?: string
          job_site_id?: string | null
          reason?: string
          sent_email?: boolean
          sent_sms?: boolean
          site_name?: string | null
          sms_error?: string | null
          worker_email?: string | null
          worker_id?: string
          worker_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_job_site_id_fkey"
            columns: ["job_site_id"]
            isOneToOne: false
            referencedRelation: "job_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_alerts_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_cert_summary"
            referencedColumns: ["worker_id"]
          },
          {
            foreignKeyName: "compliance_alerts_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_form_submissions: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          submitted_at: string
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          submitted_at?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          message: string
          name: string
          phone: string | null
          service_interest: string | null
          source_page: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          message: string
          name: string
          phone?: string | null
          service_interest?: string | null
          source_page?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          message?: string
          name?: string
          phone?: string | null
          service_interest?: string | null
          source_page?: string | null
        }
        Relationships: []
      }
      contractors: {
        Row: {
          abn: string | null
          active: boolean
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          abn?: string | null
          active?: boolean
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          abn?: string | null
          active?: boolean
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: []
      }
      job_sites: {
        Row: {
          active: boolean | null
          address: string | null
          created_at: string
          id: string
          lat: number
          lng: number
          name: string
          radius_m: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          id?: string
          lat: number
          lng: number
          name: string
          radius_m?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          radius_m?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_audits: {
        Row: {
          created_at: string
          id: number
          kind: string
          payload: Json | null
          result: string
        }
        Insert: {
          created_at?: string
          id?: number
          kind: string
          payload?: Json | null
          result: string
        }
        Update: {
          created_at?: string
          id?: number
          kind?: string
          payload?: Json | null
          result?: string
        }
        Relationships: []
      }
      notification_dedup: {
        Row: {
          created_at: string
          expiry_date: string
          id: number
          type: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          expiry_date: string
          id?: number
          type?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: number
          type?: string
          worker_id?: string
        }
        Relationships: []
      }
      project_faqs: {
        Row: {
          answer: string
          created_at: string | null
          display_order: number | null
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          completion_date: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          gallery_images: Json | null
          hero_image_url: string | null
          id: string
          location: string | null
          slug: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          gallery_images?: Json | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          slug?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          gallery_images?: Json | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_attendances: {
        Row: {
          checked_in_at: string
          id: string
          job_site_id: string | null
          lat: number | null
          lng: number | null
          site_id: string | null
          worker_id: string
        }
        Insert: {
          checked_in_at?: string
          id?: string
          job_site_id?: string | null
          lat?: number | null
          lng?: number | null
          site_id?: string | null
          worker_id: string
        }
        Update: {
          checked_in_at?: string
          id?: string
          job_site_id?: string | null
          lat?: number | null
          lng?: number | null
          site_id?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_attendances_job_site_id_fkey"
            columns: ["job_site_id"]
            isOneToOne: false
            referencedRelation: "job_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_attendances_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_cert_summary"
            referencedColumns: ["worker_id"]
          },
          {
            foreignKeyName: "site_attendances_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          agree_safety: boolean | null
          agree_terms: boolean | null
          allergies: string | null
          appropriate_signage_display: boolean | null
          company: string | null
          contractor_id: string
          created_at: string
          discussed_swms_with_employer: boolean | null
          electrical_equipment_responsibility: boolean | null
          email: string
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
          employer_provided_swms: boolean | null
          employer_provided_training: boolean | null
          first_name: string
          hazardous_substances_understanding: boolean | null
          high_risk_work_meeting_understanding: boolean | null
          housekeeping_responsibility: boolean | null
          id: string
          induction_completed: boolean | null
          induction_completed_at: string | null
          last_name: string
          mobile: string | null
          no_alcohol_drugs: boolean | null
          no_unauthorized_visitors_understanding: boolean | null
          other_license: boolean | null
          other_license_details: string | null
          position: string | null
          pre_start_meeting_understanding: boolean | null
          read_safety_booklet: boolean | null
          trade: string | null
          understand_site_management_plan: boolean | null
          use_ppe_when_necessary: boolean | null
          white_card: boolean | null
        }
        Insert: {
          agree_safety?: boolean | null
          agree_terms?: boolean | null
          allergies?: string | null
          appropriate_signage_display?: boolean | null
          company?: string | null
          contractor_id: string
          created_at?: string
          discussed_swms_with_employer?: boolean | null
          electrical_equipment_responsibility?: boolean | null
          email: string
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          employer_provided_swms?: boolean | null
          employer_provided_training?: boolean | null
          first_name: string
          hazardous_substances_understanding?: boolean | null
          high_risk_work_meeting_understanding?: boolean | null
          housekeeping_responsibility?: boolean | null
          id?: string
          induction_completed?: boolean | null
          induction_completed_at?: string | null
          last_name: string
          mobile?: string | null
          no_alcohol_drugs?: boolean | null
          no_unauthorized_visitors_understanding?: boolean | null
          other_license?: boolean | null
          other_license_details?: string | null
          position?: string | null
          pre_start_meeting_understanding?: boolean | null
          read_safety_booklet?: boolean | null
          trade?: string | null
          understand_site_management_plan?: boolean | null
          use_ppe_when_necessary?: boolean | null
          white_card?: boolean | null
        }
        Update: {
          agree_safety?: boolean | null
          agree_terms?: boolean | null
          allergies?: string | null
          appropriate_signage_display?: boolean | null
          company?: string | null
          contractor_id?: string
          created_at?: string
          discussed_swms_with_employer?: boolean | null
          electrical_equipment_responsibility?: boolean | null
          email?: string
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          employer_provided_swms?: boolean | null
          employer_provided_training?: boolean | null
          first_name?: string
          hazardous_substances_understanding?: boolean | null
          high_risk_work_meeting_understanding?: boolean | null
          housekeeping_responsibility?: boolean | null
          id?: string
          induction_completed?: boolean | null
          induction_completed_at?: string | null
          last_name?: string
          mobile?: string | null
          no_alcohol_drugs?: boolean | null
          no_unauthorized_visitors_understanding?: boolean | null
          other_license?: boolean | null
          other_license_details?: string | null
          position?: string | null
          pre_start_meeting_understanding?: boolean | null
          read_safety_booklet?: boolean | null
          trade?: string | null
          understand_site_management_plan?: boolean | null
          use_ppe_when_necessary?: boolean | null
          white_card?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      worker_cert_summary: {
        Row: {
          company: string | null
          email: string | null
          expiry_date: string | null
          first_name: string | null
          full_name: string | null
          last_name: string | null
          status: string | null
          worker_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const