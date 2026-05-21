"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormData } from "@/lib/schemas/checkoutSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faCreditCard } from "@fortawesome/free-solid-svg-icons";

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  selectedMethod: "cod" | "banking";
}

export default function PaymentMethod({ register, errors, selectedMethod }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy">Phương thức thanh toán</h3>

      <div className="space-y-3">
        {/* COD Option */}
        <label
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
            selectedMethod === "cod"
              ? "border-primary bg-primary-light"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            {...register("paymentMethod")}
            type="radio"
            value="cod"
            className="sr-only"
          />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedMethod === "cod" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <FontAwesomeIcon icon={faTruck} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy">Thanh toán khi nhận hàng (COD)</p>
            <p className="text-sm text-gray-500">
              Thanh toán bằng tiền mặt khi nhận hàng tại nhà
            </p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === "cod"
                ? "border-primary bg-primary"
                : "border-gray-300"
            }`}
          >
            {selectedMethod === "cod" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            )}
          </div>
        </label>

        {/* Banking Option */}
        <label
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
            selectedMethod === "banking"
              ? "border-primary bg-primary-light"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            {...register("paymentMethod")}
            type="radio"
            value="banking"
            className="sr-only"
          />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedMethod === "banking" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy">Chuyển khoản ngân hàng</p>
            <p className="text-sm text-gray-500">
              Thanh toán qua chuyển khoản trước khi giao hàng
            </p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === "banking"
                ? "border-primary bg-primary"
                : "border-gray-300"
            }`}
          >
            {selectedMethod === "banking" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            )}
          </div>
        </label>
      </div>

      {errors.paymentMethod && (
        <p className="text-danger text-sm">{errors.paymentMethod.message}</p>
      )}

      {/* Banking info note */}
      {selectedMethod === "banking" && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
          <p className="font-medium text-navy mb-2">Thông tin chuyển khoản:</p>
          <p>
            Ngân hàng: <span className="font-semibold">Vietcombank</span>
            <br />
            Số TK: <span className="font-semibold">1234567890</span>
            <br />
            Chủ TK: <span className="font-semibold">CÔNG TY EZSIM VIỆT NAM</span>
          </p>
          <p className="mt-2 text-xs">
            Sau khi chuyển khoản, vui lòng gửi ảnh chụp màn hình xác nhận qua Zalo/SMS để được xử lý nhanh.
          </p>
        </div>
      )}
    </div>
  );
}