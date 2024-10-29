import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { IEnv } from "./types";
import { authenticate } from "./middlewares/authentication";

const app = new Hono<IEnv>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRoutes);

app.use("/api/*", authenticate);

app.get("/api/me", (c) => {
  return c.json({ message: "Hello Hono!" });
});

export default app;
