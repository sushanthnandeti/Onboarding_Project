import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .max(100, "Password is too long"),
})