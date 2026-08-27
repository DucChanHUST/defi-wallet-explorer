import { Router } from "express";
import {
  getPools,
  getPool,
  getPoolProviders,
} from "../controllers/pool.controller";

export const poolRouter = Router();

poolRouter.get("/", getPools);
poolRouter.get("/:id", getPool);
poolRouter.get("/:id/providers", getPoolProviders);
