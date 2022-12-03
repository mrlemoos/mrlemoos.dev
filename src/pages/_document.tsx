import { ReactElement } from 'react';

import { DocumentProps, Head, NextScript, Main, Html } from 'next/document';

const Document = ({ locale = 'en-US' }: DocumentProps): ReactElement => (
  <Html lang={locale}>
    <Head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
      <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' rel='stylesheet' />
    </Head>
    <body className='bg-white dark:bg-gray-900'>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
