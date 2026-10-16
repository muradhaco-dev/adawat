import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Link from "next/link";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أدواتك | ADAWAT — منصة الأدوات الذكية والمجانية",
  description: "أكبر منصة عربية وعالمية للأدوات السريعة: أنشئ سيرة ذاتية جاهزة، ادمج ووقع ملفات PDF، وأزل خلفيات الصور بنقرة واحدة.",
  keywords: [
    "صانع السيرة الذاتية",
    "CV جاهز",
    "دمج ملفات PDF",
    "توقيع PDF",
    "إزالة خلفية الصورة",
    "أدوات مجانية",
    "Resume Builder",
    "PDF Tools",
    "Remove BG"
  ],
  authors: [{ name: "المبرمج محمد حجو HACCO" }],
  openGraph: {
    title: "أدواتك | ADAWAT — الأدوات الذكية السريعة",
    description: "أدوات متطورة لتحويل وتعديل المستندات والصور وصناعة السيرة الذاتية الاحترافية.",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} ${playfair.variable} dark`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#08080a] text-[#e2e3e9] antialiased">
        <LanguageProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />

          {/* Clean Floating Badge linking to Contact page */}
          <Link
            href="/contact"
            title="تواصل مع المبرمج محمد حجو (HACCO)"
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2 bg-[#040406]/95 backdrop-blur-md hover:bg-[#121317] text-[#e2e3e9] hover:text-[#ffffff] text-xs rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-all shadow-xl group"
          >
            <span className="w-2 h-2 rounded-full bg-[#cc9166] animate-pulse" />
            <span className="font-sans text-[11px] font-medium">المبرمج محمد حجو</span>
          </Link>
        </LanguageProvider>
      </body>
    </html>
  );
}
