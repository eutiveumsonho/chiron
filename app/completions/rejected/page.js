import Empty from "@/components/empty";
import { CompletionsContainer } from "@/containers/completions";
import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import { getRejectedCompletions } from "@/lib/db/reads";

export default async function Home() {
  const rejectedCompletions = await getRejectedCompletions();

  if (!rejectedCompletions || rejectedCompletions.length === 0) {
    return (
      <Empty empty={{ description: "No completions were rejected yet 🤗" }} />
    );
  }

  const completions = rejectedCompletions.map(
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
