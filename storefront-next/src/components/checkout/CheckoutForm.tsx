"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { checkoutSchema, CheckoutFormData } from "@/lib/schemas/checkoutSchema";
import { createOrder, mapFormDataToPayload, OrderApiError, OrderItem } from "@/lib/orderApi";
import { useCartStore } from "@/lib/cartStore";
import { formatPrice } from "@/lib/product";

import ShippingInfoForm from "./ShippingInfoForm";
import PaymentMethod from "./PaymentMethod";
import OrderReview from "./OrderReview";

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      ward: "",
      addressDetail: "",
      orderNote: "",
      paymentMethod: "cod",
    },
    mode: "onBlur",
  });

  const selectedPaymentMethod = watch("paymentMethod");

  // Cleanup: Reset form if items become empty
  useEffect(() => {
    if (items.length === 0) {
      reset();
    }
  }, [items.length, reset]);

  const onSubmit = useCallback(
    async (formData: CheckoutFormData) => {
      if (isSubmitting) return;

      if (items.length === 0) {
        toast.error("Giỏ hàng trống. Vui lòng thêm sản phẩm trước.");
        router.push("/");
        return;
      }

      setIsSubmitting(true);

      const orderItems: OrderItem[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const payload = mapFormDataToPayload(formData, orderItems, getTotalAmount());

      try {
        const result = await createOrder(payload);

        if (result.success) {
          toast.success(result.message || "Đặt hàng thành công!");
          const total = getTotalAmount();
          const params = new URLSearchParams({
            orderId: result.orderId ?? "",
            total: total.toString(),
            paymentMethod: formData.paymentMethod,
          });
          // Navigate BEFORE clearCart to prevent checkout page
          // from re-rendering with empty cart and overriding this redirect
          router.push(`/order-success?${params.toString()}`);
          clearCart();
        } else {
          toast.error(result.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        if (error instanceof OrderApiError) {
          if (error.statusCode === 408) {
            toast.error("Yêu cầu bị timeout. Vui lòng thử lại.");
          } else if (error.statusCode >= 500) {
            toast.error("Server đang gặp sự cố. Vui lòng thử lại sau.");
          } else {
            toast.error(error.message);
          }
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, items, getTotalAmount, clearCart, router]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
              1
            </div>
            <span>Thông tin giao hàng</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              2
            </div>
            <span>Thanh toán</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              3
            </div>
            <span>Xác nhận</span>
          </div>
        </div>
        <div className="mt-2 h-1 bg-gray-200 rounded-full">
          <div className="h-1 bg-primary rounded-full w-1/3 transition-all" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info Section */}
          <section className="bg-white rounded-xl p-6 shadow-card">
            <ShippingInfoForm
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </section>

          {/* Payment Method Section */}
          <section className="bg-white rounded-xl p-6 shadow-card">
            <PaymentMethod
              register={register}
              errors={errors}
              selectedMethod={selectedPaymentMethod}
            />
          </section>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <OrderReview items={items} shippingFee={0} />

            {/* Total Summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-navy">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(getTotalAmount())}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-white transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-btn"
                }`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Đang xử lý...</span>
                  </span>
                ) : (
                  `Đặt hàng ${selectedPaymentMethod === "cod" ? "(COD)" : "(Chuyển khoản)"}`
                )}
              </button>

              {/* Back to cart link */}
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-primary transition text-center"
              >
                ← Quay lại giỏ hàng
              </button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}