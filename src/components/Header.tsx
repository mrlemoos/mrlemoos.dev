import { PropsWithChildren, ReactElement, HTMLAttributes } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivAttributes = Omit<HTMLDivAttributes, 'children'>;
export type HeaderProps = PropsWithChildren<OmittedHTMLDivAttributes>;

// MARK: - Constants
const classes = {
  root: 'mrl-header',
};

// MARK: - JSX
const Header = ({ children, className, ...props }: HeaderProps): ReactElement => (
  <div
    className={concat(
      classes.root,
      'fixed inset-0 flex items-center justify-between gap-1 shadow-md p-6 rounded-b-lg bg-white dark:bg-gray-700 h-10 mx-auto',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Header;
