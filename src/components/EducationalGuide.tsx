import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Code, 
  ArrowLeft, 
  Send, 
  Smartphone, 
  Server, 
  Users,
  Copy,
  Zap
} from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-semibold mb-4 border border-teal-700">
          <BookOpen className="w-4 h-4" />
          <span>الدليل الشامل لمعامل رامي مختار للتحاليل الطبية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          كيف تنشئ برومو كود خصم متغير للمرضى وترسله عبر واتساب؟
        </h1>
        <p className="text-sm text-teal-100 max-w-2xl leading-relaxed">
          دليل عملي تفصيلي يوضح كيفية تصميم أكواد الخصم المتغيرة لكل مريض على حدة (Dynamic Unique Promo Codes)، وربطها برقم الهاتف، وتفعيل الإرسال بنقرة واحدة عبر واتساب، وكيفية فحصها وصرفها عند شباك الاستقبال.
        </p>
      </div>

      {/* Step 1: Why Dynamic Codes? */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            لماذا نستخدم "كود خصم متغير" بدلاً من كود عام ثابت؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-1.5">
              <span>❌ عيوب الكود الثابت العام (مثل RAMY20)</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed">
              <li>يتم تسريبه ومشاركته بسهولة على جروبات العائلة وفيسبوك.</li>
              <li>لا يمكنك معرفة من هو المريض الفعلي الذي استفاد من الخصم.</li>
              <li>صعوبة إيقافه عند انتهاء الحملة دون إحراج المرضى.</li>
              <li>استخدامه أكثر من مرة لنفس المريض دون علمه أو بدون ضابط.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✅ مميزات الكود المتغير الفريد (مثل RM-20-K79W)</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed">
              <li><strong>مخصص لشخص واحد:</strong> مرتبط باسم المريض ورقم هاتفه.</li>
              <li><strong>صلاحية محددة:</strong> ينتهي بعد 48 ساعة أو أسبوع، مما يخلق دافعاً نفسياً سريعاً للزيارة.</li>
              <li><strong>استخدام لمرة واحدة (Single-Use):</strong> يحترق الكود بمجرد استخدامه عند الكاشير.</li>
              <li><strong>تتبع دقيق للعائد (ROI):</strong> معرفة أي مريض حضر واستفاد وأي مريض لم يزر المعمل.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step 2: How It Works Mechanically */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            تركيبة الكود المتغير في معامل رامي مختار
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          لتسهيل قراءة الكود لموظف الاستقبال، نوصي بتركيبة تجمع بين بادئة المعمل وقيمة الخصم وأحرف عشوائية غير مكررة:
        </p>

        <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-center space-y-2">
          <div className="text-2xl font-bold tracking-widest text-teal-400">
            RM - 20 - K79W
          </div>
          <div className="grid grid-cols-3 text-[11px] text-slate-400 font-sans border-t border-slate-800 pt-2">
            <div>بادئة اسم المعمل (Ramy Mokhtar)</div>
            <div>قيمة الخصم (20%)</div>
            <div>رمز أمان عشوائي فريد لكل مريض</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">1. نوع الخصم</span>
            <p className="text-slate-600">إما نسبة مئوية (15% - 25%) أو مبلغ مالي مقطوع (50 ج.م أو 100 ج.م كخصم من إجمالي الفاتورة).</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">2. النطاق المسموح</span>
            <p className="text-slate-600">يمكن تطبيقه على كافة الفحوصات، أو تخصيصه لباقة معينة (كباقة الفحص الدوري الشامل) لزيادة المبيعات.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">3. تاريخ الصلاحية</span>
            <p className="text-slate-600">مدة صلاحية من 3 إلى 7 أيام تعطي المريض انطباعاً بخصوصية الفرصة وسرعة التوجه للمعمل.</p>
          </div>
        </div>
      </section>

      {/* Step 3: 3 Technical Ways to Send WhatsApp */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            3 طرق لإرسال الكود عبر واتساب للمرضى
          </h2>
        </div>

        <div className="space-y-4">
          
          {/* Method 1: wa.me Direct Link (Free & Built-in) */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-700" />
                <span>الطريقة 1: الإرسال المباشر بروابط wa.me (المطبقة مجاناً في هذا النظام)</span>
              </span>
              <span className="text-[11px] bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded font-medium">
                مجانية فورية بدون تكاليف
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              تعتمد على تركيب رابط واتساب قياسي يحتوي على رقم المريض ونصه المشفر مسبقاً:
            </p>
            <div className="p-2.5 bg-white rounded border border-teal-200 font-mono text-[11px] text-slate-800 break-all" dir="ltr">
              https://wa.me/201012345678?text=أهلاً%20بحضرتك%20كود%20الخصم%20هو%20RM-20-K79W
            </div>
            <p className="text-xs text-slate-600">
              <strong>كيف تستخدمها في معملك؟</strong> بمجرد الضغط على زر <em>"إرسال عبر واتساب"</em> في هذا البرنامج، يفتح الواتساب (سواء كان واتساب ويب على الكمبيوتر أو تطبيق واتساب على الموبايل) والمحادثة مفتوحة مع المريض والرسالة مكتوبة بالكامل بانتظار ضغطة الإرسال.
            </p>
          </div>

          {/* Method 2: WhatsApp Business Quick Replies */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>الطريقة 2: تطبيق WhatsApp Business مع الردود السريعة (Quick Replies)</span>
              </span>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                شبه آلية
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              في هاتف خدمة عملاء المعمل، تقوم بإنشاء رد سريع بأمر <code>/خصم</code> أو <code>/عرض</code>، وعندما يتواصل المريض معك، تكتب <code>/خصم</code> ليظهر قالب الرسالة الجاهز، وتستبدل الكود فقط بالكود المولد من هذا النظام.
            </p>
          </div>

          {/* Method 3: Official WhatsApp Cloud API */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span>الطريقة 3: الربط البرمجي الكامل عبر WhatsApp Cloud API / مزود خارجي (Twilio / Wati)</span>
              </span>
              <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                آلية بالكامل للشركات الكبيرة
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              إذا كان لدى معامل رامي مختار نظام معمل رقمي متقدم (LIS) وسيرفر خاص، يمكن لمبرمج النظام ربط الـ API لإرسال الرسالة آلياً فور تسجيل المريض في الاستقبال بدون أي تدخل يدوي، عبر طلب HTTP POST رسمي معتمد من شركة Meta.
            </p>
          </div>

        </div>
      </section>

      {/* Step 4: Step-by-step workflow for the lab staff */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            خطة العمل اليومية لموظفي معامل رامي مختار
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-teal-800 text-sm block mb-1">الخطوة 1</span>
              <span className="font-semibold text-slate-900 block mb-1">توليد الكود</span>
              <p className="text-slate-600">موظف خدمة العملاء يضغط "إنشاء كود لمريض"، ويكتب اسمه وموبايله ونسبة الخصم (مثلاً 20%).</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-teal-800 text-sm block mb-1">الخطوة 2</span>
              <span className="font-semibold text-slate-900 block mb-1">إرسال الواتساب</span>
              <p className="text-slate-600">يختار قالب الرسالة المناسب ويضغط "إرسال عبر واتساب"، لتصل الرسالة مباشرة لهاتف المريض وبها الكود وتاريخ الصلاحية.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-teal-800 text-sm block mb-1">الخطوة 3</span>
              <span className="font-semibold text-slate-900 block mb-1">فحص الاستقبال</span>
              <p className="text-slate-600">عند حضور المريض لأي فرع من فروع المعمل، يبرز الرسالة لموظف الاستقبال، الذي يكتب الكود في تبويب "فحص وصرف الاستقبال".</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-teal-800 text-sm block mb-1">الخطوة 4</span>
              <span className="font-semibold text-slate-900 block mb-1">حرق الكود وطباعة السند</span>
              <p className="text-slate-600">يتم إدخال إجمالي الفاتورة، فيحسب البرنامج الخصم فوراً، ثم يضغط الموظف "تأكيد وصرف" ليصبح الكود غير صالح للاستخدام مجدداً.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5: Security & Fraud Prevention Tips */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            05
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            إجراءات حماية المعمل ومنع تكرار أو تسريب الخصومات
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-1">1. الربط برقم الهاتف واسم المريض</span>
              <p className="text-slate-600">يتأكد موظف الاستقبال من أن رقم هاتف المريض المسجل بالمعمل يطابق نفس الرقم المصروف له الكود.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-1">2. استهلاك الكود لمرة واحدة (Single-Use)</span>
              <p className="text-slate-600">بمجرد سحب العينة وإصدار الفاتورة، يتحول الكود إلى حالة "تم الاستخدام" فوراً، ولا يقبل الصرف مرة أخرى.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-1">3. سقف أقصى للخصم (Discount Cap)</span>
              <p className="text-slate-600">في التحاليل شديدة التكلفة (مثل الجينات أو البيولوجيا الجزيئية)، يمكن تحديد حد أقصى للخصم (مثلاً 200 ج.م كحد أقصى).</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <Users className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-1">4. توثيق اسم موظف الاستقبال ورقم الفاتورة</span>
              <p className="text-slate-600">يقوم النظام بتسجيل وقت الصرف واسم الموظف الذي نفذ العملية ورقم الفاتورة لسهولة المراجعة المالية والمحاسبية بالمعمل.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
