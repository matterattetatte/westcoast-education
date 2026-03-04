export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      course_questions: {
        Row: {
          answer_text: string | null
          answered_at: string | null
          answered_by: string | null
          course_id: string
          created_at: string | null
          id: string
          question_text: string
          user_id: string
        }
        Insert: {
          answer_text?: string | null
          answered_at?: string | null
          answered_by?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          question_text: string
          user_id: string
        }
        Update: {
          answer_text?: string | null
          answered_at?: string | null
          answered_by?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          question_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_questions_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          course_id: string
          created_at: string | null
          end_date: string | null
          id: string
          location: string | null
          min_participants: number | null
          start_date: string
          status: string | null
          teacher_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          course_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          min_participants?: number | null
          start_date: string
          status?: string | null
          teacher_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          course_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          min_participants?: number | null
          start_date?: string
          status?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          average_rating: number | null
          course_number: string | null
          created_at: string | null
          description: string | null
          duration_days: number | null
          start_date: string | null
          id: string
          image_url: string | null
          price: number | null
          rating_count: number | null
          title: string
          type: string
        }
        Insert: {
          average_rating?: number | null
          course_number?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          price?: number | null
          rating_count?: number | null
          title: string
          type: string
        }
        Update: {
          average_rating?: number | null
          course_number?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          price?: number | null
          rating_count?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string | null
          course_session_id: string | null
          enrolled_at: string | null
          id: string
          is_subscription: boolean | null
          payment_status: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          course_session_id?: string | null
          enrolled_at?: string | null
          id?: string
          is_subscription?: boolean | null
          payment_status?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          course_session_id?: string | null
          enrolled_at?: string | null
          id?: string
          is_subscription?: boolean | null
          payment_status?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_session_id_fkey"
            columns: ["course_session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          billing_address: string | null
          created_at: string | null
          email: string
          password: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          billing_address?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          billing_address?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          course_id: string | null
          id: string
          is_subscription: boolean | null
          price_paid: number | null
          purchased_at: string | null
          subscription_end: string | null
          subscription_start: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          id?: string
          is_subscription?: boolean | null
          price_paid?: number | null
          purchased_at?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          id?: string
          is_subscription?: boolean | null
          price_paid?: number | null
          purchased_at?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          start_date: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

