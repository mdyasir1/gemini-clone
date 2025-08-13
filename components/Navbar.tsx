"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 border-b border-theme bg-[var(--background)]">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="font-semibold text-[var(--foreground)]"
        >
          Gemini
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="py-1 px-3 rounded-md bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-bg-hover)]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
