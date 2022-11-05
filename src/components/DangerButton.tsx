import { HTMLAttributes, memo, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types

type HTMLButtonElementAttributes = HTMLAttributes<HTMLButtonElement>;
type OmittedHTMLButtonElementAttributes = Omit<HTMLButtonElementAttributes, 'children'>;

export interface DangerButtonProps extends OmittedHTMLButtonElementAttributes {
  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-button',
};

// MARK: - JSX
const DangerButton = memo<DangerButtonProps>(({ children, className, ...attributes }) => (
  <button
    className={concat(
      classes.root,
      'font-regular',
      'outline-none border-none bg-red-50 text-red-600 hover:bg-red-100 transition-colors',
      'flex items-center justify-center gap-1 px-4 py-2 rounded-md'
    )}
    {...attributes}
  >
    {children}
  </button>
));

DangerButton.displayName = 'DangerButton';

export default DangerButton;
