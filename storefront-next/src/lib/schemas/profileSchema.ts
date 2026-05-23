import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ (VD: 0987654321)"),
  address: z
    .string()
    .trim()
    .max(200, "Địa chỉ không được vượt quá 200 ký tự")
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
