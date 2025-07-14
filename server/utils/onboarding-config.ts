import { db } from "@/server/db";
import { onboarding_components } from "@/server/schema";

// sample :  { 1: ["aboutMe"], 2: ["birthdate", "city"], 3: ["streetAddress"] }
export async function getOnboardingAssignments() {
  const rows = await db.select().from(onboarding_components);
  return {
    1: rows.filter(r => r.page === 1).map(r => r.component),
    2: rows.filter(r => r.page === 2).map(r => r.component),
    3: rows.filter(r => r.page === 3).map(r => r.component),
  };
} 