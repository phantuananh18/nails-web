import { getCategories } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Dịch vụ — 2IN.CORNER" };

export default async function ServicesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-800">Dịch vụ</h1>
      <p className="mt-2 text-zinc-500">Chọn dịch vụ phù hợp rồi đặt lịch chỉ trong vài bước.</p>

      {categories.length === 0 && <p className="mt-8 text-zinc-500">Chưa có dịch vụ nào được thiết lập.</p>}

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-xl font-semibold text-rose-700">{category.name}</h2>
            {category.description && <p className="mt-1 text-sm text-zinc-500">{category.description}</p>}

            {category.services.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-400">Chưa có dịch vụ trong nhóm này.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                    <h3 className="font-semibold text-zinc-800">{service.name}</h3>
                    {service.description && <p className="mt-1 text-sm text-zinc-500">{service.description}</p>}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-rose-600">{formatPrice(service.price)}</span>
                      <span className="text-zinc-400">{service.durationMinutes} phút</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
