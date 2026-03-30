import type { User } from '../store/useStore';
import type { MatchProfileRequest } from './matchApi';

function parseCurrencyText(value: string | undefined): number {
  if (!value) return 0;

  const text = value.toLowerCase().replace(/,/g, '').trim();
  const numeric = Number(text.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(numeric) || numeric <= 0) return 0;
  if (text.includes('crore')) return numeric * 10000000;
  if (text.includes('lakh') || text.includes('lakhs')) return numeric * 100000;
  return numeric;
}

function deriveTraitsFromPsychometric(user: User | null): string[] {
  if (!user?.psychometricResult) return [];

  const traits = new Set<string>();
  const { leadershipStyle, decisionMaking, communicationStyle } = user.psychometricResult;

  if (leadershipStyle.includes('Visionary')) traits.add('Visionary Innovator');
  if (leadershipStyle.includes('Results')) traits.add('Execution Specialist');
  if (leadershipStyle.includes('Collaborative')) traits.add('Persuasive Networker');
  if (leadershipStyle.includes('Empathetic')) traits.add('Resilient Builder');

  if (decisionMaking.includes('Data-Driven')) traits.add('Strategic Planner');
  if (decisionMaking.includes('Intuitive')) traits.add('Opportunity Hunter');

  if (communicationStyle.includes('Outgoing')) traits.add('Confident Leader');
  if (communicationStyle.includes('Analytical')) traits.add('Adaptive Problem Solver');

  return Array.from(traits).slice(0, 3);
}

export function buildProfileMatchRequest(user: User | null): MatchProfileRequest {
  const preferredIndustry = user?.assets?.preferredIndustries?.[0]?.trim() || 'HORECA';

  return {
    first_name: user?.personalInfo?.firstName || '',
    last_name: user?.personalInfo?.lastName || '',
    email: user?.personalInfo?.email || '',
    asset_type: 'Retail Space',
    liquid_asset_inr: parseCurrencyText(user?.assets?.liquidAssets),
    preferred_industry: preferredIndustry,
    traits: deriveTraitsFromPsychometric(user),
  };
}
