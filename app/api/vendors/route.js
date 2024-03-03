import crypto from "crypto";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { saveApiKeys, updateApiKey } from "@/lib/db/writes";
import { encrypt } from "@/lib/encryption";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify([]), { status: 401 });
  }

  try {
    const { vendorName, vendorUrl, vendorCallbackUrl, reviewInstructions } =
      await req.json();

    if (!vendorUrl) {
      throw new Error("You must enter a vendor URL.");
    }

    if (!vendorName) {
      throw new Error("You must enter a vendor name.");
    }

    if (!vendorCallbackUrl) {
      throw new Error("You must enter a vendor callback URL.");
    }

    // Validate URL
    new URL(vendorUrl);

    // Validate callback URL
    new URL(vendorCallbackUrl);

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
      vendorCallbackUrl,
      reviewInstructions,
      createdBy: session.user.email,
    };

    const result = await saveApiKeys(data);

    if (!result?.insertedId) {
      console.error("Failed to insert API key into database");

      return new NextResponse("Error", {
        status: 500,
      });
    }

    return new NextResponse(JSON.stringify({ vendorId, apiKey }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Error", {
      status: 500,
    });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify([]), { status: 401 });
  }

  try {
    const {
      vendorName,
      vendorUrl,
      vendorCallbackUrl,
      reviewInstructions,
      _id,
    } = await req.json();

    if (!_id) {
      throw new Error("An object ID must be present.");
    }

    if (!vendorUrl) {
      throw new Error("You must enter a vendor URL.");
    }

    if (!vendorName) {
      throw new Error("You must enter a vendor name.");
    }

    if (!vendorCallbackUrl) {
      throw new Error("You must enter a vendor callback URL.");
    }

    // Validate URL
    new URL(vendorUrl);

    // Validate callback URL
    new URL(vendorCallbackUrl);

    const data = {
      _id,
      vendorName,
      vendorUrl,
      vendorCallbackUrl,
      reviewInstructions,
    };

    const result = await updateApiKey(data);

    if (!result?.modifiedCount) {
      console.error("Failed to update API key");

      return new NextResponse("Error", {
        status: 500,
      });
    }

    return new NextResponse("Success", {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Error", {
      status: 500,
    });
  }
}
