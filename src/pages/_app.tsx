import { ReactElement } from 'react';

import Head from 'next/head';
import { AppProps } from 'next/app';

import HeaderWithActions from '../components/HeaderWithActions';
import MetaSearchEngineOptimization from '../components/MetaSearchEngineOptimization';
import Footer from '../components/Footer';

import '../styles/globals.css';

// MARK: - JSX
const App = ({ Component, pageProps }: AppProps<object>): ReactElement => (
  <>
    <Head>
      <title>mrlemoos - Homepage</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <MetaSearchEngineOptimization />
    </Head>

    <HeaderWithActions />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
