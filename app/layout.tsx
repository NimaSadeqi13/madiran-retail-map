import type { Metadata } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "نقشه توسعه فروشگاه‌های مادیران",
  description: "گزارش تعاملی پروژه‌های فروشگاهی مادیرانی، XPoint و XVision Shop در سال‌های ۱۴۰۴ و ۱۴۰۵",
  icons: { icon: `${publicBasePath}/favicon.svg`, shortcut: `${publicBasePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body id="top">{children}</body></html>;
}
