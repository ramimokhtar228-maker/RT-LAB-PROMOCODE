import { PromoCode, LabSettings } from '../types';
import { DEFAULT_LAB_SETTINGS } from './whatsapp';

const STORAGE_CODES_KEY = 'rm_lab_promo_codes_v1';
const STORAGE_SETTINGS_KEY = 'rm_lab_settings_v1';

// Seed initial realistic data for Ramy Mokhtar Lab
const SEED_PROMO_CODES: PromoCode[] = [
  {
    id: 'seed-1',
    code: 'RM-20-K79W',
    patientName: 'أحمد مصطفى عبد الرحمن',
    patientPhone: '01019283741',
    patientId: 'PT-8841',
    discountType: 'percentage',
    discountValue: 20,
    applicableScope: 'all',
    branch: 'جميع الفروع',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    maxUsageCount: 1,
    usageCount: 0,
    status: 'active',
    sourceReason: 'welcome_new',
    notes: 'مريض جديد - تم التواصل عبر فيسبوك للاستفسار عن تحاليل السكر والدهون'
  },
  {
    id: 'seed-2',
    code: 'RM-15-B42M',
    patientName: 'مروة محمود الشريف',
    patientPhone: '01148291038',
    patientId: 'PT-9102',
    discountType: 'percentage',
    discountValue: 15,
    applicableScope: 'packages',
    scopeDetails: 'باقة الاطمئنان الشامل وصورة الدم الكاملة CBC',
    branch: 'فرع الدقي (الرئيسي)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    maxUsageCount: 1,
    usageCount: 0,
    status: 'active',
    sourceReason: 'campaign_package',
    notes: 'عرض باقة المرأة والفحص الدوري'
  },
  {
    id: 'seed-3',
    code: 'RM-100-N88Q',
    patientName: 'طارق فتحي خليل',
    patientPhone: '01273910482',
    patientId: 'PT-7320',
    discountType: 'fixed',
    discountValue: 100,
    minSpend: 400,
    applicableScope: 'all',
    branch: 'فرع مدينة نصر',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    maxUsageCount: 1,
    usageCount: 1,
    status: 'used',
    sourceReason: 'followup_routine',
    notes: 'متابعة سكر وكوليسترول روتينية',
    redemptions: [
      {
        redeemedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        branch: 'فرع مدينة نصر',
        invoiceNumber: 'INV-2026-4409',
        invoiceOriginalAmount: 750,
        discountAmount: 100,
        finalAmount: 650,
        cashierName: 'مي أحمد (الاستقبال)',
        notes: 'تم فحص صورة دم وسكر تراكمي HbA1c'
      }
    ]
  },
  {
    id: 'seed-4',
    code: 'RM-25-VIP1',
    patientName: 'د. نادية كمال إبراهيم',
    patientPhone: '01558291043',
    patientId: 'PT-6014',
    discountType: 'percentage',
    discountValue: 25,
    applicableScope: 'all',
    branch: 'جميع الفروع',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    maxUsageCount: 1,
    usageCount: 0,
    status: 'active',
    sourceReason: 'vip_client',
    notes: 'تحويل خاص VIP من عيادة د. رامي'
  },
  {
    id: 'seed-5',
    code: 'RM-20-EXP8',
    patientName: 'يوسف هاني سالم',
    patientPhone: '01029384756',
    patientId: 'PT-5129',
    discountType: 'percentage',
    discountValue: 20,
    applicableScope: 'all',
    branch: 'فرع المهندسين',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    maxUsageCount: 1,
    usageCount: 0,
    status: 'expired',
    sourceReason: 'welcome_new',
    notes: 'انتهت صلاحية الكود قبل 3 أيام ولم يتم الصرف'
  }
];

export function getStoredCodes(): PromoCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_CODES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(SEED_PROMO_CODES));
      return SEED_PROMO_CODES;
    }
    const parsed: PromoCode[] = JSON.parse(raw);
    
    // Auto-check expired status
    const now = new Date().getTime();
    let hasChanges = false;
    const updated = parsed.map(c => {
      if (c.status === 'active' && new Date(c.expiresAt).getTime() < now) {
        hasChanges = true;
        return { ...c, status: 'expired' as const };
      }
      return c;
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error('Failed to load promo codes from localStorage', e);
    return SEED_PROMO_CODES;
  }
}

export function savePromoCode(code: PromoCode): PromoCode[] {
  const existing = getStoredCodes();
  const updated = [code, ...existing.filter(c => c.id !== code.id)];
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(updated));
  return updated;
}

export function saveMultiplePromoCodes(codes: PromoCode[]): PromoCode[] {
  const existing = getStoredCodes();
  const updated = [...codes, ...existing];
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(updated));
  return updated;
}

export function updatePromoCode(id: string, updates: Partial<PromoCode>): PromoCode[] {
  const existing = getStoredCodes();
  const updated = existing.map(c => c.id === id ? { ...c, ...updates } : c);
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(updated));
  return updated;
}

export function deletePromoCode(id: string): PromoCode[] {
  const existing = getStoredCodes();
  const updated = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(updated));
  return updated;
}

export function redeemPromoCode(
  codeStr: string,
  redemptionData: {
    branch: string;
    invoiceNumber?: string;
    invoiceOriginalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    cashierName?: string;
    notes?: string;
  }
): { success: boolean; message: string; code?: PromoCode } {
  const codes = getStoredCodes();
  const normalized = codeStr.trim().toUpperCase();
  const targetIndex = codes.findIndex(c => c.code.toUpperCase() === normalized);

  if (targetIndex === -1) {
    return { success: false, message: 'كود الخصم غير موجود بالنظام، يرجى التأكد من الحروف والأرقام.' };
  }

  const promo = codes[targetIndex];

  // Validation checks
  if (promo.status === 'revoked') {
    return { success: false, message: 'هذا الكود تم إلغاؤه مسبقاً من الإدارة.' };
  }

  const now = new Date().getTime();
  if (new Date(promo.expiresAt).getTime() < now) {
    return { success: false, message: 'عفواً، انتهت فترة صلاحية هذا الكود.' };
  }

  if (promo.usageCount >= promo.maxUsageCount) {
    return { success: false, message: 'تم استخدام هذا الكود بالفعل مسبقاً ولا يمكن استخدامه مرة أخرى.' };
  }

  // Branch check
  if (promo.branch !== 'جميع الفروع' && redemptionData.branch && promo.branch !== redemptionData.branch) {
    // If cashier specifies a different branch, warn or allow with note
  }

  const updatedUsage = promo.usageCount + 1;
  const newStatus = updatedUsage >= promo.maxUsageCount ? 'used' : 'active';
  const newRedemptions = [...(promo.redemptions || []), {
    redeemedAt: new Date().toISOString(),
    ...redemptionData
  }];

  const updatedCode: PromoCode = {
    ...promo,
    usageCount: updatedUsage,
    status: newStatus,
    redemptions: newRedemptions
  };

  codes[targetIndex] = updatedCode;
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(codes));

  return {
    success: true,
    message: `تم تطبيق الخصم بنجاح لصالح المريض (${promo.patientName})!`,
    code: updatedCode
  };
}

export function resetToSampleData(): PromoCode[] {
  localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(SEED_PROMO_CODES));
  return SEED_PROMO_CODES;
}

export function getStoredSettings(): LabSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_LAB_SETTINGS));
      return DEFAULT_LAB_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LAB_SETTINGS;
  }
}

export function saveStoredSettings(settings: LabSettings): void {
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
}
