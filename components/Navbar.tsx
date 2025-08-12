'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    router.push('/auth/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-indigo-600"><Link href="/dashboard" className="underline">Gemini</Link></h1>

      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;