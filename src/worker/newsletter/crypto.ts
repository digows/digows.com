export function createConfirmationToken(): string
{
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

export async function hashConfirmationToken(token: string): Promise<string>
{
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isConfirmationToken(value: unknown): value is string
{
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/u.test(value);
}
