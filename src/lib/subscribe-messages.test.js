import { describe, expect, it } from "vitest";
import {
  SUBSCRIBE_MESSAGES,
  subscribeOutcome,
} from "./subscribe-messages.ts";

describe("subscribeOutcome", () => {
  it("reports success when the request was accepted", () => {
    expect(subscribeOutcome({ ok: true })).toEqual({
      state: "success",
      message: SUBSCRIBE_MESSAGES.success,
    });
  });

  it("prefers the server's own error copy", () => {
    expect(subscribeOutcome({ ok: false, error: "That address looks off." })).toEqual({
      state: "error",
      message: "That address looks off.",
    });
  });

  it("falls back to generic copy when the server sends no usable error", () => {
    for (const error of [undefined, null, "", "   ", 42]) {
      expect(subscribeOutcome({ ok: false, error })).toEqual({
        state: "error",
        message: SUBSCRIBE_MESSAGES.failure,
      });
    }
  });

  it("trims server error copy", () => {
    expect(subscribeOutcome({ ok: false, error: "  Too many tries.  " }).message).toBe(
      "Too many tries."
    );
  });

  it("reports a network error when the request never landed", () => {
    expect(subscribeOutcome({ ok: false, network: true, error: "ignored" })).toEqual({
      state: "error",
      message: SUBSCRIBE_MESSAGES.network,
    });
  });
});
