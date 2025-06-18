import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      lenders: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          verified?: boolean;
          created_at?: string;
        };
      };
      clothing_items: {
        Row: {
          id: string;
          lender_id: string;
          title: string;
          description: string;
          category: string;
          size: string;
          price_per_rental: number;
          images: string[];
          ai_model_image: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lender_id: string;
          title: string;
          description: string;
          category: string;
          size: string;
          price_per_rental: number;
          images?: string[];
          ai_model_image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lender_id?: string;
          title?: string;
          description?: string;
          category?: string;
          size?: string;
          price_per_rental?: number;
          images?: string[];
          ai_model_image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          item_id: string;
          customer_email: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          start_date: string;
          end_date: string;
          destination: string;
          total_price: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          start_date: string;
          end_date: string;
          destination: string;
          total_price: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          start_date?: string;
          end_date?: string;
          destination?: string;
          total_price?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};