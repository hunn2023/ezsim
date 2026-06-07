"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type FaqItem = {
  questionVi: string;
  answerVi: string;
  questionEn: string;
  answerEn: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    questionVi: "eSIM là gì và khác SIM vật lý thế nào?",
    answerVi:
      "eSIM là SIM điện tử tích hợp sẵn trong máy. Bạn không cần tháo lắp SIM vật lý, chỉ cần quét QR để kích hoạt và dùng dữ liệu ngay.",
    questionEn: "What is eSIM and how is it different from a physical SIM?",
    answerEn:
      "eSIM is a digital SIM built into your device. No physical SIM swap is needed. You can activate it by scanning a QR code and start using data instantly.",
  },
  {
    questionVi: "Mua xong bao lâu thì nhận được mã QR?",
    answerVi:
      "Thông thường bạn nhận QR gần như ngay lập tức sau khi thanh toán thành công. Trong giờ cao điểm có thể chậm hơn vài phút.",
    questionEn: "How long does it take to receive the QR code after payment?",
    answerEn:
      "In most cases, the QR code is delivered almost instantly after successful payment. During peak times, it may take a few extra minutes.",
  },
  {
    questionVi: "Có dùng chung hotspot được không?",
    answerVi:
      "Phần lớn gói eSIM hỗ trợ chia sẻ hotspot. Tuy nhiên một số gói có giới hạn, bạn nên kiểm tra mục tính năng trên từng gói trước khi mua.",
    questionEn: "Can I use hotspot sharing?",
    answerEn:
      "Most eSIM plans support hotspot sharing. Some plans may have limits, so please check each plan's feature details before purchase.",
  },
  {
    questionVi: "Đi nhiều nước Châu Âu có phải đổi eSIM không?",
    answerVi:
      "Với các gói khu vực Châu Âu, bạn có thể dùng liên quốc gia mà không cần đổi eSIM. Thiết bị sẽ tự chuyển nhà mạng phù hợp theo từng nước.",
    questionEn: "Do I need to switch eSIM when traveling across Europe?",
    answerEn:
      "With regional Europe plans, you can use data across multiple countries without changing eSIM. Your device will automatically connect to supported networks.",
  },
  {
    questionVi: "Nếu quét QR lỗi thì xử lý thế nào?",
    answerVi:
      "Bạn có thể nhập thủ công SM-DP+ Address và Activation Code từ email đơn hàng. Nếu vẫn lỗi, đội hỗ trợ sẽ giúp bạn kích hoạt nhanh.",
    questionEn: "What should I do if QR scanning fails?",
    answerEn:
      "You can manually enter the SM-DP+ Address and Activation Code from your order email. If it still fails, support will assist with quick activation.",
  },
  {
    questionVi: "Có hoàn tiền nếu chưa sử dụng gói không?",
    answerVi:
      "Nếu gói chưa kích hoạt hoặc chưa phát sinh sử dụng, bạn có thể gửi yêu cầu để được kiểm tra điều kiện hoàn theo chính sách hiện hành.",
    questionEn: "Can I get a refund if I have not used the plan?",
    answerEn:
      "If the plan has not been activated or used, you can submit a request and our team will review refund eligibility under the current policy.",
  },
];

export default function FAQSection() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const text = {
    heading: language === "vi" ? "Câu hỏi thường gặp" : "Frequently asked questions",
    subtitle:
      language === "vi"
        ? "Danh sách câu hỏi nhanh trước khi mua eSIM. Chọn câu hỏi để xem câu trả lời chi tiết."
        : "Quick answers before you buy your travel eSIM. Select a question to view details.",
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#F6FAFF]">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="mb-7 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">{text.heading}</h2>
          <p className="text-gray-500 mt-2 max-w-3xl">{text.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {FAQ_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const question = language === "vi" ? item.questionVi : item.questionEn;
            const answer = language === "vi" ? item.answerVi : item.answerEn;

            return (
              <div key={item.questionVi} className="border-b border-slate-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current === index ? current : index))}
                  className="w-full flex items-center justify-between gap-3 px-4 md:px-6 py-4 text-left bg-white text-slate-800 hover:bg-slate-50/70 transition"
                >
                  <span className="text-sm md:text-base font-semibold">{question}</span>
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
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
