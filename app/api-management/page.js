import ApiManagementContainer from "@/containers/api-management";
import { f } from "@/lib/fetch";

export default async function ApiManagementPage() {
  const res = await f("/api/vendors");

  const vendors = await res.json();

  return <ApiManagementContainer vendors={vendors} />;
}
