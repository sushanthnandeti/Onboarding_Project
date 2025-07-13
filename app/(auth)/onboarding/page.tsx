import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import MultiStepForm from "@/components/auth/multi-step-form/multi-step-form";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen w-1/3 bg-blue-400 bg-formImage bg-cover" />
      <div className="w-2/3 flex items-center justify-center">
        <MultiStepForm />
      </div>
    </div>
  );
}