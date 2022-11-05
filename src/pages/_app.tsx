import { ReactElement } from 'react';

import Head from 'next/head';
import { AppProps } from 'next/app';

import HeaderWithActions from '../components/HeaderWithActions';

import '../styles/globals.css';
import Footer from '../components/Footer';

// MARK: - Constants
const meta = {
  title: 'Leo Lemos’ Blog',
  description: 'Some tips for your next line of code 🧑🏻‍💻',
  themeColor: '#fff',
};
const headComposedTitle = `${meta.title} | ${meta.description}`;

// MARK: - JSX
const App = ({ Component, pageProps }: AppProps<object>): ReactElement => (
  <>
    <Head>
      <title>{headComposedTitle}</title>

      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='title' content={meta.title} />
      <meta name='description' content={meta.description} />
      <meta name='theme-color' content={meta.themeColor} />

      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://mrlemos.dev/' />
      <meta property='og:title' content={meta.title} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:image' content='https://mrlemos.dev/og-image.png' />
    </Head>

    <HeaderWithActions />

    <Component {...pageProps} />

    <Footer />
  </>
);

export default App;
