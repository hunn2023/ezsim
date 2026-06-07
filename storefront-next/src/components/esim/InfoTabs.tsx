"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/useLanguage";

export default function InfoTabs() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const tabs =
    language === "vi"
      ? ["Giới thiệu", "Hướng dẫn cài đặt", "Thiết bị tương thích", "Câu hỏi thường gặp"]
      : ["Overview", "Setup guide", "Compatible devices", "FAQ"];

  const faqs =
    language === "vi"
      ? [
          {
            q: "Tôi nên cài eSIM trước hay sau khi đến Nhật?",
            a: "Bạn nên cài đặt eSIM TRƯỚC khi bay (khi còn ở Việt Nam) nhưng chưa kích hoạt. Đến Nhật, bật roaming là eSIM tự động kết nối với nhà mạng Nhật.",
          },
          {
            q: "Điện thoại tôi có dùng được eSIM không?",
            a: "iPhone từ XS trở lên, Samsung từ S20+, hầu hết Pixel, Oppo Find X3+, Xiaomi Mi 13+ đều hỗ trợ eSIM.",
          },
          {
            q: "Hết data trước hạn thì sao?",
            a: "Bạn có thể nạp thêm data trong app EZSIM với giá ưu đãi, hoặc mua 1 gói eSIM mới.",
          },
        ]
      : [
          {
            q: "Should I install eSIM before or after arriving in Japan?",
            a: "Install your eSIM before departure while connected to stable internet, but activate data on arrival. Once roaming is enabled, it will connect automatically.",
          },
          {
            q: "Is my phone compatible with eSIM?",
            a: "Most modern devices support eSIM, including iPhone XS and newer, Samsung S20+ and newer, Pixel models, and many flagship Android phones.",
          },
          {
            q: "What if I run out of data before expiry?",
            a: "You can top up in the EZSIM app at promotional rates or purchase an additional package instantly.",
          },
        ];

  const text = {
    title:
      language === "vi"
        ? "eSIM Nhật Bản - Kết nối 5G ngay khi đặt chân"
        : "Japan eSIM - 5G connectivity as soon as you arrive",
    intro:
      language === "vi"
        ? "EZSIM hợp tác trực tiếp với 2 nhà mạng lớn nhất Nhật Bản là NTT Docomo và SoftBank để mang đến trải nghiệm kết nối ổn định trên toàn lãnh thổ Nhật."
        : "EZSIM partners directly with major Japanese carriers like NTT Docomo and SoftBank to deliver stable connectivity across Japan.",
    whyTitle: language === "vi" ? "Vì sao chọn eSIM Nhật của EZSIM?" : "Why choose EZSIM Japan eSIM?",
    bullets:
      language === "vi"
        ? [
            "Kích hoạt nhanh: Quét QR là dùng được",
            "Tiết kiệm: Chỉ từ 79.000đ/gói",
            "Linh hoạt: 12 gói từ 3 đến 30 ngày",
            "Hỗ trợ Hotspot: Chia sẻ mạng cho cả nhóm",
            "Hỗ trợ tiếng Việt 24/7",
          ]
        : [
            "Fast activation: Scan QR and connect instantly",
            "Affordable: from 79,000 VND per package",
            "Flexible: 12 packages from 3 to 30 days",
            "Hotspot support: share data with your group",
            "24/7 support",
          ],
    faqTitle: language === "vi" ? "Câu hỏi thường gặp" : "Frequently asked questions",
  };

  return (
    <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`py-3 font-semibold text-sm cursor-pointer border-b-2 -mb-px transition bg-transparent ${
              activeTab === i ? "text-primary border-primary" : "text-gray-500 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-700 leading-7">
        <h3 className="text-lg font-bold mb-3">{text.title}</h3>
        <p className="mb-4">
          {text.intro}
        </p>

        <h3 className="text-lg font-bold mb-3 mt-5">{text.whyTitle}</h3>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          {text.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="text-lg font-bold mb-3 mt-5">{text.faqTitle}</h3>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl px-5 py-4 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <div className="font-semibold text-sm flex justify-between items-center">
                {faq.q}
                <Icon icon="chevron-down" className={`transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </div>
              {openFaq === i && (
                <p className="mt-3 text-[13px] text-gray-700 leading-7">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
