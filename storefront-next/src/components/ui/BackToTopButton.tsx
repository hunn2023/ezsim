"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function BackToTopButton() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = Math.max(220, window.innerHeight * 0.45);
      setVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-[72px] bottom-5 md:right-[84px] md:bottom-8 z-[100] h-11 w-11 rounded-full gradient-primary text-white shadow-[0_10px_30px_rgba(0,102,255,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={language === "vi" ? "Lên đầu trang" : "Back to top"}
    >
      <span aria-hidden="true" className="text-lg font-black leading-none">↑</span>
    </button>
  );
}
