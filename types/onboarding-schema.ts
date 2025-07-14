import { z } from "zod";

export const OnboardingSchema = z.object({
  aboutMe: z.string().optional(),
  birthdate: z.string().optional(),
  streetAddress: z.string().optional(),
  zipcode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert", "Master"]).optional(),
  onsite: z.string().optional(),
  compensation: z.string().optional(),
}); 