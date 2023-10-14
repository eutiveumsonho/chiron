import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCompletionsPendingReview } from "@/lib/db/reads";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify([]), { status: 401 });
  }

  const completionsPendingReview = await getCompletionsPendingReview();

  return new NextResponse(JSON.stringify(completionsPendingReview), {
    status: 200,
  });
}
