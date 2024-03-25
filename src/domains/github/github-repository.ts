import type GitHubPinnedRepositoryModel from './models/github-pinned-repository-model';

export default abstract class GitHubRepository {
	/**
	 * The `fetchPinnedRepositories()` method fetches a list of pinned
	 * repositories from GitHub for a given username.
	 */
	abstract fetchPinnedRepositories(
		/**
		 * The user name of the GitHub user to fetch pinned repositories for.
		 */
		username: string,
		/**
		 * The maximum number of pinned repositories to fetch.
		 *
		 * If not provided, this argument defaults to `6`.
		 *
		 * @default 6
		 */
		limit?: number,
	): Promise<GitHubPinnedRepositoryModel[]>;
}
