import type { Request, Response } from "express";
import * as walletService from "../services/wallet.service";

export const getWallet = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (typeof address !== "string" || !address) {
      return res.status(400).json({
        error: "Wallet address is required",
      });
    }

    const wallet = await walletService.getWallet(address);

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    return res.json(wallet);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRelatedWallets = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (typeof address !== "string" || !address) {
      return res.status(400).json({
        error: "Wallet address is required",
      });
    }

    const wallets = await walletService.getRelatedWallets(address);

    return res.json({
      wallet: address,
      relatedWallets: wallets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getWalletPositions = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (typeof address !== "string" || !address) {
      return res.status(400).json({
        error: "Wallet address is required",
      });
    }

    const positions = await walletService.getWalletPositions(address);

    return res.json({ wallet: address, position: positions });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getWalletTokens = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (typeof address !== "string" || !address) {
      return res.status(400).json({
        error: "Wallet address is required",
      });
    }

    const tokens = await walletService.getWalletTokens(address);

    return res.json({ wallet: address, tokens: tokens });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
