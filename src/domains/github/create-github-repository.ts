import GraphQLGitHubRepository from './_/graphql-github-repository';
import type GitHubRepository from './github-repository';

/**
 * The `createGitHubRepository()` function creates and returns a new instance of
 * the `GitHubRepository` base class.
 */
export default function createGitHubRepository(
	GitHubRepositoryImpl: new () => GitHubRepository = GraphQLGitHubRepository,
): GitHubRepository {
	return new GitHubRepositoryImpl();
}
