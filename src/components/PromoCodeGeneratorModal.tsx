import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';
import { PromoCode, DiscountType, ApplicableScope, SourceReason, LabSettings } from '../types';
import { generateRandomCode } from '../services/whatsapp';

interface PromoCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LabSettings;
  onSave: (code: PromoCode, openWhatsAppImmediately: boolean) => void;
}

export const PromoCodeGeneratorModal: React.FC<PromoCodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  if (!isOpen) return null;

  // Form states with dynamic lab defaults
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientId, setPatientId] = useState('');
  const [sourceReason, setSourceReason] = useState<SourceReason>('welcome_new');
  const [discountType, setDiscountType] = useState<DiscountType>(settings.defaultDiscountType || 'percentage');
  const [discountValue, setDiscountValue] = useState<number>(settings.defaultDiscountValue || 20);
  const [validityDays, setValidityDays] = useState<number>(settings.defaultValidityDays || 7);
  const [applicableScope, setApplicableScope] = useState<ApplicableScope>('all');
  const [scopeDetails, setScopeDetails] = useState('');
  const [branch, setBranch] = useState(settings.branches[0] || 'جميع الفروع');
  const [notes, setNotes] = useState('');
  const [customCode, setCustomCode] = useState<string>(() => 
    generateRandomCode(settings.defaultPrefix || 'RM', settings.defaultDiscountValue || 20)
  );

  const handleRegenerateCode = () => {
    setCustomCode(generateRandomCode(settings.defaultPrefix || 'RM', discountValue));
  };

  const handleDiscountChange = (val: number, type: DiscountType) => {
    setDiscountValue(val);
    setDiscountType(type);
    setCustomCode(generateRandomCode('RM', val));
  };

  const handleSubmit = (openWhatsApp: boolean) => {
    if (!patientName.trim()) {
      alert('يرجى كتابة اسم المريض');
      return;
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

    const newCode: PromoCode = {
      id: 'promo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      code: customCode.trim().toUpperCase() || generateRandomCode('RM', discountValue),
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientId: patientId.trim() || undefined,
      discountType,
      discountValue: Number(discountValue) || 10,
      applicableScope,
      scopeDetails: applicableScope !== 'all' ? scopeDetails : undefined,
      branch,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      maxUsageCount: 1,
      usageCount: 0,
      status: 'active',
      sourceReason,
      notes: notes.trim() || undefined
    };

    onSave(newCode, openWhatsApp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <img 
              src={settings.logoUrl || "/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg"} 
              alt="Logo" 
              className="w-10 h-10 rounded-full border border-white/20 bg-white object-contain"
            />
            <div>
              <h2 className="text-base font-bold text-white">
                إنشاء برومو كود خصم متغير لمريض
              </h2>
              <p className="text-xs text-red-200">
                {settings.labName} | توليد كود وصورة كارت الخصم للمريض
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم المريض <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: محمد أحمد علي"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الواتساب / الموبايل <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="01012345678 أو +201012345678"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white font-mono text-slate-900"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مناسبة الخصم
              </label>
              <select
                value={sourceReason}
                onChange={(e) => setSourceReason(e.target.value as SourceReason)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
              >
                <option value="welcome_new">ترحيب بمريض جديد (زيارة أولى)</option>
                <option value="followup_routine">متابعة فحص دوري وسكر</option>
                <option value="campaign_package">عرض باقة الفحص الدوري الشامل</option>
                <option value="service_recovery">اعتذار وترضية عميل (Service Recovery)</option>
                <option value="vip_client">عميل مميز أو تحويل طبيب VIP</option>
                <option value="custom">سبب مخصص آخر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم ملف المريض / الكود الطبي (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: PT-9042"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Discount Settings */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-950">
                تحديد قيمة ونوع الخصم
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-red-200 text-xs">
                <button
                  type="button"
                  onClick={() => handleDiscountChange(discountValue, 'percentage')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    discountType === 'percentage'
                      ? 'bg-red-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  onClick={() => handleDiscountChange(discountValue, 'fixed')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    discountType === 'fixed'
                      ? 'bg-red-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  مبلغ ثابت (ج.م)
                </button>
              </div>
            </div>

            {/* Quick discount buttons */}
            <div className="flex items-center gap-2">
              {discountType === 'percentage' ? (
                [10, 15, 20, 25, 30].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleDiscountChange(val, 'percentage')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                      discountValue === val
                        ? 'bg-red-800 text-white font-bold'
                        : 'bg-white border border-red-200 text-red-950 hover:bg-red-100/50'
                    }`}
                  >
                    {val}%
                  </button>
                ))
              ) : (
                [50, 100, 150, 200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleDiscountChange(val, 'fixed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                      discountValue === val
                        ? 'bg-red-800 text-white font-bold'
                        : 'bg-white border border-red-200 text-red-950 hover:bg-red-100/50'
                    }`}
                  >
                    {val} ج.م
                  </button>
                ))
              )}

              <input
                type="number"
                min="1"
                max={discountType === 'percentage' ? 100 : 5000}
                value={discountValue}
                onChange={(e) => handleDiscountChange(Number(e.target.value), discountType)}
                className="w-24 text-xs p-1.5 bg-white border border-red-300 rounded-lg text-center font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Scope and Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الفحوصات المشمولة بالخصم
              </label>
              <select
                value={applicableScope}
                onChange={(e) => setApplicableScope(e.target.value as ApplicableScope)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
              >
                <option value="all">جميع التحاليل والفحوصات الطبية بالمعمل</option>
                <option value="packages">باقات الفحص الدوري الشامل</option>
                <option value="custom_tests">فحوصات محددة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                صلاحية الكود (أيام)
              </label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
              >
                <option value={3}>3 أيام (تحفيز سريع)</option>
                <option value={7}>7 أيام (أسبوع - مقترح)</option>
                <option value={14}>14 يوماً (أسبوعان)</option>
                <option value={30}>30 يوماً (شهر كامل)</option>
              </select>
            </div>
          </div>

          {applicableScope !== 'all' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تفاصيل الفحوصات أو الباقة
              </label>
              <input
                type="text"
                placeholder="مثال: باقة وظائف الكبد والكلى وصورة الدم الكاملة"
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
              />
            </div>
          )}

          {/* Branch and Code Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الفرع المتاح به الخصم
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
              >
                {settings.branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                كود الخصم المتولد
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-mono font-bold tracking-wider text-red-950 bg-slate-50 uppercase"
                />
                <button
                  type="button"
                  title="توليد كود آخر عشوائي"
                  onClick={handleRegenerateCode}
                  className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات داخلية للحالة
            </label>
            <input
              type="text"
              placeholder="اكتب أي ملاحظة عن المريض أو الفحوصات المطلوبة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-slate-800"
            />
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950">
            <ShieldAlert className="w-4 h-4 text-blue-800 shrink-0" />
            <span>
              <strong>أمان المعمل:</strong> هذا الكود لمرة واحدة فقط ومربوط برقم هاتف المريض لمنع المشاركة غير المصرح بها.
            </span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              حفظ الكود فقط
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>حفظ وعرض كارت الواتساب فوراً</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
