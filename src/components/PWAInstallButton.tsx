import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'prominent' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already installed, show subtle installed badge or null
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
        <Check className="w-3 h-3 text-emerald-600" />
        <span>تطبيق مثبت</span>
      </span>
    );
  }

  const handleClick = async () => {
    // If browser supports direct prompt, try it, or open guided modal
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="bg-gradient-to-r from-red-900 to-blue-900 text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>ثبّت البرنامج الآن على موبايلك أو الكمبيوتر</strong> لتصل إليه كأي تطبيق أصلي بدون متصفح ويعمل معك بدون إنترنت!
            </span>
          </div>
          <button
            onClick={handleClick}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            تثبيت التطبيق الآن 📲
          </button>
        </div>

        <PWAInstallModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="تثبيت البرنامج على الموبايل أو اللابتوب كتطبيق"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-blue-800" />
        <span>تثبيت التطبيق 📲</span>
      </button>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
