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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          created_at: string
          id: string
          owner_uid: string
          requester_uid: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_uid: string
          requester_uid: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_uid?: string
          requester_uid?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_owner_uid_fkey"
            columns: ["owner_uid"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "access_requests_requester_uid_fkey"
            columns: ["requester_uid"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["uid"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_1_uid: string
          participant_2_uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1_uid: string
          participant_2_uid: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1_uid?: string
          participant_2_uid?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          id: string
          owner_uid: string
          src: string
          uploaded_at: string
        }
        Insert: {
          caption?: string | null
          id?: string
          owner_uid: string
          src: string
          uploaded_at?: string
        }
        Update: {
          caption?: string | null
          id?: string
          owner_uid?: string
          src?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_owner_uid_fkey"
            columns: ["owner_uid"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["uid"]
          },
        ]
      }
      member_tags: {
        Row: {
          created_at: string
          gallery_id: string
          id: string
          member_uid: string
        }
        Insert: {
          created_at?: string
          gallery_id: string
          id?: string
          member_uid: string
        }
        Update: {
          created_at?: string
          gallery_id?: string
          id?: string
          member_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_tags_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "gallery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_tags_member_uid_fkey"
            columns: ["member_uid"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["uid"]
          },
        ]
      }
      members: {
        Row: {
          bio: string
          created_at: string
          email: string | null
          memory: string
          name: string
          password_hash: string | null
          phone: string | null
          profile_image: string
          recovery_code: string | null
          recovery_code_expires_at: string | null
          role: string
          uid: string
        }
        Insert: {
          bio: string
          created_at?: string
          email?: string | null
          memory: string
          name: string
          password_hash?: string | null
          phone?: string | null
          profile_image: string
          recovery_code?: string | null
          recovery_code_expires_at?: string | null
          role: string
          uid: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string | null
          memory?: string
          name?: string
          password_hash?: string | null
          phone?: string | null
          profile_image?: string
          recovery_code?: string | null
          recovery_code_expires_at?: string | null
          role?: string
          uid?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          is_read: boolean
          message_type: string
          reply_to_id: string | null
          sender_uid: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_read?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_uid: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_read?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      video_testimonials: {
        Row: {
          description: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          owner_uid: string
          thumbnail_url: string | null
          title: string | null
          uploaded_at: string
          video_url: string
        }
        Insert: {
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          owner_uid: string
          thumbnail_url?: string | null
          title?: string | null
          uploaded_at?: string
          video_url: string
        }
        Update: {
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          owner_uid?: string
          thumbnail_url?: string | null
          title?: string | null
          uploaded_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      member_generate_recovery_code: { Args: { p_uid: string }; Returns: Json }
      member_login: {
        Args: { p_password: string; p_uid: string }
        Returns: Json
      }
      member_reset_password_with_code: {
        Args: { p_code: string; p_new_password: string; p_uid: string }
        Returns: Json
      }
      member_set_password: {
        Args: { p_password: string; p_uid: string }
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
