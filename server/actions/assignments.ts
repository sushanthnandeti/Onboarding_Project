"use server";

import { z } from "zod";
import { getOnboardingAssignments } from "@/server/utils/onboarding-config";
import { actionClient } from "@/lib/safe-action";

export const GetOnboardingAssignments = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    try {
      const assignments = await getOnboardingAssignments();
      return { data: assignments };
    } catch (error) {
      return { error: "Failed to fetch assignments" };
    }
  }); 