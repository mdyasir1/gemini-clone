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
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;