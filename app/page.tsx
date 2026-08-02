"use client";

import { useEffect, useMemo, useState } from "react";

type Brand = "madirani" | "xpoint" | "xvision" | "office";
type Status = "completed" | "active" | "office";
type Contract = { leaseStart?: string; leaseEnd?: string; owner?: string; rent?: string; increase?: number; contractNote?: string };
type Project = { id: string; city: string; brand: Brand; year: "۱۴۰۴" | "۱۴۰۵"; status: Status; action: string; lat: number; lon: number; pointNote: string; verification?: string } & Contract;

const coordinates: Record<string, [number, number]> = {
  "چالوس": [36.6506, 51.4224], "نیشابور": [36.2106, 58.7922], "رفسنجان": [30.4022, 55.9942], "تنکابن": [36.8154, 50.8787], "ورامین": [35.3283, 51.646], "خرم‌آباد": [33.4842, 48.3538], "نکا": [36.6512, 53.2965],
  "ساوه": [35.0196, 50.3652], "بندرعباس": [27.1842, 56.2893], "کلاردشت": [36.5056, 51.1588], "دزفول": [32.378, 48.4032], "هشتگرد": [35.9642, 50.6858], "لاهیجان": [37.2061, 50.0029], "انزلی": [37.4716, 49.4686], "اصفهان": [32.6708, 51.665], "شهرری": [35.5904, 51.4367], "لنگرود": [37.1956, 50.153],
  "تبریز": [38.0739, 46.2979], "کرج": [35.8225, 50.9905], "نور": [36.5728, 52.0074], "زاهدان": [29.4907, 60.8635], "شهریار": [35.6589, 51.0586], "رشت مطهری": [37.2698, 49.5895], "اهواز": [31.3231, 48.6793], "مسجدسلیمان": [31.9461, 49.3013], "نوشهر": [36.6508, 51.5034], "یزد": [31.9052, 54.3701], "ساری": [36.5537, 53.0603],
};
const contracts: Record<string, Contract> = {
  "تبریز": { leaseStart: "1405/01/05", leaseEnd: "1408/01/05", owner: "سراج ادیبی موسوی", rent: "167/000/000", increase: 0.25 },
  "اصفهان": { leaseStart: "1404/11/15", leaseEnd: "1407/11/15", owner: "شرکت ایرانسل", rent: "100/000/000", increase: 0.30 },
  "نوشهر": { leaseStart: "1405/04/21", leaseEnd: "1408/04/21", owner: "محمدحسین ابراهیم", rent: "120/000/000", increase: 0 },
  "یزد": { leaseStart: "1405/04/01", leaseEnd: "1407/04/01", owner: "حمید رضا فکری", rent: "100/000/000", increase: 0.30 },
  "دزفول": { leaseStart: "1404/06/25", leaseEnd: "1407/06/25", owner: "محمدرضا گوشوار", rent: "55/000/000", increase: 0.25 },
  "کرج": { leaseStart: "1405/05/15", leaseEnd: "1405/05/15", owner: "مهدی ایلخانی", rent: "225/000/000", increase: 0.30, contractNote: "تاریخ پایان در فایل منبع با تاریخ شروع یکسان است و نیازمند بررسی است." },
  "نکا": { leaseStart: "1404/06/05", leaseEnd: "1406/12/10", owner: "علی ازگلی", rent: "90/0000/000", increase: 0.20, contractNote: "قالب مبلغ اجاره در فایل منبع غیرمعمول است و بدون تغییر نمایش داده شده است." },
  "شهرری": { leaseStart: "1404/12/10", leaseEnd: "1406/12/10", owner: "علی اکبر دانش منش", rent: "110/000/000", increase: 0.25 },
  "ساوه": { leaseStart: "1404/07/20", leaseEnd: "1407/08/20", owner: "علیرضا رستگار", rent: "90/000/000", increase: 0.25 },
  "کلاردشت": { leaseStart: "1404/09/17", leaseEnd: "1407/09/01", owner: "بیگلریان", rent: "43/000/000", increase: 0.25 },
  "هشتگرد": { leaseStart: "1404/08/30", leaseEnd: "1406/08/30", owner: "توده دهقان", rent: "130/000/000", increase: 0.30 },
  "انزلی": { leaseStart: "1404/10/15", leaseEnd: "1407/10/5", owner: "تهمتن", rent: "105/000/000", increase: 0.30 },
  "ساری": { leaseStart: "1404/12/29", leaseEnd: "1405/12/29", owner: "سید علی کریمی", rent: "300/000/000", increase: 0 },
  "مسجدسلیمان": { leaseStart: "1402/06/01", leaseEnd: "1405/06/01", owner: "محمدمنصوری بیرگانی", rent: "40/000/000", increase: 0.18 },
  "نور": { leaseStart: "1405/04/13", leaseEnd: "1408/04/13", owner: "سید مسعود حسینی", rent: "122/000/000", increase: 0.25 },
  "اهواز": { leaseStart: "1401/01/15", leaseEnd: "1405/12/29", owner: "غلامرضا قاسمی", rent: "170/000/000", increase: 0.30 },
  "لاهیجان": { leaseStart: "1404/12/12", leaseEnd: "1407/12/12", owner: "محمدحسین طالب پور", rent: "210/000/000", increase: 0.30 },
  "شهریار": { leaseStart: "1405/05/15", leaseEnd: "1408/05/15", owner: "حسن دستجردی", rent: "180/000/000", increase: 0.30 },
  "خرم‌آباد": { leaseStart: "1404/06/05", leaseEnd: "1407/06/05", owner: "بهمن راشدی", rent: "55/000/000", increase: 0.30 },
  "نیشابور": { leaseStart: "1403/12/01", leaseEnd: "1406/12/01", owner: "تاجیک", rent: "80/000/000", increase: 0.30 },
  "چالوس": { leaseStart: "1403/10/24", leaseEnd: "1406/10/24", owner: "علی حیدری - محسن کیاکجوری", rent: "66/000/000", increase: 0.25 },
  "رفسنجان": { leaseStart: "1403/11/01", leaseEnd: "1406/11/01", owner: "امید افروزه", rent: "28/000/000", increase: 0.30 },
  "بندرعباس": { leaseStart: "1405/09/15", leaseEnd: "1407/09/15", owner: "احمد عبدلی", rent: "100/000/000", increase: 0.30 },
  "لنگرود": { leaseStart: "1405/03/01", leaseEnd: "1410/03/01", owner: "رضا ابراهیمی فتیده", rent: "100/000/000", increase: 0.30 },
  "تنکابن": { leaseStart: "1404/04/20", leaseEnd: "1407/04/20", owner: "ایران روشنی رودسری", rent: "80/000/000", increase: 0.25 },
};

const makeProject = (city: string, brand: Brand, year: "۱۴۰۴" | "۱۴۰۵", status: Status, action: string, pointNote: string, suffix = "", verification?: string): Project => ({ id: `${city}-${suffix || brand}-${status}`, city, brand, year, status, action, lat: coordinates[city][0], lon: coordinates[city][1], pointNote, verification, ...(contracts[city] ?? {}) });
const projects: Project[] = [
  ...["چالوس", "نیشابور", "رفسنجان", "تنکابن", "ورامین", "خرم‌آباد", "نکا"].map((city) => makeProject(city, "madirani", "۱۴۰۴", "completed", "اجرای فروشگاه", "۴ نقطه فروش در مجموع این گروه افزوده شده است؛ تخصیص شعبه‌ای تکمیل نشده.")),
  ...["ساوه", "بندرعباس", "کلاردشت"].map((city) => makeProject(city, "xpoint", "۱۴۰۴", "completed", "اجرای XPoint", "۲ نقطه فروش در مجموع پروژه‌های XPoint سال ۱۴۰۴ افزوده شده است.")),
  makeProject("دزفول", "xvision", "۱۴۰۴", "completed", "اجرای XVision Shop", "یک نقطه فروش جدید به شبکه افزوده شده است."),
  ...["هشتگرد", "لاهیجان", "انزلی", "اصفهان", "شهرری", "لنگرود"].map((city) => makeProject(city, "xpoint", "۱۴۰۵", "completed", "اجرای XPoint", "یک نقطه فروش در مجموع پروژه‌های XPoint سال ۱۴۰۵ افزوده شده است.", "store")),
  ...[["تبریز", "جابجایی"], ["کرج", "جابجایی"], ["نور", "تأسیس جدید"], ["زاهدان", "تأسیس جدید"], ["شهریار", "ری‌دیزاین"], ["رشت مطهری", "ری‌دیزاین"], ["اهواز", "ری‌دیزاین"], ["مسجدسلیمان", "ری‌دیزاین"], ["نوشهر", "ری‌دیزاین"]].map(([city, action]) => makeProject(city, "xpoint", "۱۴۰۵", "active", action, action === "تأسیس جدید" ? "نقطه فروش جدید در حال اضافه‌شدن است." : `${action} شعبه در حال انجام است.`, "pipeline", "دسته‌بندی XPoint نیازمند تأیید نهایی است.")),
  makeProject("یزد", "xvision", "۱۴۰۵", "active", "تأسیس / توسعه", "پروژه XVision Shop در حال توسعه است."),
  makeProject("اصفهان", "xpoint", "۱۴۰۵", "office", "دفتر سرپرستی XPoint", "دفتر سرپرستی فعال.", "office"),
  makeProject("تبریز", "xpoint", "۱۴۰۵", "office", "دفتر سرپرستی XPoint", "دفتر سرپرستی فعال.", "office"),
  makeProject("ساری", "madirani", "۱۴۰۵", "office", "دفتر سرپرستی مادیرانی", "دفتر سرپرستی فعال.", "office"),
];

const brandMeta = { madirani: { label: "مادیرانی", color: "#34383d" }, xpoint: { label: "XPoint", color: "#f26a21" }, xvision: { label: "XVision Shop", color: "#2e74b5" }, office: { label: "دفتر سرپرستی", color: "#79818a" } } as const;
const statusMeta = { completed: "اجراشده", active: "در حال توسعه", office: "دفتر سرپرستی" } as const;
const toFa = (value: number | string) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
function projectPoint(lat: number, lon: number) { const merc = (v: number) => Math.log(Math.tan(Math.PI / 4 + (v * Math.PI / 180) / 2)); return { left: `${Math.max(2, Math.min(98, ((lon - 44) / 19.35) * 100))}%`, top: `${Math.max(2, Math.min(98, ((merc(39.85) - merc(lat)) / (merc(39.85) - merc(24.75))) * 100))}%` }; }
function Metric({ value, label, tone }: { value: number; label: string; tone: string }) { return <div className="metric"><span className="metric-value" style={{ color: tone }}>{toFa(value)}</span><span className="metric-label">{label}</span></div>; }

export default function Home() {
  const [brand, setBrand] = useState<"all" | Brand>("all");
  const [year, setYear] = useState<"all" | "۱۴۰۴" | "۱۴۰۵">("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = useMemo(() => projects.filter((p) => (brand === "all" || (brand === "office" ? p.status === "office" : p.brand === brand)) && (year === "all" || p.year === year) && (status === "all" || p.status === status)), [brand, year, status]);
  const completed = visible.filter((p) => p.status === "completed").length;
  const active = visible.filter((p) => p.status === "active").length;
  const offices = visible.filter((p) => p.status === "office").length;
  useEffect(() => { const close = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  const clearFilters = () => { setBrand("all"); setYear("all"); setStatus("all"); };

  return <main>
    <header className="topbar">
      <div className="brand-lockup top-xpoint" aria-label="XPoint"><img src="/xpoint.svg" alt="لوگوی XPoint" /></div>
      <div className="header-copy"><span className="eyebrow">گزارش تعاملی پروژه‌های فروشگاهی</span><h1>نقشه توسعه فروشگاه‌ها</h1><p>عملکرد سال‌های ۱۴۰۴ و ۱۴۰۵</p></div>
      <div className="header-badge"><span>به‌روزرسانی</span><b>۱۴۰۵</b></div>
    </header>
    <section className="dashboard-shell">
      <aside className="control-panel" aria-label="فیلترهای نقشه">
        <div className="panel-heading"><span className="section-index">۰۱</span><div><h2>نمای شبکه</h2><p>فیلتر و مقایسه شعب</p></div></div>
        <div className="filter-block"><label>نوع شبکه</label><div className="brand-filters">{(["all", "madirani", "xpoint", "xvision", "office"] as const).map((key) => <button key={key} className={`brand-filter ${brand === key ? "is-active" : ""}`} style={{ "--filter-color": key === "all" ? "#1f2024" : brandMeta[key].color } as React.CSSProperties} onClick={() => { setBrand(key); setSelected(null); }} aria-pressed={brand === key}><i /><span>{key === "all" ? "همه شبکه" : brandMeta[key].label}</span><b>{toFa(key === "all" ? projects.length : key === "office" ? projects.filter((p) => p.status === "office").length : projects.filter((p) => p.brand === key).length)}</b></button>)}</div></div>
        <div className="filter-block compact"><label>سال پروژه</label><div className="segmented">{(["all", "۱۴۰۴", "۱۴۰۵"] as const).map((key) => <button key={key} className={year === key ? "is-active" : ""} onClick={() => { setYear(key); setSelected(null); }}>{key === "all" ? "همه" : key}</button>)}</div></div>
        <div className="filter-block compact"><label>وضعیت</label><div className="status-filters">{(["all", "completed", "active", "office"] as const).map((key) => <button key={key} className={status === key ? "is-active" : ""} onClick={() => { setStatus(key); setSelected(null); }}>{key === "all" ? "همه" : statusMeta[key]}</button>)}</div></div>
        <button className="reset-button" onClick={clearFilters}>پاک‌کردن فیلترها <span>↺</span></button><div className="panel-note"><span className="note-dot" /><p>برای مشاهده متراژ، هزینه، وضعیت و تصاویر روی هر نقطه کلیک کنید.</p></div>
      </aside>
      <section className="map-panel">
        <div className="map-toolbar"><div><span className="live-dot" /><strong>{toFa(visible.length)}</strong><span>موقعیت قابل مشاهده</span></div><div className="legend"><span><i className="legend-complete" />اجراشده</span><span><i className="legend-active" />در حال توسعه</span><span><i className="legend-office" />دفتر</span></div></div>
        <div className="map-stage"><div className="map-aura aura-one" /><div className="map-aura aura-two" /><div className="map-visual"><img src="/iran-map.svg" alt="نقشه استان‌های ایران" draggable={false} />{visible.map((item) => { const pos = projectPoint(item.lat, item.lon); return <button key={item.id} className={`map-marker marker-${item.status}`} style={{ left: pos.left, top: pos.top, "--marker-color": brandMeta[item.brand].color } as React.CSSProperties} onClick={() => setSelected(item)} aria-label={`نمایش اطلاعات ${item.city}`} title={item.city}><span className="marker-ring" /><span className="marker-core" /><span className="marker-label">{item.city}</span></button>; })}</div><div className="network-orbit" aria-label="خلاصه شبکه"><div className="orbit-ring" /><div className="orbit-core"><small>کل پروژه‌ها</small><strong>{toFa(visible.length - offices)}</strong><span>فروشگاه</span></div></div>{visible.length === 0 && <div className="empty-state"><b>نتیجه‌ای پیدا نشد</b><span>فیلترها را تغییر دهید.</span><button onClick={clearFilters}>نمایش همه</button></div>}</div>
        <div className="metric-strip"><Metric value={completed} label="فروشگاه اجراشده" tone="#34383d" /><Metric value={active} label="پروژه در حال توسعه" tone="#f26a21" /><Metric value={offices} label="دفتر سرپرستی" tone="#2e74b5" /></div>
      </section>
    </section>
    <section className="project-directory"><div className="directory-heading"><div><span className="eyebrow">فهرست سریع</span><h2>شعب و پروژه‌ها</h2></div><p>{toFa(visible.length)} مورد مطابق فیلترهای انتخاب‌شده</p></div><div className="project-grid">{visible.map((item) => <button key={item.id} className="project-card" onClick={() => setSelected(item)} style={{ "--card-color": brandMeta[item.brand].color } as React.CSSProperties}><span className="card-topline"><i />{statusMeta[item.status]} · {item.year}</span><strong>{item.city}</strong><span className="card-action">{item.action}</span><span className="card-footer"><em>{brandMeta[item.brand].label}</em><i>←</i></span></button>)}</div></section>
    <footer><div className="brand-lockup brand-logos footer-logos" aria-label="برندهای مادیران، XPoint و XVision Shop"><img src="/madiran.png" alt="لوگوی مادیران" /><span /><img src="/xpoint.svg" alt="لوگوی XPoint" /><span /><img src="/xvision-shop.png" alt="لوگوی XVision Shop" /></div><p>داشبورد توسعه شبکه فروش · ۱۴۰۴–۱۴۰۵</p><a href="#top">بازگشت به بالا ↑</a></footer>
    {selected && <div className="drawer-layer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="drawer-close" onClick={() => setSelected(null)} aria-label="بستن پنل">×</button><div className="drawer-accent" style={{ background: brandMeta[selected.brand].color }} /><div className="drawer-header"><span className="drawer-kicker">{statusMeta[selected.status]} · سال {selected.year}</span><h2 id="detail-title">{selected.city}</h2><p>{brandMeta[selected.brand].label} / {selected.action}</p></div><div className="photo-pair">{["تصویر نمای فروشگاه", "تصویر فضای داخلی"].map((label, i) => <div className="photo-placeholder" key={label}><span className="photo-icon">⌁</span><b>عکس {toFa(i + 1)}</b><small>{label}</small></div>)}</div><div className="drawer-section-title"><span>اطلاعات قرارداد ملکی</span><small>برگرفته از فایل اطلاعات فروشگاه‌ها</small></div><div className="detail-fields"><div><span>شروع اجاره</span><b>{selected.leaseStart ? toFa(selected.leaseStart) : "ثبت نشده"}</b></div><div><span>پایان اجاره</span><b>{selected.leaseEnd ? toFa(selected.leaseEnd) : "ثبت نشده"}</b></div><div><span>مالک / مالکین</span><b>{selected.owner || "ثبت نشده"}</b></div><div><span>مبلغ اجاره خالص</span><b>{selected.rent ? `${toFa(selected.rent)} تومان` : "ثبت نشده"}</b></div><div><span>شیب افزایشی</span><b>{selected.increase !== undefined ? `${toFa(Math.round(selected.increase * 100))}٪` : "ثبت نشده"}</b></div><div><span>متراژ فروشگاه</span><b>ثبت نشده</b></div><div><span>هزینه اجرای پروژه</span><b>ثبت نشده</b></div><div><span>نوع پروژه</span><b>{selected.action}</b></div></div><div className="point-message" style={{ "--drawer-color": brandMeta[selected.brand].color } as React.CSSProperties}><span>نقطه فروش</span><p>{selected.pointNote}</p></div>{selected.verification && <div className="verification"><b>نیازمند بررسی</b><p>{selected.verification}</p></div>}{selected.contractNote && <div className="verification"><b>یادداشت اطلاعات قرارداد</b><p>{selected.contractNote}</p></div>}<button className="drawer-action" style={{ background: brandMeta[selected.brand].color }} onClick={() => setSelected(null)}>بازگشت به نقشه</button></aside></div>}
  </main>;
}




