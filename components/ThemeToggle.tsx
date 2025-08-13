"use client";

import React from "react";
import { useTheme } from "next-themes";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggle = () => {
    if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={`relative inline-flex items-center  h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
        currentTheme === "dark" ? "bg-[#222222]" : "bg-[#b9a4a4]"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 transform transition-transform duration-200 ease-in-out ${
          currentTheme === "dark" ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {currentTheme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default ThemeToggle;
