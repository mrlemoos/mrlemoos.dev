import { ReactElement } from 'react';

import Anchor from './Anchor';
import Header from './Header';
import HeaderButton from './HeaderButton';
import Emblem from './Emblem';
import Tooltip from './Tooltip';

import concat from '../util/concat';

// MARK: - Constants
const classes = {
  root: 'mrl-header-with-actions',
  button: 'mrl-header-with-actions__action-area__header-button',
  actionArea: 'mrl-header-with-actions__action-area',
};
const GITHUB_URL = 'https://github.com/mrlemoos';

// MARK: - JSX
const HeaderWithActions = (): ReactElement => (
  <Header className={classes.root}>
    <Tooltip side='bottom' axis='end' content={<span className='font-normal text-black'>Return to homepage</span>}>
      <div>
        <Anchor href='/' target='_self' rel='noreferrer'>
          <Emblem height={18} width={18} className='text-emerald-500' />
        </Anchor>
      </div>
    </Tooltip>
    <div className={concat(classes.actionArea, 'hidden sm:flex items-center justify-items-center gap-1')}>
      <Anchor href='/donate' target='_self' rel='noreferrer'>
        <HeaderButton
          className={concat(
            classes.button,
            'mrl-header-with-actions__header-button__donate',
            'bg-amber-400 text-amber-900 hover:bg-amber-200'
          )}
        >
          Donate
        </HeaderButton>
      </Anchor>
      <Anchor href='/' target='_self' rel='noreferrer'>
        <HeaderButton className={concat(classes.button, 'mrl-header-with-actions__header-button__home')}>
          Home
        </HeaderButton>
      </Anchor>
      <Anchor href='/experience-snippets' target='_self' rel='noopener'>
        <HeaderButton className={concat(classes.button, 'mrl-header-with-actions__header-button__xp-snippets')}>
          XP Snippets
        </HeaderButton>
      </Anchor>
      <Anchor href={GITHUB_URL} target='_blank' rel='noreferrer'>
        <HeaderButton className={concat(classes.button, 'mrl-header-with-actions__header-button__github')}>
          GitHub
        </HeaderButton>
      </Anchor>
      <HeaderButton className={concat(classes.button, 'mrl-header-with-actions__header-button__contact')}>
        Contact
      </HeaderButton>
    </div>
  </Header>
);

export default HeaderWithActions;
