export interface DataSource {
  name: string;
  description: string;
  url: string;
  dataType: string;
}

export interface AdditionalResource {
  name: string;
  description: string;
  url: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    name: 'U.S. Department of Housing and Urban Development (HUD)',
    description: 'Official income limits that determine eligibility for subsidized housing programs.',
    url: 'https://www.huduser.gov/portal/datasets/il.html',
    dataType: 'Income Limits',
  },
  {
    name: 'Chicago Housing Authority (CHA)',
    description: 'Public housing, Housing Choice Vouchers, and Project-Based Voucher waitlist information.',
    url: 'https://www.thecha.org/transparency-action-cha-data-impact-hub/waitlist',
    dataType: 'Waitlist Data',
  },
  {
    name: 'Chicago Data Portal',
    description: 'City of Chicago open data on affordable rental housing developments including ARO and LIHTC properties.',
    url: 'https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/s6ha-ppgi',
    dataType: 'Property Data',
  },
];

export const ADDITIONAL_RESOURCES: AdditionalResource[] = [
  {
    name: 'City of Chicago - Renter Resources',
    description: 'Official City of Chicago resources and programs for renters.',
    url: 'https://www.chicago.gov/city/en/depts/doh/provdrs/renters.html',
  },
  {
    name: 'City of Chicago - CHA Overview',
    description: 'City of Chicago page about the Chicago Housing Authority.',
    url: 'https://www.chicago.gov/city/en/depts/other/provdrs/cha.html',
  },
];
