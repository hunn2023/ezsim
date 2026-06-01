import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import AuthProvider from "@/providers/AuthProvider";
import { SITE } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE.name}`,
    default: `${SITE.name} - ${SITE.tagline} | eSIM, Thẻ ĐT, Thẻ Game, Data 4G/5G`,
  },
  description:
    "eSIM du lịch 200+ quốc gia, thẻ viễn thông trong nước, thẻ game, gói Data 4G/5G — tất cả trong 1 nơi.",
  openGraph: {
    siteName: SITE.name,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name} - ${SITE.tagline}`,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={`${beVietnamPro.className} min-h-screen flex flex-col`}>
        <AuthProvider>{children}</AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
