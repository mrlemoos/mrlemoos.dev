import { useCallback, MouseEvent as ReactMouseEvent, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { NextPage, GetStaticProps } from 'next';
import { PrismaClient } from '@prisma/client';
import Head from 'next/head';

import Anchor from '../components/Anchor';
import Avatar from '../components/Avatar';
import CallToAction from '../components/CallToAction';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Text from '../components/Text';
import Tag from '../components/Tag';
import Spinner from '../components/Spinner';
import Post from '../models/Post';
import Author from '../models/Author';
import { useMediaQuery } from '../util/useMediaQuery';

// MARK: - Types
interface HomepageProps {
  contract: [{ posts: (Post & { author: Author })[] }, { error?: Error }];
}

// MARK: - Constants
const latestArticlesId = 'latest-articles';
const description =
  'MrLemoos is a blog where you find the latest articles about web development, programming, and more.';

// MARK: - JSX
const Homepage: NextPage<HomepageProps> = ({ contract: [{ posts }, { error }] }) => {
  const [isRedirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const isDarkMode = useMediaQuery('prefers-color-scheme: dark');

  const handleScrollDownToLatestArticles = useCallback(
    () => async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!Array.isArray(posts)) {
        return;
      }

      const latestPost = posts[0];

      if (!latestPost) {
        return;
      }

      const pathname = `/posts/${latestPost.id}`;

      setRedirecting(true);
      await router.push(pathname);
      setRedirecting(false);
    },
    [posts]
  );

  const hasError = useMemo(() => typeof error?.message === 'string', [error]);

  return (
    <>
      <Head>
        <meta name='description' content={description} />
        <meta property='og:description' content={description} />
        <meta name='twitter:description' content={description} />

        <meta name='theme-color' content={isDarkMode ? '#000' : '#fff'} />
      </Head>
      <main className='min-h-[100vh]'>
        <div className='bg-gradient-to-b from-indigo-200 dark:from-indigo-600 to-white dark:to-gray-900 flex flex-col h-[100%]'>
          <div className='flex items-center justify-center h-[50vh] flex-wrap gap-3'>
            <Text
              as='h1'
              className='font-extrabold text-black dark:text-white text-xl sm:text-5xl select-none cursor-default'
            >
              Some tips for your
              <br />
              <span className='text-indigo-900 dark:text-indigo-100'>next line of code</span> 🧑🏻‍💻
            </Text>
            {!hasError && (
              <div className='hidden md:flex items-center gap-3'>
                <div className='w-2 h-24 bg-indigo-900 dark:bg-indigo-100' />
                <CallToAction onClick={handleScrollDownToLatestArticles()}>
                  {isRedirecting && <Spinner className='mr-1' />}
                  <Text>Read the latest article! 🏁</Text>
                </CallToAction>
              </div>
            )}
          </div>

          <div className='flex items-center justify-center gap-3'>
            {hasError && (
              <div className='bg-white border-2 dark:bg-gray-700 border-red-100 rounded-lg p-3 flex items-center gap-2 text-red-800 dark:text-red-200'>
                <Icon path='ExclamationTriangleIcon' height={28} width={28} />
                <Text>{error!.message}</Text>
              </div>
            )}
            <div id={latestArticlesId} className='flex flex-col sm:flex-row items-center justify-center gap-3'>
              {posts?.slice(0, 3).map(({ id, title, content, author, tags }) => {
                const teaser = typeof content === 'string' ? content.replace(/[^\w\s]/g, '') : '';
                const renderKey = id;

                const tagsToRender = tags?.split(', ');

                return (
                  <Anchor rel='noreferrer' target='_self' href={`/posts/${id}`} key={renderKey}>
                    <Card className='select-none md:w-[330px] h-[240px] flex flex-col justify-between'>
                      <div>
                        <Text as='h2' className='font-semibold text-black dark:text-white text-xl text-start'>
                          {title}
                        </Text>
                        <Text
                          as='p'
                          className='text-gray-600 dark:text-gray-200 text-md text-start max-h-[70px] overflow-hidden'
                        >
                          {`${teaser}...`}
                        </Text>
                      </div>
                      <div className='flex justify-between items-center'>
                        {typeof author.photoURL === 'string' && (
                          <div className='flex items-center gap-2 md:mt-3' key={author.id}>
                            <Avatar src={author.photoURL} alt={`${author.name}'s photo`} height={28} width={28} />
                            <Text className='text-gray-500 dark:text-gray-100 text-xs'>{author.name}</Text>
                          </div>
                        )}
                      </div>
                      <div className='flex items-center justify-end gap-1'>
                        {tagsToRender?.map((tag) => (
                          <Tag key={tag}>
                            <Text>{tag}</Text>
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </Anchor>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const client = new PrismaClient();

  try {
    const posts = await client.post.findMany({
      include: {
        author: true,
      },
      where: {
        published: true,
      },
    });

    return {
      props: {
        contract: [{ posts }, {}],
      },
    };
  } catch (error_: unknown) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_), { cause: error_ });

    return {
      props: {
        contract: [{ posts: [] }, { error }],
      },
    };
  }
};

export default Homepage;
