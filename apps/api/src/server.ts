import { app } from "./app";
import { driver } from "./db/driver";

const PORT = Number(process.env.PORT ?? 3000);

const main = async () => {
  await driver.verifyConnectivity();

  console.log("Connected to CognoDB");

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
};

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
