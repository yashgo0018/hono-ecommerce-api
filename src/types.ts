import type { Context } from "hono";

export type IEnv = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

export type IContext = Context<IEnv>;
