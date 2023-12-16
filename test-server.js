/** @module tests */

const http = require("http");
const crypto = require("crypto");

const vendorId = process.env.TEST_VENDOR_ID;
const apiKey = process.env.TEST_API_KEY;
const testApiPort = process.env.TEST_API_PORT;

/**
 * Generates a UUID to simulate a MongoDB ObjectId
 *
 * @returns {string}
 */
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16),
  );
}

/**
 * Generates a random string to simulate a completion property
 *
 * @returns {string}
 */
function generateRandomString() {
  return crypto.randomBytes(4).toString("hex");
}

/**
 * Test API server that simulates a vendor's API.
 * Upon start, it sends a POST request to the Chiron API with a fake completion.
 */
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle POST requests
  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      console.log(JSON.parse(data));
      res.writeHead(200);
      res.end();
    });
  }
});

server.listen(testApiPort, () => {
  console.log(`Test API server listening on port ${testApiPort}`);

  fetch("http://localhost:3000/api/data/completions", {
    method: "POST",
    headers: {
      host: `localhost:${testApiPort}`, // this is hidden in real world scenarios
      vendorId,
      apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: generateUUID(),
      property1: generateRandomString(),
      property2: generateRandomString(),
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    });
});
