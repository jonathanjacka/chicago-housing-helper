export interface ProgramType {
  id: string;
  acronym?: string;
  fullName: string;
  description: string;
  benefits: string[];
  considerations: string[];
  sourceUrl: string;
  sourceName: string;
}

export const PROGRAM_TYPES: ProgramType[] = [
  {
    id: 'hcv',
    acronym: 'HCV',
    fullName: 'Housing Choice Voucher (Section 8)',
    description: 'A voucher that helps pay for rent in private market apartments. You find your own housing, and the voucher covers a portion of the rent based on your income.',
    benefits: [
      'Choose where you want to live',
      'Voucher stays with you if you move',
      'Wide range of housing options',
    ],
    considerations: [
      'Long waitlists (often years)',
      'Landlord must agree to accept vouchers',
      'Must find housing within time limit once issued',
    ],
    sourceUrl: 'https://www.thecha.org/voucher-holders',
    sourceName: 'Chicago Housing Authority',
  },
  {
    id: 'public-housing',
    fullName: 'Public Housing',
    description: 'Housing developments owned and managed by the Chicago Housing Authority. Rent is based on 30% of your income.',
    benefits: [
      'Rent is always affordable (30% of income)',
      'On-site management and services',
      'No need to find your own landlord',
    ],
    considerations: [
      'Limited to specific CHA properties',
      'Must follow CHA lease rules',
      'Some properties may be older',
    ],
    sourceUrl: 'https://www.thecha.org/residents/public-housing',
    sourceName: 'Chicago Housing Authority',
  },
  {
    id: 'pbv',
    acronym: 'PBV',
    fullName: 'Project-Based Vouchers',
    description: 'Vouchers attached to specific apartment buildings. When you move in, you get the voucher. If you leave, the voucher stays with the unit.',
    benefits: [
      'Often shorter waitlists than HCV',
      'Modern, quality housing',
      'Many options across Chicago neighborhoods',
    ],
    considerations: [
      'Must live in the specific building',
      'Voucher doesn\'t transfer if you move',
      'Some properties target specific populations',
    ],
    sourceUrl: 'https://www.thecha.org/manage-my-project-based-voucher',
    sourceName: 'Chicago Housing Authority',
  },
  {
    id: 'aro',
    acronym: 'ARO',
    fullName: 'Affordable Requirements Ordinance',
    description: 'The City of Chicago requires developers of new residential buildings to include affordable units. These are often in newer, mixed-income buildings.',
    benefits: [
      'Newer, modern buildings',
      'Mixed-income communities',
      'Various neighborhoods across Chicago',
    ],
    considerations: [
      'Limited number of units per building',
      'Different income requirements per property',
      'May have shorter lease terms',
    ],
    sourceUrl: 'https://www.chicago.gov/city/en/sites/affordable-requirements-ordinance/home.html',
    sourceName: 'City of Chicago',
  },
  {
    id: 'lihtc',
    acronym: 'LIHTC',
    fullName: 'Low-Income Housing Tax Credit',
    description: 'Privately owned affordable housing developments that received tax credits in exchange for keeping rents affordable. Managed by various housing organizations.',
    benefits: [
      'Many locations throughout Chicago',
      'Professionally managed properties',
      'Often newer construction',
    ],
    considerations: [
      'Each property has its own application',
      'Income limits vary by property',
      'Some have specific eligibility requirements',
    ],
    sourceUrl: 'https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/s6ha-ppgi',
    sourceName: 'Chicago Data Portal',
  },
];
