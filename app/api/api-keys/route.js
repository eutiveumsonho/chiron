import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { saveApiKeys } from "@/lib/db/writes";
import { encrypt } from "@/lib/encryption";

export async function POST(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { vendorName, vendorUrl } = await req.body;

    if (!vendorUrl) {
      throw new Error("You must enter a vendor URL.");
    }

    if (!vendorName) {
      throw new Error("You must enter a vendor name.");
    }

    // Validate URL
    new URL(vendorUrl);

    const vendorId = crypto.randomBytes(8).toString("hex").toUpperCase();

    // Generate the API key by hashing the vendor name and URL together
    const apiKey = crypto
      .createHash("sha512")
      .update(vendorName + "-" + vendorUrl)
      .digest()
      .subarray(0, 64)
      .toString("base64");

    const data = {
      vendorId,
      apiKey: encrypt(apiKey),
      vendorName,
      vendorUrl,
      createdBy: session.user.email,
    };

    await saveApiKeys(data);

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
