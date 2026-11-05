import { PromoCode, LabSettings } from '../types';
import { formatArabicDate, getDiscountText, getScopeText } from './whatsapp';

/**
 * High-reliability HTML5 Canvas 2D card generator.
 * Eliminates html-to-image CORS/foreignObject failures.
 * Generates an ultra crisp 1200x750 PNG voucher card.
 */
export async function generatePromoCardCanvas(
  promo: PromoCode,
  settings: LabSettings,
  qrDataUrl?: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 750;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Draw Background Gradient (Dark Crimson Red -> Deep Navy Blue)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#580b1e');   // Deep Crimson
  bgGrad.addColorStop(0.4, '#0f172a'); // Slate / Dark Navy
  bgGrad.addColorStop(1, '#1e3a8a');   // Medical Navy Blue
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Decorative Geometric Accents
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(width - 100, 100, 150 + i * 40, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(80, height - 80, 120 + i * 35, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Outer Golden / White Card Border
  ctx.save();
  ctx.strokeStyle = '#f59e0b'; // Gold
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, width - 80, height - 80);
  ctx.restore();

  // 4. Header Bar
  const headerHeight = 135;
  const headerGrad = ctx.createLinearGradient(40, 40, width - 40, headerHeight);
  headerGrad.addColorStop(0, '#7f1d1d');
  headerGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(40, 40, width - 80, headerHeight);

  // Bottom border of header
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(40, 40 + headerHeight, width - 80, 4);

  // Load and Draw Lab Logo if available
  const logoSrc = settings.logoUrl || '/src/assets/images/ramy_mokhtar_lab_logo_1793872542953.jpg';
  try {
    const logoImg = await loadImage(logoSrc);
    ctx.save();
    const logoSize = 100;
    const logoX = width - 160;
    const logoY = 55;

    // Circle clip for logo
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(logoX, logoY, logoSize, logoSize);
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // Circle border
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } catch (err) {
    console.warn('Could not draw logo image on canvas, drawing fallback icon', err);
  }

  // 5. Header Typography (RTL layout)
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';

  // Lab Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Cairo, sans-serif';
  ctx.fillText(settings.labName || 'معامل رامي مختار للتحاليل الطبية', width - 180, 95);

  // Tagline & Hotline
  ctx.fillStyle = '#fca5a5';
  ctx.font = '500 20px Cairo, sans-serif';
  const taglineText = `${settings.tagline || 'دقة التشخيص.. ورعايتكم أولويتنا'}  |  الخط الساخن: ${settings.hotline || '19876'}`;
  ctx.fillText(taglineText, width - 180, 135);

  // Left Tag in Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 18px Cairo, sans-serif';
  ctx.fillText('بطاقة خصم مخصصة للمريض', 65, 95);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14px monospace';
  ctx.fillText('OFFICIAL DISCOUNT VOUCHER', 65, 125);

  // 6. Patient Details Card Box
  const patientBoxY = 195;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  roundRect(ctx, 60, patientBoxY, width - 120, 110, 16);
  ctx.fill();

  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px Cairo, sans-serif';
  ctx.fillText('اسم المريض المحترم:', width - 90, patientBoxY + 35);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px Cairo, sans-serif';
  ctx.fillText(promo.patientName, width - 90, patientBoxY + 75);

  // Patient Phone and Medical ID
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px Cairo, sans-serif';
  ctx.fillText('رقم الهاتف المسجل:', 90, patientBoxY + 35);

  ctx.fillStyle = '#7f1d1d';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(promo.patientPhone || '—', 90, patientBoxY + 75);

  // 7. Huge Promo Code & Discount Spotlight Banner
  const discountBoxY = 325;
  const discountGrad = ctx.createLinearGradient(60, discountBoxY, width - 60, discountBoxY + 180);
  discountGrad.addColorStop(0, '#881337'); // Crimson
  discountGrad.addColorStop(0.5, '#4c0519');
  discountGrad.addColorStop(1, '#172554'); // Navy
  ctx.fillStyle = discountGrad;
  roundRect(ctx, 60, discountBoxY, width - 120, 180, 20);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  roundRect(ctx, 60, discountBoxY, width - 120, 180, 20);
  ctx.stroke();

  // Promo Code Box Inside Discount Banner
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  roundRect(ctx, width - 520, discountBoxY + 35, 430, 110, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, width - 520, discountBoxY + 35, 430, 110, 14);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 15px Cairo, sans-serif';
  ctx.fillText('كود الخصم المعتمد بالنظام', width - 305, discountBoxY + 62);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px monospace';
  ctx.fillText(promo.code, width - 305, discountBoxY + 115);

  // Discount Amount Spotlight (Left side of banner)
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 20px Cairo, sans-serif';
  ctx.fillText('قيمة الخصم الممنوحة:', width - 560, discountBoxY + 65);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Cairo, sans-serif';
  const discountStr = getDiscountText(promo);
  ctx.fillText(discountStr, width - 560, discountBoxY + 135);

  // 8. Scope, Validity & QR Code Info Row
  const infoRowY = 525;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  roundRect(ctx, 60, infoRowY, width - 120, 125, 16);
  ctx.fill();

  // QR Code on Left
  const qrSize = 95;
  const qrX = 85;
  const qrY = infoRowY + 15;
  if (qrDataUrl) {
    try {
      const qrImg = await loadImage(qrDataUrl);
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    } catch {
      // Fallback
    }
  }

  // Details
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 19px Cairo, sans-serif';
  ctx.fillText(`الفحوصات المشمولة:  ${getScopeText(promo)}`, width - 90, infoRowY + 45);

  ctx.fillStyle = '#7f1d1d';
  ctx.font = 'bold 18px Cairo, sans-serif';
  const expiryFormatted = formatArabicDate(promo.expiresAt);
  ctx.fillText(`صلاحية الكود:  ساري حتى ${expiryFormatted}`, width - 90, infoRowY + 80);

  ctx.fillStyle = '#475569';
  ctx.font = '500 16px Cairo, sans-serif';
  ctx.fillText(`الفروع المتاحة:  ${promo.branch || 'جميع الفروع'}`, width - 90, infoRowY + 108);

  // 9. Footer Security Notice
  const footerY = 675;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px Cairo, sans-serif';
  ctx.fillText(
    '• يرجى إبراز هذا الكارت لموظف الاستقبال قبل سحب العينة  •  الكود صالح لمرة واحدة فقط ومربوط برقم هاتف المريض',
    width / 2,
    footerY
  );

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 13px Cairo, sans-serif';
  ctx.fillText(
    `${settings.labName}  —  نتمنى لحضرتكم دوام الصحة والعافية`,
    width / 2,
    footerY + 22
  );

  return canvas;
}

/**
 * Generate a PNG data URL from canvas
 */
export async function generatePromoCardDataUrl(
  promo: PromoCode,
  settings: LabSettings,
  qrDataUrl?: string
): Promise<string> {
  const canvas = await generatePromoCardCanvas(promo, settings, qrDataUrl);
  return canvas.toDataURL('image/png');
}

/**
 * Direct file download trigger with cross-browser fallback
 */
export async function downloadPromoCard(
  promo: PromoCode,
  settings: LabSettings,
  qrDataUrl?: string
): Promise<{ success: boolean; dataUrl: string }> {
  const canvas = await generatePromoCardCanvas(promo, settings, qrDataUrl);
  const dataUrl = canvas.toDataURL('image/png');
  const filename = `كارت_خصم_معامل_رامي_مختار_${promo.code}.png`;

  // Standard download
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, dataUrl };
}

/**
 * Helper to load an image safely into an Image object
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Helper for drawing rounded rectangles in HTML5 Canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
