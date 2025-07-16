"use server";

import { RegisterSchema } from "@/types/register-schema";
import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcrypt"
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { revalidatePath } from "next/cache";

export const RegisterAccount = actionClient
  .inputSchema(RegisterSchema)
  .action(
    async ({ parsedInput: { email, password, lastName, firstName } }) => {
      const hashedPassword = await bcrypt.hash(password, 10)

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (existingUser) {
        return {error: "Looks like you already have an account. Please log in."};
      }

      await db.insert(users).values({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });

      // Revalidate the data page to show new user
      revalidatePath("/data");

      return {success: "Account created successfully"}
    }
  )