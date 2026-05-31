"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

const tabs = ["Giới thiệu", "Hướng dẫn cài đặt", "Thiết bị tương thích", "Câu hỏi thường gặp"];

const faqs = [
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
];

export default function InfoTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

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
        <h3 className="text-lg font-bold mb-3">eSIM Nhật Bản - Kết nối 5G ngay khi đặt chân</h3>
        <p className="mb-4">
          EZSIM hợp tác trực tiếp với 2 nhà mạng lớn nhất Nhật Bản là <b>NTT Docomo</b> và <b>SoftBank</b> để mang đến trải nghiệm kết nối ổn định trên toàn lãnh thổ Nhật.
        </p>

        <h3 className="text-lg font-bold mb-3 mt-5">Vì sao chọn eSIM Nhật của EZSIM?</h3>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li><b>Kích hoạt nhanh:</b> Quét QR là dùng được</li>
          <li><b>Tiết kiệm:</b> Chỉ từ 79.000đ/gói</li>
          <li><b>Linh hoạt:</b> 12 gói từ 3 đến 30 ngày</li>
          <li><b>Hỗ trợ Hotspot:</b> Chia sẻ mạng cho cả nhóm</li>
          <li><b>Hỗ trợ tiếng Việt 24/7</b></li>
        </ul>

        <h3 className="text-lg font-bold mb-3 mt-5">Câu hỏi thường gặp</h3>
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
