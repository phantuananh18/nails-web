"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Field, inputClass } from "@/components/form";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ fullName, phoneNumber, password, email: email.trim() || undefined });
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng ký thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-800">Đăng ký</h1>
      <p className="mt-1 text-sm text-zinc-500">Tạo tài khoản để đặt lịch và theo dõi lịch hẹn.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Họ và tên">
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Số điện thoại">
          <input
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={inputClass}
            placeholder="09xxxxxxxx"
          />
        </Field>
        <Field label="Email (không bắt buộc)">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Mật khẩu">
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-rose-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
