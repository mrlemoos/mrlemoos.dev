/**
 * Copy and state resolution for the subscribe form's client-side states.
 * Kept apart from `subscribe.ts` so the browser only ships these few bytes.
 */

/** Visual state the form advertises through `data-state`. */
export type SubscribeState = "idle" | "loading" | "success" | "error";

export const SUBSCRIBE_MESSAGES = {
  loading: "Signing you up…",
  success: "You're in. Watch your inbox.",
  failure: "Something went wrong. Try again.",
  network: "No connection. Try again.",
} as const;

interface SubscribeResponse {
  /** Whether the API accepted the signup. */
  ok: boolean;
  /** Error copy the API returned, if any. */
  error?: unknown;
  /** True when the request never reached the API at all. */
  network?: boolean;
}

export interface SubscribeOutcome {
  state: Extract<SubscribeState, "success" | "error">;
  message: string;
}

/** Maps an API response (or a failed round trip) onto a state and a message. */
export function subscribeOutcome({ ok, error, network }: SubscribeResponse): SubscribeOutcome {
  if (network) {
    return { state: "error", message: SUBSCRIBE_MESSAGES.network };
  }
  if (ok) {
    return { state: "success", message: SUBSCRIBE_MESSAGES.success };
  }

  const served = typeof error === "string" ? error.trim() : "";
  return { state: "error", message: served || SUBSCRIBE_MESSAGES.failure };
}
