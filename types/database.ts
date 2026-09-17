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
          role: Database["public"]["Enums"]["profile_role"]
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          id: string
          machine_id: string
          machine_name: string
          machine_type: string
          location: string
          status: Database["public"]["Enums"]["machine_status"]
          deleted_at: string | null
          last_updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          machine_id: string
          machine_name: string
          machine_type: string
          location: string
          status?: Database["public"]["Enums"]["machine_status"]
          deleted_at?: string | null
          last_updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          machine_id?: string
          machine_name?: string
          machine_type?: string
          location?: string
          status?: Database["public"]["Enums"]["machine_status"]
          deleted_at?: string | null
          last_updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      alarms: {
        Row: {
          id: string
          machine_id: string
          alarm_code: string
          description: string
          cause: string | null
          occurred_at: string
          status: Database["public"]["Enums"]["alarm_status"]
          created_by: string | null
          closed_by: string | null
          closed_at: string | null
        }
        Insert: {
          id?: string
          machine_id: string
          alarm_code: string
          description: string
          cause?: string | null
          occurred_at?: string
          status?: Database["public"]["Enums"]["alarm_status"]
          created_by?: string | null
          closed_by?: string | null
          closed_at?: string | null
        }
        Update: {
          id?: string
          machine_id?: string
          alarm_code?: string
          description?: string
          cause?: string | null
          occurred_at?: string
          status?: Database["public"]["Enums"]["alarm_status"]
          created_by?: string | null
          closed_by?: string | null
          closed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alarms_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alarms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alarms_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          id: string
          machine_id: string
          alarm_id: string | null
          technician_id: string | null
          problem: string
          action_taken: string | null
          maintained_at: string
          status: Database["public"]["Enums"]["mnt_status"]
          created_at: string
        }
        Insert: {
          id?: string
          machine_id: string
          alarm_id?: string | null
          technician_id?: string | null
          problem: string
          action_taken?: string | null
          maintained_at?: string
          status?: Database["public"]["Enums"]["mnt_status"]
          created_at?: string
        }
        Update: {
          id?: string
          machine_id?: string
          alarm_id?: string | null
          technician_id?: string | null
          problem?: string
          action_taken?: string | null
          maintained_at?: string
          status?: Database["public"]["Enums"]["mnt_status"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_alarm_id_fkey"
            columns: ["alarm_id"]
            isOneToOne: false
            referencedRelation: "alarms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_technician_id_fkey"
            columns: ["technician_id"]
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
      rls_auto_enable: {
        Args: { [key: string]: unknown }
        Returns: undefined
      }
      current_role_name: {
        Args: []
        Returns: string
      }
    }
    Enums: {
      profile_role: "admin" | "technician" | "viewer"
      machine_status: "Running" | "Maintenance" | "Alarm"
      alarm_status: "Open" | "In Progress" | "Closed"
      mnt_status: "Pending" | "In Progress" | "Done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  T extends UnionEnumExtends<any, any>,
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]] &
      Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  T extends Database["public"]["Enums"][keyof Database["public"]["Enums"]],
> = T

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export type UnionEnumExtends<
  U extends string,
  T extends TablesAndViews<PublicSchema>[keyof TablesAndViews<PublicSchema>],
> = T extends { Row: infer R }
  ? U extends R[keyof R]
    ? true
    : false
  : never

export type PublicSchema = Database[Extract<keyof Database, "public">]

export type TablesAndViews<T extends Record<string, unknown>> = T["Tables"] &
  T["Views"]
