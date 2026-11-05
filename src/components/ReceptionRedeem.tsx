import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Printer, 
  Receipt, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromoCode, LabSettings } from '../types';
import { redeemPromoCode } from '../services/storage';
import { formatArabicDate, getDiscountText, getScopeText } from '../services/whatsapp';

interface ReceptionRedeemProps {
  codes: PromoCode[];
  settings: LabSettings;
  onCodeUpdated: () => void;
  onPrintVoucher: (code: PromoCode) => void;
}

export const ReceptionRedeem: React.FC<ReceptionRedeemProps> = ({
  codes,
  settings,
  onCodeUpdated,
  onPrintVoucher
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCode, setSelectedCode] = useState<PromoCode | null>(null);
  const [billAmount, setBillAmount] = useState<number | ''>('');
  const [cashierName, setCashierName] = useState('موظف الاستقبال');
  const [selectedBranch, setSelectedBranch] = useState(settings.branches[1] || 'فرع الدقي (الرئيسي)');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const found = codes.find(c => 
      c.code.toUpperCase() === query || 
      c.patientPhone.includes(query) ||
      (c.patientName && c.patientName.includes(searchInput.trim()))
    );

    if (found) {
      setSelectedCode(found);
      setInvoiceNumber('INV-' + Math.floor(10000 + Math.random() * 90000));
    } else {
      setSelectedCode(null);
      setStatusMessage({
        type: 'error',
        text: `لم يتم العثور على أي كود خصم مطابق لـ "${searchInput}". يرجى التحقق من الأحرف والأرقام.`
      });
    }
  };

  // Calculate discount amount
  const original = typeof billAmount === 'number' ? billAmount : 0;
  let calculatedDiscount = 0;
  if (selectedCode && original > 0) {
    if (selectedCode.discountType === 'percentage') {
      calculatedDiscount = (original * selectedCode.discountValue) / 100;
      if (selectedCode.maxDiscountCap && calculatedDiscount > selectedCode.maxDiscountCap) {
        calculatedDiscount = selectedCode.maxDiscountCap;
      }
    } else {
      calculatedDiscount = Math.min(original, selectedCode.discountValue);
    }
  }
  const finalAmount = Math.max(0, original - calculatedDiscount);

  const handleRedeem = () => {
    if (!selectedCode) return;

    const result = redeemPromoCode(selectedCode.code, {
      branch: selectedBranch,
      invoiceNumber: invoiceNumber.trim() || undefined,
      invoiceOriginalAmount: original > 0 ? original : undefined,
      discountAmount: calculatedDiscount > 0 ? calculatedDiscount : undefined,
      finalAmount: original > 0 ? finalAmount : undefined,
      cashierName: cashierName.trim() || 'الاستقبال',
      notes: notes.trim() || undefined
    });

    if (result.success && result.code) {
      setSelectedCode(result.code);
      setStatusMessage({ type: 'success', text: result.message });
      onCodeUpdated();
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const isExpired = selectedCode ? new Date(selectedCode.expiresAt).getTime() < Date.now() : false;
  const isUsed = selectedCode ? selectedCode.usageCount >= selectedCode.maxUsageCount : false;
  const canRedeem = selectedCode && !isExpired && !isUsed && selectedCode.status === 'active';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner Card in Deep Navy & Dark Red */}
      <div className="p-6 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={settings.logoUrl || "/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg"} 
            alt={settings.labName} 
            className="w-12 h-12 rounded-full border border-white/20 bg-white object-contain shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-red-300 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>محطة موظفي الاستقبال والخزينة - {settings.labName}</span>
            </div>
            <h1 className="text-xl font-bold">بوابة التحقق وصرف برومو كود المريض</h1>
            <p className="text-xs text-slate-300 mt-1">
              أدخل كود الخصم المعروض على شاشة موبايل المريض للتحقق من الصلاحية وتطبيق الخصم فوراً.
            </p>
          </div>
        </div>
      </div>

      {/* Code Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="اكتب كود الخصم (مثال: RM-20-K79W) أو رقم هاتف المريض أو اسمه..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-sm pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800 focus:bg-white text-slate-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-red-800 hover:bg-red-900 text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            تحقق من الكود
          </button>
        </form>

        {/* Quick select from recent active codes */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span>أكواد سريعة للاختبار:</span>
          {codes.slice(0, 4).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchInput(c.code);
                setSelectedCode(c);
                setStatusMessage(null);
                setInvoiceNumber('INV-' + Math.floor(10000 + Math.random() * 90000));
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-900 rounded font-mono text-[11px] border border-slate-200 cursor-pointer transition-colors"
            >
              {c.code} ({c.patientName.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Status Alert if any */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : statusMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-bold text-sm">{statusMessage.text}</span>
        </div>
      )}

      {/* Selected Code Details Card */}
      {selectedCode && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Card Top */}
          <div className={`p-6 border-b flex flex-wrap items-center justify-between gap-4 ${
            canRedeem 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : isUsed
              ? 'bg-blue-50/70 border-blue-200'
              : 'bg-red-50/70 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-xl ${
                canRedeem 
                  ? 'bg-emerald-600 text-white' 
                  : isUsed 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-red-800 text-white'
              }`}>
                {canRedeem ? <CheckCircle2 className="w-7 h-7" /> : isUsed ? <Receipt className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black font-mono text-slate-900 tracking-wider">
                    {selectedCode.code}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-medium">
                    {canRedeem ? (
                      <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">كود صالح للاستخدام فوراً ✓</span>
                    ) : isUsed ? (
                      <span className="text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded">تم استخدام الكود مسبقاً</span>
                    ) : isExpired ? (
                      <span className="text-red-800 font-bold bg-red-100 px-2 py-0.5 rounded">كود منتهي الصلاحية</span>
                    ) : (
                      <span className="text-slate-800 bg-slate-200 px-2 py-0.5 rounded">{selectedCode.status}</span>
                    )}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                  <span>المريض: <strong className="text-slate-900">{selectedCode.patientName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedCode.patientPhone}</span>
                  {selectedCode.patientId && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>الملف: <span className="font-mono">{selectedCode.patientId}</span></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs text-slate-500">قيمة الخصم المستحق</div>
              <div className="text-2xl font-black font-mono text-red-900">
                {getDiscountText(selectedCode)}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">الفحوصات المشمولة:</span>
                <span className="font-bold text-slate-900">{getScopeText(selectedCode)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">الفرع المتاح به:</span>
                <span className="font-bold text-slate-900">{selectedCode.branch}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">تاريخ انتهاء الصلاحية:</span>
                <span className="font-bold font-mono text-red-800">{formatArabicDate(selectedCode.expiresAt)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">نوع الاستخدام:</span>
                <span className="font-medium text-slate-900">
                  كود فردي لمرة واحدة ({selectedCode.usageCount} / {selectedCode.maxUsageCount})
                </span>
              </div>
            </div>

            {/* Previous redemption info if used */}
            {selectedCode.redemptions && selectedCode.redemptions.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-red-800" />
                  <span>بيانات الصرف السابق بالمعمل:</span>
                </div>
                {selectedCode.redemptions.map((r, i) => (
                  <div key={i} className="text-slate-600 text-[11px] leading-relaxed pt-1">
                    <div>تاريخ الصرف: <span className="font-mono">{formatArabicDate(r.redeemedAt)}</span></div>
                    <div>الفرع: {r.branch} · الموظف: {r.cashierName || 'الاستقبال'}</div>
                    {r.invoiceNumber && <div>رقم الفاتورة: <span className="font-mono">{r.invoiceNumber}</span></div>}
                    {r.discountAmount && <div>مبلغ الخصم: <span className="font-mono font-bold text-red-900">{r.discountAmount} ج.م</span></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Redemption Form */}
          {canRedeem ? (
            <div className="p-6 bg-slate-50 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-800" />
                <span>حساب الفاتورة وصرف الخصم للمريض:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    إجمالي فاتورة التحاليل (ج.م)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="مثال: 750"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-base font-bold font-mono p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رقم الفاتورة / الإيصال
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الفرع الحالي
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-800"
                  >
                    {settings.branches.filter(b => b !== 'جميع الفروع').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculator Summary strip */}
              {original > 0 && (
                <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl grid grid-cols-3 text-center gap-2 font-mono tabular-nums">
                  <div>
                    <div className="text-[11px] text-slate-600 font-sans">المبلغ قبل الخصم</div>
                    <div className="text-lg font-bold text-slate-800">{original} ج.م</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-red-950 font-bold font-sans">قيمة الخصم (-)</div>
                    <div className="text-lg font-bold text-red-800">-{calculatedDiscount.toFixed(1)} ج.م</div>
                  </div>
                  <div className="border-r border-red-200 pr-2">
                    <div className="text-[11px] text-blue-950 font-bold font-sans">المبلغ المطلوب من المريض</div>
                    <div className="text-xl font-extrabold text-blue-900">{finalAmount.toFixed(1)} ج.م</div>
                  </div>
                </div>
              )}

              {/* Cashier input and action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="اسم موظف الاستقبال"
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onPrintVoucher(selectedCode)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>طباعة سند الخصم</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRedeem}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-800 hover:bg-red-900 active:bg-red-950 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد وصرف الخصم في الفاتورة</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-6 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                {isUsed 
                  ? 'تم استخدام هذا الكود بالفعل. يمكنك طباعة إيصال التأكيد أو الاطلاع على السجل.' 
                  : 'لا يمكن صرف هذا الكود نظراً لانتهاء صلاحيته أو عدم تفعيله.'}
              </span>

              <button
                type="button"
                onClick={() => onPrintVoucher(selectedCode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة سند الكود</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
