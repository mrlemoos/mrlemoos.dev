import { HTMLAttributes, memo, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types

type HTMLButtonElementAttributes = HTMLAttributes<HTMLButtonElement>;
type OmittedHTMLButtonElementAttributes = Omit<HTMLButtonElementAttributes, 'children'>;

export interface SuccessButtonProps extends OmittedHTMLButtonElementAttributes {
  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-button',
};

// MARK: - JSX
const SuccessButton = memo<SuccessButtonProps>(({ children, className, ...attributes }) => (
  <button
    className={concat(
      classes.root,
      'font-medium',
      'outline-none border-none bg-green-50 text-green-600 hover:bg-green-100 transition-colors',
      'flex items-center justify-center gap-1 px-4 py-2 rounded-md'
    )}
    {...attributes}
  >
    {children}
  </button>
));

SuccessButton.displayName = 'SuccessButton';

export default SuccessButton;
