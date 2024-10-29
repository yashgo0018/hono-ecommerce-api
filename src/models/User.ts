import { hashPasssword } from "../utils/crypto";

export async function findUserByEmail(db: D1Database, email: string) {
  return await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();
}

export async function createUser(
  db: D1Database,
  user: {
    name: string;
    email: string;
    password: string;
  }
) {
  const hashedPassword = await hashPasssword(user.password);

  return await db
    .prepare(
      "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)"
    )
    .bind(user.name, user.email, hashedPassword)
    .run();
}

interface User {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export async function verifyUser(
  db: D1Database,
  email: string,
  password: string
) {
  const hashedPassword = await hashPasssword(password);

  return await db
    .prepare(
      "SELECT id, name, email, is_verified, is_admin, is_active, created_at FROM users WHERE email = ? AND hashed_password = ?"
    )
    .bind(email, hashedPassword)
    .first<User>();
}