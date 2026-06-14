"use client";

import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/ui/Icon";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function ChangePasswordForm() {
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.isSuccess === false) {
        toast.error(json.error ?? json.message ?? "Đổi mật khẩu thất bại. Vui lòng thử lại.");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setExpanded(false);
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 md:px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition"
      >
        <div className="text-left">
          <h3 className="font-bold text-navy text-base">Đổi mật khẩu</h3>
          <p className="text-xs text-gray-400 mt-0.5">Cập nhật mật khẩu đăng nhập</p>
        </div>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-btn flex-shrink-0">
          <Icon icon={expanded ? "chevron-up" : "lock"} className="text-white text-xs" />
        </div>
      </button>

      {expanded && (
      <form onSubmit={handleSubmit} noValidate className="p-6 md:p-8 pt-0 space-y-5 border-t border-gray-100">
        {/* Current password */}
        <div>
          <label htmlFor="cp-current" className="block text-sm font-semibold text-navy mb-1.5">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="lock" className="text-sm" />
            </span>
            <input
              id="cp-current"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="input pl-10 pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
            >
              <Icon icon={showCurrent ? "eye-slash" : "eye"} className="text-sm" />
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label htmlFor="cp-new" className="block text-sm font-semibold text-navy mb-1.5">
            Mật khẩu mới
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="key" className="text-sm" />
            </span>
            <input
              id="cp-new"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              disabled={loading}
              className="input pl-10 pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
            >
              <Icon icon={showNew ? "eye-slash" : "eye"} className="text-sm" />
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div>
          <label htmlFor="cp-confirm" className="block text-sm font-semibold text-navy mb-1.5">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="key" className="text-sm" />
            </span>
            <input
              id="cp-confirm"
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
              className="input pl-10 pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
