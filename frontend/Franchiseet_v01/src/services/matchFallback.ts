import type { User } from '../store/useStore';

export interface FallbackFranchisorMatch {
  id: string;
  companyName: string;
  contactEmail: string;
  matchScore: number;
  assetMatchScore: number;
  investmentScore: number;
  traitScore: number;
  industryScore: number;
}

export interface FallbackFranchiseeCard {
  id: string;
  name: string;
  location: string;
  availableCapital: string;
  preferredIndustries: string[];
  experience: string;
  matchScore: number;
}

type FranchisorSeed = {
  id: string;
  companyName: string;
  contactEmail: string;
  industry: string;
};

type FranchiseeSeed = {
  id: string;
  name: string;
  location: string;
  availableCapital: string;
  preferredIndustries: string[];
  experience: string;
};

const FRANCHISOR_SEED: FranchisorSeed[] = [
  { id: 'frn_1', companyName: 'UrbanBite Kitchens', contactEmail: 'partner@urbanbite.in', industry: 'Food' },
  { id: 'frn_2', companyName: 'CareNest Clinics', contactEmail: 'growth@carenest.in', industry: 'Healthcare' },
  { id: 'frn_3', companyName: 'FitForge Studio', contactEmail: 'expand@fitforge.in', industry: 'Fitness' },
  { id: 'frn_4', companyName: 'TutorBridge Academy', contactEmail: 'franchise@tutorbridge.in', industry: 'Education' },
  { id: 'frn_5', companyName: 'FreshKart Express', contactEmail: 'launch@freshkart.in', industry: 'Retail' },
  { id: 'frn_6', companyName: 'WashWave Laundry', contactEmail: 'ops@washwave.in', industry: 'Services' },
];

const FRANCHISEE_SEED: FranchiseeSeed[] = [
  {
    id: 'fee_1',
    name: 'Aarav Mehta',
    location: 'Mumbai',
    availableCapital: 'INR 80,00,000',
    preferredIndustries: ['Food', 'Retail'],
    experience: '7 years in multi-unit operations',
  },
  {
    id: 'fee_2',
    name: 'Priya Nair',
    location: 'Bangalore',
    availableCapital: 'INR 55,00,000',
    preferredIndustries: ['Education', 'Healthcare'],
    experience: 'Ex-school administrator and investor',
  },
  {
    id: 'fee_3',
    name: 'Rohan Gupta',
    location: 'Delhi NCR',
    availableCapital: 'INR 1,20,00,000',
    preferredIndustries: ['Fitness', 'Services'],
    experience: '10 years in enterprise sales',
  },
  {
    id: 'fee_4',
    name: 'Sneha Iyer',
    location: 'Hyderabad',
    availableCapital: 'INR 70,00,000',
    preferredIndustries: ['Food', 'Healthcare'],
    experience: 'Serial entrepreneur in consumer brands',
  },
  {
    id: 'fee_5',
    name: 'Vikram Sethi',
    location: 'Pune',
    availableCapital: 'INR 95,00,000',
    preferredIndustries: ['Retail', 'Education'],
    experience: 'Regional operations lead, 8 years',
  },
  {
    id: 'fee_6',
    name: 'Ananya Das',
    location: 'Chennai',
    availableCapital: 'INR 65,00,000',
    preferredIndustries: ['Services', 'Fitness'],
    experience: 'Business development and partnerships',
  },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function scoreInRange(seed: string, min: number, max: number): number {
  const raw = hashString(seed) % (max - min + 1);
  return min + raw;
}

function userKey(user: User | null): string {
  return user?.id || user?.personalInfo?.email || 'guest';
}

export function getFallbackFranchisorMatches(user: User | null): FallbackFranchisorMatch[] {
  const preferred = (user?.assets?.preferredIndustries || []).map((value) => value.toLowerCase());
  const key = userKey(user);

  return FRANCHISOR_SEED.map((item) => {
    const asset = scoreInRange(`${key}:${item.id}:asset`, 14, 30);
    const investment = scoreInRange(`${key}:${item.id}:investment`, 12, 30);
    const trait = scoreInRange(`${key}:${item.id}:trait`, 10, 30);
    let industry = scoreInRange(`${key}:${item.id}:industry`, 4, 10);

    if (preferred.some((entry) => entry.includes(item.industry.toLowerCase()))) {
      industry = Math.min(10, industry + 2);
    }

    const total = Math.round((asset + investment + trait + industry) / 70 * 100);

    return {
      id: item.id,
      companyName: item.companyName,
      contactEmail: item.contactEmail,
      matchScore: total,
      assetMatchScore: asset,
      investmentScore: investment,
      traitScore: trait,
      industryScore: industry,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function getFallbackFranchiseeCards(user: User | null): FallbackFranchiseeCard[] {
  const key = userKey(user);

  return FRANCHISEE_SEED.map((item) => {
    const score = scoreInRange(`${key}:${item.id}:score`, 62, 92);
    return {
      ...item,
      matchScore: score,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
