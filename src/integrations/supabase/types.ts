export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_semesters: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          academic_period: string
          end_date: string
          file_path: string | null
          generated_at: string
          generated_by: string
          id: string
          professor_id: string
          start_date: string
          total_hours: number
        }
        Insert: {
          academic_period: string
          end_date: string
          file_path?: string | null
          generated_at?: string
          generated_by: string
          id?: string
          professor_id: string
          start_date: string
          total_hours: number
        }
        Update: {
          academic_period?: string
          end_date?: string
          file_path?: string | null
          generated_at?: string
          generated_by?: string
          id?: string
          professor_id?: string
          start_date?: string
          total_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "certificates_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_attachments: {
        Row: {
          file_path: string
          filename: string
          id: string
          meeting_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_path: string
          filename: string
          id?: string
          meeting_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_path?: string
          filename?: string
          id?: string
          meeting_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attachments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes: {
        Row: {
          content: string
          document_path: string | null
          file_path: string | null
          generated_at: string
          generated_by: string
          id: string
          meeting_id: string
          updated_at: string
        }
        Insert: {
          content: string
          document_path?: string | null
          file_path?: string | null
          generated_at?: string
          generated_by: string
          id?: string
          meeting_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          document_path?: string | null
          file_path?: string | null
          generated_at?: string
          generated_by?: string
          id?: string
          meeting_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: true
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_participants: {
        Row: {
          attendance_status: boolean
          hours_computed: number
          id: string
          meeting_id: string
          professor_id: string
        }
        Insert: {
          attendance_status?: boolean
          hours_computed?: number
          id?: string
          meeting_id: string
          professor_id: string
        }
        Update: {
          attendance_status?: boolean
          hours_computed?: number
          id?: string
          meeting_id?: string
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_participants_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          academic_period: string | null
          agenda: string | null
          created_at: string
          created_by: string
          deliberations: string | null
          end_time: string
          id: string
          location: string | null
          meeting_date: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          semester_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["meeting_status"]
          title: string
          updated_at: string
        }
        Insert: {
          academic_period?: string | null
          agenda?: string | null
          created_at?: string
          created_by: string
          deliberations?: string | null
          end_time?: string
          id?: string
          location?: string | null
          meeting_date: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          semester_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["meeting_status"]
          title: string
          updated_at?: string
        }
        Update: {
          academic_period?: string | null
          agenda?: string | null
          created_at?: string
          created_by?: string
          deliberations?: string | null
          end_time?: string
          id?: string
          location?: string | null
          meeting_date?: string
          meeting_type?: Database["public"]["Enums"]["meeting_type"]
          semester_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["meeting_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "academic_semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string
          department: string | null
          full_name: string
          id: string
          institution_email: string
          siape_code: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          institution_email: string
          siape_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          institution_email?: string
          siape_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          institution_email: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          institution_email: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          institution_email?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          settings_data: Json
          settings_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_coordinator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      meeting_status: "agendada" | "realizada" | "cancelada"
      meeting_type:
        | "ordinaria"
        | "extraordinaria"
        | "colegiado"
        | "comissao"
        | "outros"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      meeting_status: ["agendada", "realizada", "cancelada"],
      meeting_type: [
        "ordinaria",
        "extraordinaria",
        "colegiado",
        "comissao",
        "outros",
      ],
    },
  },
} as const
