import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import { getApiKey } from "@/lib/db/reads";
import { saveCompletion } from "@/lib/db/writes";
import { decrypt } from "@/lib/encryption";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const headersList = headers();

  const [originHost, vendorId, apiKey] = [
    headersList.get("host"),
    headersList.get("vendorId"),
    headersList.get("apiKey"),
  ];

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

  const { host: vendorHost } = new URL(result.vendorUrl);

  if (vendorHost !== originHost) {
    return new NextResponse("Forbidden", {
      status: 403,
    });
  }

  const decryptedApiKey = decrypt(result.apiKey);

  if (decryptedApiKey !== apiKey) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const body = await req.json();

  if (!body || !body?._id) {
    return new NextResponse("Bad Request", {
      status: 400,
    });
  }

  const data = {
    ...body,
    [CHIRON_VENDOR_ID]: vendorId,
    [CHIRON_FOREIGN_KEY]: body._id,
  };

  delete data._id;

  try {
    await saveCompletion(data);

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
