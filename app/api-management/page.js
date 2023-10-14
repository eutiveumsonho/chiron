import Empty from "@/components/empty";

export default async function ApiManagementPage() {
  const integrations = [];

  if (!integrations || integrations.length === 0) {
    return (
      <Empty
        empty={{ description: "No integrations available to manage yet" }}
      />
    );
  }

  return integrations.map((integration) => integration._id);
}
