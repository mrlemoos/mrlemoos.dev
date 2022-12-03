import { NextPage } from 'next';

import Anchor from '../components/Anchor';
import CallToAction from '../components/CallToAction';
import Text from '../components/Text';
import concat from '../util/concat';

const Error404Page: NextPage = () => (
  <main
    className={concat('mt-25 min-h-[90vh] flex flex-col items-center justify-center gap-8 dark:text-white text-center')}
  >
    <Text as='h1' className='font-semibold text-3xl'>
      404
    </Text>
    <Text as='h2' className='font-regular text-xl'>
      Sorry, but we could not find this page.
    </Text>
    <Text as='h3'>I just wonder where you wanted to end up in... 🤔</Text>
    <Anchor href='/' target='_self' rel='noreferrer noopener'>
      <CallToAction className='dark:bg-black bg-white'>Click here to go to home page</CallToAction>
    </Anchor>
  </main>
);

export default Error404Page;
