import { describe, expect, it, vi } from "vitest";
import { addContactToAudience, isValidEmail } from "./subscribe.ts";

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("leo@mrlemoos.dev")).toBe(true);
  });

  it.each([["", "no-at"], ["a@b", "no TLD"], ["a b@c.dev", "space"], [null, "null"]])(
    "rejects %s",
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    }
  );
});

const fakeResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => body,
});

describe("addContactToAudience", () => {
  const deps = { apiKey: "re_test", audienceId: "aud_1" };

  it("posts a normalised email to the audience endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(201, "{}"));

    const result = await addContactToAudience("  LEO@Mrlemoos.dev ", { ...deps, fetchImpl });

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.resend.com/audiences/aud_1/contacts");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body)).toEqual({
      email: "leo@mrlemoos.dev",
      unsubscribed: false,
    });
  });

  it("reports failures with status and body", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(422, "nope"));

    const result = await addContactToAudience("leo@mrlemoos.dev", { ...deps, fetchImpl });

    expect(result).toEqual({ ok: false, status: 422, message: "nope" });
  });
});
