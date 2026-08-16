import Link from "next/link";
import { getGallery } from "@/lib/api";

export const metadata = { title: "Thư viện — 2IN.CORNER" };

const STYLES = ["French", "Ombre", "Art"];

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ style?: string }> }) {
  const { style } = await searchParams;
  const items = await getGallery(style).catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-800">Thư viện cảm hứng</h1>
      <p className="mt-2 text-zinc-500">Tham khảo các mẫu nail được yêu thích tại 2IN.CORNER.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/gallery"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !style ? "bg-rose-600 text-white" : "border border-rose-200 text-zinc-600 hover:bg-rose-50"
          }`}
        >
          Tất cả
        </Link>
        {STYLES.map((s) => (
          <Link
            key={s}
            href={`/gallery?style=${encodeURIComponent(s)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              style === s ? "bg-rose-600 text-white" : "border border-rose-200 text-zinc-600 hover:bg-rose-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-zinc-500">Chưa có ảnh nào trong thư viện.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL from the catalog */}
              <img src={item.imageUrl} alt={item.title ?? "Mẫu nail"} className="aspect-square w-full object-cover" />
              {item.title && <figcaption className="p-3 text-sm text-zinc-600">{item.title}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
