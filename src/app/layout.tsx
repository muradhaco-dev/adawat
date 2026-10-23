import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import PaywallModal from "@/components/PaywallModal";
import AnimatedBackground from "@/components/AnimatedBackground";
import Chatbot from "@/components/Chatbot";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://adawat.vercel.app'
  ),
  title: "أدواتك | ADAWAT — أدوات PDF والسيرة الذاتية وإزالة الخلفية",
  description: "منصة أدوات مجانية متخصصة: أنشئ سيرة ذاتية متوافقة مع ATS، ادمج ملفات PDF ووقّعها، وأزل خلفية الصور — كل ذلك داخل متصفحك مع خصوصية تامة.",
  keywords: [
    "صانع السيرة الذاتية",
    "CV جاهز",
    "دمج ملفات PDF",
    "توقيع PDF",
    "إزالة خلفية الصورة",
    "أدوات مجانية",
    "Resume Builder",
    "PDF Tools",
    "Remove Background",
    "ATS Resume",
    "EuroPass CV",
    "سيرة ذاتية عربية",
  ],
  authors: [{ name: "Mohamed Hacco — HACCO DEV" }],
  openGraph: {
    title: "أدواتك | ADAWAT — أدوات PDF والسيرة الذاتية وإزالة الخلفية",
    description: "أدوات مجانية متخصصة: دمج PDF، توقيع المستندات، إزالة خلفية الصور، وصانع السيرة الذاتية المتوافق مع ATS وEuroPass.",
    locale: "ar_AR",
    type: "website",
    siteName: "أدواتك — ADAWAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "أدواتك | ADAWAT — أدوات PDF والسيرة الذاتية وإزالة الخلفية",
    description: "أدوات مجانية متخصصة: دمج PDF، إزالة خلفية الصور، وصانع السيرة الذاتية المتوافق مع ATS.",
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
          <SubscriptionProvider>
            <AnimatedBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />

              {/* Global Pro Paywall Modal */}
              <PaywallModal />

              {/* Developer Contact Badge — single instance */}
              <Link
                href="/contact"
                title="تواصل مع المطوّر محمد حجو (HACCO)"
                className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2 bg-[#040406]/95 backdrop-blur-md hover:bg-[#121317] text-[#e2e3e9] hover:text-[#ffffff] text-xs rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-all shadow-xl group"
              >
                <span className="w-2 h-2 rounded-full bg-[#cc9166] animate-pulse" />
                <span className="font-sans text-[11px] font-medium">تواصل معنا</span>
              </Link>

              {/* Interactive n8n AI Chatbot Widget */}
              <Chatbot />
            </div>
          </SubscriptionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
