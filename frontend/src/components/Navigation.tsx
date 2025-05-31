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
    <nav className="bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300"
              >
                TaleForge
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link
                href="/stories"
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive("/stories")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Stories
                {isActive("/stories") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transform scale-x-100 transition-transform duration-300" />
                )}
              </Link>
              {user && (
                <Link
                  href="/stories/my"
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                    isActive("/stories/my")
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  My Stories
                  {isActive("/stories/my") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transform scale-x-100 transition-transform duration-300" />
                  )}
                </Link>
              )}
              <Link
                href="/stories/create"
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive("/stories/create")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Create
                {isActive("/stories/create") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transform scale-x-100 transition-transform duration-300" />
                )}
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-100">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-1.5 transition-transform duration-300 group-hover:-translate-x-0.5"
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
                  Logout
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="group relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
                <Link
                  href="/auth/register"
                  className="group relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-full transition-all duration-300 shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
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
              ) : (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/stories"
              className={`relative block px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isActive("/stories")
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Stories
              {isActive("/stories") && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 to-indigo-500 rounded-full" />
              )}
            </Link>
            {user && (
              <Link
                href="/stories/my"
                className={`relative block px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/stories/my")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Stories
                {isActive("/stories/my") && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 to-indigo-500 rounded-full" />
                )}
              </Link>
            )}
            <Link
              href="/stories/create"
              className={`relative block px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isActive("/stories/create")
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create
              {isActive("/stories/create") && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 to-indigo-500 rounded-full" />
              )}
            </Link>
          </div>
          <div className="pt-3 pb-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-2 px-3">
                <div className="block text-sm font-medium text-gray-600 bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-100 inline-block">
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="group relative w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-1.5 transition-transform duration-300 group-hover:-translate-x-0.5"
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
                  Logout
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <Link
                  href="/auth/login"
                  className="group relative w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-full transition-all duration-300 shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
