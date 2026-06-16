"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { FaqItem } from "@/lib/api/faqApi";

interface FAQSectionClientProps {
  items: FaqItem[];
}

export default function FAQSectionClient({ items }: FAQSectionClientProps) {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const text = {
    heading: language === "vi" ? "Câu hỏi thường gặp" : "Frequently asked questions",
    subtitle:
      language === "vi"
        ? "Danh sách câu hỏi nhanh trước khi mua eSIM. Chọn câu hỏi để xem câu trả lời chi tiết."
        : "Quick answers before you buy your travel eSIM. Select a question to view details.",
    empty:
      language === "vi"
        ? "Chưa có câu hỏi nào. Nội dung sẽ được cập nhật sớm."
        : "No questions yet. Content will be updated soon.",
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#F6FAFF]">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="mb-7 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">{text.heading}</h2>
          <p className="text-gray-500 mt-2 max-w-3xl">{text.subtitle}</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 md:px-6 py-10 text-center text-sm text-slate-500">
            {text.empty}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div key={item.id} className="border-b border-slate-200 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((current) => (current === index ? current : index))}
                    className="w-full flex items-center justify-between gap-3 px-4 md:px-6 py-4 text-left bg-white text-slate-800 hover:bg-slate-50/70 transition"
                  >
                    <span className="text-sm md:text-base font-semibold">{item.question}</span>
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${
                        isActive ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    >
                      ˅
                    </span>
                  </button>

                  {isActive && (
                    <div className="px-4 md:px-6 pb-5 text-sm md:text-[15px] leading-7 text-slate-600">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
