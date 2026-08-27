import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import neo4j from "neo4j-driver";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("Missing COGNODB_URI, COGNODB_USERNAME, or COGNODB_PASSWORD");
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

const main = async () => {
  const schemaPath = path.resolve("database/schema/constraints.cypher");

  const schema = await fs.readFile(schemaPath, "utf8");

  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  const session = driver.session();

  try {
    await driver.verifyConnectivity();

    for (const statement of statements) {
      console.log("Executing schema statement...");

      await session.run(statement);
    }

    console.log("Schema applied successfully.");
  } finally {
    await session.close();
    await driver.close();
  }
};

main().catch((error) => {
  console.error("Schema setup failed:", error);
  process.exitCode = 1;
});
