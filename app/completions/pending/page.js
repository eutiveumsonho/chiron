import Empty from "@/components/empty";
import { CompletionsContainer } from "@/containers/completions";
import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import {
  getCompletionsPendingReview,
  getReviewInstructions,
} from "@/lib/db/reads";

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

  const uniqueVendors = new Set(
    completions.map(([, { [CHIRON_VENDOR_ID]: vendorId }]) => vendorId),
  );

  const reviewInstructions = (
    await Promise.all(
      Array.from(uniqueVendors)?.map((vendorId) =>
        getReviewInstructions(vendorId),
      ),
    )
  ).reduce((acc, instructions) => {
    acc[instructions.vendorId] = instructions.instruction;

    return acc;
  }, {});

  return (
    <CompletionsContainer
      completions={completions}
      reviewInstructions={reviewInstructions}
    />
  );
}
