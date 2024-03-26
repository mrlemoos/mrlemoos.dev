/**
 * The `NODE_ENVIRONMENTS` constant is an array of possible values for the
 * `NODE_ENV` environment variable.
 */
const NODE_ENVIRONMENTS = ['development', 'production', 'test'] as const;

/**
 * The `NodeEnvironment` is a type that represents the possible values for the
 * `NODE_ENV` environment variable.
 */
type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];

/**
 * The `VERCEL_ENVIRONMENTS` constant is an array of possible values for the
 * `VERCEL_ENV` environment variable.
 */
const VERCEL_ENVIRONMENTS = ['production', 'preview', 'development'] as const;

/**
 * The `VercelEnvironment` is a type that represents the possible values for the
 * `VERCEL_ENV` environment variable. It is set by Vercel to indicate the
 * environment in which the application is running.
 */
export type VercelEnvironment = (typeof VERCEL_ENVIRONMENTS)[number];

/**
 * The `EnvironmentVariables` type is a type that represents the environment
 * variables that are available to the application.
 */
export interface EnvironmentVariables {
	/**
	 * The `PORT` environment variable is a string that represents the port on
	 * which the application will listen for incoming requests.
	 *
	 * @ignore This should only be used by Next.js.
	 */
	PORT: `${string}`;
	/**
	 * The `NODE_ENV` environment variable is a string that represents the
	 * environment in which the application is running.
	 *
	 * @example 'development'
	 */
	NODE_ENV: NodeEnvironment;
	/**
	 * The `VERCEL_ENV` environment variable is a string that represents the
	 * environment in which the application is running. It is set by Vercel to
	 * indicate the environment in which the application is running.
	 *
	 * @example 'production'
	 */
	VERCEL_ENV: VercelEnvironment;
	/**
	 * The `NEXT_PUBLIC_VERCEL_URL` environment variable is a string that
	 * represents the URL of the Vercel deployment.
	 *
	 * It does not include the protocol.
	 *
	 * @example 'example.vercel.app'
	 */
	NEXT_PUBLIC_VERCEL_URL: string;
	/**
	 * The `VERCEL_URL` environment variable is a string that represents the URL
	 * of the Vercel deployment.
	 */
	VERCEL_URL: string;
	/**
	 * The `CONTENTFUL_SPACE_ID` is the space ID that is used to identify the
	 * space in the Contentful CMS.
	 */
	CONTENTFUL_SPACE_ID: string;
	/**
	 * The `CONTENTFUL_ACCESS_TOKEN` is the access token that is used to
	 * authenticate with the Contentful Content Delivery API.
	 */
	CONTENTFUL_ACCESS_TOKEN: string;
	/**
	 * The `GITHUB_ACCESS_TOKEN` is the personal access token that is used to
	 * access the GitHub API.
	 */
	GITHUB_ACCESS_TOKEN: string;
}

/**
 * The `EnvironmentVariables` type is a string literal which represents the key
 * of the environment variables that are available to the application.
 *
 * @example 'NODE_ENV'
 */
export type EnvironmentVariableName = keyof EnvironmentVariables;

/**
 * @ignore
 */
declare namespace NodeJS {
	interface ProcessEnv extends EnvironmentVariables {}
}

/**
 * The `env()` function is returns the value of the environment variables that
 * are available to the application.
 */
function env<E extends EnvironmentVariableName>(
	name: E,
): EnvironmentVariables[E] {
	return process.env[name] as EnvironmentVariables[E];
}

export default env;
