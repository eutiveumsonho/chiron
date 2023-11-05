import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CHIRON_VENDOR_ID } from "@/lib/config";
import { getApiKey } from "@/lib/db/reads";
import { reviewCompletion } from "@/lib/db/writes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function validateDirection(direction) {
  const validDirections = [
    "pending2approve",
    "pending2reject",
    "approve2reject",
    "reject2approve",
  ];

  if (!validDirections.includes(direction)) {
    throw new Error(`Invalid direction: ${direction}`);
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }

  const body = await req.json();

  if (!body?.data?._id && !body.direction) {
    return new NextResponse(JSON.stringify("Bad Request"), { status: 400 });
  }

  try {
    const { direction, data } = body;
    validateDirection(direction);

    const result = await reviewCompletion(data, direction);

    if (result?.acknowledged || result?.insertedId) {
      const vendorId = data[CHIRON_VENDOR_ID];
      const apiKey = await getApiKey(vendorId);

      const { vendorCallbackUrl } = apiKey;

      try {
        await fetch(vendorCallbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error(error);

        return new NextResponse(JSON.stringify("Internal Server Error"), {
          status: 500,
        });
      }
    }

    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: 500,
    });
  }
}
