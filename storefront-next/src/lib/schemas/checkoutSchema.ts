import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),

  phone: z
    .string()
    .regex(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ (phải là số Việt Nam)"),

  email: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  province: z
    .string()
    .min(1, "Vui lòng chọn tỉnh/thành phố"),

  district: z
    .string()
    .min(1, "Vui lòng chọn quận/huyện"),

  ward: z
    .string()
    .min(1, "Vui lòng chọn phường/xã"),

  addressDetail: z
    .string()
    .min(5, "Địa chỉ cụ thể phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được vượt quá 200 ký tự"),

  orderNote: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["cod", "banking"], {
    message: "Vui lòng chọn phương thức thanh toán",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export type PaymentMethodType = z.infer<typeof checkoutSchema.shape.paymentMethod>;