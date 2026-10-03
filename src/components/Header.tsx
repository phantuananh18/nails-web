"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/services", label: "Dịch vụ" },
  // { href: "/staff", label: "Thợ nail" },
  { href: "/gallery", label: "Thư viện" },
  { href: "/book", label: "Đặt lịch" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isReady, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-rose-600">
          2IN.CORNER
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-rose-600" : "transition-colors hover:text-rose-600"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
          {isReady && user ? (
            <>
              <Link href="/my-bookings" className="text-zinc-600 hover:text-rose-600">
                Xin chào, {user.fullName}
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-rose-200 px-4 py-1.5 text-rose-600 transition-colors hover:bg-rose-50"
              >
                Đăng xuất
              </button>
            </>
          ) : isReady ? (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-rose-600">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-rose-600 px-4 py-1.5 text-white transition-colors hover:bg-rose-700"
              >
                Đăng ký
              </Link>
            </>
          ) : null}
        </div>

        <button className="flex flex-col gap-1.5 sm:hidden" aria-label="Mở menu" onClick={() => setMenuOpen((v) => !v)}>
          <span className="block h-0.5 w-6 bg-zinc-700" />
          <span className="block h-0.5 w-6 bg-zinc-700" />
          <span className="block h-0.5 w-6 bg-zinc-700" />
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-rose-100 px-4 py-3 text-sm font-medium text-zinc-600 sm:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-2">
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-rose-100" />
          {user ? (
            <>
              <Link href="/my-bookings" onClick={() => setMenuOpen(false)} className="py-2">
                Lịch hẹn của tôi ({user.fullName})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="py-2 text-left text-rose-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2">
                Đăng nhập
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="py-2 text-rose-600">
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
