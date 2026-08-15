import type { APIRoute } from "astro";
import { addContactToAudience, isValidEmail } from "@/lib/subscribe";

export const prerender = false;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("[subscribe] RESEND_API_KEY or RESEND_AUDIENCE_ID missing");
    return json({ error: "Subscriptions are not configured." }, 500);
  }

  let email: unknown;
  let honeypot: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body?.email;
      honeypot = body?.company;
    } else {
      const form = await request.formData();
      email = form.get("email");
      honeypot = form.get("company");
    }
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // ponytail: honeypot only. Add rate limiting / Turnstile if bots find it.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true }, 201);
  }

  if (!isValidEmail(email)) {
    return json({ error: "That email doesn't look right." }, 400);
  }

  const result = await addContactToAudience(email, { apiKey, audienceId });

  if (!result.ok) {
    console.error("[subscribe] Resend error", result.status, result.message);
    return json({ error: "Couldn't sign you up right now. Try again later." }, 502);
  }

  return json({ ok: true }, 201);
};
