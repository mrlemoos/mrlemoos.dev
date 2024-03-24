import type { Document } from '@contentful/rich-text-types';

/**
 * The `BlogPostModel` class is a domain model that represents a blog post
 * stored in the Content Management System (CMS).
 */
class BlogPostModel {
	constructor(
		/**
		 * The `id` property is a string that represents the unique identifier for
		 * the blog post.
		 */
		public readonly id: string,
		/**
		 * The `title` property is a string that represents the title of the blog
		 * post.
		 */
		public readonly title: string,
		/**
		 * The `description` property is an optional string that represents a small
		 * text - usually the first paragraph of the blog post - that describes the
		 * content of the blog post.
		 */
		public readonly description: string | undefined,
		/**
		 * The `content` property is a `Document` object that represents the content
		 * of the blog post.
		 *
		 * The `Document` object is a JSON object that represents the content of the
		 * blog post in a structured format that can be easily rendered by the
		 * application.
		 */
		public readonly content: Document,
		/**
		 * The `slug` property is a string that represents the unique identifier for
		 * the blog post.
		 *
		 * This property commonly reflects the title of the blog post in a URL
		 * friendly format. For example, the blog post with the title
		 * 'Hello, World!' would have a slug of 'hello-world'.
		 *
		 * @example 'hello-world'
		 */
		public readonly slug: string,
		/**
		 * The `tags` property is an array of strings that represent the tags that
		 * are associated with the blog post.
		 */
		public readonly tags: string[],
		/**
		 * The `createdAt` property is a `Date` object that represents the date and
		 * time at which the blog post was created.
		 */
		public readonly createdAt: Date,
	) {}
}

export default BlogPostModel;
