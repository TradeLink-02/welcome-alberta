import type { ImmigrationStatus, Profile } from '../types/Profile';

export interface BenefitResult {
  id: string;
  name: string;
  description: string;
  eligibleStatuses: ImmigrationStatus[];
  requiresChildren?: boolean;
  requiresTaxFiling?: boolean;
  url?: string;
}

export const BENEFITS: BenefitResult[] = [
  {
    id: 'ccb',
    name: 'Canada Child Benefit (CCB)',
    description: 'Up to $7,437/yr per child under 6, $6,275 for ages 6–17. Apply at CRA.',
    eligibleStatuses: ['pr', 'work_permit', 'study_permit', 'refugee', 'cuaet', 'refugee_claimant'],
    requiresChildren: true,
    requiresTaxFiling: true,
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html',
  },
  {
    id: 'gst',
    name: 'GST/HST Credit',
    description: 'Quarterly payments for low-to-moderate income residents. Activated automatically by filing taxes.',
    eligibleStatuses: ['pr', 'work_permit', 'study_permit', 'refugee', 'cuaet', 'refugee_claimant'],
    requiresTaxFiling: true,
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/gst-hst-credit.html',
  },
  {
    id: 'cdcp',
    name: 'Canadian Dental Care Plan (CDCP)',
    description: 'Free dental coverage for households with income under $90,000/yr and no private dental insurance.',
    eligibleStatuses: ['pr', 'work_permit', 'refugee', 'cuaet', 'refugee_claimant'],
    url: 'https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html',
  },
  {
    id: 'ahcip',
    name: 'AHCIP (Alberta Health Care Insurance Plan)',
    description: 'Free provincial health insurance. 3-month wait for most; immediate for GARs and refugees.',
    eligibleStatuses: ['pr', 'work_permit', 'study_permit', 'refugee', 'cuaet'],
    url: 'https://www.alberta.ca/ahcip-apply.aspx',
  },
  {
    id: 'linc',
    name: 'LINC — Language Instruction for Newcomers',
    description: 'Free English/French language training funded by IRCC. Available to most newcomers.',
    eligibleStatuses: ['pr', 'work_permit', 'study_permit', 'refugee', 'cuaet', 'refugee_claimant'],
    url: 'https://emcn.ab.ca/linc',
  },
  {
    id: 'rap',
    name: 'Resettlement Assistance Program (RAP)',
    description: 'First-year income support, orientation, and settlement referrals for Government-Assisted Refugees.',
    eligibleStatuses: ['refugee'],
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/help-within-canada/government-assisted-refugee-program.html',
  },
  {
    id: 'ei',
    name: 'Employment Insurance (EI)',
    description: 'Income support if you lose your job. Requires 420–700 insurable hours worked.',
    eligibleStatuses: ['pr', 'work_permit', 'cuaet'],
    url: 'https://www.canada.ca/en/services/benefits/ei.html',
  },
];

export function getEligibleBenefits(profile: Profile): BenefitResult[] {
  if (!profile.immigrationStatus) return [];

  return BENEFITS.filter((benefit) => {
    if (!benefit.eligibleStatuses.includes(profile.immigrationStatus!)) return false;
    if (benefit.requiresChildren && !profile.hasChildren) return false;
    return true;
  });
}
