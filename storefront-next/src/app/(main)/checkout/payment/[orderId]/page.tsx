"use client";

import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/lib/cartStore";
import {
  createPaymentQr,
  getPaymentStatus,
  isPaymentPaid,
  OrderApiError,
  PaymentQrData,
} from "@/lib/orderApi";
import { paymentFlowError, paymentFlowLog } from "@/lib/paymentFlowLog";
import { formatPrice } from "@/lib/product";

interface PaymentPageProps {
  params: { orderId: string };
}

type PaymentPaidEvent = {
  orderId?: string;
  OrderId?: string;
  paymentId?: string;
  orderCode?: string;
  status?: string;
  paidAt?: string;
};

type PaymentSuccessSource = "signalr" | "poll";

const REDIRECT_DELAY_MS = 1500;
const PAYMENT_POLL_INTERVAL_MS = 4000;
const SIGNALR_START_RETRIES = 4;

function getQrImageUrl(data: PaymentQrData | null): string {
  if (!data) return "";
  return data.qrCodeUrl || data.qrDataUrl || data.qrCode || data.qrUrl || data.qrImageUrl || "";
}

function getEventOrderId(data: PaymentPaidEvent): string | undefined {
  return data.orderId || data.OrderId;
}

function getConnectionSnapshot(connection: HubConnection | null) {
  if (!connection) {
    return { state: "none", connectionId: null };
  }

  return {
    state: HubConnectionState[connection.state] ?? connection.state,
    connectionId: connection.connectionId ?? null,
  };
}

async function startConnectionWithRetry(
  connection: HubConnection,
  sessionId: number,
  retries = SIGNALR_START_RETRIES
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    paymentFlowLog("signalr.start.attempt", {
      sessionId,
      attempt: attempt + 1,
      maxRetries: retries,
      ...getConnectionSnapshot(connection),
    });

    try {
      await connection.start();
      paymentFlowLog("signalr.start.success", {
        sessionId,
        attempt: attempt + 1,
        ...getConnectionSnapshot(connection),
      });
      return;
    } catch (error) {
      lastError = error;
      paymentFlowError("signalr.start.failed", error, {
        sessionId,
        attempt: attempt + 1,
        maxRetries: retries,
        ...getConnectionSnapshot(connection),
      });

      if (attempt < retries - 1) {
        const delayMs = 400 * (attempt + 1);
        paymentFlowLog("signalr.start.retry_scheduled", {
          sessionId,
          nextAttempt: attempt + 2,
          delayMs,
        });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const orderId = params.orderId;
  const clearCart = useCartStore((state) => state.clearCart);
  const connectionRef = useRef<HubConnection | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentHandledRef = useRef(false);
  const realtimeSessionRef = useRef(0);
  const pollCountRef = useRef(0);

  const [qrData, setQrData] = useState<PaymentQrData | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [qrError, setQrError] = useState("");
  const [realtimeWarning, setRealtimeWarning] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handlePaymentSuccess = useCallback((source: PaymentSuccessSource) => {
    if (paymentHandledRef.current) {
      paymentFlowLog("payment.success.skipped_already_handled", { orderId, source });
      return;
    }

    paymentHandledRef.current = true;
    paymentFlowLog("payment.success", {
      orderId,
      source,
      redirectDelayMs: REDIRECT_DELAY_MS,
      redirectTo: `/account/orders/${orderId}`,
    });

    setRealtimeWarning("");
    setShowSuccessPopup(true);
    clearCart();

    redirectTimerRef.current = setTimeout(() => {
      paymentFlowLog("payment.redirect", { orderId, source });
      router.push(`/account/orders/${orderId}`);
    }, REDIRECT_DELAY_MS);
  }, [clearCart, orderId, router]);

  const loadPaymentQr = useCallback(async () => {
    paymentFlowLog("qr.load.start", { orderId });
    setIsLoadingQr(true);
    setQrError("");

    try {
      const data = await createPaymentQr(orderId);
      paymentFlowLog("qr.load.success", {
        orderId,
        hasQrImage: Boolean(getQrImageUrl(data)),
        amount: data.amount ?? null,
        bankName: data.bankName ?? null,
        accountNumber: data.accountNumber ?? null,
        transferContent: data.content || data.description || null,
      });
      setQrData(data);
    } catch (error) {
      paymentFlowError("qr.load.failed", error, { orderId });
      setQrError(
        error instanceof OrderApiError
          ? error.message
          : "Không thể tạo mã QR thanh toán. Vui lòng thử lại."
      );
    } finally {
      setIsLoadingQr(false);
    }
  }, [orderId]);

  useEffect(() => {
    paymentFlowLog("page.mount", {
      orderId,
      apiUrl: process.env.NEXT_PUBLIC_API_URL ?? null,
      origin: typeof window !== "undefined" ? window.location.origin : null,
    });
    void loadPaymentQr();
  }, [loadPaymentQr, orderId]);

  useEffect(() => {
    paymentHandledRef.current = false;
    pollCountRef.current = 0;
    const sessionId = ++realtimeSessionRef.current;

    paymentFlowLog("realtime.session.start", {
      sessionId,
      orderId,
      pollIntervalMs: PAYMENT_POLL_INTERVAL_MS,
      signalrRetries: SIGNALR_START_RETRIES,
    });

    let cancelled = false;

    const pollPaymentStatus = async () => {
      if (cancelled || paymentHandledRef.current) {
        paymentFlowLog("poll.skipped", {
          sessionId,
          orderId,
          cancelled,
          paymentHandled: paymentHandledRef.current,
        });
        return;
      }

      const pollNo = ++pollCountRef.current;
      paymentFlowLog("poll.start", { sessionId, orderId, pollNo });

      try {
        const status = await getPaymentStatus(orderId);
        const paid = isPaymentPaid(status);

        paymentFlowLog("poll.result", {
          sessionId,
          orderId,
          pollNo,
          paid,
          status,
        });

        if (paid) {
          handlePaymentSuccess("poll");
        }
      } catch (error) {
        paymentFlowError("poll.failed", error, { sessionId, orderId, pollNo });
      }
    };

    const pollInterval = window.setInterval(() => {
      void pollPaymentStatus();
    }, PAYMENT_POLL_INTERVAL_MS);

    void pollPaymentStatus();

    const connectSignalR = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        paymentFlowLog("signalr.config.missing_api_url", { sessionId, orderId }, "warn");
        setRealtimeWarning("Thiếu cấu hình API. Hệ thống vẫn đang kiểm tra thanh toán định kỳ.");
        return;
      }

      const hubUrl = `${apiUrl}/hubs/payment`;
      paymentFlowLog("signalr.init", {
        sessionId,
        orderId,
        hubUrl,
        withCredentials: true,
      });

      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connectionRef.current = connection;

      connection.on("PaymentPaid", (data: PaymentPaidEvent) => {
        const eventOrderId = getEventOrderId(data);
        paymentFlowLog("signalr.event.PaymentPaid", {
          sessionId,
          orderId,
          eventOrderId: eventOrderId ?? null,
          payload: data,
          orderIdMatched: Boolean(
            eventOrderId && eventOrderId.toLowerCase() === orderId.toLowerCase()
          ),
        });

        if (!eventOrderId || eventOrderId.toLowerCase() !== orderId.toLowerCase()) {
          paymentFlowLog("signalr.event.PaymentPaid.ignored_order_mismatch", {
            sessionId,
            expectedOrderId: orderId,
            eventOrderId,
          }, "warn");
          return;
        }

        handlePaymentSuccess("signalr");
      });

      connection.on("PaymentFailed", (data) => {
        paymentFlowLog("signalr.event.PaymentFailed", {
          sessionId,
          orderId,
          payload: data,
        }, "warn");
      });

      connection.onreconnecting((error) => {
        paymentFlowLog("signalr.reconnecting", {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
          error: error ? String(error) : null,
        }, "warn");
      });

      connection.onreconnected(async () => {
        paymentFlowLog("signalr.reconnected", {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
        });

        if (cancelled || sessionId !== realtimeSessionRef.current) {
          paymentFlowLog("signalr.reconnected.skipped_stale_session", {
            sessionId,
            activeSessionId: realtimeSessionRef.current,
          }, "warn");
          return;
        }

        try {
          paymentFlowLog("signalr.rejoin_group.start", { sessionId, orderId });
          await connection.invoke("JoinOrderPaymentGroup", orderId);
          paymentFlowLog("signalr.rejoin_group.success", { sessionId, orderId });
        } catch (error) {
          paymentFlowError("signalr.rejoin_group.failed", error, { sessionId, orderId });
        }
      });

      connection.onclose((error) => {
        paymentFlowLog("signalr.closed", {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
          error: error ? String(error) : null,
        }, error ? "warn" : "info");
      });

      await startConnectionWithRetry(connection, sessionId);

      if (cancelled || sessionId !== realtimeSessionRef.current) {
        paymentFlowLog("signalr.start.aborted_stale_session", {
          sessionId,
          activeSessionId: realtimeSessionRef.current,
          cancelled,
        }, "warn");
        await connection.stop();
        return;
      }

      try {
        paymentFlowLog("signalr.join_group.start", {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
        });
        await connection.invoke("JoinOrderPaymentGroup", orderId);
        paymentFlowLog("signalr.join_group.success", {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
        });
        setRealtimeWarning("");
      } catch (error) {
        paymentFlowError("signalr.join_group.failed", error, {
          sessionId,
          orderId,
          ...getConnectionSnapshot(connection),
        });
        throw error;
      }
    };

    connectSignalR().catch((error) => {
      paymentFlowError("signalr.setup.failed", error, { sessionId, orderId });
      if (!cancelled && sessionId === realtimeSessionRef.current) {
        setRealtimeWarning(
          "Kết nối realtime chưa ổn định. Hệ thống vẫn đang kiểm tra thanh toán định kỳ."
        );
      }
    });

    return () => {
      cancelled = true;
      window.clearInterval(pollInterval);

      paymentFlowLog("realtime.session.cleanup", {
        sessionId,
        orderId,
        pollCount: pollCountRef.current,
        paymentHandled: paymentHandledRef.current,
        ...getConnectionSnapshot(connectionRef.current),
      });

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }

      const connection = connectionRef.current;
      if (!connection) return;

      if (connection.state === HubConnectionState.Connected) {
        paymentFlowLog("signalr.leave_group.start", { sessionId, orderId });
        connection.invoke("LeaveOrderPaymentGroup", orderId).catch((error) => {
          paymentFlowError("signalr.leave_group.failed", error, { sessionId, orderId });
        });
      }

      connection.stop().catch((error) => {
        paymentFlowError("signalr.stop.failed", error, { sessionId, orderId });
      });
      connectionRef.current = null;
    };
  }, [handlePaymentSuccess, orderId]);

  const qrImageUrl = getQrImageUrl(qrData);
  const transferContent = qrData?.content || qrData?.description || "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="rounded-2xl bg-white p-5 shadow-card md:p-8">
        <h1 className="text-center text-2xl font-bold text-navy">Thanh toán đơn hàng</h1>
        <p className="mt-2 break-all text-center text-sm text-gray-500">Mã đơn hàng: {orderId}</p>

        <div className="mt-6 rounded-xl border border-primary/20 bg-gray-50 p-5 text-center">
          {isLoadingQr ? (
            <div className="flex h-72 items-center justify-center text-gray-500">Đang tạo mã QR...</div>
          ) : qrError ? (
            <div className="flex h-72 flex-col items-center justify-center gap-4">
              <p className="text-danger">{qrError}</p>
              <button type="button" className="btn-primary px-5 py-2" onClick={() => void loadPaymentQr()}>
                Thử lại
              </button>
            </div>
          ) : qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt="Mã QR thanh toán"
              className="mx-auto h-72 w-72 max-w-full rounded-xl bg-white object-contain"
            />
          ) : (
            <div className="flex h-72 items-center justify-center text-danger">
              API không trả về ảnh QR hợp lệ.
            </div>
          )}

          {qrData && (
            <div className="mt-5 space-y-2 text-sm text-gray-600">
              {qrData.bankName && (
                <p>
                  Ngân hàng: <strong>{qrData.bankName}</strong>
                </p>
              )}
              {qrData.accountNumber && (
                <p>
                  Số tài khoản: <strong>{qrData.accountNumber}</strong>
                </p>
              )}
              {qrData.accountName && (
                <p>
                  Chủ tài khoản: <strong>{qrData.accountName}</strong>
                </p>
              )}
              {qrData.amount != null && (
                <p>
                  Số tiền: <strong className="text-primary">{formatPrice(qrData.amount)}</strong>
                </p>
              )}
              {transferContent && (
                <p>
                  Nội dung chuyển khoản: <strong>{transferContent}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          Quét mã QR và hoàn tất chuyển khoản. Hệ thống sẽ tự động xác nhận thanh toán.
        </p>

        {!showSuccessPopup && (
          <div className="mt-4 rounded bg-yellow-50 p-3 text-center text-sm text-yellow-700">
            Đang chờ thanh toán...
          </div>
        )}

        {realtimeWarning && (
          <p className="mt-3 text-center text-sm text-amber-600">{realtimeWarning}</p>
        )}
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-[320px] rounded-xl bg-white p-6 text-center shadow-lg">
            <div className="text-4xl">✅</div>
            <h2 className="mt-3 text-lg font-bold text-green-600">Thanh toán thành công</h2>
            <p className="mt-2 text-sm text-gray-600">Hệ thống đang chuyển bạn về trang đơn hàng.</p>
          </div>
        </div>
      )}
    </section>
  );
}
