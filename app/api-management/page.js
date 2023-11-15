import ApiManagementContainer from "@/containers/api-management";
import { getApiKeys } from "@/lib/db/reads";

export default async function ApiManagementPage() {
  const vendors = await getApiKeys();

  return <ApiManagementContainer vendors={vendors} />;
}
