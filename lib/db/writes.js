import { ObjectId } from "mongodb";
import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

async function approveCompletion(completionId) {
  const [collection, approvedCollection] = await Promise.all([
    getCompletionsPendingReviewCollection(),
    getApprovedCompletionsCollection(),
  ]);

  const completion = await collection.findOne({ _id: ObjectId(completionId) });
  const approvedResult = await approvedCollection.insertOne(completion);
  await collection.deleteOne({ _id: ObjectId(completionId) });

  return approvedResult;
}

async function rejectCompletion(completionId) {
  const [collection, rejectedCollection] = await Promise.all([
    getCompletionsPendingReviewCollection(),
    getRejectedCompletionsCollection(),
  ]);

  const completion = await collection.findOne({ _id: ObjectId(completionId) });
  const rejectedResult = await rejectedCollection.insertOne(completion);
  await collection.deleteOne({ _id: ObjectId(completionId) });

  return rejectedResult;
}

async function approve2Reject(completionId) {
  const [collection, rejectedCollection] = await Promise.all([
    getApprovedCompletionsCollection(),
    getRejectedCompletionsCollection(),
  ]);

  const completion = await collection.findOne({ _id: ObjectId(completionId) });
  const rejectedResult = await rejectedCollection.insertOne(completion);
  await collection.deleteOne({ _id: ObjectId(completionId) });

  return rejectedResult;
}

async function reject2Approve(completionId) {
  const [collection, approvedCollection] = await Promise.all([
    getRejectedCompletionsCollection(),
    getApprovedCompletionsCollection(),
  ]);

  const completion = await collection.findOne({ _id: ObjectId(completionId) });
  const approvedResult = await approvedCollection.insertOne(completion);
  await collection.deleteOne({ _id: ObjectId(completionId) });

  return approvedResult;
}

export async function reviewCompletion(completionId, direction) {
  // TODO: Does approve2pending; reject2pending make sense?
  switch (direction) {
    case "pending2approve":
      return approveCompletion(completionId);
    case "pending2reject":
      return rejectCompletion(completionId);
    case "approve2reject":
      return approve2Reject(completionId);
    case "reject2approve":
      return reject2Approve(completionId);
    default:
      throw new Error("Invalid direction");
  }
}

export async function saveCompletion(completionData) {
  const collection = await getCompletionsPendingReviewCollection();

  const result = await collection.insertOne(completionData);

  return result;
}

export async function saveApiKeys(data) {
  const collection = await getApiKeysCollection();

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date().toISOString(),
  });

  return result;
}
