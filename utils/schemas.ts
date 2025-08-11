import { z } from 'zod';

export const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits long"),
});

export const newChatroomSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
});