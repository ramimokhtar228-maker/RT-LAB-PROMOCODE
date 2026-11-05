import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, ShieldAlert, Calendar, User, Phone, Tag, Building2, FileText } from 'lucide-react';
import { PromoCode, DiscountType, ApplicableScope, PromoCodeStatus, LabSettings } from '../types';

interface EditPromoModalProps {
  promo: PromoCode | null;
  isOpen: boolean;
  settings: LabSettings;
  onClose: () => void;
  onSave: (updatedCode: PromoCode) => void;
}

export const EditPromoModal: React.FC<EditPromoModalProps> = ({
  promo,
  isOpen,
  settings,
  onClose,
  onSave
}) => {
  if (!isOpen || !promo) return null;

  const [patientName, setPatientName] = useState(promo.patientName);
  const [patientPhone, setPatientPhone] = useState(promo.patientPhone);
  const [patientId, setPatientId] = useState(promo.patientId || '');
  const [code, setCode] = useState(promo.code);
  const [discountType, setDiscountType] = useState<DiscountType>(promo.discountType);
  const [discountValue, setDiscountValue] = useState<number>(promo.discountValue);
  const [applicableScope, setApplicableScope] = useState<ApplicableScope>(promo.applicableScope);
  const [scopeDetails, setScopeDetails] = useState(promo.scopeDetails || '');
  const [branch, setBranch] = useState(promo.branch);
  const [status, setStatus] = useState<PromoCodeStatus>(promo.status);
  const [expiresAtDate, setExpiresAtDate] = useState(() => {
    try {
      return new Date(promo.expiresAt).toISOString().split('T')[0];
    } catch {
      return '';
    }
  });
  const [maxUsageCount, setMaxUsageCount] = useState<number>(promo.maxUsageCount || 1);
  const [notes, setNotes] = useState(promo.notes || '');

  // Keep in sync when promo changes
  useEffect(() => {
    if (promo) {
      setPatientName(promo.patientName);
      setPatientPhone(promo.patientPhone);
      setPatientId(promo.patientId || '');
      setCode(promo.code);
      setDiscountType(promo.discountType);
      setDiscountValue(promo.discountValue);
      setApplicableScope(promo.applicableScope);
      setScopeDetails(promo.scopeDetails || '');
      setBranch(promo.branch);
      setStatus(promo.status);
      try {
        setExpiresAtDate(new Date(promo.expiresAt).toISOString().split('T')[0]);
      } catch {
        setExpiresAtDate('');
      }
      setMaxUsageCount(promo.maxUsageCount || 1);
      setNotes(promo.notes || '');
    }
  }, [promo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('يرجى كتابة اسم المريض');
      return;
    }

    let calculatedExpiry = promo.expiresAt;
    if (expiresAtDate) {
      const d = new Date(expiresAtDate);
      d.setHours(23, 59, 59, 999);
      calculatedExpiry = d.toISOString();
    }

    const updated: PromoCode = {
      ...promo,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientId: patientId.trim() || undefined,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 10,
      applicableScope,
      scopeDetails: applicableScope !== 'all' ? scopeDetails.trim() : undefined,
      branch,
      status,
      expiresAt: calculatedExpiry,
      maxUsageCount: Number(maxUsageCount) || 1,
      notes: notes.trim() || undefined
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header with Dark Red & Navy accents */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-950 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-700 text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                تعديل بيانات كود المريض
              </h2>
              <p className="text-xs text-red-200">
                يمكنك تعديل أي حقل من حقول الحالة أو تحديث تاريخ الصلاحية وقيمة الخصم
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم المريض <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                رقم الواتساب / الهاتف <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-white text-slate-900 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                كود الخصم (Promo Code)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono font-bold tracking-wider text-blue-950 uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                رقم الملف الطبي / الكود الداخلي
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="مثال: PT-9042"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 font-mono text-slate-800"
              />
            </div>
          </div>

          {/* Discount Settings */}
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-950 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-red-700" />
                <span>إعدادات ونسبة الخصم</span>
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-red-200">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    discountType === 'percentage'
                      ? 'bg-red-800 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    discountType === 'fixed'
                      ? 'bg-red-800 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  مبلغ ثابت (ج.م)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  قيمة الخصم ({discountType === 'percentage' ? '%' : 'جنيه'})
                </label>
                <input
                  type="number"
                  min="1"
                  max={discountType === 'percentage' ? 100 : 5000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-red-200 rounded-lg font-mono font-bold text-base text-red-950 text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  حالة الكود بالنظام
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PromoCodeStatus)}
                  className="w-full p-2 bg-white border border-red-200 rounded-lg font-medium text-slate-800"
                >
                  <option value="active">ساري (Active)</option>
                  <option value="used">تم الصرف (Used)</option>
                  <option value="expired">منتهي الصلاحية (Expired)</option>
                  <option value="revoked">ملغي من الإدارة (Revoked)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scope and Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الفحوصات المشمولة بالخصم
              </label>
              <select
                value={applicableScope}
                onChange={(e) => setApplicableScope(e.target.value as ApplicableScope)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="all">جميع التحاليل والفحوصات الطبية بالمعمل</option>
                <option value="packages">باقات الفحص الدوري الشامل</option>
                <option value="custom_tests">فحوصات محددة</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                تاريخ انتهاء الصلاحية
              </label>
              <input
                type="date"
                value={expiresAtDate}
                onChange={(e) => setExpiresAtDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>
          </div>

          {applicableScope !== 'all' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                تفاصيل الفحوصات المشمولة
              </label>
              <input
                type="text"
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                placeholder="مثال: تحاليل الغدة الدرقية وباقة صورة الدم الكاملة"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الفرع المتاح به الخصم
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {settings.branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مرات الاستخدام القصوى
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxUsageCount}
                onChange={(e) => setMaxUsageCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ملاحظات إضافية لحالة المريض
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أي تعليمات لموظف الاستقبال أو تفاصيل خاصة بالمريض..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات في النظام</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
