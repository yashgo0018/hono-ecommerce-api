import { Hono } from "hono";
import { IEnv } from "../types";
import { fetchProductById, fetchProducts } from "../models/Product";

const productsRoutes = new Hono<IEnv>();

productsRoutes.get("/", async (c) => {
  const products = await fetchProducts(c.env.DB);
  return c.json({ products });
});

productsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const product = await fetchProductById(c.env.DB, parseInt(id));
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  return c.json({ product });
});

export default productsRoutes;
