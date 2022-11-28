import { ReactElement, HTMLAttributes } from 'react';
import Markdown, { Components } from 'react-markdown';

import dayjs from 'dayjs';
import Image from 'next/image';

import Avatar from './Avatar';
import Anchor, { AnchorProps } from './Anchor';

import Post from '../models/Post';
import Author from '../models/Author';
import concat from '../util/concat';

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
  image: 'mrl-post-body__image',
  title: 'mrl-post-body__title',
  author: 'mrl-post-body__author',
  authorAvatar: 'mrl-post-body__author-avatar',
  authorName: 'mrl-post-body__author-name',
  publishingDate: 'mrl-post-body__publishing-date',
  contentDivider: 'mrl-post-body__content-divider',
  metadata: 'mrl-post-body__metadata',
};

const markdownOverrideComponents: Components = {
  a: ({ children, href, rel, target, ...attributes }) => (
    <Anchor href={href!} rel={rel as AnchorProps['rel']} target={target as AnchorProps['target']} {...attributes}>
      {children}
    </Anchor>
  ),
  img: ({ src, alt, width = 400, height = 300 }) => (
    <Image
      src={src!}
      alt={alt!}
      width={width as number}
      height={height as number}
      className={concat(classes.image, 'object-fill')}
      fill={true}
      quality={50}
    />
  ),
};
const notFoundMarkdownExpression = '**404** <br> Content not found.';

// MARK: - JSX
const PostBody = ({ post: { author, ...post }, className, ...attributes }: PostBodyProps): ReactElement | null => {
  return (
    <div className={concat(classes.root, 'max-w-2xl mx-auto flex flex-col min-h-screen')} {...attributes}>
      <h4 className={concat(classes.title, 'font-medium font-sans mb-1 text-2xl sm:text-left text-center')}>
        {post.title}
      </h4>
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
            <p className={concat(classes.authorName, 'font-sans font-normal text-gray-700')}>{author.name}</p>
          )}
        </div>
        <span className={concat(classes.publishingDate, 'flex items-center font-normal text-gray-700 text-sm')}>
          Published on&nbsp;<span className='font-medium text-sm'>{dayjs(post.createdAt).format('DD MMMM YYYY')}</span>
        </span>
      </div>
      <div className={concat(classes.contentDivider, 'w-[100%] h-[2px] bg-gray-100 my-3')} />
      <Markdown components={markdownOverrideComponents}>{post?.content ?? notFoundMarkdownExpression}</Markdown>
    </div>
  );
};

export default PostBody;
