import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نقشه توسعه فروشگاه‌های مادیران",
  description: "گزارش تعاملی پروژه‌های فروشگاهی مادیرانی، XPoint و XVision Shop در سال‌های ۱۴۰۴ و ۱۴۰۵",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body id="top">{children}</body></html>;
}
