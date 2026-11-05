export type DiscountType = 'percentage' | 'fixed';

export type PromoCodeStatus = 'active' | 'used' | 'expired' | 'revoked';

export type ApplicableScope = 'all' | 'packages' | 'custom_tests';

export type SourceReason = 
  | 'welcome_new' 
  | 'followup_routine' 
  | 'service_recovery' 
  | 'doctor_referral' 
  | 'vip_client' 
  | 'campaign_package' 
  | 'custom';

export interface CodeRedemption {
  redeemedAt: string;
  branch: string;
  invoiceNumber?: string;
  invoiceOriginalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  cashierName?: string;
  notes?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  patientName: string;
  patientPhone: string;
  patientId?: string; // رقم ملف المريض
  discountType: DiscountType;
  discountValue: number;
  minSpend?: number;
  maxDiscountCap?: number;
  applicableScope: ApplicableScope;
  scopeDetails?: string;
  branch: string; // فرع محدد أو جميع الفروع
  createdAt: string;
  expiresAt: string;
  maxUsageCount: number; // عادة 1 للكود المتغير
  usageCount: number;
  status: PromoCodeStatus;
  sourceReason: SourceReason;
  notes?: string;
  redemptions?: CodeRedemption[];
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: SourceReason;
  content: string;
  description: string;
}

export interface LabSettings {
  labName: string;
  tagline: string;
  hotline: string;
  whatsappSupportNumber: string;
  branches: string[];
  defaultPrefix: string;
  defaultValidityDays: number;
  defaultDiscountType: DiscountType;
  defaultDiscountValue: number;
  logoUrl?: string;
  address?: string;
}
