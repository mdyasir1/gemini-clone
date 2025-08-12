'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/utils/types';
import { getCountryData } from '@/utils/helpers';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Country } from '@/utils/types';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    getCountryData().then(data => setCountries(data));
  }, []);

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      toast.success("OTP sent to your number!");
      const user = {
        id: "1",
        email: `user@example.com`,
        countryCode: data.countryCode,
      };
      login(user);
      router.push('/dashboard');
    }, 2000);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country Code
            </label>
            <select
              {...register('countryCode')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.cca2} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            {errors.countryCode && (
              <p className="mt-1 text-red-500 text-xs italic">
                {errors.countryCode.message}
              </p>
            )}
          </div>
          <Input
            label="Phone Number"
            type="tel"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <Button type="submit" isLoading={isSendingOtp}>
            {isSendingOtp ? "Sending OTP..." : "Login"}
          </Button>
          <p className="text-center">
            Not have an account ? <Link href="/auth/signup" className="underline">Signup</Link>
          </p>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          We&apos;ll send you a one-time password to verify your account.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;