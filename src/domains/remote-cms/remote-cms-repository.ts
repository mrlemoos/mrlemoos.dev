import 'server-only'

import type BlogPostModel from "../blog-post/models/blog-post-model";

/**
 * The `RemoteCMSRepository` abstract class defines the interface for a remote
 * Content Management System (CMS) repository.
 */
export default abstract class RemoteCMSRepository {
  /**
   * The `fetchPostSlugs()` method fetches the slugs of all blog posts from the
   * remote Content Management System (CMS).
   */
  abstract fetchPostSlugs(): Promise<{ slug: BlogPostModel['slug'] }[]>;
  /**
   * The `fetchBlogPost()` method fetches a blog post from the remote Content
   * Management System (CMS) by the indexed slug string passed as the argument.
   */
  abstract fetchBlogPost(slug: string): Promise<BlogPostModel>;
  /**
   * The `fetchBlogPosts()` method fetches all blog posts from the remote 
   * Content Management System (CMS).
   */
  abstract fetchBlogPosts(): Promise<BlogPostModel[]>
}
