import { memo } from 'react';

import Text from './Text';

import concat from '../util/concat';
import Anchor from './Anchor';

// MARK: - Constants
const classes = {
  root: 'mrl-footer',
  info: 'mrl-footer__info',
  bottom: 'mrl-footer__bottom',
  copyright: 'mrl-footer__bottom-copyright',
};
const hrefGitHubProfile = 'https://github.com/mrlemoos';
const hrefLinkedInProfile = 'https://linkedin.com/in/leo-lemos';
const mailTo = 'mailto:leo.lemos.ds@icloud.com';

// MARK: - JSX
const Footer = memo(() => (
  <footer
    className={concat(
      classes.root,
      'w-full px-6 py-8 bg-gray-100 dark:bg-indigo-900 rounded-t-2xl text-black dark:text-white flex flex-col items-center justify-center gap-4'
    )}
  >
    <div className={concat(classes.info, 'flex flex-col items-center justify-center gap-2')}>
      <Anchor href={hrefGitHubProfile} rel='noreferrer' target='_blank'>
        <Text>GitHub Profile</Text>
      </Anchor>
      <Anchor href={hrefLinkedInProfile} rel='noreferrer' target='_blank'>
        <Text>LinkedIn Profile</Text>
      </Anchor>
      <Anchor href={mailTo} rel='noreferrer' target='_blank'>
        Email me (leo.lemos.ds@icloud.com)
      </Anchor>
    </div>
    <div className={concat(classes.bottom, 'flex justify-center items-center')}>
      <Text as='p' className={concat(classes.copyright, 'text-gray-500 dark:text-gray-200 text-sm')}>
        {new Date().getFullYear()} &copy; Leonardo Lemos, all rights reserved.
      </Text>
    </div>
  </footer>
));

export default Footer;
