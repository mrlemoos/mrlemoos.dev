/**
 * The `GitHubPinnedRepository` class represents a pinned repository from
 * GitHub.
 */
export default class GitHubPinnedRepositoryModel {
	constructor(
		/**
		 * The identifier of the repository.
		 */
		public readonly id: string,
		/**
		 * The name of the repository from GitHub.
		 */
		public readonly name: string,
		/**
		 * The description of the repository from GitHub.
		 */
		public readonly description: string,
		/**
		 * The URL of the repository hosted on GitHub.
		 */
		public readonly remoteURL: string,
		/**
		 * The number of stars the repository has.
		 */
		public readonly stars: number,
	) {}
}
