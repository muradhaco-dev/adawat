import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} ${playfair.variable} dark`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#08080a] text-[#e2e3e9] antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Floating Quick WhatsApp / Contact Pill */}
        <a
          href="https://wa.me/905319666195"
          target="_blank"
          rel="noopener noreferrer"
          title="تواصل مع المبرمج محمد حجو عبر واتساب"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-[#040406]/95 backdrop-blur-md hover:bg-[#121317] text-[#ffffff] text-xs rounded-full border border-[#2e3038] hover:border-[#25D366] transition-all shadow-2xl group"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="font-sans font-medium">تواصل مع المبرمج (واتساب)</span>
        </a>
      </body>
    </html>
  );
}
