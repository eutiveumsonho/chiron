/** @module lib/db/reads */

import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

/**
 * Gets all completions pending review.
 *
 * @returns {Promise<import("mongodb").Document[]>}
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
 *
 * @returns {Promise<import("mongodb").Document[]>}
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
 *
 * @returns {Promise<import("mongodb").Document[]>}
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
 * @returns {Promise<import("mongodb").Document>}
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
 * Gets a shallow version of all API keys.
 *
 * @returns {Promise<{ name: string, callbackUrl: string }[]>
 */
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
