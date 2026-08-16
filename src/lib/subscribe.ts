/** Resend's REST base. We talk to it with `fetch` rather than the `resend` SDK. */
export const RESEND_API_BASE = "https://api.resend.com" as const;

/** Bearer + JSON headers every Resend REST call needs. */
export function resendHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/** Minimal, deliberately permissive email shape check — Resend is the real validator. */
export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

interface AddContactDeps {
  apiKey: string;
  audienceId: string;
  fetchImpl?: typeof fetch;
}

export type AddContactResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

/**
 * Creates a contact in a Resend audience. Resend upserts by email, so a repeat
 * signup is a success, not an error.
 */
export async function addContactToAudience(
  email: string,
  { apiKey, audienceId, fetchImpl = fetch }: AddContactDeps
): Promise<AddContactResult> {
  const response = await fetchImpl(
    `${RESEND_API_BASE}/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: resendHeaders(apiKey),
      body: JSON.stringify({ email: email.trim().toLowerCase(), unsubscribed: false }),
    }
  );

  if (response.ok) return { ok: true };

  const body = await response.text();
  return { ok: false, status: response.status, message: body.slice(0, 500) };
}
