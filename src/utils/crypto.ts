import { sign } from "hono/jwt";

export const hashPasssword = async (password: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
    )
  )
    .map((byte) => byte.toString(16))
    .join("");

export const generateJwtToken = async (userId: number, secret: string) => {
  return await sign(
    { username: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    secret
  );
};
