import { create } from 'zustand';

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role?: 'franchisee' | 'franchisor';
}

interface SignupStore {
  signupData: SignupData | null;
  setSignupData: (data: Partial<SignupData>) => void;
  clearSignupData: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  signupData: null,

  setSignupData: (data) =>
    set((state) => ({
      signupData: state.signupData
        ? { ...state.signupData, ...data }
        : (data as SignupData),
    })),

  clearSignupData: () => set({ signupData: null }),
}));