import Empty from "@/components/empty";

export default async function Home() {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/data/completions/pending",
  );

  const pendingReviews = await res.json();

  if (!pendingReviews || pendingReviews.length === 0) {
    return <Empty empty={{ description: "No pending reviews available" }} />;
  }

  return pendingReviews.map((review) => review._id);
}
