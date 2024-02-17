import { CHIRON_FOREIGN_KEY, CHIRON_VENDOR_ID } from "@/lib/config";
import { getApiKey } from "@/lib/db/reads";
import { saveCompletion } from "@/lib/db/writes";
import { decrypt } from "@/lib/encryption";
import sendEmail from "@/lib/send-email";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const headersList = headers();

  const [_, vendorId, apiKey] = [
    headersList.get("host"),
    headersList.get("vendorId"),
    headersList.get("apiKey"),
  ];

  if (!vendorId) {
    return new NextResponse(JSON.stringify("Bad Request"), {
      status: 400,
    });
  }

  if (!apiKey) {
    return new NextResponse(JSON.stringify("Bad Request"), {
      status: 400,
    });
  }

  const result = await getApiKey(vendorId);

  // TODO: Something is wrong with this check, fix me 🤗
  // const { host: vendorHost } = new URL(result.vendorUrl);
  // if (vendorHost !== originHost) {
  //   return new NextResponse(JSON.stringify("Forbidden"), {
  //     status: 403,
  //   });
  // }

  const decryptedApiKey = decrypt(result.apiKey);

  if (decryptedApiKey !== apiKey) {
    return new NextResponse(JSON.stringify("Unauthorized"), {
      status: 401,
    });
  }

  const body = await req.json();

  if (!body || !body?._id) {
    return new NextResponse(JSON.stringify("Bad Request"), {
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

    await sendEmail({
      to: process.env.ALLOWED_EMAILS,
      subject: "New completion",
      text: `A new completion has been created for ${vendorId}`,
    });

    return new NextResponse(JSON.stringify("Created"), {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify("Error"), {
      status: 500,
    });
  }
}
