import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'franchisee' | 'franchisor' | null;

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BusinessInfo {
  companyName: string;
  industry: string;
  yearEstablished: string;
  annualRevenue: string;
  numberOfLocations: string;
  businessDescription: string;
  website: string;
}

export interface FranchisorRequirements {
  investmentRequired: string;
  franchiseFee: string;
  royaltyFee: string;
  locationRequirements: string;
  preferredLocations: string[];
  supportProvided: string[];
  trainingProgram: string;
}

export interface FranchiseeAssets {
  availableCapital: string;
  liquidAssets: string;
  netWorth: string;
  locationSize: string;
  locationAddress: string;
  preferredIndustries: string[];
  preferredLocations: string[];
}

export interface PsychometricResult {
  riskTolerance: number;
  leadershipStyle: string;
  decisionMaking: string;
  workEthic: number;
  communicationStyle: string;
}

export interface User {
  id: string;
  role: UserRole;
  personalInfo: PersonalInfo;
  businessInfo?: BusinessInfo;
  requirements?: FranchisorRequirements;
  assets?: FranchiseeAssets;
  psychometricResult?: PsychometricResult;
  brandPreferences?: string[];
  isProfileComplete: boolean;
}

export interface Match {
  id: string;
  franchiseeId: string;
  franchisorId: string;
  franchiseeName: string;
  franchisorName: string;
  franchiseeCompany: string;
  franchisorCompany: string;
  matchScore: number;
  status: 'pending' | 'interested_franchisee' | 'interested_franchisor' | 'mutual_interest' | 'matched' | 'rejected';
  createdAt: string;
}

export interface PotentialMatch {
  brandName: string;
  contactEmail: string;
  totalScore: number;
  assetMatchScore: number;
  investmentScore: number;
  traitScore: number;
  industryScore: number;
}

interface AppState {
  // User State
  currentUser: User | null;
  isAuthenticated: boolean;
  isFirstVisit: boolean;
  
  // Matching State
  matches: Match[];
  potentialMatches: PotentialMatch[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setFirstVisit: (value: boolean) => void;
  updateUserProfile: (data: Partial<User>) => void;
  addMatch: (match: Match) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;
  setPotentialMatches: (matches: PotentialMatch[]) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      isFirstVisit: true,
      matches: [],
      potentialMatches: [],
      
      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setFirstVisit: (value) => set({ isFirstVisit: value }),
      
      updateUserProfile: (data) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...data }
            : null,
        })),
      
      addMatch: (match) =>
        set((state) => ({
          matches: [...state.matches, match],
        })),
      
      updateMatchStatus: (matchId, status) =>
        set((state) => ({
          matches: state.matches.map((m) =>
            m.id === matchId ? { ...m, status } : m
          ),
        })),
      
      setPotentialMatches: (matches) =>
        set({ potentialMatches: matches }),
      
      logout: () =>
        set({
          currentUser: null,
          isAuthenticated: false,
          matches: [],
          potentialMatches: [],
        }),
    }),
    {
      name: 'franchiseit-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        isFirstVisit: state.isFirstVisit,
        matches: state.matches,
      }),
    }
  )
);
