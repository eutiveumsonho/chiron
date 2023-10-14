import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getApprovedCompletions } from "@/lib/db/reads";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify([]), { status: 401 });
  }
  const approvedCompletions = await getApprovedCompletions();

  return new NextResponse(JSON.stringify(approvedCompletions), {
    status: 200,
  });
}
