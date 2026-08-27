import neo4j from "neo4j-driver";
import { env } from "../config/env";

export const driver = neo4j.driver(
  env.cognodbUri!,
  neo4j.auth.basic(env.cognodbUsername!, env.cognodbPassword!),
);
