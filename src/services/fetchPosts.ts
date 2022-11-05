import ServiceSingleton from './ServiceSingleton';

import Post from '../models/Post';
import Author from '../models/Author';

// MARK: - Types
export interface FetchPostsSuccessfulContract {
  posts?: (Post & { author: Author })[];
}

export interface FetchPostsFailedContract {
  error?: string;
  errorStack?: string;
}

// MARK: - Constants
const endpoint = '/api/posts';

// MARK: - Asynchronous
const fetchPosts = async (): Promise<[FetchPostsSuccessfulContract, FetchPostsFailedContract]> => {
  const [{ data, error }] = await ServiceSingleton<FetchPostsSuccessfulContract, FetchPostsFailedContract, never>(
    `GET ${endpoint}`
  );

  console.log(JSON.stringify({ error }));

  return [data ?? {}, error ?? {}];
};

export default fetchPosts;
