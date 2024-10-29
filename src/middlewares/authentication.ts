import { verify } from "hono/jwt";
import type { Next } from "hono";
import type { IContext } from "../types";
import { findUserById } from "../models/User";

export const authenticate = async (c: IContext, next: Next) => {
  const authorization = c.req.header("Authorization")?.trim();
  if (
    !authorization ||
    !authorization.startsWith("Bearer ") ||
    authorization.split(" ").length !== 2
  ) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authorization.slice(7);
  let userId: number;
  try {
    const payload = (await verify(token, c.env.JWT_SECRET)) as {
      username: number;
    };
    console.log(payload);
    userId = payload.username;
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await findUserById(c.env.DB, userId);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", user);

  return next();
};

export const onlyAdmin = async (c: IContext, next: Next) => {
  const user = c.get("user");
  if (!user || !user.is_admin) {
    return c.json({ error: "Insufficient permissions" }, 403);
  }
  return next();
};
