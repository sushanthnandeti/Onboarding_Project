"use server";

import { OnboardingSchema } from "@/types/onboarding-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { auth } from "../auth";

export const UpdateUserOnboarding = actionClient
  .inputSchema(OnboardingSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    await db.update(users)
      .set({
        aboutMe: parsedInput.aboutMe,
        streetAddress: parsedInput.location,
        city: parsedInput.city,
        state: parsedInput.state,
        zipCode: parsedInput.zipcode,
        birthdate: parsedInput.dob,
        skillLevel: parsedInput.skillLevel,
      })
      .where(eq(users.email, session.user.email));

    return { success: true };
  }); 