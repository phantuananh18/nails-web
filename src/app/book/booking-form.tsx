"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ApiError, createBooking, type ServiceCategoryDto, type StaffDto } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";
import { inputClass } from "@/components/form";

interface Props {
  categories: ServiceCategoryDto[];
  staffList: StaffDto[];
}

export default function BookingForm({ categories, staffList }: Props) {
  const { token, user, isReady } = useAuth();

  const allServices = useMemo(() => categories.flatMap((c) => c.services), [categories]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedServices = allServices.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  function toggleService(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Bạn cần đăng nhập để đặt lịch.");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }
    if (!date || !time) {
      setError("Vui lòng chọn ngày và giờ hẹn.");
      return;
    }

    const startTime = new Date(`${date}T${time}`);
    if (Number.isNaN(startTime.getTime())) {
      setError("Ngày giờ không hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking(
        {
          startTime: startTime.toISOString(),
          staffId: staffId ? Number(staffId) : undefined,
          serviceIds: selectedIds,
          note: note.trim() || undefined,
        },
        token
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đặt lịch thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <h2 className="text-lg font-semibold">Đặt lịch thành công!</h2>
        <p className="mt-1 text-sm">Chúng tôi sẽ sớm xác nhận lịch hẹn của bạn.</p>
        <Link
          href="/my-bookings"
          className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Xem lịch hẹn của tôi
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      {isReady && !user && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Bạn cần{" "}
          <Link href="/login" className="font-semibold underline">
            đăng nhập
          </Link>{" "}
          hoặc{" "}
          <Link href="/register" className="font-semibold underline">
            đăng ký
          </Link>{" "}
          trước khi đặt lịch.
        </div>
      )}

      <div>
        <h2 className="font-semibold text-zinc-800">1. Chọn dịch vụ</h2>
        <div className="mt-3 space-y-6">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-sm font-semibold text-rose-700">{category.name}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {category.services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                      selectedIds.includes(service.id) ? "border-rose-400 bg-rose-50" : "border-zinc-200 hover:border-rose-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedIds.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                    <span>
                      <span className="block font-medium text-zinc-800">{service.name}</span>
                      <span className="block text-zinc-500">
                        {formatPrice(service.price)} · {service.durationMinutes} phút
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-zinc-800">2. Chọn thợ (không bắt buộc)</h2>
        <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className={`mt-3 ${inputClass}`}>
          <option value="">Để tiệm sắp xếp</option>
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
              {s.specialty ? ` — ${s.specialty}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="font-semibold text-zinc-800">3. Chọn thời gian</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-zinc-800">4. Ghi chú (không bắt buộc)</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className={`mt-3 ${inputClass}`}
          placeholder="Ví dụ: mình muốn màu pastel..."
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white p-4">
        <div className="text-sm text-zinc-500">
          {selectedServices.length} dịch vụ · {totalMinutes} phút
        </div>
        <div className="text-lg font-semibold text-rose-600">{formatPrice(totalPrice)}</div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || (isReady && !user)}
        className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
      </button>
    </form>
  );
}
