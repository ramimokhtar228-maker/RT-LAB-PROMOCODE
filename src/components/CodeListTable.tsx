import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Printer, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  AlertCircle,
  Edit3
} from 'lucide-react';
import { PromoCode } from '../types';
import { formatArabicDate, getDiscountText, getScopeText } from '../services/whatsapp';

interface CodeListTableProps {
  codes: PromoCode[];
  onOpenWhatsApp: (code: PromoCode) => void;
  onOpenPrint: (code: PromoCode) => void;
  onQuickRedeem: (code: PromoCode) => void;
  onEditCode: (code: PromoCode) => void;
  onDeleteCode: (id: string) => void;
  currentFilter: string;
  onFilterChange: (status: string) => void;
  onCreateNew: () => void;
}

export const CodeListTable: React.FC<CodeListTableProps> = ({
  codes,
  onOpenWhatsApp,
  onOpenPrint,
  onQuickRedeem,
  onEditCode,
  onDeleteCode,
  currentFilter,
  onFilterChange,
  onCreateNew
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Filter and search
  const filteredCodes = codes.filter(c => {
    // Status filter
    if (currentFilter !== 'all' && c.status !== currentFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.patientName.toLowerCase().includes(q);
      const matchPhone = c.patientPhone.includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchBranch = c.branch.toLowerCase().includes(q);
      return matchName || matchPhone || matchCode || matchBranch;
    }

    return true;
  });

  const handleCopyCode = async (code: PromoCode) => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopiedCodeId(code.id);
      setTimeout(() => setCopiedCodeId(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    if (codes.length === 0) return;
    const headers = ['الكود', 'اسم المريض', 'رقم الهاتف', 'نوع الخصم', 'قيمة الخصم', 'النطاق', 'الفرع', 'الحالة', 'تاريخ الإنشاء', 'تاريخ الصلاحية'];
    const rows = codes.map(c => [
      c.code,
      `"${c.patientName.replace(/"/g, '""')}"`,
      `"${c.patientPhone}"`,
      c.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ مقطوع',
      c.discountValue,
      `"${getScopeText(c).replace(/"/g, '""')}"`,
      `"${c.branch}"`,
      c.status === 'active' ? 'ساري' : c.status === 'used' ? 'تم الصرف' : 'منتهي',
      c.createdAt.split('T')[0],
      c.expiresAt.split('T')[0]
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `معامل_رامي_مختار_اكواد_الخصم_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المريض، رقم الموبايل، أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 text-slate-900 shadow-2xs"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              currentFilter === 'all'
                ? 'bg-white text-blue-950 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل ({codes.length})
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              currentFilter === 'active'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ساري ({codes.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => onFilterChange('used')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              currentFilter === 'used'
                ? 'bg-white text-blue-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تم الصرف ({codes.filter(c => c.status === 'used').length})
          </button>
          <button
            onClick={() => onFilterChange('expired')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              currentFilter === 'expired'
                ? 'bg-white text-red-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            منتهي ({codes.filter(c => c.status === 'expired').length})
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          title="تصدير كملف إكسل CSV"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>تصدير CSV</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-100/70 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-4">كود الخصم</th>
              <th className="py-3 px-4">اسم المريض</th>
              <th className="py-3 px-4">رقم الواتساب</th>
              <th className="py-3 px-4">قيمة الخصم</th>
              <th className="py-3 px-4">النطاق والفرع</th>
              <th className="py-3 px-4">الصلاحية</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4 text-center">إجراءات وتحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-700">لا توجد سجلات مطابقة لبحثك الحالي</p>
                    <button
                      onClick={onCreateNew}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                    >
                      إنشاء كود لمريض جديد
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCodes.map((c) => {
                const isExpired = new Date(c.expiresAt).getTime() < Date.now();
                return (
                  <tr key={c.id} className="hover:bg-red-50/30 transition-colors">
                    
                    {/* Promo Code */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold tracking-wider text-red-950 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(c)}
                          title="نسخ الكود"
                          className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                        >
                          {copiedCodeId === c.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Patient Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.patientName}</div>
                      {c.patientId && (
                        <div className="text-[10px] text-slate-400 font-mono">ملف: {c.patientId}</div>
                      )}
                    </td>

                    {/* Patient Phone */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700" dir="ltr">
                      {c.patientPhone || '—'}
                    </td>

                    {/* Discount Value */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-950 tabular-nums">
                      {getDiscountText(c)}
                    </td>

                    {/* Scope & Branch */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate text-slate-800 font-medium">{getScopeText(c)}</div>
                      <div className="text-[11px] text-slate-400">{c.branch}</div>
                    </td>

                    {/* Expiry */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {c.expiresAt.split('T')[0]}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {c.status === 'used' ? (
                        <span className="font-semibold text-blue-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم الصرف</span>
                        </span>
                      ) : isExpired || c.status === 'expired' ? (
                        <span className="font-semibold text-red-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>منتهي</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>ساري</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* WhatsApp Send button */}
                        <button
                          type="button"
                          onClick={() => onOpenWhatsApp(c)}
                          title="إرسال واتساب مع صورة الكارت"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer border border-emerald-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>واتساب</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditCode(c)}
                          title="تعديل بيانات الحقول"
                          className="inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer border border-blue-200"
                        >
                          <Edit3 className="w-3 h-3 text-blue-700" />
                          <span>تعديل</span>
                        </button>

                        {/* Redeem action if active */}
                        {c.status === 'active' && !isExpired && (
                          <button
                            type="button"
                            onClick={() => onQuickRedeem(c)}
                            title="صرف الكود بالاستقبال"
                            className="inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-medium text-red-900 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer border border-red-200"
                          >
                            <span>صرف</span>
                          </button>
                        )}

                        {/* Print voucher */}
                        <button
                          type="button"
                          onClick={() => onOpenPrint(c)}
                          title="طباعة سند الخصم"
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete code / Patient */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من مسح وحذف المريض (${c.patientName}) والكود الخاص به نهائياً من النظام؟`)) {
                              onDeleteCode(c.id);
                            }
                          }}
                          title="حذف ومسح الحالة"
                          className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <strong className="text-blue-950 font-bold">معامل رامي مختار للتحاليل الطبية</strong>
          <span aria-hidden="true">·</span>
          <span>إجمالي الحالات: <strong className="font-mono text-slate-800">{filteredCodes.length}</strong></span>
        </div>
        <div className="text-[11px] text-slate-400">
          إمكانية تعديل وحذف أي سجل فوراً
        </div>
      </div>

    </div>
  );
};
