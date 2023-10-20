import Empty from "@/components/empty";
import { f } from "@/lib/fetch";

export default async function Home() {
  const res = await f("/api/data/completions/rejected");
  const rejectedCompletions = await res.json();

  if (!rejectedCompletions || rejectedCompletions.length === 0) {
    return (
      <Empty empty={{ description: "No completions were rejected yet" }} />
    );
  }

  return (
    <main>
      {rejectedCompletions.map((review) => {
        return (
          <div key={review._id}>
            <h1>question</h1>
            <p>answer</p>
          </div>
        );
      })}
    </main>
  );
}
