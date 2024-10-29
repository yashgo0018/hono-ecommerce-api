export const hashPasssword = async (password: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
    )
  )
    .map((byte) => byte.toString(16))
    .join("");
