import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserMeasurements {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  chest: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  inseam: number; // in cm
  sleeveLength: number; // in cm
  shoeSize: number;
}

export interface OnboardingData {
  startDate: Date | null;
  endDate: Date | null;
  users: UserMeasurements[];
  currentStep: number;
  isAuthenticated: boolean;
}

interface OnboardingStore extends OnboardingData {
  setDates: (startDate: Date, endDate: Date) => void;
  addUser: (user: UserMeasurements) => void;
  updateUser: (userId: string, updates: Partial<UserMeasurements>) => void;
  removeUser: (userId: string) => void;
  setCurrentStep: (step: number) => void;
  setAuthenticated: (authenticated: boolean) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState: OnboardingData = {
  startDate: null,
  endDate: null,
  users: [],
  currentStep: 0,
  isAuthenticated: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setDates: (startDate, endDate) => set({ startDate, endDate }),
      
      addUser: (user) => set((state) => ({
        users: [...state.users, user]
      })),
      
      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        )
      })),
      
      removeUser: (userId) => set((state) => ({
        users: state.users.filter(user => user.id !== userId)
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 4) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 0) 
      })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);