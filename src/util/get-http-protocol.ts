import env from "~/domains/environment/env";

/**
 * The `getHttpProtocol()` function is a function that returns the HTTP protocol
 * based on the `VERCEL_ENV` environment variable. If the `VERCEL_ENV` 
 * environment variable is set to `development`, the function returns `http`;
 * otherwise, it returns `https`.
 */
function getHttpProtocol(): 'https' | 'http' {
  return env('VERCEL_ENV') === 'development' ? 'http' : 'https';
}

export default getHttpProtocol