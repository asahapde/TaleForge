"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/90 border-b border-gray-100 shadow-none sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo and links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold text-indigo-700 tracking-tight select-none"
            >
              TaleForge
            </Link>
            <div className="hidden sm:flex gap-2">
              <Link
                href="/stories"
                className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                  isActive("/stories")
                    ? "text-indigo-700 underline underline-offset-4"
                    : "text-gray-600 hover:text-indigo-700 hover:underline hover:underline-offset-4"
                }`}
              >
                Explore
              </Link>
              {user && (
                <Link
                  href="/stories/my"
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                    isActive("/stories/my")
                      ? "text-indigo-700 underline underline-offset-4"
                      : "text-gray-600 hover:text-indigo-700 hover:underline hover:underline-offset-4"
                  }`}
                >
                  My Stories
                </Link>
              )}
            </div>
          </div>
          {/* Center: Create button (desktop only) */}
          <div className="hidden sm:flex flex-1 justify-center">
            <Link
              href="/stories/create"
              aria-label="Create a new story"
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-none hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all duration-150 ${
                isActive("/stories/create")
                  ? "ring-2 ring-indigo-400 ring-offset-2"
                  : ""
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="sr-only sm:not-sr-only">Create</span>
            </Link>
          </div>
          {/* Right: User actions (desktop only) */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 select-none">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:text-red-600 hover:border-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded transition-colors duration-150"
                  aria-label="Logout"
                >
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {/* Hamburger for mobile (always visible on mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-indigo-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-150"
            aria-label="Open main menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link
              href="/stories/create"
              aria-label="Create a new story"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold text-base shadow-none hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all duration-150"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create
            </Link>
            <Link
              href="/stories"
              className={`px-2 py-1 rounded text-base font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                isActive("/stories")
                  ? "text-indigo-700 underline underline-offset-4"
                  : "text-gray-600 hover:text-indigo-700 hover:underline hover:underline-offset-4"
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link
                href="/stories/my"
                className={`px-2 py-1 rounded text-base font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                  isActive("/stories/my")
                    ? "text-indigo-700 underline underline-offset-4"
                    : "text-gray-600 hover:text-indigo-700 hover:underline hover:underline-offset-4"
                }`}
              >
                My Stories
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-6 w-11/12 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 font-semibold text-base shadow-none hover:text-red-600 hover:border-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition-all duration-150"
                aria-label="Logout"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
