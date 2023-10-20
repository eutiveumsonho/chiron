import Empty from "@/components/empty";
import { f } from "@/lib/fetch";

export default async function PendingCompletionsReviewPage() {
  const res = await f("/api/data/completions/pending");
  const pendingReviews = await res.json();

  if (!pendingReviews || pendingReviews.length === 0) {
    return <Empty empty={{ description: "No pending reviews available" }} />;
  }

  return <></>;
}
