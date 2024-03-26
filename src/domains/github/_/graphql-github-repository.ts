import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import env from '~/domains/environment/env';

import GitHubRepository from '../github-repository';
import GitHubPinnedRepositoryModel from '../models/github-pinned-repository-model';

/**
 * @internal The `PartialGitHubUser` is a partial and selective representation
 *           of a GitHub user.
 */
interface PartialGitHubUser {
	pinnedItems: {
		totalCount: number;
		edges: {
			node: {
				name: string;
				description: string;
				id: string;
				url: string;
				stargazers: {
					totalCount: number;
				};
			};
		}[];
	};
}

/**
 * The `GraphQLGitHubRepository` class is an implementation of the
 * `GitHubRepository` interface that uses the Apollo Client to fetch pinned
 * repositories from the GitHub GraphQL API.
 */
export default class GraphQLGitHubRepository extends GitHubRepository {
	private readonly GITHUB_ACCESS_TOKEN = env('GITHUB_ACCESS_TOKEN');
	private readonly HTTP_LINK = createHttpLink({
		uri: 'https://api.github.com/graphql',
	});
	private readonly AUTH_CONTEXT = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: `Bearer ${this.GITHUB_ACCESS_TOKEN}`,
			},
		};
	});

	private readonly CLIENT = new ApolloClient({
		link: this.AUTH_CONTEXT.concat(this.HTTP_LINK),
		cache: new InMemoryCache(),
	});

	/**
	 * @inheritdoc
	 */
	async fetchPinnedRepositories(
		username: string,
		limit = 6,
	): Promise<GitHubPinnedRepositoryModel[]> {
		try {
			const { data } = await this.CLIENT.query<{ user: PartialGitHubUser }>({
				query: gql`
      {
        user(login: "${username}") {
          pinnedItems(first: ${limit}, types: [REPOSITORY]) {
            totalCount
            edges {
              node {
                ... on Repository {
                  name
                  description
                  id
                  url
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    `,
			});

			if (!data.user) {
				return [];
			}

			const pinnedItems = data.user.pinnedItems.edges.map(
				({ node: { id, name, description, stargazers, url } }) =>
					new GitHubPinnedRepositoryModel(
						id,
						name,
						description,
						url,
						stargazers.totalCount,
					),
			);

			return pinnedItems;
		} catch (error) {
			console.error(
				`ERROR: An error occurred while fetching pinned repositories: ${error}`,
			);
		}
		return [];
	}
}
