"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { usePathname, useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Navbar: React.FC = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getChatroomById = useChatStore((state) => state.getChatroomById);

  const isChatPage = pathname.includes("/dashboard/chat/");
  const chatId = Array.isArray(params.id) ? params.id[0] : params.id;
  const chatroom = isChatPage && chatId ? getChatroomById(chatId) : null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 border-b border-theme bg-[var(--background)]">
      <div className="flex items-center space-x-4">
        {isChatPage ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[var(--foreground)] md:hidden"
            >
              <ArrowBackIcon />
            </button>
            <h1 className="font-semibold text-[var(--foreground)]">
              {chatroom?.title || "Chat"}
            </h1>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="font-semibold text-[var(--foreground)]"
          >
            Gemini
          </Link>
        )}
      </div>
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="focus:outline-none">
          <FormatListBulletedIcon />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-33 bg-[#e9e3e3] rounded-md shadow-lg py-3 z-10 px-2">

            <div className="pb-3 flex justify-between">

              <h1 className="text-black">Theme</h1> <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="block text-white w-full text-center py-2 bg-red-500 text-sm rounded-md "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
