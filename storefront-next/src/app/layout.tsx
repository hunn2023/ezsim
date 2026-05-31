import type { Metadata } from "next";
import "./globals.css";
import { Header, Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "EZSIM - Kết nối dễ như chớp mắt | eSIM, Thẻ ĐT, Thẻ Game, Data 4G/5G",
  description:
    "eSIM du lịch 200+ quốc gia, thẻ viễn thông trong nước, thẻ game, gói Data 4G/5G — tất cả trong 1 nơi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <Header />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
