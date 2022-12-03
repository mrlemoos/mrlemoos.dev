import { ReactElement, HTMLAttributes } from 'react';
import Markdown, { Components } from 'react-markdown';
import { PluggableList } from 'react-markdown/lib/react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import dayjs from 'dayjs';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';

import Avatar from './Avatar';
import Anchor, { AnchorProps } from './Anchor';

import Post from '../models/Post';
import Author from '../models/Author';
import concat from '../util/concat';
import Tag from './Tag';

// MARK: - Types
type HTMLDivElementAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;
export interface PostBodyProps extends OmittedHTMLDivElementAttributes {
  post: Post & { author: Author };
  children?: never;
}

// MARK: - Constants
const classes = {
  root: 'mrl-post-body',
  markdown: {
    image: 'mrl-post-body__markdown__image',
    anchor: 'mrl-post-body__markdown__anchor',
  },
  title: 'mrl-post-body__title',
  author: 'mrl-post-body__author',
  authorAvatar: 'mrl-post-body__author-avatar',
  authorName: 'mrl-post-body__author-name',
  publishingDate: 'mrl-post-body__publishing-date',
  contentDivider: 'mrl-post-body__content-divider',
  metadata: 'mrl-post-body__metadata',
};

const remarkPlugins: PluggableList = [remarkGfm];

const markdownOverrideComponents: Components = {
  a: ({ children, href, rel, target, ...attributes }) => (
    <Anchor
      href={href!}
      rel={rel as AnchorProps['rel']}
      className='text-blue-700 dark:text-blue-500'
      target={target as AnchorProps['target']}
      {...attributes}
    >
      {children}
    </Anchor>
  ),
  img: ({ src, alt, width = 400, height = 300, className }) => (
    <Image
      src={src!}
      alt={alt!}
      width={width as number}
      height={height as number}
      className={concat(classes.markdown.image, 'object-fill', className)}
      fill={true}
      quality={50}
    />
  ),
  // code: ({ node, inline, className, children, ...attributes }) => {
  //   const match = /language-(\w+)/.exec(className || '');
  //   return !inline && match ? (
  //     <SyntaxHighlighter
  //       children={String(children).replace(/\n$/, '')}
  //       style={dark as any} // This is a bug in the types from react-syntax-highlighter
  //       language={match[1]}
  //       PreTag='div'
  //       {...attributes}
  //     />
  //   ) : (
  //     <code className={className} {...attributes}>
  //       {children}
  //     </code>
  //   );
  // },
};
const notFoundMarkdownExpression = '**404** <br> Content not found.';

// MARK: - Function
function formatPublishedAt(date?: string): string | undefined {
  if (!date) {
    return undefined;
  }

  const dateFormat = 'DD MMMM YYYY';

  const publishedAt = dayjs(date);
  const formattedPublishedAt = publishedAt.format(dateFormat);

  return formattedPublishedAt;
}

function coerceMarkdownContent(markdownContent: string | null): string {
  return markdownContent ?? notFoundMarkdownExpression;
}

// MARK: - JSX
const PostBody = ({ post: { author, ...post }, className, ...attributes }: PostBodyProps): ReactElement | null => {
  return (
    <div
      className={concat(classes.root, 'sm: max-w-3xl xl:max-w-5xl mx-auto flex flex-col min-h-screen')}
      {...attributes}
    >
      <h1
        className={concat(
          classes.title,
          'font-medium text-black dark:text-white font-sans mb-1 text-3xl text-center dark:font-semibold'
        )}
      >
        {post.title}
      </h1>
      <div className={concat(classes.metadata, 'flex flex-col items-center my-0 md:my-4')}>
        <div className={concat(classes.author, 'flex flex-col gap-1 items-center')}>
          {typeof author?.photoURL === 'string' && (
            <Avatar
              src={author.photoURL}
              alt={`${author.name}'s avatar`}
              width={32}
              height={32}
              className={concat(classes.authorAvatar, 'mb-1')}
            />
          )}
          {typeof author?.name === 'string' && (
            <p className={concat(classes.authorName, 'font-sans font-normal text-gray-700 dark:text-gray-300')}>
              {author.name}
            </p>
          )}
        </div>
        <span
          className={concat(
            classes.publishingDate,
            'flex items-center font-normal text-gray-700 dark:text-gray-300 text-sm'
          )}
        >
          Published on&nbsp;
          <span className='font-medium text-sm'>{formatPublishedAt(post.createdAt.toISOString())}</span>
        </span>
      </div>
      <div className={concat(classes.contentDivider, 'w-[100%] h-[2px] bg-gray-100 my-3')} />
      <Markdown
        components={markdownOverrideComponents}
        remarkPlugins={remarkPlugins}
        children={coerceMarkdownContent(post?.content)}
        className='text-black dark:text-white'
      />
      <div className='flex items-center gap-2 justify-end mt-12'>
        {post.tags?.split(', ').map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
};

export default PostBody;
