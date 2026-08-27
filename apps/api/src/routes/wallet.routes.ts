import { Router } from "express";

import {
  getWallet,
  getRelatedWallets,
  getWalletPositions,
  getWalletTokens,
} from "../controllers/wallet.controller";

export const walletRouter = Router();

walletRouter.get("/:address", getWallet);
walletRouter.get("/:address/related", getRelatedWallets);
walletRouter.get("/:address/positions", getWalletPositions);
walletRouter.get("/:address/tokens", getWalletTokens);
