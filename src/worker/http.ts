const securityHeaders: Readonly<Record<string, string>> = {
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export function jsonResponse(body: unknown, status = 200, additionalHeaders?: HeadersInit): Response
{
  const headers = new Headers(securityHeaders);

  if (additionalHeaders !== undefined)
  {
    new Headers(additionalHeaders).forEach((value, name) => headers.set(name, value));
  }

  return Response.json(body, { status, headers });
}

export function methodNotAllowed(allowedMethods: readonly string[]): Response
{
  return jsonResponse(
    { error: "method_not_allowed" },
    405,
    { Allow: allowedMethods.join(", "), "Cache-Control": "no-store" },
  );
}

export function isSameOrigin(request: Request, siteOrigin: string): boolean
{
  const requestOrigin = request.headers.get("Origin");

  if (requestOrigin === null)
  {
    return false;
  }

  try
  {
    const origin = new URL(requestOrigin).origin;
    const requestUrlOrigin = new URL(request.url).origin;
    return origin === requestUrlOrigin || origin === new URL(siteOrigin).origin;
  }
  catch
  {
    return false;
  }
}
