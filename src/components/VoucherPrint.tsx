import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer } from 'lucide-react';
import { PromoCode } from '../types';
import { getStoredSettings } from '../services/storage';
import { formatArabicDate, getDiscountText, getScopeText } from '../services/whatsapp';

interface VoucherPrintProps {
  promo: PromoCode | null;
  onClose: () => void;
}

export const VoucherPrint: React.FC<VoucherPrintProps> = ({ promo, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const settings = getStoredSettings();

  useEffect(() => {
    if (!promo) return;
    const qrPayload = JSON.stringify({
      lab: 'معامل رامي مختار',
      code: promo.code,
      patient: promo.patientName,
      discount: getDiscountText(promo),
      expires: promo.expiresAt
    });

    QRCode.toDataURL(qrPayload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#881337',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed generating QR code', err));
  }, [promo]);

  if (!promo) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-bold text-slate-800">
            معاينة وطباعة سند الخصم الطبي المعتمد للمريض
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة السند</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Content Area */}
        <div className="p-6 bg-slate-50 flex justify-center">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl border-2 border-dashed border-red-800 shadow-md relative text-slate-900">
            
            {/* Top Lab Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <img 
                  src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
                  alt="معامل رامي مختار" 
                  className="w-12 h-12 rounded-full border border-red-900/30 object-contain"
                />
                <div className="text-right">
                  <h3 className="text-base font-extrabold text-blue-950">
                    معامل رامي مختار للتحاليل الطبية
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    الخط الساخن: 19876 · دقة التشخيص ورعايتكم أولويتنا
                  </p>
                </div>
              </div>
            </div>

            {/* Voucher Title */}
            <div className="my-3 text-center">
              <span className="text-[11px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                قسيمة خصم مخصصة للمريض
              </span>
            </div>

            {/* Discount Value Spotlight */}
            <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-xl p-3 border border-red-200 text-center mb-3">
              <div className="text-[11px] text-red-950 font-bold">قيمة الخصم المعتمدة</div>
              <div className="text-3xl font-black font-mono text-red-900 tabular-nums my-0.5">
                {getDiscountText(promo)}
              </div>
              <div className="text-[10px] text-slate-600 font-medium">
                {getScopeText(promo)}
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="text-center mb-3">
              <div className="text-[10px] text-slate-500 mb-0.5">كود الخصم المعتمد بالنظام</div>
              <div className="text-lg font-black font-mono tracking-widest text-blue-950 bg-blue-50 py-1.5 px-3 rounded-lg border border-blue-200 inline-block">
                {promo.code}
              </div>
            </div>

            {/* Patient & Voucher Info */}
            <div className="space-y-1.5 text-xs border-t border-b border-slate-100 py-3 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">اسم المريض:</span>
                <span className="font-bold text-slate-900">{promo.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الهاتف:</span>
                <span className="font-mono text-slate-800">{promo.patientPhone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الفرع المتاح:</span>
                <span className="text-slate-800">{promo.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">صالح حتى:</span>
                <span className="font-bold text-red-800 font-mono">{formatArabicDate(promo.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">حالة الكود:</span>
                <span className="font-bold text-emerald-800">
                  {promo.status === 'used' ? 'تم الاستخدام' : 'ساري وصالح للصرف'}
                </span>
              </div>
            </div>

            {/* QR Code */}
            {qrDataUrl && (
              <div className="flex flex-col items-center justify-center my-2">
                <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 border border-slate-200 rounded p-1 bg-white" />
                <span className="text-[9px] text-slate-400 mt-0.5">مسح الكود للتحقق السريع بالاستقبال</span>
              </div>
            )}

            {/* Footer Terms */}
            <div className="mt-3 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-500 space-y-0.5">
              <p>• يُستخدم الكود لمرة واحدة فقط ومربوط برقم ملف المريض.</p>
              <p>• يرجى إبراز السند لموظف الاستقبال قبل سحب العينة.</p>
              <p className="font-bold text-blue-950">معامل رامي مختار - نتمنى لكم دوام الصحة والعافية</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
