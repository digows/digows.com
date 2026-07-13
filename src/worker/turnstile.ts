import type { Environment, TurnstileVerification } from "./contracts";

const siteverifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const verificationTimeoutMilliseconds = 10_000;

export async function verifyTurnstile(
  request: Request,
  environment: Environment,
  token: string,
  idempotencyKey: string,
  expectedAction: "comment_submit" | "contact_submit" | "newsletter_subscribe",
): Promise<boolean>
{
  const formData = new FormData();
  formData.set("secret", environment.TURNSTILE_SECRET_KEY);
  formData.set("response", token);
  formData.set("idempotency_key", idempotencyKey);

  const remoteAddress = request.headers.get("CF-Connecting-IP");

  if (remoteAddress !== null)
  {
    formData.set("remoteip", remoteAddress);
  }

  let verificationResponse: Response;

  try
  {
    verificationResponse = await fetch(siteverifyEndpoint, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(verificationTimeoutMilliseconds),
    });
  }
  catch (error)
  {
    console.error(JSON.stringify({
      event: "turnstile_verification_request_failed",
      message: error instanceof Error ? error.message : "Unknown error",
      expectedAction,
    }));
    return false;
  }

  if (!verificationResponse.ok)
  {
    console.error(JSON.stringify({
      event: "turnstile_verification_http_failed",
      status: verificationResponse.status,
      expectedAction,
    }));
    return false;
  }

  const verification = await verificationResponse.json<TurnstileVerification>();

  if (environment.ENVIRONMENT === "development")
  {
    return verification.success;
  }

  const allowedHostnames = environment.TURNSTILE_HOSTNAMES
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  const isValid = verification.success
    && verification.action === expectedAction
    && verification.hostname !== undefined
    && allowedHostnames.includes(verification.hostname.toLowerCase());

  if (!isValid)
  {
    console.warn(JSON.stringify({
      event: "turnstile_verification_failed",
      success: verification.success,
      errorCodes: verification["error-codes"] ?? [],
      expectedAction,
      receivedAction: verification.action ?? null,
      hostname: verification.hostname ?? null,
    }));
  }

  return isValid;
}
