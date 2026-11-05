import React from 'react';
import { PromoCode } from '../types';

interface StatsCardsProps {
  codes: PromoCode[];
  onFilterChange: (status: string) => void;
  currentFilter: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  codes,
  onFilterChange,
  currentFilter
}) => {
  const total = codes.length;
  const active = codes.filter(c => c.status === 'active').length;
  const used = codes.filter(c => c.status === 'used').length;
  const expired = codes.filter(c => c.status === 'expired').length;

  const totalDiscountValue = codes.reduce((sum, c) => {
    if (!c.redemptions) return sum;
    const codeDiscount = c.redemptions.reduce((sub, r) => sub + (r.discountAmount || 0), 0);
    return sum + codeDiscount;
  }, 0);

  const redemptionRate = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* All Codes */}
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
          currentFilter === 'all'
            ? 'bg-white border-blue-900 shadow-sm ring-2 ring-blue-900/10'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>إجمالي المرضى والأكواد</span>
          <span className="text-blue-950 font-bold">الكل</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-blue-950">
          {total}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          مسجلين في معامل رامي مختار
        </div>
      </button>

      {/* Active Codes */}
      <button
        type="button"
        onClick={() => onFilterChange('active')}
        className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
          currentFilter === 'active'
            ? 'bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/10'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>أكواد سارية وجاهزة للإرسال</span>
          <span className="text-emerald-700 font-bold">ساري</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
          {active}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          بانتظار زيارة المريض للمعمل
        </div>
      </button>

      {/* Used Codes */}
      <button
        type="button"
        onClick={() => onFilterChange('used')}
        className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
          currentFilter === 'used'
            ? 'bg-white border-red-800 shadow-sm ring-2 ring-red-800/10'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>تم صرفها بالاستقبال</span>
          <span className="text-red-800 font-bold">تم الصرف</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-red-900">
          {used}
        </div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono tabular-nums">
          <span>نسبة الحضور:</span>
          <span className="font-bold text-red-900">{redemptionRate}%</span>
        </div>
      </button>

      {/* Financial impact */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white text-right">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>خصومات مصروفة بالخزينة</span>
          <span className="text-amber-700 font-bold font-mono">الخزينة</span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
          {totalDiscountValue.toLocaleString('ar-EG')} <span className="text-sm font-normal font-sans text-slate-600">ج.م</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          أكواد منتهية: <span className="font-mono tabular-nums text-red-700 font-bold">{expired}</span>
        </div>
      </div>
    </div>
  );
};
