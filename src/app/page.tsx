import Link from "next/link";
import { getCategories, getGallery } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export default async function HomePage() {
  const [categories, gallery] = await Promise.all([getCategories().catch(() => []), getGallery().catch(() => [])]);

  const featuredServices = categories.flatMap((c) => c.services).slice(0, 6);
  const featuredGallery = gallery.filter((g) => g.isFeatured).slice(0, 4);

  return (
    <div>
      <section className="bg-linear-to-b from-rose-100 to-rose-50/40 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-rose-700 sm:text-5xl">2IN.CORNER</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
            Đặt lịch làm nail chỉ trong vài bước — chọn dịch vụ, chọn thợ yêu thích, chọn giờ phù hợp.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/book"
              className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Đặt lịch ngay
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-rose-300 px-6 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              Xem dịch vụ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-zinc-800">Dịch vụ nổi bật</h2>
          <Link href="/services" className="text-sm font-medium text-rose-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        {featuredServices.length === 0 ? (
          <p className="mt-6 text-zinc-500">Chưa có dịch vụ nào được thiết lập.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s) => (
              <div key={s.id} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-zinc-800">{s.name}</h3>
                {s.description && <p className="mt-1 text-sm text-zinc-500">{s.description}</p>}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-rose-600">{formatPrice(s.price)}</span>
                  <span className="text-zinc-400">{s.durationMinutes} phút</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {featuredGallery.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold text-zinc-800">Thư viện cảm hứng</h2>
            <Link href="/gallery" className="text-sm font-medium text-rose-600 hover:underline">
              Xem thêm
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredGallery.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs from the catalog, not a static asset
              <img
                key={g.id}
                src={g.imageUrl}
                alt={g.title ?? "Mẫu nail"}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
