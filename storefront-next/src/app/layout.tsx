import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer, Header } from "@/components/layout";
import { CartAnimationProvider, CartFlyAnimations } from "@/components/ui/CartAnimation";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "EZSIM - Kết nối dễ như chớp mắt | eSIM, Thẻ ĐT, Thẻ Game, Data 4G/5G",
  description:
    "eSIM du lịch 200+ quốc gia, thẻ viễn thông trong nước, thẻ game, gói Data 4G/5G — tất cả trong 1 nơi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <CartAnimationProvider>
          <Header />
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartFlyAnimations />
        </CartAnimationProvider>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
