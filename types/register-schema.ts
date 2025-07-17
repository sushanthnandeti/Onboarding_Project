import * as z from "zod";


const SkillLevelEnum = z.enum(["Beginner", "Intermediate", "Advanced", "Expert", "Master"]);

export const RegisterSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
});