import assert from "node:assert/strict";
import test from "node:test";
import { supportedLocales } from "../src/i18n/locales";
import { createConfirmationEmail } from "../src/worker/newsletter/copy";
import {
  createConfirmationToken,
  hashConfirmationToken,
  isConfirmationToken,
} from "../src/worker/newsletter/crypto";
import {
  normalizeNewsletterEmail,
  normalizeNewsletterSourcePath,
} from "../src/worker/newsletter/service";
import { verifyResendWebhookSignature } from "../src/worker/newsletter/webhook";

test("confirmation tokens have 256 bits of URL-safe entropy", async () =>
{
  const firstToken = createConfirmationToken();
  const secondToken = createConfirmationToken();

  assert.match(firstToken, /^[A-Za-z0-9_-]{43}$/u);
  assert.equal(isConfirmationToken(firstToken), true);
  assert.notEqual(firstToken, secondToken);
  assert.match(await hashConfirmationToken(firstToken), /^[a-f0-9]{64}$/u);
  assert.notEqual(await hashConfirmationToken(firstToken), await hashConfirmationToken(secondToken));
});

test("newsletter email normalization rejects malformed and oversized addresses", () =>
{
  assert.equal(normalizeNewsletterEmail(" Reader@Example.COM "), "reader@example.com");
  assert.equal(normalizeNewsletterEmail("reader@example"), null);
  assert.equal(normalizeNewsletterEmail("reader @example.com"), null);
  assert.equal(normalizeNewsletterEmail(`reader@${"a".repeat(250)}.com`), null);
  assert.equal(normalizeNewsletterEmail(null), null);
});

test("source paths are constrained to local absolute paths without queries", () =>
{
  assert.equal(normalizeNewsletterSourcePath("/en/2026/07/13/example/?source=cta"), "/en/2026/07/13/example/");
  assert.equal(normalizeNewsletterSourcePath("https://attacker.example/path"), null);
  assert.equal(normalizeNewsletterSourcePath("//attacker.example/path"), null);
  assert.equal(normalizeNewsletterSourcePath("relative/path"), null);
});

test("confirmation email copy exists for every supported locale and escapes URLs", () =>
{
  for (const locale of supportedLocales)
  {
    const email = createConfirmationEmail(locale, "https://digows.com/confirm?token=a&next=\"bad\"");
    assert.ok(email.subject.length > 0);
    assert.match(email.text, /https:\/\/digows\.com/u);
    assert.match(email.html, /&amp;/u);
    assert.match(email.html, /&quot;/u);
    assert.doesNotMatch(email.html, /next="bad"/u);
  }
});

test("Resend webhook signatures require the exact body and a recent timestamp", async () =>
{
  const signingKey = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
  const secret = `whsec_${toBase64(signingKey)}`;
  const payload = JSON.stringify({ type: "contact.updated", data: { id: "example" } });
  const messageId = "msg_01JTESTNEWSLETTER";
  const timestamp = 1_800_000_000;
  const signature = await createWebhookSignature(signingKey, messageId, timestamp, payload);
  const headers = {
    id: messageId,
    timestamp: `${timestamp}`,
    signature: `v1,${signature}`,
  } as const;

  assert.equal(await verifyResendWebhookSignature(payload, headers, secret, timestamp), true);
  assert.equal(await verifyResendWebhookSignature(`${payload} `, headers, secret, timestamp), false);
  assert.equal(await verifyResendWebhookSignature(payload, headers, secret, timestamp + 301), false);
  assert.equal(await verifyResendWebhookSignature(payload, headers, "invalid", timestamp), false);
});

async function createWebhookSignature(
  signingKey: Uint8Array,
  messageId: string,
  timestamp: number,
  payload: string,
): Promise<string>
{
  const key = await crypto.subtle.importKey(
    "raw",
    signingKey.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${messageId}.${timestamp}.${payload}`),
  );
  return toBase64(new Uint8Array(signature));
}

function toBase64(value: Uint8Array): string
{
  return btoa(Array.from(value, (byte) => String.fromCharCode(byte)).join(""));
}
