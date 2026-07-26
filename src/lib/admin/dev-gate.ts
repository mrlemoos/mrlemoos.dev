export function assertAdminDevOnly(isDev: boolean): void {
  if (!isDev) {
    throw new Error("Local Admin is not available outside development");
  }
}

export function adminNotFoundResponse(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function requireAdminDev(isDev: boolean): Response | null {
  if (isDev) {
    return null;
  }
  return adminNotFoundResponse();
}
