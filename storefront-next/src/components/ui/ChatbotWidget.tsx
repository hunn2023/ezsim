"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Xin chào! 👋 Mình là trợ lý AI của EZSIM.",
    sender: "bot",
    time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  },
  {
    id: 2,
    text: "Tính năng chat AI sẽ sớm được ra mắt. Hiện tại bạn có thể liên hệ qua Zalo hoặc Hotline để được hỗ trợ nhanh nhất nhé! 🚀",
    sender: "bot",
    time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), text, sender: "user", time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock bot reply after a short delay
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: "Cảm ơn bạn đã nhắn tin! Tính năng AI chatbot đang được phát triển. Vui lòng liên hệ Zalo/Hotline để được hỗ trợ ngay nhé! 😊",
        sender: "bot",
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <>
      {/* Chat bubble button */}
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

      {/* Chat window */}
      {open && (
        <div
          ref={chatWindowRef}
          className="fixed right-4 bottom-20 md:right-6 md:bottom-24 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
          style={{ height: "460px" }}
        >
          {/* Header */}
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

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user" ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition bg-gray-50 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim()}
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
