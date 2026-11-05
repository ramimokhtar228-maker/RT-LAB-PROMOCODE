import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Laptop, 
  Apple, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install } = usePWAInstall();
  const [activeDeviceTab, setActiveDeviceTab] = useState<'mobile' | 'ios' | 'laptop'>(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'mobile';
    return 'laptop';
  });

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header in Dark Red & Navy Brand Styling */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
              alt="Logo" 
              className="w-11 h-11 rounded-full border border-white/20 bg-white object-contain shadow-xs shrink-0"
            />
            <div>
              <h2 className="text-base font-extrabold text-white">
                تثبيت برنامج معامل رامي مختار كتطبيق
              </h2>
              <p className="text-xs text-red-200">
                يعمل كتطبيق أصلي سريع على موبايلك واللابتوب بدون متصفح
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

        {/* Device Switcher Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5">
          <button
            onClick={() => setActiveDeviceTab('laptop')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDeviceTab === 'laptop'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>لابتوب / كمبيوتر</span>
          </button>

          <button
            onClick={() => setActiveDeviceTab('mobile')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDeviceTab === 'mobile'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>أندرويد / سامسونج</span>
          </button>

          <button
            onClick={() => setActiveDeviceTab('ios')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDeviceTab === 'ios'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>آيفون / آيباد</span>
          </button>
        </div>

        {/* Modal Body: Device-Specific Instructions */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: Laptop & Desktop */}
          {activeDeviceTab === 'laptop' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <span className="font-bold text-blue-950 text-sm flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-700" />
                  <span>خطوات التثبيت على اللابتوب (ويندوز أو ماك):</span>
                </span>
                <ol className="space-y-2 list-decimal list-inside text-slate-700">
                  <li>
                    <strong>الطريقة الفورية:</strong> إذا كان متصفحك يدعم التثبيت المباشر، اضغط على زر <em>"تثبيت البرنامج الآن"</em> بالأسفل.
                  </li>
                  <li>
                    <strong>من شريط العنوان:</strong> في متصفح Google Chrome أو Microsoft Edge، ستجد أيقونة تثبيت صغيرة (<strong>⊕</strong> أو شاشة مع سهم) بأعلى المتصفح بجوار رابط الصفحة.
                  </li>
                  <li>
                    اضغط عليها ثم اختر <strong>"تثبيت / Install"</strong>، وسيفتح البرنامج فوراً في نافذة مستقلة وأيقونة على سطح المكتب Desktop.
                  </li>
                </ol>
              </div>

              {isInstallable && (
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت البرنامج الآن على الكمبيوتر</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: Android Devices */}
          {activeDeviceTab === 'mobile' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <span className="font-bold text-red-950 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-700" />
                  <span>خطوات التثبيت على هواتف الأندرويد:</span>
                </span>
                <ol className="space-y-2 list-decimal list-inside text-slate-700">
                  <li>
                    اضغط على زر <strong>"تثبيت التطبيق الآن"</strong> بالأسفل.
                  </li>
                  <li>
                    أو من متصفح كروم على الموبايل، اضغط على قائمة الثلاث نقاط (<strong>⋮</strong>) بأعلى أو أسفل الشاشة.
                  </li>
                  <li>
                    اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية (Install app / Add to Home screen)"</strong>.
                  </li>
                  <li>
                    ستظهر أيقونة <em>معامل رامي مختار</em> على شاشة هاتفك مثل أي تطبيق من Google Play.
                  </li>
                </ol>
              </div>

              {isInstallable && (
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="w-full py-3 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت التطبيق الآن على الهاتف</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: iOS / iPhone */}
          {activeDeviceTab === 'ios' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Apple className="w-4 h-4 text-slate-800" />
                  <span>خطوات التثبيت على أجهزة الآيفون والآيباد (iOS):</span>
                </span>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <span>تأكد من فتح الرابط داخل متصفح <strong>Safari</strong> (سفاري).</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span>اضغط على زر المشاركة</span>
                      <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                      <span>(Share) في شريط سفاري السفلي.</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span>مرر لأسفل واختر</span>
                      <strong>"إضافة إلى الشاشة الرئيسية"</strong>
                      <span>(Add to Home Screen).</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <span>اضغط <strong>"إضافة (Add)"</strong> بأعلى اليمين لتظهر الأيقونة فوراً على شاشتك.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits strip */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>يعمل بدون إنترنت (Offline)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>فتح فوري بلمسة واحدة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>حفظ دائم لبيانات المرضى</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>توليد كروت الخصم السريعة</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            {isInstalled ? '✅ البرنامج مثبت بالفعل على هذا الجهاز' : 'معامل رامي مختار للتحاليل الطبية'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
