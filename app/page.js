import { redirect } from "next/navigation";

export default async function ApiManagementPage() {
  return redirect("/completions/pending");
}
