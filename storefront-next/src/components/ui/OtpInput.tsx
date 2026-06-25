"use client";

import { useCallback, useRef } from "react";

const DEFAULT_LENGTH = 6;

const inputClassName =
  "w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed [ime-mode:disabled]";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

function normalizeOtp(value: string, length: number): string {
  return value.replace(/\D/g, "").slice(0, length);
}

export default function OtpInput({
  value,
  onChange,
  length = DEFAULT_LENGTH,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const composingIndexRef = useRef<number | null>(null);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const updateDigit = useCallback(
    (index: number, rawValue: string) => {
      const digits = rawValue.replace(/\D/g, "");

      if (!digits) {
        const chars = normalizeOtp(value, length).split("");
        chars[index] = "";
        onChange(chars.join(""));
        return;
      }

      if (digits.length > 1) {
        const merged = normalizeOtp(value, length).padEnd(length, " ").split("");
        for (let offset = 0; offset < digits.length && index + offset < length; offset += 1) {
          merged[index + offset] = digits[offset];
        }
        const joined = normalizeOtp(merged.join(""), length);
        onChange(joined);
        focusInput(Math.min(index + digits.length, length - 1));
        return;
      }

      const digit = digits.slice(-1);
      const chars = normalizeOtp(value, length).padEnd(length, " ").split("");
      chars[index] = digit;
      const joined = normalizeOtp(chars.join(""), length);
      onChange(joined);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [focusInput, length, onChange, value]
  );

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;

    const current = normalizeOtp(value, length);
    if (current[index]) return;

    if (index > 0) {
      e.preventDefault();
      const chars = current.padEnd(length, " ").split("");
      chars[index - 1] = "";
      onChange(normalizeOtp(chars.join(""), length));
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = normalizeOtp(e.clipboardData.getData("text"), length);
    onChange(pasted);
    focusInput(Math.min(Math.max(pasted.length - 1, 0), length - 1));
  };

  const normalizedValue = normalizeOtp(value, length);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          lang="en"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={normalizedValue[index] || ""}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={inputClassName}
          onCompositionStart={() => {
            composingIndexRef.current = index;
          }}
          onCompositionEnd={(e) => {
            composingIndexRef.current = null;
            updateDigit(index, e.currentTarget.value);
          }}
          onChange={(e) => {
            if (composingIndexRef.current === index) return;
            updateDigit(index, e.target.value);
          }}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
        />
      ))}
    </div>
  );
}
