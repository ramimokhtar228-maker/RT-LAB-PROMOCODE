import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  PhoneCall, 
  Image as ImageIcon, 
  Download, 
  Share2,
  Sparkles,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import { PromoCode } from '../types';
import { 
  DEFAULT_TEMPLATES, 
  DEFAULT_LAB_SETTINGS, 
  compileWhatsAppMessage, 
  buildWhatsAppLink, 
  cleanPhoneNumberForWhatsApp,
  formatArabicDate,
  getDiscountText,
  getScopeText
} from '../services/whatsapp';

interface WhatsAppPreviewModalProps {
  promo: PromoCode | null;
  onClose: () => void;
  onMarkSent?: (id: string) => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  promo,
  onClose,
  onMarkSent
}) => {
  if (!promo) return null;

  const initialTemplate = DEFAULT_TEMPLATES.find(t => t.category === promo.sourceReason) || DEFAULT_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplate.id);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [activeViewTab, setActiveViewTab] = useState<'card_image' | 'whatsapp_text'>('card_image');

  const cardRef = useRef<HTMLDivElement>(null);

  // Sync custom message
  useEffect(() => {
    const tmpl = DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];
    const compiled = compileWhatsAppMessage(tmpl.content, promo, DEFAULT_LAB_SETTINGS);
    setCustomMessage(compiled);
  }, [selectedTemplateId, promo]);

  // Generate QR code for the voucher
  useEffect(() => {
    QRCode.toDataURL(promo.code, {
      width: 140,
      margin: 1,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [promo.code]);

  const cleanPhone = cleanPhoneNumberForWhatsApp(promo.patientPhone);
  const waLink = buildWhatsAppLink(promo.patientPhone, customMessage);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(waLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;
    setIsGeneratingImage(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5
      });
      const link = document.createElement('a');
      link.download = `كارت_خصم_معامل_رامي_مختار_${promo.code}.png`;
      link.href = dataUrl;
      link.click();
      setImageDownloaded(true);
      setTimeout(() => setImageDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to generate voucher card image', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendWhatsApp = () => {
    window.open(waLink, '_blank', 'noopener,noreferrer');
    if (onMarkSent) {
      onMarkSent(promo.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header: Dark Red & Navy Brand Styling */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
              alt="معامل رامي مختار" 
              className="w-10 h-10 rounded-full border border-white/20 bg-white object-contain shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  معامل رامي مختار | إرسال كود الخصم وصورة الكارت للمريض
                </h2>
                <span className="text-[10px] bg-red-700 text-white font-mono px-2 py-0.5 rounded-full">
                  {promo.code}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>المريض: <strong className="text-white">{promo.patientName}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">{promo.patientPhone || 'بدون رقم'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-red-300 font-bold">{getDiscountText(promo)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switch Bar (Card Image vs WhatsApp Text) */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveViewTab('card_image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeViewTab === 'card_image'
                  ? 'bg-red-900 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>صورة كارت البروموكود المخصص (PNG)</span>
            </button>
            <button
              onClick={() => setActiveViewTab('whatsapp_text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeViewTab === 'whatsapp_text'
                  ? 'bg-blue-900 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>نص رسالة الواتساب والمحادثة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCardImage}
              disabled={isGeneratingImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-900 bg-red-100/80 hover:bg-red-200 border border-red-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-red-700" />
              <span>{imageDownloaded ? 'تم تنزيل الصورة!' : 'تحميل صورة الكارت لإرفاقها بالواتساب'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main Display: Voucher Card Image OR Message Editor */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
            
            {activeViewTab === 'card_image' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-700" />
                    <span>بطاقة الخصم الرقمية المجهزة للمريض (جاهزة للحفظ والإرسال عبر واتساب):</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    دقة عالية 1080p
                  </span>
                </div>

                {/* THE OFFICIAL RAMY MOKHTAR LAB DISCOUNT CARD */}
                <div className="flex justify-center p-2 bg-slate-100 rounded-2xl border border-slate-200">
                  <div
                    ref={cardRef}
                    className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-300 relative text-slate-900 font-sans"
                    style={{ direction: 'rtl' }}
                  >
                    {/* Top Ribbon in Dark Red & Navy */}
                    <div className="bg-gradient-to-r from-red-900 via-red-950 to-blue-950 p-4 text-white flex items-center justify-between border-b-2 border-amber-400">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
                          alt="Logo" 
                          className="w-12 h-12 rounded-full border-2 border-white/40 bg-white object-contain"
                        />
                        <div>
                          <h3 className="text-sm font-black tracking-wide text-white leading-tight">
                            معامل رامي مختار للتحاليل الطبية
                          </h3>
                          <p className="text-[10px] text-red-200 font-medium">
                            RAMY MOKHTAR LABORATORIES · الخط الساخن: 19876
                          </p>
                        </div>
                      </div>

                      <div className="text-left font-mono text-[10px] bg-red-800/80 px-2.5 py-1 rounded-md border border-red-700">
                        كارت مريض رسمي
                      </div>
                    </div>

                    {/* Card Inner Body */}
                    <div className="p-4 space-y-3 bg-gradient-to-b from-white via-slate-50 to-red-50/20">
                      
                      {/* Patient & Code Main Row */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[10px] text-slate-500">اسم المريض المحترم:</div>
                          <div className="text-base font-extrabold text-slate-900">
                            {promo.patientName}
                          </div>
                          {promo.patientPhone && (
                            <div className="text-[11px] text-slate-600 font-mono" dir="ltr">
                              {promo.patientPhone}
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <div className="text-[10px] text-slate-500">كود الخصم المعتمد:</div>
                          <div className="text-lg font-black font-mono tracking-wider text-red-900 bg-red-100/70 px-2.5 py-0.5 rounded border border-red-200">
                            {promo.code}
                          </div>
                        </div>
                      </div>

                      {/* Huge Discount Banner */}
                      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-xl p-3 flex items-center justify-between shadow-xs">
                        <div>
                          <div className="text-[10px] text-blue-200">قيمة الخصم المستحق على الفاتورة:</div>
                          <div className="text-xs text-white font-medium mt-0.5">
                            {getScopeText(promo)}
                          </div>
                        </div>
                        <div className="text-2xl font-black font-mono text-amber-300 tabular-nums">
                          {getDiscountText(promo)}
                        </div>
                      </div>

                      {/* Details & QR Code */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="space-y-1 text-[11px] text-slate-600 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-800">صالح حتى:</span>
                            <span className="font-mono font-bold text-red-700">{formatArabicDate(promo.expiresAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-800">الفروع:</span>
                            <span className="text-slate-700">{promo.branch}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            * يُبرز هذا الكارت لموظف الاستقبال قبل سحب العينة لتطبيق الخصم.
                          </div>
                        </div>

                        {qrCodeUrl && (
                          <div className="text-center shrink-0">
                            <img src={qrCodeUrl} alt="QR" className="w-16 h-16 border border-slate-200 rounded p-0.5 bg-white shadow-2xs" />
                            <span className="text-[8px] text-slate-400 block font-mono">سكان للتحقق</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="bg-slate-900 text-slate-300 px-4 py-2 text-[10px] flex items-center justify-between border-t border-slate-200">
                      <span>دقة التشخيص ورعايتكم أولويتنا</span>
                      <span className="font-mono text-amber-400">معامل رامي مختار</span>
                    </div>
                  </div>
                </div>

                {/* Instructions helper */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2">
                  <Share2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>نصيحة إرسال الواتساب:</strong> اضغط <em>"تحميل صورة الكارت"</em> أولاً، ثم اضغط <em>"إرسال عبر واتساب"</em>، وعند فتح شات المريض قم بسحب وإفلات صورة الكارت أو إرفاقها ليتسلم المريض كارت الخصم الصوري مع الرسالة النصية!
                  </div>
                </div>

              </div>
            ) : (
              /* WhatsApp Text Mode */
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700">
                  اختر قالب الرسالة المناسب للحالة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`text-right p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        selectedTemplateId === tmpl.id
                          ? 'border-red-700 bg-red-50 text-red-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold">{tmpl.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{tmpl.description}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      نص الرسالة المعد للإرسال:
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {customMessage.length} حرف
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full text-xs font-sans p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 text-slate-800 leading-relaxed bg-white"
                    dir="rtl"
                  />
                </div>
              </div>
            )}

            {/* Quick action footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'تم نسخ النص!' : 'نسخ نص الرسالة'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط wa.me'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 rotate-180" />
                <span>إرسال عبر واتساب للمريض الآن</span>
              </button>
            </div>

          </div>

          {/* Right Column: Realistic WhatsApp Phone Mockup */}
          <div className="lg:col-span-5 bg-[#e5ddd5] flex flex-col min-h-[380px]">
            {/* WhatsApp App Bar */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full bg-white object-contain border border-white/30"
                />
                <div>
                  <div className="text-xs font-bold leading-tight">معامل رامي مختار للتحاليل</div>
                  <div className="text-[10px] text-emerald-100">نشط الآن عبر واتساب الأعمال</div>
                </div>
              </div>
              <div className="text-[11px] bg-[#128c7e] px-2 py-0.5 rounded text-white font-mono">
                WhatsApp
              </div>
            </div>

            {/* Chat message area */}
            <div 
              className="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-3"
              style={{
                backgroundImage: 'radial-gradient(#d3c6ba 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Date stamp */}
              <div className="text-center my-1">
                <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-2 py-0.5 rounded-md shadow-2xs font-mono">
                  اليوم
                </span>
              </div>

              {/* Message Bubble with Lab Logo & Card Preview */}
              <div className="max-w-[92%] mr-auto bg-[#dcf8c6] text-slate-800 text-xs p-3 rounded-lg shadow-2xs relative leading-relaxed whitespace-pre-wrap font-sans border border-[#cbebb5]">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-emerald-200/80">
                  <img 
                    src="/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg" 
                    alt="Logo" 
                    className="w-5 h-5 rounded-full object-contain"
                  />
                  <span className="font-bold text-[11px] text-emerald-950">معامل رامي مختار للتحاليل الطبية</span>
                </div>
                {customMessage}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>{new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-sky-600 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Mock input footer */}
            <div className="bg-[#f0f0f0] p-2 flex items-center gap-2 border-t border-slate-300">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-slate-400">
                اكتب رسالة...
              </div>
              <div className="w-8 h-8 rounded-full bg-[#128c7e] text-white flex items-center justify-center">
                <Send className="w-3.5 h-3.5 rotate-180" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
