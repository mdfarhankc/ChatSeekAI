import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    email: z
        .string()
        .min(1, "Email is required!")
        .email("Please enter a valid email address"),
    full_name: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must be less than 50 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterValues = z.infer<typeof registerSchema>;