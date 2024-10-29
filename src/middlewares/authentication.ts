import { verify } from "hono/jwt";
import type { Next } from "hono";
import type { IContext } from "../types";

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
  try {
    const payload = (await verify(token, c.env.JWT_SECRET)) as {
      dest: string;
    };

    console.log(payload);
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return next();
};
