import "dotenv/config";

export const env = {
  cognodbUri: process.env.COGNODB_URI,
  cognodbUsername: process.env.COGNODB_USERNAME,
  cognodbPassword: process.env.COGNODB_PASSWORD,
};

if (!env.cognodbUri || !env.cognodbUsername || !env.cognodbPassword) {
  throw new Error("Missing required CognoDB environment variables");
}
