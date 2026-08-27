import express from "express";
import { walletRouter } from "./routes/wallet.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/wallets", walletRouter);
