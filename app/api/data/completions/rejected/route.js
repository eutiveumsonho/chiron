import { getRejectedCompletions } from "@/lib/db/reads";
import { NextResponse } from "next/server";

export async function GET(request, _) {
  const rejectedCompletions = await getRejectedCompletions();

  return new NextResponse(JSON.stringify(rejectedCompletions), {
    status: 200,
  });
}
