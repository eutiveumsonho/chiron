/** @module lib/db/writes */

import { ObjectId } from "bson";
import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

/**
 * Approves a completion.
 *
 * @param data The completion data to approve.
 */
async function approveCompletion(data) {
  const [collection, approvedCollection] = await Promise.all([
    getCompletionsPendingReviewCollection(),
    getApprovedCompletionsCollection(),
  ]);

  const id = data._id;
  delete data._id;

  const approvedResult = await approvedCollection.insertOne(data);
  await collection.deleteOne({ _id: new ObjectId(id) });

  return approvedResult;
}

/**
 * Rejects a completion.
 *
 * @param data The completion data to reject.
 */
async function rejectCompletion(data) {
  const [collection, rejectedCollection] = await Promise.all([
    getCompletionsPendingReviewCollection(),
    getRejectedCompletionsCollection(),
  ]);

  const id = data._id;
  delete data._id;

  const rejectedResult = await rejectedCollection.insertOne(data);
  await collection.deleteOne({ _id: new ObjectId(id) });

  return rejectedResult;
}

async function approve2Reject(data) {
  const [collection, rejectedCollection] = await Promise.all([
    getApprovedCompletionsCollection(),
    getRejectedCompletionsCollection(),
  ]);

  const id = data._id;
  delete data._id;

  const rejectedResult = await rejectedCollection.insertOne(data);
  await collection.deleteOne({ _id: new ObjectId(id) });

  return rejectedResult;
}

async function reject2Approve(data) {
  const [collection, approvedCollection] = await Promise.all([
    getRejectedCompletionsCollection(),
    getApprovedCompletionsCollection(),
  ]);

  const id = data._id;
  delete data._id;
  const approvedResult = await approvedCollection.insertOne(data);
  await collection.deleteOne({ _id: new ObjectId(id) });

  return approvedResult;
}

/**
 * Starts a review pipeline for a completion.
 *
 * @param data The completion data to review
 * @param {"pending2approve" | "pending2reject" | "approve2reject" | "reject2Approve"} direction Direction of the review
 */
export async function reviewCompletion(data, direction) {
  // TODO: Does approve2pending; reject2pending make sense?
  switch (direction) {
    case "pending2approve":
      return approveCompletion(data);
    case "pending2reject":
      return rejectCompletion(data);
    // TODO: Support these use cases on the front-end, eventually
    case "approve2reject":
      return approve2Reject(data);
    case "reject2approve":
      return reject2Approve(data);
    default:
      throw new Error("Invalid direction");
  }
}

/**
 * Saves a completion to the database for review.
 *
 * @param completionData Completion data to save
 */
export async function saveCompletion(completionData) {
  const collection = await getCompletionsPendingReviewCollection();

  const result = await collection.insertOne(completionData);

  return result;
}

/**
 * Inserts an API key created from the API Management page into the database.
 *
 * @param data The API key data to save.
 */
export async function saveApiKeys(data) {
  const collection = await getApiKeysCollection();

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date().toISOString(),
  });

  return result;
}

/**
 * Updates an API key in the database.
 *
 * @param data
 */
export async function updateApiKey(data) {
  const collection = await getApiKeysCollection();

  const { _id, ...rest } = data;

  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { ...rest, updatedAt: new Date().toISOString() } },
  );

  return result;
}
