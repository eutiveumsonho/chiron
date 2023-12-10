// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";
import { backOff } from "exponential-backoff";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getMongoClient() {
  const client = await clientPromise;

  if (!client) {
    throw new Error("Not connected to database");
  }

  return client;
}

async function connectToDatabase() {
  return await backOff(async () => {
    try {
      const client = await getMongoClient();
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);

      return db;
    } catch (error) {
      console.error(error);
    }
  });
}

export async function getCompletionsPendingReviewCollection() {
  return (await connectToDatabase()).collection("completions_pending_review");
}

export async function getApprovedCompletionsCollection() {
  return (await connectToDatabase()).collection("approved_completions");
}

export async function getRejectedCompletionsCollection() {
  return (await connectToDatabase()).collection("rejected_completions");
}

export async function getApiKeysCollection() {
  return (await connectToDatabase()).collection("api_keys");
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
