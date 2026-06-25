"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_LENGTH = 6;

const cellClassName =
  "w-11 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-xl font-bold rounded-lg border-2 transition select-none";

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

function isDigitKey(e: React.KeyboardEvent<HTMLInputElement>): string | null {
  if (e.key.length === 1 && /\d/.test(e.key)) {
    return e.key;
  }

  const numpadMatch = e.code.match(/^Numpad([0-9])$/);
  if (numpadMatch) {
    return numpadMatch[1];
  }

  return null;
}

export default function OtpInput({
  value,
  onChange,
  length = DEFAULT_LENGTH,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const normalizedValue = normalizeOtp(value, length);
  const activeIndex = Math.min(normalizedValue.length, length - 1);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const focusInput = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const applyValue = useCallback(
    (raw: string) => {
      onChange(normalizeOtp(raw, length));
    },
    [length, onChange]
  );

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    applyValue(e.clipboardData.getData("text"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    applyValue(e.target.value);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    applyValue(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    const digit = isDigitKey(e);
    if (digit) {
      e.preventDefault();
      if (normalizedValue.length < length) {
        applyValue(normalizedValue + digit);
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      applyValue(normalizedValue.slice(0, -1));
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      applyValue(normalizedValue.slice(0, -1));
    }
  };

  return (
    <div
      className="relative inline-flex items-center justify-center gap-2 sm:gap-3"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        lang="en"
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={length}
        value={normalizedValue}
        disabled={disabled}
        aria-label="Mã OTP"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 [caret-color:transparent]"
        style={{ fontSize: "16px", imeMode: "disabled" } as React.CSSProperties}
        onChange={handleChange}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />

      {Array.from({ length }).map((_, index) => {
        const isActive = !disabled && index === activeIndex;
        const hasValue = Boolean(normalizedValue[index]);

        return (
          <div
            key={index}
            aria-hidden
            className={`${cellClassName} ${
              isActive
                ? "border-primary ring-2 ring-primary/20"
                : hasValue
                  ? "border-primary/40 bg-primary-light/20"
                  : "border-gray-200 bg-white"
            } ${disabled ? "bg-gray-50" : ""}`}
          >
            {normalizedValue[index] || ""}
          </div>
        );
      })}
    </div>
  );
}
