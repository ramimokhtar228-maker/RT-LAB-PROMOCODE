import React from 'react';
import { Plus, MessageSquare, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'codes' | 'redeem' | 'bulk' | 'guide';
  setActiveTab: (tab: 'codes' | 'redeem' | 'bulk' | 'guide') => void;
  onOpenCreateModal: () => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  activeCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark + Laboratory Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <img 
              src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
              alt="شعار معامل رامي مختار" 
              className="w-10 h-10 rounded-full border border-red-900/20 object-contain shadow-2xs bg-white"
            />
            <a 
              href="#codes" 
              onClick={(e) => { e.preventDefault(); setActiveTab('codes'); }}
              className="text-sm sm:text-base md:text-lg font-black tracking-tight text-blue-950 whitespace-nowrap shrink-0 hover:text-red-900 transition-colors"
            >
              معامل رامي مختار
            </a>
          </div>

          {/* Zone 2: 4 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('codes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'codes'
                  ? 'bg-red-50 text-red-950 font-bold border border-red-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-red-700" />
              <span>أكواد المرضى والواتساب</span>
              {activeCount > 0 && (
                <span className="text-xs bg-red-100 text-red-900 font-mono px-1.5 py-0.5 rounded font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('redeem')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'redeem'
                  ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              <span>فحص وصرف الاستقبال</span>
            </button>

            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'bulk'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-700" />
              <span>توليد لحملة جماعية</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>دليل التطبيق والتشغيل</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Install App button + Create Code) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <PWAInstallButton variant="compact" />

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-red-800 hover:bg-red-900 active:bg-red-950 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>كود جديد +</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
              activeTab === 'codes' ? 'bg-red-50 text-red-900 font-bold' : 'text-slate-600'
            }`}
          >
            الأكواد والواتساب
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
              activeTab === 'redeem' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-600'
            }`}
          >
            بوابة الاستقبال
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
              activeTab === 'bulk' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            توليد جماعي
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
              activeTab === 'guide' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            دليل التطبيق
          </button>
        </div>
      </div>
    </header>
  );
};
