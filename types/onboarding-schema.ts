import { z } from "zod";


const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return date <= today;
};

const isValidZipCode = (zipCode: string) => {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
};

export const OnboardingSchema = z.object({

  aboutMe: z.string()
    .min(10, "About Me must be at least 10 characters long")
    .max(500, "About Me must be less than 500 characters")
    .min(1, "About Me is required"),

  birthdate: z.string()
    .min(1, "Date of birth is required")
    .refine(isValidDate, "Date of birth cannot be in the future"),

  address: z.object({
    streetAddress: z.string()
      .min(1, "Street address is required"),
    city: z.string()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces")
      .min(1, "City is required"),
    state: z.string()
      .min(2, "State must be at least 2 characters")
      .max(50, "State must be less than 50 characters")
      .min(1, "State is required"),
    zipcode: z.string()
      .min(5, "Zip code must be at least 5 digits")
      .max(10, "Zip code must be less than 10 characters")
      .refine(isValidZipCode, "Please enter a valid US zip code")
      .min(1, "Zip code is required"),
  }),

  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert", "Master"]),

  onsite: z.enum(["yes", "no"]),

  compensation: z.string()
    .min(1, "Compensation requirement is required")
    .max(200, "Compensation requirement must be less than 200 characters"),
}); 