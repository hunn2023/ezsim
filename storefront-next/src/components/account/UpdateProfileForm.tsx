"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { profileSchema, type ProfileFormData } from "@/lib/schemas/profileSchema";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-navy">
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default function UpdateProfileForm() {
  const { user } = useAuth();
  const { saveProfile, isSaving } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
    }
  }, [user?.id, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Card header */}
      <div className="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-navy text-base">Thông tin cá nhân</h3>
          <p className="text-xs text-gray-400 mt-0.5">Cập nhật hồ sơ của bạn</p>
        </div>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-btn flex-shrink-0">
          <Icon icon="pen" className="text-white text-xs" />
        </div>
      </div>

      <form onSubmit={handleSubmit(saveProfile)} noValidate className="p-6 md:p-8 space-y-6">
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="pf-name" label="Họ và tên" error={errors.name?.message}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="user" className="text-sm" />
              </span>
              <input
                id="pf-name"
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                disabled={isSaving}
                {...register("name")}
                className={`input pl-10 ${errors.name ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
            </div>
          </Field>

          <Field id="pf-phone" label="Số điện thoại" error={errors.phone?.message}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="phone" className="text-sm" />
              </span>
              <input
                id="pf-phone"
                type="tel"
                autoComplete="tel"
                placeholder="0987 654 321"
                disabled={isSaving}
                {...register("phone")}
                className={`input pl-10 ${errors.phone ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
            </div>
          </Field>
        </div>

        {/* Email — read-only */}
        <Field id="pf-email" label="Email" hint="(không thể thay đổi)">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <Icon icon="envelope" className="text-sm" />
            </span>
            <input
              id="pf-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              tabIndex={-1}
              className="input pl-10 bg-gray-50 text-gray-400 cursor-not-allowed select-none"
            />
          </div>
        </Field>

        {/* Address */}
        <Field id="pf-address" label="Địa chỉ giao hàng" error={errors.address?.message}>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
              <Icon icon="map-marker-alt" className="text-sm" />
            </span>
            <textarea
              id="pf-address"
              rows={2}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              disabled={isSaving}
              {...register("address")}
              className={`input pl-10 resize-none leading-relaxed ${errors.address ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
        </Field>

        {/* Submit row */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {!isDirty && !isSaving && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Icon icon="check-circle" className="text-success text-sm" />
              Thông tin đã được lưu
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            aria-busy={isSaving}
            className="sm:ml-auto btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <Icon icon="check-circle" className="text-sm" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
