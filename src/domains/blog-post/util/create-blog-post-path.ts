/**
 * The `createBlogPostPath()` function creates the path to a blog post based on
 * its slug.
 */
function createBlogPostPath(slug: string): string {
	return `/posts/${slug}`;
}

export default createBlogPostPath;
