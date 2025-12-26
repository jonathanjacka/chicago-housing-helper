import { LucideIcon, Wallet, IdCard, Home, FileText } from 'lucide-react';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string | null;
  category: DocumentCategory;
  validityDays: number | null;
  isRequired: boolean;
  sortOrder: number;
  programTypes: string[];
}

export type DocumentCategory = 'INCOME' | 'IDENTITY' | 'HOUSING_HISTORY' | 'OTHER';

export interface GroupedDocuments {
  [category: string]: DocumentRequirement[];
}

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  INCOME: 'Income Documents',
  IDENTITY: 'Identity Documents',
  HOUSING_HISTORY: 'Housing History',
  OTHER: 'Other Documents',
};

export const CATEGORY_ICONS: Record<DocumentCategory, LucideIcon> = {
  INCOME: Wallet,
  IDENTITY: IdCard,
  HOUSING_HISTORY: Home,
  OTHER: FileText,
};

export const CATEGORY_ORDER: DocumentCategory[] = [
  'INCOME',
  'IDENTITY',
  'HOUSING_HISTORY',
  'OTHER',
];
