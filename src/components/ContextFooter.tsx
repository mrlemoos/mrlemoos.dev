import { HTMLAttributes, ReactElement, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLDivElementAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;

export interface ContextFooterProps extends OmittedHTMLDivElementAttributes {
  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-context-footer',
};

// MARK: - JSX
const ContextFooter = ({ children, className, ...attributes }: ContextFooterProps) => (
  <div className={concat(classes.root, 'flex items-center justify-end gap-1')} {...attributes}>
    {children}
  </div>
);

export default ContextFooter;
