import { getStaff } from "@/lib/api";

export const metadata = { title: "Thợ nail — 2IN.CORNER" };

export default async function StaffPage() {
  const staff = await getStaff().catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-800">Thợ nail</h1>
      <p className="mt-2 text-zinc-500">Đội ngũ thợ giàu kinh nghiệm, sẵn sàng phục vụ bạn.</p>

      {staff.length === 0 ? (
        <p className="mt-8 text-zinc-500">Chưa có thông tin thợ nail.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <div key={s.id} className="rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm">
              {s.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL from the catalog
                <img src={s.avatarUrl} alt={s.fullName} className="mx-auto h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-2xl font-semibold text-rose-600">
                  {s.fullName.charAt(0)}
                </div>
              )}
              <h3 className="mt-4 font-semibold text-zinc-800">{s.fullName}</h3>
              {s.specialty && <p className="text-sm text-rose-600">{s.specialty}</p>}
              {s.bio && <p className="mt-2 text-sm text-zinc-500">{s.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
