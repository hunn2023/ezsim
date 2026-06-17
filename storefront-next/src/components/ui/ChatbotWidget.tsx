"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sendChatbotMessage } from "@/lib/api/chatbotApi";
import type { ChatbotProductSuggestion } from "@/lib/api/chatbotApi";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
  suggestions?: ChatbotProductSuggestion[];
}

const CHATBOT_SESSION_STORAGE_KEY = "ezsim_chatbot_session_id";
const CHATBOT_MESSAGES_STORAGE_KEY = "ezsim_chatbot_messages";

function getCurrentTime(): string {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatPrice(value: number, currency: string | null): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency || "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSuggestionHref(suggestion: ChatbotProductSuggestion): string {
  if (suggestion.buyUrl) return suggestion.buyUrl;
  if (suggestion.productSlug) return `/esim-du-lich/${suggestion.productSlug}`;
  return "/esim-du-lich";
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Xin chào! Mình là trợ lý AI của EZSIM. Bạn muốn tìm eSIM cho quốc gia nào, đi bao nhiêu ngày và nhu cầu data ra sao?",
    sender: "bot",
    time: getCurrentTime(),
  },
];

function SuggestionCard({
  suggestion,
  onNavigate,
}: {
  suggestion: ChatbotProductSuggestion;
  onNavigate: () => void;
}) {
  const dataLabel = suggestion.isUnlimited
    ? "Không giới hạn"
    : [suggestion.dataAmount, suggestion.dataUnit].filter(Boolean).join(" ");

  return (
    <Link
      href={getSuggestionHref(suggestion)}
      onClick={onNavigate}
      className="block rounded-lg border border-blue-100 bg-blue-50/70 p-2.5 text-left transition hover:border-primary hover:bg-blue-50"
    >
      <div className="flex items-start gap-2">
        {suggestion.flagUrl && (
          <Image
            src={suggestion.flagUrl}
            alt={suggestion.countryName || "Quốc gia"}
            width={22}
            height={16}
            className="mt-0.5 rounded-sm object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-xs font-semibold text-slate-800">
            {suggestion.packageName || suggestion.productName || "Gói eSIM phù hợp"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {dataLabel || "Data linh hoạt"} · {suggestion.validityDays} ngày
          </p>
          <p className="mt-1 text-xs font-bold text-primary">
            {formatPrice(suggestion.salePrice, suggestion.currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasLoadedStoredMessages, setHasLoadedStoredMessages] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previousPathnameRef = useRef(pathname);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      chatWindowRef.current &&
      !chatWindowRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    sessionIdRef.current = window.localStorage.getItem(CHATBOT_SESSION_STORAGE_KEY);
    const storedMessages = window.localStorage.getItem(CHATBOT_MESSAGES_STORAGE_KEY);

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages) as Message[];
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch {
        window.localStorage.removeItem(CHATBOT_MESSAGES_STORAGE_KEY);
      }
    }

    setHasLoadedStoredMessages(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredMessages) return;
    window.localStorage.setItem(CHATBOT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [hasLoadedStoredMessages, messages]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      setOpen(false);
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  const appendBotMessage = useCallback((text: string, suggestions?: ChatbotProductSuggestion[]) => {
    const botMsg: Message = {
      id: Date.now() + Math.random(),
      text,
      sender: "bot",
      time: getCurrentTime(),
      suggestions,
    };
    setMessages((prev) => [...prev, botMsg]);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user", time: getCurrentTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendChatbotMessage({
        sessionId: sessionIdRef.current,
        message: text,
      });

      if (response.sessionId) {
        sessionIdRef.current = response.sessionId;
        window.localStorage.setItem(CHATBOT_SESSION_STORAGE_KEY, response.sessionId);
      }

      appendBotMessage(
        response.message || "Mình chưa có câu trả lời phù hợp. Bạn có thể nói rõ hơn nhu cầu eSIM của mình không?",
        response.suggestions ?? undefined
      );
    } catch (error) {
      appendBotMessage(
        error instanceof Error
          ? error.message
          : "Chatbot đang bận. Vui lòng thử lại sau hoặc liên hệ Zalo/Hotline để được hỗ trợ nhanh."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/30 animate-ping [animation-duration:2.4s] [animation-delay:400ms]"
        />
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          aria-label="Mở chatbot hỗ trợ"
          className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_14px_36px_rgba(0,0,0,0.2)] active:scale-95 overflow-hidden"
        >
          <Image
            src="/logo_chatbot.jpg"
            alt="AI Chatbot"
            width={44}
            height={44}
            className="h-full w-full object-cover rounded-full"
          />
        </button>
      </div>

      {open && (
        <div
          ref={chatWindowRef}
          className="fixed right-4 bottom-20 md:right-6 md:bottom-24 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
          style={{ height: "460px" }}
        >
          <div className="gradient-primary px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              <Image
                src="/logo_chatbot.jpg"
                alt="EZSIM Bot"
                width={36}
                height={36}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">EZSIM Assistant</p>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Trực tuyến
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Đóng chat"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.suggestions.slice(0, 3).map((suggestion) => (
                        <SuggestionCard
                          key={`${suggestion.esimPackageId}-${suggestion.productVariantId}`}
                          suggestion={suggestion}
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-white/60" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-3.5 py-2.5 text-sm text-gray-500 shadow-sm">
                  Đang trả lời...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={isSending}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition bg-gray-50 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="h-9 w-9 rounded-full gradient-primary text-white flex items-center justify-center disabled:opacity-40 transition hover:scale-105 active:scale-95 flex-shrink-0"
                aria-label="Gửi tin nhắn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
