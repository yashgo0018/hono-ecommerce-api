import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { IEnv } from "./types";
import { authenticate, onlyAdmin } from "./middlewares/authentication";
import productsRoutes from "./routes/products";
import adminProductsRoutes from "./routes/admin/products";

const app = new Hono<IEnv>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRoutes);
app.route("/products", productsRoutes);

app.use("/api/*", authenticate);
app.use("/api/admin/*", onlyAdmin);

app.route("/api/admin/products", adminProductsRoutes);

app.get("/api/me", (c) => {
  const user = c.get("user");
  return c.json({ user });
});

export default app;
