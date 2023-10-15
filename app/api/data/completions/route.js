import { getApiKey } from "@/lib/db/reads";
import { saveCompletion } from "@/lib/db/writes";
import { decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { vendorId, apiKey } = req.headers;

  if (!vendorId) {
    return new NextResponse("Bad Request", {
      status: 400,
    });
  }

  if (!apiKey) {
    return new NextResponse("Bad Request", {
      status: 400,
    });
  }

  const result = await getApiKey(vendorId);

  const decryptedApiKey = decrypt(result.apiKey);

  if (decryptedApiKey !== apiKey) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const { origin } = new URL(result.vendorUrl);
  const { origin: requestOrigin } = new URL(req.headers.referer);

  if (origin !== requestOrigin) {
    return new NextResponse("Forbidden", {
      status: 403,
    });
  }

  const body = await req.json();

  if (!body) {
    return new NextResponse("Bad Request", {
      status: 400,
    });
  }

  try {
    await saveCompletion(body);

    return new NextResponse("Created", {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Error", {
      status: 500,
    });
  }
}
