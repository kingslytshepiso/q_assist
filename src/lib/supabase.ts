import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Get environment variables directly
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          location: string;
          status: "open" | "in_progress" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          location: string;
          status?: "open" | "in_progress" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          location?: string;
          status?: "open" | "in_progress" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          request_id: string;
          user_id: string;
          message: string;
          status: "pending" | "accepted" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id: string;
          message: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string;
          message?: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
