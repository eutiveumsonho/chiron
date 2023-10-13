import { getApprovedCompletions } from "@/lib/db/reads";
import { NextResponse } from "next/server";

export async function GET(request, _) {
  const approvedCompletions = await getApprovedCompletions();

  return new NextResponse(JSON.stringify(approvedCompletions), {
    status: 200,
  });
}
