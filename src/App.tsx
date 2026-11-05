import React, { useState, useEffect } from 'react';
import { 
  getStoredCodes, 
  savePromoCode, 
  saveMultiplePromoCodes, 
  updatePromoCode,
  deletePromoCode, 
  resetToSampleData,
  getStoredSettings,
  saveStoredSettings
} from './services/storage';
import { PromoCode, LabSettings } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { CodeListTable } from './components/CodeListTable';
import { PromoCodeGeneratorModal } from './components/PromoCodeGeneratorModal';
import { EditPromoModal } from './components/EditPromoModal';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { ReceptionRedeem } from './components/ReceptionRedeem';
import { VoucherPrint } from './components/VoucherPrint';
import { EducationalGuide } from './components/EducationalGuide';
import { BulkGeneratorModal } from './components/BulkGeneratorModal';
import { LabSettingsModal } from './components/LabSettingsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { 
  Plus, 
  RotateCcw, 
  Layers, 
  BookOpen,
  Settings,
  GitBranch
} from 'lucide-react';

export default function App() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [settings, setSettings] = useState<LabSettings>(() => getStoredSettings());
  const [activeTab, setActiveTab] = useState<'codes' | 'redeem' | 'bulk' | 'guide'>('codes');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [activeWhatsAppPromo, setActiveWhatsAppPromo] = useState<PromoCode | null>(null);
  const [activePrintPromo, setActivePrintPromo] = useState<PromoCode | null>(null);

  // Initial load
  useEffect(() => {
    setCodes(getStoredCodes());
    setSettings(getStoredSettings());
  }, []);

  const handleRefreshCodes = () => {
    setCodes(getStoredCodes());
  };

  const handleSaveSettings = (newSettings: LabSettings) => {
    saveStoredSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSaveNewCode = (newCode: PromoCode, openWhatsAppImmediately: boolean) => {
    const updated = savePromoCode(newCode);
    setCodes(updated);
    setIsCreateOpen(false);

    if (openWhatsAppImmediately) {
      setActiveWhatsAppPromo(newCode);
    }
  };

  const handleUpdateCode = (updatedCode: PromoCode) => {
    const updated = updatePromoCode(updatedCode.id, updatedCode);
    setCodes(updated);
    setEditingPromo(null);
  };

  const handleSaveBulkCodes = (newCodes: PromoCode[]) => {
    const updated = saveMultiplePromoCodes(newCodes);
    setCodes(updated);
    setIsBulkOpen(false);
    setActiveTab('codes');
  };

  const handleDeleteCode = (id: string) => {
    const updated = deletePromoCode(id);
    setCodes(updated);
  };

  const handleResetData = () => {
    if (confirm('هل ترغب في إعادة ضبط البيانات إلى العينات الافتراضية لمعامل رامي مختار؟')) {
      const reset = resetToSampleData();
      setCodes(reset);
    }
  };

  const handleQuickRedeemFromTable = () => {
    setActiveTab('redeem');
  };

  const activeCodesCount = codes.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar with Lab Settings trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        settings={settings}
        activeCount={activeCodesCount}
      />

      {/* PWA Install Banner for Mobile & Laptop */}
      <PWAInstallButton variant="banner" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: Codes & WhatsApp Dashboard */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            
            {/* Top Lab Welcome Banner in Dark Red & Navy */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={settings.logoUrl || "/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg"} 
                  alt={settings.labName} 
                  className="w-16 h-16 rounded-full border-2 border-red-900/30 object-contain shadow-xs bg-white shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
                    <span>{settings.labName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-900">الخط الساخن: {settings.hotline}</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-blue-950">
                    لوحة تحكم وتوليد أكواد الخصم المتغيرة للمرضى
                  </h1>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    أنشئ لكل مريض برومو كود فريد وصورة كارت مخصص (PNG) مع إمكانية تعديل أي حقل، وإرسال الرسالة والكارت عبر واتساب فوراً، مع الفحص والصرف بالاستقبال.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch lg:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200"
                  title="تعديل اسم المعمل والشعار وأرقام الهواتف والفروع"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-600" />
                  <span>بيانات المعمل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer border border-blue-200"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>توليد لحملة جماعية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer border border-amber-200"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>دليل الشرح والخطوات</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-900 active:bg-red-950 rounded-xl shadow-xs transition-colors cursor-pointer mr-auto lg:mr-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء كود لمريض</span>
                </button>
              </div>
            </div>

            {/* KPI Stats Cards */}
            <StatsCards
              codes={codes}
              onFilterChange={(st) => setCurrentFilter(st)}
              currentFilter={currentFilter}
            />

            {/* Codes List Data Grid */}
            <CodeListTable
              codes={codes}
              currentFilter={currentFilter}
              onFilterChange={(st) => setCurrentFilter(st)}
              onOpenWhatsApp={(code) => setActiveWhatsAppPromo(code)}
              onOpenPrint={(code) => setActivePrintPromo(code)}
              onQuickRedeem={handleQuickRedeemFromTable}
              onEditCode={(code) => setEditingPromo(code)}
              onDeleteCode={handleDeleteCode}
              onCreateNew={() => setIsCreateOpen(true)}
            />

            {/* GitHub Repo & Demo notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-2">
              <a
                href="https://github.com/ramimokhtar228-maker/RT-LAB-PROMOCODE"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-900 hover:text-red-800 font-bold font-mono transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-slate-700" />
                <span>مستودع GitHub المربوط: ramimokhtar228-maker/RT-LAB-PROMOCODE</span>
              </a>

              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط البيانات إلى عينات المرضى الافتراضية</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: Reception Redeem Portal */}
        {activeTab === 'redeem' && (
          <ReceptionRedeem
            codes={codes}
            settings={settings}
            onCodeUpdated={handleRefreshCodes}
            onPrintVoucher={(code) => setActivePrintPromo(code)}
          />
        )}

        {/* TAB 3: Bulk Campaign Generator */}
        {activeTab === 'bulk' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">توليد أكواد متغيرة لحملة فحص أو قائمة مرضى</h2>
                <p className="text-xs text-slate-500 mt-1">
                  يمكنك استيراد قائمة أرقام هواتف المرضى وتوليد كود خصم فردي لكل مريض في لحظات.
                </p>
              </div>
              <button
                onClick={() => setIsBulkOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>فتح نموذج التوليد الجماعي</span>
              </button>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 text-xs space-y-3">
              <h3 className="font-bold text-blue-900 text-sm">💡 نصائح لزيادة تفاعل المرضى في {settings.labName}:</h3>
              <p className="text-slate-700 leading-relaxed">
                1. <strong>إرفاق صورة الكارت:</strong> إرسال بطاقة الخصم كصورة PNG عبر واتساب يزيد من ثقة واهتمام المريض بنسبة 60% مقارنة بالنص المجرد.
              </p>
              <p className="text-slate-700 leading-relaxed">
                2. <strong>تخصيص الكود باسم المريض:</strong> عندما يتلقى المريض رسالة بها اسمه الشخصي وكود حصري خاص به ينتهي بعد أسبوع، يحرص على زيارة المعمل قبل انتهاء الصلاحية.
              </p>
              <p className="text-slate-700 leading-relaxed">
                3. <strong>التعديل السريع:</strong> يمكنك من خلال زر <em>"تعديل"</em> في الجدول تغيير أي حقل (النسبة، التاريخ، النطاق) في أي لحظة.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: Educational & Practical Guide */}
        {activeTab === 'guide' && (
          <EducationalGuide />
        )}

      </main>

      {/* Footer with dynamic lab contacts */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <strong className="text-blue-950 font-bold">{settings.labName}</strong>
            <span aria-hidden="true">·</span>
            <span className="text-red-900 font-semibold">{settings.tagline || 'نظام برومو كود الخصم وإرسال صورة الكارت والواتساب'}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            الخط الساخن: <span className="font-mono font-bold text-red-900">{settings.hotline}</span>
            {settings.whatsappSupportNumber && (
              <> · خدمة العملاء وواتساب: <span className="font-mono font-bold text-blue-900">{settings.whatsappSupportNumber}</span></>
            )}
            {settings.address && (
              <> · <span className="text-slate-600">{settings.address}</span></>
            )}
          </div>
        </div>
      </footer>

      {/* MODAL 1: Create Single Promo Code */}
      <PromoCodeGeneratorModal
        isOpen={isCreateOpen}
        settings={settings}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveNewCode}
      />

      {/* MODAL 2: Edit Promo Code & Patient Info */}
      <EditPromoModal
        isOpen={!!editingPromo}
        promo={editingPromo}
        settings={settings}
        onClose={() => setEditingPromo(null)}
        onSave={handleUpdateCode}
      />

      {/* MODAL 3: WhatsApp Preview & 1-Click Send with Card Image */}
      <WhatsAppPreviewModal
        promo={activeWhatsAppPromo}
        settings={settings}
        onClose={() => setActiveWhatsAppPromo(null)}
      />

      {/* MODAL 4: Printable Voucher with QR Code */}
      <VoucherPrint
        promo={activePrintPromo}
        settings={settings}
        onClose={() => setActivePrintPromo(null)}
      />

      {/* MODAL 5: Bulk Generator Modal */}
      <BulkGeneratorModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onSaveBulk={handleSaveBulkCodes}
      />

      {/* MODAL 6: Lab Settings Modal (Edit Lab Name, Logo, Contacts, Branches) */}
      <LabSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}
