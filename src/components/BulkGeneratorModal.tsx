import React, { useState } from 'react';
import { X, Layers, Sparkles, Check, Download, ExternalLink } from 'lucide-react';
import { PromoCode, DiscountType, ApplicableScope } from '../types';
import { generateRandomCode, DEFAULT_LAB_SETTINGS } from '../services/whatsapp';

interface BulkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBulk: (codes: PromoCode[]) => void;
}

export const BulkGeneratorModal: React.FC<BulkGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaveBulk
}) => {
  if (!isOpen) return null;

  const [inputLines, setInputLines] = useState<string>(
`محمد علي فهمي, 01019283741
سارة إبراهيم الدسوقي, 01182910482
خالد عبد الرحمن حسن, 01293847561
منى عادل مرسي, 01558291044`
  );
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [validityDays, setValidityDays] = useState<number>(7);
  const [applicableScope, setApplicableScope] = useState<ApplicableScope>('all');
  const [scopeDetails, setScopeDetails] = useState('');
  const [branch, setBranch] = useState(DEFAULT_LAB_SETTINGS.branches[0]);
  const [prefix, setPrefix] = useState('RM');

  const handleGenerate = () => {
    const lines = inputLines
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      alert('يرجى إدخال مريض واحد على الأقل (اسم ورقم الهاتف)');
      return;
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

    const generatedCodes: PromoCode[] = lines.map((line, idx) => {
      // Split by comma or semicolon or tab
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      const patientName = parts[0] || `مريض ${idx + 1}`;
      const patientPhone = parts[1] || '';

      return {
        id: 'bulk-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substring(2, 5),
        code: generateRandomCode(prefix, discountValue),
        patientName,
        patientPhone,
        discountType,
        discountValue,
        applicableScope,
        scopeDetails: applicableScope !== 'all' ? scopeDetails : undefined,
        branch,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        maxUsageCount: 1,
        usageCount: 0,
        status: 'active',
        sourceReason: 'campaign_package',
        notes: 'تم الإصدار عبر التوليد الجماعي لحملة المعمل'
      };
    });

    onSaveBulk(generatedCodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                توليد أكواد متغيرة جماعية لحملة مرضى
              </h2>
              <p className="text-xs text-slate-500">
                أدخل قائمة أسماء المرضى وهواتفهم لتوليد كود فريد لكل مريض في ثوانٍ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                قائمة المرضى (اسم المريض، رقم الهاتف في كل سطر):
              </label>
              <span className="text-[11px] text-slate-500">
                يمكنك النسخ واللصق مباشرة من ملف إكسل Excel
              </span>
            </div>
            <textarea
              rows={6}
              value={inputLines}
              onChange={(e) => setInputLines(e.target.value)}
              placeholder="محمد أحمد, 01012345678&#10;منى محمود, 01198765432"
              className="w-full p-3 font-mono border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">نوع وقيمة الخصم</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-20 p-2 border border-slate-200 rounded-lg font-mono font-bold text-center"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="flex-1 p-2 border border-slate-200 rounded-lg"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ مقطوع (ج.م)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">صلاحية الأكواد</label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value={3}>3 أيام</option>
                <option value={7}>7 أيام (أسبوع)</option>
                <option value={14}>14 يوماً</option>
                <option value={30}>30 يوماً</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">بادئة الكود</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الفحوصات المشمولة</label>
              <select
                value={applicableScope}
                onChange={(e) => setApplicableScope(e.target.value as ApplicableScope)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="all">جميع التحاليل الطبية</option>
                <option value="packages">باقات الفحص الدوري الشامل</option>
                <option value="custom_tests">تحاليل محددة</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">الفرع المتاح</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {DEFAULT_LAB_SETTINGS.branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {applicableScope !== 'all' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">تفاصيل الباقة أو الفحص</label>
              <input
                type="text"
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                placeholder="مثال: باقة الاطمئنان الشاملة لمرضى السكري والضغط"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>توليد الأكواد وإضافتها للنظام</span>
          </button>
        </div>

      </div>
    </div>
  );
};
