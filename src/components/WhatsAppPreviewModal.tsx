import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  Image as ImageIcon, 
  Download, 
  Share2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { PromoCode, LabSettings } from '../types';
import { 
  DEFAULT_TEMPLATES, 
  compileWhatsAppMessage, 
  buildWhatsAppLink, 
  cleanPhoneNumberForWhatsApp,
  formatArabicDate,
  getDiscountText,
  getScopeText
} from '../services/whatsapp';
import { downloadPromoCard, generatePromoCardDataUrl, generatePromoCardCanvas } from '../services/cardCanvas';

interface WhatsAppPreviewModalProps {
  promo: PromoCode | null;
  settings: LabSettings;
  onClose: () => void;
  onMarkSent?: (id: string) => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  promo,
  settings,
  onClose,
  onMarkSent
}) => {
  if (!promo) return null;

  const initialTemplate = DEFAULT_TEMPLATES.find(t => t.category === promo.sourceReason) || DEFAULT_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplate.id);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [activeViewTab, setActiveViewTab] = useState<'card_image' | 'whatsapp_text'>('card_image');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Sync custom message
  useEffect(() => {
    const tmpl = DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];
    const compiled = compileWhatsAppMessage(tmpl.content, promo, settings);
    setCustomMessage(compiled);
  }, [selectedTemplateId, promo, settings]);

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
      .then(url => {
        setQrCodeUrl(url);
        // Pre-generate card preview image
        generatePromoCardDataUrl(promo, settings, url)
          .then(data => setPreviewDataUrl(data))
          .catch(() => {});
      })
      .catch(err => console.error(err));
  }, [promo, settings]);

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

  /**
   * 100% Reliable Card Download using HTML5 2D Canvas engine
   */
  const handleDownloadCardImage = async () => {
    setIsGeneratingImage(true);
    setDownloadError(null);
    try {
      const res = await downloadPromoCard(promo, settings, qrCodeUrl);
      if (res.success) {
        setImageDownloaded(true);
        setPreviewDataUrl(res.dataUrl);
        setTimeout(() => setImageDownloaded(false), 3500);
      }
    } catch (err: unknown) {
      console.error('Failed to generate voucher card image', err);
      // Fallback: create dataUrl and open in new tab
      try {
        const dataUrl = await generatePromoCardDataUrl(promo, settings, qrCodeUrl);
        setPreviewDataUrl(dataUrl);
        const w = window.open('');
        if (w) {
          w.document.write(`<title>كارت خصم معامل رامي مختار - ${promo.code}</title><img src="${dataUrl}" style="max-width:100%;height:auto;display:block;margin:auto;" />`);
        }
        setImageDownloaded(true);
      } catch (fallbackErr) {
        setDownloadError('تعذر حفظ الصورة تلقائياً، يمكنك النقر بالزر الأيمن على الصورة واختيار حفظ الصورة');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  /**
   * Copy Image to Clipboard for direct Ctrl+V pasting into WhatsApp Web
   */
  const handleCopyImageToClipboard = async () => {
    try {
      const canvas = await generatePromoCardCanvas(promo, settings, qrCodeUrl);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
          } else {
            alert('خاصية نسخ الصورة للحافظة غير مدعومة في هذا المتصفح، يرجى استخدام زر تنزيل الصورة.');
          }
        } catch {
          // If clipboard.write is restricted in iframe, trigger download
          handleDownloadCardImage();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error', err);
    }
  };

  const handleSendWhatsApp = () => {
    window.open(waLink, '_blank', 'noopener,noreferrer');
    if (onMarkSent) {
      onMarkSent(promo.id);
    }
  };

  const currentLogo = settings.logoUrl || '/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header: Dark Red & Navy Brand Styling */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <img 
              src={currentLogo} 
              alt={settings.labName} 
              className="w-10 h-10 rounded-full border border-white/20 bg-white object-contain shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {settings.labName} | إرسال كود الخصم وصورة الكارت للمريض
                </h2>
                <span className="text-[10px] bg-red-700 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  {promo.code}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>المريض: <strong className="text-white">{promo.patientName}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">{promo.patientPhone || 'بدون رقم'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-red-300 font-bold">{getDiscountText(promo)}</span>
                <span aria-hidden="true">·</span>
                <span>الخط الساخن: <strong className="text-amber-300 font-mono">{settings.hotline}</strong></span>
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
              onClick={handleCopyImageToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedImage ? 'تم نسخ الصورة!' : 'نسخ الصورة للحافظة (Ctrl+V)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCardImage}
              disabled={isGeneratingImage}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-red-800 hover:bg-red-900 active:bg-red-950 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{imageDownloaded ? '✓ تم تنزيل كارت الخصم!' : isGeneratingImage ? 'جارٍ المعالجة...' : 'تنزيل صورة الكارت (PNG) الآن'}</span>
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
                  <div className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-700" />
                    <span>بطاقة الخصم الرسمية للمريض (جاهزة للإرفاق بالواتساب):</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>دقة عالية 1200×750 بكسل</span>
                  </span>
                </div>

                {downloadError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{downloadError}</span>
                  </div>
                )}

                {/* VISUAL CARD PREVIEW */}
                <div className="flex flex-col items-center justify-center p-2 bg-slate-100 rounded-2xl border border-slate-200">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="كارت خصم المريض"
                      className="w-full max-w-lg rounded-xl shadow-md border border-slate-300"
                    />
                  ) : (
                    /* Fallback HTML Preview while canvas renders */
                    <div
                      className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-300 text-slate-900 font-sans"
                      dir="rtl"
                    >
                      <div className="bg-gradient-to-r from-red-900 via-red-950 to-blue-950 p-4 text-white flex items-center justify-between border-b-2 border-amber-400">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={currentLogo} 
                            alt="Logo" 
                            className="w-12 h-12 rounded-full border-2 border-white/40 bg-white object-contain"
                          />
                          <div>
                            <h3 className="text-sm font-black text-white leading-tight">
                              {settings.labName}
                            </h3>
                            <p className="text-[10px] text-red-200 font-medium">
                              الخط الساخن: {settings.hotline} · {settings.tagline}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-red-800/80 px-2 py-1 rounded text-white font-mono">
                          كارت مريض رسمي
                        </span>
                      </div>

                      <div className="p-4 space-y-3 bg-gradient-to-b from-white via-slate-50 to-red-50/20">
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div>
                            <div className="text-[10px] text-slate-500">اسم المريض:</div>
                            <div className="text-base font-extrabold text-slate-900">{promo.patientName}</div>
                            {promo.patientPhone && (
                              <div className="text-[11px] text-slate-600 font-mono" dir="ltr">{promo.patientPhone}</div>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-[10px] text-slate-500">كود الخصم:</div>
                            <div className="text-lg font-black font-mono tracking-wider text-red-900 bg-red-100/70 px-2.5 py-0.5 rounded border border-red-200">
                              {promo.code}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-xl p-3 flex items-center justify-between shadow-xs">
                          <div>
                            <div className="text-[10px] text-blue-200">قيمة الخصم المستحق:</div>
                            <div className="text-xs text-white font-medium mt-0.5">{getScopeText(promo)}</div>
                          </div>
                          <div className="text-2xl font-black font-mono text-amber-300">
                            {getDiscountText(promo)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1 text-[11px] text-slate-600">
                          <div>
                            <div>صالح حتى: <strong className="font-mono text-red-700">{formatArabicDate(promo.expiresAt)}</strong></div>
                            <div>الفروع: <strong>{promo.branch}</strong></div>
                          </div>
                          {qrCodeUrl && (
                            <img src={qrCodeUrl} alt="QR" className="w-16 h-16 border rounded p-0.5 bg-white shadow-2xs" />
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[10px] flex items-center justify-between">
                        <span>{settings.tagline}</span>
                        <span className="font-mono text-amber-400">{settings.labName}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions helper */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2">
                  <Share2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>طريقة إرسال الكارت عبر واتساب:</strong>
                    <ol className="list-decimal list-inside space-y-0.5 mt-1 text-slate-700">
                      <li>اضغط زر <strong>"تنزيل صورة الكارت (PNG) الآن"</strong> ليتم حفظها فوراً على جهازك.</li>
                      <li>اضغط <strong>"إرسال عبر واتساب للمريض"</strong> بالأسفل لفتح المحادثة.</li>
                      <li>قم بسحب وإفلات الصورة أو الضغط على رمز الإرفاق 📎 لاختيار الصورة وإرسالها للمريض مع الرسالة.</li>
                    </ol>
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
                      نص الرسالة المعد للإرسال (محدث ببيانات وهاتف المعمل):
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
                  src={currentLogo} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full bg-white object-contain border border-white/30"
                />
                <div>
                  <div className="text-xs font-bold leading-tight">{settings.labName}</div>
                  <div className="text-[10px] text-emerald-100">واتساب الأعمال · الخط الساخن {settings.hotline}</div>
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
                    src={currentLogo} 
                    alt="Logo" 
                    className="w-5 h-5 rounded-full object-contain"
                  />
                  <span className="font-bold text-[11px] text-emerald-950">{settings.labName}</span>
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
