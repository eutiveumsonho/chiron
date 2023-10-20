import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRejectedCompletions } from "@/lib/db/reads";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify([]), { status: 401 });
  }

  try {
    const rejectedCompletions = await getRejectedCompletions();

    return new NextResponse(JSON.stringify(rejectedCompletions), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: 500,
    });
  }
}
