import { z } from "zod";

import { UserTypeEnum } from "../enums/auth.enum";
import { User } from "lucide-react";

// Base user schema
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum([
    UserTypeEnum.STUDENT,
    UserTypeEnum.AGENT,
    UserTypeEnum.ADMIN,
    UserTypeEnum.PENDING_AGENT,
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
  role: z.enum([
    UserTypeEnum.STUDENT,
    UserTypeEnum.AGENT,
    UserTypeEnum.ADMIN,
    UserTypeEnum.PENDING_AGENT,
    UserTypeEnum.SELECTED_AGENT,
  ]),
});

// Login response schema
export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

// Register request schema
export const createUserRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .email("Invalid email address")
    .min(1, "Email is required"),
  role: z.enum([
    UserTypeEnum.STUDENT,
    UserTypeEnum.AGENT,
    UserTypeEnum.ADMIN,
    UserTypeEnum.PENDING_AGENT,
    UserTypeEnum.SELECTED_AGENT,
  ]),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
});

// Register response schema
export const registerResponseSchema = z.object({
  token: z.string(),
  user: userSchema.extend({
    phone: z.string().optional(),
    organization: z.string().optional(),
  }),
});

export const signUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum([
    UserTypeEnum.STUDENT,
    UserTypeEnum.AGENT,
    UserTypeEnum.ADMIN,
    UserTypeEnum.PENDING_AGENT,
    UserTypeEnum.SELECTED_AGENT,
  ]).optional(),
});

export const createUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const signUpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  accessToken: z.string().nullable(),
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Type exports
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>;
export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>;
export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>;
export type AuthRequestDto = z.infer<typeof loginRequestSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;