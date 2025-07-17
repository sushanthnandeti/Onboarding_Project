"use server";

import { OnboardingSchema } from "@/types/onboarding-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

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
        streetAddress: parsedInput.address.streetAddress,
        city: parsedInput.address.city,
        state: parsedInput.address.state,
        zipCode: parsedInput.address.zipcode,
        birthdate: parsedInput.birthdate,
        skillLevel: parsedInput.skillLevel,
        onsite: parsedInput.onsite,
        compensation: parsedInput.compensation,
      })
      .where(eq(users.email, session.user.email));

    // Revalidate the data page to show updated user data
    revalidatePath("/data");

    return { success: true };
  }); 