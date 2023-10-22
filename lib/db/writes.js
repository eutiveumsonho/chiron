import { ObjectId } from "bson";
import {
  getApiKeysCollection,
  getApprovedCompletionsCollection,
  getCompletionsPendingReviewCollection,
  getRejectedCompletionsCollection,
} from "../mongodb";

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
