"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError, cancelBooking, getMyBookings, type BookingDto } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { bookingStatusLabels, formatDateTime, formatPrice } from "@/lib/format";

const CANCELLABLE: BookingDto["status"][] = ["Pending", "Confirmed"];

const STATUS_STYLES: Record<BookingDto["status"], string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-sky-100 text-sky-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-zinc-100 text-zinc-500",
  NoShow: "bg-red-100 text-red-700",
};

export default function MyBookingsPage() {
  const { token, isReady } = useAuth();
  const [bookings, setBookings] = useState<BookingDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setBookings(await getMyBookings(token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được danh sách lịch hẹn.");
    }
  }, [token]);

  useEffect(() => {
    // load() is async — its setState calls happen after an await, not synchronously in this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isReady && token) void load();
  }, [isReady, token, load]);

  async function handleCancel(id: number) {
    if (!token) return;
    setCancellingId(id);
    try {
      await cancelBooking(id, token);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không thể hủy lịch hẹn.");
    } finally {
      setCancellingId(null);
    }
  }

  if (isReady && !token) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-800">Lịch hẹn của tôi</h1>
        <p className="mt-3 text-zinc-500">
          Vui lòng{" "}
          <Link href="/login" className="font-medium text-rose-600 hover:underline">
            đăng nhập
          </Link>{" "}
          để xem lịch hẹn của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-800">Lịch hẹn của tôi</h1>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {bookings === null ? (
        <p className="mt-8 text-zinc-500">Đang tải...</p>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-6 text-center">
          <p className="text-zinc-500">Bạn chưa có lịch hẹn nào.</p>
          <Link
            href="/book"
            className="mt-4 inline-block rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Đặt lịch ngay
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-zinc-800">{formatDateTime(booking.startTime)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                  {bookingStatusLabels[booking.status]}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-600">
                {booking.items.map((item) => (
                  <li key={item.serviceId} className="flex justify-between">
                    <span>{item.serviceName}</span>
                    <span>{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rose-50 pt-3 text-sm">
                <span className="text-zinc-500">{booking.staffName ? `Thợ: ${booking.staffName}` : "Để tiệm sắp xếp thợ"}</span>
                <span className="font-semibold text-rose-600">{formatPrice(booking.totalPrice)}</span>
              </div>

              {booking.note && <p className="mt-2 text-sm text-zinc-500">Ghi chú: {booking.note}</p>}

              {CANCELLABLE.includes(booking.status) && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                  className="mt-4 rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {cancellingId === booking.id ? "Đang hủy..." : "Hủy lịch hẹn"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
