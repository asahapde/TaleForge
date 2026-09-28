"use client";

import { useAuth } from "@/components/auth-provider";
import { errorMessage, safeNext } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [form, setForm] = useState({ displayName: "", username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(form);
      router.push(next);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="displayName" className="field-label">
          Your name, as it appears on your work
        </label>
        <input id="displayName" maxLength={60} value={form.displayName} onChange={set("displayName")} className="field" />
      </div>
      <div>
        <label htmlFor="username" className="field-label">
          Username
        </label>
        <input
          id="username"
          required
          autoComplete="username"
          pattern="[A-Za-z0-9_]{3,30}"
          title="3 to 30 letters, numbers or underscores"
          value={form.username}
          onChange={set("username")}
          className="field"
        />
        <p className="field-hint">Letters, numbers and underscores. This is your address: /writers/username</p>
      </div>
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          className="field"
        />
        <p className="field-hint">At least 8 characters.</p>
      </div>
      {error && <p className="notice">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-ink w-full">
        {busy ? "Setting up your desk…" : "Create account"}
      </button>
      <p className="meta text-center">
        Already have one?{" "}
        <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="link text-ink">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-5xl tracking-tight">Join TaleForge</h1>
      <p className="mt-2 text-ink-soft">Reading is open to everyone. An account lets you write.</p>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
