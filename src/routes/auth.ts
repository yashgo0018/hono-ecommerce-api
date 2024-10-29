import { Hono } from "hono";
import { createUser, findUserByEmail, verifyUser } from "../models/User";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { IEnv } from "../types";
import { generateJwtToken } from "../utils/crypto";

const authRoutes = new Hono<IEnv>();

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

    const token = await generateJwtToken(userId, c.env.JWT_SECRET);

    return c.json({
      message: "User created successfully",
      userId,
      token,
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

    const token = await generateJwtToken(user.id, c.env.JWT_SECRET);

    return c.json({ message: "Login successful", user, token });
  }
);

export default authRoutes;
