import type { Context } from "hono";

export interface User {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export type IEnv = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
  Variables: {
    user?: User;
  };
};

export type IContext = Context<IEnv>;
