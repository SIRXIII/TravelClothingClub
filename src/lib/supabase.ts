import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to add new clothing item
export async function addItem(data: {
  owner_id: string;
  title: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  description?: string;
  image_url: string;
  ai_preview_url: string;
}) {
  const { data: item, error } = await supabase
    .from('items')
    .insert([data])
    .single();
  if (error) throw error;
  return item;
}

// Helper function to get user's items
export async function getUserItems(userId: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Helper function to update item
export async function updateItem(id: string, updates: Partial<{
  title: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  description: string;
  image_url: string;
  ai_preview_url: string;
}>) {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Helper function to delete item
export async function deleteItem(id: string) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

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