import { z } from "zod";

export const OnboardingSchema = z.object({
  aboutMe: z.string().min(1, "Please tell us about yourself"),
  dob: z.string().min(1, "Please select your date of birth"),
  location: z.string().min(1, "Please enter your street address"),
  zipcode: z.string().min(1, "Please enter your zipcode"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().min(1, "Please enter your state"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert", "Master"]),
}); 