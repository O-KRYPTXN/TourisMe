import { z } from 'zod';

// Email validation
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address');

// Password validation
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Phone validation
export const phoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Invalid phone number format');

// Name validation
export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Login schema
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Signup schema
export const signupSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// Profile update schema
export const profileUpdateSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema,
});

// Password change schema
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

// Contact form schema
export const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Booking schema
export const bookingSchema = z.object({
    adults: z.number().min(1, 'At least 1 adult is required').max(20),
    children: z.number().min(0).max(20),
    date: z.date(),
    specialRequests: z.string().optional(),
});

// Search schema
export const searchSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
});
