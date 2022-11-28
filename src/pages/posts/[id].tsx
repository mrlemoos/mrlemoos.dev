import { Fragment } from 'react';

import Head from 'next/head';
import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import { PrismaClient } from '@prisma/client';

import Post from '../../models/Post';
import Author from '../../models/Author';
import PostBody from '../../components/PostBody';
import Image from 'next/image';

interface PostByIdProps {
  contract: { post?: Post & { author: Author } };
}

const PostById: NextPage<PostByIdProps> = ({ contract: { post } }) => {
  if (!post) {
    return (
      <Fragment>
        <Head>
          <title>mrlemoos - Sorry, post not found 🥺</title>
        </Head>
        <main className='flex items-center justify-center flex-col'>
          <h5 className='text-2xl font-semibold'>404</h5>
          <p className='text-lg'>Post not found</p>
        </main>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>{`mrlemoos - ${post.title}`}</title>
        {typeof post.content === 'string' && (
          <Fragment>
            <meta name='description' content={post.content.slice(0, 100)} />
            <meta property='og:description' content={post.content.slice(0, 100)} />
            <meta name='twitter:description' content={post.content.slice(0, 100)} />
          </Fragment>
        )}

        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <meta property='og:title' content={post.title} />
        {/* <meta property='og:image' content={post.imageURL} /> */}
        <meta property='og:image:alt' content={post.title} />
        <meta property='og:image:width' content='1200' />

        <meta property='og:type' content='article' />
        <meta property='og:url' content={`https://mrlemoos.com/posts/${post.id}`} />

        <meta name='twitter:title' content={post.title} />
        {/* <meta name='twitter:image' content={post.imageURL} /> */}
        <meta name='twitter:image:alt' content={post.title} />

        <link rel='canonical' href={`https://mrlemoos.com/posts/${post.id}`} />

        {typeof post.author.name === 'string' && <meta name='author' content={post.author.name} />}
      </Head>
      {typeof post.bannerPhotoURL === 'string' && (
        <div className='relative w-full h-96'>
          <Image
            src={post.bannerPhotoURL}
            alt={`${post.title} banner photo by ${post.bannerPhotoCredits ?? 'unknown artist'}`}
          />
        </div>
      )}
      <main className='mt-60'>
        <PostBody post={post} />
      </main>
    </Fragment>
  );
};

type PostByIdPropsGetStaticPropsContextResult = PostByIdProps;

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();

  const posts = await prisma.post.findMany({
    select: { id: true },
  });

  const paths = posts.map(({ id }) => ({ params: { id } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostByIdPropsGetStaticPropsContextResult> = async ({ params }) => {
  if (!params?.id) {
    return {
      props: {
        contract: {},
      },
    };
  }

  const client = new PrismaClient();

  try {
    const post = await client.post.findFirst({
      where: {
        published: true,
        id: params.id as string,
      },
      include: {
        author: true,
      },
    });

    return {
      props: {
        contract: { post: post ?? undefined },
      },
    };
  } catch {
    return {
      props: {
        contract: { post: undefined },
      },
    };
  }
};

export default PostById;
