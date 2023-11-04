import Empty from "@/components/empty";
import { CompletionsContainer } from "@/containers/completions";
import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import { f } from "@/lib/fetch";

export default async function Home() {
  const res = await f("/api/data/completions/approved");
  const approvedCompletions = await res.json();

  if (!approvedCompletions || approvedCompletions.length === 0) {
    return (
      <Empty empty={{ description: "No completions were approved yet 🤗" }} />
    );
  }

  const completions = approvedCompletions.map(
    ({
      [CHIRON_FOREIGN_KEY]: fk,
      [CHIRON_VENDOR_ID]: vendorId,
      ...completion
    }) => {
      return [
        completion,
        {
          [CHIRON_FOREIGN_KEY]: fk,
          [CHIRON_VENDOR_ID]: vendorId,
          ...completion,
        },
      ];
    },
  );

  return <CompletionsContainer completions={completions} />;
}
