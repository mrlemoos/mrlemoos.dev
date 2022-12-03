import { HTMLAttributes, memo, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types

type HTMLButtonElementAttributes = HTMLAttributes<HTMLButtonElement>;
type OmittedHTMLButtonElementAttributes = Omit<HTMLButtonElementAttributes, 'children'>;

export interface CallToActionProps extends OmittedHTMLButtonElementAttributes {
  children: ReactNode;
  disabled?: boolean;
}

// MARK: - Constants
const classes = {
  root: 'mrl-button',
};

// MARK: - JSX
const CallToAction = memo<CallToActionProps>(({ children, className, disabled, ...attributes }) => (
  <button
    className={concat(
      classes.root,
      'font-medium',
      'outline-none border-none bg-indigo-600 text-white hover:bg-indigo-800 transition-colors dark:bg-gray-900 dark:hover:bg-black',
      'flex items-center justify-center gap-1 px-4 py-2 rounded-md',
      disabled && 'opacity-50'
    )}
    disabled={disabled}
    {...attributes}
  >
    {children}
  </button>
));

CallToAction.displayName = 'CallToAction';

export default CallToAction;
