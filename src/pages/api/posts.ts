import { Post, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type GetPostsHandlerResponseBody =
  | {
      posts: Post[];
    }
  | {
      error: string;
      errorStack?: string;
    };

async function getPostsHandler(_: NextApiRequest, response: NextApiResponse<GetPostsHandlerResponseBody>) {
  const client = new PrismaClient();

  try {
    const posts = await client.post.findMany({
      include: {
        author: true,
      },
    });

    return response.status(200).json({ posts });
  } catch (error_) {
    let errorStack: string | undefined;

    if (error_ instanceof Error) {
      errorStack = error_.message;

      if (error_.stack) {
        errorStack += ` (${error_.stack})`;
      }
    }

    return response.status(500).json({
      error: 'We could not find the posts.',
      errorStack,
    });
  }
}

export default getPostsHandler;
