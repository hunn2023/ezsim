"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { CheckoutFormData } from "@/lib/schemas/checkoutSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCreditCard, faQrcode, faUniversity } from "@fortawesome/free-solid-svg-icons";
import type { Language } from "@/lib/i18n";
import { toast } from "sonner";

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  selectedMethod: "banking";
  language?: Language;
  showDetails?: boolean;
  amount?: number;
}

function formatAmount(amount: number) {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

export default function PaymentMethod({ register, selectedMethod, language = "vi", showDetails = true, amount = 0 }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(600);

  const text = {
    title: language === "vi" ? "Phương thức thanh toán" : "Payment method",
    paymentPageTitle: language === "vi" ? "Thanh toán" : "Payment",
    bankTitle: language === "vi" ? "Chuyển khoản ngân hàng (Quét mã QR)" : "Bank transfer (QR code)",
    bankDesc:
      language === "vi"
        ? "Vui lòng quét mã QR và hoàn tất chuyển khoản để xử lý đơn hàng"
        : "Please scan the QR code and complete transfer to process your order",
    transferInfo: language === "vi" ? "Thông tin chuyển khoản:" : "Bank transfer details:",
    bank: language === "vi" ? "Ngân hàng" : "Bank",
    accountNumber: language === "vi" ? "Số TK" : "Account No.",
    accountName: language === "vi" ? "Chủ TK" : "Account name",
    amount: language === "vi" ? "Số tiền" : "Amount",
    qrPlaceholder: language === "vi" ? "Mã QR thanh toán" : "Payment QR code",
    maxTime: language === "vi" ? "Thời gian thanh toán tối đa" : "Maximum payment time",
    expired: language === "vi" ? "Đã hết thời gian thanh toán. Vui lòng tạo lại giao dịch." : "Payment time expired. Please create a new transaction.",
    copied: language === "vi" ? "Đã sao chép" : "Copied",
    copyFailed: language === "vi" ? "Không thể sao chép" : "Failed to copy",
    copyAction: language === "vi" ? "Sao chép" : "Copy",
    transferNote:
      language === "vi"
        ? "Sau khi chuyển khoản, hệ thống sẽ xác nhận tự động. Nếu cần hỗ trợ, vui lòng liên hệ CSKH."
        : "After transfer, the system will auto-verify. If needed, please contact customer support.",
  };

  useEffect(() => {
    if (!showDetails) return;

    setSecondsLeft(600);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [showDetails]);

  const countdownText = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(text.copied);
    } catch {
      toast.error(text.copyFailed);
    }
  };

  const accountName = "CONG TY EZSIM VIET NAM";
  const accountNumber = "1234567890";
  const amountText = formatAmount(amount);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy">{showDetails ? text.paymentPageTitle : text.title}</h3>

      <input {...register("paymentMethod")} type="hidden" value="banking" />

      <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy">{text.bankTitle}</p>
            <p className="text-sm text-gray-600 mt-1">{text.bankDesc}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-white">
            {selectedMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
          <div className="md:col-span-2 rounded-lg border border-dashed border-primary/40 bg-white p-5 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-[300px] h-[300px] max-w-full rounded-2xl border border-primary/20 bg-primary-light/30 flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faQrcode} className="text-8xl text-primary mb-3" />
              <p className="text-sm text-gray-500">{text.qrPlaceholder}</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-gray-400">
              <FontAwesomeIcon icon={faUniversity} />
              <span>Vietcombank</span>
            </div>
          </div>

          <div className="md:col-span-1">
            <p className="font-medium text-navy mb-2">{text.transferInfo}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span>{text.bank}: <span className="font-semibold">Vietcombank</span></span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span>{text.accountNumber}: <span className="font-semibold">{accountNumber}</span></span>
                <button
                  type="button"
                  title={text.copyAction}
                  aria-label={`${text.copyAction} ${text.accountNumber}`}
                  onClick={() => copyValue(accountNumber)}
                  className="text-primary text-sm font-semibold inline-flex items-center hover:opacity-80"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span>{text.accountName}: <span className="font-semibold">{accountName}</span></span>
                <button
                  type="button"
                  title={text.copyAction}
                  aria-label={`${text.copyAction} ${text.accountName}`}
                  onClick={() => copyValue(accountName)}
                  className="text-primary text-sm font-semibold inline-flex items-center hover:opacity-80"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span>{text.amount}: <span className="font-semibold text-primary">{amountText}</span></span>
                <button
                  type="button"
                  title={text.copyAction}
                  aria-label={`${text.copyAction} ${text.amount}`}
                  onClick={() => copyValue(amount.toString())}
                  className="text-primary text-sm font-semibold inline-flex items-center hover:opacity-80"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-primary/20 bg-white px-3 py-2">
              <p className="text-xs text-gray-500">{text.maxTime}</p>
              <p className={`text-sm font-bold ${secondsLeft === 0 ? "text-danger" : "text-primary"}`}>
                {secondsLeft === 0 ? text.expired : countdownText}
              </p>
            </div>

            <p className="mt-2 text-xs">{text.transferNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}