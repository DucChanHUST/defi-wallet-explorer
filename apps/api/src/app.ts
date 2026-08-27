import express from "express";
import { poolRouter } from "./routes/pool.routes";
import { walletRouter } from "./routes/wallet.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/wallets", walletRouter);
app.use("/api/pools", poolRouter);
