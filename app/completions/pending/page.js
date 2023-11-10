import Empty from "@/components/empty";
import { CompletionsContainer } from "@/containers/completions";
import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import { getCompletionsPendingReview } from "@/lib/db/reads";

export default async function PendingCompletionsReviewPage() {
  const pendingReviews = await getCompletionsPendingReview();

  if (!pendingReviews || pendingReviews.length === 0) {
    return <Empty empty={{ description: "No pending reviews available 🤗" }} />;
  }

  const completions = pendingReviews.map(
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
