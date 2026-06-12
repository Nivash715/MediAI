import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const otpLoginSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  otp:    z.string().length(6, 'OTP must be 6 digits'),
})

export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email'),
  mobile:   z.string().regex(/^[6-9]\d{9}$/, 'Enter valid mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail'),
})
