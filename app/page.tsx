"use client";

import { useEffect, useMemo, useState } from "react";

type Brand = "madirani" | "xpoint" | "xvision";
type Status = "completed" | "active";
type Contract = { leaseStart?: string; leaseEnd?: string; owner?: string; rent?: string; increase?: number; area?: string; deposit?: string; address?: string; phone?: string; facilityNote?: string; photo1?: string; photo2?: string; beforePhoto1?: string; beforePhoto2?: string; renderVideo?: string; executedVideo?: string; openingDate?: string; contractNote?: string };
type Project = { id: string; city: string; brand: Brand; year: "۱۴۰۴" | "۱۴۰۵"; status: Status; action: string; lat: number; lon: number; pointNote: string; supervision?: boolean; verification?: string } & Contract;
type MediaPreview = { src: string; kind: "image" | "video"; alt: string };

const coordinates: Record<string, [number, number]> = {
  "چالوس": [36.6506, 51.4224], "نیشابور": [36.2106, 58.7922], "رفسنجان": [30.4022, 55.9942], "تنکابن": [36.8154, 50.8787], "ورامین": [35.3283, 51.646], "خرم‌آباد": [33.4842, 48.3538], "نکا": [36.6512, 53.2965],
  "ساوه": [35.0196, 50.3652], "بندرعباس": [27.1842, 56.2893], "کلاردشت": [36.5056, 51.1588], "دزفول": [32.378, 48.4032], "هشتگرد": [35.9642, 50.6858], "لاهیجان": [37.2061, 50.0029], "انزلی": [37.4716, 49.4686], "اصفهان": [32.6708, 51.665], "شهرری": [35.5904, 51.4367], "لنگرود": [37.1956, 50.153],
  "تبریز": [38.0739, 46.2979], "کرج": [35.8225, 50.9905], "نور": [36.5728, 52.0074], "زاهدان": [29.4907, 60.8635], "شهریار": [35.6589, 51.0586], "رشت مطهری": [37.2698, 49.5895], "اهواز": [31.3231, 48.6793], "مسجدسلیمان": [31.9461, 49.3013], "نوشهر": [36.6508, 51.5034], "یزد": [31.9052, 54.3701], "ساری": [36.5537, 53.0603],
};
const contracts: Record<string, Contract> = {
  "تبریز": { leaseStart: "1405/01/05", leaseEnd: "1408/01/05", owner: "سراج ادیبی موسوی", rent: "167/000/000", increase: 0.25, area: "100", deposit: "500 میلیون تومان", address: "چهارراه شریعتی", phone: "041-51263000", facilityNote: "دارای فضای اداری ویژه شعب سرپرستی", photo1: "/stores/tabriz-1.png", photo2: "/stores/tabriz-2.png" , openingDate: "1405/05/15"},
  "اصفهان": { leaseStart: "1404/11/15", leaseEnd: "1407/11/15", owner: "شرکت ایرانسل", rent: "100/000/000", increase: 0.30, area: "225", deposit: "یک میلیارد تومان", address: "میدان جمهوری", phone: "031-91550031", facilityNote: "دارای بخش اداری و سالن جلسات مجزای سرپرستی", photo1: "/stores/isfahan-1.jpg", photo2: "/stores/isfahan-2.jpg" , openingDate: "1405/03/20"},
  "نوشهر": { leaseStart: "1405/04/21", leaseEnd: "1408/04/21", owner: "محمدحسین ابراهیم", rent: "120/000/000", increase: 0 },
  "یزد": { leaseStart: "1405/04/01", leaseEnd: "1407/04/01", owner: "حمید رضا فکری", rent: "100/000/000", increase: 0.30 , area: "97", deposit: "300 میلیون تومان", photo1: "/stores/yazd-1.png", photo2: "/stores/yazd-2.png"},
  "دزفول": { leaseStart: "1404/06/25", leaseEnd: "1407/06/25", owner: "محمدرضا گوشوار", rent: "55/000/000", increase: 0.25, area: "78", deposit: "500 میلیون تومان", address: "خیابان طالقانی، جنب مسجد عاملی", phone: "061-91013595", photo1: "/stores/dezful-1.jpeg", photo2: "/stores/dezful-2.jpg" , openingDate: "1404/04/16"},
  "کرج": { leaseStart: "1405/05/15", leaseEnd: "1405/05/15", owner: "مهدی ایلخانی", rent: "225/000/000", increase: 0.30, contractNote: "تاریخ پایان در فایل منبع با تاریخ شروع یکسان است و نیازمند بررسی است." },
  "نکا": { leaseStart: "1404/06/05", leaseEnd: "1406/12/10", owner: "علی ازگلی", rent: "90/0000/000", increase: 0.20, contractNote: "قالب مبلغ اجاره در فایل منبع غیرمعمول است و بدون تغییر نمایش داده شده است." , area: "90", openingDate: "1404/07/20", deposit: "500 میلیون تومان", photo1: "/stores/neka-1.jpg", photo2: "/stores/neka-2.jpg"},
  "شهرری": { leaseStart: "1404/12/10", leaseEnd: "1406/12/10", owner: "علی اکبر دانش منش", rent: "110/000/000", increase: 0.25, area: "60", deposit: "یک میلیارد تومان", address: "بلوار امام حسین، روبه‌روی خیابان مصطفی خمینی", phone: "021-41703900", photo1: "/stores/shahr-rey-1.jpg", photo2: "/stores/shahr-rey-2.jpg" , openingDate: "1405/02/25"},
  "ساوه": { leaseStart: "1404/07/20", leaseEnd: "1407/08/20", owner: "علیرضا رستگار", rent: "90/000/000", increase: 0.25 , area: "127", openingDate: "1404/08/30", deposit: "400 میلیون تومان", photo1: "/stores/saveh-1.jpeg", photo2: "/stores/saveh-2.jpeg"},
  "کلاردشت": { leaseStart: "1404/09/17", leaseEnd: "1407/09/01", owner: "بیگلریان", rent: "43/000/000", increase: 0.25, area: "60", deposit: "250 میلیون تومان", address: "حسن کیف، بلوار امام خمینی", phone: "011-42726120", photo1: "/stores/kelardasht-1.jpg", photo2: "/stores/kelardasht-2.jpg" , openingDate: "1404/12/28"},
  "هشتگرد": { leaseStart: "1404/08/30", leaseEnd: "1406/08/30", owner: "توده دهقان", rent: "130/000/000", increase: 0.30, area: "94", deposit: "600 میلیون تومان", address: "بلوار امام خمینی، نرسیده به میدان امام خمینی", phone: "026-34060630", photo1: "/stores/hashtgerd-1.jpg", photo2: "/stores/hashtgerd-2.jpg" , openingDate: "1405/01/28"},
  "انزلی": { leaseStart: "1404/10/15", leaseEnd: "1407/10/5", owner: "تهمتن", rent: "105/000/000", increase: 0.30, area: "90", deposit: "500 میلیون تومان", address: "خیابان مطهری", phone: "013-44971200", photo1: "/stores/anzali-1.jpg", photo2: "/stores/anzali-2.jpg" , openingDate: "1405/02/21"},
  "ساری": { leaseStart: "1404/12/29", leaseEnd: "1405/12/29", owner: "سید علی کریمی", rent: "300/000/000", increase: 0 },
  "مسجدسلیمان": { leaseStart: "1402/06/01", leaseEnd: "1405/06/01", owner: "محمدمنصوری بیرگانی", rent: "40/000/000", increase: 0.18 },
  "نور": { leaseStart: "1405/04/13", leaseEnd: "1408/04/13", owner: "سید مسعود حسینی", rent: "122/000/000", increase: 0.25 , area: "150", openingDate: "شهریور 1405 (به‌زودی)", photo1: "/stores/nur-1.png", photo2: "/stores/nur-2.jpg", deposit: "700 میلیون تومان"},
  "اهواز": { leaseStart: "1401/01/15", leaseEnd: "1405/12/29", owner: "غلامرضا قاسمی", rent: "170/000/000", increase: 0.30 },
  "لاهیجان": { leaseStart: "1404/12/12", leaseEnd: "1407/12/12", owner: "محمدحسین طالب پور", rent: "210/000/000", increase: 0.30, area: "87", deposit: "800 میلیون تومان", address: "روبه‌روی باغ ملی", phone: "013-44971100", photo1: "/stores/lahijan-1.jpg", photo2: "/stores/lahijan-2.png" , openingDate: "1405/02/13"},
  "شهریار": { leaseStart: "1405/05/15", leaseEnd: "1408/05/15", owner: "حسن دستجردی", rent: "180/000/000", increase: 0.30 },
  "خرم‌آباد": { leaseStart: "1404/06/05", leaseEnd: "1407/06/05", owner: "بهمن راشدی", rent: "55/000/000", increase: 0.30 , area: "91", openingDate: "1404/07/10", deposit: "500 میلیون تومان", photo1: "/stores/khorramabad-1.jpg", photo2: "/stores/khorramabad-2.jpg"},
  "نیشابور": { leaseStart: "1403/12/01", leaseEnd: "1406/12/01", owner: "تاجیک", rent: "80/000/000", increase: 0.30 , area: "170", openingDate: "1404/02/05", deposit: "500 میلیون تومان", photo1: "/stores/nishapur-1.jpeg", photo2: "/stores/nishapur-2.jpeg"},
  "چالوس": { leaseStart: "1403/10/24", leaseEnd: "1406/10/24", owner: "علی حیدری - محسن کیاکجوری", rent: "66/000/000", increase: 0.25 , area: "75", openingDate: "1404/02/06", deposit: "500 میلیون تومان", photo1: "/stores/chalus-1.jpg", photo2: "/stores/chalus-2.jpg"},
  "رفسنجان": { leaseStart: "1403/11/01", leaseEnd: "1406/11/01", owner: "امید افروزه", rent: "28/000/000", increase: 0.30 , area: "138", openingDate: "1404/04/15", deposit: "100 میلیون تومان", photo1: "/stores/rafsanjan-1.jpeg", photo2: "/stores/rafsanjan-2.jpeg"},
  "بندرعباس": { leaseStart: "1405/09/15", leaseEnd: "1407/09/15", owner: "احمد عبدلی", rent: "100/000/000", increase: 0.30, area: "86", deposit: "یک میلیارد تومان", address: "خیابان مصطفی خمینی، بین چهارراه اتوبوسرانی و صادقیه، روبه‌روی پست بانک", phone: "076-91010260", photo1: "/stores/bandar-abbas-1.jpg", photo2: "/stores/bandar-abbas-2.jpg" , openingDate: "1404/12/09"},
  "لنگرود": { leaseStart: "1405/03/01", leaseEnd: "1410/03/01", owner: "رضا ابراهیمی فتیده", rent: "100/000/000", increase: 0.30, area: "100", deposit: "800 میلیون تومان", address: "بلوار امام خمینی، بعد از میدان نماز", phone: "013-44971700", photo1: "/stores/langarud-1.jpeg", photo2: "/stores/langarud-2.jpeg" , openingDate: "1405/05/01"},
  "تنکابن": { leaseStart: "1404/04/20", leaseEnd: "1407/04/20", owner: "ایران روشنی رودسری", rent: "80/000/000", increase: 0.25 , area: "100", openingDate: "1404/05/20", deposit: "600 میلیون تومان", photo1: "/stores/tonekabon-1.jpg", photo2: "/stores/tonekabon-2.jpg"},
  "ورامین": { area: "140", openingDate: "1404/06/08" , leaseStart: "1404/04/13", leaseEnd: "1407/04/13", rent: "70/000/000", deposit: "500 میلیون تومان", photo1: "/stores/varamin-1.jpeg", photo2: "/stores/varamin-2.jpeg"},
  "رشت مطهری": { area: "50", deposit: "700 میلیون تومان", address: "خیابان مطهری، نبش ساغری‌سازان", phone: "013-44971000", photo1: "/stores/rasht-1.png", photo2: "/stores/rasht-2.png" },
};

const projectMedia: Record<string, Contract> = {
  "هشتگرد": { beforePhoto1: "/media/hashtgerd/before-1.jpg", beforePhoto2: "/media/hashtgerd/before-2.jpg" },
  "بندرعباس": { beforePhoto1: "/media/bandar-abbas/before-1.jpg", beforePhoto2: "/media/bandar-abbas/before-2.jpg" },
  "کلاردشت": { beforePhoto1: "/media/kelardasht/before-1.jpeg", beforePhoto2: "/media/kelardasht/before-2.jpeg" },
  "انزلی": { beforePhoto1: "/media/anzali/before-1.jpg", beforePhoto2: "/media/anzali/before-2.jpg" },
  "اصفهان": { beforePhoto1: "/media/isfahan/before-1.jpg", beforePhoto2: "/media/isfahan/before-2.jpg" },
  "شهرری": { beforePhoto1: "/media/shahr-rey/before-1.jpg", beforePhoto2: "/media/shahr-rey/before-2.jpg" },
  "لاهیجان": { beforePhoto1: "/media/lahijan/before-1.jpg", beforePhoto2: "/media/lahijan/before-2.png" },
  "تبریز": { beforePhoto1: "/media/tabriz/before-1.jpg", beforePhoto2: "/media/tabriz/before-2.jpg" },
  "لنگرود": { beforePhoto1: "/media/langarud/before-1.jpg", beforePhoto2: "/media/langarud/before-2.jpg" },
  "رشت مطهری": { beforePhoto1: "/media/rasht/before-1.jpg", beforePhoto2: "/media/rasht/before-2.jpg" },
  "دزفول": { beforePhoto1: "/media/dezful/before-1.jpg", beforePhoto2: "/media/dezful/before-2.jpg" },
  "نیشابور": { beforePhoto1: "/media/nishapur/before-1.jpeg", beforePhoto2: "/media/nishapur/before-2.jpeg" },
  "رفسنجان": { beforePhoto1: "/media/rafsanjan/before-1.jpeg", beforePhoto2: "/media/rafsanjan/before-2.jpeg" },
  "تنکابن": { beforePhoto1: "/media/tonekabon/before-1.jpeg", beforePhoto2: "/media/tonekabon/before-2.jpeg" },
  "ورامین": { beforePhoto1: "/media/varamin/before-1.jpg", beforePhoto2: "/media/varamin/before-2.jpg" },
  "نکا": { beforePhoto1: "/media/neka/before-1.jpg", beforePhoto2: "/media/neka/before-2.jpg" },
  "خرم‌آباد": { beforePhoto1: "/media/khorramabad/before-1.jpg", beforePhoto2: "/media/khorramabad/before-2.jpg" },
  "ساوه": { beforePhoto1: "/media/saveh/before-1.jpg", beforePhoto2: "/media/saveh/before-2.jpg" },
};

const supervisoryCities = new Set(["\u0627\u0635\u0641\u0647\u0627\u0646", "\u062a\u0628\u0631\u06cc\u0632", "\u0633\u0627\u0631\u06cc"]);
const makeProject = (city: string, brand: Brand, year: "۱۴۰۴" | "۱۴۰۵", status: Status, action: string, pointNote: string, suffix = "", verification?: string): Project => ({ id: `${city}-${suffix || brand}-${status}`, city, brand, year, status, action, lat: coordinates[city][0], lon: coordinates[city][1], pointNote, supervision: supervisoryCities.has(city), verification, ...(contracts[city] ?? {}), ...(projectMedia[city] ?? {}) });
const projects: Project[] = [
  ...["چالوس", "نیشابور", "رفسنجان", "تنکابن", "ورامین", "خرم‌آباد", "نکا"].map((city) => makeProject(city, "madirani", "۱۴۰۴", "completed", "اجرای فروشگاه", "۴ نقطه فروش در مجموع این گروه افزوده شده است؛ تخصیص شعبه‌ای تکمیل نشده.")),
  ...["ساوه", "بندرعباس", "کلاردشت"].map((city) => makeProject(city, "xpoint", "۱۴۰۴", "completed", "اجرای XPoint", "۲ نقطه فروش در مجموع پروژه‌های XPoint سال ۱۴۰۴ افزوده شده است.")),
  makeProject("دزفول", "xvision", "۱۴۰۴", "completed", "اجرای XVision Shop", "یک نقطه فروش جدید به شبکه افزوده شده است."),
  ...["هشتگرد", "لاهیجان", "انزلی", "اصفهان", "شهرری", "لنگرود"].map((city) => makeProject(city, "xpoint", "۱۴۰۵", "completed", "اجرای XPoint", "یک نقطه فروش در مجموع پروژه‌های XPoint سال ۱۴۰۵ افزوده شده است.", "store")),
  ...[["تبریز", "جابجایی"], ["کرج", "جابجایی"], ["نور", "تأسیس جدید"], ["زاهدان", "تأسیس جدید"], ["شهریار", "ری‌دیزاین"], ["رشت مطهری", "ری‌دیزاین"], ["اهواز", "ری‌دیزاین"], ["مسجدسلیمان", "ری‌دیزاین"], ["نوشهر", "ری‌دیزاین"]].map(([city, action]) => makeProject(city, "xpoint", "۱۴۰۵", "active", action, action === "تأسیس جدید" ? "نقطه فروش جدید در حال اضافه‌شدن است." : `${action} شعبه در حال انجام است.`, "pipeline", "دسته‌بندی XPoint نیازمند تأیید نهایی است.")),
  makeProject("یزد", "xvision", "۱۴۰۵", "active", "تأسیس / توسعه", "پروژه XVision Shop در حال توسعه است."),
  makeProject("\u0633\u0627\u0631\u06cc", "madirani", "\u06f1\u06f4\u06f0\u06f5", "completed", "\u0641\u0631\u0648\u0634\u06af\u0627\u0647 \u0645\u0627\u062f\u06cc\u0631\u0627\u0646\u06cc", "\u0641\u0631\u0648\u0634\u06af\u0627\u0647 \u0641\u0639\u0627\u0644 \u0628\u0627 \u062f\u0641\u062a\u0631 \u0633\u0631\u067e\u0631\u0633\u062a\u06cc \u062f\u0631 \u0637\u0628\u0642\u0647 \u0628\u0627\u0644\u0627.", "store"),
];

const brandMeta = { madirani: { label: "\u0645\u0627\u062f\u06cc\u0631\u0627\u0646\u06cc", color: "#34383d" }, xpoint: { label: "XPoint", color: "#f26a21" }, xvision: { label: "XVision Shop", color: "#2e74b5" } } as const;
const statusMeta = { completed: "\u0627\u062c\u0631\u0627\u0634\u062f\u0647", active: "\u062f\u0631 \u062d\u0627\u0644 \u062a\u0648\u0633\u0639\u0647" } as const;
const activeProjectDescriptions: Record<string, string> = {
  "\u062a\u0628\u0631\u06cc\u0632": "\u0627\u0641\u062a\u062a\u0627\u062d \u062a\u0627 \u0686\u0646\u062f \u0631\u0648\u0632 \u062f\u06cc\u06af\u0631",
  "\u06a9\u0631\u062c": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u0646\u0648\u0631": "\u062f\u0631 \u062d\u0627\u0644 \u0627\u062c\u0631\u0627",
  "\u0632\u0627\u0647\u062f\u0627\u0646": "\u062f\u0631 \u062d\u0627\u0644 \u0637\u0631\u0627\u062d\u06cc",
  "\u0634\u0647\u0631\u06cc\u0627\u0631": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u0631\u0634\u062a \u0645\u0637\u0647\u0631\u06cc": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u0627\u0647\u0648\u0627\u0632": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u0645\u0633\u062c\u062f\u0633\u0644\u06cc\u0645\u0627\u0646": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u0646\u0648\u0634\u0647\u0631": "\u062f\u0631 \u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u0623\u06cc\u06cc\u062f \u0628\u0631\u0627\u06cc \u0634\u0631\u0648\u0639 \u0637\u0631\u0627\u062d\u06cc",
  "\u06cc\u0632\u062f": "\u062f\u0631 \u062d\u0627\u0644 \u0637\u0631\u0627\u062d\u06cc",
};
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const supervisionLabel = "\u062f\u0641\u062a\u0631 \u0633\u0631\u067e\u0631\u0633\u062a\u06cc";
const mediaText = {
  zoom: "\u0628\u0632\u0631\u06af\u200c\u0646\u0645\u0627\u06cc\u06cc",
  before: "\u0642\u0628\u0644 \u0627\u0632 \u0627\u062c\u0631\u0627",
  beforeImage: "\u0639\u06a9\u0633 \u0642\u0628\u0644 \u0627\u0632 \u0627\u062c\u0631\u0627",
  projectVideos: "\u0648\u06cc\u062f\u06cc\u0648\u0647\u0627\u06cc \u067e\u0631\u0648\u0698\u0647",
  renderVideo: "\u0648\u06cc\u062f\u06cc\u0648\u06cc \u0631\u0646\u062f\u0631",
  executedVideo: "\u0648\u06cc\u062f\u06cc\u0648\u06cc \u0627\u062c\u0631\u0627\u0634\u062f\u0647",
  notUploaded: "\u0647\u0646\u0648\u0632 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc \u0646\u0634\u062f\u0647",
  image: "\u062a\u0635\u0648\u06cc\u0631",
};
const toFa = (value: number | string) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const projectDescription = (project: Project) => project.status === "completed" ? "\u0627\u062a\u0645\u0627\u0645 \u0627\u062c\u0631\u0627 \u0648 \u0634\u0631\u0648\u0639 \u0641\u0631\u0648\u0634" : activeProjectDescriptions[project.city] ?? "\u062f\u0631 \u062d\u0627\u0644 \u062a\u0648\u0633\u0639\u0647";
function projectPoint(lat: number, lon: number) { const merc = (v: number) => Math.log(Math.tan(Math.PI / 4 + (v * Math.PI / 180) / 2)); return { left: `${Math.max(2, Math.min(98, ((lon - 44) / 19.35) * 100))}%`, top: `${Math.max(2, Math.min(98, ((merc(39.85) - merc(lat)) / (merc(39.85) - merc(24.75))) * 100))}%` }; }
function Metric({ value, label, tone }: { value: number; label: string; tone: string }) { return <div className="metric"><span className="metric-value" style={{ color: tone }}>{toFa(value)}</span><span className="metric-label">{label}</span></div>; }

export default function Home() {
  const [brand, setBrand] = useState<"all" | Brand>("all");
  const [year, setYear] = useState<"all" | "۱۴۰۴" | "۱۴۰۵">("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
  const visible = useMemo(() => projects.filter((p) => (brand === "all" || p.brand === brand) && (year === "all" || p.year === year) && (status === "all" || p.status === status)), [brand, year, status]);
  const completed = visible.filter((p) => p.status === "completed").length;
  const active = visible.filter((p) => p.status === "active").length;
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key !== "Escape") return; if (mediaPreview) setMediaPreview(null); else setSelected(null); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [mediaPreview]);
  useEffect(() => { if (!publicBasePath) return; document.querySelectorAll<HTMLImageElement | HTMLVideoElement>('img[src^="/"],video[src^="/"]').forEach((media) => { const source = media.getAttribute("src"); if (source && !source.startsWith(publicBasePath)) media.src = `${publicBasePath}${source}`; }); }, [selected, mediaPreview]);
  const clearFilters = () => { setBrand("all"); setYear("all"); setStatus("all"); };

  return <main>
    <header className="topbar">
      <div className="brand-lockup top-xpoint" aria-label="XPoint"><img src="/xpoint.svg" alt="لوگوی XPoint" /></div>
      <div className="header-copy"><h1>نقشه توسعه فروشگاه‌ها</h1><p>عملکرد سال‌های ۱۴۰۴ و ۱۴۰۵</p></div>
      <div className="header-badge"><span>به‌روزرسانی</span><b>۱۴۰۵</b></div>
    </header>
    <section className="dashboard-shell">
      <aside className="control-panel" aria-label="فیلترهای نقشه">
        <div className="panel-heading"><span className="section-index">۰۱</span><div><h2>نمای شبکه</h2><p>فیلتر و مقایسه شعب</p></div></div>
        <div className="filter-block"><label>نوع شبکه</label><div className="brand-filters">{(["all", "madirani", "xpoint", "xvision"] as const).map((key) => <button key={key} className={`brand-filter ${brand === key ? "is-active" : ""}`} style={{ "--filter-color": key === "all" ? "#1f2024" : brandMeta[key].color } as React.CSSProperties} onClick={() => { setBrand(key); setSelected(null); }} aria-pressed={brand === key}><i /><span>{key === "all" ? "همه شبکه" : brandMeta[key].label}</span><b>{toFa(key === "all" ? projects.length : projects.filter((p) => p.brand === key).length)}</b></button>)}</div></div>
        <div className="filter-block compact"><label>سال پروژه</label><div className="segmented">{(["all", "۱۴۰۴", "۱۴۰۵"] as const).map((key) => <button key={key} className={year === key ? "is-active" : ""} onClick={() => { setYear(key); setSelected(null); }}>{key === "all" ? "همه" : key}</button>)}</div></div>
        <div className="filter-block compact"><label>وضعیت</label><div className="status-filters">{(["all", "completed", "active"] as const).map((key) => <button key={key} className={status === key ? "is-active" : ""} onClick={() => { setStatus(key); setSelected(null); }}>{key === "all" ? "همه" : statusMeta[key]}</button>)}</div></div>
        <button className="reset-button" onClick={clearFilters}>پاک‌کردن فیلترها <span>↺</span></button><div className="panel-note"><span className="note-dot" /><p>برای مشاهده متراژ، وضعیت و تصاویر روی هر نقطه کلیک کنید.</p></div>
      </aside>
      <section className="map-panel">
        <div className="map-toolbar"><div><span className="live-dot" /><strong>{toFa(visible.length)}</strong><span>موقعیت قابل مشاهده</span></div><div className="legend"><span><i className="legend-complete" />اجراشده</span><span><i className="legend-active" />در حال توسعه</span><span><i className="legend-supervision" />{supervisionLabel}</span></div></div>
        <div className="map-stage"><div className="map-aura aura-one" /><div className="map-aura aura-two" /><div className="map-visual"><img src="/iran-map.svg" alt="نقشه استان‌های ایران" draggable={false} />{visible.map((item) => { const pos = projectPoint(item.lat, item.lon); return <button key={item.id} className={`map-marker marker-${item.status}${item.supervision ? " marker-supervision" : ""}`} style={{ left: pos.left, top: pos.top, "--marker-color": brandMeta[item.brand].color } as React.CSSProperties} onClick={() => setSelected(item)} aria-label={`نمایش اطلاعات ${item.city}`} title={`${item.city}${item.supervision ? ` · ${supervisionLabel}` : ""}`}><span className="marker-ring" /><span className="marker-core" />{item.supervision && <span className="supervision-pin" aria-hidden="true">{"\u0633"}</span>}<span className="marker-label">{item.city}</span></button>; })}</div><div className="network-orbit" aria-label="خلاصه شبکه"><div className="orbit-ring" /><div className="orbit-core"><small>کل پروژه‌ها</small><strong>{toFa(visible.length)}</strong><span>فروشگاه</span></div></div>{visible.length === 0 && <div className="empty-state"><b>نتیجه‌ای پیدا نشد</b><span>فیلترها را تغییر دهید.</span><button onClick={clearFilters}>نمایش همه</button></div>}</div>
        <div className="metric-strip"><Metric value={completed} label="فروشگاه اجراشده" tone="#34383d" /><Metric value={active} label="پروژه در حال توسعه" tone="#f26a21" /><Metric value={visible.length} label="کل فروشگاه‌ها" tone="#2e74b5" /></div>
      </section>
    </section>
    <section className="project-directory"><div className="directory-heading"><div><span className="eyebrow">فهرست سریع</span><h2>شعب و پروژه‌ها</h2></div><p>{toFa(visible.length)} مورد مطابق فیلترهای انتخاب‌شده</p></div><div className="project-grid">{visible.map((item) => <button key={item.id} className="project-card" onClick={() => setSelected(item)} style={{ "--card-color": brandMeta[item.brand].color } as React.CSSProperties}><span className="card-topline"><i />{statusMeta[item.status]} · {item.year}</span>{item.supervision && <span className="supervision-badge">{supervisionLabel}</span>}<strong>{item.city}</strong><span className="card-action">{projectDescription(item)}</span><span className="card-footer"><em>{brandMeta[item.brand].label}</em><i>←</i></span></button>)}</div></section>
    <footer><div className="brand-lockup brand-logos footer-logos" aria-label="برندهای مادیران، XPoint و XVision Shop"><img src="/madiran.png" alt="لوگوی مادیران" /><span /><img src="/xpoint.svg" alt="لوگوی XPoint" /><span /><img src="/xvision-shop.png" alt="لوگوی XVision Shop" /></div><p>داشبورد توسعه شبکه فروش · ۱۴۰۴–۱۴۰۵</p><a href="#top">بازگشت به بالا ↑</a></footer>
    {selected && <div className="drawer-layer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="drawer-close" onClick={() => setSelected(null)} aria-label="بستن پنل">×</button><div className="drawer-accent" style={{ background: brandMeta[selected.brand].color }} /><div className="drawer-header"><span className="drawer-kicker">{statusMeta[selected.status]} · سال {selected.year}</span>{selected.supervision && <span className="drawer-supervision">{supervisionLabel}</span>}<h2 id="detail-title">{selected.city}</h2><p>{brandMeta[selected.brand].label} / {selected.action}</p></div><div className="photo-pair">{[selected.photo1, selected.photo2].map((photo, i) => photo ? <figure className="store-photo" key={`${selected.id}-${i}`}><button className="photo-zoom" type="button" onClick={() => setMediaPreview({ src: photo, kind: "image", alt: `${mediaText.image} ${toFa(i + 1)} ${selected.city}` })} aria-label={`${mediaText.zoom}: ${mediaText.image} ${toFa(i + 1)} ${selected.city}`}><img src={photo} alt={`${mediaText.image} ${toFa(i + 1)} ${selected.city}`} /><span className="zoom-hint">&#8981; {mediaText.zoom}</span></button><figcaption>{i === 0 ? "نمای فروشگاه" : "فضای پروژه"}</figcaption></figure> : <div className="photo-placeholder" key={`${selected.id}-${i}`}><span className="photo-icon">⌁</span><b>عکس {toFa(i + 1)}</b><small>{i === 0 ? "تصویر نمای فروشگاه" : "تصویر فضای داخلی"}</small></div>)}</div><div className="drawer-section-title media-section-title"><span>{mediaText.before}</span><small>۲ تصویر</small></div><div className="before-gallery">{[selected.beforePhoto1, selected.beforePhoto2].map((photo, i) => photo ? <button className="before-card has-media" type="button" key={`before-${selected.id}-${i}`} onClick={() => setMediaPreview({ src: photo, kind: "image", alt: `${mediaText.beforeImage} ${selected.city} - ${toFa(i + 1)}` })}><img src={photo} alt={`${mediaText.beforeImage} ${selected.city} - ${toFa(i + 1)}`} /><span className="zoom-hint">&#8981; {mediaText.zoom}</span></button> : <div className="before-card media-placeholder" key={`before-${selected.id}-${i}`}><span className="media-slot-icon">＋</span><b>{mediaText.beforeImage} {toFa(i + 1)}</b><small>{mediaText.notUploaded}</small></div>)}</div><div className="drawer-section-title media-section-title"><span>{mediaText.projectVideos}</span><small>رندر و اجرای نهایی</small></div><div className="video-grid">{[{ src: selected.renderVideo, label: mediaText.renderVideo, badge: "RENDER" }, { src: selected.executedVideo, label: mediaText.executedVideo, badge: "FINAL" }].map((media) => media.src ? <button className="video-card has-media" type="button" key={media.badge} onClick={() => setMediaPreview({ src: media.src!, kind: "video", alt: `${media.label} ${selected.city}` })}><video src={media.src} muted preload="metadata" aria-label={`${media.label} ${selected.city}`} /><span className="video-badge">{media.badge}</span><span className="play-icon">▶</span><b>{media.label}</b></button> : <div className="video-card video-placeholder" key={media.badge}><span className="video-badge">{media.badge}</span><span className="play-icon">▶</span><b>{media.label}</b><small>{mediaText.notUploaded}</small></div>)}</div><div className="drawer-section-title"><span>اطلاعات فروشگاه</span></div><div className="detail-fields"><div><span>شروع اجاره</span><b>{selected.leaseStart ? toFa(selected.leaseStart) : "ثبت نشده"}</b></div><div><span>پایان اجاره</span><b>{selected.leaseEnd ? toFa(selected.leaseEnd) : "ثبت نشده"}</b></div><div><span>مالک / مالکین</span><b>{selected.owner || "ثبت نشده"}</b></div><div><span>مبلغ اجاره خالص</span><b>{selected.rent ? `${toFa(selected.rent)} تومان` : "ثبت نشده"}</b></div><div><span>شیب افزایشی</span><b>{selected.increase !== undefined ? `${toFa(Math.round(selected.increase * 100))}٪` : "ثبت نشده"}</b></div><div><span>متراژ فروشگاه</span><b>{selected.area ? `${toFa(selected.area)} متر مربع` : "ثبت نشده"}</b></div>{selected.openingDate && <div><span>تاریخ افتتاح / تحویل</span><b>{toFa(selected.openingDate)}</b></div>}<div><span>مبلغ ودیعه</span><b>{selected.deposit ? toFa(selected.deposit) : "ثبت نشده"}</b></div><div><span>نوع پروژه</span><b>{selected.action}</b></div></div><div className="point-message status-message" style={{ "--drawer-color": brandMeta[selected.brand].color } as React.CSSProperties}><span>وضعیت پروژه</span><p>{projectDescription(selected)}</p></div><button className="drawer-action" style={{ background: brandMeta[selected.brand].color }} onClick={() => setSelected(null)}>بازگشت به نقشه</button></aside></div>}
    {mediaPreview && <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={mediaPreview.alt} onMouseDown={(e) => e.target === e.currentTarget && setMediaPreview(null)}><button className="lightbox-close" type="button" onClick={() => setMediaPreview(null)} aria-label="بستن">×</button><div className="lightbox-frame">{mediaPreview.kind === "image" ? <img src={mediaPreview.src} alt={mediaPreview.alt} /> : <video src={mediaPreview.src} controls autoPlay playsInline aria-label={mediaPreview.alt} />}<div className="lightbox-caption"><span>{mediaPreview.kind === "image" ? mediaText.image : mediaText.projectVideos}</span><b>{mediaPreview.alt}</b></div></div></div>}
  </main>;
}




