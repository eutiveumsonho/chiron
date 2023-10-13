import { getCompletionsPendingReview } from "@/lib/db/reads";
import { NextResponse } from "next/server";

export async function GET(request, _) {
  const completionsPendingReview = await getCompletionsPendingReview();

  return new NextResponse(JSON.stringify(completionsPendingReview), {
    status: 200,
  });
}

export async function PATCH(request) {
  // TODO: Approved/reject review

  return new NextResponse(JSON.stringify({ answer: "John Doe" }), {
    status: 200,
  });
}
