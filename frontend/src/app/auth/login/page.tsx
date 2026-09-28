"use client";

import { useAuth } from "@/components/auth-provider";
import { errorMessage, safeNext } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(identity, password);
      router.push(next);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="login" className="field-label">
          Username or email
        </label>
        <input
          id="login"
          required
          autoComplete="username"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
      </div>
      {error && <p className="notice">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-ink w-full">
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="meta text-center">
        New here?{" "}
        <Link href={`/auth/register?next=${encodeURIComponent(next)}`} className="link text-ink">
          Make an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-5xl tracking-tight">Welcome back</h1>
      <p className="mt-2 text-ink-soft">Sign in to write, branch, and leave notes.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="meta mt-10 border-t rule pt-4 text-xs">
        Just looking around? The demo accounts (johndoe, janedoe, alexsmith, sarahjones, mikebrown) all use the
        password <code className="text-ink">password123</code>.
      </p>
    </div>
  );
}
