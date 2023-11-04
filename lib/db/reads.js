import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

export async function getCompletionsPendingReview() {
  const collection = await getCompletionsPendingReviewCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

export async function getApprovedCompletions() {
  const collection = await getApprovedCompletionsCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

export async function getRejectedCompletions() {
  const collection = await getRejectedCompletionsCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

export async function getApiKey(vendorId) {
  const collection = await getApiKeysCollection();

  const result = await collection.findOne({
    vendorId,
  });

  if (!result) {
    console.error("Vendor not found");
    return null;
  }

  return result;
}

export async function getApiKeys() {
  const collection = await getApiKeysCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  const vendors = result.map((apiKey) => ({
    name: apiKey.vendorName,
    callbackUrl: apiKey.vendorCallbackUrl,
  }));

  return vendors;
}
