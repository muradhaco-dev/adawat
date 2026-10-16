import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أدواتك | أدوات مجانية بالعربي: صانع السيرة الذاتية، دمج الـ PDF، إزالة الخلفية",
  description: "أكبر منصة عربية مجانية للأدوات السريعة: أنشئ سيرة ذاتية جاهزة للعمل في تركيا وألمانيا والخليج، ادمج ووقع ملفات PDF، وأزل خلفيات الصور بنقرة واحدة بدون برامج.",
  keywords: [
    "صانع السيرة الذاتية بالعربي",
    "CV جاهز للسوريين في تركيا وألمانيا",
    "دمج ملفات PDF أونلاين",
    "توقيع PDF مجانا",
    "إزالة خلفية الصورة",
    "تحويل Word إلى PDF",
    "أدوات مجانية بالعربي"
  ],
  authors: [{ name: "منصة أدواتك" }],
  openGraph: {
    title: "أدواتك | أدوات مجانية واحترافية بالعربي",
    description: "أدوات سريعة ومجانية لتحويل وتعديل المستندات والصور وصناعة السيرة الذاتية الاحترافية.",
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
