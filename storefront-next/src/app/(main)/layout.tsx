import { Navbar, Footer, Header } from "@/components/layout";
import { CartAnimationProvider, CartFlyAnimations } from "@/components/ui/CartAnimation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartAnimationProvider>
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <CartFlyAnimations />
      <Footer />
    </CartAnimationProvider>
  );
}
