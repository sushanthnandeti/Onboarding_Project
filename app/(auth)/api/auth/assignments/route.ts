import { NextResponse } from "next/server";
import { getOnboardingAssignments } from "@/server/utils/onboarding-config";

export async function GET() {
  const assignments = await getOnboardingAssignments();
  return NextResponse.json(assignments);
} 