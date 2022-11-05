import { HTMLAttributes, memo, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types

type HTMLButtonElementAttributes = HTMLAttributes<HTMLButtonElement>;
type OmittedHTMLButtonElementAttributes = Omit<HTMLButtonElementAttributes, 'children'>;

export interface PrimaryButtonProps extends OmittedHTMLButtonElementAttributes {
  children: ReactNode;
  disabled?: boolean;
}

// MARK: - Constants
const classes = {
  root: 'mrl-button',
};

// MARK: - JSX
const PrimaryButton = memo<PrimaryButtonProps>(({ children, className, disabled, ...attributes }) => (
  <button
    className={concat(
      classes.root,
      'font-medium',
      'outline-none border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors',
      'flex items-center justify-center gap-1 px-4 py-2 rounded-md',
      disabled && 'opacity-50'
    )}
    disabled={disabled}
    {...attributes}
  >
    {children}
  </button>
));

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
