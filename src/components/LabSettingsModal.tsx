import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Building2, 
  Phone, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  RotateCcw, 
  Check, 
  Tag, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { LabSettings } from '../types';
import { DEFAULT_LAB_SETTINGS } from '../services/whatsapp';

interface LabSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LabSettings;
  onSaveSettings: (newSettings: LabSettings) => void;
}

export const LabSettingsModal: React.FC<LabSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  if (!isOpen) return null;

  const [labName, setLabName] = useState(settings.labName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [hotline, setHotline] = useState(settings.hotline);
  const [whatsappSupportNumber, setWhatsappSupportNumber] = useState(settings.whatsappSupportNumber);
  const [address, setAddress] = useState(settings.address || 'شارع التحرير - الدقي - الجيزة');
  const [branches, setBranches] = useState<string[]>([...settings.branches]);
  const [newBranchInput, setNewBranchInput] = useState('');
  const [defaultPrefix, setDefaultPrefix] = useState(settings.defaultPrefix || 'RM');
  const [defaultValidityDays, setDefaultValidityDays] = useState(settings.defaultValidityDays || 7);
  const [defaultDiscountValue, setDefaultDiscountValue] = useState(settings.defaultDiscountValue || 20);
  const [logoUrl, setLogoUrl] = useState<string>(
    settings.logoUrl || '/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg'
  );
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleAddBranch = () => {
    const trimmed = newBranchInput.trim();
    if (!trimmed) return;
    if (branches.includes(trimmed)) {
      alert('هذا الفرع موجود بالفعل');
      return;
    }
    setBranches([...branches, trimmed]);
    setNewBranchInput('');
  };

  const handleRemoveBranch = (index: number) => {
    if (branches.length <= 1) {
      alert('يجب الإبقاء على فرع واحد على الأقل');
      return;
    }
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG أو JPG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultLogo = () => {
    setLogoUrl('/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim()) {
      alert('يرجى إدخال اسم المعمل');
      return;
    }

    const updatedSettings: LabSettings = {
      ...settings,
      labName: labName.trim(),
      tagline: tagline.trim(),
      hotline: hotline.trim(),
      whatsappSupportNumber: whatsappSupportNumber.trim(),
      address: address.trim(),
      branches,
      defaultPrefix: defaultPrefix.trim().toUpperCase() || 'RM',
      defaultValidityDays: Number(defaultValidityDays) || 7,
      defaultDiscountValue: Number(defaultDiscountValue) || 20,
      logoUrl: logoUrl.trim()
    };

    onSaveSettings(updatedSettings);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header in Dark Red & Deep Navy */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-800 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                تعديل بيانات وهوية المعمل وأرقام التواصل
              </h2>
              <p className="text-xs text-red-200">
                يتم تطبيق هذه البيانات تلقائياً على رسائل الواتساب وكروت الخصم وسندات الاستقبال
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Lab Name & Tagline */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-red-800" />
              <span>الاسم والشعار الرسمي للمعمل:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اسم المعمل الرسمي <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="معامل رامي مختار للتحاليل الطبية"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  الشعار اللفظي (Slogan)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="دقة التشخيص.. ورعايتكم أولويتنا"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                عنوان المقر الرئيسي أو الفرع المركزي
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="شارع التحرير - الدقي - الجيزة"
                  className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Numbers & WhatsApp */}
          <div className="space-y-3 p-4 bg-red-50/50 rounded-xl border border-red-200">
            <h3 className="font-bold text-red-950 text-xs flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-red-700" />
              <span>أرقام التواصل والخط الساخن والواتساب:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  الخط الساخن الموحد للمعمل <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    placeholder="19876"
                    className="w-full pr-9 pl-3 py-2.5 bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 font-mono font-bold text-red-950"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  يظهر في نهاية كل رسالة واتساب وعلى كروت المرضى
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رقم واتساب المعمل لخدمة العملاء <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="tel"
                    required
                    value={whatsappSupportNumber}
                    onChange={(e) => setWhatsappSupportNumber(e.target.value)}
                    placeholder="01001234567"
                    className="w-full pr-9 pl-3 py-2.5 bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 font-mono font-bold text-slate-900"
                    dir="ltr"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  رقم الواتساب الرسمي للمعمل لاستقبال استفسارات المرضى
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Branches Management */}
          <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-950 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span>إدارة فروع معامل رامي مختار ({branches.length} فروع):</span>
              </span>
            </h3>

            {/* Add new branch input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBranchInput}
                onChange={(e) => setNewBranchInput(e.target.value)}
                placeholder="اكتب اسم فرع جديد (مثال: فرع التجمع الخامس)..."
                className="flex-1 p-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddBranch}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة فرع</span>
              </button>
            </div>

            {/* List of current branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pt-1">
              {branches.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100 text-xs text-slate-800 shadow-2xs"
                >
                  <span className="font-medium truncate">{b}</span>
                  {b !== 'جميع الفروع' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(idx)}
                      title="حذف هذا الفرع"
                      className="p-1 text-slate-400 hover:text-red-700 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Promo Code Defaults */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-slate-700" />
              <span>الإعدادات الافتراضية لأكواد الخصم:</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  بادئة الكود (Prefix)
                </label>
                <input
                  type="text"
                  value={defaultPrefix}
                  onChange={(e) => setDefaultPrefix(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-center uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  الصلاحية الافتراضية (أيام)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={defaultValidityDays}
                  onChange={(e) => setDefaultValidityDays(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  نسبة الخصم المقترحة (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={defaultDiscountValue}
                  onChange={(e) => setDefaultDiscountValue(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-center text-red-900"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Logo Management */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-700" />
                <span>شعار المعمل (Logo):</span>
              </span>
              <button
                type="button"
                onClick={handleResetToDefaultLogo}
                className="inline-flex items-center gap-1 text-[11px] text-blue-900 hover:text-red-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الشعار الرسمي</span>
              </button>
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                alt="معاينة اللوجو"
                className="w-16 h-16 rounded-full border-2 border-red-900/30 object-contain bg-white shadow-xs p-1"
              />

              <div className="flex-1 space-y-1">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer text-xs font-semibold text-slate-700 transition-colors shadow-2xs">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>اختر صورة لوجو من جهازك (PNG/JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500">
                  سيتم حفظ الشعار في ذاكرة المتصفح وعرضه على الكروت وإيصالات الاستقبال
                </p>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-white bg-red-800 hover:bg-red-900 active:bg-red-950 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {showSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{showSavedToast ? 'تم حفظ التعديلات بنجاح!' : 'حفظ بيانات المعمل الجديدة'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
