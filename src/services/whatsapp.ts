import { PromoCode, WhatsAppTemplate } from '../types';

export const DEFAULT_LAB_SETTINGS = {
  labName: 'معامل رامي مختار للتحاليل الطبية',
  tagline: 'دقة التشخيص.. ورعايتكم أولويتنا',
  hotline: '19876',
  whatsappSupportNumber: '01001234567',
  branches: [
    'جميع الفروع',
    'فرع الدقي (الرئيسي)',
    'فرع المهندسين',
    'فرع مدينة نصر',
    'فرع مصر الجديدة',
    'فرع الإسكندرية - سموحة'
  ],
  defaultPrefix: 'RM',
  defaultValidityDays: 7,
  defaultDiscountType: 'percentage' as const,
  defaultDiscountValue: 20
};

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'welcome_new',
    name: 'ترحيب بمريض جديد (خصم الزيارة الأولى)',
    category: 'welcome_new',
    description: 'يُرسل للمريض عند تسجيله لأول مرة لتحفيزه على إتمام فحوصاته بالمعمل',
    content: 
`أهلاً بحضرتك يا فندم *{patientName}* 🌸
معاك *معامل رامي مختار للتحاليل الطبية* 🧪

يسعدنا تقديم كود خصم ترحيبي خاص لحضرتك:
🎁 كود الخصم: *{code}*
💰 قيمة الخصم: *{discountText}*
📋 الفحوصات المشمولة: {scopeText}
⏰ صالح حتى تاريخ: *{expiryDate}*
📍 متاح في: {branch}

*طريقة الاستخدام:*
يكفي إبراز هذا الكود أو رسالة الواتساب لموظف الاستقبال عند زيارتك للمعمل لتطبيق الخصم فوراً.

نتمنى لحضرتك دوام الصحة والعافية! 🩺
📞 الخط الساخن: {hotline}
معامل رامي مختار - دقة التشخيص ورعايتكم أولويتنا`
  },
  {
    id: 'followup_routine',
    name: 'متابعة دورية / فحص روتيني',
    category: 'followup_routine',
    description: 'يُرسل لتشجيع المريض على المتابعة الدورية للسكر أو الغدة أو الفحص الشامل',
    content:
`عزيزنا/تنا *{patientName}* 💙
تحية طيبة من *معامل رامي مختار للتحاليل الطبية* 🩺

حرصاً منا على متابعة حالتكم الصحية بانتظام، خصصنا لحضرتك برومو كود شخصي لمتابعتك القادمة:
🔹 كود الخصم: *{code}*
🔹 نسبة الخصم: *{discountText}*
🔹 الفحوصات: {scopeText}
🔹 ينتهي في: *{expiryDate}*

لا تتردد في الاطمئنان على صحتك، يمكنك التوجه إلى: {branch}
نسعد دائماً بخدمتكم وتوفير أدق النتائج المخبرية.

📞 للحجز والاستفسار: {hotline}`
  },
  {
    id: 'campaign_package',
    name: 'عرض باقة الفحص الشامل',
    category: 'campaign_package',
    description: 'يُرسل لترويج باقات الفحص الدوري الشامل بخصم خاص للمريض',
    content:
`أهلاً بحضرتك أستاذ/ة *{patientName}* 🩺
من *معامل رامي مختار للتحاليل الطبية* 🔬

صحتك وصحة أسرتك أمانة تستحق الاطمئنان الدوري!
يسرنا إهداؤك برومو كود خاص لفحوصاتك الطبية:
🏷️ كود الخصم: *{code}*
✨ الخصم: *{discountText}* على {scopeText}
📅 الكود ساري لمدة محددة حتى: *{expiryDate}*
🏥 الفروع: {branch}

💡 للاستفادة من الخصم، يرجى إبلاغ موظف الاستقبال بالكود *{code}* قبل سحب العينة.
دمتم في أتم صحة وعافية! 🌷`
  },
  {
    id: 'service_recovery',
    name: 'اعتذار وترضية عميل (Patient Care)',
    category: 'service_recovery',
    description: 'يُرسل لترضية مريض حدث معه تأخير في النتائج أو مشكلة بالخدمة',
    content:
`أستاذ/ة *{patientName}* المحترم/ة 🌷
تحية خاصة من إدارة *معامل رامي مختار للتحاليل الطبية*

نأسف جداً لأي إزعاج أو تأخير قد واجهتموه خلال زيارتكم الأخيرة. رضاكم وراحتكم هي غايتنا الأولى دائماً.
تقديراً لحضرتك واعتزازاً بثقتكم، يشرفنا تقديم برومو كود خصم خاص لحضرتك لزيارتك القادمة:
⭐ كود الخصم: *{code}*
⭐ قيمة الخصم: *{discountText}*
⭐ الصلاحية: ساري حتى *{expiryDate}*
⭐ الفروع: {branch}

فريقنا في انتظار تشريفكم لتقديم أفضل تجربة طبية تستحقونها.
لأي مساعدة مباشرة: {hotline}`
  },
  {
    id: 'doctor_referral',
    name: 'تحويل طبيب أو VIP',
    category: 'doctor_referral',
    description: 'يُرسل لحالات التحويل الخاصة أو عملاء الـ VIP',
    content:
`مرحباً بحضرتك *{patientName}* 🌟
معامل رامي مختار ترحب بكم دائماً.

بناءً على طلبكم/تحويلكم الطبي، تم تفعيل برومو كود الخصم المخصص لحضرتك:
🔖 كود الخصم: *{code}*
💎 قيمة الخصم: *{discountText}*
🧪 النطاق: {scopeText}
⏳ ينتهي في: *{expiryDate}*
🏢 متاح في: {branch}

يرجى إبراز الكود عند شباك الاستقبال للاستفادة الفورية.
نسأل الله لكم دوام الصحة والعافية.`
  }
];

/**
 * Clean phone number into international WhatsApp format
 * Egyptian numbers like 01012345678 -> 201012345678
 */
export function cleanPhoneNumberForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Egyptian format handling:
  // Starts with 010, 011, 012, 015 with length 11
  if (digits.startsWith('01') && digits.length === 11) {
    return '20' + digits.substring(1);
  }

  // Starts with 201
  if (digits.startsWith('201') && digits.length === 12) {
    return digits;
  }

  // Starts with 0020
  if (digits.startsWith('0020')) {
    return digits.substring(2);
  }

  // Already international format (e.g. 966..., 971..., etc.)
  return digits;
}

/**
 * Format expiry date in Arabic readable string
 */
export function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format discount representation
 */
export function getDiscountText(promo: Pick<PromoCode, 'discountType' | 'discountValue'>): string {
  if (promo.discountType === 'percentage') {
    return `${promo.discountValue}%`;
  }
  return `${promo.discountValue} جنيه مصري`;
}

/**
 * Format scope representation
 */
export function getScopeText(promo: Pick<PromoCode, 'applicableScope' | 'scopeDetails'>): string {
  if (promo.applicableScope === 'all') {
    return 'جميع التحاليل والفحوصات الطبية';
  }
  if (promo.applicableScope === 'packages') {
    return promo.scopeDetails || 'باقات الفحص الشامل والدوري';
  }
  return promo.scopeDetails || 'تحاليل وفحوصات محددة';
}

/**
 * Replace placeholders in WhatsApp template
 */
export function compileWhatsAppMessage(
  templateContent: string,
  promo: PromoCode,
  settings: typeof DEFAULT_LAB_SETTINGS = DEFAULT_LAB_SETTINGS
): string {
  const discountText = getDiscountText(promo);
  const scopeText = getScopeText(promo);
  const expiryDate = formatArabicDate(promo.expiresAt);

  return templateContent
    .replace(/{patientName}/g, promo.patientName || 'المريض المحترم')
    .replace(/{code}/g, promo.code)
    .replace(/{discountText}/g, discountText)
    .replace(/{scopeText}/g, scopeText)
    .replace(/{expiryDate}/g, expiryDate)
    .replace(/{branch}/g, promo.branch || 'جميع فروع معامل رامي مختار')
    .replace(/{hotline}/g, settings.hotline)
    .replace(/{labName}/g, settings.labName);
}

/**
 * Build direct WhatsApp Web / App link
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumberForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  if (!cleanPhone) {
    // If no phone provided, allows choosing contact inside WhatsApp
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generate a random alphanumeric code
 * e.g., RM-8492 or MOKHTAR-20-X8K
 */
export function generateRandomCode(prefix = 'RM', discountValue?: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  if (discountValue) {
    return `${prefix}-${discountValue}-${rand}`;
  }
  return `${prefix}-${rand}`;
}
