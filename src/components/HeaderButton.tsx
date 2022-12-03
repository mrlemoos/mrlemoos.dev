import { HTMLAttributes, PropsWithChildren, memo } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLButtonAttributes = HTMLAttributes<HTMLButtonElement>;
export type HeaderButtonProps = PropsWithChildren<HTMLButtonAttributes>;

// MARK: - Constants
const classes = {
  root: 'mrl-header-button',
};

// MARK: - JSX
const HeaderButton = memo<HeaderButtonProps>(({ children, className, ...props }) => (
  <button
    className={concat(
      classes.root,
      'px-2 py-1 100 bg-indigo-200 text-indigo-900 hover:bg-indigo-300',
      'transition-all rounded-lg text-sm font-regular flex items-center justify-center',
      'dark:bg-white dark:text-black dark:hover:bg-indigo-200',
      className
    )}
    {...props}
  >
    {children}
  </button>
));

HeaderButton.displayName = 'HeaderButton';

export default HeaderButton;
