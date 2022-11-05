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
      'py-3 px-5 100 bg-indigo-200 text-indigo-900 hover:bg-indigo-300 transition-all h-8 rounded-lg font-medium flex items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
  </button>
));

HeaderButton.displayName = 'HeaderButton';

export default HeaderButton;
