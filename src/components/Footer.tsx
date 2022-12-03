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

const actions = [
  {
    href: hrefGitHubProfile,
    label: 'GitHub Profile',
  },
  {
    href: hrefLinkedInProfile,
    label: 'LinkedIn Profile',
  },
  {
    href: mailTo,
    label: 'Email me',
  },
];

// MARK: - JSX
const Footer = memo(() => (
  <footer
    className={concat(
      classes.root,
      'w-full px-6 py-8 bg-gray-100 dark:bg-indigo-900 rounded-t-2xl text-black dark:text-white flex flex-col items-center justify-center gap-4'
    )}
  >
    <div className={concat(classes.info, 'flex flex-col items-center justify-center gap-2')}>
      {actions.map(({ href, label }) => (
        <div key={href}>
          <Anchor
            href={href}
            rel='noreferrer'
            target='_blank'
            className='hover:bg-gray-200 hover:text-gray-900 transition-colors hover:font-medium py-1 px-2 rounded-lg'
          >
            <Text>{label}</Text>
          </Anchor>
        </div>
      ))}
    </div>
    <div className={concat(classes.bottom, 'flex justify-center items-center')}>
      <Text as='p' className={concat(classes.copyright, 'text-gray-500 dark:text-gray-200 text-sm')}>
        {new Date().getFullYear()} &copy; Leonardo Lemos, all rights reserved.
      </Text>
    </div>
  </footer>
));

export default Footer;
