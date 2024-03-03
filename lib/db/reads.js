/** @module lib/db/reads */

import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

/**
 * Gets all completions pending review.
 */
export async function getCompletionsPendingReview() {
  const collection = await getCompletionsPendingReviewCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

/**
 * Gets all approved completions.
 */
export async function getApprovedCompletions() {
  const collection = await getApprovedCompletionsCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

/**
 * Gets all rejected completions.
 */
export async function getRejectedCompletions() {
  const collection = await getRejectedCompletionsCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  return result;
}

/**
 * Gets the API key for the given vendor ID.
 *
 * @param {string} vendorId The vendor ID to get the API key for.
 */
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

/**
 * Gets the review instructions for the given vendor ID.
 *
 * @param {string} vendorId The vendor ID to get the review instructions for.
 * @returns
 */
export async function getReviewInstructions(vendorId) {
  const collection = await getApiKeysCollection();

  const result =
    (await collection.findOne({
      vendorId,
    })) || {};

  return { vendorId, instruction: result?.reviewInstructions };
}

/**
 * Gets a shallow version of all API keys.
 *
 * @returns {Promise<{ name: string, callbackUrl: string, reviewInstructions: string }[]>
 */
export async function getApiKeys() {
  const collection = await getApiKeysCollection();
  const cursor = collection.find({}).sort({ _id: -1 }).limit(200);
  const result = await cursor.toArray();
  await cursor.close();

  const vendors = result.map((apiKey) => ({
    _id: apiKey._id?.toString(),
    name: apiKey.vendorName,
    callbackUrl: apiKey.vendorCallbackUrl,
    url: apiKey.vendorUrl,
    reviewInstructions: apiKey?.reviewInstructions,
  }));

  return vendors;
}
