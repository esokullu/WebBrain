// Batch-patches specific locale strings across every non-English locale, in
// both builds. Idempotent — safe to re-run.
//
// Pass 1 — INSERT the standalone permission UI strings (3 decision buttons +
// 4 settings labels) where missing (original pass, commit 703bbb347). The
// question/verbs/long warnings are intentionally left to English fallback
// (word-order coupling / paragraph-length security copy that needs native
// review).
//
// Pass 2 — REPLACE-IN-PLACE the 'st.display.openai_ask_streaming.label'/'.desc'
// values where they are damaged (literal runs of '?' from a past encoding
// mangling), restoring native-quality copy (issue #2950). Only touched when the
// stored value contains '?', so intact translations are never clobbered and a
// re-run is a no-op.
//
// Run: node scripts/i18n-perm-translations.mjs
import fs from 'node:fs';

const T = {
  es: { allow_once: 'Permitir una vez', always_allow: 'Permitir siempre en {host}', dont_allow: 'No permitir', permissions: 'Permisos', revoke: 'Revocar', clear_all: 'Borrar todos los permisos', gate_label: 'Preguntar antes de acciones importantes' },
  fr: { allow_once: 'Autoriser une fois', always_allow: 'Toujours autoriser sur {host}', dont_allow: 'Ne pas autoriser', permissions: 'Autorisations', revoke: 'Révoquer', clear_all: 'Effacer toutes les autorisations', gate_label: 'Demander avant les actions importantes' },
  tr: { allow_once: 'Bir kez izin ver', always_allow: '{host} için her zaman izin ver', dont_allow: 'İzin verme', permissions: 'İzinler', revoke: 'Kaldır', clear_all: 'Tüm izinleri temizle', gate_label: 'Önemli işlemlerden önce sor' },
  zh: { allow_once: '允许一次', always_allow: '始终允许 {host}', dont_allow: '不允许', permissions: '权限', revoke: '撤销', clear_all: '清除所有权限', gate_label: '执行重要操作前询问' },
  ru: { allow_once: 'Разрешить один раз', always_allow: 'Всегда разрешать на {host}', dont_allow: 'Не разрешать', permissions: 'Разрешения', revoke: 'Отозвать', clear_all: 'Очистить все разрешения', gate_label: 'Спрашивать перед важными действиями', ask_label: 'Потоковое отображение ответов в режиме Ask', ask_desc: 'Показывает текст по мере поступления в режиме Ask для поддерживаемых провайдеров. Прерванные потоки показывают уведомление и один раз повторяются без потоковой передачи; ошибки провайдера/API по-прежнему отображаются. Вызовы инструментов ожидают завершения потока; запуски Act, Dev, по расписанию, в облаке и Continue остаются без потоковой передачи. Включено по умолчанию.' },
  uk: { allow_once: 'Дозволити один раз', always_allow: 'Завжди дозволяти на {host}', dont_allow: 'Не дозволяти', permissions: 'Дозволи', revoke: 'Відкликати', clear_all: 'Очистити всі дозволи', gate_label: 'Питати перед важливими діями', ask_label: 'Потокове відображення відповідей у режимі Ask', ask_desc: 'Показує текст у міру надходження в режимі Ask для підтримуваних провайдерів. Перервані потоки показують сповіщення та один раз повторюються без потокової передачі; помилки провайдера/API все одно відображаються. Виклики інструментів чекають на завершення потоку; запуски Act, Dev, за розкладом, у хмарі та Continue залишаються без потокової передачі. Увімкнено за замовчуванням.' },
  ar: { allow_once: 'السماح مرة واحدة', always_allow: 'السماح دائمًا على {host}', dont_allow: 'عدم السماح', permissions: 'الأذونات', revoke: 'إلغاء', clear_all: 'مسح كل الأذونات', gate_label: 'السؤال قبل الإجراءات المهمة', ask_label: 'بث استجابات وضع Ask', ask_desc: 'يعرض النص فور وصوله في وضع Ask لدى المزوّدين المدعومين. تُظهر التدفّقات المنقطعة إشعارًا وتُعاد المحاولة مرة واحدة دون تدفّق، مع بقاء أخطاء المزوّد/واجهة البرمجة (API) ظاهرة. تنتظر استدعاءات الأدوات اكتمال التدفّق؛ بينما تبقى عمليات Act وDev والمجدولة والسحاب وContinue دون تدفّق. مفعّل افتراضيًا.' },
  ja: { allow_once: '今回のみ許可', always_allow: '{host} で常に許可', dont_allow: '許可しない', permissions: '権限', revoke: '取り消す', clear_all: 'すべての権限を消去', gate_label: '重要な操作の前に確認する', ask_label: 'Ask モードの応答をストリーミング', ask_desc: '対応プロバイダーの Ask モードで、テキストが届いたら表示します。中断されたストリームは通知を表示し、ストリーミングなしで一度だけ再試行します。プロバイダー/API エラーは引き続き表示されます。ツール呼び出しはストリームの完了まで待機し、Act・Dev・スケジュール・クラウド・Continue の実行はストリーミングされません。デフォルトでオン。' },
  ko: { allow_once: '한 번 허용', always_allow: '{host}에서 항상 허용', dont_allow: '허용 안 함', permissions: '권한', revoke: '취소', clear_all: '모든 권한 지우기', gate_label: '중요한 작업 전에 확인', ask_label: 'Ask 모드에서 응답 스트리밍', ask_desc: '지원되는 공급자의 경우 Ask 모드에서 텍스트가 도착하면 표시합니다. 중단된 스트림은 알림을 표시하고 스트리밍 없이 한 번 다시 시도하며, 공급자/API 오류는 계속 표시됩니다. 도구 호출은 스트림 완료를 기다리며, Act, Dev, 예약, 클라우드 및 Continue 실행은 스트리밍되지 않습니다. 기본적으로 켜져 있습니다.' },
  id: { allow_once: 'Izinkan sekali', always_allow: 'Selalu izinkan di {host}', dont_allow: 'Jangan izinkan', permissions: 'Izin', revoke: 'Cabut', clear_all: 'Hapus semua izin', gate_label: 'Tanya sebelum tindakan penting' },
  th: { allow_once: 'อนุญาตครั้งเดียว', always_allow: 'อนุญาตเสมอบน {host}', dont_allow: 'ไม่อนุญาต', permissions: 'สิทธิ์', revoke: 'เพิกถอน', clear_all: 'ล้างสิทธิ์ทั้งหมด', gate_label: 'ถามก่อนการดำเนินการสำคัญ', ask_label: 'สตรีมการตอบกลับในโหมด Ask', ask_desc: 'แสดงข้อความทันทีที่ได้รับในโหมด Ask สำหรับผู้ให้บริการที่รองรับ สตรีมที่ถูกขัดจังหวะจะแสดงประกาศแล้วลองใหม่อีกครั้งหนึ่งโดยไม่ใช้การสตรีม และยังคงแสดงข้อผิดพลาดของผู้ให้บริการ/API การเรียกใช้เครื่องมือจะรอให้สตรีมเสร็จสมบูรณ์ ส่วนการรัน Act, Dev, ตามกำหนดเวลา, คลาวด์ และ Continue ไม่ใช้การสตรีม เปิดใช้งานตามค่าเริ่มต้น' },
  ms: { allow_once: 'Benarkan sekali', always_allow: 'Sentiasa benarkan di {host}', dont_allow: 'Jangan benarkan', permissions: 'Kebenaran', revoke: 'Batalkan', clear_all: 'Kosongkan semua kebenaran', gate_label: 'Tanya sebelum tindakan penting' },
  tl: { allow_once: 'Payagan minsan', always_allow: 'Palaging payagan sa {host}', dont_allow: 'Huwag payagan', permissions: 'Mga pahintulot', revoke: 'Bawiin', clear_all: 'I-clear ang lahat ng pahintulot', gate_label: 'Magtanong bago ang mahahalagang aksyon' },
  bn: { allow_once: 'একবার অনুমতি দিন', always_allow: 'সবসময় {host} এ অনুমতি দিন', dont_allow: 'অনুমতি দেবেন না', permissions: 'অনুমতি', revoke: 'প্রত্যাহার করুন', clear_all: 'সমস্ত অনুমতি সাফ করুন', gate_label: 'গুরুত্বপূর্ণ কাজের আগে জিজ্ঞাসা করুন', ask_label: 'Ask মোডে প্রতিক্রিয়া স্ট্রিম করুন', ask_desc: 'সমর্থিত প্রদানকারীদের জন্য Ask মোডে পাঠ্য আসার সাথে সাথেই দেখান। বিঘ্নিত স্ট্রিম একটি বিজ্ঞপ্তি দেখায় এবং স্ট্রিম ছাড়াই একবার পুনরায় চেষ্টা করে; প্রদানকারী/API ত্রুটিগুলি এখনও দেখানো হয়। টুল কল স্ট্রিম শেষ হওয়ার অপেক্ষা করে; Act, Dev, নির্ধারিত, ক্লাউড ও Continue চালনা স্ট্রিমবিহীন থাকে। ডিফল্টভাবে চালু।' },
  fa: { allow_once: 'یکبار اجازه دهید', always_allow: '{host} همیشه مجاز باشد', dont_allow: 'اجازه نده', permissions: 'مجوزها', revoke: 'لغو', clear_all: 'تمام مجوزها را پاک کنید', gate_label: 'قبل از اقدامات مهم بپرسید', ask_label: 'پخش پاسخ‌ها در حالت Ask', ask_desc: 'متن را هنگام رسیدن در حالت Ask برای ارائه‌دهندگان پشتیبانی‌شده نمایش می‌دهد. جریان‌های قطع‌شده یک اعلان نشان می‌دهند و یک بار بدون پخش، دوباره تلاش می‌کنند؛ خطاهای ارائه‌دهنده/API همچنان نمایش داده می‌شوند. فراخوانی ابزارها منتظر تکمیل جریان می‌مانند؛ اجراهای Act، Dev، زمان‌بندی‌شده، ابری و Continue بدون پخش باقی می‌مانند. به‌صورت پیش‌فرض روشن است.' },
  he: { allow_once: 'אפשר פעם אחת', always_allow: 'אפשר תמיד {host}', dont_allow: 'אל תאפשר', permissions: 'הרשאות', revoke: 'לְבַטֵל', clear_all: 'נקה את כל ההרשאות', gate_label: 'שאל לפני פעולות חשובות', ask_label: 'הזרמת תשובות במצב Ask', ask_desc: 'הצג טקסט בזמן הגעתו במצב Ask עבור ספקים נתמכים. זרמים שהופסקו מציגים הודעה ומנסים שוב פעם אחת ללא הזרמה; שגיאות של ספק/API עדיין מוצגות. קריאות לכלים ממתינות להשלמת הזרם; ריצות Act, Dev, מתוזמנות, ענן ו-Continue נותרות ללא הזרמה. מופעל כברירת מחדל.' },
  hi: { allow_once: 'एक बार अनुमति दें', always_allow: 'हमेशा {host} पर अनुमति दें', dont_allow: 'अनुमति न दें', permissions: 'अनुमतियाँ', revoke: 'निरस्त करें', clear_all: 'सभी अनुमतियाँ साफ़ करें', gate_label: 'महत्वपूर्ण कार्यों से पहले पूछें', ask_label: 'Ask मोड में उत्तर स्ट्रीम करें', ask_desc: 'समर्थित प्रदाताओं के लिए Ask मोड में आते ही टेक्स्ट दिखाएँ। बाधित स्ट्रीम एक सूचना दिखाती हैं और स्ट्रीमिंग के बिना एक बार फिर प्रयास करती हैं; प्रदाता/API त्रुटियाँ अभी भी दिखाई देती हैं। टूल कॉल स्ट्रीम पूरी होने की प्रतीक्षा करते हैं; Act, Dev, निर्धारित, क्लाउड और Continue रन बिना स्ट्रीमिंग के रहते हैं। डिफ़ॉल्ट रूप से चालू।' },
};

const dirs = ['src/firefox/src/ui/locales', 'src/chrome/src/ui/locales'];

for (const dir of dirs) {
  // Pass 1 — insert permission UI strings where the block is missing.
  for (const [lang, v] of Object.entries(T)) {
    if (v.allow_once === undefined) continue;
    const file = `${dir}/${lang}.js`;
    let src = fs.readFileSync(file, 'utf8');
    if (/['"]sp\.perm\.allow_once['"]/.test(src)) continue;
    const lines = [
      `  'sp.perm.allow_once': ${JSON.stringify(v.allow_once)},`,
      `  'sp.perm.always_allow': ${JSON.stringify(v.always_allow)},`,
      `  'sp.perm.dont_allow': ${JSON.stringify(v.dont_allow)},`,
      `  'st.tab.permissions': ${JSON.stringify(v.permissions)},`,
      `  'st.perms.revoke': ${JSON.stringify(v.revoke)},`,
      `  'st.perms.clear_all': ${JSON.stringify(v.clear_all)},`,
      `  'st.perms.gate.label': ${JSON.stringify(v.gate_label)},`,
    ];
    const block = `\n  // Permission UI — standalone buttons + labels (rest falls back to English)\n${lines.join('\n')}\n`;
    src = src.replace('export default {', 'export default {' + block);
    fs.writeFileSync(file, src);
    console.log('patched', file);
  }

  // Pass 2 — replace damaged Ask-streaming copy in place.
  for (const [lang, v] of Object.entries(T)) {
    if (v.ask_label === undefined) continue;
    const file = `${dir}/${lang}.js`;
    let src = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [key, value] of [
      ['st.display.openai_ask_streaming.label', v.ask_label],
      ['st.display.openai_ask_streaming.desc', v.ask_desc],
    ]) {
      const re = new RegExp(`('${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\s*:\\s*)("[^"]*")`, 'm');
      const before = src;
      src = src.replace(re, (_m, p1, p2) => (p2.includes('?') ? `${p1}${JSON.stringify(value)}` : _m));
      if (src !== before) changed = true;
      else if (!re.test(src)) console.log('!warn (key not found)', file, key);
    }
    if (changed) {
      fs.writeFileSync(file, src);
      console.log('fixed', file);
    }
  }
}
console.log('done');