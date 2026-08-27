import type { Request, Response } from "express";
import * as poolService from "../services/pool.service";

export const getPools = async (_req: Request, res: Response) => {
  try {
    const pools = await poolService.getPools();

    return res.json({ pools });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
      return res.status(400).json({ error: "Pool id is required" });
    }

    const pool = await poolService.getPool(id);

    if (!pool) {
      return res.status(404).json({ error: "Pool not found" });
    }

    return res.json(pool);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPoolProviders = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
      return res.status(400).json({ error: "Pool id is required" });
    }

    const providers = await poolService.getPoolProviders(id);

    return res.json({ pool: id, providers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
