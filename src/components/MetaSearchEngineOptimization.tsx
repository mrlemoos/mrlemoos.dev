import { ReactElement } from 'react';

import { DefaultSeo as NextSEO } from 'next-seo';
import { OpenGraph, Twitter } from 'next-seo/lib/types';

const baseURL = 'https://mrlemoos.dev/';

const title = 'Mr. Lemos';
const description = 'Some tips for your next line of code 🧑🏻‍💻';
const openGraph: OpenGraph = {
  type: 'website',
  locale: 'en_US',
  url: 'https://mrlemoos.dev/',
  siteName: 'Mr. Lemos',
  profile: {
    firstName: 'Leonardo',
    lastName: 'Lemos',
    gender: 'male',
    username: 'mrlemoos',
  },
  description,
  images: [
    {
      url: 'https://mrlemoos.dev/og-image.png',
      width: 1200,
    },
  ],
};
const themeColor = '#fff';
const canonical = baseURL;

const twitter: Twitter = {
  site: baseURL,
  cardType: 'summary_large_image',
  handle: '@mrlemoos',
};

const MetaSearchEngineOptimization = (): ReactElement => (
  <NextSEO
    openGraph={openGraph}
    title={title}
    description={description}
    themeColor={themeColor}
    defaultTitle={title}
    twitter={twitter}
    canonical={canonical}
  />
);

export default MetaSearchEngineOptimization;
