import type { Environment } from "./contracts";

export async function createSubmissionFingerprint(
  request: Request,
  environment: Environment,
  timestamp: number,
): Promise<string>
{
  const dayBucket = new Date(timestamp).toISOString().slice(0, 10);
  const remoteAddress = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const userAgent = request.headers.get("User-Agent") ?? "unknown";
  return createHmac(environment.COMMENT_FINGERPRINT_SECRET, `${dayBucket}|${remoteAddress}|${userAgent}`);
}

export async function createVisitorFingerprint(
  visitorId: string,
  environment: Environment,
): Promise<string>
{
  return createHmac(environment.COMMENT_FINGERPRINT_SECRET, `article-reaction|${visitorId}`);
}

async function createHmac(secret: string, value: string): Promise<string>
{
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
