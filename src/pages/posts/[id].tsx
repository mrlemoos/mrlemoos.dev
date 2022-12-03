import { Fragment, useMemo } from 'react';

import Head from 'next/head';
import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import { PrismaClient } from '@prisma/client';

import Post from '../../models/Post';
import Author from '../../models/Author';
import PostBody from '../../components/PostBody';

interface PostByIdProps {
  contract: { post?: Post & { author: Author } };
}

const PostById: NextPage<PostByIdProps> = ({ contract }) => {
  const postDescription = useMemo(() => {
    if (!contract?.post?.content) {
      return 'The metadata for this post could not be found.';
    }

    return contract?.post.content.slice(0, 100);
  }, [contract?.post?.content]);

  const postURL = useMemo(
    () => (contract?.post?.id ? `https://mrlemoos.dev/posts/${contract?.post?.id}` : 'https://mrlemoos.dev/404'),
    [contract?.post?.id]
  );

  if (!contract?.post) {
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
        <title>{`mrlemoos - ${contract.post.title}`}</title>
        {typeof contract.post.content === 'string' && (
          <Fragment>
            <meta name='description' content={postDescription} />
            <meta property='og:description' content={postDescription} />
            <meta name='twitter:description' content={postDescription} />
          </Fragment>
        )}

        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <meta property='og:title' content={contract.post.title} />
        <meta property='og:image:alt' content={contract.post.title} />
        <meta property='og:image:width' content='1200' />

        <meta property='og:type' content='article' />
        <meta property='og:url' content={postURL} />

        <meta name='twitter:title' content={contract.post.title} />
        {typeof contract.post.bannerPhotoURL === 'string' && (
          <>
            <meta name='twitter:image' content={contract.post.bannerPhotoURL} />
            <meta property='og:image' content={contract.post.bannerPhotoURL} />
          </>
        )}
        <meta name='twitter:image:alt' content={contract.post.title} />

        <link rel='canonical' href={postURL} />

        {typeof contract.post.author.name === 'string' && <meta name='author' content={contract.post.author.name} />}
      </Head>
      {typeof contract.post.bannerPhotoURL === 'string' && (
        <div
          className='w-full h-24 md:h-72 bg-cover bg-center top-4 -z-10 bg-gradient-to-t dark:from-gray-900 from-white to-transparent'
          style={{ backgroundImage: `url(${contract.post.bannerPhotoURL})` }}
        />
      )}
      <main className={contract.post.bannerPhotoURL ? 'mt-24' : 'mt-60'}>
        <PostBody post={contract.post} />
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

  try {
    const client = new PrismaClient();
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
