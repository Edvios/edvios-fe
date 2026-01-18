import { z } from "zod";

// User type enum
export const UserType = {
  STUDENT: "student",
  AGENT: "agent",
  SUPERADMIN: "super-admin",

} as const;

// Base user schema
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  userType: z.enum([
    UserType.STUDENT,
    UserType.AGENT,
    UserType.SUPERADMIN,
  ]),
});

// Login request schema
export const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  userType: z.enum([
    UserType.STUDENT,
    UserType.AGENT,
    UserType.SUPERADMIN,
  ]),
});

// Login response schema
export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

// Register request schema
export const registerRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  userType: z.enum([
    UserType.STUDENT,
    UserType.AGENT,
    UserType.SUPERADMIN,
  ]),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  organization: z
    .string()
    .max(100, "Organization name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Register response schema
export const registerResponseSchema = z.object({
  token: z.string(),
  user: userSchema.extend({
    phone: z.string().optional(),
    organization: z.string().optional(),
  }),
});

// Type exports
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;
export type UserDto = z.infer<typeof userSchema>;