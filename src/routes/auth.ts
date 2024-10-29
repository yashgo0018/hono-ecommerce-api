import { Hono } from "hono";
import { createUser, findUserByEmail, verifyUser } from "../models/User";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const authRoutes = new Hono<{ Bindings: Bindings }>();

authRoutes.post(
  "/register",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })
  ),
  async (c) => {
    const { name, email, password } = await c.req.json();
    const existingUser = await findUserByEmail(c.env.DB, email);
    if (existingUser) {
      return c.json({ message: "Email already exists" }, 400);
    }

    const result = await createUser(c.env.DB, { name, email, password });

    let userId = result.meta.last_row_id;

    return c.json({
      message: "User created successfully",
      userId,
    });
  }
);

authRoutes.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.json();

    const user = await verifyUser(c.env.DB, email, password);

    if (!user) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    return c.json({ message: "Login successful", user });
  }
);

export default authRoutes;
