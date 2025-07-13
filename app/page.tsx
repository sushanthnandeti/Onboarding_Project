import { redirect } from "next/navigation";

export default function Page() {
  // Always redirect to registration first
  redirect("/register");
}
