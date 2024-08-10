import 'server-only';

import type { Document as RichTextDocument } from '@contentful/rich-text-types';
import { createClient, type Entry } from 'contentful';

import BlogPostModel from '~/domains/blog-post/models/blog-post-model';
import env from '~/domains/environment/env';
import { date } from '~/util/datetime';

import RemoteCMSRepository from '../remote-cms-repository';

/**
 * The `ContentfulRemoteCMSRepository` class is a concrete implementation of the
 * `RemoteCMSRepository` abstract class that interacts with the Contentful
 * Content Delivery API to fetch blog posts.
 */
export default class ContentfulRemoteCMSRepository extends RemoteCMSRepository {
	private readonly CONTENTFUL_SPACE_ID = env('CONTENTFUL_SPACE_ID');
	private readonly CONTENTFUL_ACCESS_TOKEN = env('CONTENTFUL_ACCESS_TOKEN');

	/**
	 * @internal The `transformEntryIntoBlogPostModel()` function transforms a
	 *           Contentful entry object into a `BlogPostModel` object.
	 */
	private transformEntryIntoBlogPostModel(entry: Entry): BlogPostModel {
		const id = entry.sys.id;
		const title = entry.fields.title as string;
		const description = entry.fields.description as string | undefined;
		const content = entry.fields.content as RichTextDocument;
		const slug_ = entry.fields.slug as string;
		const tags = entry.metadata.tags.map(
			(tag) => tag.sys.id,
		) as BlogPostModel['tags'];
		const createdAt = date(entry.sys.createdAt).toDate();

		return new BlogPostModel(
			id,
			title,
			description,
			content,
			slug_,
			tags,
			createdAt,
		);
	}

	/**
	 * @internal The `CONTENT_CLIENT` is an instance of the Contentful client that
	 *           is used to interact with the Contentful Content Delivery API.
	 *
	 *           Contentful provides a few different APIs and they have different
	 *           purposes and access tokens that are used to interact with them.
	 *
	 *           This client is used to interact with the Contentful Content
	 *           _Delivery_ API. This API is used to fetch content from the
	 *           Contentful CMS. See more at:
	 *           https://www.contentful.com/developers/docs/references/content-delivery-api/
	 */
	private readonly CONTENT_CLIENT = createClient({
		space: this.CONTENTFUL_SPACE_ID,
		accessToken: this.CONTENTFUL_ACCESS_TOKEN,
	});

	private CMS_CONTENT_TYPE_NAME = 'blogPost' as const;

	/**
	 * @internal The `FETCH_POST_SLUGS_QUERY` is the query object that is used to
	 *           fetch the slugs of all blog posts from the Contentful CMS.
	 *
	 *           This applies an object structure which is later translated into a
	 *           GraphQL query by the Contentful client.
	 */
	private FETCH_POST_SLUGS_QUERY = {
		content_type: this.CMS_CONTENT_TYPE_NAME,
		select: 'fields.slug',
	} as const;

	/**
	 * @inheritdoc
	 */
	async fetchPostSlugs(): Promise<{ slug: BlogPostModel['slug'] }[]> {
		const articles = await this.CONTENT_CLIENT.getEntries(
			this.FETCH_POST_SLUGS_QUERY,
		);

		return articles.items.map((article) => ({
			slug: article.fields.slug as string,
		}));
	}

	/**
	 * @internal The `createFetchBlogPostQuery()` method creates a query object
	 *           that is used to fetch a single blog post from the Contentful CMS.
	 *
	 *           The value returned by this function applies an object structure
	 *           which is later translated into a GraphQL query by the Contentful
	 *           client.
	 */
	private createFetchBlogPostQuery(slug: string) {
		const queryOptions = {
			content_type: this.CMS_CONTENT_TYPE_NAME,
			'fields.slug': slug,
		} as const;

		return queryOptions;
	}

	/**
	 * @inheritdoc
	 */
	async fetchBlogPost(slug: string): Promise<BlogPostModel> {
		const articles = await this.CONTENT_CLIENT.getEntries(
			this.createFetchBlogPostQuery(slug),
		);

		const rawArticle = articles.items[0];

		if (!rawArticle) {
			throw new Error(
				`No article found with slug: ${slug}. Please check the slug passed to the new RemoteCMSRepository().fetchBlogPost("${slug}") method.`,
			);
		}

		return this.transformEntryIntoBlogPostModel(rawArticle);
	}

	/**
	 * @internal The `FETCH_BLOG_POSTS_QUERY` constant is the query object that is
	 *           used to fetch all blog posts from the Contentful CMS.
	 *
	 *           This applies an object structure which is later translated into a
	 *           GraphQL query by the Contentful client.
	 */
	private FETCH_BLOG_POSTS_QUERY = {
		content_type: 'blogPost',
		order: '-sys.createdAt',
	} as const;

	/**
	 * @inheritdoc
	 */
	async fetchBlogPosts(): Promise<BlogPostModel[]> {
		const articles = await this.CONTENT_CLIENT.getEntries(
			this.FETCH_BLOG_POSTS_QUERY,
		);

		return articles.items.map(this.transformEntryIntoBlogPostModel);
	}
}
