import { Router } from "express";

import { getWallet, getRelatedWallets } from "../controllers/wallet.controller";

export const walletRouter = Router();

walletRouter.get("/:address", getWallet);
walletRouter.get("/:address/related", getRelatedWallets);
