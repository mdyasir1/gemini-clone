import { z } from 'zod';

export type User = {
  id: string;
  email: string;
  countryCode: string;
};

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'ai';
  image?: string | null;
};

export type Chatroom = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits long"),
});

export const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Please enter a valid number"),
});

export type OtpFormData = z.infer<typeof otpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// utils/types.ts
export type Country = {
  name: string;
  code: string;
  cca2: string;
};

export interface RawCountry {
  name: { common: string };
  cca2: string;
  idd: { root: string; suffixes?: string[] };
}