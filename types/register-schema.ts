import * as z from "zod";


const SkillLevelEnum = z.enum(["Beginner", "Intermediate", "Advanced", "Expert", "Master"]);

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});