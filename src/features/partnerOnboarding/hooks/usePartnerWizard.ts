import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface WizardStore {
  step: number;
  setStep: (n: number) => void;
  data: Partial<PartnerDraft>;
  upsert: (patch: Partial<PartnerDraft>) => Promise<void>;
  loadDraft: (user: User) => Promise<void>;
  partnerId?: string;
}

export interface PartnerDraft {
  name?: string;
  contact?: string;
  email?: string;
  city?: string;
  lat?: number;
  lng?: number;
  legalName?: string;
  idNumber?: string;
  itemCount?: number;
  categories?: string;
  shippingMethod?: string;
  handlingTime?: string;
  payoutEmail?: string;
  bankName?: string;
  user_id?: string;
  status?: string;
}

export const usePartnerWizard = create<WizardStore>()(
  persist(
    (set, get) => ({
      step: 0,
      setStep: (n) => set({ step: n }),
      data: {},
      partnerId: undefined,
      loadDraft: async (user) => {
        // Try to fetch existing draft
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "draft")
          .single();
        if (data) {
          set({ data, partnerId: data.id });
        } else {
          // Create new draft
          const { data: newDraft, error: insertError } = await supabase
            .from("partners")
            .insert([{ user_id: user.id, status: "draft" }])
            .select()
            .single();
          if (newDraft) {
            set({ data: newDraft, partnerId: newDraft.id });
          }
        }
      },
      upsert: async (patch) => {
        const { partnerId, data } = get();
        if (!partnerId) return;
        const { data: updated, error } = await supabase
          .from("partners")
          .update({ ...data, ...patch })
          .eq("id", partnerId)
          .select()
          .single();
        if (updated) {
          set({ data: updated });
        }
      },
    }),
    { name: "tcc-partner-wizard" }
  )
); 