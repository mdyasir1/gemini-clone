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

// Define the type for the country data fetched from the API.
// This helps to avoid the 'any' type.
interface Country {
  name: string;
  code: string;
  cca2: string;
}

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Fetch country data from the API when the component mounts.
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountryData();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch country data:', error);
        toast.error('Failed to load country codes.');
      }
    };
    fetchCountries();
  }, []);

  // Handle form submission to simulate OTP sending and user login.
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    setIsSendingOtp(true);
    // Simulate API call with a delay.
    setTimeout(() => {
      setIsSendingOtp(false);
      toast.success('OTP sent to your number!');
      const user = {
        id: '1',
        email: 'user@example.com',
        countryCode: data.countryCode,
      };
      // For this project, we'll directly log in after "sending" the OTP.
      login(user);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Create an Account
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
              {countries.map((country) => (
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
            {isSendingOtp ? 'Sending OTP...' : 'Sign up'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          We`&apos;`ll send you a one-time password to verify your account.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;