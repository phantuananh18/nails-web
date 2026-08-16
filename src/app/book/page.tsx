import { getCategories, getStaff } from "@/lib/api";
import BookingForm from "./booking-form";

export const metadata = { title: "Đặt lịch — 2IN.CORNER" };

export default async function BookingPage() {
  const [categories, staff] = await Promise.all([getCategories().catch(() => []), getStaff().catch(() => [])]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-800">Đặt lịch</h1>
      <p className="mt-2 text-zinc-500">Chọn dịch vụ, thợ (nếu muốn) và thời gian phù hợp với bạn.</p>

      <BookingForm categories={categories} staffList={staff} />
    </div>
  );
}
