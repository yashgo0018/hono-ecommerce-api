import { Hono } from "hono";
import { IEnv } from "../../types";
import {
  createProduct,
  fetchProductById,
  fetchProducts,
} from "../../models/Product";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const adminProductsRoutes = new Hono<IEnv>();

adminProductsRoutes.get("/", async (c) => {
  const products = await fetchProducts(c.env.DB);
  return c.json({ products });
});

adminProductsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const product = await fetchProductById(c.env.DB, parseInt(id));
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  return c.json({ product });
});

adminProductsRoutes.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().min(0),
    })
  ),
  async (c) => {
    const product = c.req.valid("json");
    const productId = await createProduct(c.env.DB, product);
    return c.json({ message: "Product created", productId }, 201);
  }
);

export default adminProductsRoutes;
