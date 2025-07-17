import { getOnboardingAssignments } from "@/server/utils/onboarding-config";
import { ALL_COMPONENTS, onboarding_components } from "@/server/schema";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import AdminForm from "./AdminForm";

export default async function AdminPage() {
  const assignments = await getOnboardingAssignments();

  async function updateAssignments(selected: { 1: string[]; 2: string[]; 3: string[] }) {
    "use server";
    const { 1: page1, 2: page2, 3: page3 } = selected;
  
    // Validate that each page has at least one component
    if (page1.length === 0 || page2.length === 0 || page3.length === 0) {
      throw new Error("Each page must have at least one component.");
    }

    // Validate that no field is assigned to multiple pages
    const allAssignedFields = [...page1, ...page2, ...page3];
    const uniqueFields = new Set(allAssignedFields);
    
    if (allAssignedFields.length !== uniqueFields.size) {
      throw new Error("Each field can only be assigned to one page. Duplicate assignments detected.");
    }

    // Validate that all required fields are assigned
    const requiredFields = ALL_COMPONENTS.map(comp => comp.key);
    const missingFields = requiredFields.filter(field => !allAssignedFields.includes(field));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(',')}`);
    }

    // Clear existing assignments and insert new ones
    await db.delete(onboarding_components);
    
    for (const c of page1) {
      await db.insert(onboarding_components).values({ component: c, page: 1 });
    }
    for (const c of page2) {
      await db.insert(onboarding_components).values({ component: c, page: 2 });
    }
    for (const c of page3) {
      await db.insert(onboarding_components).values({ component: c, page: 3 });
    }
    
    revalidatePath("/admin");
    revalidatePath("/onboarding"); // Also revalidate the onboarding page
  }

  return (
    <AdminForm assignments={assignments} ALL_COMPONENTS={ALL_COMPONENTS} onSubmit={updateAssignments} />
  );
}