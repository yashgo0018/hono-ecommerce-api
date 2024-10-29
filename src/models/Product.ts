export async function createProduct(
  db: D1Database,
  product: {
    name: string;
    description: string;
    price: number;
  }
) {
  const { name, description, price } = product;

  const result = await db
    .prepare("INSERT INTO products (name, description, price) VALUES (?, ?, ?)")
    .bind(name, description, price)
    .run();

  return result.meta.last_row_id;
}

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export async function fetchProducts(db: D1Database) {
  const { results } = await db
    .prepare("SELECT id, name, description, price FROM products")
    .all<Product>();

  return results;
}

export async function fetchProductById(db: D1Database, id: number) {
  const product = await db
    .prepare("SELECT id, name, description, price FROM products WHERE id = ?")
    .bind(id)
    .first<Product>();

  return product;
}
