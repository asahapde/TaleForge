"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`smallcaps py-1 border-b transition-colors ${
        active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5 sm:gap-8">
        <Link href="/" className="font-display text-[1.75rem] leading-none tracking-tight">
          Tale<span className="italic text-accent">forge</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink href="/stories">Library</NavLink>
          <NavLink href="/write">Write</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <NavLink href="/desk">Your desk</NavLink>
              <button onClick={logout} className="btn btn-quiet ml-3 hidden sm:inline-flex">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-quiet">
                Sign in
              </Link>
              <Link href="/auth/register" className="btn btn-outline hidden sm:inline-flex">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
