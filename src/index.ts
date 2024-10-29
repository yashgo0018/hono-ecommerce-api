import { Hono } from "hono";
import authRoutes from "./routes/auth";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRoutes);

export default app;
